#!/usr/bin/env python3
"""
Soạn và render nhạc nền "Huyền Không" cho An Mệnh – không dùng mẫu âm thanh có sẵn.

- Thang âm: ngũ cung Rê thứ (Rê Fa Sol La Đô) thêm Mi giáng tạo màu huyền bí, nhịp 60.
- Bố cục 40 ô nhịp (160 giây): Dạo đầu – Đoạn A – Đoạn B – Đoạn A' – Kết, rồi lặp lại.
- Nhạc cụ: đàn tranh (tổng hợp dây gảy Karplus–Strong, có nhấn và rung), pad dây trầm,
  chuông (FM), trống trầm, cồng, gió và tiếng hút ngược trước mỗi đoạn.
- Vòng lặp liền mạch: mọi sự kiện và phần ngân vang (reverb) được cộng vòng (circular) trên đúng
  độ dài 160 giây; tần số của lớp pad được làm tròn để tuần hoàn đúng chu kỳ.

Chạy:  python3 scripts/music/render.py public/audio/an-menh-nhac-nen.mp3
Cần: numpy, scipy, ffmpeg (libmp3lame).
"""

import os
import subprocess
import sys
import tempfile
import wave

import numpy as np
from scipy.signal import lfilter

SR = 44100
BPM = 60.0
BEAT = 60.0 / BPM
BAR = 4 * BEAT
BARS = 40
L_SEC = BARS * BAR
L = int(round(L_SEC * SR))
rng = np.random.default_rng(20261029)


def midi_hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


