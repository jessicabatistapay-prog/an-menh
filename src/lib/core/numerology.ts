/**
 * Thần số học – Số chủ đạo (Life Path) từ ngày sinh dương lịch.
 *
 * QUY TẮC ÁP DỤNG (một quy tắc, dùng nhất quán):
 * 1. Viết ngày sinh đầy đủ dạng DD MM YYYY và cộng TẤT CẢ các chữ số.
 * 2. Nếu tổng là 11, 22 hoặc 33 → giữ nguyên (số đặc biệt, "Master number").
 * 3. Nếu không, cộng các chữ số của tổng; lặp lại cho đến khi được một chữ số 1–9,
 *    và dừng sớm nếu gặp 11, 22 hoặc 33 ở một bước trung gian.
 *
 * Lưu ý: thần số học hiện đại có nhiều biến thể (ví dụ rút gọn riêng ngày, tháng, năm
 * rồi mới cộng), có thể cho kết quả khác ở một số ngày sinh. Ứng dụng chỉ dùng quy tắc trên.
 */

import { type CalendarDate, isValidCalendarDate } from "./date";

export const MASTER_NUMBERS = [11, 22, 33] as const;

export function digitSum(n: number): number {
  return String(Math.abs(Math.trunc(n)))
    .split("")
    .reduce((s, c) => s + Number(c), 0);
}

export function isMasterNumber(n: number): boolean {
  return (MASTER_NUMBERS as readonly number[]).includes(n);
}

export interface ReductionStep {
  /** Mô tả phép cộng, ví dụ "2 + 9 + 1 + 2 + 1 + 9 + 9 + 0". */
  expression: string;
  result: number;
}

export interface LifePathResult {
  number: number;
  isMaster: boolean;
  digits: number[];
  steps: ReductionStep[];
}

export function reduceNumber(total: number): { value: number; steps: ReductionStep[] } {
  const steps: ReductionStep[] = [];
  let value = total;
  while (value > 9 && !isMasterNumber(value)) {
    const digits = String(value).split("");
    const next = digitSum(value);
    steps.push({ expression: digits.join(" + "), result: next });
    value = next;
  }
  return { value, steps };
}

export function lifePathNumber(date: CalendarDate): LifePathResult {
  if (!isValidCalendarDate(date)) throw new RangeError("Ngày sinh không hợp lệ.");
  const text =
    String(date.day).padStart(2, "0") + String(date.month).padStart(2, "0") + String(date.year).padStart(4, "0");
  const digits = text.split("").map(Number);
  const total = digits.reduce((s, d) => s + d, 0);
  const first: ReductionStep = { expression: digits.join(" + "), result: total };
  const { value, steps } = reduceNumber(total);
  return { number: value, isMaster: isMasterNumber(value), digits, steps: [first, ...steps] };
}

export interface LifePathMeaning {
  title: string;
  keywords: string[];
  strengths: string[];
  balance: string[];
  reflection: string[];
}

