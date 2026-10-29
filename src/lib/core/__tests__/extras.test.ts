import { describe, expect, it } from "vitest";
import { type BranchRelationKey, branchRelation, computeCompat, elementRelation, stemsCombine, tamHopGroup } from "../compat";
import { type CalendarDate, fromJulianDayNumber, julianDayNumber, parseISODate } from "../date";
import { holidaysOf } from "../holidays";
import { leapMonthOfYear, lunarNewYearDate, lunarToSolar, solarToLunar } from "../lunar";
import { personalYear } from "../numerology";
import { SOLAR_TERMS, solarTermOf, solarTermsOfYear } from "../solarterms";

const d = (s: string): CalendarDate => {
  const r = parseISODate(s);
  if (!r.ok) throw new Error(s);
  return r.date;
};

describe("Đổi âm lịch sang dương lịch", () => {
  it("các ngày đã biết", () => {
    expect(lunarToSolar({ year: 2024, month: 1, day: 1, isLeapMonth: false })).toEqual(d("2024-02-10"));
    expect(lunarToSolar({ year: 2023, month: 2, day: 1, isLeapMonth: true })).toEqual(d("2023-03-22"));
    expect(lunarToSolar({ year: 2024, month: 8, day: 15, isLeapMonth: false })).toEqual(d("2024-09-17"));
    expect(lunarToSolar({ year: 1985, month: 1, day: 1, isLeapMonth: false })).toEqual(d("1985-01-21"));
    expect(lunarToSolar({ year: 2023, month: 12, day: 30, isLeapMonth: false })).toEqual(d("2024-02-09"));
  });

  it("từ chối ngày âm không tồn tại", () => {
    expect(lunarToSolar({ year: 2023, month: 3, day: 1, isLeapMonth: true })).toBeNull(); // 2023 nhuận tháng 2
    expect(lunarToSolar({ year: 2024, month: 4, day: 1, isLeapMonth: true })).toBeNull(); // 2024 không nhuận
    expect(lunarToSolar({ year: 2024, month: 13, day: 1, isLeapMonth: false })).toBeNull();
    expect(lunarToSolar({ year: 2024, month: 1, day: 31, isLeapMonth: false })).toBeNull();
    expect(lunarToSolar({ year: 1899, month: 12, day: 1, isLeapMonth: false })).toBeNull();
    expect(lunarToSolar({ year: 2024, month: 1.5, day: 1, isLeapMonth: false })).toBeNull();
    // Ngày 30 của tháng thiếu
    const lastOfYear = solarToLunar(fromJulianDayNumber(julianDayNumber(lunarNewYearDate(2025)) - 1));
    if (lastOfYear.monthLength === 29) {
      expect(lunarToSolar({ year: 2024, month: 12, day: 30, isLeapMonth: false })).toBeNull();
    } else {
      expect(lunarToSolar({ year: 2024, month: 12, day: 30, isLeapMonth: false })).not.toBeNull();
    }
  });

  it("tháng nhuận của năm", () => {
    expect(leapMonthOfYear(2020)).toBe(4);
    expect(leapMonthOfYear(2023)).toBe(2);
    expect(leapMonthOfYear(2025)).toBe(6);
    expect(leapMonthOfYear(2024)).toBeNull();
  });

  it("đổi qua lại khớp nhau trên mọi ngày 1900–2100", () => {
    const start = julianDayNumber(d("1900-01-31"));
    const end = julianDayNumber(d("2100-12-31"));
    for (let j = start; j <= end; j++) {
      const solar = fromJulianDayNumber(j);
      const l = solarToLunar(solar);
      expect(lunarToSolar(l)).toEqual(solar);
    }
  });
});

describe("Tiết khí (giờ Việt Nam)", () => {
  it.each([
    ["2024-02-04", "Lập xuân"],
    ["2024-03-20", "Xuân phân"],
    ["2024-06-21", "Hạ chí"], // 20/06 20:51 UTC = 21/06 03:51 giờ VN
    ["2024-09-22", "Thu phân"],
    ["2024-12-21", "Đông chí"],
    ["2026-12-22", "Đông chí"], // 21/12 20:50 UTC = 22/12 03:50 giờ VN
  ])("%s bắt đầu tiết %s", (date, name) => {
    const t = solarTermOf(d(date));
    expect(t.name).toBe(name);
    expect(t.startsToday).toBe(true);
  });

  it("ngày giữa tiết", () => {
    expect(solarTermOf(d("2024-03-25"))).toMatchObject({ name: "Xuân phân", startsToday: false });
  });

  it("mỗi năm có đủ 24 tiết theo đúng thứ tự, Đông chí luôn ở tháng 11 âm lịch", () => {
    for (let y = 1901; y <= 2099; y++) {
      const terms = solarTermsOfYear(y);
      expect(terms, String(y)).toHaveLength(24);
      for (let i = 1; i < 24; i++) {
        const prev = SOLAR_TERMS.indexOf(terms[i - 1]!.name as (typeof SOLAR_TERMS)[number]);
        const cur = SOLAR_TERMS.indexOf(terms[i]!.name as (typeof SOLAR_TERMS)[number]);
        expect(cur).toBe((prev + 1) % 24);
      }
      const dongChi = terms.find((t) => t.name === "Đông chí")!;
      expect(solarToLunar(dongChi.date)).toMatchObject({ month: 11, isLeapMonth: false });
    }
  });
});

