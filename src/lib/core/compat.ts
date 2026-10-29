/**
 * Xem tuổi hai người theo các quan hệ truyền thống – KHÔNG chấm điểm.
 *
 * Quan hệ Địa Chi (theo các sách mệnh lý cổ, ví dụ "Tam Mệnh Thông Hội", phần luận hợp, xung, hại):
 *  - Tam hợp: Thân–Tý–Thìn, Dần–Ngọ–Tuất, Tỵ–Dậu–Sửu, Hợi–Mão–Mùi (chỉ số chi cùng số dư khi chia 4).
 *  - Lục hợp: Tý–Sửu, Dần–Hợi, Mão–Tuất, Thìn–Dậu, Tỵ–Thân, Ngọ–Mùi (tổng chỉ số ≡ 1 mod 12).
 *  - Lục xung: hai chi đối nhau trên vòng 12 (cách nhau 6).
 *  - Lục hại: Tý–Mùi, Sửu–Ngọ, Dần–Tỵ, Mão–Thìn, Thân–Hợi, Dậu–Tuất (tổng chỉ số ≡ 7 mod 12).
 * Thiên Can hợp: Giáp–Kỷ, Ất–Canh, Bính–Tân, Đinh–Nhâm, Mậu–Quý (cách nhau 5).
 * Các quan hệ trên loại trừ nhau, nên mỗi cặp chi có nhiều nhất một quan hệ.
 */

import { type Gender, type CungPhiResult, cungPhi, GROUP_NAMES } from "./battrach";
import { type CanChi, EARTHLY_BRANCHES, HEAVENLY_STEMS, canChiOfLunarYear, zodiacOf } from "./canchi";
import { type CalendarDate, isValidCalendarDate, isWithinSupportedRange } from "./date";
import { ELEMENTS, GENERATES, OVERCOMES, type ElementKey } from "./elements";
import { solarToLunar } from "./lunar";
import { type NapAmEntry, napAmOf } from "./napam";

export type BranchRelationKey = "cung-chi" | "tam-hop" | "luc-hop" | "luc-xung" | "luc-hai" | "khong";

const TAM_HOP_GROUPS = ["Thân – Tý – Thìn", "Tỵ – Dậu – Sửu", "Dần – Ngọ – Tuất", "Hợi – Mão – Mùi"];

export function branchRelation(a: number, b: number): BranchRelationKey {
  if (a === b) return "cung-chi";
  if (a % 4 === b % 4) return "tam-hop";
  if ((a + b) % 12 === 1) return "luc-hop";
  if (Math.abs(a - b) === 6) return "luc-xung";
  if ((a + b) % 12 === 7) return "luc-hai";
  return "khong";
}

export function tamHopGroup(branchIndex: number): string {
  // nhóm theo số dư chia 4: 0 Thân-Tý-Thìn, 1 Tỵ-Dậu-Sửu, 2 Dần-Ngọ-Tuất, 3 Hợi-Mão-Mùi
  return TAM_HOP_GROUPS[branchIndex % 4]!;
}

export function stemsCombine(a: number, b: number): boolean {
  return Math.abs(a - b) === 5;
}

export type ElementRelationKey = "binh-hoa" | "a-sinh-b" | "b-sinh-a" | "a-khac-b" | "b-khac-a";

export function elementRelation(a: ElementKey, b: ElementKey): ElementRelationKey {
  if (a === b) return "binh-hoa";
  if (GENERATES[a] === b) return "a-sinh-b";
  if (GENERATES[b] === a) return "b-sinh-a";
  if (OVERCOMES[a] === b) return "a-khac-b";
  return "b-khac-a";
}

export interface PersonInput {
  name?: string;
  birthDate: CalendarDate;
  gender?: Gender | null;
}

export interface PersonInfo {
  name: string;
  birthDate: CalendarDate;
  lunarYear: number;
  canChi: CanChi;
  zodiac: string;
  napAm: NapAmEntry;
  cungPhi: CungPhiResult | null;
}

export interface CompatResult {
  a: PersonInfo;
  b: PersonInfo;
  branch: { key: BranchRelationKey; title: string; text: string };
  stem: { combine: boolean; text: string };
  element: { key: ElementRelationKey; title: string; text: string };
  group: { same: boolean; text: string } | null;
}

function personInfo(p: PersonInput, fallback: string): PersonInfo {
  const lunar = solarToLunar(p.birthDate);
  const canChi = canChiOfLunarYear(lunar.year);
  return {
    name: p.name?.trim() || fallback,
    birthDate: p.birthDate,
    lunarYear: lunar.year,
    canChi,
    zodiac: zodiacOf(canChi.branchIndex),
    napAm: napAmOf(canChi),
    cungPhi: p.gender ? cungPhi(lunar.year, p.gender) : null,
  };
}

export type CompatError = "invalid-date" | "out-of-range";

