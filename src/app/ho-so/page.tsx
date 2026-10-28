import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { HoSoClient } from "@/components/ho-so/ho-so-client";

export const metadata: Metadata = {
  title: "Hồ sơ và lịch sử",
  description: "Quản lý hồ sơ ngày sinh và các kết quả đã lưu trên trình duyệt này.",
};

export default function HoSoPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Hồ sơ và lịch sử" description="Quản lý những gì bạn đã chọn lưu: hồ sơ ngày sinh và các kết quả đã xem." />
      <HoSoClient />
    </div>
  );
}
