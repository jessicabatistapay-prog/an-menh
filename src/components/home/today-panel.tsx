"use client";

import { useSyncExternalStore } from "react";
import { canChiOfDay, canChiOfLunarMonth, canChiOfLunarYear, zodiacOf } from "@/lib/core/canchi";
import { type CalendarDate, formatVietnameseDate, todayInVietnam, weekdayVi } from "@/lib/core/date";
import Link from "next/link";
import { fromJulianDayNumber, julianDayNumber, isWithinSupportedRange } from "@/lib/core/date";
import { holidaysOf } from "@/lib/core/holidays";
import { lunarMonthName, solarToLunar } from "@/lib/core/lunar";
import { solarTermOf } from "@/lib/core/solarterms";

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
  const term = solarTermOf(today);
  const upcoming = upcomingEvents(today, 3);

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
        <dt className="text-muted-foreground">Tiết khí</dt>
        <dd>
          {term.name}
          {term.startsToday ? " (bắt đầu hôm nay)" : ""}
        </dd>
      </dl>
      {upcoming.length > 0 && (
        <div className="mt-4 border-t border-[#2a395680] pt-4">
          <p className="text-sm text-muted-foreground">Sắp tới</p>
          <ul className="mt-1.5 grid gap-1 text-sm">
            {upcoming.map((u) => (
              <li key={u.key} className="flex justify-between gap-4">
                <span>{u.name}</span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {formatVietnameseDate(u.date).slice(0, 5)}, {u.days === 1 ? "ngày mai" : `còn ${u.days} ngày`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Link href="/lich" className="mt-4 inline-block text-sm text-primary underline-offset-4 hover:underline">
        Mở lịch âm dương
      </Link>
    </section>
  );
}

function upcomingEvents(today: CalendarDate, limit: number) {
  const start = julianDayNumber(today);
  const out: { key: string; name: string; date: CalendarDate; days: number }[] = [];
  for (let i = 1; i <= 60 && out.length < limit; i++) {
    const d = fromJulianDayNumber(start + i);
    if (!isWithinSupportedRange(d)) break;
    const l = solarToLunar(d);
    const names = holidaysOf(d, l).map((h) => h.name);
    const t = solarTermOf(d);
    if (t.startsToday) names.push(`Tiết ${t.name}`);
    for (const name of names) if (out.length < limit) out.push({ key: `${i}-${name}`, name, date: d, days: i });
  }
  return out;
}
