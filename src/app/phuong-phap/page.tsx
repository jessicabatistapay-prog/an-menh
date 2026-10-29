import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/app/page-header";

export const metadata: Metadata = {
  title: "Phương pháp và nguồn tham khảo",
  description: "Thuật toán, bảng tra, nguồn tham khảo, cách kiểm thử và phạm vi hỗ trợ của An Mệnh.",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-[#2a395680] py-3 md:grid-cols-[11rem_1fr] md:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="leading-relaxed">{children}</dd>
    </div>
  );
}

export default function PhuongPhapPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Phương pháp và nguồn tham khảo"
        description="Mọi phép tính trong An Mệnh chạy ngay trên thiết bị của bạn bằng mã nguồn xác định: cùng đầu vào luôn cho cùng kết quả. Không phần nào dùng trí tuệ nhân tạo. Chỉ gieo quẻ, xin xăm, Tarot và rút thẻ dùng số ngẫu nhiên."
      />

      <Section title="Âm lịch Việt Nam" id="am-lich">
        <dl>
          <Row label="Phương pháp">
            Tính thời điểm sóc (trăng mới) và kinh độ Mặt Trời bằng công thức gần đúng của Jean Meeus, sau đó áp dụng quy tắc lập lịch âm
            Việt Nam: ngày chứa sóc là mùng 1; tháng 11 âm luôn chứa Đông chí; năm có 13 tháng thì tháng đầu tiên không chứa trung khí là
            tháng nhuận.
          </Row>
          <Row label="Múi giờ">UTC+7 (giờ Việt Nam) cho mọi ngày. Ngày sinh được xử lý như ngày lịch, không qua chuyển đổi UTC.</Row>
          <Row label="Phạm vi">Từ 31/01/1900 đến 31/12/2100. Ngày ngoài phạm vi sẽ được báo là chưa hỗ trợ.</Row>
          <Row label="Kiểm tra">
            Mã nguồn được viết riêng cho An Mệnh. Kết quả được đối chiếu trên toàn bộ 73.384 ngày trong phạm vi: khớp hoàn toàn với bản
            JavaScript của chương trình âm lịch Hồ Ngọc Đức ở UTC+7, trừ 2 ngày (07/05/2054 và 09/04/2062) mà chương trình đó trả về “ngày 0”
            do lỗi biên; An Mệnh tính ra ngày 30 của tháng trước. Khi đặt múi giờ UTC+8 và so với thư viện lunar-javascript (lịch Trung Quốc,
            mô hình thiên văn khác), có 150 ngày khác nhau, tập trung ở 5 giai đoạn: cuối 1914, đầu 1916, cuối 1920, tháng 9–10/2057 và
            tháng 8–9/2097 — là những thời điểm sóc hoặc trung khí rơi rất sát nửa đêm.
          </Row>
          <Row label="Lưu ý lịch cũ">
            Lịch âm Việt Nam trước năm 1968 (và ở miền Nam đến năm 1975) thường được tính theo UTC+8. Với ngày sinh trước năm 1976, nếu cách
            tính UTC+8 cho kết quả khác, trang kết quả sẽ hiển thị cả hai.
          </Row>
          <Row label="Tại sao không dùng thư viện có sẵn">
            Các bản chuyển thể phổ biến của chương trình Hồ Ngọc Đức mang giấy phép chỉ cho phép dùng cá nhân, phi thương mại; các thư viện
            lịch Trung Quốc tính theo UTC+8 nên lệch với lịch Việt Nam ở một số năm (ví dụ Tết 1985, 2007, 2030). Vì vậy An Mệnh tự triển
            khai và chỉ dùng các thư viện đó để đối chiếu khi kiểm thử.
          </Row>
        </dl>
      </Section>

      <Section title="Can Chi và nạp âm" id="can-chi">
        <dl>
          <Row label="Can Chi năm">
            Theo năm âm lịch (chuyển năm tại Tết Nguyên đán): Can = (năm + 6) mod 10, Chi = (năm + 8) mod 12; năm 1984 là Giáp Tý.
          </Row>
          <Row label="Can Chi ngày, tháng">
            Ngày: theo số ngày Julius (01/01/2000 là ngày Mậu Ngọ). Tháng: tháng Giêng luôn là tháng Dần, Can tháng suy từ Can năm.
          </Row>
          <Row label="Bảng nạp âm">
            30 cặp nạp âm của 60 hoa giáp theo bảng truyền thống, được chép và giải thích trong “Tam Mệnh Thông Hội” (Vạn Dân Anh, đời Minh).
            Kiểm thử xác nhận bảng đủ 30 mục, mỗi hành 6 lần, cặp Can Chi khớp thứ tự vòng 60.
          </Row>
          <Row label="Màu sắc">
            Gợi ý màu theo quy ước phổ biến: màu bản hành và màu của hành tương sinh cho mình. Đây là quy ước tham khảo, không có căn cứ đo
            lường.
          </Row>
        </dl>
      </Section>

      <Section title="Cung phi và Bát trạch" id="bat-trach">
        <dl>
          <Row label="Công thức cung phi">
            Theo năm âm lịch (quy ước Tết, không dùng Lập Xuân). Nam: k = (11 − năm mod 9) mod 9; nữ: k = (năm mod 9 + 4) mod 9; k = 0 thì là
            9. Số 5: nam quy về Khôn, nữ quy về Cấn. Công thức được kiểm thử khớp với bảng tra truyền thống cho mọi năm 1900–2099.
          </Row>
          <Row label="Bảng du niên">
            Bảng tám sao (Sinh Khí, Thiên Y, Diên Niên, Phục Vị, Họa Hại, Ngũ Quỷ, Lục Sát, Tuyệt Mệnh) cho tám cung theo hệ Bát trạch, được
            lưu truyền trong “Bát trạch minh kính”. Kiểm thử xác nhận mỗi cung đủ tám hướng, quan hệ giữa hai cung đối xứng và bốn hướng thuận
            luôn cùng nhóm Đông/Tây.
          </Row>
          <Row label="Quy ước hướng">
            Hướng nhà là hướng mặt nhà; trạch của nhà xét theo hướng tọa (ngược lại). Ứng dụng không đọc la bàn của thiết bị.
          </Row>
        </dl>
      </Section>

      <Section title="Thần số học" id="than-so-hoc">
        <dl>
          <Row label="Quy tắc">
            Cộng tất cả chữ số của ngày sinh dạng DD MM YYYY. Nếu tổng là 11, 22 hoặc 33 thì giữ nguyên; nếu không, cộng tiếp các chữ số cho
            đến khi được số từ 1 đến 9, dừng sớm nếu gặp 11, 22 hoặc 33 ở bước trung gian.
          </Row>
          <Row label="Nguồn">
            Thần số học không có một văn bản chuẩn duy nhất; quy tắc trên là một biến thể phổ biến. Diễn giải ý nghĩa các con số do An Mệnh
            tự biên soạn theo hướng gợi mở, không trích từ tài liệu cụ thể.
          </Row>
          <Row label="Chưa hỗ trợ">Các chỉ số theo tên, vì chưa có quy tắc chuẩn hóa tên tiếng Việt có dấu được thống nhất.</Row>
        </dl>
      </Section>

      <Section title="Lịch âm dương và tiết khí" id="lich">
        <dl>
          <Row label="Đổi âm sang dương">
            Đi từ Tết của năm âm lịch, cộng dần độ dài từng tháng (tính bằng cùng bộ âm lịch ở trên) cho đến tháng cần tìm. Mỗi kết quả được
            đổi ngược lại để kiểm tra; ngày âm không tồn tại (ngày 30 của tháng thiếu, tháng nhuận không có trong năm) được báo lỗi. Kiểm thử
            đổi qua lại khớp nhau trên mọi ngày từ 31/01/1900 đến 31/12/2100.
          </Row>
          <Row label="Tiết khí">
            Ngày bắt đầu tiết là ngày (giờ Việt Nam) Mặt Trời đi qua mốc kinh độ bội số của 15°, dùng cùng công thức kinh độ Mặt Trời của
            Meeus. Kiểm thử: mỗi năm 1901–2099 có đủ 24 tiết đúng thứ tự, Đông chí luôn rơi vào tháng 11 âm lịch, và một số ngày Xuân phân,
            Hạ chí, Thu phân, Đông chí, Lập xuân đã biết. Vì công thức là gần đúng, tiết bắt đầu sát nửa đêm có thể lệch một ngày.
          </Row>
          <Row label="Ngày lễ">
            Các ngày lễ, Tết truyền thống theo âm lịch (không áp dụng cho tháng nhuận) và một số ngày lễ, kỷ niệm theo dương lịch. Đây không
            phải lịch nghỉ lễ chính thức. Lịch không đánh giá ngày tốt hay xấu.
          </Row>
        </dl>
      </Section>

      <Section title="Xem tuổi hai người" id="hop-tuoi">
        <dl>
          <Row label="Địa Chi">
            Tam hợp (chi cùng số dư khi chia 4: Thân–Tý–Thìn, Tỵ–Dậu–Sửu, Dần–Ngọ–Tuất, Hợi–Mão–Mùi), lục hợp (Tý–Sửu, Dần–Hợi, Mão–Tuất,
            Thìn–Dậu, Tỵ–Thân, Ngọ–Mùi), lục xung (hai chi đối nhau), lục hại (Tý–Mùi, Sửu–Ngọ, Dần–Tỵ, Mão–Thìn, Thân–Hợi, Dậu–Tuất), theo cách
            luận phổ biến trong các sách mệnh lý như Tam Mệnh Thông Hội. Kiểm thử: mỗi chi có đúng 2 tam hợp, 1 lục hợp, 1 lục xung, 1 lục hại.
          </Row>
          <Row label="Thiên Can và nạp âm">
            Can hợp: Giáp–Kỷ, Ất–Canh, Bính–Tân, Đinh–Nhâm, Mậu–Quý. Sinh khắc giữa hai hành nạp âm theo vòng ngũ hành.
          </Row>
          <Row label="Không chấm điểm">
            Ứng dụng không cộng điểm hay đưa ra phần trăm “hợp tuổi”, vì không có phương pháp minh bạch nào để quy đổi các quan hệ này thành
            con số.
          </Row>
        </dl>
      </Section>

      <Section title="Năm cá nhân" id="nam-ca-nhan">
        <p className="leading-relaxed">
          Cộng các chữ số của ngày sinh, tháng sinh và năm đang xét, rút gọn về một chữ số từ 1 đến 9; năm cá nhân không giữ số đặc biệt.
          Chủ đề của từng năm do An Mệnh tự biên soạn theo hướng gợi mở.
        </p>
      </Section>

      <Section title="Nhạc nền" id="nhac-nen">
        <p className="leading-relaxed">
          Bản nhạc “Huyền Không” dài 2 phút 40 giây, được An Mệnh soạn và tổng hợp bằng mã nguồn (scripts/music/render.py), không dùng mẫu âm
          thanh có sẵn: thang ngũ cung Rê thứ thêm nốt Mi giáng, đàn tranh tổng hợp với kỹ thuật nhấn và rung, pad dây trầm, chuông, trống
          trầm, cồng và tiếng gió. Bản nhạc được làm để lặp liền mạch. Theo quy định của trình duyệt, nhạc chỉ bắt đầu sau lần chạm hoặc nhấn
          phím đầu tiên; nút ở góc màn hình để bật, tắt và lựa chọn được ghi nhớ. Nếu không tải được file nhạc, ứng dụng phát nhạc ngũ cung tạo
          trực tiếp.
        </p>
      </Section>

      <Section title="Gieo quẻ Kinh Dịch" id="kinh-dich">
        <dl>
          <Row label="Cách gieo">
            Ba đồng xu cho mỗi hào, ngửa tính 3, sấp tính 2: tổng 6 là lão âm (động), 7 thiếu dương, 8 thiếu âm, 9 lão dương (động). Gieo 6
            lần từ hào sơ (dưới cùng) lên hào thượng. Hào động đổi âm dương để ra quẻ biến. Số ngẫu nhiên lấy từ bộ sinh ngẫu nhiên mật mã của
            trình duyệt.
          </Row>
          <Row label="Bảng quẻ">
            64 quẻ theo thứ tự Văn Vương, tra theo quẻ trên và quẻ dưới. Kiểm thử xác nhận đủ 64 quẻ không trùng, đúng tính chất cặp của thứ
            tự Văn Vương (quẻ chẵn là quẻ lẻ lộn ngược, hoặc đảo hào nếu quẻ đối xứng) và tên quẻ ghép đúng quy ước Việt Nam.
          </Row>
          <Row label="Lời giải">Do An Mệnh tự diễn giải ngắn gọn từ tinh thần quái từ và đại tượng; chưa có lời giải riêng cho từng hào.</Row>
        </dl>
      </Section>

      <Section title="Xin xăm và Tarot" id="xam-tarot">
        <dl>
          <Row label="Bộ xăm">
            36 quẻ do An Mệnh tự soạn, mỗi quẻ một câu thơ lục bát (kiểm thử số tiếng, vần và thanh bằng) cùng lời bàn. Không phải bộ xăm
            của đền chùa nào, không có quẻ “hạ”.
          </Row>
          <Row label="Bộ Tarot">
            78 lá theo cấu trúc truyền thống (22 Ẩn chính, 4 bộ Gậy, Cốc, Kiếm, Tiền). Hình vẽ tự thiết kế, ý nghĩa xuôi và ngược tóm tắt từ
            cách đọc phổ biến. Bài được xào bằng thuật toán Fisher–Yates; mỗi lá có 50% khả năng ngược nếu bật lá ngược.
          </Row>
        </dl>
      </Section>

      <Section title="Ngày, giờ hoàng đạo và tử vi hằng ngày" id="hoang-dao">
        <dl>
          <Row label="12 thần trực">
            Thanh Long khởi theo bài ca “Dần Thân gia Tý, Mão Dậu Dần, Thìn Tuất Thìn, Tỵ Hợi Ngọ, Tý Ngọ Thân, Sửu Mùi Tuất”: xét ngày thì
            theo chi của tháng, xét giờ thì theo chi của ngày. Hoàng đạo gồm Thanh Long, Minh Đường, Kim Quỹ, Kim Đường, Ngọc Đường, Tư Mệnh.
          </Row>
          <Row label="Quy ước tháng">
            Tháng âm lịch (tháng Giêng là Dần, tháng nhuận dùng chung chi với tháng chính). Một số sách dùng tháng theo tiết khí nên có thể
            khác ở những ngày giáp ranh.
          </Row>
          <Row label="Đối chiếu">
            Giờ hoàng đạo khớp hoàn toàn với thư viện lunar-javascript trên mọi ngày 1950–2050; ngày hoàng đạo khớp hoàn toàn ở những ngày hai
            cách tính tháng trùng nhau.
          </Row>
          <Row label="Tử vi hằng ngày">
            So chi của ngày với chi của tuổi (cùng chi, tam hợp, lục hợp, lục xung, lục hại), nếu không có quan hệ thì so hành của can ngày
            với hành của tuổi. Lời gợi ý chọn cố định từ nhóm câu tự soạn theo ngày và tuổi; giờ gợi ý là giờ hoàng đạo hợp với tuổi.
          </Row>
        </dl>
      </Section>

      <Section title="Lá số tử vi" id="la-so">
        <dl>
          <Row label="Đã an">
            Mệnh, Thân, 12 cung, Can cung (Ngũ Hổ Độn), Cục theo nạp âm cung Mệnh, 14 chính tinh, Văn Xương, Văn Khúc, Tả Phù, Hữu Bật, Lộc
            Tồn, Kình Dương, Đà La, Địa Không, Địa Kiếp, Thiên Mã, Tứ Hóa, Tuần, Triệt, vòng Trường Sinh, Mệnh chủ, Thân chủ, đại hạn.
          </Row>
          <Row label="Chưa có">
            Thiên Khôi, Thiên Việt, Hỏa Tinh, Linh Tinh, vòng Bác Sĩ, vòng Thái Tuế, các sao lưu niên, tiểu hạn và độ sáng của sao – vì các
            trường phái an những phần này khác nhau.
          </Row>
          <Row label="Quy ước">
            Ngày tháng năm sinh âm lịch theo giờ Việt Nam; tháng nhuận tính như tháng chính; sinh 23h–24h tính giờ Tý của ngày đã nhập; Tứ
            Hóa năm Nhâm dùng Thiên Phủ hóa Khoa theo sách Việt Nam phổ biến.
          </Row>
          <Row label="Đối chiếu">
            4.000 lá số ngẫu nhiên được so với thư viện mã nguồn mở iztro (MIT): Cục, vị trí 12 cung, Thân, các sao đã an, Tứ Hóa (trừ Hóa
            Khoa năm Nhâm), vòng Trường Sinh, Mệnh chủ, Thân chủ và đại hạn đều khớp.
          </Row>
        </dl>
      </Section>

      <Section title="Thẻ chiêm nghiệm" id="the">
        <p className="leading-relaxed">
          24 thẻ do An Mệnh tự biên soạn, không có nguồn gốc lịch sử và không phải hệ thống bói toán cổ truyền. Thẻ được chọn bằng hàm ngẫu
          nhiên của trình duyệt.
        </p>
      </Section>

      <Section title="Nguồn tham khảo" id="nguon">
        <ul className="list-disc space-y-2 pl-5 leading-relaxed marker:text-primary">
          <li>Jean Meeus, Astronomical Algorithms, Willmann-Bell, xuất bản lần 2, 1998.</li>
          <li>
            Hồ Ngọc Đức, “Thuật toán tính âm lịch” và chương trình Âm lịch Việt Nam,{" "}
            <a href="https://www.informatik.uni-leipzig.de/~duc/amlich/" className="text-primary underline underline-offset-4" rel="noopener noreferrer" target="_blank">
              informatik.uni-leipzig.de/~duc/amlich
            </a>
            .
          </li>
          <li>
            H. F. Fliegel và T. C. Van Flandern, “A Machine Algorithm for Processing Calendar Dates”, Communications of the ACM, 1968 (công
            thức số ngày Julius).
          </li>
          <li>Vạn Dân Anh, Tam Mệnh Thông Hội (三命通會), đời Minh – bảng nạp âm, quan hệ hợp, xung, hại.</li>
          <li>Kinh Dịch (易經) – thứ tự 64 quẻ Văn Vương, quái từ và đại tượng.</li>
          <li>Tử Vi Đẩu Số Toàn Thư (紫微斗數全書) – phép an sao tử vi; đối chiếu với thư viện iztro (github.com/SylarLong/iztro, giấy phép MIT).</li>
          <li>Thư viện lunar-javascript (6tail, giấy phép MIT) – đối chiếu âm lịch UTC+8, ngày và giờ hoàng đạo.</li>
          <li>Bát trạch minh kính (八宅明鏡) – bảng du niên Bát trạch.</li>
        </ul>
      </Section>
    </div>
  );
}
