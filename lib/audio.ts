// Play a short beep tone
export function playBeep(frequency = 880, duration = 150): void {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = frequency;
    gain.gain.value = 0.3;
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  } catch {}
}

// Play a 3-2-1 countdown beep pattern
export function playCountdown(): void {
  playBeep(660, 100);
  setTimeout(() => playBeep(660, 100), 400);
  setTimeout(() => playBeep(660, 100), 800);
  setTimeout(() => playBeep(880, 200), 1200);
}

// Vibrate the device (wraps navigator.vibrate with fallback)
export function vibrate(pattern: number | number[] = 100): void {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {}
}
