import { describe, expect, it } from "vitest";
import {
  BAT_TRACH_TABLE,
  DIRECTIONS,
  OPPOSITE_DIRECTION,
  STAR_ORDER,
  TRIGRAMS,
  type TrigramKey,
  cungPhi,
  evaluateHouse,
  starForDirection,
} from "../battrach";
import { computeBanMenh } from "../banmenh";
import { canChiOfDay, canChiOfLunarMonth, canChiOfLunarYear, makeCanChi, zodiacOf } from "../canchi";
import {
  daysInMonth,
  isGregorianLeapYear,
  isValidCalendarDate,
  parseISODate,
  todayInVietnam,
  weekdayVi,
} from "../date";
import { ELEMENTS, GENERATES, OVERCOMES, relationsOf } from "../elements";
import { NAP_AM_TABLE, napAmOf } from "../napam";
import { lifePathNumber, reduceNumber } from "../numerology";

const d = (s: string) => {
  const r = parseISODate(s);
  if (!r.ok) throw new Error(s);
  return r.date;
};

describe("Ngày dương lịch", () => {
  it("năm nhuận", () => {
    expect(isGregorianLeapYear(2000)).toBe(true);
    expect(isGregorianLeapYear(1900)).toBe(false);
    expect(isGregorianLeapYear(2024)).toBe(true);
    expect(isGregorianLeapYear(2023)).toBe(false);
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2100, 2)).toBe(28);
  });

  it("phân tích chuỗi ngày và từ chối ngày không hợp lệ", () => {
    expect(parseISODate("2024-02-29")).toEqual({ ok: true, date: { year: 2024, month: 2, day: 29 } });
    expect(parseISODate("2023-02-29")).toEqual({ ok: false, error: "invalid" });
    expect(parseISODate("1900-02-29")).toEqual({ ok: false, error: "invalid" });
    expect(parseISODate("2024-04-31")).toEqual({ ok: false, error: "invalid" });
    expect(parseISODate("2024-00-10")).toEqual({ ok: false, error: "invalid" });
    expect(parseISODate("29/02/2024")).toEqual({ ok: false, error: "format" });
    expect(parseISODate("")).toEqual({ ok: false, error: "empty" });
    expect(parseISODate(undefined)).toEqual({ ok: false, error: "empty" });
    expect(isValidCalendarDate({ year: 2024, month: 2, day: 1.5 })).toBe(false);
  });

  it("thứ trong tuần", () => {
    expect(weekdayVi(d("2000-01-01"))).toBe("Thứ Bảy");
    expect(weekdayVi(d("2026-10-28"))).toBe("Thứ Tư");
  });

  it("ngày hiện tại tính theo giờ Việt Nam, không theo UTC", () => {
    // 20:00 UTC ngày 31/12/2025 = 03:00 ngày 01/01/2026 giờ Việt Nam
    expect(todayInVietnam(new Date("2025-12-31T20:00:00Z"))).toEqual({ year: 2026, month: 1, day: 1 });
    expect(todayInVietnam(new Date("2025-12-31T16:59:00Z"))).toEqual({ year: 2025, month: 12, day: 31 });
  });
});

describe("Can Chi", () => {
  it("Can Chi năm", () => {
    expect(canChiOfLunarYear(1984).name).toBe("Giáp Tý");
    expect(canChiOfLunarYear(2024).name).toBe("Giáp Thìn");
    expect(canChiOfLunarYear(2025).name).toBe("Ất Tỵ");
    expect(canChiOfLunarYear(2026).name).toBe("Bính Ngọ");
    expect(canChiOfLunarYear(1990).name).toBe("Canh Ngọ");
    expect(canChiOfLunarYear(1968).name).toBe("Mậu Thân");
    expect(canChiOfLunarYear(1900).name).toBe("Canh Tý");
  });

  it("con giáp theo truyền thống Việt Nam", () => {
    expect(zodiacOf(canChiOfLunarYear(2023).branchIndex)).toBe("Mèo");
    expect(zodiacOf(canChiOfLunarYear(2021).branchIndex)).toBe("Trâu");
  });

  it("Can Chi ngày và tháng", () => {
    expect(canChiOfDay(d("2000-01-01")).name).toBe("Mậu Ngọ");
    expect(canChiOfLunarMonth(2024, 1).name).toBe("Bính Dần");
    expect(canChiOfLunarMonth(2025, 1).name).toBe("Mậu Dần");
  });

  it("vòng 60 không lặp và từ chối cặp sai âm dương", () => {
    const names = new Set<string>();
    for (let y = 1984; y < 2044; y++) names.add(canChiOfLunarYear(y).name);
    expect(names.size).toBe(60);
    expect(() => makeCanChi(0, 1)).toThrow();
  });
});

