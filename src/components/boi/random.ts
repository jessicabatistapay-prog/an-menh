/** Số ngẫu nhiên trong [0, 1) từ bộ sinh ngẫu nhiên mật mã của trình duyệt (dự phòng Math.random). */
export function secureRandom(): number {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const a = new Uint32Array(1);
    crypto.getRandomValues(a);
    return a[0]! / 4294967296;
  }
  return Math.random();
}

/** Xáo trộn Fisher–Yates, trả về mảng mới. */
export function shuffle<T>(items: readonly T[], random: () => number = secureRandom): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
}
