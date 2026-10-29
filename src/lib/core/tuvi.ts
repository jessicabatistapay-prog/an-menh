/**
 * Lập lá số Tử Vi Đẩu Số (phần cơ bản).
 *
 * Phạm vi: an cung Mệnh, Thân, 12 cung, Can cung (Ngũ Hổ Độn), Cục, 14 chính tinh, Tứ Hóa,
 * phụ tinh (Văn Xương, Văn Khúc, Tả Phù, Hữu Bật, Lộc Tồn, Kình Dương, Đà La, Địa Không, Địa Kiếp,
 * Thiên Mã), Tuần, Triệt, vòng Trường Sinh, Mệnh chủ, Thân chủ và Đại hạn.
 * CHƯA có: Thiên Khôi – Thiên Việt, Hỏa Tinh – Linh Tinh, vòng Bác Sĩ, vòng Thái Tuế, Lưu niên, Tiểu hạn,
 * độ sáng (miếu, vượng, đắc, hãm) – vì các trường phái an những sao này khác nhau đáng kể.
 *
 * Quy ước:
 *  - Ngày, tháng, năm sinh theo âm lịch Việt Nam (UTC+7). Tháng nhuận tính như tháng chính cùng số.
 *  - Giờ sinh theo 12 chi; sinh từ 23h đến 24h vẫn tính giờ Tý của ngày đã nhập.
 *  - Tứ Hóa năm Nhâm theo sách Việt Nam phổ biến: Lương Lộc, Tử Quyền, Phủ Khoa, Vũ Kỵ
 *    (một số trường phái Trung Hoa dùng Tả Phù hóa Khoa).
 *
 * Đối chiếu: các vị trí an sao được kiểm tra với thư viện mã nguồn mở iztro (MIT) – xem scripts/verify-lunar.
 */

import { EARTHLY_BRANCHES, HEAVENLY_STEMS, canChiOfLunarYear, makeCanChi } from "./canchi";
import type { Gender } from "./battrach";
import type { ElementKey } from "./elements";
import { napAmOf } from "./napam";

const mod = (n: number, m: number) => ((n % m) + m) % m;

export const PALACE_NAMES = [
  "Mệnh",
  "Phụ Mẫu",
  "Phúc Đức",
  "Điền Trạch",
  "Quan Lộc",
  "Nô Bộc",
  "Thiên Di",
  "Tật Ách",
  "Tài Bạch",
  "Tử Tức",
  "Phu Thê",
  "Huynh Đệ",
] as const;
export type PalaceName = (typeof PALACE_NAMES)[number];

export const MAJOR_STARS = [
  "Tử Vi",
  "Thiên Cơ",
  "Thái Dương",
  "Vũ Khúc",
  "Thiên Đồng",
  "Liêm Trinh",
  "Thiên Phủ",
  "Thái Âm",
  "Tham Lang",
  "Cự Môn",
  "Thiên Tướng",
  "Thiên Lương",
  "Thất Sát",
  "Phá Quân",
] as const;
export type MajorStar = (typeof MAJOR_STARS)[number];

export const MINOR_STARS = [
  "Văn Xương",
  "Văn Khúc",
  "Tả Phù",
  "Hữu Bật",
  "Lộc Tồn",
  "Kình Dương",
  "Đà La",
  "Địa Không",
  "Địa Kiếp",
  "Thiên Mã",
] as const;
export type MinorStar = (typeof MINOR_STARS)[number];

export type Mutagen = "Lộc" | "Quyền" | "Khoa" | "Kỵ";

/** Tứ Hóa theo Thiên Can năm sinh: [Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ]. */
export const FOUR_TRANSFORMATIONS: Record<number, [string, string, string, string]> = {
  0: ["Liêm Trinh", "Phá Quân", "Vũ Khúc", "Thái Dương"], // Giáp
  1: ["Thiên Cơ", "Thiên Lương", "Tử Vi", "Thái Âm"], // Ất
  2: ["Thiên Đồng", "Thiên Cơ", "Văn Xương", "Liêm Trinh"], // Bính
  3: ["Thái Âm", "Thiên Đồng", "Thiên Cơ", "Cự Môn"], // Đinh
  4: ["Tham Lang", "Thái Âm", "Hữu Bật", "Thiên Cơ"], // Mậu
  5: ["Vũ Khúc", "Tham Lang", "Thiên Lương", "Văn Khúc"], // Kỷ
  6: ["Thái Dương", "Vũ Khúc", "Thái Âm", "Thiên Đồng"], // Canh
  7: ["Cự Môn", "Thái Dương", "Văn Khúc", "Văn Xương"], // Tân
  8: ["Thiên Lương", "Tử Vi", "Thiên Phủ", "Vũ Khúc"], // Nhâm
  9: ["Phá Quân", "Cự Môn", "Thái Âm", "Tham Lang"], // Quý
};
const MUTAGEN_ORDER: Mutagen[] = ["Lộc", "Quyền", "Khoa", "Kỵ"];

