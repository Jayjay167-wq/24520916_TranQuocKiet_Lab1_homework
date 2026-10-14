import { playSound, stopAll } from "./audio-engine.js";
import { createBeatRecorder } from "./beat-recorder.js";

const padByKey = new Map(
  [...document.querySelectorAll(".drum-pad")].map((pad) => [pad.dataset.key, pad]),
);
const activeTimers = new WeakMap();
const editableSelector = "input, textarea, select, [contenteditable='true']";
const recordButton = document.querySelector("#record-button");
const stopButton = document.querySelector("#stop-button");
const playbackButton = document.querySelector("#playback-button");
const recorderStatus = document.querySelector("#recorder-status");

const isEditableTarget = (target) => target instanceof Element
  && Boolean(target.closest(editableSelector));

const showPadFeedback = (pad) => {
  const existingTimer = activeTimers.get(pad);

  if (existingTimer) {
    window.clearTimeout(existingTimer);
  }

  pad.classList.add("active");
  activeTimers.set(pad, window.setTimeout(() => {
    pad.classList.remove("active");
    activeTimers.delete(pad);
  }, 150));
};

const recorder = createBeatRecorder({
  onPlaybackEvent: ({ key }) => {
    const pad = padByKey.get(key);

    if (pad) {
      showPadFeedback(pad);
    }
  },
  onPlaybackStateChange: () => updateRecorderControls(),
});

const updateRecorderControls = () => {
  const eventCount = recorder.getEventCount();

  recordButton.disabled = recorder.isRecording() || recorder.isPlaying();
  recordButton.setAttribute("aria-pressed", String(recorder.isRecording()));
  playbackButton.disabled = recorder.isRecording() || recorder.isPlaying() || eventCount === 0;
  recorderStatus.textContent = recorder.isRecording()
    ? "Recording drum triggers."
    : recorder.isPlaying()
      ? "Playing back the recorded beat."
      : eventCount === 0
        ? "Ready to record."
        : `${eventCount} drum trigger${eventCount === 1 ? "" : "s"} recorded.`;
};

const triggerPad = (pad) => {
  const { key, sound } = pad.dataset;

  if (!sound) {
    return;
  }

  playSound(sound);
  recorder.recordTrigger({ key, sound });
  showPadFeedback(pad);
  updateRecorderControls();
};

for (const pad of padByKey.values()) {
  pad.addEventListener("click", () => triggerPad(pad));
}

document.addEventListener("keydown", (event) => {
  if (event.repeat || isEditableTarget(event.target)) {
    return;
  }

  const pad = padByKey.get(event.key.toLowerCase());

  if (pad) {
    triggerPad(pad);
  }
});

recordButton.addEventListener("click", () => {
  recorder.startRecording();
  updateRecorderControls();
});

stopButton.addEventListener("click", () => {
  recorder.stopRecording();
  recorder.stopPlayback();
  stopAll();
  updateRecorderControls();
});

playbackButton.addEventListener("click", () => {
  recorder.playback();
  updateRecorderControls();
});

updateRecorderControls();
