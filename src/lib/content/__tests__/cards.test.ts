import { describe, expect, it } from "vitest";
import { REFLECTION_CARDS, drawCard, getCardById } from "../cards";

describe("Bộ thẻ chiêm nghiệm", () => {
  it("có đúng 24 thẻ, id không trùng, nội dung đầy đủ", () => {
    expect(REFLECTION_CARDS).toHaveLength(24);
    expect(new Set(REFLECTION_CARDS.map((c) => c.id)).size).toBe(24);
    expect(new Set(REFLECTION_CARDS.map((c) => c.name)).size).toBe(24);
    for (const c of REFLECTION_CARDS) {
      expect(c.name.trim()).not.toBe("");
      expect(c.message.length).toBeGreaterThan(20);
      expect(c.question.trim().endsWith("?")).toBe(true);
      expect(c.action.trim()).not.toBe("");
    }
  });

  it("rút thẻ dùng hàm ngẫu nhiên được truyền vào", () => {
    expect(drawCard(() => 0).id).toBe(REFLECTION_CARDS[0]!.id);
    expect(drawCard(() => 0.9999999).id).toBe(REFLECTION_CARDS[23]!.id);
    expect(drawCard(() => 0, REFLECTION_CARDS[0]!.id).id).toBe(REFLECTION_CARDS[1]!.id);
  });

  it("tra thẻ theo id", () => {
    expect(getCardById("mam-non")?.name).toBe("Mầm Non");
    expect(getCardById("khong-co")).toBeUndefined();
  });
});
