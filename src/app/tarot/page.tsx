import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlock, PageHeader } from "@/components/app/page-header";
import { TarotClient } from "@/components/boi/tarot-client";

export const metadata: Metadata = {
  title: "Bói bài Tarot",
  description: "Xào và rút một hoặc ba lá từ bộ 78 lá Tarot do An Mệnh tự thiết kế, kèm ý nghĩa xuôi và ngược.",
};

export default function TarotPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Bói bài Tarot"
        description="Rút một lá để nhận thông điệp, hoặc ba lá cho quá khứ, hiện tại và hướng đi. Bộ 78 lá được vẽ riêng cho An Mệnh."
      />
      <Suspense fallback={<LoadingBlock />}>
        <TarotClient />
      </Suspense>
    </div>
  );
}
