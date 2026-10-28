/**
 * Bảng Ngũ hành nạp âm của 60 Hoa giáp.
 *
 * Nguồn: bảng nạp âm truyền thống, được chép và giải thích trong "Tam Mệnh Thông Hội"
 * (三命通會, Vạn Dân Anh, đời Minh), quyển 1, mục "Luận nạp âm thủ tượng".
 * Tên gọi tiếng Việt theo cách phiên âm Hán – Việt phổ biến.
 *
 * Mỗi cặp Can Chi liên tiếp (chẵn – lẻ) chung một nạp âm, nên bảng có 30 mục.
 * Tính đầy đủ được kiểm tra trong tests: 30 mục, mỗi hành xuất hiện đúng 6 lần.
 */

import type { CanChi } from "./canchi";
import type { ElementKey } from "./elements";

export interface NapAmEntry {
  /** Tên Hán – Việt, ví dụ "Hải Trung Kim". */
  name: string;
  /** Diễn nghĩa ngắn gọn. */
  meaning: string;
  element: ElementKey;
  /** Hai Can Chi chung nạp âm (để tra cứu và kiểm thử). */
  pair: [string, string];
}

export const NAP_AM_TABLE: readonly NapAmEntry[] = [
  { pair: ["Giáp Tý", "Ất Sửu"], name: "Hải Trung Kim", meaning: "Vàng trong biển", element: "kim" },
  { pair: ["Bính Dần", "Đinh Mão"], name: "Lư Trung Hỏa", meaning: "Lửa trong lò", element: "hoa" },
  { pair: ["Mậu Thìn", "Kỷ Tỵ"], name: "Đại Lâm Mộc", meaning: "Gỗ rừng lớn", element: "moc" },
  { pair: ["Canh Ngọ", "Tân Mùi"], name: "Lộ Bàng Thổ", meaning: "Đất ven đường", element: "tho" },
  { pair: ["Nhâm Thân", "Quý Dậu"], name: "Kiếm Phong Kim", meaning: "Vàng mũi kiếm", element: "kim" },
  { pair: ["Giáp Tuất", "Ất Hợi"], name: "Sơn Đầu Hỏa", meaning: "Lửa trên núi", element: "hoa" },
  { pair: ["Bính Tý", "Đinh Sửu"], name: "Giản Hạ Thủy", meaning: "Nước dưới khe", element: "thuy" },
  { pair: ["Mậu Dần", "Kỷ Mão"], name: "Thành Đầu Thổ", meaning: "Đất trên thành", element: "tho" },
  { pair: ["Canh Thìn", "Tân Tỵ"], name: "Bạch Lạp Kim", meaning: "Vàng trong nến trắng", element: "kim" },
  { pair: ["Nhâm Ngọ", "Quý Mùi"], name: "Dương Liễu Mộc", meaning: "Gỗ cây dương liễu", element: "moc" },
  { pair: ["Giáp Thân", "Ất Dậu"], name: "Tuyền Trung Thủy", meaning: "Nước trong suối", element: "thuy" },
  { pair: ["Bính Tuất", "Đinh Hợi"], name: "Ốc Thượng Thổ", meaning: "Đất trên mái nhà", element: "tho" },
  { pair: ["Mậu Tý", "Kỷ Sửu"], name: "Tích Lịch Hỏa", meaning: "Lửa sấm sét", element: "hoa" },
  { pair: ["Canh Dần", "Tân Mão"], name: "Tùng Bách Mộc", meaning: "Gỗ tùng bách", element: "moc" },
  { pair: ["Nhâm Thìn", "Quý Tỵ"], name: "Trường Lưu Thủy", meaning: "Dòng nước chảy dài", element: "thuy" },
  { pair: ["Giáp Ngọ", "Ất Mùi"], name: "Sa Trung Kim", meaning: "Vàng trong cát", element: "kim" },
  { pair: ["Bính Thân", "Đinh Dậu"], name: "Sơn Hạ Hỏa", meaning: "Lửa dưới chân núi", element: "hoa" },
  { pair: ["Mậu Tuất", "Kỷ Hợi"], name: "Bình Địa Mộc", meaning: "Cây ở đồng bằng", element: "moc" },
  { pair: ["Canh Tý", "Tân Sửu"], name: "Bích Thượng Thổ", meaning: "Đất trên vách", element: "tho" },
  { pair: ["Nhâm Dần", "Quý Mão"], name: "Kim Bạch Kim", meaning: "Vàng lá, vàng thếp", element: "kim" },
  { pair: ["Giáp Thìn", "Ất Tỵ"], name: "Phú Đăng Hỏa", meaning: "Lửa ngọn đèn", element: "hoa" },
  { pair: ["Bính Ngọ", "Đinh Mùi"], name: "Thiên Hà Thủy", meaning: "Nước trên trời", element: "thuy" },
  { pair: ["Mậu Thân", "Kỷ Dậu"], name: "Đại Trạch Thổ", meaning: "Đất vùng đầm lớn", element: "tho" },
  { pair: ["Canh Tuất", "Tân Hợi"], name: "Thoa Xuyến Kim", meaning: "Vàng trang sức", element: "kim" },
  { pair: ["Nhâm Tý", "Quý Sửu"], name: "Tang Đố Mộc", meaning: "Gỗ cây dâu", element: "moc" },
  { pair: ["Giáp Dần", "Ất Mão"], name: "Đại Khê Thủy", meaning: "Nước khe lớn", element: "thuy" },
  { pair: ["Bính Thìn", "Đinh Tỵ"], name: "Sa Trung Thổ", meaning: "Đất lẫn trong cát", element: "tho" },
  { pair: ["Mậu Ngọ", "Kỷ Mùi"], name: "Thiên Thượng Hỏa", meaning: "Lửa trên trời", element: "hoa" },
  { pair: ["Canh Thân", "Tân Dậu"], name: "Thạch Lựu Mộc", meaning: "Gỗ cây thạch lựu", element: "moc" },
  { pair: ["Nhâm Tuất", "Quý Hợi"], name: "Đại Hải Thủy", meaning: "Nước biển lớn", element: "thuy" },
];

export function napAmOf(canChi: CanChi): NapAmEntry {
  const entry = NAP_AM_TABLE[Math.floor(canChi.cycleIndex / 2)];
  if (!entry) throw new RangeError("Can Chi không hợp lệ.");
  return entry;
}