NOTE = {"C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}


def n(name):
    """'D4' -> số MIDI."""
    pitch, octave = name[:-1], int(name[-1])
    return 12 * (octave + 1) + NOTE[pitch]


def t_of(bar, beat=0.0):
    """Thời điểm (giây) của ô nhịp `bar` (đánh số từ 1) và phách `beat`."""
    return ((bar - 1) * 4 + beat) * BEAT


# ---------------------------------------------------------------------------
# Bộ đệm vòng
# ---------------------------------------------------------------------------
class Bus:
    def __init__(self):
        self.l = np.zeros(L)
        self.r = np.zeros(L)

    def add(self, start_sec, sig, pan=0.0, gain=1.0):
        """Cộng tín hiệu mono vào bus tại thời điểm start (giây), cộng vòng khi vượt cuối."""
        if sig.ndim != 1:
            raise ValueError
        s = int(round(start_sec * SR)) % L
        gl = gain * np.cos((pan + 1) * np.pi / 4)
        gr = gain * np.sin((pan + 1) * np.pi / 4)
        if len(sig) > L:
            idx = (np.arange(len(sig)) + s) % L
            np.add.at(self.l, idx, sig * gl)
            np.add.at(self.r, idx, sig * gr)
            return
        end = s + len(sig)
        if end <= L:
            self.l[s:end] += sig * gl
            self.r[s:end] += sig * gr
        else:
            k = L - s
            self.l[s:] += sig[:k] * gl
            self.r[s:] += sig[:k] * gr
            self.l[: end - L] += sig[k:] * gl
            self.r[: end - L] += sig[k:] * gr


def env_adsr(length, a, d, s_level, release_from=None, release=0.3):
    t = np.arange(length) / SR
    e = np.ones(length)
    e = np.where(t < a, t / max(a, 1e-6), e)
    dec = (t >= a) & (t < a + d)
    e = np.where(dec, 1 - (1 - s_level) * (t - a) / max(d, 1e-6), e)
    e = np.where(t >= a + d, s_level, e)
    if release_from is not None:
        rel = t >= release_from
        e = np.where(rel, e * np.clip(1 - (t - release_from) / release, 0, 1), e)
    return e


# ---------------------------------------------------------------------------
# Đàn tranh: Karplus–Strong + đổi tốc độ đọc để chỉnh đúng cao độ, nhấn, rung
# ---------------------------------------------------------------------------
def ks_string(freq, dur, brightness=0.6, rho=0.9965):
    N = int(SR / freq)
    total = int(dur * SR) + 2 * N + 10
    burst = rng.uniform(-1, 1, N)
    # Làm mềm xung gảy
    alpha = 0.25 + 0.6 * (1 - brightness)
    burst = lfilter([1 - alpha], [1, -alpha], burst)
    # Vị trí gảy gần đầu dây -> sáng hơn
    M = max(1, int(N * 0.18))
    pluck = burst.copy()
    pluck[M:] -= burst[:-M]
    x = np.zeros(total)
    x[:N] = pluck
    a = np.zeros(N + 2)
    a[0] = 1.0
    a[N] = -0.5 * rho
    a[N + 1] = -0.5 * rho
    y = lfilter([1.0], a, x)
    actual = SR / (N + 0.5)
    return y, actual


def warp(y, base_ratio, ratio_curve):
    """Đọc lại y với tốc độ thay đổi theo thời gian (cao độ ~ tốc độ đọc)."""
    pos = np.cumsum(base_ratio * ratio_curve)
    pos = pos[pos < len(y) - 2]
    i = pos.astype(int)
    frac = pos - i
    return y[i] * (1 - frac) + y[i + 1] * frac


def dan_tranh(midi, dur, tech=None, vel=0.8):
    f = midi_hz(midi)
    ring = min(dur + 1.8, 5.5)
    y, actual = ks_string(f, ring + 0.5, brightness=0.55 + 0.3 * vel)
    y2, actual2 = ks_string(f * 2 ** (3 / 1200), ring + 0.5, brightness=0.5)
    length = int(ring * SR)
    t = np.arange(length) / SR
    curve = np.ones(length)
    if tech == "nhan":  # gảy nốt thấp hơn một cung rồi nhấn lên
        start, glide = 0.12, 0.28
        semis = np.where(t < start, -2.0, np.where(t < start + glide, -2.0 + 2.0 * (t - start) / glide, 0.0))
        curve = 2 ** (semis / 12)
    elif tech == "luyen":  # luyến xuống nửa cung ở cuối nốt
        start = max(0.4, dur * 0.6)
        semis = np.where(t < start, 0.0, np.clip(-(t - start) / 0.35, -1.0, 0.0))
        curve = 2 ** (semis / 12)
    elif tech == "rung":
        depth = np.clip((t - 0.25) / 0.5, 0, 1) * 0.011
        curve = 1 + depth * np.sin(2 * np.pi * 5.0 * t)
    a = warp(y, f / actual, curve)
    b = warp(y2, f * 2 ** (3 / 1200) / actual2, curve)
    m = min(len(a), len(b), length)
    sig = a[:m] + 0.35 * b[:m]
    # Thân đàn: tăng nhẹ dải trầm ấm, giảm chói
    sig = lfilter([0.6, 0.4], [1.0], sig)
    e = np.exp(-t[:m] / (1.6 + 0.4 * vel))
    rel_start = dur + 1.2
    e *= np.clip(1 - (t[:m] - rel_start) / 0.6, 0, 1)
    sig = sig * e
    peak = np.max(np.abs(sig)) + 1e-9
    return sig / peak * vel


# ---------------------------------------------------------------------------
# Chuông FM, cồng, trống, gió
# ---------------------------------------------------------------------------
def bell(freq, dur=3.5, vel=0.4):
    length = int(dur * SR)
    t = np.arange(length) / SR
    index = 2.2 * np.exp(-t / 0.7)
    mod = np.sin(2 * np.pi * freq * 3.5 * t)
    sig = np.sin(2 * np.pi * freq * t + index * mod)
    sig += 0.25 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t / 0.9)
    e = np.minimum(t / 0.003, 1) * np.exp(-t / 1.6)
    return sig * e * vel


def gong(f0, dur=14.0, vel=0.9):
    length = int(dur * SR)
    t = np.arange(length) / SR
    ratios = [1.0, 1.52, 2.03, 2.48, 2.97, 3.55, 4.12, 5.06]
    amps = [1.0, 0.7, 0.55, 0.42, 0.33, 0.24, 0.18, 0.1]
    decays = [11.0, 9.0, 7.0, 6.0, 5.0, 4.0, 3.2, 2.5]
    sweep = 1 - 0.006 * (1 - np.exp(-t / 2.5))
    sig = np.zeros(length)
    for r, a, d in zip(ratios, amps, decays):
        ph = 2 * np.pi * np.cumsum(f0 * r * sweep) / SR
        beat = 1 + 0.35 * np.sin(2 * np.pi * (0.6 + 0.3 * r) * t)
        sig += a * np.sin(ph + rng.uniform(0, 6.28)) * np.exp(-t / d) * beat
    swell = np.minimum(t / 0.06, 1)
    strike = rng.normal(0, 1, length) * np.exp(-t / 0.03)
    strike = lfilter([0.08], [1, -0.92], strike)
    return (sig * swell + strike * 2) * vel / 4


