import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/app/page-header";
import { RutTheClient } from "@/components/rut-the/rut-the-client";

export const metadata: Metadata = {
  title: "Rút thẻ chiêm nghiệm",
  description: "Rút ngẫu nhiên một trong 24 thẻ chiêm nghiệm: một thông điệp, một câu hỏi và một việc nhỏ cho hôm nay.",
};

export default function RutThePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Rút thẻ chiêm nghiệm"
        description="Dừng lại một chút, nghĩ về điều đang bận tâm, rồi rút một thẻ. Mỗi thẻ có một thông điệp, một câu hỏi và một việc nhỏ có thể làm ngay."
      />
      <Suspense fallback={<div className="mx-auto aspect-[3/4.4] max-w-sm animate-pulse rounded-3xl bg-[#15213a99]" />}>
        <RutTheClient />
      </Suspense>
    </div>
  );
}
