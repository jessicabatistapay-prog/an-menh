import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/app/page-header";
import { BanMenhClient } from "@/components/ban-menh/ban-menh-client";

export const metadata: Metadata = {
  title: "Bản mệnh và ngũ hành",
  description: "Tính năm âm lịch, Can Chi, con giáp, ngũ hành nạp âm và cung phi từ ngày sinh dương lịch.",
};

export default function BanMenhPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Bản mệnh và ngũ hành"
        description="Từ ngày sinh dương lịch, An Mệnh tính năm âm lịch, Can Chi, con giáp, mệnh nạp âm và, nếu bạn muốn, cung phi. Đây là phần tra cứu theo năm sinh, không phải lá số tử vi đầy đủ."
      />
      <Suspense fallback={<div className="h-80 animate-pulse rounded-2xl bg-[#15213a99]" />}>
        <BanMenhClient />
      </Suspense>
    </div>
  );
}
