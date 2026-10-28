"use client";

import Link from "next/link";
import { History, UserRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useAppData } from "@/hooks/use-app-data";
import { formatVietnameseDate, parseISODate } from "@/lib/core/date";
import { HISTORY_KIND_LABELS, describeHistory, historyHref } from "@/lib/history";

export function RecentActivity() {
  const { data, status } = useAppData();

  if (status === "loading") {
    return <div className="h-24 animate-pulse rounded-2xl bg-[#15213a99]" aria-busy="true" aria-label="Đang tải dữ liệu đã lưu" />;
  }

  const profiles = [...data.profiles].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3);
  const history = data.history.slice(0, 4);

  if (profiles.length === 0 && history.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#d9c38f40] p-6">
        <p className="font-display text-2xl text-[#f1e3bf]">Chưa có gì được lưu</p>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
          Khi xem bản mệnh hay rút thẻ, bạn có thể chọn lưu kết quả hoặc lưu thông tin thành hồ sơ để lần sau không phải nhập
          lại. Mọi thứ chỉ nằm trên trình duyệt này.
        </p>
        <Link href="/ban-menh" className={buttonVariants({ variant: "outline", className: "mt-4" })}>
          Xem bản mệnh đầu tiên
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {profiles.length > 0 && (
        <div>
          <h3 className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <UserRound className="size-4" aria-hidden /> Hồ sơ
          </h3>
          <ul className="divide-y divide-[#2a395680] rounded-2xl border border-border bg-[#15213acc]">
            {profiles.map((p) => {
              const d = parseISODate(p.birthDate);
              return (
                <li key={p.id}>
                  <Link href={`/ban-menh?ho-so=${encodeURIComponent(p.id)}`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#1b2945]">
                    <span className="truncate font-medium">{p.name}</span>
                    <span className="shrink-0 text-sm text-muted-foreground">{d.ok ? formatVietnameseDate(d.date) : ""}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {history.length > 0 && (
        <div>
          <h3 className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <History className="size-4" aria-hidden /> Kết quả đã lưu
          </h3>
          <ul className="divide-y divide-[#2a395680] rounded-2xl border border-border bg-[#15213acc]">
            {history.map((h) => (
              <li key={h.id}>
                <Link href={historyHref(h)} className="flex flex-col px-4 py-3 hover:bg-[#1b2945]">
                  <span className="font-medium">{h.label || HISTORY_KIND_LABELS[h.kind]}</span>
                  <span className="text-sm text-muted-foreground">
                    {HISTORY_KIND_LABELS[h.kind]}: {describeHistory(h)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Link href="/ho-so" className="text-sm text-primary underline-offset-4 hover:underline md:col-span-2">
        Quản lý hồ sơ và lịch sử
      </Link>
    </div>
  );
}
