class SoundManager {
  private enabled = true;
  private ctx: AudioContext | null = null;

  isEnabled(): boolean {
    return this.enabled;
  }

  setEnabled(val: boolean): void {
    this.enabled = val;
  }

  private playTone(frequency: number, duration: number, delay: number, volume: number): void {
    if (!this.enabled || typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    try {
      if (!this.ctx) this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = this.ctx.currentTime + delay;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + duration + 0.02);
    } catch {
      // Web Audio is optional
    }
  }

  play(kind: 'correct' | 'wrong' | 'complete'): void {
    if (kind === 'wrong') {
      this.playTone(190, 0.16, 0, 0.07);
    } else if (kind === 'correct') {
      this.playTone(620, 0.12, 0, 0.055);
      this.playTone(820, 0.16, 0.1, 0.055);
    } else if (kind === 'complete') {
      this.playTone(523, 0.16, 0, 0.05);
      this.playTone(659, 0.16, 0.14, 0.05);
      this.playTone(784, 0.28, 0.28, 0.06);
    }
  }
}

export const soundManager = new SoundManager();
