import Link from "next/link";
import { BookOpen, CalendarDays, Compass, Dices, Grid3x3, Hash, HeartHandshake, Layers, Sparkles, Sun, SwatchBook, Waves } from "lucide-react";
import { ElementRing } from "@/components/app/element-ring";
import { Section } from "@/components/app/page-header";
import { RecentActivity } from "@/components/home/recent-activity";
import { TodayPanel } from "@/components/home/today-panel";
import { buttonVariants } from "@/components/ui/button";

const FEATURE_GROUPS = [
  {
    title: "Bói toán",
    items: [
      { href: "/gieo-que", icon: Waves, title: "Gieo quẻ Kinh Dịch", text: "Gieo ba đồng xu sáu lần, xem quẻ chủ, hào động và quẻ biến." },
      { href: "/xin-xam", icon: Dices, title: "Xin xăm", text: "Lắc ống xăm, nhận một câu thơ lục bát và lời bàn." },
      { href: "/tarot", icon: SwatchBook, title: "Bói bài Tarot", text: "Rút một hoặc ba lá từ bộ 78 lá vẽ riêng cho An Mệnh." },
      { href: "/rut-the", icon: Layers, title: "Rút thẻ chiêm nghiệm", text: "Một thông điệp, một câu hỏi và một việc nhỏ cho hôm nay." },
      { href: "/tu-vi-hang-ngay", icon: Sun, title: "Tử vi hằng ngày", text: "Nhịp ngày của 12 con giáp theo Can Chi, kèm giờ hoàng đạo." },
      { href: "/la-so", icon: Grid3x3, title: "Lá số tử vi", text: "12 cung, 14 chính tinh, Tứ Hóa, Tuần, Triệt và đại hạn từ giờ sinh." },
    ],
  },
  {
    title: "Tra cứu và phong thủy",
    items: [
      { href: "/ban-menh", icon: Sparkles, title: "Bản mệnh và ngũ hành", text: "Năm âm lịch, Can Chi, con giáp, mệnh nạp âm và cung phi." },
      { href: "/phong-thuy", icon: Compass, title: "Phong thủy nhà ở", text: "Hướng nhà theo Bát trạch, kèm gợi ý ánh sáng và bố trí." },
      { href: "/lich", icon: CalendarDays, title: "Lịch âm dương", text: "Ngày âm, tiết khí, ngày lễ, ngày và giờ hoàng đạo; đổi ngày hai chiều." },
      { href: "/hop-tuoi", icon: HeartHandshake, title: "Xem tuổi hai người", text: "Tam hợp, lục hợp, xung, hại và sinh khắc nạp âm, không chấm điểm." },
      { href: "/than-so-hoc", icon: Hash, title: "Thần số học", text: "Số chủ đạo và năm cá nhân, hiển thị từng bước cộng." },
      { href: "/kien-thuc", icon: BookOpen, title: "Kiến thức nền", text: "Các khái niệm, cách tính và giới hạn của từng phương pháp." },
    ],
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="grid items-center gap-6 pb-4 pt-8 md:grid-cols-[1.1fr_0.9fr] md:gap-10 md:pt-14">
        <div className="order-2 md:order-1">
          <h1 className="font-display text-[3.75rem] font-semibold leading-[0.95] text-[#f3e6c4] md:text-[5.5rem]">
            An Mệnh
          </h1>
          <p className="mt-3 font-display text-2xl italic text-[#d9c38f] md:text-[1.75rem]">Hiểu mình hơn, sống hài hòa hơn</p>
          <p className="mt-5 max-w-[34rem] leading-relaxed text-muted-foreground">
            Tra cứu những quan niệm truyền thống về ngày sinh và nơi ở, với cách tính được giải thích rõ ràng. Dùng như một
            điểm tựa để suy ngẫm, không phải lời phán định.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/ban-menh" className={buttonVariants({ size: "lg" })}>
              Khám phá bản mệnh
            </Link>
            <Link href="/gieo-que" className={buttonVariants({ size: "lg", variant: "outline" })}>
              Gieo một quẻ
            </Link>
          </div>
        </div>
        <div className="order-1 mx-auto w-full max-w-[15rem] md:order-2 md:max-w-[22rem]">
          <ElementRing animate title="Đồ hình ngũ hành: vòng ngoài là tương sinh, ngôi sao bên trong là tương khắc" />
          <p className="mt-1 text-center text-xs text-muted-foreground">Vòng ngoài: tương sinh. Nét đứt: tương khắc.</p>
        </div>
      </section>

      <div className="mt-8">
        <TodayPanel />
      </div>

      {FEATURE_GROUPS.map((g, gi) => (
        <Section key={g.title} title={g.title} id={gi === 0 ? "boi-toan" : "tra-cuu"}>
          <ul className="grid border-t border-[#2a395680] md:grid-cols-2 md:gap-x-8">
            {g.items.map((f) => (
              <li key={f.href} className="border-b border-[#2a395680]">
                <Link href={f.href} className="group flex items-start gap-4 py-4 transition-colors hover:bg-[#15213a80] md:px-2">
                  <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full border border-[#d9c38f4d] text-primary group-hover:border-primary">
                    <f.icon className="size-[1.1rem]" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-display text-[1.4rem] font-semibold leading-tight text-[#f1e3bf]">{f.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{f.text}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ))}

      <Section title="Đã lưu gần đây" id="gan-day">
        <RecentActivity />
      </Section>

      <Section title="An Mệnh giúp được gì" id="gioi-thieu">
        <div className="grid gap-6 text-[0.95rem] leading-relaxed md:grid-cols-3">
          <div>
            <h3 className="font-display text-xl font-semibold text-[#f1e3bf]">Tra cứu có căn cứ</h3>
            <p className="mt-1 text-muted-foreground">
              Âm lịch được tính theo múi giờ Việt Nam bằng thuật toán thiên văn, bảng nạp âm và Bát trạch được ghi nguồn và
              kiểm thử.
            </p>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-[#f1e3bf]">Gợi ý để suy ngẫm</h3>
            <p className="mt-1 text-muted-foreground">
              Diễn giải tập trung vào điểm mạnh và điều có thể cân bằng, không gán nhãn tốt xấu cho con người.
            </p>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-[#f1e3bf]">Những gì không làm</h3>
            <p className="mt-1 text-muted-foreground">
              Không phán bệnh tật, tuổi thọ hay tai họa, không bán vật phẩm giải hạn và không thay cho tư vấn chuyên môn. Các phần bói
              toán là gợi ý để suy ngẫm.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
