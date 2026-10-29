import { describe, expect, it } from "vitest";
import { canChiOfDay } from "../canchi";
import { parseISODate } from "../date";
import { dayAuspice, godAt, hourRange, monthBranch, thanhLongStart } from "../hoangdao";

describe("Hoàng đạo", () => {
  it("Thanh Long khởi theo bài ca: Dần Thân gia Tý, Mão Dậu Dần, Thìn Tuất Thìn, Tỵ Hợi Ngọ, Tý Ngọ Thân, Sửu Mùi Tuất", () => {
    const expected = [8, 10, 0, 2, 4, 6, 8, 10, 0, 2, 4, 6];
    for (let b = 0; b < 12; b++) expect(thanhLongStart(b)).toBe(expected[b]);
  });

  it("ngày Tý, Ngọ: giờ hoàng đạo là Tý, Sửu, Mão, Ngọ, Thân, Dậu", () => {
    const good = (dayBranch: number) => Array.from({ length: 12 }, (_, h) => h).filter((h) => godAt(dayBranch, h).hoangDao);
    expect(good(0)).toEqual([0, 1, 3, 6, 8, 9]);
    expect(good(6)).toEqual([0, 1, 3, 6, 8, 9]);
    // ngày Dần, Thân: Tý, Sửu, Thìn, Tỵ, Mùi, Tuất
    expect(good(2)).toEqual([0, 1, 4, 5, 7, 10]);
  });

  it("tháng Giêng: ngày Tý là Thanh Long hoàng đạo, ngày Ngọ là Bạch Hổ hắc đạo", () => {
    expect(monthBranch(1)).toBe(2);
    expect(godAt(monthBranch(1), 0)).toMatchObject({ name: "Thanh Long", hoangDao: true });
    expect(godAt(monthBranch(1), 6)).toMatchObject({ name: "Bạch Hổ", hoangDao: false });
  });

  it("mỗi ngày có đúng 6 giờ hoàng đạo và khung giờ đúng", () => {
    const r = parseISODate("2026-10-29");
    if (!r.ok) throw new Error();
    const a = dayAuspice(r.date);
    expect(a.goodHours).toHaveLength(6);
    expect(hourRange(0)).toBe("23h–1h");
    expect(hourRange(6)).toBe("11h–13h");
    // 29/10/2026 là ngày Bính Tý → tuổi xung là Ngọ (Ngựa)
    expect(canChiOfDay(r.date).name).toBe("Bính Tý");
    expect(a.clashBranch).toBe("Ngọ");
    expect(a.clashZodiac).toBe("Ngựa");
  });
});
