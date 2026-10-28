/**
 * Ngũ hành: Kim, Mộc, Thủy, Hỏa, Thổ.
 * Vòng tương sinh: Mộc → Hỏa → Thổ → Kim → Thủy → Mộc.
 * Vòng tương khắc: Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc.
 * Gợi ý màu sắc theo quy ước phổ biến (màu bản hành và màu hành sinh ra nó).
 */

export type ElementKey = "kim" | "moc" | "thuy" | "hoa" | "tho";

export interface ElementInfo {
  key: ElementKey;
  name: string;
  /** Hình ảnh tượng trưng ngắn gọn. */
  image: string;
  /** Màu bản hành. */
  colors: string[];
  /** Mã màu hiển thị minh họa (không phải "màu may mắn" tuyệt đối). */
  swatches: string[];
  /** Phẩm chất thường được liên tưởng (mang tính biểu tượng). */
  qualities: string[];
}

export const ELEMENTS: Record<ElementKey, ElementInfo> = {
  kim: {
    key: "kim",
    name: "Kim",
    image: "kim loại, sự sắc gọn, mùa thu",
    colors: ["trắng", "bạc", "xám nhạt", "ánh kim"],
    swatches: ["#f4f1ea", "#c9ccd1", "#a7abb2"],
    qualities: ["rõ ràng", "có nguyên tắc", "quyết đoán"],
  },
  moc: {
    key: "moc",
    name: "Mộc",
    image: "cây cối, sự sinh trưởng, mùa xuân",
    colors: ["xanh lá", "xanh rêu"],
    swatches: ["#5f8f5a", "#3f6b48", "#9cb98a"],
    qualities: ["phát triển", "mềm dẻo", "nhân hậu"],
  },
  thuy: {
    key: "thuy",
    name: "Thủy",
    image: "nước, sự lưu chuyển, mùa đông",
    colors: ["xanh dương đậm", "đen", "xanh than"],
    swatches: ["#1f3b5c", "#2c5d8a", "#11161f"],
    qualities: ["linh hoạt", "sâu sắc", "thích nghi"],
  },
  hoa: {
    key: "hoa",
    name: "Hỏa",
    image: "lửa, sự lan tỏa, mùa hạ",
    colors: ["đỏ", "cam", "hồng", "tím"],
    swatches: ["#b5483b", "#d9824a", "#8e4a7a"],
    qualities: ["nhiệt huyết", "truyền cảm hứng", "chủ động"],
  },
  tho: {
    key: "tho",
    name: "Thổ",
    image: "đất, sự vững vàng, giao mùa",
    colors: ["vàng đất", "nâu", "be"],
    swatches: ["#b08a4f", "#7a5a3a", "#d8c4a0"],
    qualities: ["ổn định", "đáng tin cậy", "bao dung"],
  },
};

export const ELEMENT_ORDER: readonly ElementKey[] = ["kim", "thuy", "moc", "hoa", "tho"];

/** Hành được sinh ra từ hành `e` (e sinh ra ...). */
export const GENERATES: Record<ElementKey, ElementKey> = {
  moc: "hoa",
  hoa: "tho",
  tho: "kim",
  kim: "thuy",
  thuy: "moc",
};

/** Hành bị `e` khắc. */
export const OVERCOMES: Record<ElementKey, ElementKey> = {
  moc: "tho",
  tho: "thuy",
  thuy: "hoa",
  hoa: "kim",
  kim: "moc",
};

export function generatedBy(e: ElementKey): ElementKey {
  return (Object.keys(GENERATES) as ElementKey[]).find((k) => GENERATES[k] === e)!;
}

export function overcomeBy(e: ElementKey): ElementKey {
  return (Object.keys(OVERCOMES) as ElementKey[]).find((k) => OVERCOMES[k] === e)!;
}

export interface ElementRelations {
  self: ElementKey;
  /** Hành sinh ra bản mệnh (tương sinh – được hỗ trợ). */
  supportedBy: ElementKey;
  /** Hành do bản mệnh sinh ra. */
  supports: ElementKey;
  /** Hành bản mệnh khắc chế. */
  controls: ElementKey;
  /** Hành khắc chế bản mệnh. */
  controlledBy: ElementKey;
}

export function relationsOf(e: ElementKey): ElementRelations {
  return {
    self: e,
    supportedBy: generatedBy(e),
    supports: GENERATES[e],
    controls: OVERCOMES[e],
    controlledBy: overcomeBy(e),
  };
}

export interface ColorSuggestion {
  harmonious: { element: ElementKey; colors: string[]; reason: string }[];
  useSparingly: { element: ElementKey; colors: string[]; reason: string }[];
}

/**
 * Gợi ý màu tham khảo: màu bản hành và màu của hành tương sinh cho mình là "hài hòa";
 * màu của hành khắc mình nên dùng điểm xuyết thay vì làm chủ đạo. Đây là quy ước phổ biến,
 * không phải quy tắc bắt buộc.
 */
export function colorSuggestions(e: ElementKey): ColorSuggestion {
  const r = relationsOf(e);
  return {
    harmonious: [
      {
        element: r.supportedBy,
        colors: ELEMENTS[r.supportedBy].colors,
        reason: `${ELEMENTS[r.supportedBy].name} sinh ${ELEMENTS[e].name} (tương sinh)`,
      },
      {
        element: e,
        colors: ELEMENTS[e].colors,
        reason: `Màu bản hành ${ELEMENTS[e].name}`,
      },
    ],
    useSparingly: [
      {
        element: r.controlledBy,
        colors: ELEMENTS[r.controlledBy].colors,
        reason: `${ELEMENTS[r.controlledBy].name} khắc ${ELEMENTS[e].name} – dùng làm điểm nhấn nhỏ nếu thích`,
      },
    ],
  };
}
