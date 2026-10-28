/**
 * Cung phi (Mệnh quái) và Bát trạch.
 *
 * NGUỒN VÀ QUY ƯỚC
 * - Hệ Bát trạch: bảng du niên (Sinh Khí, Thiên Y, Diên Niên, Phục Vị, Họa Hại, Ngũ Quỷ,
 *   Lục Sát, Tuyệt Mệnh) theo "Bát trạch minh kính" (八宅明鏡), một văn bản phong thủy cổ
 *   được lưu truyền rộng rãi. Bảng trong mã được kiểm tra tính nhất quán bằng tests
 *   (mỗi cung đủ 8 hướng, quan hệ giữa hai cung là đối xứng, 4 hướng tốt thuộc đúng nhóm).
 * - Cung phi tính theo số Lạc Thư (Hậu thiên bát quái) từ NĂM ÂM LỊCH (chuyển năm tại
 *   Tết Nguyên đán) và giới tính theo quy ước truyền thống:
 *     Nam: k = (11 − (năm mod 9)) mod 9, k = 0 → 9; k = 5 → Khôn (2).
 *     Nữ:  k = (năm mod 9 + 4) mod 9,   k = 0 → 9; k = 5 → Cấn (8).
 *   Công thức này tương đương các bảng tra quen thuộc: nam 1900–1999 lấy 10 trừ tổng rút gọn
 *   của hai số cuối năm sinh; nữ cộng 5; từ 2000 trở đi nam lấy 9 trừ, nữ cộng 6.
 * - Ứng dụng KHÔNG dùng mốc Lập Xuân cho cung phi để không trộn hai quy ước chuyển năm.
 *
 * Ghi chú: một số trường phái khác dùng Lập Xuân (khoảng 4/2 dương lịch) làm mốc chuyển năm.
 */

import type { ElementKey } from "./elements";

export type Gender = "nam" | "nu";

export type Direction = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

export const DIRECTIONS: readonly Direction[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

export const DIRECTION_NAMES: Record<Direction, string> = {
  N: "Bắc",
  NE: "Đông Bắc",
  E: "Đông",
  SE: "Đông Nam",
  S: "Nam",
  SW: "Tây Nam",
  W: "Tây",
  NW: "Tây Bắc",
};

export const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  N: "S",
  NE: "SW",
  E: "W",
  SE: "NW",
  S: "N",
  SW: "NE",
  W: "E",
  NW: "SE",
};

export type TrigramKey = "kham" | "khon" | "chan" | "ton" | "can" | "doai" | "cang" | "ly";

export type Group = "dong" | "tay";

export interface Trigram {
  key: TrigramKey;
  /** Số Lạc Thư. */
  number: 1 | 2 | 3 | 4 | 6 | 7 | 8 | 9;
  name: string;
  /** Hướng Phục Vị / vị trí trên Hậu thiên bát quái. */
  direction: Direction;
  element: ElementKey;
  group: Group;
}

export const TRIGRAMS: Record<TrigramKey, Trigram> = {
  kham: { key: "kham", number: 1, name: "Khảm", direction: "N", element: "thuy", group: "dong" },
  khon: { key: "khon", number: 2, name: "Khôn", direction: "SW", element: "tho", group: "tay" },
  chan: { key: "chan", number: 3, name: "Chấn", direction: "E", element: "moc", group: "dong" },
  ton: { key: "ton", number: 4, name: "Tốn", direction: "SE", element: "moc", group: "dong" },
  can: { key: "can", number: 6, name: "Càn", direction: "NW", element: "kim", group: "tay" },
  doai: { key: "doai", number: 7, name: "Đoài", direction: "W", element: "kim", group: "tay" },
  cang: { key: "cang", number: 8, name: "Cấn", direction: "NE", element: "tho", group: "tay" },
  ly: { key: "ly", number: 9, name: "Ly", direction: "S", element: "hoa", group: "dong" },
};

