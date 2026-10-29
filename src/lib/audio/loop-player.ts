/**
 * Phát bản nhạc nền "Huyền Không" (file MP3 160 giây) lặp liền mạch bằng Web Audio.
 * - Tải file khi cần (hoặc tải trước khi trình duyệt rảnh), giải mã thành AudioBuffer rồi phát với loop = true,
 *   nên không có khoảng lặng giữa hai vòng như thẻ <audio loop>.
 * - Nếu bộ giải mã còn giữ đoạn đệm im lặng ở đầu file MP3, đoạn đó được bỏ qua khi tính điểm lặp.
 * - Nếu không tải hoặc không giải mã được file, dùng nhạc tạo trực tiếp (AmbientMusic) làm phương án dự phòng.
 */

import { AmbientMusic, audioSupported } from "./ambient";

export const MUSIC_URL = "/audio/an-menh-nhac-nen.mp3";
export const LOOP_SECONDS = 160;

type AudioContextCtor = typeof AudioContext;

let prefetch: Promise<ArrayBuffer> | null = null;

/** Tải trước file nhạc (không phát). Gọi nhiều lần chỉ tải một lần. */
export function prefetchMusic(): Promise<ArrayBuffer> {
  if (!prefetch) {
    prefetch = fetch(MUSIC_URL).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.arrayBuffer();
    });
    prefetch.catch(() => {
      prefetch = null;
    });
  }
  return prefetch;
}

/** Số mẫu im lặng ở đầu buffer (đệm của bộ mã hóa MP3), nếu có. */
export function leadingPadding(buffer: AudioBuffer): number {
  const limit = Math.min(buffer.length, 4096);
  const chans = Array.from({ length: buffer.numberOfChannels }, (_, c) => buffer.getChannelData(c));
  let i = 0;
  while (i < limit && chans.every((d) => Math.abs(d[i]!) < 1e-4)) i++;
  return i > 64 ? i : 0;
}

export class LoopPlayer {
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private source: AudioBufferSourceNode | null = null;
  private buffer: AudioBuffer | null = null;
  private fallback: AmbientMusic | null = null;
  private stopTimer: number | null = null;
  readonly volume: number;

  constructor(volume = 0.6) {
    this.volume = volume;
  }

  get usingFallback() {
    return this.fallback !== null;
  }

  /** Gọi trong một thao tác của người dùng. Trả về true nếu âm thanh đã chạy. */
  async start(): Promise<boolean> {
    if (!audioSupported()) return false;
    if (this.fallback) return this.fallback.start();
    if (this.stopTimer !== null) {
      window.clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
    if (!this.ctx) {
      const w = window as unknown as { AudioContext?: AudioContextCtor; webkitAudioContext?: AudioContextCtor };
      const Ctor = (w.AudioContext || w.webkitAudioContext)!;
      this.ctx = new Ctor();
      this.gain = this.ctx.createGain();
      this.gain.gain.value = 0;
      this.gain.connect(this.ctx.destination);
    }
    const ctx = this.ctx;
    // Mở khóa âm thanh ngay trong thao tác của người dùng, trước khi chờ tải file.
    const resumed = ctx.resume().catch(() => undefined);
    try {
      if (!this.buffer) {
        const data = await prefetchMusic();
        this.buffer = await ctx.decodeAudioData(data.slice(0));
      }
    } catch {
      // Không có file nhạc: chuyển sang nhạc tạo trực tiếp.
      this.fallback = new AmbientMusic();
      return this.fallback.start();
    }
    await resumed;
    if (ctx.state !== "running") return false;
    if (!this.source) {
      const src = ctx.createBufferSource();
      src.buffer = this.buffer;
      src.loop = true;
      const offset = leadingPadding(this.buffer) / this.buffer.sampleRate;
      src.loopStart = offset;
      src.loopEnd = Math.min(offset + LOOP_SECONDS, this.buffer.duration);
      src.connect(this.gain!);
      src.start(0, offset);
      this.source = src;
    }
    const now = ctx.currentTime;
    const g = this.gain!.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(this.volume, now + 2.5);
    return true;
  }

  /** Tắt hẳn: giảm dần âm lượng rồi tạm ngưng (lần bật sau phát tiếp từ chỗ dừng). */
  stop(): void {
    if (this.fallback) return this.fallback.stop();
    if (!this.ctx || !this.gain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const g = this.gain.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(0, now + 1.2);
    this.stopTimer = window.setTimeout(() => {
      ctx.suspend().catch(() => undefined);
      this.stopTimer = null;
    }, 1300);
  }

  /** Tạm dừng ngay (khi rời tab). */
  pause(): void {
    if (this.fallback) return this.fallback.pause();
    this.ctx?.suspend().catch(() => undefined);
  }
}
