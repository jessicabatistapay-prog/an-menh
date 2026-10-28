import type { SpaceType } from "@/lib/storage/schema";

/**
 * Gợi ý thực tế cho không gian sống – dựa trên nguyên tắc chung về ánh sáng, thông gió và công năng,
 * tách biệt với quan niệm Bát trạch.
 */
export interface SpaceGuide {
  light: string[];
  ventilation: string[];
  layout: string[];
  /** Cách quan niệm truyền thống thường áp dụng hướng tốt cho không gian này. */
  traditional: string;
}

export const SPACE_GUIDES: Record<SpaceType, SpaceGuide> = {
  "phong-khach": {
    light: [
      "Tận dụng ánh sáng tự nhiên; rèm hai lớp giúp điều chỉnh khi nắng gắt buổi chiều.",
      "Kết hợp đèn trần với đèn đứng hoặc đèn bàn ánh vàng ấm (2700–3000K) cho buổi tối.",
    ],
    ventilation: [
      "Mở cửa sổ ở hai phía đối diện nếu có thể để tạo luồng gió xuyên phòng.",
      "Tránh để đồ cao, cồng kềnh chắn trước cửa sổ hoặc cửa ra vào.",
    ],
    layout: [
      "Đặt sofa tựa lưng vào tường chắc chắn, nhìn được lối vào để tạo cảm giác an tâm.",
      "Giữ lối đi chính thông thoáng, rộng khoảng 80–90 cm.",
      "Một vài chậu cây xanh dễ chăm giúp không gian dịu mắt.",
    ],
    traditional:
      "Theo Bát trạch, nhiều người ưu tiên mở cửa chính hoặc bố trí khu tiếp khách về hướng Sinh Khí hay Diên Niên của gia chủ.",
  },
  "phong-ngu": {
    light: [
      "Ưu tiên rèm cản sáng để giấc ngủ không bị gián đoạn vào sáng sớm.",
      "Dùng đèn ngủ ánh ấm, độ sáng thấp; hạn chế ánh sáng xanh từ màn hình trước khi ngủ.",
    ],
    ventilation: [
      "Mở cửa đón gió vài lần trong ngày để giảm ẩm và mùi.",
      "Nếu dùng điều hòa, tránh để luồng gió thổi thẳng vào giường.",
    ],
    layout: [
      "Đầu giường tựa vào tường đặc, không đặt ngay dưới cửa sổ nếu có thể.",
      "Chừa lối đi ở hai bên giường; giữ gầm giường gọn gàng.",
      "Hạn chế đặt bàn làm việc và thiết bị điện tử sát giường.",
    ],
    traditional:
      "Theo Bát trạch, phòng ngủ hoặc hướng đầu giường thường được đặt ở hướng Thiên Y hoặc Phục Vị, gắn với sự nghỉ ngơi và tĩnh tại.",
  },
  "goc-lam-viec": {
    light: [
      "Đặt bàn vuông góc với cửa sổ để có ánh sáng tự nhiên mà màn hình không bị lóa.",
      "Bổ sung đèn bàn ánh trung tính (khoảng 4000K) cho công việc cần tập trung.",
    ],
    ventilation: [
      "Giữ không khí lưu thông; mở cửa sổ ngắn sau mỗi vài giờ làm việc.",
      "Tránh để máy tính, thiết bị tỏa nhiệt dồn vào góc kín.",
    ],
    layout: [
      "Ngồi quay lưng về tường thay vì quay lưng ra cửa, để thấy được người đi vào.",
      "Mép trên màn hình ngang hoặc thấp hơn tầm mắt; ghế có tựa lưng hỗ trợ.",
      "Chỉ để trên bàn những thứ dùng hằng ngày; còn lại cất vào ngăn kéo.",
    ],
    traditional:
      "Theo Bát trạch, nhiều người chọn ngồi quay mặt về hướng Sinh Khí hoặc Phục Vị khi làm việc, vì cho rằng giúp chủ động và tập trung.",
  },
};
