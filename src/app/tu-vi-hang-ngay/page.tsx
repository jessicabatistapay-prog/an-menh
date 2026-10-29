import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { TuViNgayClient } from "@/components/boi/tu-vi-ngay-client";

export const metadata: Metadata = {
  title: "Tử vi hằng ngày",
  description: "Gợi ý hằng ngày cho 12 con giáp dựa trên quan hệ giữa Can Chi của ngày và tuổi, kèm giờ hoàng đạo.",
};

export default function TuViNgayPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Tử vi hằng ngày"
        description="Nhịp ngày cho 12 con giáp, tính từ quan hệ giữa Can Chi của ngày và tuổi. Chọn tuổi của bạn để xem trước."
      />
      <TuViNgayClient />
    </div>
  );
}
