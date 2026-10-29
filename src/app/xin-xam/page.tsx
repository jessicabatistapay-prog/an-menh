import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlock, PageHeader } from "@/components/app/page-header";
import { XinXamClient } from "@/components/boi/xin-xam-client";

export const metadata: Metadata = {
  title: "Xin xăm",
  description: "Lắc ống xăm để rút một trong 36 quẻ xăm thơ lục bát do An Mệnh tự soạn, kèm lời bàn về công việc, gia đạo, tình duyên.",
};

export default function XinXamPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Xin xăm"
        description="Lắc ống xăm và rút một quẻ: mỗi quẻ là một câu thơ lục bát cùng lời bàn ngắn về công việc, gia đạo và tình duyên."
      />
      <Suspense fallback={<LoadingBlock />}>
        <XinXamClient />
      </Suspense>
    </div>
  );
}