def drum(vel=1.0, low=True):
    dur = 0.9 if low else 0.5
    length = int(dur * SR)
    t = np.arange(length) / SR
    f_start, f_end = (115.0, 52.0) if low else (180.0, 95.0)
    f = f_end + (f_start - f_end) * np.exp(-t / 0.045)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / (0.42 if low else 0.18))
    slap = rng.normal(0, 1, length) * np.exp(-t / 0.012)
    slap = lfilter([0.3], [1, -0.7], slap)
    return (body + 0.25 * slap) * vel


def periodic_noise_band(centers, widths, gains):
    """Tiếng ồn lọc dải trong miền tần số – tuần hoàn đúng chu kỳ L."""
    spec = np.fft.rfft(rng.normal(0, 1, L))
    freqs = np.fft.rfftfreq(L, 1 / SR)
    shape = np.zeros_like(freqs)
    for c, w, g in zip(centers, widths, gains):
        shape += g * np.exp(-0.5 * ((freqs - c) / w) ** 2)
    out = np.fft.irfft(spec * shape, n=L)
    return out / (np.max(np.abs(out)) + 1e-9)


def periodic_lfo(t, comps):
    """Tổng các sóng sin có chu kỳ chia hết cho L (tuần hoàn)."""
    out = np.zeros_like(t)
    for k, a, ph in comps:
        out += a * np.sin(2 * np.pi * k * t / L_SEC + ph)
    return out


# ---------------------------------------------------------------------------
# Bản nhạc
# ---------------------------------------------------------------------------
CHORDS = [  # (ô nhịp bắt đầu, số ô, các nốt)
    (1, 12, ["D2", "A2", "D3", "F3"]),
    (13, 2, ["Bb1", "F2", "Bb2", "D3"]),
    (15, 2, ["C2", "G2", "C3", "D3"]),
    (17, 4, ["D2", "A2", "D3", "F3"]),
    (21, 2, ["Eb2", "Bb2", "Eb3", "G3"]),
    (23, 2, ["D2", "A2", "D3", "E3"]),
    (25, 4, ["Bb1", "F2", "Bb2", "D3"]),
    (29, 2, ["G1", "D2", "G2", "Bb2"]),
    (31, 2, ["A1", "E2", "A2", "D3"]),
    (33, 4, ["D2", "A2", "D3", "F3"]),
    (37, 2, ["Bb1", "F2", "Bb2", "D3"]),
    (39, 2, ["D2", "A2", "D3", "F3"]),
]

