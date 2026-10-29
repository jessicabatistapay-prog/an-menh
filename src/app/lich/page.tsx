import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { LichClient } from "@/components/lich/lich-client";

export const metadata: Metadata = {
  title: "Lịch âm dương",
  description: "Lịch tháng có ngày âm lịch, Can Chi, tiết khí, ngày lễ, ngày và giờ hoàng đạo; đổi ngày qua lại giữa dương lịch và âm lịch Việt Nam.",
};

export default function LichPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Lịch âm dương"
        description="Xem ngày âm lịch, Can Chi, tiết khí, ngày lễ truyền thống, ngày và giờ hoàng đạo theo giờ Việt Nam."
      />
      <LichClient />
    </div>
  );
}
