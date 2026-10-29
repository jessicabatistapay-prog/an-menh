import { describe, expect, it } from "vitest";
import { XAM, getXam } from "../xam";
import { SPREADS, TAROT_DECK, getTarotCard } from "../tarot";
import { HEXAGRAM_MEANINGS } from "../hexagrams";

/** Đếm số tiếng (âm tiết) của một câu thơ. */
const syllables = (s: string) => s.replace(/[,.;:!?“”"]/g, " ").trim().split(/\s+/).length;

describe("Bộ xăm", () => {
  it("đủ 36 quẻ, số thứ tự liên tục, tên không trùng", () => {
    expect(XAM).toHaveLength(36);
    XAM.forEach((x, i) => expect(x.number).toBe(i + 1));
    expect(new Set(XAM.map((x) => x.title)).size).toBe(36);
    expect(getXam(36)?.title).toBe("Sao Bắc Đẩu");
    expect(getXam(37)).toBeUndefined();
  });

  it("thơ đúng thể lục bát: 6 tiếng rồi 8 tiếng", () => {
    for (const x of XAM) {
      expect(syllables(x.poem[0]), `${x.number}: ${x.poem[0]}`).toBe(6);
      expect(syllables(x.poem[1]), `${x.number}: ${x.poem[1]}`).toBe(8);
    }
  });

  it("vần lục bát: tiếng thứ 6 của câu lục vần với tiếng thứ 6 của câu bát, và đều là thanh bằng", () => {
    const words = (l: string) => l.replace(/[,.;:!?]/g, " ").trim().split(/\s+/);
    const stripTone = (w: string) =>
      w
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300\u0301\u0303\u0309\u0323]/g, "") // bỏ dấu thanh, giữ dấu mũ/móc
        .normalize("NFC");
    // Bỏ phụ âm đầu ("qu" giữ lại âm đệm u) và âm đệm o/u trước nguyên âm (vần thông, như hoa – xa).
    const rhyme = (w: string) =>
      stripTone(w)
        .replace(/^(ngh|ng|nh|ch|gh|gi|kh|ph|th|tr|[bcdđghklmnpqrstvx])/, "")
        .replace(/^[ou](?=[aăâeêioôơuưy])/, "");
    const flat = (w: string) => !/[\u0301\u0303\u0309\u0323]/.test(w.toLowerCase().normalize("NFD"));
    for (const x of XAM) {
      const a = words(x.poem[0])[5]!;
      const b = words(x.poem[1])[5]!;
      expect(rhyme(a), `${x.number}: ${a} / ${b}`).toBe(rhyme(b));
      expect(flat(a) && flat(b), `${x.number}: thanh bằng ${a} / ${b}`).toBe(true);
    }
  });

  it("không có quẻ hạ và mỗi quẻ có đủ lời bàn", () => {
    for (const x of XAM) {
      expect(["Thượng", "Trung", "Bình"]).toContain(x.level);
      for (const t of [x.meaning, x.work, x.family, x.love]) expect(t.length).toBeGreaterThan(10);
    }
  });
});


describe("Bộ Tarot", () => {
  it("đủ 78 lá: 22 Ẩn chính và 4 bộ × 14 lá Ẩn phụ, id và tên không trùng", () => {
    expect(TAROT_DECK).toHaveLength(78);
    expect(TAROT_DECK.filter((c) => c.arcana === "major")).toHaveLength(22);
    for (const suit of ["gay", "coc", "kiem", "tien"]) expect(TAROT_DECK.filter((c) => c.suit === suit)).toHaveLength(14);
    expect(new Set(TAROT_DECK.map((c) => c.id)).size).toBe(78);
    expect(new Set(TAROT_DECK.map((c) => c.name)).size).toBe(78);
    expect(getTarotCard("major-17")?.en).toBe("The Star");
    expect(getTarotCard("kiem-14")?.name).toBe("Vua Kiếm");
  });

  it("mỗi lá có nghĩa xuôi và ngược; kiểu trải có số vị trí đúng", () => {
    for (const c of TAROT_DECK) {
      expect(c.upright.length).toBeGreaterThan(5);
      expect(c.reversed.length).toBeGreaterThan(5);
    }
    expect(SPREADS["1"].positions).toHaveLength(1);
    expect(SPREADS["3"].positions).toHaveLength(3);
  });
});

describe("Ý nghĩa quẻ", () => {
  it("đủ 64 quẻ, mỗi quẻ có đủ nội dung", () => {
    expect(HEXAGRAM_MEANINGS).toHaveLength(64);
    for (const m of HEXAGRAM_MEANINGS) for (const t of Object.values(m)) expect(t.length).toBeGreaterThan(3);
  });
});