const BY_NUMBER: Record<number, TrigramKey> = {
  1: "kham",
  2: "khon",
  3: "chan",
  4: "ton",
  6: "can",
  7: "doai",
  8: "cang",
  9: "ly",
};

export const GROUP_NAMES: Record<Group, string> = {
  dong: "Đông tứ mệnh",
  tay: "Tây tứ mệnh",
};

export interface CungPhiResult {
  trigram: Trigram;
  /** Số Lạc Thư thô trước khi xử lý số 5. */
  rawNumber: number;
  lunarYear: number;
  gender: Gender;
}

export function cungPhi(lunarYear: number, gender: Gender): CungPhiResult {
  if (!Number.isInteger(lunarYear)) throw new RangeError("Năm không hợp lệ.");
  const m = ((lunarYear % 9) + 9) % 9;
  let k = gender === "nam" ? (11 - m) % 9 : (m + 4) % 9;
  if (k === 0) k = 9;
  const raw = k;
  if (k === 5) k = gender === "nam" ? 2 : 8;
  const key = BY_NUMBER[k];
  if (!key) throw new RangeError("Không xác định được cung phi.");
  return { trigram: TRIGRAMS[key], rawNumber: raw, lunarYear, gender };
}

export type StarKey =
  | "sinhKhi"
  | "thienY"
  | "dienNien"
  | "phucVi"
  | "hoaHai"
  | "nguQuy"
  | "lucSat"
  | "tuyetMenh";

export interface Star {
  key: StarKey;
  name: string;
  favorable: boolean;
  /** Ý nghĩa truyền thống, diễn đạt nhẹ nhàng, không đe dọa. */
  traditionalMeaning: string;
}

export const STARS: Record<StarKey, Star> = {
  sinhKhi: {
    key: "sinhKhi",
    name: "Sinh Khí",
    favorable: true,
    traditionalMeaning: "Quan niệm truyền thống gắn với sinh lực, sự khởi sắc và chủ động.",
  },
  thienY: {
    key: "thienY",
    name: "Thiên Y",
    favorable: true,
    traditionalMeaning: "Quan niệm truyền thống gắn với sự an dưỡng, nghỉ ngơi và hồi phục.",
  },
  dienNien: {
    key: "dienNien",
    name: "Diên Niên",
    favorable: true,
    traditionalMeaning: "Quan niệm truyền thống gắn với sự gắn kết, hòa thuận và bền lâu.",
  },
  phucVi: {
    key: "phucVi",
    name: "Phục Vị",
    favorable: true,
    traditionalMeaning: "Quan niệm truyền thống gắn với sự ổn định, tĩnh tâm và tập trung.",
  },
  hoaHai: {
    key: "hoaHai",
    name: "Họa Hại",
    favorable: false,
    traditionalMeaning: "Được xếp vào nhóm hướng kém thuận theo Bát trạch; thường gợi ý ưu tiên hướng khác nếu có lựa chọn.",
  },
  nguQuy: {
    key: "nguQuy",
    name: "Ngũ Quỷ",
    favorable: false,
    traditionalMeaning: "Được xếp vào nhóm hướng kém thuận theo Bát trạch; truyền thống khuyên chú ý sự hài hòa trong giao tiếp.",
  },
  lucSat: {
    key: "lucSat",
    name: "Lục Sát",
    favorable: false,
    traditionalMeaning: "Được xếp vào nhóm hướng kém thuận theo Bát trạch; truyền thống khuyên chú ý cân bằng các mối quan hệ.",
  },
  tuyetMenh: {
    key: "tuyetMenh",
    name: "Tuyệt Mệnh",
    favorable: false,
    traditionalMeaning: "Được xếp là hướng kém thuận nhất theo Bát trạch; nhiều người chọn bố trí hướng khác nếu điều kiện cho phép.",
  },
};

export const STAR_ORDER: readonly StarKey[] = [
  "sinhKhi",
  "thienY",
  "dienNien",
  "phucVi",
  "hoaHai",
  "nguQuy",
  "lucSat",
  "tuyetMenh",
];