export const CHANG_SHENG = ["Trường Sinh", "Mộc Dục", "Quan Đới", "Lâm Quan", "Đế Vượng", "Suy", "Bệnh", "Tử", "Mộ", "Tuyệt", "Thai", "Dưỡng"] as const;

export const BUREAU: Record<ElementKey, { number: number; name: string }> = {
  thuy: { number: 2, name: "Thủy nhị cục" },
  moc: { number: 3, name: "Mộc tam cục" },
  kim: { number: 4, name: "Kim tứ cục" },
  tho: { number: 5, name: "Thổ ngũ cục" },
  hoa: { number: 6, name: "Hỏa lục cục" },
};

/** Mệnh chủ theo chi cung Mệnh. */
const SOUL_MASTER = ["Tham Lang", "Cự Môn", "Lộc Tồn", "Văn Khúc", "Liêm Trinh", "Vũ Khúc", "Phá Quân", "Vũ Khúc", "Liêm Trinh", "Văn Khúc", "Lộc Tồn", "Cự Môn"];
/** Thân chủ theo chi năm sinh. */
const BODY_MASTER = ["Hỏa Tinh", "Thiên Tướng", "Thiên Lương", "Thiên Đồng", "Văn Xương", "Thiên Cơ", "Hỏa Tinh", "Thiên Tướng", "Thiên Lương", "Thiên Đồng", "Văn Xương", "Thiên Cơ"];

export interface StarPlacement {
  name: string;
  kind: "chinh" | "phu";
  mutagen: Mutagen | null;
}

export interface Palace {
  /** Chi của cung (0 = Tý). */
  branch: number;
  branchName: string;
  stem: number;
  stemName: string;
  name: PalaceName;
  isBody: boolean;
  stars: StarPlacement[];
  changSheng: string;
  tuan: boolean;
  triet: boolean;
  decade: [number, number];
}

export interface TuViInput {
  lunarYear: number;
  lunarMonth: number; // 1..12 (tháng nhuận tính như tháng chính)
  lunarDay: number; // 1..30
  hour: number; // 0 = Tý .. 11 = Hợi
  gender: Gender;
}

export interface TuViChart {
  input: TuViInput;
  yearCanChi: string;
  yinYang: "Dương" | "Âm";
  /** Ví dụ "Dương Nam", "Âm Nữ". */
  yinYangGender: string;
  /** Đại hạn đi thuận (theo chiều tăng của chi) hay nghịch. */
  forward: boolean;
  bureau: { number: number; name: string; element: ElementKey };
  menhBranch: number;
  thanBranch: number;
  /** Cung mà Thân cư (một trong Mệnh, Phúc Đức, Quan Lộc, Thiên Di, Tài Bạch, Phu Thê). */
  thanPalace: PalaceName;
  menhNapAm: string;
  soulMaster: string;
  bodyMaster: string;
  /** 12 cung, chỉ số = chi (0 = Tý). */
  palaces: Palace[];
}

/** Vị trí Tử Vi theo ngày âm lịch và số cục. */
export function tuViPosition(day: number, bureau: number): number {
  const q = Math.ceil(day / bureau);
  const r = q * bureau - day;
  const base = 2 + (q - 1); // tính từ Dần
  return mod(r % 2 === 1 ? base - r : base + r, 12);
}

