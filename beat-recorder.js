import { playSound } from "./audio-engine.js";

export const createBeatRecorder = ({ onPlaybackEvent, onPlaybackStateChange } = {}) => {
  let recording = false;
  let recordingStartedAt = 0;
  let recordedEvents = [];
  let playing = false;
  const playbackTimers = new Set();

  const notifyPlaybackState = () => {
    onPlaybackStateChange?.(playing);
  };

  const stopPlayback = () => {
    for (const timer of playbackTimers) {
      window.clearTimeout(timer);
    }

    playbackTimers.clear();

    if (playing) {
      playing = false;
      notifyPlaybackState();
    }
  };

  const startRecording = () => {
    stopPlayback();
    recordedEvents = [];
    recordingStartedAt = performance.now();
    recording = true;
  };

  const stopRecording = () => {
    recording = false;
  };

  const recordTrigger = ({ key, sound }) => {
    if (!recording) {
      return;
    }

    recordedEvents.push({
      key,
      sound,
      timestamp: performance.now() - recordingStartedAt,
    });
  };

  const playback = () => {
    if (playing || recordedEvents.length === 0) {
      return false;
    }

    recording = false;
    playing = true;
    notifyPlaybackState();
    let remainingEvents = recordedEvents.length;

    for (const event of recordedEvents) {
      const timer = window.setTimeout(() => {
        playbackTimers.delete(timer);
        playSound(event.sound);
        onPlaybackEvent?.(event);
        remainingEvents -= 1;

        if (remainingEvents === 0) {
          playing = false;
          notifyPlaybackState();
        }
      }, event.timestamp);

      playbackTimers.add(timer);
    }

    return true;
  };

  return {
    getEventCount: () => recordedEvents.length,
    getRecording: () => recordedEvents.map((event) => ({ ...event })),
    isPlaying: () => playing,
    isRecording: () => recording,
    playback,
    recordTrigger,
    startRecording,
    stopPlayback,
    stopRecording,
  };
};