describe("Ngũ hành nạp âm", () => {
  it("bảng đủ 30 mục, mỗi hành 6 lần, cặp Can Chi khớp vòng 60", () => {
    expect(NAP_AM_TABLE).toHaveLength(30);
    const counts: Record<string, number> = {};
    NAP_AM_TABLE.forEach((e, i) => {
      counts[e.element] = (counts[e.element] ?? 0) + 1;
      expect(e.pair[0]).toBe(canChiOfLunarYear(1984 + 2 * i).name);
      expect(e.pair[1]).toBe(canChiOfLunarYear(1985 + 2 * i).name);
    });
    expect(counts).toEqual({ kim: 6, moc: 6, thuy: 6, hoa: 6, tho: 6 });
  });

  it.each([
    [1984, "Hải Trung Kim"],
    [1986, "Lư Trung Hỏa"],
    [1990, "Lộ Bàng Thổ"],
    [1992, "Kiếm Phong Kim"],
    [1996, "Giản Hạ Thủy"],
    [2000, "Bạch Lạp Kim"],
    [2003, "Dương Liễu Mộc"],
    [2024, "Phú Đăng Hỏa"],
    [2026, "Thiên Hà Thủy"],
  ])("năm %i: %s", (year, name) => {
    expect(napAmOf(canChiOfLunarYear(year)).name).toBe(name);
  });
});

describe("Ngũ hành sinh khắc", () => {
  it("vòng sinh và vòng khắc là hoán vị đầy đủ", () => {
    expect(new Set(Object.values(GENERATES)).size).toBe(5);
    expect(new Set(Object.values(OVERCOMES)).size).toBe(5);
  });
  it("quan hệ của Thủy", () => {
    expect(relationsOf("thuy")).toEqual({
      self: "thuy",
      supportedBy: "kim",
      supports: "moc",
      controls: "hoa",
      controlledBy: "tho",
    });
    expect(Object.keys(ELEMENTS)).toHaveLength(5);
  });
});

describe("Cung phi (quy ước năm âm lịch – Tết)", () => {
  it.each([
    [1984, "nam", "Đoài"],
    [1984, "nu", "Cấn"],
    [1990, "nam", "Khảm"],
    [1990, "nu", "Cấn"], // số 5 với nữ → Cấn
    [1995, "nam", "Khôn"], // số 5 với nam → Khôn
    [1995, "nu", "Khảm"],
    [2000, "nam", "Ly"],
    [2000, "nu", "Càn"],
    [1999, "nam", "Khảm"],
    [1999, "nu", "Cấn"],
  ] as const)("%i %s → %s", (year, gender, name) => {
    expect(cungPhi(year, gender).trigram.name).toBe(name);
  });

  it("số 5 được ghi nhận trước khi quy đổi", () => {
    expect(cungPhi(1995, "nam").rawNumber).toBe(5);
    expect(cungPhi(1990, "nu").rawNumber).toBe(5);
  });

  it("khớp bảng tra truyền thống 1900–1999 và 2000 trở đi", () => {
    const reduce = (n: number): number => (n < 10 ? n : reduce(String(n).split("").reduce((s, c) => s + +c, 0)));
    for (let y = 1900; y <= 2099; y++) {
      const r = reduce(y % 100);
      let male = y < 2000 ? 10 - r : 9 - r;
      let female = y < 2000 ? 5 + r : 6 + r;
      male = reduce(male === 0 ? 9 : male);
      female = reduce(female);
      if (male === 5) male = 2;
      if (female === 5) female = 8;
      expect(cungPhi(y, "nam").trigram.number, `nam ${y}`).toBe(male);
      expect(cungPhi(y, "nu").trigram.number, `nữ ${y}`).toBe(female);
    }
  });

  it("sinh trước Tết dùng năm âm lịch trước", () => {
    const r = computeBanMenh({ birthDate: d("2000-01-20"), gender: "nam" });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.result.bornBeforeTet).toBe(true);
    expect(r.result.lunar.year).toBe(1999);
    expect(r.result.canChi.name).toBe("Kỷ Mão");
    expect(r.result.napAm.name).toBe("Thành Đầu Thổ");
    expect(r.result.cungPhi?.trigram.name).toBe("Khảm");
  });

  it("sinh sau Tết dùng năm âm lịch hiện tại", () => {
    const r = computeBanMenh({ birthDate: d("2000-02-05"), gender: "nam" });
    expect(r.ok && r.result.canChi.name).toBe("Canh Thìn");
    expect(r.ok && r.result.bornBeforeTet).toBe(false);
    expect(r.ok && r.result.cungPhi?.trigram.name).toBe("Ly");
  });

  it("sinh ngày 4/2/2000 (trước Tết nhưng sau Lập Xuân) vẫn là năm Kỷ Mão theo quy ước Tết", () => {
    const r = computeBanMenh({ birthDate: d("2000-02-04"), gender: "nu" });
    expect(r.ok && r.result.canChi.name).toBe("Kỷ Mão");
  });

  it("ghi chú lịch cũ UTC+8 khi hai cách tính khác nhau (Tết Mậu Thân 1968)", () => {
    const r = computeBanMenh({ birthDate: d("1968-01-29") });
    expect(r.ok && r.result.canChi.name).toBe("Mậu Thân");
    expect(r.ok && r.result.historicalNote).toMatchObject({ canChiUtc8: "Đinh Mùi", yearDiffers: true });
    const normal = computeBanMenh({ birthDate: d("1968-06-15") });
    expect(normal.ok && normal.result.historicalNote).toBeNull();
    const modern = computeBanMenh({ birthDate: d("2007-02-17") });
    expect(modern.ok && modern.result.historicalNote).toBeNull();
  });

  it("không có giới tính thì không tính cung phi", () => {
    const r = computeBanMenh({ birthDate: d("1990-06-15") });
    expect(r.ok && r.result.cungPhi).toBeNull();
  });

  it("báo lỗi đầu vào", () => {
    expect(computeBanMenh({ birthDate: { year: 2023, month: 2, day: 29 } })).toEqual({ ok: false, error: "invalid-date" });
    expect(computeBanMenh({ birthDate: { year: 1899, month: 5, day: 1 } })).toEqual({ ok: false, error: "out-of-range" });
  });
});

