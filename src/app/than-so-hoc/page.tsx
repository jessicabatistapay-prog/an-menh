import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/app/page-header";
import { ThanSoClient } from "@/components/than-so/than-so-client";

export const metadata: Metadata = {
  title: "Thần số học",
  description: "Tính số chủ đạo từ ngày sinh dương lịch với các bước cộng minh bạch và quy tắc xử lý số 11, 22, 33.",
};

export default function ThanSoPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Thần số học"
        description="Số chủ đạo được tính từ ngày sinh dương lịch. Mọi bước cộng đều được hiển thị để bạn tự kiểm tra lại."
      />
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-[#15213a99]" />}>
        <ThanSoClient />
      </Suspense>
    </div>
  );
}
