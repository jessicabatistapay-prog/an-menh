/**
 * Nhạc nền tạo trực tiếp bằng Web Audio API – không dùng file thu âm.
 *
 * - Thang âm ngũ cung (năm nốt, quãng như "hò – xự – xang – xê – cống"), gốc Sol.
 * - Tiếng gảy mô phỏng dây đàn: sóng tam giác + bội âm, tắt dần, đôi khi "nhấn" (luyến lên một cung)
 *   hoặc "rung" nhẹ như kỹ thuật đàn tranh.
 * - Một nốt nền trầm rất nhỏ, thở chậm; vang (reverb) tạo bằng xung ngẫu nhiên tắt dần.
 * - Giai điệu đi theo bước ngẫu nhiên trên thang âm, có câu nghỉ, nên không lặp lại.
 */

const BASE_HZ = 196; // Sol 3
const SCALE = [0, 2, 5, 7, 9]; // quãng ngũ cung (nửa cung)
const NOTE_COUNT = 11; // khoảng hơn hai quãng tám

function noteHz(index: number) {
  const octave = Math.floor(index / SCALE.length);
  const step = SCALE[index % SCALE.length]!;
  return BASE_HZ * 2 ** octave * 2 ** (step / 12);
}

type AudioContextCtor = typeof AudioContext;

export function audioSupported(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as unknown as { AudioContext?: AudioContextCtor; webkitAudioContext?: AudioContextCtor };
  return Boolean(w.AudioContext || w.webkitAudioContext);
}

export class AmbientMusic {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private dry: GainNode | null = null;
  private reverbIn: AudioNode | null = null;
  private timer: number | null = null;
  private nextTime = 0;
  private index = 5;
  private phraseLeft = 0;
  private stopTimeout: number | null = null;
  readonly volume: number;

  constructor(volume = 0.22) {
    this.volume = volume;
  }

  get running() {
    return this.ctx?.state === "running" && this.timer !== null;
  }

  /** Phải được gọi trong một thao tác của người dùng (chạm, bấm, nhấn phím). */
  async start(): Promise<boolean> {
    if (!audioSupported()) return false;
    if (this.stopTimeout !== null) {
      window.clearTimeout(this.stopTimeout);
      this.stopTimeout = null;
    }
    if (!this.ctx) this.build();
    const ctx = this.ctx!;
    try {
      await ctx.resume();
    } catch {
      return false;
    }
    if (ctx.state !== "running") return false;
    const now = ctx.currentTime;
    this.master!.gain.cancelScheduledValues(now);
    this.master!.gain.setValueAtTime(this.master!.gain.value, now);
    this.master!.gain.linearRampToValueAtTime(this.volume, now + 3);
    if (this.timer === null) {
      this.nextTime = now + 0.4;
      this.timer = window.setInterval(() => this.schedule(), 120);
    }
    return true;
  }

