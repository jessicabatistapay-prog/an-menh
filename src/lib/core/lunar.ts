/**
 * Chuyển đổi dương lịch → âm lịch Việt Nam.
 *
 * Phương pháp (viết lại độc lập trong dự án này, không sao chép thư viện bên ngoài):
 * - Thời điểm sóc (trăng mới) và kinh độ Mặt Trời theo các công thức gần đúng
 *   trong Jean Meeus, "Astronomical Algorithms" (Willmann-Bell, 2nd ed., 1998)
 *   và "Astronomical Formulae for Calculators".
 * - Quy tắc lập lịch âm Việt Nam như Hồ Ngọc Đức mô tả trong bài
 *   "Thuật toán tính âm lịch" (Đại học Leipzig):
 *     1. Ngày đầu tháng âm là ngày chứa thời điểm sóc (theo giờ địa phương).
 *     2. Tháng 11 âm lịch luôn chứa ngày Đông chí.
 *     3. Năm có 13 tháng thì tháng nhuận là tháng đầu tiên (sau tháng 11 năm trước)
 *        không chứa trung khí.
 * - Múi giờ: UTC+7 (giờ Việt Nam). Kết quả có thể khác lịch Trung Quốc (UTC+8)
 *   ở một số năm, ví dụ Tết Ất Sửu 1985 và Tết Đinh Hợi 2007.
 *
 * Phạm vi hỗ trợ: 31/01/1900 – 31/12/2100 (đã kiểm thử).
 */

import {
  type CalendarDate,
  VIETNAM_TIMEZONE_OFFSET,
  fromJulianDayNumber,
  isValidCalendarDate,
  isWithinSupportedRange,
  julianDayNumber,
} from "./date";

export interface LunarDate {
  year: number;
  month: number; // 1..12
  day: number; // 1..30
  isLeapMonth: boolean;
  /** Số ngày của tháng âm này (29 hoặc 30). */
  monthLength: number;
}

const DEG = Math.PI / 180;
/** Ngày Julius của sóc tham chiếu 1/1/1900 (k = 0). */
const NEW_MOON_EPOCH = 2415021.076998695;
const SYNODIC_MONTH = 29.530588853;

/** Thời điểm sóc thứ k tính từ sóc 1/1/1900, theo ngày Julius (giờ TT ≈ UT). */
export function newMoonJulianDate(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  let jd =
    2415020.75933 +
    29.53058868 * k +
    0.0001178 * T2 -
    0.000000155 * T3 +
    0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * DEG);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3; // dị thường trung bình Mặt Trời
  const Mp = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3; // dị thường trung bình Mặt Trăng
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3; // đối số vĩ độ Mặt Trăng
  const correction =
    (0.1734 - 0.000393 * T) * Math.sin(M * DEG) +
    0.0021 * Math.sin(2 * M * DEG) -
    0.4068 * Math.sin(Mp * DEG) +
    0.0161 * Math.sin(2 * Mp * DEG) -
    0.0004 * Math.sin(3 * Mp * DEG) +
    0.0104 * Math.sin(2 * F * DEG) -
    0.0051 * Math.sin((M + Mp) * DEG) -
    0.0074 * Math.sin((M - Mp) * DEG) +
    0.0004 * Math.sin((2 * F + M) * DEG) -
    0.0004 * Math.sin((2 * F - M) * DEG) -
    0.0006 * Math.sin((2 * F + Mp) * DEG) +
    0.001 * Math.sin((2 * F - Mp) * DEG) +
    0.0005 * Math.sin((2 * Mp + M) * DEG);
  const deltaT =
    T < -11
      ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
      : -0.000278 + 0.000265 * T + 0.000262 * T2;
  jd += correction - deltaT;
  return jd;
}

/** Kinh độ hoàng đạo của Mặt Trời (radian, 0..2π) tại ngày Julius jd. */
export function sunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const T2 = T * T;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  const center =
    (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(M * DEG) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M * DEG) +
    0.00029 * Math.sin(3 * M * DEG);
  let L = (L0 + center) * DEG;
  L -= 2 * Math.PI * Math.floor(L / (2 * Math.PI));
  return L;
}

