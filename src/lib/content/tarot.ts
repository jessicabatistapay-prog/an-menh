/**
 * Bộ 78 lá Tarot theo cấu trúc truyền thống (22 Ẩn chính, 56 Ẩn phụ).
 * Hình lá bài do An Mệnh tự vẽ (biểu tượng tối giản), không sao chép bộ bài có bản quyền nào.
 * Ý nghĩa xuôi/ngược do An Mệnh tóm tắt từ cách đọc phổ biến, viết theo hướng gợi mở.
 * Một số lá được đặt tên tiếng Việt nhẹ nhàng hơn (ví dụ "Death" là "Chuyển Hóa") nhưng giữ ý nghĩa gốc.
 */

export type Suit = "gay" | "coc" | "kiem" | "tien";

export interface TarotCard {
  id: string;
  name: string;
  en: string;
  arcana: "major" | "minor";
  /** Số của Ẩn chính (0–21) hoặc hạng của Ẩn phụ (1–14: Át = 1, 11 Tiểu Đồng, 12 Hiệp Sĩ, 13 Hoàng Hậu, 14 Vua). */
  number: number;
  suit?: Suit;
  upright: string;
  reversed: string;
  meaning?: string;
}

export const SUITS: Record<Suit, { name: string; en: string; domain: string }> = {
  gay: { name: "Gậy", en: "Wands", domain: "hành động, đam mê và sự sáng tạo" },
  coc: { name: "Cốc", en: "Cups", domain: "cảm xúc, tình cảm và các mối quan hệ" },
  kiem: { name: "Kiếm", en: "Swords", domain: "suy nghĩ, lời nói và quyết định" },
  tien: { name: "Tiền", en: "Pentacles", domain: "công việc, tiền bạc và đời sống vật chất" },
};