describe("Ngày lễ", () => {
  it("lễ theo âm lịch và dương lịch", () => {
    const names = (s: string) => holidaysOf(d(s), solarToLunar(d(s))).map((h) => h.name);
    expect(names("2024-09-17")).toContain("Tết Trung thu");
    expect(names("2026-02-17")).toContain("Tết Nguyên đán");
    expect(names("2026-02-16")).toContain("Giao thừa (Tất niên)");
    expect(names("2026-09-02")).toContain("Quốc khánh");
    expect(names("2026-10-28")).toEqual([]);
  });

  it("không gắn lễ âm lịch vào tháng nhuận", () => {
    const leap15 = lunarToSolar({ year: 2025, month: 6, day: 15, isLeapMonth: true })!;
    expect(holidaysOf(leap15, solarToLunar(leap15)).filter((h) => h.calendar === "am")).toEqual([]);
  });
});

describe("Xem tuổi hai người", () => {
  it("mỗi chi có đúng 2 tam hợp, 1 lục hợp, 1 lục xung, 1 lục hại", () => {
    for (let a = 0; a < 12; a++) {
      const counts: Partial<Record<BranchRelationKey, number>> = {};
      for (let b = 0; b < 12; b++) {
        const k = branchRelation(a, b);
        counts[k] = (counts[k] ?? 0) + 1;
        expect(branchRelation(b, a)).toBe(k);
      }
      expect(counts).toEqual({ "cung-chi": 1, "tam-hop": 2, "luc-hop": 1, "luc-xung": 1, "luc-hai": 1, khong: 6 });
    }
  });

  it("các cặp đã biết", () => {
    expect(branchRelation(2, 11)).toBe("luc-hop"); // Dần – Hợi
    expect(branchRelation(3, 10)).toBe("luc-hop"); // Mão – Tuất
    expect(branchRelation(0, 6)).toBe("luc-xung"); // Tý – Ngọ
    expect(branchRelation(0, 7)).toBe("luc-hai"); // Tý – Mùi
    expect(branchRelation(8, 4)).toBe("tam-hop"); // Thân – Thìn
    expect(tamHopGroup(6)).toBe("Dần – Ngọ – Tuất");
    expect(tamHopGroup(1)).toBe("Tỵ – Dậu – Sửu");
    expect(stemsCombine(0, 5)).toBe(true); // Giáp – Kỷ
    expect(stemsCombine(4, 9)).toBe(true); // Mậu – Quý
    expect(stemsCombine(0, 6)).toBe(false);
    expect(elementRelation("moc", "hoa")).toBe("a-sinh-b");
    expect(elementRelation("hoa", "moc")).toBe("b-sinh-a");
    expect(elementRelation("kim", "moc")).toBe("a-khac-b");
    expect(elementRelation("tho", "tho")).toBe("binh-hoa");
  });

  it("Canh Ngọ 1990 và Giáp Tuất 1994", () => {
    const r = computeCompat({ birthDate: d("1990-06-15"), gender: "nam" }, { birthDate: d("1994-08-20"), gender: "nu" });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.result.a.canChi.name).toBe("Canh Ngọ");
    expect(r.result.b.canChi.name).toBe("Giáp Tuất");
    expect(r.result.branch.key).toBe("tam-hop");
    expect(r.result.element.key).toBe("b-sinh-a"); // Sơn Đầu Hỏa sinh Lộ Bàng Thổ
    expect(r.result.stem.combine).toBe(false);
    expect(r.result.group).not.toBeNull();
  });

  it("dùng năm âm lịch: sinh trước Tết", () => {
    const r = computeCompat({ birthDate: d("1990-01-20") }, { birthDate: d("1984-03-01") });
    expect(r.ok && r.result.a.canChi.name).toBe("Kỷ Tỵ");
    expect(r.ok && r.result.stem.combine).toBe(true); // Kỷ – Giáp
    expect(r.ok && r.result.group).toBeNull();
  });

  it("báo lỗi đầu vào", () => {
    expect(computeCompat({ birthDate: d("2000-01-01") }, { birthDate: { year: 2023, month: 2, day: 29 } })).toEqual({
      ok: false,
      error: "invalid-date",
      who: "b",
    });
    expect(computeCompat({ birthDate: { year: 1800, month: 1, day: 1 } }, { birthDate: d("2000-01-01") })).toEqual({
      ok: false,
      error: "out-of-range",
      who: "a",
    });
  });
});

describe("Năm cá nhân", () => {
  it.each([
    ["1990-12-29", 2026, 6], // 2+9+1+2+2+0+2+6 = 24 → 6
    ["1985-03-04", 2026, 8], // 0+4+0+3+2+0+2+6 = 17 → 8
    ["2000-01-08", 2027, 2], // 0+8+0+1+2+0+2+7 = 20 → 2
    ["1999-09-29", 2026, 3], // 2+9+0+9+2+0+2+6 = 30 → 3
  ])("%s năm %i → %i", (date, year, expected) => {
    const r = personalYear(d(date), year);
    expect(r.number).toBe(expected);
    expect(r.steps.at(-1)!.result).toBe(expected);
  });

  it("không giữ số đặc biệt", () => {
    // 29/09 năm 2027: 2+9+0+9+2+0+2+7 = 31 → 4
    expect(personalYear(d("1999-09-29"), 2027).number).toBe(4);
    // tổng 11 vẫn rút gọn thành 2: 01/01 năm 2007 → 0+1+0+1+2+0+0+7 = 11 → 2
    expect(personalYear(d("1990-01-01"), 2007).number).toBe(2);
    expect(() => personalYear(d("1990-01-01"), 0)).toThrow();
  });
});