export function computeCompat(
  a: PersonInput,
  b: PersonInput,
): { ok: true; result: CompatResult } | { ok: false; error: CompatError; who: "a" | "b" } {
  for (const [who, p] of [["a", a], ["b", b]] as const) {
    if (!isValidCalendarDate(p.birthDate)) return { ok: false, error: "invalid-date", who };
    if (!isWithinSupportedRange(p.birthDate)) return { ok: false, error: "out-of-range", who };
  }
  const A = personInfo(a, "Người thứ nhất");
  const B = personInfo(b, "Người thứ hai");
  const ba = A.canChi.branchIndex;
  const bb = B.canChi.branchIndex;
  const chiA = EARTHLY_BRANCHES[ba];
  const chiB = EARTHLY_BRANCHES[bb];

  const key = branchRelation(ba, bb);
  const branchTexts: Record<BranchRelationKey, { title: string; text: string }> = {
    "cung-chi": {
      title: "Cùng con giáp",
      text: `Hai người cùng tuổi ${A.zodiac.toLowerCase()} (chi ${chiA}). Quan niệm truyền thống xem là dễ hiểu nhau vì có nhiều nét tương đồng.`,
    },
    "tam-hop": {
      title: "Tam hợp",
      text: `${chiA} và ${chiB} cùng thuộc nhóm tam hợp ${tamHopGroup(ba)}. Quan niệm truyền thống xem đây là các tuổi dễ đồng điệu và hỗ trợ nhau.`,
    },
    "luc-hop": {
      title: "Lục hợp",
      text: `${chiA} – ${chiB} là một cặp lục hợp. Quan niệm truyền thống cho rằng hai tuổi này dễ gắn bó và bổ sung cho nhau.`,
    },
    "luc-xung": {
      title: "Lục xung",
      text: `${chiA} và ${chiB} nằm đối nhau trên vòng 12 chi. Truyền thống lưu ý về khác biệt trong cách nghĩ và nhịp sống; nhiều người xem đây là lời nhắc dành thời gian lắng nghe nhau.`,
    },
    "luc-hai": {
      title: "Lục hại",
      text: `${chiA} – ${chiB} là một cặp lục hại theo quan niệm truyền thống, thường được hiểu là dễ có hiểu lầm nhỏ. Nói chuyện thẳng thắn, cởi mở giúp cân bằng.`,
    },
    khong: {
      title: "Không thuộc nhóm hợp hay xung",
      text: `${chiA} và ${chiB} không thuộc tam hợp, lục hợp, lục xung hay lục hại. Quan niệm truyền thống xem quan hệ này là trung tính.`,
    },
  };

  const sa = A.canChi.stemIndex;
  const sb = B.canChi.stemIndex;
  const combine = stemsCombine(sa, sb);
  const stemText = combine
    ? `Thiên Can ${HEAVENLY_STEMS[sa]} và ${HEAVENLY_STEMS[sb]} là một cặp can hợp.`
    : sa === sb
      ? `Hai người cùng Thiên Can ${HEAVENLY_STEMS[sa]}.`
      : `Thiên Can ${HEAVENLY_STEMS[sa]} và ${HEAVENLY_STEMS[sb]} không phải cặp can hợp.`;

  const ea = A.napAm.element;
  const eb = B.napAm.element;
  const ek = elementRelation(ea, eb);
  const nA = ELEMENTS[ea].name;
  const nB = ELEMENTS[eb].name;
  const elementTexts: Record<ElementRelationKey, { title: string; text: string }> = {
    "binh-hoa": { title: "Bình hòa", text: `Cả hai cùng mệnh ${nA}. Quan niệm ngũ hành gọi là bình hòa: tương đồng, ít va chạm về hành.` },
    "a-sinh-b": { title: "Tương sinh", text: `${A.name} mệnh ${nA}, ${B.name} mệnh ${nB}: ${nA} sinh ${nB}, mang ý nghĩa nuôi dưỡng, nâng đỡ.` },
    "b-sinh-a": { title: "Tương sinh", text: `${B.name} mệnh ${nB}, ${A.name} mệnh ${nA}: ${nB} sinh ${nA}, mang ý nghĩa nuôi dưỡng, nâng đỡ.` },
    "a-khac-b": {
      title: "Tương khắc",
      text: `${nA} khắc ${nB}. Trong ngũ hành, khắc mang nghĩa kiềm chế để giữ cân bằng, không phải điều xấu; nhiều người hiểu đây là hai cá tính bổ khuyết cho nhau.`,
    },
    "b-khac-a": {
      title: "Tương khắc",
      text: `${nB} khắc ${nA}. Trong ngũ hành, khắc mang nghĩa kiềm chế để giữ cân bằng, không phải điều xấu; nhiều người hiểu đây là hai cá tính bổ khuyết cho nhau.`,
    },
  };

  let group: CompatResult["group"] = null;
  if (A.cungPhi && B.cungPhi) {
    const same = A.cungPhi.trigram.group === B.cungPhi.trigram.group;
    group = {
      same,
      text: same
        ? `Cả hai cùng nhóm ${GROUP_NAMES[A.cungPhi.trigram.group]} (cung ${A.cungPhi.trigram.name} và ${B.cungPhi.trigram.name}), nên theo Bát trạch có chung nhóm hướng thuận khi chọn hướng nhà.`
        : `Cung ${A.cungPhi.trigram.name} thuộc ${GROUP_NAMES[A.cungPhi.trigram.group]}, cung ${B.cungPhi.trigram.name} thuộc ${GROUP_NAMES[B.cungPhi.trigram.group]}. Theo Bát trạch, hai người có nhóm hướng thuận khác nhau; khi bố trí nhà, người ta thường ưu tiên theo người trụ cột rồi điều chỉnh góc riêng cho người còn lại.`,
    };
  }

  return {
    ok: true,
    result: { a: A, b: B, branch: { key, ...branchTexts[key] }, stem: { combine, text: stemText }, element: { key: ek, ...elementTexts[ek] }, group },
  };
}
