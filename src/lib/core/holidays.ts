/**
 * Ngày lễ, Tết truyền thống (theo âm lịch) và một số ngày lễ, kỷ niệm theo dương lịch ở Việt Nam.
 * Danh sách chỉ để hiển thị trên lịch; không phải lịch nghỉ lễ chính thức.
 */

import type { CalendarDate } from "./date";
import type { LunarDate } from "./lunar";

interface DayRule {
  month: number;
  day: number;
  name: string;
}

export const LUNAR_HOLIDAYS: readonly DayRule[] = [
  { month: 1, day: 1, name: "Tết Nguyên đán" },
  { month: 1, day: 15, name: "Tết Nguyên tiêu (Rằm tháng Giêng)" },
  { month: 3, day: 3, name: "Tết Hàn thực" },
  { month: 3, day: 10, name: "Giỗ Tổ Hùng Vương" },
  { month: 4, day: 15, name: "Lễ Phật đản" },
  { month: 5, day: 5, name: "Tết Đoan ngọ" },
  { month: 7, day: 15, name: "Lễ Vu lan" },
  { month: 8, day: 15, name: "Tết Trung thu" },
  { month: 12, day: 23, name: "Ông Công ông Táo" },
];

export const SOLAR_HOLIDAYS: readonly DayRule[] = [
  { month: 1, day: 1, name: "Tết Dương lịch" },
  { month: 3, day: 8, name: "Quốc tế Phụ nữ" },
  { month: 4, day: 30, name: "Ngày Giải phóng miền Nam, thống nhất đất nước" },
  { month: 5, day: 1, name: "Quốc tế Lao động" },
  { month: 6, day: 1, name: "Quốc tế Thiếu nhi" },
  { month: 9, day: 2, name: "Quốc khánh" },
  { month: 10, day: 20, name: "Ngày Phụ nữ Việt Nam" },
  { month: 11, day: 20, name: "Ngày Nhà giáo Việt Nam" },
];

export interface HolidayInfo {
  name: string;
  calendar: "am" | "duong";
}

export function holidaysOf(solar: CalendarDate, lunar: LunarDate): HolidayInfo[] {
  const out: HolidayInfo[] = [];
  if (!lunar.isLeapMonth) {
    for (const h of LUNAR_HOLIDAYS) if (h.month === lunar.month && h.day === lunar.day) out.push({ name: h.name, calendar: "am" });
    if (lunar.month === 12 && lunar.day === lunar.monthLength) out.push({ name: "Giao thừa (Tất niên)", calendar: "am" });
  }
  for (const h of SOLAR_HOLIDAYS) if (h.month === solar.month && h.day === solar.day) out.push({ name: h.name, calendar: "duong" });
  return out;
}
