"use client";

import { useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingBlock, Note } from "@/components/app/page-header";
import { useAppData } from "@/hooks/use-app-data";
import { canChiOfDay, canChiOfLunarYear, ZODIAC_ANIMALS } from "@/lib/core/canchi";
import { TONE_LABELS, type DayTone, dailyForecast } from "@/lib/core/daily";
import {
  type CalendarDate,
  SUPPORTED_MAX,
  SUPPORTED_MIN,
  compareDates,
  formatVietnameseDate,
  fromJulianDayNumber,
  julianDayNumber,
  parseISODate,
  todayInVietnam,
  toISODate,
  weekdayVi,
} from "@/lib/core/date";
import { dayAuspice } from "@/lib/core/hoangdao";
import { lunarMonthName, solarToLunar } from "@/lib/core/lunar";
import { cn } from "@/lib/utils";

let cache: { key: string; value: CalendarDate } | null = null;
const getToday = () => {
  const t = todayInVietnam();
  const key = toISODate(t);
  if (!cache || cache.key !== key) cache = { key, value: t };
  return cache.value;
};
const subscribe = (cb: () => void) => {
  const id = window.setInterval(cb, 60_000);
  return () => window.clearInterval(id);
};

const TONE_STYLE: Record<DayTone, string> = {
  "ban-menh": "border-[#d9c38f80] text-[#f3e4bd]",
  thuan: "border-[#9cc7a480] text-[#bfe0c4]",
  binh: "border-[#2a3956] text-muted-foreground",
  cham: "border-[#7fa8d680] text-[#bcd3ee]",
  "giu-loi": "border-[#e3957c66] text-[#f0c2b3]",
};

export function TuViNgayClient() {
  const today = useSyncExternalStore<CalendarDate | null>(subscribe, getToday, () => null);
  if (!today) return <LoadingBlock />;
  return <TuViNgayView today={today} />;
}

function TuViNgayView({ today }: { today: CalendarDate }) {
  const { data } = useAppData();
  const [date, setDate] = useState<CalendarDate>(today);
  const [mine, setMine] = useState<number | null>(null);

  const profileZodiacs = data.profiles.flatMap((p) => {
    const r = parseISODate(p.birthDate);
    if (!r.ok) return [];
    try {
      return [{ id: p.id, name: p.name, branch: canChiOfLunarYear(solarToLunar(r.date).year).branchIndex }];
    } catch {
      return [];
    }
  });

  const shift = (n: number) => {
    const next = fromJulianDayNumber(julianDayNumber(date) + n);
    if (compareDates(next, SUPPORTED_MIN) >= 0 && compareDates(next, SUPPORTED_MAX) <= 0) setDate(next);
  };

  const lunar = solarToLunar(date);
  const day = canChiOfDay(date);
  const auspice = dayAuspice(date);
  const order = Array.from({ length: 12 }, (_, i) => i);
  if (mine !== null) order.sort((a, b) => (a === mine ? -1 : b === mine ? 1 : 0));
  const diff = julianDayNumber(date) - julianDayNumber(today);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-[#15213acc] p-4 md:p-5">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => shift(-1)} aria-label="Ngày trước">
            <ChevronLeft aria-hidden />
          </Button>
          <div aria-live="polite">
            <p className="font-display text-2xl font-semibold text-[#f3e6c4]">
              {weekdayVi(date)}, {formatVietnameseDate(date)}
            </p>
            <p className="text-sm text-muted-foreground">
              Ngày {day.name}, {lunar.day} {lunarMonthName(lunar.month, lunar.isLeapMonth)} âm lịch.{" "}
              {auspice.dayGod.hoangDao ? "Hoàng đạo" : "Hắc đạo"} ({auspice.dayGod.name}).
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => shift(1)} aria-label="Ngày sau">
            <ChevronRight aria-hidden />
          </Button>
        </div>
        {diff !== 0 && (
          <Button variant="outline" size="sm" onClick={() => setDate(today)}>
            Về hôm nay
          </Button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label htmlFor="tuoi-cua-ban" className="text-sm font-medium">
          Tuổi của bạn
        </label>
        <select
          id="tuoi-cua-ban"
          value={mine ?? ""}
          onChange={(e) => setMine(e.target.value === "" ? null : Number(e.target.value))}
          className="h-10 rounded-lg border border-input bg-[#101a2e] px-3 text-sm [color-scheme:dark]"
        >
          <option value="">Xem tất cả 12 con giáp</option>
          {profileZodiacs.length > 0 && (
            <optgroup label="Hồ sơ đã lưu">
              {profileZodiacs.map((p) => (
                <option key={p.id} value={p.branch}>
                  {p.name} (tuổi {ZODIAC_ANIMALS[p.branch]!.toLowerCase()})
                </option>
              ))}
            </optgroup>
          )}
          <optgroup label="Con giáp">
            {ZODIAC_ANIMALS.map((z, i) => (
              <option key={z} value={i}>
                {z}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <ul className="mt-5 grid gap-3 md:grid-cols-2">
        {order.map((b) => {
          const f = dailyForecast(date, b);
          return (
            <li
              key={b}
              className={cn(
                "rounded-2xl border bg-[#15213acc] p-5",
                mine === b ? "border-[#d9c38f80] md:col-span-2" : "border-border",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#f3e6c4]">
                    Tuổi {f.zodiac} <span className="font-sans text-sm font-normal text-muted-foreground">({f.branch})</span>
                  </h2>
                  <p className="text-sm text-muted-foreground">{f.reason}</p>
                </div>
                <span className={cn("shrink-0 rounded-full border px-3 py-1 text-xs", TONE_STYLE[f.tone])}>{TONE_LABELS[f.tone]}</span>
              </div>
              <dl className="mt-3 grid gap-2 text-sm">
                <div>
                  <dt className="inline text-muted-foreground">Công việc: </dt>
                  <dd className="inline">{f.work}</dd>
                </div>
                <div>
                  <dt className="inline text-muted-foreground">Quan hệ: </dt>
                  <dd className="inline">{f.people}</dd>
                </div>
                <div>
                  <dt className="inline text-muted-foreground">Chăm sóc bản thân: </dt>
                  <dd className="inline">{f.self}</dd>
                </div>
                <div className="flex flex-wrap gap-x-5 border-t border-[#2a395680] pt-2 text-muted-foreground">
                  <span>
                    Giờ gợi ý: <span className="text-foreground">{f.goodHour.name} ({f.goodHour.range})</span>
                  </span>
                  <span>
                    Màu hợp: <span className="text-foreground">{f.color}</span>
                  </span>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
      <Note className="mt-6">
        Cách tính: so Địa Chi của ngày với Địa Chi của tuổi (tam hợp, lục hợp, lục xung, lục hại), rồi so ngũ hành của Thiên Can ngày với
        ngũ hành của tuổi. Lời gợi ý do An Mệnh tự soạn theo từng nhịp ngày, mang tính tham khảo cho vui, không dự đoán điều gì sẽ xảy ra.
        Tuổi tính theo năm âm lịch.
      </Note>
    </div>
  );
}
