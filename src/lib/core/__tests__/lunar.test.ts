import { describe, expect, it } from "vitest";
import { fromJulianDayNumber, julianDayNumber } from "../date";
import { UnsupportedDateError, lunarNewYearDate, solarToLunar } from "../lunar";

/**
 * Ngày Tết Nguyên đán tại Việt Nam (UTC+7), theo lịch Việt Nam được công bố rộng rãi.
 * Một số năm khác lịch Trung Quốc (UTC+8): 1985 (VN 21/01, TQ 20/02), 2007 (VN 17/02, TQ 18/02),
 * 2030 (VN 02/02, TQ 03/02).
 * Toàn bộ chuỗi ngày 1900–2100 còn được đối chiếu độc lập (xem scripts/verify-lunar và README).
 */
const TET_DATES: [number, string][] = [
  [1900, "1900-01-31"],
  [1945, "1945-02-13"],
  [1954, "1954-02-03"],
  [1960, "1960-01-28"],
  [1968, "1968-01-29"],
  [1975, "1975-02-11"],
  [1980, "1980-02-16"],
  [1984, "1984-02-02"],
  [1985, "1985-01-21"],
  [1990, "1990-01-27"],
  [1995, "1995-01-31"],
  [2000, "2000-02-05"],
  [2007, "2007-02-17"],
  [2010, "2010-02-14"],
  [2015, "2015-02-19"],
  [2019, "2019-02-05"],
  [2020, "2020-01-25"],
  [2021, "2021-02-12"],
  [2022, "2022-02-01"],
  [2023, "2023-01-22"],
  [2024, "2024-02-10"],
  [2025, "2025-01-29"],
  [2026, "2026-02-17"],
  [2027, "2027-02-06"],
  [2030, "2030-02-02"], // sóc 23:07 ngày 02/02 giờ VN → Tết VN 02/02, Trung Quốc 03/02
];

const iso = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return { year: y!, month: m!, day: d! };
};
const prevDay = (s: string) => fromJulianDayNumber(julianDayNumber(iso(s)) - 1);

describe("Tết Nguyên đán (UTC+7)", () => {
  it.each(TET_DATES)("Tết năm %i là %s", (year, date) => {
    const l = solarToLunar(iso(date));
    expect(l).toMatchObject({ year, month: 1, day: 1, isLeapMonth: false });
    expect(lunarNewYearDate(year)).toEqual(iso(date));
  });

  it.each(TET_DATES.filter(([y]) => y > 1900))("ngày trước Tết %i thuộc năm âm trước, tháng Chạp", (year, date) => {
    const l = solarToLunar(prevDay(date));
    expect(l.year).toBe(year - 1);
    expect(l.month).toBe(12);
    expect(l.isLeapMonth).toBe(false);
    expect([29, 30]).toContain(l.day);
  });

  it("1985: Việt Nam đón Tết 21/01 (khác Trung Quốc 20/02), nên 20/02/1985 là mùng 1 tháng Hai", () => {
    expect(solarToLunar(iso("1985-02-20"))).toMatchObject({ year: 1985, month: 2, day: 1 });
  });

  it("1968: theo UTC+7 Tết là 29/01; theo UTC+8 là 30/01", () => {
    expect(solarToLunar(iso("1968-01-29"))).toMatchObject({ year: 1968, month: 1, day: 1 });
    expect(solarToLunar(iso("1968-01-29"), 8)).toMatchObject({ year: 1967, month: 12 });
    expect(solarToLunar(iso("1968-01-30"), 8)).toMatchObject({ year: 1968, month: 1, day: 1 });
  });

  it("2007: Tết Việt Nam 17/02, Trung Quốc 18/02", () => {
    expect(lunarNewYearDate(2007, 8)).toEqual(iso("2007-02-18"));
  });

  it("2030: Tết Việt Nam 02/02, Trung Quốc 03/02", () => {
    expect(lunarNewYearDate(2030, 8)).toEqual(iso("2030-02-03"));
  });

  it("ngày sát thời điểm sóc vẫn cho ngày âm hợp lệ (hồi quy lỗi ngày 0)", () => {
    expect(solarToLunar(iso("2054-05-07"))).toMatchObject({ year: 2054, month: 3, day: 30 });
    expect(solarToLunar(iso("2062-04-09"))).toMatchObject({ year: 2062, month: 2, day: 30 });
  });
});

