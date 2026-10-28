import { type CanChi, canChiOfLunarYear, STEM_ELEMENTS, BRANCH_ELEMENTS, zodiacOf } from "./canchi";
import { type CalendarDate, compareDates, isValidCalendarDate, isWithinSupportedRange } from "./date";
import { type ColorSuggestion, type ElementKey, type ElementRelations, colorSuggestions, relationsOf } from "./elements";
import { type CungPhiResult, type Gender, cungPhi } from "./battrach";
import { type LunarDate, lunarNewYearDate, solarToLunar } from "./lunar";
import { type NapAmEntry, napAmOf } from "./napam";

export interface BanMenhInput {
  birthDate: CalendarDate;
  gender?: Gender | null;
}

export interface BanMenhResult {
  birthDate: CalendarDate;
  lunar: LunarDate;
  canChi: CanChi;
  zodiac: string;
  stemElement: ElementKey;
  branchElement: ElementKey;
  napAm: NapAmEntry;
  relations: ElementRelations;
  colors: ColorSuggestion;
  /** Tết của năm dương lịch sinh. */
  tetOfBirthYear: CalendarDate | null;
  /** Sinh trước Tết của năm dương lịch đó → năm âm lịch là năm trước. */
  bornBeforeTet: boolean;
  cungPhi: CungPhiResult | null;
  /**
   * Lịch âm Việt Nam trước năm 1968 (miền Nam đến 1975) thường được tính theo múi giờ UTC+8.
   * Nếu với ngày sinh này hai cách tính cho kết quả khác nhau, ghi lại để hiển thị lưu ý.
   */
  historicalNote: { lunarUtc8: LunarDate; canChiUtc8: string; yearDiffers: boolean } | null;
}

/** Trước mốc này có thể có khác biệt do lịch cũ dùng UTC+8. */
export const HISTORICAL_TZ_CUTOFF: CalendarDate = { year: 1976, month: 1, day: 1 };

export type BanMenhError = "invalid-date" | "out-of-range";

export function computeBanMenh(
  input: BanMenhInput,
): { ok: true; result: BanMenhResult } | { ok: false; error: BanMenhError } {
  const { birthDate, gender } = input;
  if (!isValidCalendarDate(birthDate)) return { ok: false, error: "invalid-date" };
  if (!isWithinSupportedRange(birthDate)) return { ok: false, error: "out-of-range" };

  const lunar = solarToLunar(birthDate);
  const canChi = canChiOfLunarYear(lunar.year);
  const napAm = napAmOf(canChi);
  let tetOfBirthYear: CalendarDate | null = null;
  try {
    tetOfBirthYear = lunarNewYearDate(birthDate.year);
  } catch {
    tetOfBirthYear = null;
  }
  let historicalNote: BanMenhResult["historicalNote"] = null;
  if (compareDates(birthDate, HISTORICAL_TZ_CUTOFF) < 0) {
    const l8 = solarToLunar(birthDate, 8);
    if (l8.year !== lunar.year || l8.month !== lunar.month || l8.day !== lunar.day || l8.isLeapMonth !== lunar.isLeapMonth) {
      historicalNote = { lunarUtc8: l8, canChiUtc8: canChiOfLunarYear(l8.year).name, yearDiffers: l8.year !== lunar.year };
    }
  }
  const bornBeforeTet = tetOfBirthYear !== null && compareDates(birthDate, tetOfBirthYear) < 0;

  return {
    ok: true,
    result: {
      birthDate,
      lunar,
      canChi,
      zodiac: zodiacOf(canChi.branchIndex),
      stemElement: STEM_ELEMENTS[canChi.stemIndex]!,
      branchElement: BRANCH_ELEMENTS[canChi.branchIndex]!,
      napAm,
      relations: relationsOf(napAm.element),
      colors: colorSuggestions(napAm.element),
      tetOfBirthYear,
      bornBeforeTet,
      cungPhi: gender ? cungPhi(lunar.year, gender) : null,
      historicalNote,
    },
  };
}
