import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-20 text-center">
      <p className="font-display text-7xl font-semibold text-[#e7d3a2]">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-[#f3e6c4]">Không tìm thấy trang này</h1>
      <p className="mt-3 text-muted-foreground">Đường dẫn có thể đã thay đổi hoặc bị nhập sai.</p>
      <Link href="/" className={buttonVariants({ className: "mt-6" })}>
        Về trang chủ
      </Link>
    </div>
  );
}
