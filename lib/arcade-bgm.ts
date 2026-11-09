// Web Audio API Retro Arcade Chiptune BGM (Background Music)
// 100% Client-Side Pure Synthesis, Zero External MP3s, Zero Latency

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isPlaying = false;
let stepTimer: ReturnType<typeof setInterval> | null = null;
let currentStep = 0;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

// Cheerful Pentatonic 8-Bit Melody & Bass Frequencies (Hz)
const N = {
  REST: 0,
  C3: 130.81,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
};

// 32-step cheerful upbeat arcade loop (~128 BPM, 16th notes / 8th notes)
const MELODY_STEPS = [
  N.E5, N.REST, N.E5, N.REST, N.REST, N.E5, N.REST, N.C5,
  N.E5, N.REST, N.G5, N.REST, N.REST, N.REST, N.G4, N.REST,
  N.C5, N.REST, N.REST, N.G4, N.REST, N.REST, N.E4, N.REST,
  N.A4, N.REST, N.B4, N.REST, N.A4, N.G4, N.E4, N.G4,
  N.A4, N.REST, N.F5, N.REST, N.A5, N.REST, N.G5, N.REST,
  N.E5, N.REST, N.C5, N.REST, N.D5, N.B4, N.REST, N.REST,
  N.C5, N.REST, N.G4, N.REST, N.E4, N.REST, N.A4, N.REST,
  N.B4, N.REST, N.A4, N.REST, N.G4, N.D5, N.C5, N.REST,
];

// Accompanying bouncing triangle bassline
const BASS_STEPS = [
  N.C3, N.REST, N.G3, N.REST, N.C3, N.REST, N.G3, N.REST,
  N.C3, N.REST, N.G3, N.REST, N.G3, N.REST, N.C3, N.REST,
  N.A3, N.REST, N.E3, N.REST, N.A3, N.REST, N.E3, N.REST,
  N.F3, N.REST, N.C3, N.REST, N.G3, N.REST, N.C3, N.REST,
  N.F3, N.REST, N.C3, N.REST, N.F3, N.REST, N.C3, N.REST,
  N.C3, N.REST, N.G3, N.REST, N.G3, N.REST, N.G3, N.REST,
  N.A3, N.REST, N.E3, N.REST, N.F3, N.REST, N.C3, N.REST,
  N.G3, N.REST, N.G3, N.REST, N.C3, N.REST, N.G3, N.REST,
];

/** Play a single 8-bit note */
function playNote(freq: number, isBass: boolean, time: number, duration: number) {
  if (freq === 0 || !audioCtx || !masterGain) return;

  const osc = audioCtx.createOscillator();
  const noteGain = audioCtx.createGain();

  // Low-pass filter to give a warm, nostalgic chiptune tone
  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";

  if (isBass) {
    osc.type = "triangle";
    filter.frequency.setValueAtTime(450, time);
    noteGain.gain.setValueAtTime(0.045, time);
    noteGain.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.9);
  } else {
    // Pulse/Square melody with soft volume
    osc.type = "square";
    filter.frequency.setValueAtTime(1400, time);
    noteGain.gain.setValueAtTime(0.035, time);
    noteGain.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.85);
  }

  osc.frequency.setValueAtTime(freq, time);

  osc.connect(filter);
  filter.connect(noteGain);
  noteGain.connect(masterGain);

  osc.start(time);
  osc.stop(time + duration);
}

/** Start the arcade background music loop */
export function startBGM() {
  if (isPlaying) return;
  const ctx = getContext();
  if (!ctx) return;

  isPlaying = true;
  currentStep = 0;

  // Master Gain with gentle fade-in
  masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.3);
  masterGain.connect(ctx.destination);

  // 120ms per step (~125 BPM)
  const stepDuration = 0.125;
  const stepMs = stepDuration * 1000;

  stepTimer = setInterval(() => {
    if (!isPlaying || !audioCtx) return;

    const time = audioCtx.currentTime;
    const melodyFreq = MELODY_STEPS[currentStep % MELODY_STEPS.length];
    const bassFreq = BASS_STEPS[currentStep % BASS_STEPS.length];

    if (melodyFreq > 0) {
      playNote(melodyFreq, false, time, stepDuration * 1.4);
    }
    if (bassFreq > 0) {
      playNote(bassFreq, true, time, stepDuration * 1.8);
    }

    currentStep = (currentStep + 1) % MELODY_STEPS.length;
  }, stepMs);
}

/** Stop the arcade background music loop */
export function stopBGM() {
  if (!isPlaying) return;
  isPlaying = false;

  if (stepTimer) {
    clearInterval(stepTimer);
    stepTimer = null;
  }

  if (masterGain && audioCtx) {
    try {
      masterGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      setTimeout(() => {
        masterGain?.disconnect();
        masterGain = null;
      }, 160);
    } catch {
      // ignore
    }
  }
}

/** Check if BGM is currently running */
export function isBGMActive(): boolean {
  return isPlaying;
}
