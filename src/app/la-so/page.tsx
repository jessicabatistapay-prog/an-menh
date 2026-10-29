import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlock, PageHeader } from "@/components/app/page-header";
import { LaSoClient } from "@/components/boi/la-so-client";

export const metadata: Metadata = {
  title: "Lá số tử vi",
  description: "Lập lá số Tử Vi Đẩu Số từ ngày, giờ sinh: 12 cung, 14 chính tinh, phụ tinh, Tứ Hóa, Tuần, Triệt, vòng Trường Sinh và đại hạn.",
};

export default function LaSoPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Lá số tử vi"
        description="Lập lá số Tử Vi Đẩu Số từ ngày và giờ sinh: 12 cung, 14 chính tinh, các phụ tinh chính, Tứ Hóa, Tuần, Triệt, vòng Trường Sinh và đại hạn. Đây là phần lá số cơ bản; các vòng sao phụ khác chưa được an."
      />
      <Suspense fallback={<LoadingBlock />}>
        <LaSoClient />
      </Suspense>
    </div>
  );
}