const MAJORS: Omit<TarotCard, "id" | "arcana">[] = [
  { number: 0, name: "Chàng Khờ", en: "The Fool", upright: "Khởi đầu mới, hồn nhiên, dám bước", reversed: "Liều lĩnh, chưa chuẩn bị", meaning: "Một hành trình mới mở ra; tinh thần cởi mở quan trọng hơn sự chắc chắn." },
  { number: 1, name: "Nhà Ảo Thuật", en: "The Magician", upright: "Chủ động, đủ công cụ, biến ý tưởng thành việc", reversed: "Phân tán, chưa dùng hết khả năng", meaning: "Bạn có đủ nguồn lực; điều cần là tập trung và hành động." },
  { number: 2, name: "Nữ Tư Tế", en: "The High Priestess", upright: "Trực giác, tĩnh lặng, hiểu biết bên trong", reversed: "Phớt lờ tiếng nói bên trong", meaning: "Lắng nghe trực giác; câu trả lời có thể đến khi bạn đủ yên tĩnh." },
  { number: 3, name: "Hoàng Hậu", en: "The Empress", upright: "Nuôi dưỡng, sung túc, sáng tạo", reversed: "Quên chăm sóc bản thân", meaning: "Thời điểm vun trồng: chăm sóc ý tưởng, các mối quan hệ và chính mình." },
  { number: 4, name: "Hoàng Đế", en: "The Emperor", upright: "Cấu trúc, kỷ luật, vững vàng", reversed: "Cứng nhắc, kiểm soát quá mức", meaning: "Đặt nền móng và nguyên tắc rõ ràng sẽ giúp bạn vững bước." },
  { number: 5, name: "Giáo Hoàng", en: "The Hierophant", upright: "Truyền thống, học hỏi, người dẫn dắt", reversed: "Muốn đi con đường riêng", meaning: "Học từ người đi trước, hoặc cân nhắc điều truyền thống có thể dạy bạn." },
  { number: 6, name: "Tình Nhân", en: "The Lovers", upright: "Kết nối, lựa chọn theo giá trị", reversed: "Mâu thuẫn trong lựa chọn", meaning: "Một lựa chọn quan trọng, tốt nhất là chọn theo giá trị của chính mình." },
  { number: 7, name: "Cỗ Xe", en: "The Chariot", upright: "Quyết tâm, làm chủ hướng đi", reversed: "Mất phương hướng, giằng co", meaning: "Gom các lực kéo khác nhau về một hướng; ý chí giúp bạn tiến lên." },
  { number: 8, name: "Sức Mạnh", en: "Strength", upright: "Can đảm dịu dàng, kiên nhẫn", reversed: "Tự nghi ngờ, mất bình tĩnh", meaning: "Sức mạnh thật sự là sự mềm mỏng và kiên nhẫn với chính mình." },
  { number: 9, name: "Ẩn Sĩ", en: "The Hermit", upright: "Chiêm nghiệm, tìm câu trả lời bên trong", reversed: "Cô lập quá lâu", meaning: "Lùi lại một chút để soi đường bằng ngọn đèn của riêng mình." },
  { number: 10, name: "Vòng Quay", en: "Wheel of Fortune", upright: "Chu kỳ thay đổi, bước ngoặt", reversed: "Chống lại thay đổi", meaning: "Mọi thứ luôn chuyển động; thích ứng giúp bạn đón nhịp mới." },
  { number: 11, name: "Công Lý", en: "Justice", upright: "Công bằng, rõ ràng, trách nhiệm", reversed: "Thiếu khách quan, né tránh", meaning: "Nhìn sự việc một cách công bằng và nhận phần trách nhiệm của mình." },
  { number: 12, name: "Người Treo Ngược", en: "The Hanged Man", upright: "Tạm dừng, nhìn từ góc khác", reversed: "Trì hoãn không cần thiết", meaning: "Đôi khi dừng lại và đổi góc nhìn mới thấy lối ra." },
  { number: 13, name: "Chuyển Hóa", en: "Death", upright: "Kết thúc một giai đoạn, chuyển mình", reversed: "Níu giữ điều đã cũ", meaning: "Không mang nghĩa đen; đây là lá của sự khép lại để mở ra điều mới." },
  { number: 14, name: "Tiết Độ", en: "Temperance", upright: "Cân bằng, hòa hợp, vừa phải", reversed: "Thái quá, mất cân bằng", meaning: "Pha trộn hài hòa các phần trong cuộc sống, từ tốn và kiên nhẫn." },
  { number: 15, name: "Ràng Buộc", en: "The Devil", upright: "Thói quen trói buộc, cám dỗ", reversed: "Nhận ra và tháo gỡ", meaning: "Nhìn thẳng vào điều đang giữ chân bạn; bạn có thể tự tháo gỡ." },
  { number: 16, name: "Tòa Tháp", en: "The Tower", upright: "Thay đổi bất ngờ, vỡ ra để xây lại", reversed: "Né tránh điều không thể tránh", meaning: "Một điều không vững bị lung lay; đó là cơ hội để xây lại chắc hơn." },
  { number: 17, name: "Ngôi Sao", en: "The Star", upright: "Hy vọng, chữa lành, cảm hứng", reversed: "Mất niềm tin tạm thời", meaning: "Sau giông bão là bầu trời sao: tin rằng mọi thứ có thể tốt lên." },
  { number: 18, name: "Mặt Trăng", en: "The Moon", upright: "Mơ hồ, trực giác, điều chưa rõ", reversed: "Sương mù dần tan", meaning: "Không phải mọi thứ đều rõ ràng; đi chậm và tin vào cảm nhận." },
  { number: 19, name: "Mặt Trời", en: "The Sun", upright: "Niềm vui, rõ ràng, sức sống", reversed: "Niềm vui bị che khuất", meaning: "Năng lượng tích cực và sự rõ ràng; hãy để mình tỏa sáng." },
  { number: 20, name: "Thức Tỉnh", en: "Judgement", upright: "Nhìn lại, thức tỉnh, lời gọi mới", reversed: "Tự phán xét quá khắt khe", meaning: "Đánh giá lại hành trình và đón nhận một lời gọi mới cho mình." },
  { number: 21, name: "Thế Giới", en: "The World", upright: "Hoàn thành, trọn vẹn", reversed: "Còn dang dở", meaning: "Một chu kỳ khép lại trọn vẹn; ghi nhận điều mình đã đi qua." },
];

const RANK_NAMES = ["Át", "Hai", "Ba", "Bốn", "Năm", "Sáu", "Bảy", "Tám", "Chín", "Mười", "Tiểu Đồng", "Hiệp Sĩ", "Hoàng Hậu", "Vua"];
const RANK_EN = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];

