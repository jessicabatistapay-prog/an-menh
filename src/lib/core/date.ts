/**
 * Ngày dương lịch được xử lý như một "ngày lịch" thuần (năm, tháng, ngày),
 * KHÔNG dùng đối tượng Date của JavaScript để tránh lệch ngày do múi giờ/UTC.
 */

export interface CalendarDate {
  year: number;
  month: number; // 1..12
  day: number; // 1..31
}

/** Phạm vi ngày dương lịch được hỗ trợ cho các phép tính âm lịch. */
export const SUPPORTED_MIN: CalendarDate = { year: 1900, month: 1, day: 31 };
export const SUPPORTED_MAX: CalendarDate = { year: 2100, month: 12, day: 31 };

/** Múi giờ Việt Nam (UTC+7) dùng cho mọi phép tính âm lịch. */
export const VIETNAM_TIMEZONE_OFFSET = 7;
export const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";

export function isGregorianLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  const table = [31, isGregorianLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return table[month - 1] ?? 0;
}

export function isValidCalendarDate(d: CalendarDate): boolean {
  return (
    Number.isInteger(d.year) &&
    Number.isInteger(d.month) &&
    Number.isInteger(d.day) &&
    d.month >= 1 &&
    d.month <= 12 &&
    d.day >= 1 &&
    d.day <= daysInMonth(d.year, d.month)
  );
}

export function compareDates(a: CalendarDate, b: CalendarDate): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

export function isWithinSupportedRange(d: CalendarDate): boolean {
  return compareDates(d, SUPPORTED_MIN) >= 0 && compareDates(d, SUPPORTED_MAX) <= 0;
}

export type ParseDateError = "empty" | "format" | "invalid";

/** Phân tích chuỗi "YYYY-MM-DD" (giá trị của <input type="date">). */
export function parseISODate(
  value: string | null | undefined,
): { ok: true; date: CalendarDate } | { ok: false; error: ParseDateError } {
  if (value === null || value === undefined || value.trim() === "") {
    return { ok: false, error: "empty" };
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return { ok: false, error: "format" };
  const date: CalendarDate = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
  if (!isValidCalendarDate(date)) return { ok: false, error: "invalid" };
  return { ok: true, date };
}

export function toISODate(d: CalendarDate): string {
  const pad = (n: number, len = 2) => String(n).padStart(len, "0");
  return `${pad(d.year, 4)}-${pad(d.month)}-${pad(d.day)}`;
}

export function formatVietnameseDate(d: CalendarDate): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.day)}/${pad(d.month)}/${d.year}`;
}

/**
 * Số ngày Julius (Julian Day Number) của một ngày dương lịch Gregory.
 * Công thức số nguyên chuẩn (Fliegel & Van Flandern, 1968).
 */
export function julianDayNumber(d: CalendarDate): number {
  const a = Math.floor((14 - d.month) / 12);
  const y = d.year + 4800 - a;
  const m = d.month + 12 * a - 3;
  return (
    d.day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/** Đổi ngược từ số ngày Julius về ngày dương lịch Gregory. */
export function fromJulianDayNumber(jdn: number): CalendarDate {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    day: e - Math.floor((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * Math.floor(m / 10),
    year: 100 * b + d - 4800 + Math.floor(m / 10),
  };
}

const WEEKDAYS_VI = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

export function weekdayVi(d: CalendarDate): string {
  // JDN mod 7: 0 = Thứ Hai
  return WEEKDAYS_VI[julianDayNumber(d) % 7] ?? "";
}

/** Ngày hiện tại theo giờ Việt Nam, bất kể múi giờ của thiết bị. */
export function todayInVietnam(now: Date = new Date()): CalendarDate {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: VIETNAM_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}