# Giai điệu đàn tranh: (ô nhịp, phách, nốt, độ dài theo phách, kỹ thuật, lực)
MELODY = [
    # Dạo đầu
    (5, 0, "A4", 2, "rung", 0.55), (6, 0, "D5", 1, None, 0.6), (6, 1, "C5", 1, None, 0.5), (6, 2, "A4", 2, "luyen", 0.55),
    (7, 0, "G4", 2, None, 0.55), (7, 2, "F4", 2, "rung", 0.5), (8, 0, "D4", 4, "rung", 0.6),
    # Đoạn A
    (9, 0, "A4", 1.5, None, 0.75), (9, 1.5, "C5", 0.5, None, 0.6), (9, 2, "D5", 2, "nhan", 0.8),
    (10, 0, "C5", 1, None, 0.7), (10, 1, "A4", 1, None, 0.65), (10, 2, "G4", 2, "rung", 0.7),
    (11, 0, "F4", 1, None, 0.7), (11, 1, "G4", 0.5, None, 0.55), (11, 1.5, "A4", 0.5, None, 0.55), (11, 2, "C5", 1, None, 0.7), (11, 3, "A4", 1, None, 0.6),
    (12, 0, "D4", 4, "rung", 0.75),
    (13, 0, "F4", 1, None, 0.7), (13, 1, "G4", 1, None, 0.65), (13, 2, "A4", 2, "nhan", 0.75),
    (14, 0, "G4", 1, None, 0.65), (14, 1, "F4", 1, None, 0.6), (14, 2, "D4", 2, "rung", 0.7),
    (15, 0, "C5", 1.5, None, 0.75), (15, 1.5, "D5", 0.5, None, 0.6), (15, 2, "Eb5", 1, "luyen", 0.75), (15, 3, "D5", 1, None, 0.65),
    (16, 0, "C5", 1, None, 0.7), (16, 1, "A4", 1, None, 0.6), (16, 2, "G4", 2, "rung", 0.7),
    # Đoạn B – lên cao, huyền bí hơn
    (17, 0, "D5", 2, "rung", 0.85), (17, 2, "F5", 1, None, 0.75), (17, 3, "Eb5", 1, "luyen", 0.7),
    (18, 0, "D5", 1, None, 0.7), (18, 1, "C5", 1, None, 0.65), (18, 2, "A4", 2, "nhan", 0.75),
    (19, 0, "G4", 0.5, None, 0.55), (19, 0.5, "A4", 0.5, None, 0.55), (19, 1, "C5", 1, None, 0.7), (19, 2, "D5", 1, None, 0.75), (19, 3, "F5", 1, None, 0.75),
    (20, 0, "G5", 3, "rung", 0.85), (20, 3, "F5", 1, "luyen", 0.65),
    (21, 0, "Eb5", 2, "rung", 0.8), (21, 2, "D5", 1, None, 0.7), (21, 3, "Bb4", 1, None, 0.65),
    (22, 0, "G4", 2, "nhan", 0.75), (22, 2, "Eb4", 2, "rung", 0.7),
    (23, 0, "D4", 1, None, 0.65), (23, 1, "F4", 1, None, 0.65), (23, 2, "G4", 1, None, 0.7), (23, 3, "A4", 1, None, 0.7),
    (24, 0, "D5", 4, "nhan", 0.85),
    # Đoạn A'
    (25, 0, "F5", 1.5, None, 0.75), (25, 1.5, "D5", 0.5, None, 0.6), (25, 2, "C5", 2, "rung", 0.75),
    (26, 0, "A4", 1, None, 0.65), (26, 1, "C5", 1, None, 0.65), (26, 2, "D5", 2, "nhan", 0.75),
    (27, 0, "G4", 1, None, 0.65), (27, 1, "Bb4", 1, None, 0.65), (27, 2, "D5", 1, None, 0.7), (27, 3, "C5", 1, None, 0.65),
    (28, 0, "Bb4", 4, "rung", 0.75),
    (29, 0, "G4", 1, None, 0.65), (29, 1, "A4", 0.5, None, 0.55), (29, 1.5, "Bb4", 0.5, None, 0.55), (29, 2, "D5", 2, "nhan", 0.75),
    (30, 0, "C5", 1, None, 0.65), (30, 1, "Bb4", 1, None, 0.6), (30, 2, "G4", 2, "rung", 0.7),
    (31, 0, "A4", 2, "rung", 0.75), (31, 2, "D5", 1, None, 0.7), (31, 3, "E5", 1, "luyen", 0.7),
    (32, 0, "A4", 4, "rung", 0.75),
    # Kết
    (34, 0, "D5", 2, "rung", 0.6), (34, 2, "A4", 2, None, 0.5),
    (36, 0, "F4", 1, None, 0.5), (36, 1, "G4", 1, None, 0.5), (36, 2, "A4", 2, "rung", 0.55),
    (38, 0, "C5", 2, "nhan", 0.5), (38, 2, "A4", 2, None, 0.45),
    (39, 2, "D4", 6, "rung", 0.55),
]

GONGS = [(1, 0, 73.42, 0.9), (17, 0, 55.0, 1.0), (25, 0, 146.83, 0.45), (33, 0, 73.42, 0.85)]
SWELLS = [9, 17, 25, 33]  # tiếng hút ngược trước các đoạn


def section_intensity(bar):
    if bar <= 8:
        return 0.55
    if bar <= 16:
        return 0.8
    if bar <= 24:
        return 1.0
    if bar <= 32:
        return 0.85
    return 0.6