export function buildChart(input: TuViInput): TuViChart {
  const { lunarYear, lunarMonth: m, lunarDay: d, hour: h, gender } = input;
  if (!Number.isInteger(m) || m < 1 || m > 12) throw new RangeError("Tháng âm lịch không hợp lệ.");
  if (!Number.isInteger(d) || d < 1 || d > 30) throw new RangeError("Ngày âm lịch không hợp lệ.");
  if (!Number.isInteger(h) || h < 0 || h > 11) throw new RangeError("Giờ sinh không hợp lệ.");

  const year = canChiOfLunarYear(lunarYear);
  const yearStem = year.stemIndex;
  const yearBranch = year.branchIndex;
  const yang = yearStem % 2 === 0;
  const forward = (yang && gender === "nam") || (!yang && gender === "nu");

  const menh = mod(2 + (m - 1) - h, 12);
  const than = mod(2 + (m - 1) + h, 12);

  // Ngũ Hổ Độn: Can của cung Dần theo Can năm.
  const danStem = mod((yearStem % 5) * 2 + 2, 10);
  const stemOf = (branch: number) => mod(danStem + mod(branch - 2, 12), 10);

  const menhCanChi = makeCanChi(stemOf(menh), menh);
  const menhNapAm = napAmOf(menhCanChi);
  const bureau = { ...BUREAU[menhNapAm.element], element: menhNapAm.element };

  // Chính tinh
  const tv = tuViPosition(d, bureau.number);
  const tp = mod(4 - tv, 12);
  const majors: [MajorStar, number][] = [
    ["Tử Vi", tv],
    ["Thiên Cơ", tv - 1],
    ["Thái Dương", tv - 3],
    ["Vũ Khúc", tv - 4],
    ["Thiên Đồng", tv - 5],
    ["Liêm Trinh", tv - 8],
    ["Thiên Phủ", tp],
    ["Thái Âm", tp + 1],
    ["Tham Lang", tp + 2],
    ["Cự Môn", tp + 3],
    ["Thiên Tướng", tp + 4],
    ["Thiên Lương", tp + 5],
    ["Thất Sát", tp + 6],
    ["Phá Quân", tp + 10],
  ];

  // Phụ tinh
  const locTon = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0][yearStem]!;
  const thienMa = [2, 11, 8, 5][yearBranch % 4]!;
  const minors: [MinorStar, number][] = [
    ["Văn Xương", 10 - h],
    ["Văn Khúc", 4 + h],
    ["Tả Phù", 4 + (m - 1)],
    ["Hữu Bật", 10 - (m - 1)],
    ["Lộc Tồn", locTon],
    ["Kình Dương", locTon + 1],
    ["Đà La", locTon - 1],
    ["Địa Không", 11 - h],
    ["Địa Kiếp", 11 + h],
    ["Thiên Mã", thienMa],
  ];

  const trans = FOUR_TRANSFORMATIONS[yearStem]!;
  const mutagenOf = (name: string): Mutagen | null => {
    const i = trans.indexOf(name);
    return i >= 0 ? MUTAGEN_ORDER[i]! : null;
  };

  // Tuần: hai chi "không" của tuần chứa năm sinh. Triệt: theo Can năm.
  const tuanStartBranch = mod(yearBranch - yearStem, 12);
  const tuan = [mod(tuanStartBranch + 10, 12), mod(tuanStartBranch + 11, 12)];
  const trietPairs: [number, number][] = [
    [8, 9],
    [6, 7],
    [4, 5],
    [2, 3],
    [0, 1],
  ];
  const triet = trietPairs[yearStem % 5]!;

  // Vòng Trường Sinh
  const csStart: Record<ElementKey, number> = { thuy: 8, tho: 8, moc: 11, kim: 5, hoa: 2 };
  const cs0 = csStart[bureau.element];

  const palaces: Palace[] = Array.from({ length: 12 }, (_, b) => {
    const offset = mod(b - menh, 12);
    const decadeIndex = forward ? offset : mod(menh - b, 12);
    const start = bureau.number + decadeIndex * 10;
    const csIndex = forward ? mod(b - cs0, 12) : mod(cs0 - b, 12);
    return {
      branch: b,
      branchName: EARTHLY_BRANCHES[b]!,
      stem: stemOf(b),
      stemName: HEAVENLY_STEMS[stemOf(b)]!,
      name: PALACE_NAMES[offset]!,
      isBody: b === than,
      stars: [],
      changSheng: CHANG_SHENG[csIndex]!,
      tuan: tuan.includes(b),
      triet: triet.includes(b),
      decade: [start, start + 9] as [number, number],
    };
  });
  for (const [name, pos] of majors) palaces[mod(pos, 12)]!.stars.push({ name, kind: "chinh", mutagen: mutagenOf(name) });
  for (const [name, pos] of minors) palaces[mod(pos, 12)]!.stars.push({ name, kind: "phu", mutagen: mutagenOf(name) });

  return {
    input,
    yearCanChi: year.name,
    yinYang: yang ? "Dương" : "Âm",
    yinYangGender: `${yang ? "Dương" : "Âm"} ${gender === "nam" ? "Nam" : "Nữ"}`,
    forward,
    bureau,
    menhBranch: menh,
    thanBranch: than,
    thanPalace: palaces[than]!.name,
    menhNapAm: menhNapAm.name,
    soulMaster: SOUL_MASTER[menh]!,
    bodyMaster: BODY_MASTER[yearBranch]!,
    palaces,
  };
}

/** Tên giờ kèm khung giờ, ví dụ "Tý (23h–1h)". */
export const HOUR_LABELS = EARTHLY_BRANCHES.map((b, i) => {
  const start = mod(2 * i - 1, 24);
  return `${b} (${start}h–${mod(start + 2, 24)}h)`;
});
