import type { Metadata } from "next";
import Link from "next/link";
import { ElementRing } from "@/components/app/element-ring";
import { PageHeader, Section } from "@/components/app/page-header";

export const metadata: Metadata = {
  title: "Kiến thức",
  description: "Giải thích ngắn về Ngũ hành, Can Chi, nạp âm, cung phi, Bát trạch, thần số học và giới hạn của các phương pháp.",
};

const TOC = [
  ["ngu-hanh", "Ngũ hành"],
  ["can-chi", "Can Chi"],
  ["nap-am-cung-phi", "Nạp âm và cung phi"],
  ["bat-trach", "Bát trạch"],
  ["than-so-hoc", "Thần số học"],
  ["tiet-khi", "Tiết khí"],
  ["quan-he-tuoi", "Quan hệ tuổi"],
  ["gioi-han", "Giới hạn"],
] as const;

export default function KienThucPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Kiến thức nền"
        description="Những khái niệm An Mệnh sử dụng, giải thích ngắn gọn để bạn hiểu kết quả đến từ đâu và nên đọc chúng thế nào."
      />
      <nav aria-label="Mục lục" className="flex flex-wrap gap-2">
        {TOC.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="rounded-full border border-border px-3.5 py-1.5 text-sm text-muted-foreground hover:text-foreground">
            {label}
          </a>
        ))}
      </nav>

      <div className="prose-vi leading-relaxed text-foreground/90">
        <Section title="Ngũ hành" id="ngu-hanh">
          <div className="grid gap-6 md:grid-cols-[1fr_14rem] md:items-center">
            <div>
              <p>
                Ngũ hành gồm Kim, Mộc, Thủy, Hỏa, Thổ: năm trạng thái vận động mà triết học phương Đông cổ dùng để mô tả sự thay đổi của vạn
                vật. Quan niệm này đi vào văn hóa Việt qua y học cổ truyền, lịch pháp, kiến trúc và phong tục.
              </p>
              <p>
                Tương sinh là vòng nuôi dưỡng: Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim, Kim sinh Thủy, Thủy sinh Mộc. Tương khắc là vòng
                kiềm chế: Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc. Hai vòng cùng tồn tại để giữ cân bằng;
                “khắc” không đồng nghĩa với xấu.
              </p>
            </div>
            <div className="mx-auto w-full max-w-[13rem]">
              <ElementRing title="Đồ hình ngũ hành: ngũ giác là tương sinh, ngôi sao là tương khắc" />
            </div>
          </div>
        </Section>

        <Section title="Can Chi" id="can-chi">
          <p>
            Thiên Can có 10: Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý. Địa Chi có 12: Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân,
            Dậu, Tuất, Hợi. Ghép lần lượt một Can với một Chi cùng tính âm dương tạo thành vòng 60 tổ hợp, gọi là Lục thập hoa giáp, dùng để
            gọi tên năm, tháng, ngày và giờ.
          </p>
          <p>
            Năm Can Chi bắt đầu từ Tết Nguyên đán (mùng 1 tháng Giêng âm lịch), nên người sinh tháng 1 hoặc đầu tháng 2 dương lịch có thể
            thuộc năm âm lịch trước. Con giáp theo cách gọi Việt Nam có Mèo (Mão) và Trâu (Sửu), khác với Thỏ và Bò ở một số nước.
          </p>
        </Section>

        <Section title="Nạp âm và cung phi" id="nap-am-cung-phi">
          <p>
            <strong className="text-[#f1e3bf]">Nạp âm</strong> gán cho mỗi cặp Can Chi liền nhau một hành kèm hình ảnh, ví dụ Giáp Tý và Ất
            Sửu là Hải Trung Kim (vàng trong biển). 60 hoa giáp chia thành 30 cặp, mỗi hành có 6 cặp. Khi nói “mệnh Kim”, “mệnh Hỏa” theo năm
            sinh, người ta thường dùng nạp âm.
          </p>
          <p>
            <strong className="text-[#f1e3bf]">Cung phi</strong> (còn gọi là mệnh quái) thuộc hệ Bát quái: từ năm sinh âm lịch tính ra một số
            Lạc Thư từ 1 đến 9 rồi quy về một trong tám quẻ Khảm, Khôn, Chấn, Tốn, Càn, Đoài, Cấn, Ly. Cách tính khác nhau cho nam và nữ; số 5
            không có quẻ nên nam quy về Khôn, nữ quy về Cấn.
          </p>
          <p>
            Hai hệ này độc lập: một người có thể mệnh nạp âm Kim nhưng cung phi Khảm thuộc hành Thủy. Nạp âm thường dùng khi nói về tính cách
            và màu sắc; cung phi dùng trong phong thủy Bát trạch.
          </p>
        </Section>

        <Section title="Bát trạch" id="bat-trach">
          <p>
            Bát trạch là một trường phái phong thủy chia người và nhà thành hai nhóm: Đông tứ mệnh (Khảm, Ly, Chấn, Tốn) và Tây tứ mệnh (Càn,
            Khôn, Cấn, Đoài). Với mỗi cung phi, tám hướng được gắn với tám “du niên”: bốn hướng thuận là Sinh Khí, Thiên Y, Diên Niên, Phục Vị
            và bốn hướng kém thuận là Họa Hại, Ngũ Quỷ, Lục Sát, Tuyệt Mệnh.
          </p>
          <p>
            Có nhiều cách áp dụng. Cách phổ biến ở Việt Nam là so hướng mặt nhà với các hướng thuận của gia chủ; một cách khác xét “trạch” của
            ngôi nhà theo hướng tọa (lưng nhà). An Mệnh hiển thị cả hai để bạn tham khảo. Trong không gian sống thực tế, ánh sáng, thông gió và
            sự thuận tiện thường quan trọng hơn bất kỳ quy ước nào.
          </p>
        </Section>

        <Section title="Thần số học" id="than-so-hoc">
          <p>
            Thần số học hiện đại là hệ thống biểu tượng gắn ý nghĩa cho các con số 1 đến 9 và các số đặc biệt 11, 22, 33. Hệ thống này thường
            được gắn tên Pythagoras, nhưng cách tính và diễn giải đang phổ biến chủ yếu hình thành trong thế kỷ 20, và có nhiều biến thể khác
            nhau.
          </p>
          <p>
            An Mệnh chỉ tính số chủ đạo từ ngày sinh theo một quy tắc duy nhất, hiển thị đủ các bước. Xem chi tiết ở trang{" "}
            <Link href="/phuong-phap#than-so-hoc" className="text-primary underline underline-offset-4">
              Phương pháp và nguồn
            </Link>
            .
          </p>
        </Section>

        <Section title="Tiết khí" id="tiet-khi">
          <p>
            Âm lịch Việt Nam thực chất là âm dương lịch: tháng theo Mặt Trăng, còn mùa màng theo 24 tiết khí của Mặt Trời. Mỗi tiết ứng với
            một đoạn 15° trên đường đi biểu kiến của Mặt Trời, bắt đầu từ Xuân phân. Các tiết như Lập xuân, Thanh minh, Hạ chí, Đông chí
            gắn với nông lịch và phong tục, ví dụ tục tảo mộ vào tiết Thanh minh.
          </p>
          <p>
            Tiết khí cũng quyết định tháng nhuận: trong năm âm lịch có 13 tháng, tháng đầu tiên không chứa trung khí (các tiết ở mốc 0°, 30°, 60°…) là tháng nhuận.
          </p>
        </Section>

        <Section title="Quan hệ tuổi" id="quan-he-tuoi">
          <p>
            Khi “xem tuổi”, người ta thường xét quan hệ giữa hai Địa Chi của năm sinh. Tam hợp là ba chi cách đều nhau trên vòng 12 (ví dụ
            Thân, Tý, Thìn); lục hợp là sáu cặp chi kết đôi (Tý – Sửu, Dần – Hợi…); lục xung là hai chi đối nhau (Tý – Ngọ); lục hại là sáu cặp
            được xem là dễ hiểu lầm (Tý – Mùi…). Ngoài ra còn xét Thiên Can hợp (Giáp – Kỷ, Ất – Canh…) và sinh khắc giữa hai hành nạp âm.
          </p>
          <p>
            Đây là cách luận của mệnh lý cổ, mỗi trường phái nhấn mạnh khác nhau. An Mệnh chỉ liệt kê quan hệ, không cộng điểm và không kết
            luận hai người hợp hay không.
          </p>
        </Section>

        <Section title="Giới hạn của các phương pháp" id="gioi-han">
          <ul className="list-disc space-y-2 pl-5 marker:text-primary">
            <li>Đây là các quan niệm văn hóa và hệ thống biểu tượng, không phải kết luận khoa học. Chúng không dự đoán được tương lai.</li>
            <li>
              Các trường phái khác nhau có thể cho kết quả khác nhau, ví dụ dùng Lập Xuân thay vì Tết để chuyển năm, hoặc rút gọn ngày sinh
              theo cách khác trong thần số học.
            </li>
            <li>Không nên dùng kết quả để quyết định về sức khỏe, tài chính, hôn nhân hay đánh giá người khác.</li>
            <li>
              Tra cứu theo năm sinh rất khác với lá số tử vi đầy đủ (cần giờ sinh và thuật toán an sao). An Mệnh chưa lập lá số tử vi.
            </li>
          </ul>
        </Section>
      </div>
    </div>
  );
}
