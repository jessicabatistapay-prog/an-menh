/**
 * Bộ 24 thẻ chiêm nghiệm do An Mệnh tự biên soạn.
 * Đây KHÔNG phải một hệ thống bói toán cổ truyền và không có nguồn gốc lịch sử;
 * thẻ được chọn ngẫu nhiên chỉ để gợi mở suy ngẫm.
 */

import type { ElementKey } from "@/lib/core/elements";

export interface ReflectionCard {
  id: string;
  name: string;
  /** Hành dùng để trang trí thẻ (thuần thẩm mỹ, không mang ý nghĩa tiên đoán). */
  motif: ElementKey;
  message: string;
  question: string;
  action: string;
}

export const REFLECTION_CARDS: readonly ReflectionCard[] = [
  {
    id: "mam-non",
    name: "Mầm Non",
    motif: "moc",
    message: "Điều mới mẻ thường bắt đầu rất nhỏ. Không cần chờ đủ hoàn hảo mới được phép bắt đầu.",
    question: "Có điều gì mình muốn bắt đầu nếu cho phép bản thân làm thật chậm?",
    action: "Dành 10 phút hôm nay cho bước đầu tiên của điều đó.",
  },
  {
    id: "dong-suoi",
    name: "Dòng Suối",
    motif: "thuy",
    message: "Nước không chống lại đá, nó tìm đường vòng. Mềm mại đôi khi là cách đi xa nhất.",
    question: "Ở đâu mình đang cố đẩy mạnh trong khi có thể tìm một lối khác?",
    action: "Viết ra hai cách tiếp cận khác cho việc đang làm mình bế tắc.",
  },
  {
    id: "ngon-den",
    name: "Ngọn Đèn",
    motif: "hoa",
    message: "Một ngọn đèn nhỏ đủ soi một bước chân. Bạn không cần thấy cả con đường mới được bước tiếp.",
    question: "Bước tiếp theo rõ ràng nhất của mình lúc này là gì?",
    action: "Chọn một việc nhỏ và hoàn thành nó trước khi ngày kết thúc.",
  },
  {
    id: "mat-dat",
    name: "Mặt Đất",
    motif: "tho",
    message: "Sự vững vàng đến từ những điều lặp lại đều đặn: giấc ngủ, bữa ăn, lời hỏi han.",
    question: "Thói quen nào đang giữ cho mình đứng vững?",
    action: "Đi ngủ sớm hơn 20 phút tối nay.",
  },
  {
    id: "chuong-dong",
    name: "Chuông Đồng",
    motif: "kim",
    message: "Lời nói rõ ràng và tử tế giúp mọi người hiểu nhau nhanh hơn những điều ngầm hiểu.",
    question: "Có điều gì mình cần nói ra một cách nhẹ nhàng nhưng rõ ràng?",
    action: "Gửi một tin nhắn ngắn nói rõ mong muốn của mình với một người liên quan.",
  },
  {
    id: "canh-cua-so",
    name: "Cánh Cửa Sổ",
    motif: "moc",
    message: "Đôi khi chỉ cần mở ra một chút để ánh sáng và không khí mới đi vào.",
    question: "Mình đang đóng lòng mình với góc nhìn nào?",
    action: "Hỏi một người khác quan điểm về vấn đề mình đang nghĩ và chỉ lắng nghe.",
  },
  {
    id: "mat-ho",
    name: "Mặt Hồ Lặng",
    motif: "thuy",
    message: "Khi mặt hồ lặng, ta mới nhìn rõ đáy. Tĩnh lặng không phải là đứng yên.",
    question: "Nếu tạm gác mọi tiếng ồn, mình thực sự cảm thấy gì?",
    action: "Ngồi yên, thở chậm 3 phút mà không cầm điện thoại.",
  },
  {
    id: "bep-lua",
    name: "Bếp Lửa",
    motif: "hoa",
    message: "Hơi ấm lớn lên khi được chia sẻ. Sự quan tâm nhỏ có thể sưởi ấm cả một ngày.",
    question: "Ai trong cuộc sống của mình đang cần một chút hơi ấm?",
    action: "Hỏi thăm một người thân hoặc bạn cũ mà lâu rồi mình chưa liên lạc.",
  },
  {
    id: "hat-giong",
    name: "Hạt Giống",
    motif: "tho",
    message: "Có những điều cần thời gian ở dưới đất trước khi nảy mầm. Chờ đợi cũng là một phần của lớn lên.",
    question: "Mình đang kiên nhẫn với điều gì, và có đang đối xử dịu dàng với bản thân trong lúc chờ?",
    action: "Ghi lại một tiến bộ nhỏ mình đã có trong tháng này.",
  },
  {
    id: "la-ban-trong",
    name: "La Bàn Bên Trong",
    motif: "kim",
    message: "Giá trị của bạn là la bàn đáng tin hơn mọi lời khen chê bên ngoài.",
    question: "Ba giá trị nào quan trọng nhất với mình lúc này?",
    action: "Viết ba giá trị đó lên một mảnh giấy và đặt ở nơi dễ thấy.",
  },
  {
    id: "ngon-gio",
    name: "Ngọn Gió",
    motif: "moc",
    message: "Thay đổi có thể khiến ta chao đảo, nhưng cũng mang theo hạt giống đến vùng đất mới.",
    question: "Sự thay đổi gần đây nhất đã dạy mình điều gì?",
    action: "Thử một việc quen thuộc theo cách mới – đổi đường đi, đổi món ăn sáng.",
  },
  {
    id: "con-mua",
    name: "Cơn Mưa",
    motif: "thuy",
    message: "Buồn cũng là một cảm xúc cần được ghé qua. Để nó chảy đi thay vì giữ lại.",
    question: "Cảm xúc nào mình đang cố gắng không cảm thấy?",
    action: "Viết tự do 5 phút về cảm xúc đó, không cần đọc lại.",
  },
  {
    id: "binh-minh",
    name: "Bình Minh",
    motif: "hoa",
    message: "Mỗi buổi sáng là một cơ hội bắt đầu lại, không cần mang theo hết những gì của hôm qua.",
    question: "Điều gì từ hôm qua mình có thể đặt xuống?",
    action: "Sáng mai, dành 5 phút đầu tiên cho một điều khiến mình dễ chịu.",
  },
  {
    id: "ngoi-nha",
    name: "Ngôi Nhà",
    motif: "tho",
    message: "Không gian sống gọn gàng giúp tâm trí bớt rối. Nhà là nơi nạp lại năng lượng.",
    question: "Góc nào trong nhà đang làm mình thấy nặng nề?",
    action: "Dọn một ngăn kéo hoặc một mặt bàn trong 15 phút.",
  },
  {
    id: "thanh-guom",
    name: "Thanh Gươm Gỗ",
    motif: "kim",
    message: "Ranh giới không phải bức tường, mà là cánh cổng có người gác tử tế.",
    question: "Mình cần đặt ranh giới với điều gì để giữ năng lượng?",
    action: "Từ chối một lời đề nghị không phù hợp, kèm một lời cảm ơn chân thành.",
  },
  {
    id: "cay-co-thu",
    name: "Cây Cổ Thụ",
    motif: "moc",
    message: "Rễ sâu giúp cây đứng vững trước gió. Gốc rễ của bạn là những người và điều nuôi dưỡng bạn.",
    question: "Mình đến từ đâu, và điều gì từ đó vẫn đang nâng đỡ mình?",
    action: "Kể cho ai đó nghe một kỷ niệm đẹp về gia đình hoặc quê nhà.",
  },
  {
    id: "dai-duong",
    name: "Đại Dương",
    motif: "thuy",
    message: "Bạn rộng lớn hơn một ngày tồi tệ. Sóng trên mặt không phải là toàn bộ biển cả.",
    question: "Nếu nhìn từ một năm sau, chuyện hôm nay lớn đến mức nào?",
    action: "Đi bộ 15 phút ngoài trời và để ý bầu trời.",
  },
  {
    id: "ngon-nen",
    name: "Ngọn Nến",
    motif: "hoa",
    message: "Năng lượng có hạn. Cháy vừa đủ để soi sáng lâu, thay vì bùng lên rồi tắt.",
    question: "Mình đang tiêu hao năng lượng vào điều gì không thực sự cần?",
    action: "Gạch bớt một việc không quan trọng khỏi danh sách hôm nay.",
  },
  {
    id: "con-duong-mon",
    name: "Con Đường Mòn",
    motif: "tho",
    message: "Con đường được tạo nên bởi những bước chân lặp lại. Kiên trì là một dạng của tin tưởng.",
    question: "Việc gì mình đã bền bỉ làm và đáng được ghi nhận?",
    action: "Tự thưởng cho mình một điều nhỏ vì sự bền bỉ đó.",
  },
  {
    id: "tam-guong",
    name: "Tấm Gương",
    motif: "kim",
    message: "Điều ta khó chịu ở người khác đôi khi phản chiếu điều ta chưa chấp nhận ở mình.",
    question: "Gần đây mình phản ứng mạnh với điều gì, và nó nói gì về mình?",
    action: "Viết ra một điều mình học được về bản thân từ một người khiến mình khó chịu.",
  },
  {
    id: "canh-dong",
    name: "Cánh Đồng",
    motif: "moc",
    message: "Mùa nào việc nấy. Có lúc gieo, có lúc chăm, có lúc gặt và có lúc nghỉ.",
    question: "Mình đang ở mùa nào trong công việc và cuộc sống?",
    action: "Điều chỉnh một kỳ vọng để phù hợp với 'mùa' hiện tại của mình.",
  },
  {
    id: "giot-suong",
    name: "Giọt Sương",
    motif: "thuy",
    message: "Những điều đẹp đẽ thường ngắn ngủi. Có mặt trọn vẹn là cách giữ chúng lâu nhất.",
    question: "Khoảnh khắc nào hôm nay mình muốn thực sự có mặt?",
    action: "Trong bữa ăn tới, ăn chậm và không nhìn màn hình.",
  },
  {
    id: "ngoi-sao",
    name: "Ngôi Sao Dẫn Lối",
    motif: "hoa",
    message: "Ước mơ không cần đạt tới ngay; nó chỉ cần đủ sáng để bạn biết mình đang đi về đâu.",
    question: "Ước mơ nào mình đã lâu không nhắc đến?",
    action: "Viết ước mơ đó thành một câu và một việc nhỏ có thể làm trong tuần này.",
  },
  {
    id: "vien-ngoc",
    name: "Viên Ngọc Thô",
    motif: "kim",
    message: "Giá trị của bạn có sẵn từ đầu; trải nghiệm chỉ giúp nó được nhìn thấy rõ hơn.",
    question: "Điểm mạnh nào của mình thường bị chính mình xem nhẹ?",
    action: "Hỏi một người bạn tin cậy: theo họ, điểm mạnh của mình là gì?",
  },
];

export function getCardById(id: string): ReflectionCard | undefined {
  return REFLECTION_CARDS.find((c) => c.id === id);
}

/** Rút ngẫu nhiên một thẻ (có thể truyền hàm random để kiểm thử). */
export function drawCard(random: () => number = Math.random, excludeId?: string): ReflectionCard {
  const pool = excludeId ? REFLECTION_CARDS.filter((c) => c.id !== excludeId) : REFLECTION_CARDS;
  const index = Math.min(pool.length - 1, Math.floor(random() * pool.length));
  return pool[index]!;
}