/** Bảng du niên Bát trạch: hướng ứng với từng sao, theo cung phi. */
export const BAT_TRACH_TABLE: Record<TrigramKey, Record<StarKey, Direction>> = {
  kham: { sinhKhi: "SE", thienY: "E", dienNien: "S", phucVi: "N", hoaHai: "W", nguQuy: "NE", lucSat: "NW", tuyetMenh: "SW" },
  khon: { sinhKhi: "NE", thienY: "W", dienNien: "NW", phucVi: "SW", hoaHai: "E", nguQuy: "SE", lucSat: "S", tuyetMenh: "N" },
  chan: { sinhKhi: "S", thienY: "N", dienNien: "SE", phucVi: "E", hoaHai: "SW", nguQuy: "NW", lucSat: "NE", tuyetMenh: "W" },
  ton: { sinhKhi: "N", thienY: "S", dienNien: "E", phucVi: "SE", hoaHai: "NW", nguQuy: "SW", lucSat: "W", tuyetMenh: "NE" },
  can: { sinhKhi: "W", thienY: "NE", dienNien: "SW", phucVi: "NW", hoaHai: "SE", nguQuy: "E", lucSat: "N", tuyetMenh: "S" },
  doai: { sinhKhi: "NW", thienY: "SW", dienNien: "NE", phucVi: "W", hoaHai: "N", nguQuy: "S", lucSat: "SE", tuyetMenh: "E" },
  cang: { sinhKhi: "SW", thienY: "NW", dienNien: "W", phucVi: "NE", hoaHai: "S", nguQuy: "N", lucSat: "E", tuyetMenh: "SE" },
  ly: { sinhKhi: "E", thienY: "SE", dienNien: "N", phucVi: "S", hoaHai: "NE", nguQuy: "W", lucSat: "SW", tuyetMenh: "NW" },
};

/** Trạch (nhà) xác định theo hướng TỌA (lưng nhà), ngược với hướng mặt nhà. */
export const SITTING_TO_TRIGRAM: Record<Direction, TrigramKey> = {
  N: "kham",
  SW: "khon",
  E: "chan",
  SE: "ton",
  NW: "can",
  W: "doai",
  NE: "cang",
  S: "ly",
};

export function starForDirection(trigram: TrigramKey, direction: Direction): Star {
  const row = BAT_TRACH_TABLE[trigram];
  const key = STAR_ORDER.find((s) => row[s] === direction);
  if (!key) throw new RangeError("Hướng không hợp lệ.");
  return STARS[key];
}

export interface DirectionChartEntry {
  direction: Direction;
  star: Star;
}

export function directionChart(trigram: TrigramKey): DirectionChartEntry[] {
  return STAR_ORDER.map((key) => ({ direction: BAT_TRACH_TABLE[trigram][key], star: STARS[key] }));
}

export interface HouseEvaluation {
  person: Trigram;
  facing: Direction;
  sitting: Direction;
  /** Sao ứng với hướng mặt nhà, tính theo cung phi của người (quy ước "hướng nhà theo mệnh"). */
  facingStar: Star;
  /** Trạch của ngôi nhà, xác định theo hướng tọa. */
  houseTrigram: Trigram;
  /** Nhóm mệnh của người và nhóm trạch của nhà có cùng nhóm Đông/Tây không. */
  sameGroup: boolean;
  chart: DirectionChartEntry[];
}

export function evaluateHouse(person: TrigramKey, facing: Direction): HouseEvaluation {
  const sitting = OPPOSITE_DIRECTION[facing];
  const houseTrigram = TRIGRAMS[SITTING_TO_TRIGRAM[sitting]];
  const p = TRIGRAMS[person];
  return {
    person: p,
    facing,
    sitting,
    facingStar: starForDirection(person, facing),
    houseTrigram,
    sameGroup: houseTrigram.group === p.group,
    chart: directionChart(person),
  };
}
