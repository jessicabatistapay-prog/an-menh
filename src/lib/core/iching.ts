/**
 * Kinh Dịch – 64 quẻ theo thứ tự Văn Vương (King Wen) và phép gieo ba đồng xu.
 *
 * Phép gieo (cách phổ biến, tương đương xác suất phép cỏ thi rút gọn):
 *  - Mỗi hào gieo 3 đồng xu; mặt ngửa = 3, mặt sấp = 2. Tổng:
 *      6 = lão âm (âm động, biến thành dương) · 7 = thiếu dương · 8 = thiếu âm · 9 = lão dương (dương động, biến thành âm)
 *  - Gieo 6 lần, hào đầu tiên là hào dưới cùng (hào sơ).
 *  - Quẻ chủ gồm 6 hào vừa gieo; nếu có hào động thì đổi các hào đó để được quẻ biến.
 *
 * Quẻ đơn (bát quái), hào tính từ dưới lên, 1 = dương:
 *   Càn 111 · Đoài 110 · Ly 101 · Chấn 100 · Tốn 011 · Khảm 010 · Cấn 001 · Khôn 000
 * Bảng tra số quẻ theo (quẻ trên, quẻ dưới) là bảng chuẩn của thứ tự Văn Vương.
 */

export type TrigramName = "can" | "doai" | "ly" | "chan" | "ton" | "kham" | "cang" | "khon";

export interface TrigramInfo {
  key: TrigramName;
  name: string;
  /** Hình tượng tự nhiên dùng khi đọc tên quẻ kép (Thiên, Địa, Lôi...). */
  nature: string;
  symbol: string;
  /** Hào từ dưới lên, true = dương. */
  lines: [boolean, boolean, boolean];
}

export const ICHING_TRIGRAMS: Record<TrigramName, TrigramInfo> = {
  can: { key: "can", name: "Càn", nature: "Thiên", symbol: "☰", lines: [true, true, true] },
  doai: { key: "doai", name: "Đoài", nature: "Trạch", symbol: "☱", lines: [true, true, false] },
  ly: { key: "ly", name: "Ly", nature: "Hỏa", symbol: "☲", lines: [true, false, true] },
  chan: { key: "chan", name: "Chấn", nature: "Lôi", symbol: "☳", lines: [true, false, false] },
  ton: { key: "ton", name: "Tốn", nature: "Phong", symbol: "☴", lines: [false, true, true] },
  kham: { key: "kham", name: "Khảm", nature: "Thủy", symbol: "☵", lines: [false, true, false] },
  cang: { key: "cang", name: "Cấn", nature: "Sơn", symbol: "☶", lines: [false, false, true] },
  khon: { key: "khon", name: "Khôn", nature: "Địa", symbol: "☷", lines: [false, false, false] },
};

const TABLE_ORDER: TrigramName[] = ["can", "chan", "kham", "cang", "khon", "ton", "ly", "doai"];

/** KING_WEN[quẻ dưới][quẻ trên] theo thứ tự TABLE_ORDER. */
const KING_WEN: number[][] = [
  [1, 34, 5, 26, 11, 9, 14, 43], // dưới Càn
  [25, 51, 3, 27, 24, 42, 21, 17], // dưới Chấn
  [6, 40, 29, 4, 7, 59, 64, 47], // dưới Khảm
  [33, 62, 39, 52, 15, 53, 56, 31], // dưới Cấn
  [12, 16, 8, 23, 2, 20, 35, 45], // dưới Khôn
  [44, 32, 48, 18, 46, 57, 50, 28], // dưới Tốn
  [13, 55, 63, 22, 36, 37, 30, 49], // dưới Ly
  [10, 54, 60, 41, 19, 61, 38, 58], // dưới Đoài
];

/** Tên ngắn (Hán Việt) và chữ Hán của 64 quẻ, theo số thứ tự. */
const NAMES: [string, string][] = [
  ["Càn", "乾"], ["Khôn", "坤"], ["Truân", "屯"], ["Mông", "蒙"], ["Nhu", "需"], ["Tụng", "訟"], ["Sư", "師"], ["Tỷ", "比"],
  ["Tiểu Súc", "小畜"], ["Lý", "履"], ["Thái", "泰"], ["Bĩ", "否"], ["Đồng Nhân", "同人"], ["Đại Hữu", "大有"], ["Khiêm", "謙"], ["Dự", "豫"],
  ["Tùy", "隨"], ["Cổ", "蠱"], ["Lâm", "臨"], ["Quan", "觀"], ["Phệ Hạp", "噬嗑"], ["Bí", "賁"], ["Bác", "剝"], ["Phục", "復"],
  ["Vô Vọng", "無妄"], ["Đại Súc", "大畜"], ["Di", "頤"], ["Đại Quá", "大過"], ["Khảm", "坎"], ["Ly", "離"], ["Hàm", "咸"], ["Hằng", "恆"],
  ["Độn", "遯"], ["Đại Tráng", "大壯"], ["Tấn", "晉"], ["Minh Di", "明夷"], ["Gia Nhân", "家人"], ["Khuê", "睽"], ["Kiển", "蹇"], ["Giải", "解"],
  ["Tổn", "損"], ["Ích", "益"], ["Quải", "夬"], ["Cấu", "姤"], ["Tụy", "萃"], ["Thăng", "升"], ["Khốn", "困"], ["Tỉnh", "井"],
  ["Cách", "革"], ["Đỉnh", "鼎"], ["Chấn", "震"], ["Cấn", "艮"], ["Tiệm", "漸"], ["Quy Muội", "歸妹"], ["Phong", "豐"], ["Lữ", "旅"],
  ["Tốn", "巽"], ["Đoài", "兌"], ["Hoán", "渙"], ["Tiết", "節"], ["Trung Phu", "中孚"], ["Tiểu Quá", "小過"], ["Ký Tế", "既濟"], ["Vị Tế", "未濟"],
];

