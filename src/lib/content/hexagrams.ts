/**
 * Ý nghĩa 64 quẻ – An Mệnh tự diễn giải ngắn gọn dựa trên tinh thần chung của quái từ và đại tượng
 * trong Kinh Dịch (văn bản cổ), viết theo hướng gợi mở, không tiên đoán.
 * Thứ tự theo số quẻ Văn Vương (chỉ số 0 = quẻ 1).
 */

export interface HexagramMeaning {
  keyword: string;
  image: string;
  meaning: string;
  advice: string;
}

export const HEXAGRAM_MEANINGS: readonly HexagramMeaning[] = [
  { keyword: "Sáng tạo, mạnh mẽ", image: "Trời vận hành không ngừng.", meaning: "Sáu hào dương thuần khiết, gợi sức sáng tạo, ý chí và khả năng dẫn dắt.", advice: "Chủ động tiến lên nhưng giữ sự khiêm tốn; bền bỉ quan trọng hơn bùng nổ." },
  { keyword: "Đón nhận, nuôi dưỡng", image: "Đất rộng chở muôn vật.", meaning: "Sáu hào âm, gợi sự mềm mỏng, bao dung và sức chịu đựng bền bỉ.", advice: "Lắng nghe, hỗ trợ và để mọi việc chín muồi một cách tự nhiên." },
  { keyword: "Khởi đầu gian nan", image: "Mây và sấm cùng lúc, như mầm non đội đất.", meaning: "Mọi khởi đầu đều có chút rối ren; khó khăn ban đầu là một phần của sự lớn lên.", advice: "Đừng vội vàng; tìm người đồng hành và sắp xếp từng việc nhỏ." },
  { keyword: "Non trẻ, học hỏi", image: "Dưới chân núi có dòng suối mới chảy ra.", meaning: "Điều còn mờ mịt cần được khai mở bằng sự học hỏi chân thành.", advice: "Khiêm tốn hỏi người có kinh nghiệm, và hỏi một lần cho thật rõ." },
  { keyword: "Chờ đợi", image: "Mây đã lên trời nhưng mưa chưa xuống.", meaning: "Thời điểm chưa đến; chờ đợi có chuẩn bị không phải là đứng yên.", advice: "Giữ sức, nuôi dưỡng bản thân và chuẩn bị cho lúc cơ hội tới." },
  { keyword: "Bất đồng", image: "Trời đi lên, nước chảy xuống, hai hướng ngược nhau.", meaning: "Dễ nảy sinh tranh luận khi mỗi bên giữ một hướng riêng.", advice: "Tìm điểm chung, nhờ người trung gian; đừng đẩy mâu thuẫn đến cùng." },
  { keyword: "Tổ chức, kỷ luật", image: "Nước ẩn trong lòng đất.", meaning: "Sức mạnh tập thể cần mục tiêu chính đáng và người dẫn dắt đáng tin.", advice: "Xác định rõ mục tiêu, phân công hợp lý và giữ kỷ luật." },
  { keyword: "Gắn kết", image: "Nước nằm trên mặt đất, thấm vào nhau.", meaning: "Thời điểm của sự nương tựa và đoàn kết.", advice: "Chủ động kết nối, chân thành với những người cùng chí hướng." },
  { keyword: "Tích lũy nhỏ", image: "Gió thổi trên trời, mây dày mà chưa mưa.", meaning: "Những trở ngại nhỏ làm chậm bước, nhưng cũng là lúc vun đắp nền tảng.", advice: "Trau dồi việc nhỏ hằng ngày; việc lớn để khi đủ duyên." },
  { keyword: "Bước đi đúng mực", image: "Trời ở trên, đầm ở dưới, trên dưới phân minh.", meaning: "Đi trong tình huống khó bằng sự lễ độ và cẩn trọng.", advice: "Biết vị trí của mình, cư xử nhã nhặn mà vẫn giữ nguyên tắc." },
  { keyword: "Thông suốt, hòa hợp", image: "Đất ở trên, trời ở dưới: trời đất giao hòa.", meaning: "Trên dưới thông nhau, mọi việc dễ trôi chảy.", advice: "Tận dụng lúc thuận lợi để vun đắp, nhưng đừng chủ quan." },
  { keyword: "Bế tắc tạm thời", image: "Trời và đất không giao nhau.", meaning: "Giai đoạn trên dưới khó hiểu nhau; mọi thứ cần thời gian để thông trở lại.", advice: "Giữ mình, tiết chế và kiên nhẫn; mùa nào rồi cũng qua." },
  { keyword: "Đồng lòng", image: "Lửa bốc lên trời, người cùng chí hướng tụ lại.", meaning: "Sự hợp tác dựa trên lẽ công bằng và mục đích chung.", advice: "Mở lòng với người khác, minh bạch và đối xử công bằng." },
  { keyword: "Sung túc", image: "Mặt trời trên cao soi khắp muôn nơi.", meaning: "Thời điểm có nhiều điều trong tay, cả vật chất lẫn tinh thần.", advice: "Biết chia sẻ và dùng điều mình có một cách tử tế." },
  { keyword: "Khiêm tốn", image: "Núi cao ẩn mình dưới mặt đất.", meaning: "Có mà không khoe, cao mà biết hạ mình.", advice: "Khiêm nhường giúp mọi việc trôi chảy và bền lâu." },
  { keyword: "Hứng khởi", image: "Sấm vang lên từ lòng đất.", meaning: "Niềm vui và nhiệt huyết được khơi dậy.", advice: "Truyền cảm hứng cho mọi người, đồng thời chuẩn bị chu đáo." },
  { keyword: "Thuận theo", image: "Sấm lặn vào trong đầm, đến lúc nghỉ ngơi.", meaning: "Biết theo thời: lúc làm, lúc nghỉ, lúc dẫn, lúc theo.", advice: "Linh hoạt thích ứng; theo điều đúng thay vì theo số đông." },
  { keyword: "Sửa sang cái cũ", image: "Gió dưới chân núi, vật để lâu sinh hư.", meaning: "Những điều tồn đọng cần được nhìn nhận và sửa lại.", advice: "Nhận ra điều cần thay đổi và bắt tay làm lại cho tốt." },
  { keyword: "Đến gần", image: "Đất trên đầm, người trên đến gần chăm lo người dưới.", meaning: "Thời điểm của sự gần gũi, quan tâm và lớn mạnh dần.", advice: "Tận dụng đà thuận, nhưng nhìn xa để không lơ là." },
  { keyword: "Quan sát", image: "Gió thổi khắp mặt đất.", meaning: "Nhìn rộng để hiểu sâu; cũng là lúc mình được người khác nhìn vào.", advice: "Lùi lại một bước để quan sát và chiêm nghiệm trước khi làm." },
  { keyword: "Gỡ vật cản", image: "Sấm và chớp cùng đến.", meaning: "Như cắn vỡ vật chắn giữa hai hàm, cần xử lý dứt khoát điều cản trở.", advice: "Giải quyết rõ ràng, công bằng; đừng để việc nhỏ kéo dài." },
  { keyword: "Vẻ đẹp", image: "Lửa sáng dưới chân núi.", meaning: "Hình thức tô điểm cho nội dung, nhưng không thay được nội dung.", advice: "Chăm chút vừa đủ, giữ cái gốc chân thật." },
  { keyword: "Bóc dần", image: "Núi đứng trên đất đang mòn dần.", meaning: "Giai đoạn mọi thứ thu hẹp lại; giữ được gốc là đủ.", advice: "Bảo toàn nền tảng, giảm bớt; chưa phải lúc mở rộng." },
  { keyword: "Trở lại", image: "Sấm trong lòng đất, dương khí bắt đầu quay về.", meaning: "Sau giai đoạn trầm lắng là sự hồi phục nhẹ nhàng.", advice: "Bắt đầu lại từng bước nhỏ; nghỉ ngơi để hồi sức." },
  { keyword: "Chân thật", image: "Sấm dưới trời, vạn vật vận hành tự nhiên.", meaning: "Hành động từ sự chân thành, không mưu tính quá mức.", advice: "Làm điều đúng vì nó đúng, và chấp nhận điều ngoài dự tính." },
  { keyword: "Tích lũy lớn", image: "Trời nằm trong lòng núi.", meaning: "Sức mạnh được tích chứa bằng học hỏi và rèn luyện.", advice: "Học thêm, tích lũy kiến thức và nội lực cho việc lớn." },
  { keyword: "Nuôi dưỡng", image: "Sấm dưới núi, như hình miệng đang ăn.", meaning: "Điều mình nạp vào – thức ăn, lời nói, suy nghĩ – tạo nên chính mình.", advice: "Chọn lọc điều mình nuôi dưỡng và điều mình nói ra." },
  { keyword: "Quá tải", image: "Nước đầm ngập cả cây, xà nhà oằn xuống.", meaning: "Gánh nặng vượt quá sức chứa, cần tìm lại điểm cân bằng.", advice: "Giảm tải, ưu tiên việc quan trọng nhất và nhờ người hỗ trợ." },
  { keyword: "Vượt hiểm", image: "Nước nối tiếp nước chảy qua chỗ trũng.", meaning: "Khó khăn lặp lại, nhưng nước vẫn chảy, không bỏ hình dạng của mình.", advice: "Giữ lòng tin và sự kiên định; đi từng đoạn một." },
  { keyword: "Sáng rõ", image: "Lửa nối lửa, ánh sáng cần nơi nương tựa.", meaning: "Sự sáng suốt và điều mình chọn để gắn bó.", advice: "Giữ đầu óc minh mẫn, chọn điều đáng để bám vào." },
  { keyword: "Cảm ứng", image: "Đầm trên núi, hai bên cảm nhau.", meaning: "Sự rung động và thu hút nhẹ nhàng giữa người với người.", advice: "Mở lòng, chân thành; lắng nghe cảm xúc của cả hai phía." },
  { keyword: "Bền lâu", image: "Sấm và gió luôn đi cùng nhau.", meaning: "Giá trị của sự kiên trì và nhất quán.", advice: "Giữ nhịp đều đặn; cam kết với điều đã chọn." },
  { keyword: "Lui về", image: "Núi đứng dưới trời cao.", meaning: "Biết rút lui đúng lúc để giữ sức và giữ mình.", advice: "Lui có chủ đích không phải là bỏ cuộc; chọn trận cần đánh." },
  { keyword: "Sức mạnh lớn", image: "Sấm vang trên trời.", meaning: "Năng lượng dồi dào, cần được dẫn dắt đúng hướng.", advice: "Dùng sức mạnh một cách chính đáng, tránh hấp tấp." },
  { keyword: "Tiến lên", image: "Mặt trời mọc lên khỏi mặt đất.", meaning: "Sự tiến bộ dần dần và được ghi nhận.", advice: "Tiến lên với sự minh bạch; làm tốt việc của mình." },
  { keyword: "Ánh sáng ẩn", image: "Mặt trời lặn vào lòng đất.", meaning: "Lúc nên giữ ánh sáng bên trong, kín đáo mà không đánh mất mình.", advice: "Kiên nhẫn, khiêm tốn và giữ gìn giá trị của bản thân." },
  { keyword: "Người nhà", image: "Gió từ lửa thổi ra, ảnh hưởng bắt đầu từ trong nhà.", meaning: "Sự hòa thuận trong gia đình là nền của mọi việc.", advice: "Mỗi người làm tốt vai trò của mình; nói lời ấm áp." },
  { keyword: "Khác biệt", image: "Lửa bốc lên, nước đầm chảy xuống.", meaning: "Hai hướng khác nhau vẫn có thể cùng tồn tại.", advice: "Tôn trọng khác biệt, tìm sự hòa hợp từ những việc nhỏ." },
  { keyword: "Trở ngại", image: "Nước trên núi, đường đi khó khăn.", meaning: "Phía trước có vật cản; dừng lại là để nhìn lại mình.", advice: "Xem xét kỹ, tìm người giúp đỡ và tự hoàn thiện." },
  { keyword: "Giải tỏa", image: "Sấm và mưa cùng đến, không khí trong lành trở lại.", meaning: "Căng thẳng được gỡ bỏ, mọi thứ nhẹ nhõm hơn.", advice: "Buông bỏ điều đã qua, tha thứ và bắt đầu nhẹ nhàng." },
  { keyword: "Bớt đi", image: "Đầm dưới chân núi.", meaning: "Bớt điều thừa để có chỗ cho điều cần.", advice: "Giản lược, tiết chế; cho đi đúng lúc cũng là nhận lại." },
  { keyword: "Thêm vào", image: "Gió và sấm tiếp sức cho nhau.", meaning: "Thời điểm của sự bồi đắp và giúp đỡ lẫn nhau.", advice: "Học điều tốt, sửa điều chưa tốt; giúp người cũng là giúp mình." },
  { keyword: "Quyết đoán", image: "Nước đầm dâng cao lên tận trời.", meaning: "Đến lúc cần đưa ra quyết định rõ ràng.", advice: "Nói thẳng điều cần nói nhưng giữ sự ôn hòa." },
  { keyword: "Gặp gỡ", image: "Gió thổi dưới trời, gặp mọi vật.", meaning: "Những cuộc gặp bất ngờ có sức hút riêng.", advice: "Tỉnh táo trước điều mới; giữ nguyên tắc của mình." },
  { keyword: "Tụ họp", image: "Nước đầm tụ lại trên mặt đất.", meaning: "Mọi người quy tụ quanh một mục tiêu chung.", advice: "Gắn kết bằng sự chân thành; chuẩn bị chu đáo cho việc chung." },
  { keyword: "Đi lên", image: "Cây non mọc lên từ lòng đất.", meaning: "Sự phát triển đều đặn từ thấp lên cao.", advice: "Tiến từng bước; nỗ lực nhỏ tích lại thành lớn." },
  { keyword: "Khốn khó", image: "Đầm cạn không còn nước.", meaning: "Giai đoạn thiếu thốn, thử thách sự kiên định.", advice: "Giữ vững tinh thần; ít lời, làm chắc." },
  { keyword: "Cái giếng", image: "Nước được kéo lên từ giếng sâu.", meaning: "Nguồn nuôi dưỡng bền lâu cần được chăm sóc.", advice: "Bồi đắp nội lực; giá trị thật nằm ở sự chăm chút đều đặn." },
  { keyword: "Đổi mới", image: "Lửa trong đầm, thay đổi tận gốc.", meaning: "Thay đổi lớn khi thời điểm đã chín muồi.", advice: "Thay đổi khi đã hiểu rõ và được mọi người đồng thuận." },
  { keyword: "Chuyển hóa", image: "Lửa cháy dưới vạc, nấu chín vật liệu.", meaning: "Biến điều thô sơ thành điều có giá trị.", advice: "Nuôi dưỡng điều quý giá; hợp tác để tạo nên giá trị mới." },
  { keyword: "Chấn động", image: "Sấm nối tiếp sấm.", meaning: "Điều bất ngờ làm ta giật mình, rồi tỉnh thức.", advice: "Bình tĩnh trước biến động; sau đó nhìn lại điều cần học." },
  { keyword: "Dừng lại", image: "Núi nối tiếp núi.", meaning: "Tĩnh lặng và biết dừng đúng lúc.", advice: "Nghỉ ngơi, suy nghĩ trong phạm vi của mình; không cần làm thêm." },
  { keyword: "Tiến dần", image: "Cây trên núi lớn chậm mà chắc.", meaning: "Mọi điều tốt đẹp cần thời gian và trình tự.", advice: "Kiên nhẫn đi từng bước, đừng bỏ qua giai đoạn nào." },
  { keyword: "Khởi đầu chưa chủ động", image: "Sấm trên mặt đầm.", meaning: "Ở vị trí chưa thể quyết định mọi thứ, cần biết điều tiết.", advice: "Hiểu rõ vị trí của mình; tránh nóng vội trong các mối quan hệ." },
  { keyword: "Thịnh vượng", image: "Sấm và chớp cùng đến, sáng rực.", meaning: "Thời điểm đầy đủ, rực rỡ như mặt trời giữa trưa.", advice: "Tận hưởng lúc đầy và chuẩn bị cho lúc vơi." },
  { keyword: "Lữ khách", image: "Lửa cháy trên núi, di chuyển không ngừng.", meaning: "Ở nơi mới, như người lữ khách cần sự mềm mỏng.", advice: "Khiêm tốn, linh hoạt và cẩn trọng khi ở môi trường lạ." },
  { keyword: "Nhẹ nhàng thấm sâu", image: "Gió nối tiếp gió.", meaning: "Ảnh hưởng bền bỉ, nhẹ nhàng hơn là ép buộc.", advice: "Kiên trì từng chút một; mềm mà không yếu." },
  { keyword: "Vui vẻ", image: "Đầm nối tiếp đầm, nước thông nhau.", meaning: "Niềm vui khi được chia sẻ và trò chuyện.", advice: "Cởi mở, vui vẻ nhưng chân thành." },
  { keyword: "Tan tỏa", image: "Gió thổi trên mặt nước, băng giá tan dần.", meaning: "Những khoảng cách và cứng nhắc được làm tan.", advice: "Gỡ bỏ hiềm khích, cởi mở và hòa giải." },
  { keyword: "Tiết chế", image: "Nước trên đầm, có bờ có giới hạn.", meaning: "Giới hạn hợp lý giúp mọi thứ bền vững.", advice: "Đặt giới hạn cho mình, nhưng đừng khắt khe quá mức." },
  { keyword: "Thành tín", image: "Gió thổi trên đầm, lòng thành cảm được người.", meaning: "Sự chân thành có sức lay động sâu xa.", advice: "Giữ chữ tín, lắng nghe bằng cả tấm lòng." },
  { keyword: "Hơi quá một chút", image: "Sấm trên núi, tiếng vang nhỏ.", meaning: "Hợp với việc nhỏ hơn việc lớn; cẩn trọng từng chi tiết.", advice: "Làm tốt việc nhỏ; khiêm tốn, không vươn quá sức." },
  { keyword: "Đã thành", image: "Nước ở trên lửa, mọi thứ vào đúng vị trí.", meaning: "Việc đã xong, nhưng giữ được còn khó hơn làm được.", advice: "Giữ gìn thành quả, cẩn trọng vì cái kết cũng là khởi đầu." },
  { keyword: "Chưa xong", image: "Lửa ở trên nước, sắp đến nơi mà chưa tới.", meaning: "Mọi việc vẫn đang mở, đầy khả năng.", advice: "Cẩn trọng ở chặng cuối; chuẩn bị kỹ trước khi bước qua." },
];
