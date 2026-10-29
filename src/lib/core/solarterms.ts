/**
 * 24 tiết khí: mỗi tiết bắt đầu khi kinh độ hoàng đạo của Mặt Trời đạt bội số của 15°.
 * Xuân phân ứng với 0°. Dùng cùng hàm kinh độ Mặt Trời (Meeus) với bộ âm lịch, theo giờ Việt Nam.
 * Ngày bắt đầu tiết là ngày (giờ địa phương) chứa thời điểm Mặt Trời đi qua mốc.
 */

import { type CalendarDate, VIETNAM_TIMEZONE_OFFSET, fromJulianDayNumber, julianDayNumber } from "./date";
import { sunLongitude } from "./lunar";

export const SOLAR_TERMS = [
  "Xuân phân",
  "Thanh minh",
  "Cốc vũ",
  "Lập hạ",
  "Tiểu mãn",
  "Mang chủng",
  "Hạ chí",
  "Tiểu thử",
  "Đại thử",
  "Lập thu",
  "Xử thử",
  "Bạch lộ",
  "Thu phân",
  "Hàn lộ",
  "Sương giáng",
  "Lập đông",
  "Tiểu tuyết",
  "Đại tuyết",
  "Đông chí",
  "Tiểu hàn",
  "Đại hàn",
  "Lập xuân",
  "Vũ thủy",
  "Kinh trập",
] as const;

/** Chỉ số tiết (0..23) tại thời điểm Julius jd. */
function termIndexAt(jd: number): number {
  return Math.floor(sunLongitude(jd) / (Math.PI / 12)) % 24;
}

/** Thời điểm cuối ngày (24h giờ địa phương) theo ngày Julius. */
function endOfDay(date: CalendarDate, tz: number) {
  return julianDayNumber(date) + 0.5 - tz / 24;
}

export interface SolarTermInfo {
  index: number;
  name: string;
  /** Tiết bắt đầu đúng ngày này. */
  startsToday: boolean;
}

/** Tiết khí của một ngày (tính đến cuối ngày, nên ngày bắt đầu tiết thuộc tiết mới). */
export function solarTermOf(date: CalendarDate, tz: number = VIETNAM_TIMEZONE_OFFSET): SolarTermInfo {
  const end = endOfDay(date, tz);
  const index = termIndexAt(end);
  const startsToday = termIndexAt(end - 1) !== index;
  return { index, name: SOLAR_TERMS[index]!, startsToday };
}

/** Danh sách ngày bắt đầu 24 tiết khí trong một năm dương lịch. */
export function solarTermsOfYear(year: number, tz: number = VIETNAM_TIMEZONE_OFFSET): { name: string; date: CalendarDate }[] {
  const start = julianDayNumber({ year, month: 1, day: 1 });
  const end = julianDayNumber({ year: year + 1, month: 1, day: 1 });
  const out: { name: string; date: CalendarDate }[] = [];
  for (let j = start; j < end; j++) {
    const d = fromJulianDayNumber(j);
    const t = solarTermOf(d, tz);
    if (t.startsToday) out.push({ name: t.name, date: d });
  }
  return out;
}