export interface Hexagram {
  number: number; // 1..64
  shortName: string;
  hanzi: string;
  /** Tên đầy đủ kiểu Việt Nam, ví dụ "Thủy Lôi Truân", "Thuần Càn". */
  fullName: string;
  upper: TrigramInfo;
  lower: TrigramInfo;
  /** 6 hào từ dưới lên, true = dương. */
  lines: boolean[];
}

function trigramFromLines(l: boolean[]): TrigramInfo {
  const found = Object.values(ICHING_TRIGRAMS).find((t) => t.lines.every((v, i) => v === l[i]));
  if (!found) throw new RangeError("Hào không hợp lệ.");
  return found;
}

export function hexagramFromLines(lines: boolean[]): Hexagram {
  if (lines.length !== 6) throw new RangeError("Một quẻ cần đúng 6 hào.");
  const lower = trigramFromLines(lines.slice(0, 3));
  const upper = trigramFromLines(lines.slice(3, 6));
  const number = KING_WEN[TABLE_ORDER.indexOf(lower.key)]![TABLE_ORDER.indexOf(upper.key)]!;
  const [shortName, hanzi] = NAMES[number - 1]!;
  const fullName = upper.key === lower.key ? `Thuần ${shortName}` : `${upper.nature} ${lower.nature} ${shortName}`;
  return { number, shortName, hanzi, fullName, upper, lower, lines: [...lines] };
}

export function hexagramByNumber(n: number): Hexagram {
  for (let lo = 0; lo < 8; lo++)
    for (let up = 0; up < 8; up++)
      if (KING_WEN[lo]![up] === n)
        return hexagramFromLines([...ICHING_TRIGRAMS[TABLE_ORDER[lo]!].lines, ...ICHING_TRIGRAMS[TABLE_ORDER[up]!].lines]);
  throw new RangeError("Số quẻ phải từ 1 đến 64.");
}

export type LineValue = 6 | 7 | 8 | 9;

export interface CoinToss {
  /** true = mặt ngửa (3 điểm). */
  coins: [boolean, boolean, boolean];
  value: LineValue;
}

/** Gieo 3 đồng xu cho một hào. `random` trả về số trong [0, 1). */
export function tossLine(random: () => number): CoinToss {
  const coins = [random() < 0.5, random() < 0.5, random() < 0.5] as [boolean, boolean, boolean];
  const value = coins.reduce<number>((s, h) => s + (h ? 3 : 2), 0) as LineValue;
  return { coins, value };
}

export const LINE_LABELS: Record<LineValue, string> = {
  6: "Lão âm (âm động)",
  7: "Thiếu dương",
  8: "Thiếu âm",
  9: "Lão dương (dương động)",
};

export function isYang(v: LineValue) {
  return v === 7 || v === 9;
}

export function isMoving(v: LineValue) {
  return v === 6 || v === 9;
}

export interface Reading {
  values: LineValue[];
  primary: Hexagram;
  /** Quẻ biến, chỉ có khi có hào động. */
  changed: Hexagram | null;
  /** Vị trí hào động, 1 = hào sơ (dưới cùng). */
  movingLines: number[];
}

export function readingFromValues(values: LineValue[]): Reading {
  if (values.length !== 6 || values.some((v) => ![6, 7, 8, 9].includes(v))) throw new RangeError("Cần đúng 6 hào hợp lệ.");
  const primary = hexagramFromLines(values.map(isYang));
  const movingLines = values.flatMap((v, i) => (isMoving(v) ? [i + 1] : []));
  const changed = movingLines.length ? hexagramFromLines(values.map((v) => (isMoving(v) ? !isYang(v) : isYang(v)))) : null;
  return { values: [...values], primary, changed, movingLines };
}

export const LINE_POSITION_NAMES = ["Hào sơ", "Hào nhị", "Hào tam", "Hào tứ", "Hào ngũ", "Hào thượng"];
