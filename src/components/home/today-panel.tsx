"use client";

import { useSyncExternalStore } from "react";
import { canChiOfDay, canChiOfLunarMonth, canChiOfLunarYear, zodiacOf } from "@/lib/core/canchi";
import { type CalendarDate, formatVietnameseDate, todayInVietnam, weekdayVi } from "@/lib/core/date";
import { lunarMonthName, solarToLunar } from "@/lib/core/lunar";

// Ngày hiện tại chỉ đọc trên trình duyệt; cập nhật mỗi phút để qua nửa đêm vẫn đúng.
let cached: { key: string; value: CalendarDate } | null = null;
function getToday(): CalendarDate {
  const t = todayInVietnam();
  const key = `${t.year}-${t.month}-${t.day}`;
  if (!cached || cached.key !== key) cached = { key, value: t };
  return cached.value;
}
function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 60_000);
  return () => window.clearInterval(id);
}

export function TodayPanel() {
  const today = useSyncExternalStore<CalendarDate | null>(subscribe, getToday, () => null);

  if (!today) {
    return (
      <div className="rounded-2xl border border-border bg-[#15213acc] p-5" aria-busy="true">
        <div className="h-5 w-40 animate-pulse rounded bg-[#24355a]" />
        <div className="mt-3 h-8 w-64 animate-pulse rounded bg-[#1f2e4d]" />
        <span className="sr-only">Đang tải ngày hôm nay</span>
      </div>
    );
  }

  const lunar = solarToLunar(today);
  const year = canChiOfLunarYear(lunar.year);
  const month = lunar.isLeapMonth ? null : canChiOfLunarMonth(lunar.year, lunar.month);
  const day = canChiOfDay(today);

  return (
    <section aria-labelledby="hom-nay" className="rounded-2xl border border-border bg-[#15213acc] p-5 md:p-6">
      <h2 id="hom-nay" className="text-sm text-muted-foreground">
        Hôm nay, theo giờ Việt Nam
      </h2>
      <div className="mt-3 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">Dương lịch</p>
          <p className="font-display text-3xl font-semibold text-[#f3e6c4]">{formatVietnameseDate(today)}</p>
          <p className="text-sm text-foreground/80">{weekdayVi(today)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Âm lịch</p>
          <p className="font-display text-3xl font-semibold text-[#f3e6c4]">
            Ngày {lunar.day} {lunarMonthName(lunar.month, lunar.isLeapMonth)}
          </p>
          <p className="text-sm text-foreground/80">
            Năm {year.name} (năm con {zodiacOf(year.branchIndex).toLowerCase()})
          </p>
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 border-t border-[#2a395680] pt-4 text-sm">
        <dt className="text-muted-foreground">Ngày</dt>
        <dd>{day.name}</dd>
        <dt className="text-muted-foreground">Tháng</dt>
        <dd>{month ? month.name : "Tháng nhuận (không tính Can Chi riêng)"}</dd>
      </dl>
    </section>
  );
}
