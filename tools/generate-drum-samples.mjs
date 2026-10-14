import { mkdirSync, writeFileSync } from "node:fs";

const sampleRate = 22050;
const outputDirectory = new URL("../sounds/", import.meta.url);

const createNoise = (seed) => () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 2147483648 - 1;
};

const clampSample = (sample) => Math.max(-1, Math.min(1, sample));

const createSample = ({ duration, frequencies, noiseLevel, decay, seed }) => {
  const noise = createNoise(seed);
  const length = Math.round(duration * sampleRate);

  return Float32Array.from({ length }, (_, index) => {
    const time = index / sampleRate;
    const envelope = Math.exp(-decay * time);
    const tone = frequencies.reduce(
      (sum, frequency, toneIndex) => sum + Math.sin(2 * Math.PI * frequency * time) / (toneIndex + 1),
      0,
    );

    return clampSample((tone * (1 - noiseLevel) + noise() * noiseLevel) * envelope * 0.65);
  });
};

const toWavBuffer = (samples) => {
  const headerSize = 44;
  const bytesPerSample = 2;
  const buffer = Buffer.alloc(headerSize + samples.length * bytesPerSample);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(buffer.length - 8, 4);
  buffer.write("WAVEfmt ", 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * bytesPerSample, 28);
  buffer.writeUInt16LE(bytesPerSample, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples.length * bytesPerSample, 40);

  samples.forEach((sample, index) => {
    buffer.writeInt16LE(Math.round(sample * 32767), headerSize + index * bytesPerSample);
  });

  return buffer;
};

const sounds = {
  "kick.wav": { duration: 0.55, frequencies: [72, 54], noiseLevel: 0.05, decay: 7, seed: 1 },
  "snare.wav": { duration: 0.38, frequencies: [180], noiseLevel: 0.8, decay: 14, seed: 2 },
  "hi-hat.wav": { duration: 0.2, frequencies: [4200, 6100], noiseLevel: 0.92, decay: 28, seed: 3 },
  "clap.wav": { duration: 0.32, frequencies: [1200], noiseLevel: 0.88, decay: 18, seed: 4 },
  "low-tom.wav": { duration: 0.5, frequencies: [110, 165], noiseLevel: 0.12, decay: 6, seed: 5 },
  "mid-tom.wav": { duration: 0.42, frequencies: [165, 220], noiseLevel: 0.12, decay: 7, seed: 6 },
  "crash.wav": { duration: 0.8, frequencies: [1800, 2600, 3400], noiseLevel: 0.9, decay: 5, seed: 7 },
  "ride.wav": { duration: 0.7, frequencies: [900, 1800, 2700], noiseLevel: 0.55, decay: 5, seed: 8 },
};

mkdirSync(outputDirectory, { recursive: true });

for (const [filename, settings] of Object.entries(sounds)) {
  writeFileSync(new URL(filename, outputDirectory), toWavBuffer(createSample(settings)));
}