describe("Tháng nhuận", () => {
  it("năm 2023 nhuận tháng 2", () => {
    // 22/01/2023 là mùng 1 tháng Giêng; tháng 2 bắt đầu 20/02; tháng 2 nhuận bắt đầu 22/03
    expect(solarToLunar(iso("2023-03-22"))).toMatchObject({ year: 2023, month: 2, day: 1, isLeapMonth: true });
    expect(solarToLunar(iso("2023-02-20"))).toMatchObject({ year: 2023, month: 2, day: 1, isLeapMonth: false });
  });

  it("năm 2020 nhuận tháng 4", () => {
    expect(solarToLunar(iso("2020-05-23"))).toMatchObject({ year: 2020, month: 4, day: 1, isLeapMonth: true });
  });

  it("năm 2025 nhuận tháng 6", () => {
    expect(solarToLunar(iso("2025-07-25"))).toMatchObject({ year: 2025, month: 6, day: 1, isLeapMonth: true });
  });

  it("năm 2024 không có tháng nhuận", () => {
    const start = julianDayNumber(iso("2024-02-10"));
    const end = julianDayNumber(iso("2025-01-28"));
    for (let j = start; j <= end; j++) {
      expect(solarToLunar(fromJulianDayNumber(j)).isLeapMonth).toBe(false);
    }
  });
});

describe("Ngày cụ thể", () => {
  it("09/02/2024 là 30 tháng Chạp năm Quý Mão (2023)", () => {
    expect(solarToLunar(iso("2024-02-09"))).toMatchObject({ year: 2023, month: 12, day: 30 });
  });

  it("29/02/2024 (ngày nhuận dương lịch) là 20 tháng Giêng 2024", () => {
    expect(solarToLunar(iso("2024-02-29"))).toMatchObject({ year: 2024, month: 1, day: 20 });
  });

  it("Rằm tháng Tám 2024 là 17/09/2024", () => {
    expect(solarToLunar(iso("2024-09-17"))).toMatchObject({ year: 2024, month: 8, day: 15 });
  });
});

describe("Tính nhất quán toàn phạm vi", () => {
  it("ngày âm tăng liên tục, tháng dài 29–30 ngày, mỗi năm có 12 hoặc 13 tháng", () => {
    const start = julianDayNumber(iso("1900-01-31"));
    const end = julianDayNumber(iso("2100-12-31"));
    let prev = solarToLunar(fromJulianDayNumber(start));
    expect(prev).toMatchObject({ year: 1900, month: 1, day: 1 });
    const monthsPerYear = new Map<number, number>([[1900, 1]]);
    for (let j = start + 1; j <= end; j++) {
      const cur = solarToLunar(fromJulianDayNumber(j));
      if (cur.day === 1) {
        expect([29, 30]).toContain(prev.day);
        expect(prev.monthLength).toBe(prev.day);
        monthsPerYear.set(cur.year, (monthsPerYear.get(cur.year) ?? 0) + 1);
        if (cur.year !== prev.year) {
          expect(cur.year).toBe(prev.year + 1);
          expect(cur.month).toBe(1);
          expect(prev.month).toBe(12);
        } else if (!cur.isLeapMonth) {
          expect(cur.month).toBe(prev.month + 1);
        } else {
          expect(cur.month).toBe(prev.month);
        }
      } else {
        expect(cur.day).toBe(prev.day + 1);
        expect(cur.month).toBe(prev.month);
        expect(cur.year).toBe(prev.year);
      }
      prev = cur;
    }
    for (const [year, count] of monthsPerYear) {
      if (year > 1900 && year < 2100) expect([12, 13]).toContain(count);
    }
  });
});

describe("Phạm vi và đầu vào lỗi", () => {
  it("báo lỗi ngoài phạm vi", () => {
    expect(() => solarToLunar(iso("1900-01-30"))).toThrow(UnsupportedDateError);
    expect(() => solarToLunar(iso("2101-01-01"))).toThrow(UnsupportedDateError);
  });

  it("báo lỗi ngày không hợp lệ", () => {
    expect(() => solarToLunar(iso("2023-02-29"))).toThrow(RangeError);
    expect(() => solarToLunar(iso("2024-13-01"))).toThrow(RangeError);
  });

  it("biên phạm vi hỗ trợ tính được", () => {
    expect(() => solarToLunar(iso("2100-12-31"))).not.toThrow();
  });
});