/** Số ngày Julius (nguyên) của ngày chứa sóc thứ k theo giờ địa phương. */
function newMoonDay(k: number, tz: number): number {
  return Math.floor(newMoonJulianDate(k) + 0.5 + tz / 24);
}

/** Cung 30° (0..11) của kinh độ Mặt Trời lúc đầu ngày (0h giờ địa phương). */
function sunSector(dayNumber: number, tz: number): number {
  return Math.floor((sunLongitude(dayNumber - 0.5 - tz / 24) / Math.PI) * 6);
}

/** Ngày bắt đầu tháng 11 âm lịch (tháng chứa Đông chí) của năm dương lịch `year`. */
function lunarMonth11Start(year: number, tz: number): number {
  const offset = julianDayNumber({ year, month: 12, day: 31 }) - 2415021;
  const k = Math.floor(offset / SYNODIC_MONTH);
  let start = newMoonDay(k, tz);
  // Cung 9 tương ứng kinh độ 270° (Đông chí). Nếu đầu tháng đã qua Đông chí thì lùi một tháng.
  if (sunSector(start, tz) >= 9) start = newMoonDay(k - 1, tz);
  return start;
}

/** Vị trí (tính từ tháng 11) của tháng nhuận trong năm âm có 13 tháng. */
function leapMonthOffset(month11Start: number, tz: number): number {
  const k = Math.floor((month11Start - NEW_MOON_EPOCH) / SYNODIC_MONTH + 0.5);
  let i = 1;
  let sector = sunSector(newMoonDay(k + i, tz), tz);
  let last: number;
  do {
    last = sector;
    i++;
    sector = sunSector(newMoonDay(k + i, tz), tz);
  } while (sector !== last && i < 14);
  return i - 1;
}

export class UnsupportedDateError extends Error {
  constructor(message = "Ngày nằm ngoài phạm vi hỗ trợ (31/01/1900 – 31/12/2100).") {
    super(message);
    this.name = "UnsupportedDateError";
  }
}

/** Chuyển một ngày dương lịch sang âm lịch Việt Nam (UTC+7). */
export function solarToLunar(date: CalendarDate, tz: number = VIETNAM_TIMEZONE_OFFSET): LunarDate {
  if (!isValidCalendarDate(date)) throw new RangeError("Ngày dương lịch không hợp lệ.");
  if (!isWithinSupportedRange(date)) throw new UnsupportedDateError();

  const dayNumber = julianDayNumber(date);
  // Ước lượng chỉ số sóc rồi hiệu chỉnh để ngày đang xét nằm trong [sóc k, sóc k+1).
  // (Ước lượng tuyến tính có thể lệch một tháng khi sóc rơi sát nửa đêm.)
  let k = Math.floor((dayNumber - NEW_MOON_EPOCH) / SYNODIC_MONTH) + 1;
  while (newMoonDay(k, tz) > dayNumber) k--;
  while (newMoonDay(k + 1, tz) <= dayNumber) k++;
  const monthStart = newMoonDay(k, tz);
  const nextMonthStart = newMoonDay(k + 1, tz);

  let a11 = lunarMonth11Start(date.year, tz);
  let b11 = a11;
  let lunarYear: number;
  if (a11 >= monthStart) {
    lunarYear = date.year;
    a11 = lunarMonth11Start(date.year - 1, tz);
  } else {
    lunarYear = date.year + 1;
    b11 = lunarMonth11Start(date.year + 1, tz);
  }

  const day = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let isLeapMonth = false;
  let month = diff + 11;
  if (b11 - a11 > 365) {
    const leapDiff = leapMonthOffset(a11, tz);
    if (diff >= leapDiff) {
      month = diff + 10;
      if (diff === leapDiff) isLeapMonth = true;
    }
  }
  if (month > 12) month -= 12;
  if (month >= 11 && diff < 4) lunarYear -= 1;

  return { year: lunarYear, month, day, isLeapMonth, monthLength: nextMonthStart - monthStart };
}

