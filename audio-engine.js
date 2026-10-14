const activeAudio = new Set();

export const playSound = (src) => {
  const audio = new Audio(src);
  const releaseAudio = () => {
    activeAudio.delete(audio);
    audio.removeEventListener("ended", releaseAudio);
    audio.removeEventListener("error", releaseAudio);
  };

  audio.addEventListener("ended", releaseAudio);
  audio.addEventListener("error", releaseAudio);
  activeAudio.add(audio);

  const playback = audio.play();

  if (playback) {
    playback.catch(releaseAudio);
  }

  return audio;
};

export const stopAll = () => {
  for (const audio of [...activeAudio]) {
    audio.pause();
    audio.currentTime = 0;
    activeAudio.delete(audio);
  }
};
