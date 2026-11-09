// Web Audio API Retro Arcade Synthesizer
// 100% Client-Side Chiptune Synthesis, No External Audio Files Required

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
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

/** Check if sounds should play */
function canPlay(soundMuted: boolean): boolean {
  if (soundMuted || typeof window === "undefined") return false;
  return true;
}

/** Coin insert ping sound */
export function playCoinSound(soundMuted: boolean) {
  if (!canPlay(soundMuted)) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(987.77, now); // B5
  osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.35);
}

/** Mechanical crank lever click */
export function playCrankSound(soundMuted: boolean) {
  if (!canPlay(soundMuted)) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Multiple rapid ticks
  [0, 0.04, 0.08, 0.12].forEach((offset, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(280 + idx * 60, now + offset);

    gain.gain.setValueAtTime(0.15, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + offset);
    osc.stop(now + offset + 0.04);
  });
}

/** Shaking globe / tumbling capsules sound */
export function playRattleSound(soundMuted: boolean) {
  if (!canPlay(soundMuted)) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const bufferSize = ctx.sampleRate * 0.4;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(600, now);
  filter.Q.setValueAtTime(3, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.linearRampToValueAtTime(0.2, now + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + 0.4);
}

/** Capsule drop down to chute with bounce */
export function playDropSound(soundMuted: boolean) {
  if (!canPlay(soundMuted)) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.25);
}

/** Capsule cracking & pop open fanfare */
export function playCapsuleOpenSound(soundMuted: boolean) {
  if (!canPlay(soundMuted)) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Pop
  const popOsc = ctx.createOscillator();
  const popGain = ctx.createGain();
  popOsc.type = "sine";
  popOsc.frequency.setValueAtTime(450, now);
  popOsc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
  popGain.gain.setValueAtTime(0.3, now);
  popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  popOsc.connect(popGain);
  popGain.connect(ctx.destination);
  popOsc.start(now);
  popOsc.stop(now + 0.1);

  // Retro mini arpeggio (C5 -> E5 -> G5 -> C6)
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now + 0.06 + idx * 0.06);

    gain.gain.setValueAtTime(0.18, now + 0.06 + idx * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18 + idx * 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + 0.06 + idx * 0.06);
    osc.stop(now + 0.25 + idx * 0.06);
  });
}

/** Arcade correct answer chime */
export function playArcadeCorrectSound(soundMuted: boolean) {
  if (!canPlay(soundMuted)) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(659.25, now); // E5
  osc.frequency.setValueAtTime(880, now + 0.08); // A5

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.25);
}

/** Arcade wrong answer buzz */
export function playArcadeWrongSound(soundMuted: boolean) {
  if (!canPlay(soundMuted)) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.linearRampToValueAtTime(90, now + 0.2);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.22);
}

/** Arcade round win fanfare */
export function playArcadeWinSound(soundMuted: boolean) {
  playCapsuleOpenSound(soundMuted);
}

/** Cute playful Pip Mascot voice boops (3 alternating chirps/squeaks) */
let pipSoundVariant = 0;

export function playPipBoopSound() {
  if (typeof window === "undefined") return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const variant = pipSoundVariant % 3;
  pipSoundVariant++;

  if (variant === 0) {
    // "Peep-up!" — cute rising bubble chirp
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(1550, now + 0.08);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  } else if (variant === 1) {
    // "Bip-bip!" — double cheerful robot squeak
    [0, 0.055].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      const freq = idx === 0 ? 820 : 1380;
      osc.frequency.setValueAtTime(freq, now + offset);

      gain.gain.setValueAtTime(0.12, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.065);
    });
  } else {
    // "Boing-spring!" — bouncy high spring hop
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(1250, now + 0.06);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.12);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }
}
