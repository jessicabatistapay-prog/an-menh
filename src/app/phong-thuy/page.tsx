import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/app/page-header";
import { PhongThuyClient } from "@/components/phong-thuy/phong-thuy-client";

export const metadata: Metadata = {
  title: "Phong thủy nhà ở",
  description: "Đối chiếu hướng nhà với cung phi theo hệ Bát trạch, kèm gợi ý ánh sáng, thông gió và bố trí thực tế.",
};

export default function PhongThuyPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Phong thủy nhà ở"
        description="Đối chiếu hướng nhà với cung phi theo hệ Bát trạch, rồi xem gợi ý bố trí cho phòng khách, phòng ngủ hoặc góc làm việc. Phần quan niệm truyền thống và phần lời khuyên thực tế được tách riêng."
      />
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-[#15213a99]" />}>
        <PhongThuyClient />
      </Suspense>
    </div>
  );
}
