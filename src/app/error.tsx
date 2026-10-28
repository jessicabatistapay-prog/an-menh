"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl py-20 text-center">
      <h1 className="font-display text-3xl font-semibold text-[#f3e6c4]">Đã có lỗi khi hiển thị trang</h1>
      <p className="mt-3 text-muted-foreground">
        Dữ liệu của bạn trên trình duyệt không bị ảnh hưởng. Hãy thử tải lại phần này; nếu lỗi lặp lại, hãy tải lại toàn bộ trang.
      </p>
      <Button className="mt-6" onClick={reset}>
        Thử lại
      </Button>
    </div>
  );
}