const MINORS: Record<Suit, [string, string][]> = {
  gay: [
    ["Cảm hứng mới, khởi đầu đầy năng lượng", "Trì hoãn, thiếu động lực"],
    ["Lập kế hoạch, nhìn xa", "Do dự, ngại bước ra"],
    ["Mở rộng, chờ đợi kết quả", "Chậm trễ, tầm nhìn còn hẹp"],
    ["Ăn mừng, mái ấm, cột mốc", "Giai đoạn chuyển tiếp, chưa ổn định"],
    ["Cạnh tranh, va chạm ý kiến", "Tránh xung đột, tìm cách hòa giải"],
    ["Được ghi nhận, thành công", "Tự nghi ngờ, chưa được ghi nhận"],
    ["Giữ vững lập trường", "Mệt mỏi, muốn buông xuôi"],
    ["Tiến triển nhanh, tin tức đến", "Chậm lại, cần chờ đợi"],
    ["Bền bỉ, kiên cường", "Kiệt sức, cần nghỉ ngơi"],
    ["Gánh nặng trách nhiệm", "Buông bớt, chia sẻ việc"],
    ["Tò mò, tin vui, ý tưởng mới", "Thiếu định hướng"],
    ["Phiêu lưu, nhiệt huyết", "Bốc đồng, nóng vội"],
    ["Tự tin, ấm áp, cuốn hút", "Thiếu tự tin, hay so sánh"],
    ["Lãnh đạo có tầm nhìn", "Độc đoán, áp đặt"],
  ],
  coc: [
    ["Cảm xúc mới, yêu thương", "Kìm nén cảm xúc"],
    ["Kết nối, hòa hợp đôi bên", "Mất cân bằng trong quan hệ"],
    ["Tình bạn, niềm vui chung", "Xa cách, vui chơi quá đà"],
    ["Chán nản, thu mình suy ngẫm", "Mở lòng đón cơ hội"],
    ["Tiếc nuối điều đã qua", "Chấp nhận và bước tiếp"],
    ["Hoài niệm, ký ức đẹp", "Sống trọn hiện tại"],
    ["Nhiều lựa chọn, mơ mộng", "Thấy rõ điều mình muốn"],
    ["Rời đi để tìm ý nghĩa", "Ngại thay đổi"],
    ["Mãn nguyện, ước nguyện thành", "Chưa thỏa lòng"],
    ["Hạnh phúc gia đình", "Bất đồng trong nhà"],
    ["Lời nhắn tình cảm, sáng tạo", "Cảm xúc còn non nớt"],
    ["Lãng mạn, lời mời", "Thất thường, mơ hồ"],
    ["Thấu cảm, trực giác", "Quá nhạy cảm"],
    ["Điềm tĩnh, cân bằng cảm xúc", "Kìm nén, khó bày tỏ"],
  ],
  kiem: [
    ["Sáng suốt, nhìn ra sự thật", "Mơ hồ, rối trí"],
    ["Phân vân, khó lựa chọn", "Quá tải thông tin"],
    ["Nỗi buồn, tổn thương", "Chữa lành dần"],
    ["Nghỉ ngơi, hồi phục", "Cần dừng lại trước khi kiệt sức"],
    ["Tranh cãi hơn thua", "Hòa giải, buông bỏ"],
    ["Chuyển sang giai đoạn êm hơn", "Chưa buông được chuyện cũ"],
    ["Chiến thuật, thiếu minh bạch", "Chọn sự thành thật"],
    ["Cảm giác bị mắc kẹt", "Thoát khỏi lối nghĩ cũ"],
    ["Lo âu, trằn trọc", "Lo âu vơi bớt, tìm người chia sẻ"],
    ["Một giai đoạn khó khăn khép lại", "Hồi phục từ từ"],
    ["Ham học, tò mò", "Nói vội, thiếu suy xét"],
    ["Hành động nhanh, quyết liệt", "Hấp tấp"],
    ["Thẳng thắn, rõ ràng", "Lạnh lùng, khắt khe"],
    ["Lý trí, công bằng", "Cứng nhắc"],
  ],
  tien: [
    ["Cơ hội vật chất mới", "Bỏ lỡ cơ hội"],
    ["Cân bằng nhiều việc", "Quá tải, xoay xở"],
    ["Hợp tác, tay nghề", "Thiếu phối hợp"],
    ["Tiết kiệm, giữ gìn", "Giữ quá chặt, hoặc chi tiêu thiếu kế hoạch"],
    ["Thiếu thốn tạm thời", "Phục hồi, nhận sự hỗ trợ"],
    ["Cho và nhận, hào phóng", "Mất cân bằng cho – nhận"],
    ["Kiên nhẫn chờ thành quả", "Nóng vội"],
    ["Rèn nghề, chăm chỉ", "Làm việc máy móc"],
    ["Độc lập, tận hưởng thành quả", "Phụ thuộc vào người khác"],
    ["Ổn định lâu dài, gia đình vững", "Bất ổn tài chính trong nhà"],
    ["Học hỏi, cơ hội học tập", "Thiếu tập trung"],
    ["Bền bỉ, đáng tin", "Trì trệ"],
    ["Chăm lo, thực tế", "Mất cân bằng công việc – gia đình"],
    ["Vững vàng, sung túc", "Quá chú trọng vật chất"],
  ],
};

const majors: TarotCard[] = MAJORS.map((m) => ({ ...m, id: `major-${m.number}`, arcana: "major" }));
const minors: TarotCard[] = (Object.keys(MINORS) as Suit[]).flatMap((suit) =>
  MINORS[suit].map(([upright, reversed], i) => ({
    id: `${suit}-${i + 1}`,
    arcana: "minor" as const,
    number: i + 1,
    suit,
    name: `${RANK_NAMES[i]} ${SUITS[suit].name}`,
    en: `${RANK_EN[i]} of ${SUITS[suit].en}`,
    upright,
    reversed,
  })),
);

export const TAROT_DECK: readonly TarotCard[] = [...majors, ...minors];

export function getTarotCard(id: string): TarotCard | undefined {
  return TAROT_DECK.find((c) => c.id === id);
}

export const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];

export const SPREADS = {
  "1": { name: "Một lá", positions: ["Thông điệp cho bạn"] },
  "3": { name: "Ba lá", positions: ["Quá khứ", "Hiện tại", "Hướng đi"] },
} as const;

export type SpreadKey = keyof typeof SPREADS;