describe("Bảng Bát trạch", () => {
  const keys = Object.keys(TRIGRAMS) as TrigramKey[];

  it("mỗi cung có đủ 8 hướng khác nhau", () => {
    for (const k of keys) {
      expect(new Set(Object.values(BAT_TRACH_TABLE[k])).size).toBe(8);
      expect(Object.keys(BAT_TRACH_TABLE[k])).toHaveLength(8);
    }
  });

  it("Phục Vị là hướng của chính quẻ", () => {
    for (const k of keys) expect(BAT_TRACH_TABLE[k].phucVi).toBe(TRIGRAMS[k].direction);
  });

  it("quan hệ giữa hai cung là đối xứng", () => {
    const trigramAt = (dir: string) => keys.find((k) => TRIGRAMS[k].direction === dir)!;
    for (const a of keys) {
      for (const star of STAR_ORDER) {
        const b = trigramAt(BAT_TRACH_TABLE[a][star]);
        expect(BAT_TRACH_TABLE[b][star], `${a}-${b}-${star}`).toBe(TRIGRAMS[a].direction);
      }
    }
  });

  it("4 hướng tốt cùng nhóm Đông/Tây với cung phi", () => {
    for (const k of keys) {
      const good = STAR_ORDER.filter((s) => ["sinhKhi", "thienY", "dienNien", "phucVi"].includes(s));
      for (const s of good) {
        const dir = BAT_TRACH_TABLE[k][s];
        const owner = keys.find((x) => TRIGRAMS[x].direction === dir)!;
        expect(TRIGRAMS[owner].group).toBe(TRIGRAMS[k].group);
      }
    }
  });

  it("đánh giá hướng nhà", () => {
    const e = evaluateHouse("kham", "S");
    expect(e.sitting).toBe("N");
    expect(e.houseTrigram.name).toBe("Khảm");
    expect(e.facingStar.name).toBe("Diên Niên");
    expect(e.sameGroup).toBe(true);
    expect(starForDirection("kham", "SW").name).toBe("Tuyệt Mệnh");
    for (const dir of DIRECTIONS) expect(OPPOSITE_DIRECTION[OPPOSITE_DIRECTION[dir]]).toBe(dir);
  });
});

describe("Thần số học", () => {
  it.each([
    ["1990-12-29", 33, true],
    ["2000-01-08", 11, true],
    ["1991-01-01", 22, true],
    ["1985-03-04", 3, false],
    ["2024-02-29", 3, false],
    ["2000-02-29", 6, false],
    ["1999-12-31", 8, false],
  ] as const)("%s → %i", (date, number, master) => {
    const r = lifePathNumber(d(date));
    expect(r.number).toBe(number);
    expect(r.isMaster).toBe(master);
  });

  it("dừng ở số đặc biệt ở bước trung gian", () => {
    expect(reduceNumber(29).value).toBe(11);
    expect(reduceNumber(38).value).toBe(11);
    expect(reduceNumber(49).value).toBe(4); // 49 → 13 → 4
    expect(reduceNumber(299).value).toBe(2); // 299 → 20 → 2
  });

  it("ghi lại các bước tính minh bạch", () => {
    const r = lifePathNumber(d("1985-03-04"));
    expect(r.steps[0]).toEqual({ expression: "0 + 4 + 0 + 3 + 1 + 9 + 8 + 5", result: 30 });
    expect(r.steps[1]).toEqual({ expression: "3 + 0", result: 3 });
  });

  it("từ chối ngày không hợp lệ", () => {
    expect(() => lifePathNumber({ year: 2023, month: 2, day: 29 })).toThrow();
  });

  it("kết quả xác định: cùng đầu vào cho cùng đầu ra", () => {
    expect(lifePathNumber(d("1993-07-17"))).toEqual(lifePathNumber(d("1993-07-17")));
  });
});
