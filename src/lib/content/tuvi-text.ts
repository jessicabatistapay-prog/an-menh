/**
 * Diễn giải ngắn về cung và sao trong Tử Vi Đẩu Số – An Mệnh tự tóm tắt từ ý nghĩa phổ biến,
 * viết theo hướng mô tả xu hướng tính cách và lĩnh vực đời sống, không tiên đoán sự kiện.
 */

export const PALACE_TEXT: Record<string, string> = {
  "Mệnh": "Bản thân: tính cách, cách nhìn và phong thái nổi bật.",
  "Phụ Mẫu": "Quan hệ với cha mẹ, người đi trước và sự dạy dỗ.",
  "Phúc Đức": "Đời sống tinh thần, niềm vui, sở thích và cội nguồn gia đình.",
  "Điền Trạch": "Nhà cửa, nơi ở và không gian sống.",
  "Quan Lộc": "Công việc, sự nghiệp và cách làm việc.",
  "Nô Bộc": "Bạn bè, đồng nghiệp và các mối quan hệ xã hội.",
  "Thiên Di": "Đi xa, môi trường bên ngoài và cách bạn hòa nhập.",
  "Tật Ách": "Thể chất và cách bạn chăm sóc sức khỏe (chỉ mang tính quan niệm, không phải chẩn đoán).",
  "Tài Bạch": "Thu nhập, chi tiêu và cách quản lý tiền bạc.",
  "Tử Tức": "Con cái, học trò và những điều bạn vun đắp cho thế hệ sau.",
  "Phu Thê": "Hôn nhân, người bạn đời và cách bạn gắn bó.",
  "Huynh Đệ": "Anh chị em và những người thân thiết như ruột thịt.",
};

export const MAJOR_STAR_TEXT: Record<string, { keyword: string; text: string }> = {
  "Tử Vi": { keyword: "Đế tinh, tôn quý", text: "Phong thái điềm tĩnh, có lòng tự trọng và khả năng lãnh đạo; cần tránh độc đoán." },
  "Thiên Cơ": { keyword: "Mưu trí, linh hoạt", text: "Nhanh nhạy, thích suy tính, giỏi kế hoạch; dễ suy nghĩ nhiều." },
  "Thái Dương": { keyword: "Mặt trời, tỏa sáng", text: "Nhiệt tình, rộng rãi, thích giúp người; cần giữ năng lượng cho mình." },
  "Vũ Khúc": { keyword: "Tài tinh, cương nghị", text: "Thực tế, quyết đoán, giỏi việc tài chính; đôi khi cứng rắn." },
  "Thiên Đồng": { keyword: "Phúc tinh, ôn hòa", text: "Hiền hòa, dễ gần, biết hưởng thụ; cần thêm động lực khi gặp khó." },
  "Liêm Trinh": { keyword: "Nguyên tắc, đa tài", text: "Có nguyên tắc, sắc sảo, nhiều năng lượng; cần mềm mỏng hơn trong giao tiếp." },
  "Thiên Phủ": { keyword: "Kho lẫm, ổn định", text: "Chín chắn, biết tích lũy, đáng tin cậy; đôi khi thận trọng quá mức." },
  "Thái Âm": { keyword: "Mặt trăng, tinh tế", text: "Nhạy cảm, chu đáo, có óc thẩm mỹ; giàu nội tâm." },
  "Tham Lang": { keyword: "Đa tài, đa dục vọng", text: "Năng động, ham trải nghiệm, khéo giao tiếp; cần tiết chế để tập trung." },
  "Cự Môn": { keyword: "Ngôn luận, phân tích", text: "Giỏi lý lẽ, thích tìm hiểu đến cùng; chú ý lời nói để tránh hiểu lầm." },
  "Thiên Tướng": { keyword: "Ấn tinh, công bằng", text: "Chính trực, hay giúp đỡ, coi trọng sự công bằng." },
  "Thiên Lương": { keyword: "Ấm tinh, che chở", text: "Hiền lành, có lòng bao dung, thích chăm lo cho người khác." },
  "Thất Sát": { keyword: "Tướng tinh, dũng mãnh", text: "Can đảm, dám nghĩ dám làm, độc lập; cần kiên nhẫn hơn." },
  "Phá Quân": { keyword: "Tiên phong, đổi mới", text: "Thích đổi mới, phá cách, không ngại thử thách; nên cân nhắc trước khi thay đổi lớn." },
};

export const MINOR_STAR_TEXT: Record<string, string> = {
  "Văn Xương": "Văn tinh: học vấn, chữ nghĩa, sự chỉn chu.",
  "Văn Khúc": "Văn tinh: năng khiếu nghệ thuật, ăn nói khéo.",
  "Tả Phù": "Phụ tá: được giúp đỡ, có quý nhân hỗ trợ.",
  "Hữu Bật": "Phụ tá: hòa đồng, dễ được người giúp.",
  "Lộc Tồn": "Lộc tinh: sự ổn định, tích lũy, cẩn trọng.",
  "Kình Dương": "Sát tinh: quyết liệt, thẳng thắn, cần kiềm chế nóng vội.",
  "Đà La": "Sát tinh: chậm mà dai, cần tránh do dự kéo dài.",
  "Địa Không": "Không kiếp: ý tưởng độc đáo, nên thận trọng với kế hoạch viển vông.",
  "Địa Kiếp": "Không kiếp: biến động, nên chuẩn bị dự phòng.",
  "Thiên Mã": "Mã tinh: di chuyển, năng động, thay đổi môi trường.",
};

export const MUTAGEN_TEXT: Record<string, string> = {
  "Lộc": "Hóa Lộc: thuận lợi, sinh sôi.",
  "Quyền": "Hóa Quyền: quyền hành, sự chủ động.",
  "Khoa": "Hóa Khoa: danh tiếng, học vấn, được ghi nhận.",
  "Kỵ": "Hóa Kỵ: điều cần lưu tâm, dễ vướng bận.",
};
