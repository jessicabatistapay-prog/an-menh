/**
 * Tử vi hằng ngày theo 12 con giáp – phương pháp minh bạch, có tính xác định.
 *
 * 1. Quan hệ giữa Địa Chi của NGÀY và Địa Chi của TUỔI (con giáp):
 *    cùng chi → "ngày bản mệnh"; tam hợp hoặc lục hợp → "thuận"; lục xung → "chậm lại";
 *    lục hại → "giữ lời"; còn lại xét bước 2.
 * 2. Ngũ hành của Thiên Can ngày so với ngũ hành của chi tuổi:
 *    can ngày sinh cho tuổi → "thuận"; can ngày khắc tuổi → "chậm lại"; còn lại → "bình".
 * 3. Lời gợi ý được chọn từ một nhóm câu tự soạn theo nhịp ngày, chọn cố định theo (ngày, con giáp)
 *    để mỗi ngày mỗi tuổi luôn ra cùng một nội dung.
 * 4. Giờ gợi ý: giờ hoàng đạo của ngày có quan hệ hợp với tuổi (nếu có), nếu không lấy giờ hoàng đạo đầu tiên.
 * Đây là gợi ý vui để suy ngẫm, không phải dự đoán.
 */

import { BRANCH_ELEMENTS, STEM_ELEMENTS, ZODIAC_ANIMALS, EARTHLY_BRANCHES, canChiOfDay } from "./canchi";
import { branchRelation } from "./compat";
import { type CalendarDate, julianDayNumber } from "./date";
import { ELEMENTS, GENERATES, OVERCOMES, generatedBy } from "./elements";
import { type HourInfo, dayAuspice } from "./hoangdao";

export type DayTone = "ban-menh" | "thuan" | "binh" | "cham" | "giu-loi";

export const TONE_LABELS: Record<DayTone, string> = {
  "ban-menh": "Ngày bản mệnh",
  thuan: "Nhịp thuận",
  binh: "Nhịp bình",
  cham: "Nên chậm lại",
  "giu-loi": "Giữ lời",
};

const TEXTS: Record<DayTone, { work: string[]; people: string[]; self: string[] }> = {
  "ban-menh": {
    work: ["Ngày trùng chi với tuổi: hợp để rà soát mục tiêu của riêng mình.", "Tập trung vào việc bạn làm giỏi nhất, kết quả sẽ rõ.", "Một việc tồn đọng có thể được giải quyết nếu bạn chủ động."],
    people: ["Dễ gặp người cùng suy nghĩ; hãy lắng nghe thêm góc nhìn khác.", "Một cuộc trò chuyện thẳng thắn giúp mọi người hiểu bạn hơn.", "Người thân cần bạn nhiều hơn bạn nghĩ; hỏi han một câu."],
    self: ["Dành vài phút ghi lại điều bạn biết ơn hôm nay.", "Đi ngủ đúng giờ để giữ năng lượng.", "Tự thưởng cho mình một điều nhỏ."],
  },
  thuan: {
    work: ["Thuận cho việc hợp tác, gặp gỡ, bàn bạc.", "Ý tưởng hôm nay dễ được ủng hộ; hãy trình bày rõ ràng.", "Bắt đầu một việc mới với quy mô vừa sức."],
    people: ["Không khí cởi mở, hợp để kết nối lại với bạn cũ.", "Lời khen chân thành hôm nay có sức lan tỏa.", "Thuận cho những buổi gặp mặt gia đình."],
    self: ["Đi bộ ngoài trời một chút để giữ tinh thần tốt.", "Thử một món ăn lành mạnh mới.", "Đọc vài trang sách bạn thích."],
  },
  binh: {
    work: ["Nhịp ngày đều đặn; làm tốt những việc thường ngày là đủ.", "Hợp để sắp xếp lại bàn làm việc và danh sách việc cần làm.", "Hoàn thành một việc nhỏ trước khi mở việc mới."],
    people: ["Giữ liên lạc nhẹ nhàng với người thân.", "Lắng nghe nhiều hơn nói.", "Một tin nhắn hỏi thăm sẽ được đón nhận."],
    self: ["Uống đủ nước và nghỉ mắt sau mỗi giờ làm việc.", "Dành thời gian cho một sở thích nhỏ.", "Thở chậm vài nhịp trước khi bắt đầu việc khó."],
  },
  cham: {
    work: ["Nên kiểm tra kỹ trước khi quyết định việc lớn; chậm mà chắc.", "Chưa vội ký kết hay hứa hẹn; cho mình thêm thời gian cân nhắc.", "Ưu tiên việc đang dở thay vì mở thêm việc mới."],
    people: ["Tránh tranh luận hơn thua; nhường một bước cho êm.", "Nếu có bất đồng, hẹn nói chuyện khi cả hai bình tĩnh.", "Kiên nhẫn với người đang gặp áp lực."],
    self: ["Giữ nhịp sinh hoạt điều độ, nghỉ ngơi sớm.", "Đi lại cẩn thận, không vội vàng.", "Một khoảng lặng ngắn giúp đầu óc nhẹ nhõm."],
  },
  "giu-loi": {
    work: ["Lời nói dễ bị hiểu khác ý; viết rõ ràng, xác nhận lại thông tin.", "Tránh bình luận vội trong nhóm; tập trung vào việc.", "Ghi chú cẩn thận các thỏa thuận."],
    people: ["Nói chậm, nghe kỹ để tránh hiểu lầm nhỏ.", "Một lời xin lỗi đúng lúc có giá trị lớn.", "Tránh nhắc lại chuyện cũ không vui."],
    self: ["Bớt lướt mạng xã hội để đầu óc thảnh thơi.", "Viết ra cảm xúc thay vì giữ trong lòng.", "Nghe một bản nhạc nhẹ trước khi ngủ."],
  },
};

