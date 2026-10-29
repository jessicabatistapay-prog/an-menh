import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlock, PageHeader } from "@/components/app/page-header";
import { GieoQueClient } from "@/components/boi/gieo-que-client";

export const metadata: Metadata = {
  title: "Gieo quẻ Kinh Dịch",
  description: "Gieo ba đồng xu sáu lần để lập quẻ Kinh Dịch, xem quẻ chủ, hào động và quẻ biến kèm lời giải gợi mở.",
};

export default function GieoQuePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Gieo quẻ Kinh Dịch"
        description="Gieo ba đồng xu sáu lần để lập một trong 64 quẻ. Mỗi quẻ là một hình ảnh để nhìn lại tình thế của mình, không phải lời phán định."
      />
      <Suspense fallback={<LoadingBlock />}>
        <GieoQueClient />
      </Suspense>
    </div>
  );
}
