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
        description="Mọi kết quả trong An Mệnh được tính bằng mã nguồn xác định chạy ngay trên thiết bị của bạn: cùng đầu vào luôn cho cùng kết quả. Không có phần nào dùng trí tuệ nhân tạo hay số ngẫu nhiên, trừ việc rút thẻ chiêm nghiệm."
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
          <li>Vạn Dân Anh, Tam Mệnh Thông Hội (三命通會), đời Minh – bảng nạp âm.</li>
          <li>Bát trạch minh kính (八宅明鏡) – bảng du niên Bát trạch.</li>
        </ul>
      </Section>
    </div>
  );
}