/** Diễn giải do An Mệnh tự biên soạn, mang tính gợi mở – không phải nhận định cố định. */
export const LIFE_PATH_MEANINGS: Record<number, LifePathMeaning> = {
  1: {
    title: "Người khởi xướng",
    keywords: ["độc lập", "tiên phong", "ý chí"],
    strengths: ["Dám bắt đầu điều mới", "Tự đưa ra quyết định", "Có động lực nội tại mạnh"],
    balance: ["Lắng nghe trước khi kết luận", "Cho phép mình nhờ người khác giúp đỡ"],
    reflection: ["Điều gì mình muốn khởi đầu nhưng còn trì hoãn?", "Khi nào sự tự lập trở thành cô lập?"],
  },
  2: {
    title: "Người kết nối",
    keywords: ["hợp tác", "tinh tế", "lắng nghe"],
    strengths: ["Thấu hiểu cảm xúc người khác", "Hòa giải khéo léo", "Làm việc nhóm tốt"],
    balance: ["Nói rõ nhu cầu của chính mình", "Tránh ôm hết trách nhiệm giữ hòa khí"],
    reflection: ["Mình đã nói 'có' khi muốn nói 'không' lúc nào gần đây?", "Mối quan hệ nào đang nuôi dưỡng mình?"],
  },
  3: {
    title: "Người biểu đạt",
    keywords: ["sáng tạo", "giao tiếp", "lạc quan"],
    strengths: ["Diễn đạt ý tưởng sinh động", "Mang lại niềm vui", "Nhiều cảm hứng"],
    balance: ["Theo đuổi một việc đến cùng", "Chăm sóc cảm xúc thay vì che bằng sự vui vẻ"],
    reflection: ["Ý tưởng nào đáng được mình hoàn thiện?", "Mình thể hiện bản thân thật nhất ở đâu?"],
  },
  4: {
    title: "Người kiến tạo",
    keywords: ["kỷ luật", "bền bỉ", "thực tế"],
    strengths: ["Xây nền móng vững chắc", "Có trách nhiệm", "Tổ chức công việc rõ ràng"],
    balance: ["Linh hoạt khi kế hoạch thay đổi", "Dành chỗ cho nghỉ ngơi và vui chơi"],
    reflection: ["Thói quen nhỏ nào đang giúp mình nhiều nhất?", "Mình có đang quá khắt khe với bản thân?"],
  },
  5: {
    title: "Người khám phá",
    keywords: ["tự do", "thích nghi", "trải nghiệm"],
    strengths: ["Thích nghi nhanh", "Ham học hỏi", "Mang năng lượng đổi mới"],
    balance: ["Giữ cam kết đã chọn", "Phân biệt thay đổi cần thiết với sự bồn chồn"],
    reflection: ["Trải nghiệm nào gần đây đã thay đổi cách mình nhìn?", "Tự do với mình nghĩa là gì?"],
  },
  6: {
    title: "Người chăm sóc",
    keywords: ["trách nhiệm", "yêu thương", "hài hòa"],
    strengths: ["Quan tâm, che chở người thân", "Có óc thẩm mỹ", "Đáng tin cậy"],
    balance: ["Chăm sóc chính mình", "Không gánh thay vấn đề của người khác"],
    reflection: ["Mình đã chăm sóc bản thân thế nào tuần này?", "Ranh giới nào cần được nói rõ hơn?"],
  },
  7: {
    title: "Người chiêm nghiệm",
    keywords: ["sâu sắc", "phân tích", "nội tâm"],
    strengths: ["Tư duy độc lập", "Tìm hiểu đến tận gốc", "Trực giác tốt"],
    balance: ["Chia sẻ suy nghĩ với người tin cậy", "Tin vào người khác nhiều hơn một chút"],
    reflection: ["Câu hỏi nào đang khiến mình tò mò nhất?", "Khi nào mình cần ra khỏi thế giới riêng?"],
  },
  8: {
    title: "Người tổ chức",
    keywords: ["mục tiêu", "quản lý", "bản lĩnh"],
    strengths: ["Định hướng kết quả", "Quản lý nguồn lực tốt", "Chịu được áp lực"],
    balance: ["Cân bằng thành tựu với các mối quan hệ", "Ghi nhận giá trị không đo bằng con số"],
    reflection: ["Thành công trọn vẹn với mình trông như thế nào?", "Mình đang dùng sức mạnh của mình cho điều gì?"],
  },
  9: {
    title: "Người bao dung",
    keywords: ["nhân ái", "lý tưởng", "cống hiến"],
    strengths: ["Nhìn bức tranh lớn", "Giàu lòng trắc ẩn", "Truyền cảm hứng cho cộng đồng"],
    balance: ["Biết khép lại điều đã qua", "Đặt kỳ vọng thực tế cho mình và người khác"],
    reflection: ["Điều gì mình sẵn sàng buông bỏ?", "Mình muốn để lại dấu ấn gì cho người xung quanh?"],
  },
  11: {
    title: "Người truyền cảm hứng (số đặc biệt 11)",
    keywords: ["trực giác", "nhạy cảm", "soi đường"],
    strengths: ["Cảm nhận tinh tế", "Khơi gợi niềm tin nơi người khác", "Nhìn thấy ý nghĩa sâu xa"],
    balance: ["Giữ nhịp sống ổn định để không quá tải cảm xúc", "Biến trực giác thành hành động cụ thể"],
    reflection: ["Trực giác của mình đang nhắc điều gì?", "Mình cần gì để cảm thấy vững vàng?"],
  },
  22: {
    title: "Người xây dựng lớn (số đặc biệt 22)",
    keywords: ["tầm nhìn", "thực thi", "bền vững"],
    strengths: ["Biến ý tưởng lớn thành kế hoạch", "Kiên trì với mục tiêu dài hạn", "Tổ chức người khác cùng làm"],
    balance: ["Chia mục tiêu lớn thành bước nhỏ", "Không đặt áp lực phải hoàn hảo"],
    reflection: ["Mình muốn xây dựng điều gì trong 5 năm tới?", "Bước nhỏ nhất có thể làm hôm nay là gì?"],
  },
  33: {
    title: "Người nâng đỡ (số đặc biệt 33)",
    keywords: ["tận tâm", "chữa lành", "dẫn dắt bằng lòng tốt"],
    strengths: ["Kiên nhẫn và bao dung", "Tạo không gian an toàn cho người khác", "Dạy và hướng dẫn tốt"],
    balance: ["Giữ năng lượng cho chính mình", "Chấp nhận rằng mình không thể giúp tất cả"],
    reflection: ["Ai đang nâng đỡ mình?", "Sự giúp đỡ nào thực sự xuất phát từ mong muốn của mình?"],
  },
};
