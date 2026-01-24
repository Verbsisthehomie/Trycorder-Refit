/**
 * Audio Service for LCARS Trycorder
 * Manages Star Trek sound effects and audio playback
 */

export type SoundEffect =
  | 'beep'
  | 'alert'
  | 'phaser'
  | 'transporter'
  | 'shield'
  | 'warp'
  | 'scan'
  | 'error'
  | 'success';

class AudioService {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioContextClass();
    } catch (e) {
      console.warn('AudioContext not supported:', e);
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * Play a sound effect using Web Audio API
   */
  playSound(sound: SoundEffect) {
    if (!this.enabled || !this.audioContext) return;

    try {
      const ctx = this.audioContext;
      const now = ctx.currentTime;

      switch (sound) {
        case 'beep':
          this.playBeep(ctx, now);
          break;
        case 'alert':
          this.playAlert(ctx, now);
          break;
        case 'phaser':
          this.playPhaser(ctx, now);
          break;
        case 'transporter':
          this.playTransporter(ctx, now);
          break;
        case 'shield':
          this.playShield(ctx, now);
          break;
        case 'warp':
          this.playWarp(ctx, now);
          break;
        case 'scan':
          this.playScan(ctx, now);
          break;
        case 'error':
          this.playError(ctx, now);
          break;
        case 'success':
          this.playSuccess(ctx, now);
          break;
      }
    } catch (e) {
      console.error('Error playing sound:', e);
    }
  }

  private playBeep(ctx: AudioContext, now: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  private playAlert(ctx: AudioContext, now: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.setValueAtTime(800, now + 0.1);
    osc.frequency.setValueAtTime(1000, now + 0.2);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  private playPhaser(ctx: AudioContext, now: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.5);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    filter.type = 'highpass';
    filter.frequency.value = 200;

    osc.start(now);
    osc.stop(now + 0.5);
  }

  private playTransporter(ctx: AudioContext, now: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.6);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  private playShield(ctx: AudioContext, now: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  private playWarp(ctx: AudioContext, now: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 1);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1);

    osc.start(now);
    osc.stop(now + 1);
  }

  private playScan(ctx: AudioContext, now: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.4);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  private playError(ctx: AudioContext, now: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(200, now);
    osc.frequency.setValueAtTime(100, now + 0.1);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  private playSuccess(ctx: AudioContext, now: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(600, now);
    osc.frequency.setValueAtTime(800, now + 0.1);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.2);
  }
}

export const audioService = new AudioService();
export default audioService;
