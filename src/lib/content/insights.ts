import type { ElementKey } from "@/lib/core/elements";

/**
 * Diễn giải theo hành nạp âm do An Mệnh tự biên soạn, dựa trên hình ảnh biểu tượng phổ biến
 * của từng hành. Đây là gợi ý để suy ngẫm, không phải mô tả tính cách chắc chắn.
 */
export interface ElementInsight {
  summary: string;
  strengths: string[];
  balance: string[];
  reflection: string;
  livingTips: string[];
}

export const ELEMENT_INSIGHTS: Record<ElementKey, ElementInsight> = {
  kim: {
    summary:
      "Hành Kim gắn với hình ảnh kim loại được tôi luyện: sự rõ ràng, có nguyên tắc và biết chọn lọc điều cốt lõi.",
    strengths: ["Suy nghĩ mạch lạc, thích sự rõ ràng", "Giữ lời và coi trọng chuẩn mực", "Biết loại bỏ điều không cần thiết"],
    balance: ["Mềm mỏng hơn khi góp ý", "Chấp nhận rằng không phải việc gì cũng cần hoàn hảo"],
    reflection: "Nguyên tắc nào giúp bạn vững vàng, và nguyên tắc nào có thể nới lỏng một chút?",
    livingTips: ["Không gian gọn, ít đồ nhưng chất lượng", "Điểm xuyết đồ kim loại sáng màu, gốm trắng"],
  },
  moc: {
    summary: "Hành Mộc gắn với hình ảnh cây cối: sự sinh trưởng, vươn lên và khả năng nuôi dưỡng.",
    strengths: ["Ham học hỏi, thích phát triển", "Kiên nhẫn nuôi dưỡng ý tưởng và con người", "Linh hoạt như cành cây trước gió"],
    balance: ["Chọn lọc hướng đi thay vì mở quá nhiều nhánh", "Dành thời gian cho gốc rễ: sức khỏe, gia đình"],
    reflection: "Điều gì trong cuộc sống của bạn đang thực sự lớn lên?",
    livingTips: ["Thêm cây xanh và vật liệu gỗ", "Ưu tiên ánh sáng buổi sáng"],
  },
  thuy: {
    summary: "Hành Thủy gắn với hình ảnh dòng nước: sự lưu chuyển, thích nghi và chiều sâu.",
    strengths: ["Thích nghi tốt với hoàn cảnh mới", "Lắng nghe và thấu hiểu sâu", "Tìm được lối đi mềm mại khi gặp trở ngại"],
    balance: ["Giữ một vài điểm neo ổn định mỗi ngày", "Nói ra suy nghĩ thay vì chỉ giữ trong lòng"],
    reflection: "Bạn đang để mọi việc tự trôi, hay đang chủ động chọn dòng chảy cho mình?",
    livingTips: ["Không gian thoáng, lưu thông không khí tốt", "Tông xanh đậm, đen than làm điểm nhấn"],
  },
  hoa: {
    summary: "Hành Hỏa gắn với hình ảnh ngọn lửa: sự ấm áp, nhiệt huyết và khả năng lan tỏa.",
    strengths: ["Truyền cảm hứng cho người xung quanh", "Nhiệt tình, dám bắt đầu", "Mang lại sự ấm áp trong các mối quan hệ"],
    balance: ["Giữ nhịp để không cạn năng lượng", "Tạm dừng một nhịp trước khi phản ứng"],
    reflection: "Điều gì khiến bạn thấy được thắp sáng, và điều gì đang làm bạn kiệt sức?",
    livingTips: ["Ánh sáng ấm vào buổi tối", "Điểm nhấn màu cam, đỏ trầm ở mức vừa phải"],
  },
  tho: {
    summary: "Hành Thổ gắn với hình ảnh mặt đất: sự vững vàng, bao dung và nuôi dưỡng.",
    strengths: ["Đáng tin cậy và nhất quán", "Tạo cảm giác an toàn cho người khác", "Bền bỉ với việc đã chọn"],
    balance: ["Mở lòng với thay đổi", "Đừng ôm hết trách nhiệm về mình"],
    reflection: "Bạn đang là chỗ dựa cho ai, và ai là chỗ dựa của bạn?",
    livingTips: ["Chất liệu gốm, đất nung, vải thô", "Tông be, nâu đất tạo cảm giác ấm"],
  },
};
