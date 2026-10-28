import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-5xl px-4 pb-28 pt-12 md:pb-10">
      <div className="hairline mb-6" />
      <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>Nội dung mang tính tham khảo văn hóa và giải trí.</p>
        <nav aria-label="Liên kết cuối trang" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link className="hover:text-foreground" href="/kien-thuc">Kiến thức</Link>
          <Link className="hover:text-foreground" href="/phuong-phap">Phương pháp và nguồn</Link>
          <Link className="hover:text-foreground" href="/ho-so">Dữ liệu của bạn</Link>
        </nav>
      </div>
    </footer>
  );
}
