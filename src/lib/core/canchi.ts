/**
 * Thiên Can – Địa Chi (hệ đếm 60, "Lục thập hoa giáp").
 *
 * Quy ước tính Can Chi năm: dựa trên năm âm lịch (chuyển năm tại Tết Nguyên đán).
 * Năm 4 SCN là Giáp Tý, nên: can = (năm + 6) mod 10, chi = (năm + 8) mod 12.
 * Can Chi ngày dựa trên số ngày Julius: can = (JDN + 9) mod 10, chi = (JDN + 1) mod 12
 * (ví dụ 01/01/2000 là ngày Mậu Ngọ).
 * Can Chi tháng âm (tháng thường): can = (năm âm × 12 + tháng + 3) mod 10, chi = (tháng + 1) mod 12;
 * tháng Giêng luôn là tháng Dần.
 */

import { type CalendarDate, julianDayNumber } from "./date";
import type { ElementKey } from "./elements";

export const HEAVENLY_STEMS = [
  "Giáp",
  "Ất",
  "Bính",
  "Đinh",
  "Mậu",
  "Kỷ",
  "Canh",
  "Tân",
  "Nhâm",
  "Quý",
] as const;

export const EARTHLY_BRANCHES = [
  "Tý",
  "Sửu",
  "Dần",
  "Mão",
  "Thìn",
  "Tỵ",
  "Ngọ",
  "Mùi",
  "Thân",
  "Dậu",
  "Tuất",
  "Hợi",
] as const;

/** Con giáp theo truyền thống Việt Nam (Mão là Mèo, Sửu là Trâu). */
export const ZODIAC_ANIMALS = [
  "Chuột",
  "Trâu",
  "Hổ",
  "Mèo",
  "Rồng",
  "Rắn",
  "Ngựa",
  "Dê",
  "Khỉ",
  "Gà",
  "Chó",
  "Lợn",
] as const;

/** Ngũ hành của Thiên Can (Giáp Ất Mộc, Bính Đinh Hỏa, Mậu Kỷ Thổ, Canh Tân Kim, Nhâm Quý Thủy). */
export const STEM_ELEMENTS: readonly ElementKey[] = [
  "moc",
  "moc",
  "hoa",
  "hoa",
  "tho",
  "tho",
  "kim",
  "kim",
  "thuy",
  "thuy",
];

/** Ngũ hành bản khí của Địa Chi. */
export const BRANCH_ELEMENTS: readonly ElementKey[] = [
  "thuy", // Tý
  "tho", // Sửu
  "moc", // Dần
  "moc", // Mão
  "tho", // Thìn
  "hoa", // Tỵ
  "hoa", // Ngọ
  "tho", // Mùi
  "kim", // Thân
  "kim", // Dậu
  "tho", // Tuất
  "thuy", // Hợi
];

export interface CanChi {
  stemIndex: number; // 0..9
  branchIndex: number; // 0..11
  /** Vị trí trong vòng 60 (0 = Giáp Tý). */
  cycleIndex: number;
  name: string;
}

const mod = (n: number, m: number) => ((n % m) + m) % m;

export function makeCanChi(stemIndex: number, branchIndex: number): CanChi {
  if (mod(stemIndex, 2) !== mod(branchIndex, 2)) {
    throw new RangeError("Can và Chi phải cùng tính âm dương.");
  }
  // Tìm i ∈ [0,60) sao cho i ≡ stem (mod 10) và i ≡ branch (mod 12)
  let cycleIndex = 0;
  for (let i = 0; i < 60; i++) {
    if (i % 10 === stemIndex && i % 12 === branchIndex) {
      cycleIndex = i;
      break;
    }
  }
  return {
    stemIndex,
    branchIndex,
    cycleIndex,
    name: `${HEAVENLY_STEMS[stemIndex]} ${EARTHLY_BRANCHES[branchIndex]}`,
  };
}

export function canChiOfLunarYear(lunarYear: number): CanChi {
  return makeCanChi(mod(lunarYear + 6, 10), mod(lunarYear + 8, 12));
}

export function canChiOfDay(date: CalendarDate): CanChi {
  const jdn = julianDayNumber(date);
  return makeCanChi(mod(jdn + 9, 10), mod(jdn + 1, 12));
}

export function canChiOfLunarMonth(lunarYear: number, lunarMonth: number): CanChi {
  return makeCanChi(mod(lunarYear * 12 + lunarMonth + 3, 10), mod(lunarMonth + 1, 12));
}

export function zodiacOf(branchIndex: number): string {
  return ZODIAC_ANIMALS[mod(branchIndex, 12)] ?? "";
}
