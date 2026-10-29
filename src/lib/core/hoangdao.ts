/**
 * Ngày và giờ Hoàng đạo / Hắc đạo theo 12 thần trực nhật (Thanh Long, Minh Đường, ...).
 *
 * Quy tắc an Thanh Long (dùng chung cho ngày theo tháng và cho giờ theo ngày), theo bài ca quen thuộc:
 *   "Dần Thân gia Tý, Mão Dậu Dần, Thìn Tuất ở Thìn, Tỵ Hợi Ngọ, Tý Ngọ ở Thân, Sửu Mùi Tuất"
 *   – tháng (hoặc ngày) thuộc chi Dần, Thân thì Thanh Long khởi ở Tý; Mão, Dậu khởi ở Dần; ...
 * Sau Thanh Long lần lượt là Minh Đường, Thiên Hình, Chu Tước, Kim Quỹ, Kim Đường, Bạch Hổ, Ngọc Đường,
 * Thiên Lao, Huyền Vũ, Tư Mệnh, Câu Trận. Sáu thần hoàng đạo: Thanh Long, Minh Đường, Kim Quỹ, Kim Đường,
 * Ngọc Đường, Tư Mệnh.
 *
 * Quy ước của An Mệnh: tháng tính theo tháng âm lịch (tháng Giêng là tháng Dần); tháng nhuận dùng chung
 * chi với tháng chính. Một số sách dùng tháng theo tiết khí nên có thể khác ở những ngày giáp ranh.
 */

import { EARTHLY_BRANCHES, ZODIAC_ANIMALS, canChiOfDay } from "./canchi";
import type { CalendarDate } from "./date";
import { solarToLunar } from "./lunar";

export const TWELVE_GODS = [
  "Thanh Long",
  "Minh Đường",
  "Thiên Hình",
  "Chu Tước",
  "Kim Quỹ",
  "Kim Đường",
  "Bạch Hổ",
  "Ngọc Đường",
  "Thiên Lao",
  "Huyền Vũ",
  "Tư Mệnh",
  "Câu Trận",
] as const;

const AUSPICIOUS = new Set([0, 1, 4, 5, 7, 10]);

export interface GodInfo {
  index: number;
  name: string;
  hoangDao: boolean;
}

const mod = (n: number, m: number) => ((n % m) + m) % m;

/** Chi mà Thanh Long khởi, theo chi của tháng (để xét ngày) hoặc chi của ngày (để xét giờ). */
export function thanhLongStart(branch: number): number {
  return mod(2 * mod(branch, 6) + 8, 12);
}

export function godAt(baseBranch: number, targetBranch: number): GodInfo {
  const index = mod(targetBranch - thanhLongStart(baseBranch), 12);
  return { index, name: TWELVE_GODS[index]!, hoangDao: AUSPICIOUS.has(index) };
}

/** Chi của tháng âm lịch: tháng Giêng là Dần. */
export function monthBranch(lunarMonth: number): number {
  return mod(lunarMonth + 1, 12);
}

export interface HourInfo {
  branch: number;
  name: string;
  range: string;
  god: GodInfo;
}

export function hourRange(branch: number): string {
  const start = mod(2 * branch - 1, 24);
  const end = mod(start + 2, 24);
  return `${start}h–${end}h`;
}

export interface DayAuspice {
  dayGod: GodInfo;
  hours: HourInfo[];
  goodHours: HourInfo[];
  /** Con giáp xung với ngày (lục xung với chi ngày). */
  clashZodiac: string;
  clashBranch: string;
}

export function dayAuspice(date: CalendarDate): DayAuspice {
  const lunar = solarToLunar(date);
  const dayBranch = canChiOfDay(date).branchIndex;
  const hours: HourInfo[] = Array.from({ length: 12 }, (_, h) => ({
    branch: h,
    name: EARTHLY_BRANCHES[h]!,
    range: hourRange(h),
    god: godAt(dayBranch, h),
  }));
  const clash = mod(dayBranch + 6, 12);
  return {
    dayGod: godAt(monthBranch(lunar.month), dayBranch),
    hours,
    goodHours: hours.filter((x) => x.god.hoangDao),
    clashZodiac: ZODIAC_ANIMALS[clash]!,
    clashBranch: EARTHLY_BRANCHES[clash]!,
  };
}
