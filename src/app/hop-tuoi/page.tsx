import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/app/page-header";
import { HopTuoiClient } from "@/components/hop-tuoi/hop-tuoi-client";

export const metadata: Metadata = {
  title: "Xem tuổi hai người",
  description: "Tra quan hệ Địa Chi, Thiên Can, ngũ hành nạp âm và nhóm Bát trạch giữa hai người theo quan niệm truyền thống, không chấm điểm.",
};

export default function HopTuoiPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Xem tuổi hai người"
        description="Tra các quan hệ truyền thống giữa tuổi của hai người: tam hợp, lục hợp, lục xung, lục hại, can hợp, sinh khắc nạp âm và nhóm Bát trạch. Không có điểm số hay kết luận hợp, không hợp."
      />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-[#15213a99]" />}>
        <HopTuoiClient />
      </Suspense>
    </div>
  );
}