/** Ngày Tết Nguyên đán (mùng 1 tháng Giêng) của năm âm lịch `lunarYear`, theo dương lịch. */
const tetCache = new Map<string, CalendarDate>();

export function lunarNewYearDate(lunarYear: number, tz: number = VIETNAM_TIMEZONE_OFFSET): CalendarDate {
  const key = `${lunarYear}@${tz}`;
  const cached = tetCache.get(key);
  if (cached) return { ...cached };
  // Tết luôn rơi trong khoảng 20/01 – 21/02 dương lịch. Tìm ngày đầu tiên có âm lịch 1/1 (không nhuận).
  const start = julianDayNumber({ year: lunarYear, month: 1, day: 15 });
  for (let jdn = start; jdn < start + 45; jdn++) {
    const d = fromJulianDayNumber(jdn);
    if (!isWithinSupportedRange(d)) continue;
    const l = solarToLunar(d, tz);
    if (l.year === lunarYear && l.month === 1 && l.day === 1 && !l.isLeapMonth) {
      tetCache.set(key, d);
      return { ...d };
    }
  }
  throw new UnsupportedDateError(`Không xác định được Tết năm ${lunarYear} trong phạm vi hỗ trợ.`);
}

export interface LunarDateInput {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
}

/**
 * Đổi ngày âm lịch Việt Nam (UTC+7) sang dương lịch.
 * Trả về null nếu ngày âm không tồn tại (ví dụ ngày 30 của tháng thiếu, tháng nhuận không có
 * trong năm đó) hoặc nằm ngoài phạm vi hỗ trợ. Kết quả luôn được kiểm tra ngược bằng solarToLunar.
 */
export function lunarToSolar(input: LunarDateInput, tz: number = VIETNAM_TIMEZONE_OFFSET): CalendarDate | null {
  const { year, month, day, isLeapMonth } = input;
  if (![year, month, day].every(Number.isInteger)) return null;
  if (month < 1 || month > 12 || day < 1 || day > 30) return null;
  let tet: CalendarDate;
  try {
    tet = lunarNewYearDate(year, tz);
  } catch {
    return null;
  }
  // Đi lần lượt từng tháng âm kể từ Tết cho đến khi gặp tháng cần tìm.
  let start = julianDayNumber(tet);
  for (let i = 0; i < 14; i++) {
    const d = fromJulianDayNumber(start);
    if (!isWithinSupportedRange(d)) return null;
    const l = solarToLunar(d, tz);
    if (l.year !== year) return null;
    if (l.month === month && l.isLeapMonth === isLeapMonth) {
      if (day > l.monthLength) return null;
      const result = fromJulianDayNumber(start + day - 1);
      return isWithinSupportedRange(result) ? result : null;
    }
    start += l.monthLength;
  }
  return null;
}

/** Tháng nhuận của năm âm lịch (1..12), hoặc null nếu năm không nhuận. */
export function leapMonthOfYear(year: number, tz: number = VIETNAM_TIMEZONE_OFFSET): number | null {
  for (let m = 1; m <= 12; m++) if (lunarToSolar({ year, month: m, day: 1, isLeapMonth: true }, tz)) return m;
  return null;
}

const LUNAR_MONTH_NAMES = [
  "Giêng",
  "Hai",
  "Ba",
  "Tư",
  "Năm",
  "Sáu",
  "Bảy",
  "Tám",
  "Chín",
  "Mười",
  "Mười Một",
  "Chạp",
];

export function lunarMonthName(month: number, isLeap = false): string {
  const name = LUNAR_MONTH_NAMES[month - 1] ?? String(month);
  return `tháng ${name}${isLeap ? " (nhuận)" : ""}`;
}

export function formatLunarDate(l: LunarDate): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(l.day)}/${pad(l.month)}${l.isLeapMonth ? " nhuận" : ""} âm lịch`;
}