def render():
    dry = Bus()
    wet = Bus()  # gửi vào reverb
    t = np.arange(L) / SR

    # --- Pad: cộng sóng hài, tần số làm tròn để tuần hoàn ---
    print("pad…", flush=True)
    padL = np.zeros(L)
    padR = np.zeros(L)
    bright = 1.6 + 0.8 * (0.5 + 0.5 * periodic_lfo(t, [(2, 1.0, 0.0)]))  # độ sáng thay đổi chậm
    xf = 2.0  # giây chuyển hợp âm
    for start_bar, nbars, notes in CHORDS:
        s = t_of(start_bar)
        e = t_of(start_bar + nbars)
        # cửa sổ có chuyển mượt, cộng vòng
        win_start = s - xf / 2
        win_end = e + xf / 2
        idx = (np.arange(int((win_end - win_start) * SR)) + int(win_start * SR)) % L
        tt = idx / SR
        local = np.arange(len(idx)) / SR
        g = np.clip(local / xf, 0, 1) * np.clip((len(idx) / SR - local) / xf, 0, 1)
        g = np.sin(g * np.pi / 2) ** 2
        g *= section_intensity(start_bar)
        bseg = bright[idx]
        for ni, nm in enumerate(notes):
            f = midi_hz(n(nm))
            level = [0.5, 0.35, 0.3, 0.22][ni]
            for det, pl, pr in [(-7, 0.85, 0.3), (0, 0.6, 0.6), (7, 0.3, 0.85)]:
                fd = f * 2 ** (det / 1200)
                for h in range(1, 9):
                    fh = round(fd * h * L_SEC) / L_SEC  # tuần hoàn
                    if fh > 5000:
                        break
                    w = np.exp(-(h - 1) / bseg) / h ** 0.6
                    sig = np.sin(2 * np.pi * fh * tt) * w * g * level
                    padL[idx] += sig * pl
                    padR[idx] += sig * pr
    pad_gain = 0.06
    dry.l += padL * pad_gain * 0.6
    dry.r += padR * pad_gain * 0.6
    wet.l += padL * pad_gain * 0.5
    wet.r += padR * pad_gain * 0.5

    # --- Gió ---
    print("gió…", flush=True)
    wind = periodic_noise_band([450, 1300, 2600], [220, 500, 900], [1.0, 0.6, 0.25])
    wind_env = 0.5 + 0.35 * periodic_lfo(t, [(3, 1.0, 0.3), (7, 0.4, 1.1), (11, 0.2, 2.0)])
    swell_bar = np.array([section_intensity(int(x // BAR) + 1) for x in t[:: SR]])
    swell = np.interp(t, np.arange(len(swell_bar)), 1.3 - swell_bar)
    wind_sig = wind * wind_env * swell * 0.05
    wind2 = np.roll(wind, int(0.37 * SR))
    dry.l += wind_sig
    dry.r += wind2 * wind_env * swell * 0.05
    wet.l += wind_sig * 0.6
    wet.r += wind2 * wind_env * swell * 0.03

    # --- Đàn tranh ---
    print("đàn tranh…", flush=True)
    for bar, beat, nm, dur, tech, vel in MELODY:
        sig = dan_tranh(n(nm), dur * BEAT, tech, vel)
        st = t_of(bar, beat)
        dry.add(st, sig, pan=-0.18, gain=0.32)
        wet.add(st, sig, pan=-0.05, gain=0.16)
        # tiếng vọng nhẹ đàn đáp (canon) ở quãng tám dưới trong đoạn B
        if 17 <= bar <= 24 and dur >= 2:
            echo = dan_tranh(n(nm) - 12, dur * BEAT, None, vel * 0.5)
            dry.add(st + 1.5 * BEAT, echo, pan=0.35, gain=0.12)
            wet.add(st + 1.5 * BEAT, echo, pan=0.35, gain=0.12)

    # --- Chuông ---
    print("chuông…", flush=True)
    bell_notes = {1: ["D5", "A5", "F5"], 13: ["Bb4", "F5", "D5"], 15: ["C5", "G5", "D5"], 21: ["Eb5", "Bb5", "G5"], 25: ["Bb4", "F5", "D6"], 29: ["G5", "D6", "Bb5"], 31: ["A5", "E6", "D6"]}
    current = bell_notes[1]
    for bar in range(1, BARS + 1):
        for k, v in bell_notes.items():
            if bar >= k:
                current = v
        if bar in (21, 22):
            current = bell_notes[21]
        inten = section_intensity(bar)
        steps = [0, 2] if inten < 0.7 else [0, 1, 2, 3] if inten > 0.95 else [0, 1.5, 3]
        for i, b in enumerate(steps):
            if rng.random() < 0.25:
                continue
            nm = current[(bar + i) % len(current)]
            sig = bell(midi_hz(n(nm)), 3.2, 0.12 + 0.06 * inten)
            pan = 0.55 if (bar + i) % 2 else -0.45
            st = t_of(bar, b + 0.5)
            dry.add(st, sig, pan=pan, gain=0.5)
            wet.add(st, sig, pan=-pan, gain=0.9)

    # --- Trống ---
    print("trống…", flush=True)
    for bar in range(9, 37):
        inten = section_intensity(bar)
        hits = [(0, 1.0, True), (2.5, 0.45, False), (3, 0.7, True)]
        if 17 <= bar <= 24:
            hits.append((1.5, 0.3, False))
        if bar in (16, 24, 32):
            hits += [(3.5, 0.55, False), (3.75, 0.45, False)]
        for b, v, low in hits:
            sig = drum(v * inten, low)
            st = t_of(bar, b)
            dry.add(st, sig, pan=0.0, gain=0.42)
            wet.add(st, sig, pan=0.0, gain=0.12)

    # --- Cồng ---
    print("cồng…", flush=True)
    for bar, beat, f0, vel in GONGS:
        sig = gong(f0, 14.0, vel)
        st = t_of(bar, beat)
        dry.add(st, sig, pan=0.1, gain=0.5)
        wet.add(st, sig, pan=-0.1, gain=0.45)

    # --- Tiếng hút ngược (như reverb chạy lùi) trước mỗi đoạn ---
    for bar in SWELLS:
        ln = int(2.0 * SR)
        tt = np.arange(ln) / SR
        noise = rng.normal(0, 1, ln)
        noise = lfilter([0.05], [1, -0.95], noise)
        env = (tt / 2.0) ** 3
        env[-int(0.04 * SR):] *= np.linspace(1, 0, int(0.04 * SR))
        sig = noise * env
        sig /= np.max(np.abs(sig)) + 1e-9
        st = t_of(bar) - 2.0
        wet.add(st, sig, pan=0.0, gain=0.25)
        dry.add(st, sig, pan=0.0, gain=0.08)

    # --- Reverb: tích chập vòng với xung tắt dần ---
    print("reverb…", flush=True)
    ir_len = int(5.0 * SR)
    tir = np.arange(ir_len) / SR
    def make_ir():
        x = rng.normal(0, 1, ir_len) * np.exp(-tir / 1.3)
        x = lfilter([0.35], [1, -0.65], x)  # tắt dần sáng
        x[: int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR))
        return x / np.sqrt(np.sum(x**2))
    out = []
    for ch, irx in ((wet.l, make_ir()), (wet.r, make_ir())):
        h = np.zeros(L)
        h[:ir_len] = irx
        out.append(np.fft.irfft(np.fft.rfft(ch) * np.fft.rfft(h), n=L))
    mixL = dry.l + out[0] * 1.2
    mixR = dry.r + out[1] * 1.2

    # --- Chặn tần thấp dưới 42 Hz (miền tần số, vẫn tuần hoàn) ---
    freqs = np.fft.rfftfreq(L, 1 / SR)
    hp = 1 / np.sqrt(1 + (42 / np.maximum(freqs, 1e-3)) ** 8)
    mixL = np.fft.irfft(np.fft.rfft(mixL) * hp, n=L)
    mixR = np.fft.irfft(np.fft.rfft(mixR) * hp, n=L)

    # --- Chuẩn hóa và nén mềm ---
    stereo = np.stack([mixL, mixR], axis=1)
    rms = np.sqrt(np.mean(stereo**2))
    stereo *= 10 ** (-19 / 20) / rms
    stereo = np.tanh(stereo * 1.15) / np.tanh(1.15)
    peak = np.max(np.abs(stereo))
    if peak > 0.89:
        stereo *= 0.89 / peak
    return stereo


def main():
    out_path = sys.argv[1] if len(sys.argv) > 1 else "public/audio/an-menh-nhac-nen.mp3"
    stereo = render()
    pcm = (np.clip(stereo, -1, 1) * 32767).astype("<i2")
    with tempfile.TemporaryDirectory() as td:
        wav_path = os.path.join(td, "loop.wav")
        with wave.open(wav_path, "wb") as w:
            w.setnchannels(2)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes(pcm.tobytes())
        os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", wav_path, "-codec:a", "libmp3lame", "-b:a", "128k", "-ac", "2", out_path],
            check=True,
        )
        if len(sys.argv) > 2:
            # Lưu thêm bản WAV để kiểm tra
            import shutil

            shutil.copy(wav_path, sys.argv[2])
    print(f"Đã ghi {out_path} ({L_SEC:.0f} giây, lặp liền mạch).")


if __name__ == "__main__":
    main()
