/**
 * Bộ 36 quẻ xăm do An Mệnh tự soạn (thơ lục bát và lời bàn).
 * KHÔNG phải bộ xăm của đền chùa nào và không có nguồn gốc cổ truyền.
 * Mỗi quẻ chỉ có ba mức "Thượng", "Trung", "Bình" – không có quẻ "hạ", vì mỗi quẻ là một lời nhắc
 * để suy ngẫm chứ không phải lời báo trước điều xấu.
 */

export type XamLevel = "Thượng" | "Trung" | "Bình";

export interface Xam {
  number: number;
  title: string;
  level: XamLevel;
  poem: [string, string];
  meaning: string;
  work: string;
  family: string;
  love: string;
}

export const XAM: readonly Xam[] = [
  {
    number: 1, title: "Trăng rằm", level: "Thượng",
    poem: ["Trăng rằm soi sáng đầu non", "Đường xa có bạn, lối mòn hóa quen"],
    meaning: "Ánh trăng tròn soi đường: việc đang làm có người đồng hành, điều lạ dần thành quen.",
    work: "Hợp tác thuận lợi; hãy chủ động kết nối với người cùng chí hướng.",
    family: "Ấm êm; một bữa cơm sum họp sẽ thêm gắn bó.",
    love: "Chân thành và kiên nhẫn, khoảng cách sẽ ngắn lại.",
  },
  {
    number: 2, title: "Gió xuân", level: "Thượng",
    poem: ["Gió xuân thổi nhẹ qua cành", "Mầm non trổ lá, trời xanh mây hồng"],
    meaning: "Mùa xuân mang sức sống mới: thời điểm tốt để bắt đầu một điều nhỏ.",
    work: "Ý tưởng mới đáng thử; bắt đầu từ quy mô vừa sức.",
    family: "Không khí vui tươi; hãy làm mới không gian chung.",
    love: "Mở lòng với những cuộc gặp mới hoặc làm mới mối quan hệ hiện có.",
  },
  {
    number: 3, title: "Thuyền qua sông", level: "Trung",
    poem: ["Con thuyền nhẹ lướt qua sông", "Chèo tay cho vững, chớ trông bến liền"],
    meaning: "Đường đã mở nhưng cần chèo đều tay; vội vàng dễ chệch hướng.",
    work: "Tiến độ ổn nếu giữ nhịp; đừng đốt cháy giai đoạn.",
    family: "Chia sẻ việc nhà đều tay, mọi người cùng nhẹ gánh.",
    love: "Mối quan hệ cần thời gian; quan tâm đều đặn hơn những lời hứa lớn.",
  },
  {
    number: 4, title: "Gieo hạt", level: "Trung",
    poem: ["Gieo hạt xuống đất đợi mưa", "Cần chăm sớm tối, chẳng thừa công đâu"],
    meaning: "Công sức hôm nay là hạt giống cho mùa sau; chăm chỉ không bao giờ thừa.",
    work: "Đầu tư cho kỹ năng và nền tảng; kết quả đến sau.",
    family: "Vun đắp từng chút: một lời hỏi han, một việc giúp đỡ.",
    love: "Tình cảm lớn lên từ những quan tâm nhỏ mỗi ngày.",
  },
  {
    number: 5, title: "Giếng trong", level: "Thượng",
    poem: ["Giếng trong mát giữa làng xưa", "Ai qua cũng được, sớm trưa chẳng vơi"],
    meaning: "Nguồn nước trong lành cho mọi người: điều tốt cho đi không cạn.",
    work: "Giúp đỡ đồng nghiệp sẽ mở ra cơ hội và sự tin cậy.",
    family: "Bạn là chỗ dựa; nhớ giữ sức cho chính mình.",
    love: "Sự tử tế bền bỉ là sức hút lâu dài nhất.",
  },
  {
    number: 6, title: "Mây che núi", level: "Bình",
    poem: ["Mây mù che khuất đỉnh cao", "Lặng chờ gió đến, núi nào chẳng quang"],
    meaning: "Mọi thứ chưa rõ ràng; đây là lúc quan sát hơn là quyết định.",
    work: "Thu thập thêm thông tin trước khi chọn hướng đi.",
    family: "Có điều chưa nói ra; một cuộc trò chuyện bình tĩnh sẽ giúp.",
    love: "Đừng vội kết luận; cho nhau thời gian để hiểu.",
  },
  {
    number: 7, title: "Sen nở", level: "Thượng",
    poem: ["Bùn sâu sen vẫn nở hoa", "Lòng trong giữ được, gần xa cũng thơm"],
    meaning: "Giữa hoàn cảnh chưa thuận, giữ được sự tử tế thì vẫn tỏa hương.",
    work: "Môi trường có thể chưa lý tưởng, nhưng uy tín của bạn được ghi nhận.",
    family: "Bao dung giúp không khí nhẹ nhàng hơn.",
    love: "Sự chân thành sẽ được nhìn thấy.",
  },
  {
    number: 8, title: "Cầu tre", level: "Trung",
    poem: ["Cầu tre lắt lẻo qua kênh", "Bước chân chậm rãi, chênh vênh hóa bằng"],
    meaning: "Đoạn đường có chút chông chênh; bước chậm và chắc là đủ.",
    work: "Cẩn trọng với chi tiết; kiểm tra kỹ trước khi giao nộp.",
    family: "Kiên nhẫn với người thân đang gặp áp lực.",
    love: "Từ tốn lắng nghe, đừng để một phút nóng vội làm chênh vênh.",
  },
  {
    number: 9, title: "Đèn khuya", level: "Trung",
    poem: ["Đèn khuya một ngọn sáng trưng", "Siêng năng đèn sách, chẳng ngừng ắt nên"],
    meaning: "Sự học và rèn luyện âm thầm luôn có ngày đơm hoa.",
    work: "Học thêm một kỹ năng sẽ có ích hơn bạn nghĩ.",
    family: "Khuyến khích nhau học hỏi, cùng tiến bộ.",
    love: "Chia sẻ mục tiêu của mình với người thương.",
  },
  {
    number: 10, title: "Giọt mưa", level: "Trung",
    poem: ["Giọt mưa rơi mãi trên thềm", "Bền lòng đá cũng mòn mềm theo năm"],
    meaning: "Bền bỉ tạo nên thay đổi lớn, dù từng giọt rất nhỏ.",
    work: "Giữ thói quen tốt mỗi ngày, kết quả sẽ tích lũy.",
    family: "Những lời nhắc nhẹ nhàng hiệu quả hơn trách móc.",
    love: "Kiên trì và nhẫn nại làm mềm những khác biệt.",
  },
  {
    number: 11, title: "Chim về tổ", level: "Thượng",
    poem: ["Chiều buông chim lại về rừng", "Nhà vui đầm ấm, tưng bừng tiếng ca"],
    meaning: "Sau ngày dài là chốn bình yên; gia đình là nơi nạp lại năng lượng.",
    work: "Cân bằng công việc và nghỉ ngơi để đi đường dài.",
    family: "Tin vui trong nhà; dành thời gian sum vầy.",
    love: "Bình yên bên nhau là điều đáng quý.",
  },
  {
    number: 12, title: "Lúa chín", level: "Thượng",
    poem: ["Đồng xa lúa chín vàng bông", "Một mùa vất vả, ruộng đồng trả công"],
    meaning: "Thành quả đến từ công sức đã bỏ ra; hãy ghi nhận chính mình.",
    work: "Nỗ lực trước đây bắt đầu cho kết quả.",
    family: "Cùng nhau ăn mừng những điều nhỏ đã đạt được.",
    love: "Mối quan hệ được vun đắp đang đến độ chín.",
  },
  {
    number: 13, title: "Sương sớm", level: "Bình",
    poem: ["Sương mai đọng lá chưa tan", "Đợi khi nắng ấm, muôn vàn sáng ra"],
    meaning: "Điều mờ mịt sẽ tan khi đúng lúc; chưa cần vội vàng.",
    work: "Chờ thêm dữ kiện; chuẩn bị sẵn sàng để hành động sau.",
    family: "Những hiểu lầm nhỏ sẽ qua nếu bình tĩnh.",
    love: "Đừng ép mọi thứ rõ ràng ngay; để cảm xúc tự lắng.",
  },
  {
    number: 14, title: "Trúc xanh", level: "Trung",
    poem: ["Trúc xanh trước gió nghiêng mình", "Gió qua đứng thẳng, nguyên hình thanh cao"],
    meaning: "Mềm dẻo trước sóng gió mà không đánh mất cốt cách.",
    work: "Linh hoạt điều chỉnh kế hoạch nhưng giữ nguyên tắc.",
    family: "Nhường một bước không phải là thua.",
    love: "Biết lắng nghe và nhân nhượng giữ mối quan hệ bền.",
  },
  {
    number: 15, title: "Suối nguồn", level: "Trung",
    poem: ["Suối nguồn uốn khúc qua đèo", "Quanh co vẫn tới, mây theo biển chờ"],
    meaning: "Con đường có thể vòng vèo, nhưng hướng đi vẫn đúng.",
    work: "Đường đến mục tiêu không thẳng; đừng nản khi phải đi vòng.",
    family: "Mỗi người một nhịp, cuối cùng vẫn về một nhà.",
    love: "Kiên nhẫn với những khúc quanh của tình cảm.",
  },
  {
    number: 16, title: "Cánh diều", level: "Thượng",
    poem: ["Cánh diều no gió lưng trời", "Dây tay giữ chắc, chơi vơi chẳng màng"],
    meaning: "Bay cao nhờ gió, nhưng vững nhờ sợi dây; tự do cần điểm tựa.",
    work: "Cơ hội mở rộng; giữ chắc kế hoạch và cam kết.",
    family: "Gia đình là sợi dây giữ bạn vững vàng.",
    love: "Cho nhau tự do nhưng giữ sự tin tưởng.",
  },
  {
    number: 17, title: "Ngọc trong đá", level: "Trung",
    poem: ["Ngọc còn ẩn giữa đá sần", "Mài thêm ít nữa, dần dần sáng ra"],
    meaning: "Giá trị đã có sẵn, chỉ cần thêm thời gian mài giũa.",
    work: "Hoàn thiện sản phẩm thêm một bước trước khi giới thiệu.",
    family: "Nhìn ra điểm tốt của người thân và nói lời ghi nhận.",
    love: "Hiểu nhau cần thời gian; điều tốt đẹp đang dần lộ ra.",
  },
  {
    number: 18, title: "Bến đợi", level: "Bình",
    poem: ["Thuyền chưa cập bến hãy chờ", "Nước lên đúng lúc, bơ vơ chẳng còn"],
    meaning: "Chưa phải thời điểm; chờ con nước lên rồi hãy cập bến.",
    work: "Giữ kế hoạch, chờ điều kiện thuận lợi hơn.",
    family: "Một chuyện đang chờ được giải quyết; đừng nôn nóng.",
    love: "Chờ đợi có hy vọng là một dạng yêu thương.",
  },
  {
    number: 19, title: "Hoa mai", level: "Thượng",
    poem: ["Mai vàng nở sớm đầu xuân", "Nhà thêm khách quý, quây quần đến chơi"],
    meaning: "Niềm vui đến sớm; mở cửa đón những cuộc gặp tốt.",
    work: "Có người hỗ trợ hoặc cơ hội giới thiệu mới.",
    family: "Khách đến nhà, không khí rộn ràng.",
    love: "Một cuộc gặp gỡ dễ chịu đang chờ.",
  },
  {
    number: 20, title: "Ngã ba đường", level: "Bình",
    poem: ["Ngã ba dừng bước phân vân", "Hỏi người đi trước, đường gần hiện ra"],
    meaning: "Đang đứng trước lựa chọn; lời khuyên của người từng trải sẽ hữu ích.",
    work: "Tham khảo người có kinh nghiệm trước khi quyết định.",
    family: "Bàn bạc cùng nhau thay vì tự quyết một mình.",
    love: "Nói ra điều mình băn khoăn với người thương.",
  },
  {
    number: 21, title: "Mưa rào", level: "Trung",
    poem: ["Mưa rào chợt đến rồi qua", "Cầu vồng ló dạng, cửa nhà sáng trong"],
    meaning: "Chuyện bất chợt rồi sẽ qua nhanh, để lại không khí trong lành.",
    work: "Một trục trặc nhỏ, xử lý bình tĩnh là xong.",
    family: "Cãi vã nhỏ sẽ qua; chủ động làm lành.",
    love: "Sau giận hờn là sự thấu hiểu hơn.",
  },
  {
    number: 22, title: "Cây đa", level: "Thượng",
    poem: ["Cây đa rễ bám sâu bền", "Bóng che cả xóm, vững nền ông cha"],
    meaning: "Nền tảng vững từ gốc rễ gia đình và truyền thống.",
    work: "Uy tín lâu năm là tài sản; giữ gìn nó.",
    family: "Thăm hỏi ông bà, người lớn tuổi trong nhà.",
    love: "Mối quan hệ được gia đình ủng hộ sẽ vững vàng.",
  },
  {
    number: 23, title: "Tằm nhả tơ", level: "Trung",
    poem: ["Tằm ăn lá dâu nhả tơ", "Việc làm thầm lặng, bất ngờ thành công"],
    meaning: "Cần mẫn âm thầm, rồi một ngày kết quả sẽ khiến chính mình bất ngờ.",
    work: "Tập trung làm, chưa cần khoe; thành quả tự lên tiếng.",
    family: "Những đóng góp thầm lặng của ai đó đáng được cảm ơn.",
    love: "Quan tâm không cần ồn ào.",
  },
  {
    number: 24, title: "Gương mờ", level: "Bình",
    poem: ["Gương lâu bụi phủ mờ hình", "Lau qua một chút, chính mình hiện ra"],
    meaning: "Bận rộn làm mờ đi điều mình thật sự muốn; dành thời gian nhìn lại.",
    work: "Rà soát mục tiêu: việc nào thật sự quan trọng?",
    family: "Dọn dẹp nhà cửa cũng là dọn lòng.",
    love: "Tự hỏi mình cần gì trước khi đòi hỏi ở người khác.",
  },
  {
    number: 25, title: "Đôi chim", level: "Thượng",
    poem: ["Đôi chim chung cánh bay xa", "Đồng lòng gió ngược cũng qua dễ dàng"],
    meaning: "Đồng lòng thì mọi khó khăn đều nhẹ đi.",
    work: "Làm việc nhóm hiệu quả; phân chia rõ ràng.",
    family: "Vợ chồng, anh em cùng bàn bạc sẽ thuận.",
    love: "Hai người cùng hướng nhìn, cùng nhau tiến bước.",
  },
  {
    number: 26, title: "Trăng non", level: "Bình",
    poem: ["Trăng non khuyết lúc đầu tuần", "Chờ thêm ít bữa, trăng xuân tròn đầy"],
    meaning: "Mọi thứ mới bắt đầu, chưa trọn vẹn; thời gian sẽ làm đầy.",
    work: "Dự án mới cần thêm thời gian hoàn thiện.",
    family: "Chưa hài lòng hết mọi điều cũng là bình thường.",
    love: "Mối quan hệ đang lớn dần; đừng so với hình mẫu hoàn hảo.",
  },
  {
    number: 27, title: "Buồm căng", level: "Thượng",
    poem: ["Buồm căng gió thuận ra khơi", "Lưới đầy cá bạc, rạng ngời bình minh"],
    meaning: "Gió thuận, thời cơ tốt để ra khơi; chuẩn bị kỹ rồi lên đường.",
    work: "Thời điểm thuận để thực hiện kế hoạch đã chuẩn bị.",
    family: "Một chuyến đi cùng nhau sẽ đáng nhớ.",
    love: "Mạnh dạn bày tỏ, thời điểm đang thuận.",
  },
  {
    number: 28, title: "Đường núi", level: "Trung",
    poem: ["Đường lên núi đá gập ghềnh", "Lên cao mới thấy mông mênh đất trời"],
    meaning: "Chặng khó dẫn đến tầm nhìn rộng; vất vả hôm nay mở ra góc nhìn mới.",
    work: "Thử thách hiện tại giúp bạn trưởng thành.",
    family: "Cùng nhau vượt qua khó khăn, tình thân thêm sâu.",
    love: "Trải qua thử thách, hai người hiểu nhau hơn.",
  },
  {
    number: 29, title: "Lò gốm", level: "Trung",
    poem: ["Đất thô qua lửa thành bình", "Lửa nung càng kỹ, dáng hình càng xinh"],
    meaning: "Áp lực vừa đủ giúp định hình điều quý giá.",
    work: "Góp ý thẳng thắn giúp sản phẩm tốt hơn.",
    family: "Kỷ luật trong nhà, nếu đi cùng yêu thương, là món quà.",
    love: "Cùng nhau sửa đổi để mối quan hệ đẹp hơn.",
  },
  {
    number: 30, title: "Ao thu", level: "Bình",
    poem: ["Ao thu lặng nước trong veo", "Lá vàng một chiếc, gió theo nhẹ nhàng"],
    meaning: "Một quãng lặng để nghỉ ngơi và buông bớt.",
    work: "Không cần tăng tốc lúc này; làm gọn những việc đang có.",
    family: "Dành thời gian yên tĩnh bên nhau.",
    love: "Bình thản đón nhận, không níu kéo điều đã qua.",
  },
  {
    number: 31, title: "Chuông chùa", level: "Thượng",
    poem: ["Chuông chùa vọng tiếng ban mai", "Lòng an trí sáng, đường dài thênh thang"],
    meaning: "Tâm an thì trí sáng; con đường phía trước rộng mở.",
    work: "Quyết định sáng suốt khi giữ bình tĩnh.",
    family: "Không khí an hòa, thuận lợi cho việc lớn trong nhà.",
    love: "Bình yên trong lòng giúp tình cảm trong trẻo.",
  },
  {
    number: 32, title: "Tổ ong", level: "Trung",
    poem: ["Ong chăm hút nhụy ngày dài", "Mật thơm tích được nhờ ai siêng làm"],
    meaning: "Siêng năng và phối hợp tạo nên thành quả ngọt ngào.",
    work: "Chăm chỉ và làm việc nhóm sẽ có kết quả.",
    family: "Mỗi người góp một tay, việc nhà nhẹ hẳn.",
    love: "Cùng nhau xây dựng những kế hoạch nhỏ.",
  },
  {
    number: 33, title: "Cửa sổ mở", level: "Thượng",
    poem: ["Mở toang cửa sổ sáng mai", "Nắng vào gió lộng, ngày dài thảnh thơi"],
    meaning: "Mở lòng đón điều mới, không khí trong lành sẽ ùa vào.",
    work: "Đón nhận ý kiến khác để tìm lời giải.",
    family: "Thông thoáng nhà cửa, tinh thần cũng nhẹ nhõm.",
    love: "Cởi mở chia sẻ, mối quan hệ thêm thoải mái.",
  },
  {
    number: 34, title: "Rễ cây", level: "Bình",
    poem: ["Cây cao nhờ rễ sâu dày", "Chăm từ gốc rễ, có ngày cành xanh"],
    meaning: "Điều thấy được nhờ điều không thấy; chăm cái gốc trước.",
    work: "Củng cố nền tảng trước khi mở rộng.",
    family: "Sức khỏe và giấc ngủ của cả nhà là gốc rễ.",
    love: "Sự tin tưởng là gốc của mọi tình cảm.",
  },
  {
    number: 35, title: "Bếp hồng", level: "Trung",
    poem: ["Bếp hồng giữ lửa đêm đông", "Cả nhà sum họp, mặn nồng bên nhau"],
    meaning: "Giữ lửa ấm cho những người thân yêu trong lúc lạnh.",
    work: "Động viên đồng đội trong giai đoạn bận rộn.",
    family: "Một bữa cơm nhà ấm áp là điều quý.",
    love: "Ấm áp và quan tâm giữ lửa tình cảm.",
  },
  {
    number: 36, title: "Sao Bắc Đẩu", level: "Thượng",
    poem: ["Đêm sâu Bắc Đẩu chỉ đường", "Giữ lòng hướng thiện, bốn phương vững vàng"],
    meaning: "Giữa đêm tối vẫn có ngôi sao dẫn lối: giá trị của bạn là la bàn.",
    work: "Bám theo giá trị cốt lõi khi phải lựa chọn.",
    family: "Truyền cho nhau những điều tử tế.",
    love: "Thành thật là kim chỉ nam cho tình cảm.",
  },
];

export function getXam(n: number): Xam | undefined {
  return XAM.find((x) => x.number === n);
}