export interface DailyForecast {
  zodiac: string;
  branch: string;
  tone: DayTone;
  reason: string;
  work: string;
  people: string;
  self: string;
  color: string;
  goodHour: HourInfo;
}

/** Băm đơn giản, có tính xác định. */
function pick(arr: string[], seed: number): string {
  const h = Math.abs(Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b) ^ (seed >>> 13));
  return arr[h % arr.length]!;
}

export function dailyForecast(date: CalendarDate, zodiacBranch: number): DailyForecast {
  const day = canChiOfDay(date);
  const auspice = dayAuspice(date);
  const rel = branchRelation(day.branchIndex, zodiacBranch);
  const dayEl = STEM_ELEMENTS[day.stemIndex]!;
  const myEl = BRANCH_ELEMENTS[zodiacBranch]!;
  const chiNgay = EARTHLY_BRANCHES[day.branchIndex];
  const chiTuoi = EARTHLY_BRANCHES[zodiacBranch];

  let tone: DayTone;
  let reason: string;
  if (rel === "cung-chi") {
    tone = "ban-menh";
    reason = `Ngày ${day.name} cùng chi ${chiTuoi} với tuổi.`;
  } else if (rel === "tam-hop" || rel === "luc-hop") {
    tone = "thuan";
    reason = `Chi ngày ${chiNgay} ${rel === "tam-hop" ? "tam hợp" : "lục hợp"} với chi tuổi ${chiTuoi}.`;
  } else if (rel === "luc-xung") {
    tone = "cham";
    reason = `Chi ngày ${chiNgay} xung với chi tuổi ${chiTuoi}.`;
  } else if (rel === "luc-hai") {
    tone = "giu-loi";
    reason = `Chi ngày ${chiNgay} và chi tuổi ${chiTuoi} là cặp lục hại.`;
  } else if (GENERATES[dayEl] === myEl) {
    tone = "thuan";
    reason = `Can ngày hành ${ELEMENTS[dayEl].name} sinh cho hành ${ELEMENTS[myEl].name} của tuổi.`;
  } else if (OVERCOMES[dayEl] === myEl) {
    tone = "cham";
    reason = `Can ngày hành ${ELEMENTS[dayEl].name} khắc hành ${ELEMENTS[myEl].name} của tuổi.`;
  } else {
    tone = "binh";
    reason = `Ngày ${day.name} không có quan hệ hợp hay xung đáng kể với tuổi.`;
  }

  const seed = julianDayNumber(date) * 31 + zodiacBranch * 7;
  const t = TEXTS[tone];
  const goodHour =
    auspice.goodHours.find((h) => ["tam-hop", "luc-hop", "cung-chi"].includes(branchRelation(h.branch, zodiacBranch))) ?? auspice.goodHours[0]!;
  return {
    zodiac: ZODIAC_ANIMALS[zodiacBranch]!,
    branch: chiTuoi!,
    tone,
    reason,
    work: pick(t.work, seed),
    people: pick(t.people, seed + 1),
    self: pick(t.self, seed + 2),
    color: ELEMENTS[generatedBy(myEl)].colors[0]!,
    goodHour,
  };
}
