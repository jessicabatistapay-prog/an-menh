import { describe, expect, it } from "vitest";
import { HEXAGRAM_MEANINGS } from "@/lib/content/hexagrams";
import { type LineValue, hexagramByNumber, hexagramFromLines, readingFromValues, tossLine } from "../iching";

const L = (s: string) => s.split("").map((c) => c === "1"); // từ dưới lên

describe("Bảng 64 quẻ", () => {
  it("mỗi số quẻ 1–64 xuất hiện đúng một lần và đổi qua lại khớp nhau", () => {
    const seen = new Set<number>();
    for (let i = 0; i < 64; i++) {
      const lines = Array.from({ length: 6 }, (_, b) => ((i >> b) & 1) === 1);
      const h = hexagramFromLines(lines);
      seen.add(h.number);
      expect(hexagramByNumber(h.number).lines).toEqual(lines);
    }
    expect(seen.size).toBe(64);
    expect(HEXAGRAM_MEANINGS).toHaveLength(64);
  });

  it("tính chất cặp của thứ tự Văn Vương: quẻ chẵn là quẻ lẻ lộn ngược, hoặc đảo hào nếu quẻ đối xứng", () => {
    for (let n = 1; n <= 63; n += 2) {
      const a = hexagramByNumber(n).lines;
      const b = hexagramByNumber(n + 1).lines;
      const reversed = [...a].reverse();
      const symmetric = reversed.every((v, i) => v === a[i]);
      expect(b, `quẻ ${n}–${n + 1}`).toEqual(symmetric ? a.map((v) => !v) : reversed);
    }
  });

  it.each([
    [1, "111111", "Thuần Càn"],
    [2, "000000", "Thuần Khôn"],
    [3, "100010", "Thủy Lôi Truân"],
    [11, "111000", "Địa Thiên Thái"],
    [12, "000111", "Thiên Địa Bĩ"],
    [24, "100000", "Địa Lôi Phục"],
    [23, "000001", "Sơn Địa Bác"],
    [29, "010010", "Thuần Khảm"],
    [63, "101010", "Thủy Hỏa Ký Tế"],
    [64, "010101", "Hỏa Thủy Vị Tế"],
  ])("quẻ %i", (n, lines, name) => {
    const h = hexagramFromLines(L(lines));
    expect(h.number).toBe(n);
    expect(h.fullName).toBe(name);
  });
});

describe("Gieo quẻ", () => {
  it("ba đồng xu cho giá trị 6–9 đúng quy ước", () => {
    const seq = (vals: number[]) => {
      let i = 0;
      return () => vals[i++]!;
    };
    expect(tossLine(seq([0.1, 0.1, 0.1])).value).toBe(9); // 3 ngửa
    expect(tossLine(seq([0.9, 0.9, 0.9])).value).toBe(6); // 3 sấp
    expect(tossLine(seq([0.1, 0.9, 0.9])).value).toBe(7);
    expect(tossLine(seq([0.1, 0.1, 0.9])).value).toBe(8);
  });

  it("phân bố gần đúng 1:3:3:1", () => {
    let s = 42;
    const rand = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
    const counts: Record<number, number> = { 6: 0, 7: 0, 8: 0, 9: 0 };
    for (let i = 0; i < 40000; i++) counts[tossLine(rand).value]!++;
    expect(counts[6]! / 40000).toBeCloseTo(0.125, 1);
    expect(counts[7]! / 40000).toBeCloseTo(0.375, 1);
  });

  it("hào động và quẻ biến", () => {
    // Càn với hào sơ động → quẻ biến Thiên Phong Cấu (44)
    const r = readingFromValues([9, 7, 7, 7, 7, 7] as LineValue[]);
    expect(r.primary.number).toBe(1);
    expect(r.movingLines).toEqual([1]);
    expect(r.changed?.number).toBe(44);
    const still = readingFromValues([7, 8, 7, 8, 7, 8] as LineValue[]);
    expect(still.changed).toBeNull();
    expect(still.primary.number).toBe(63);
    // Khôn sáu hào động → Càn
    expect(readingFromValues([6, 6, 6, 6, 6, 6] as LineValue[]).changed?.number).toBe(1);
    expect(() => readingFromValues([7, 7, 7] as LineValue[])).toThrow();
  });
});
