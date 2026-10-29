import { describe, expect, it } from "vitest";
import { dailyForecast } from "../daily";
import { parseISODate } from "../date";

const d = (s: string) => {
  const r = parseISODate(s);
  if (!r.ok) throw new Error(s);
  return r.date;
};

describe("Tử vi hằng ngày", () => {
  // 29/10/2026 là ngày Bính Tý (can Hỏa)
  it.each([
    [0, "ban-menh"], // Tý – cùng chi
    [6, "cham"], // Ngọ – lục xung
    [4, "thuan"], // Thìn – tam hợp
    [8, "thuan"], // Thân – tam hợp
    [1, "thuan"], // Sửu – lục hợp
    [7, "giu-loi"], // Mùi – lục hại
    [3, "binh"], // Mão (Mộc) – không quan hệ, Hỏa không sinh/khắc Mộc
    [9, "cham"], // Dậu (Kim) – Hỏa khắc Kim
    [10, "thuan"], // Tuất (Thổ) – Hỏa sinh Thổ
  ] as const)("chi %i → %s", (branch, tone) => {
    expect(dailyForecast(d("2026-10-29"), branch).tone).toBe(tone);
  });

  it("có tính xác định và luôn có giờ gợi ý là giờ hoàng đạo", () => {
    for (let b = 0; b < 12; b++) {
      const a = dailyForecast(d("2026-11-03"), b);
      expect(dailyForecast(d("2026-11-03"), b)).toEqual(a);
      expect(a.goodHour.god.hoangDao).toBe(true);
      expect(a.work.length).toBeGreaterThan(10);
    }
  });
});