  stop(): void {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + 1.2);
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    this.stopTimeout = window.setTimeout(() => {
      ctx.suspend().catch(() => undefined);
      this.stopTimeout = null;
    }, 1400);
  }

  /** Tạm dừng âm thanh ngay (ví dụ khi chuyển sang tab khác) mà không đổi lựa chọn bật/tắt. */
  pause(): void {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    this.ctx?.suspend().catch(() => undefined);
  }

  private build() {
    const w = window as unknown as { AudioContext?: AudioContextCtor; webkitAudioContext?: AudioContextCtor };
    const Ctor = (w.AudioContext || w.webkitAudioContext)!;
    const ctx = new Ctor();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;
    master.connect(comp).connect(ctx.destination);
    this.master = master;

    const dry = ctx.createGain();
    dry.gain.value = 0.8;
    dry.connect(master);
    this.dry = dry;

    const reverb = ctx.createConvolver();
    reverb.buffer = this.impulse(ctx, 3.6);
    const wet = ctx.createGain();
    wet.gain.value = 0.55;
    reverb.connect(wet).connect(master);
    this.reverbIn = reverb;

    // Nốt nền trầm: Sol 2 và Rê 3, âm lượng thở chậm.
    const drone = ctx.createGain();
    drone.gain.value = 0.05;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.06;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.025;
    lfo.connect(lfoGain).connect(drone.gain);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 600;
    for (const f of [BASE_HZ / 2, (BASE_HZ / 2) * 1.5]) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      o.connect(lp);
      o.start();
    }
    lp.connect(drone);
    drone.connect(dry);
    drone.connect(reverb);
    lfo.start();
  }

  private impulse(ctx: AudioContext, seconds: number) {
    const rate = ctx.sampleRate;
    const length = Math.floor(rate * seconds);
    const buf = ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
    }
    return buf;
  }

  private schedule() {
    const ctx = this.ctx;
    if (!ctx) return;
    while (this.nextTime < ctx.currentTime + 0.6) {
      this.playStep(this.nextTime);
    }
  }

  private playStep(t: number) {
    if (this.phraseLeft <= 0) {
      this.phraseLeft = 4 + Math.floor(Math.random() * 5);
    }
    // Bước đi trên thang âm: phần lớn là liền bậc, đôi khi nhảy quãng.
    const r = Math.random();
    const move = r < 0.35 ? -1 : r < 0.7 ? 1 : r < 0.82 ? -2 : r < 0.94 ? 2 : 0;
    this.index = Math.max(2, Math.min(NOTE_COUNT - 1, this.index + move));
    this.phraseLeft--;

    const endOfPhrase = this.phraseLeft === 0;
    const hz = noteHz(endOfPhrase ? Math.max(2, this.index - (this.index % SCALE.length)) : this.index);
    this.pluck(t, hz, endOfPhrase ? 0.32 : 0.22 + Math.random() * 0.08, endOfPhrase ? 4.5 : 2.6);
    if (endOfPhrase && Math.random() < 0.6) this.pluck(t + 0.02, hz / 2, 0.12, 4.5);

    const gaps = [0.5, 0.75, 0.75, 1, 1, 1.5];
    this.nextTime = t + (endOfPhrase ? 2.6 + Math.random() * 2 : gaps[Math.floor(Math.random() * gaps.length)]!);
  }

  private pluck(t: number, hz: number, velocity: number, duration: number) {
    const ctx = this.ctx!;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(velocity, t + 0.006);
    env.gain.exponentialRampToValueAtTime(0.0006, t + duration);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(3200, t);
    filter.frequency.exponentialRampToValueAtTime(900, t + duration * 0.7);

    const body = ctx.createOscillator();
    body.type = "triangle";
    const overtone = ctx.createOscillator();
    overtone.type = "sine";
    const overtoneGain = ctx.createGain();
    overtoneGain.gain.value = 0.25;

    body.frequency.setValueAtTime(hz, t);
    overtone.frequency.setValueAtTime(hz * 2, t);

    const technique = Math.random();
    if (technique < 0.18) {
      // Nhấn: luyến lên một cung (hai nửa cung) rồi giữ.
      const up = hz * 2 ** (2 / 12);
      body.frequency.setValueAtTime(hz, t + 0.25);
      body.frequency.linearRampToValueAtTime(up, t + 0.55);
      overtone.frequency.setValueAtTime(hz * 2, t + 0.25);
      overtone.frequency.linearRampToValueAtTime(up * 2, t + 0.55);
    } else if (technique < 0.45) {
      // Rung: vibrato nhẹ sau khi gảy.
      const vib = ctx.createOscillator();
      vib.frequency.value = 5.2;
      const depth = ctx.createGain();
      depth.gain.setValueAtTime(0, t);
      depth.gain.linearRampToValueAtTime(14, t + 0.5);
      vib.connect(depth);
      depth.connect(body.detune);
      depth.connect(overtone.detune);
      vib.start(t);
      vib.stop(t + duration + 0.1);
    }

    body.connect(filter);
    overtone.connect(overtoneGain).connect(filter);
    filter.connect(env);
    env.connect(this.dry!);
    env.connect(this.reverbIn!);
    body.start(t);
    overtone.start(t);
    body.stop(t + duration + 0.1);
    overtone.stop(t + duration + 0.1);
  }
}
