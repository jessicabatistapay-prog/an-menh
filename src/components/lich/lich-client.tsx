"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateField } from "@/components/app/form-fields";
import { LoadingBlock, Panel, Section } from "@/components/app/page-header";
import { canChiOfDay, canChiOfLunarMonth, canChiOfLunarYear, zodiacOf } from "@/lib/core/canchi";
import {
  type CalendarDate,
  SUPPORTED_MAX,
  SUPPORTED_MIN,
  compareDates,
  daysInMonth,
  formatVietnameseDate,
  fromJulianDayNumber,
  isWithinSupportedRange,
  julianDayNumber,
  parseISODate,
  todayInVietnam,
  toISODate,
  weekdayVi,
} from "@/lib/core/date";
import { holidaysOf } from "@/lib/core/holidays";
import { type LunarDate, leapMonthOfYear, lunarMonthName, lunarToSolar, solarToLunar } from "@/lib/core/lunar";
import { solarTermOf } from "@/lib/core/solarterms";
import { MESSAGES } from "@/lib/forms";
import { cn } from "@/lib/utils";

const WEEK_HEADERS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

let todayCache: { key: string; value: CalendarDate } | null = null;
function getToday() {
  const t = todayInVietnam();
  const key = toISODate(t);
  if (!todayCache || todayCache.key !== key) todayCache = { key, value: t };
  return todayCache.value;
}
const subscribe = (cb: () => void) => {
  const id = window.setInterval(cb, 60_000);
  return () => window.clearInterval(id);
};

interface DayInfo {
  solar: CalendarDate;
  lunar: LunarDate | null;
  holidays: string[];
  term: string | null;
}

function dayInfo(solar: CalendarDate): DayInfo {
  if (!isWithinSupportedRange(solar)) return { solar, lunar: null, holidays: [], term: null };
  const lunar = solarToLunar(solar);
  const t = solarTermOf(solar);
  return { solar, lunar, holidays: holidaysOf(solar, lunar).map((h) => h.name), term: t.startsToday ? t.name : null };
}

export function LichClient() {
  const today = useSyncExternalStore<CalendarDate | null>(subscribe, getToday, () => null);
  if (!today) return <LoadingBlock className="h-[28rem]" />;
  return <LichView today={today} />;
}

function LichView({ today }: { today: CalendarDate }) {
  const [view, setView] = useState({ year: today.year, month: today.month });
  const [selected, setSelected] = useState<CalendarDate>(today);

  const jump = (d: CalendarDate) => {
    setView({ year: d.year, month: d.month });
    setSelected(d);
    requestAnimationFrame(() => document.getElementById("chi-tiet-ngay")?.scrollIntoView({ block: "nearest" }));
  };

  const shiftMonth = (delta: number) => {
    let m = view.month + delta;
    let y = view.year;
    if (m < 1) {
      m = 12;
      y--;
    } else if (m > 12) {
      m = 1;
      y++;
    }
    if (y < SUPPORTED_MIN.year || y > SUPPORTED_MAX.year) return;
    setView({ year: y, month: m });
  };

  const cells = useMemo(() => {
    const first = julianDayNumber({ year: view.year, month: view.month, day: 1 });
    const lead = first % 7; // JDN mod 7: 0 = Thứ Hai
    const count = daysInMonth(view.year, view.month);
    const out: (DayInfo | null)[] = Array.from({ length: lead }, () => null);
    for (let i = 0; i < count; i++) out.push(dayInfo(fromJulianDayNumber(first + i)));
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [view]);

  const monthEvents = cells.filter((c): c is DayInfo => !!c && (c.holidays.length > 0 || c.term !== null));
  const canPrev = !(view.year === SUPPORTED_MIN.year && view.month === 1);
  const canNext = !(view.year === SUPPORTED_MAX.year && view.month === 12);
  const isSelectedInView = selected.year === view.year && selected.month === view.month;

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <Panel className="p-3 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <Button variant="ghost" size="icon" onClick={() => shiftMonth(-1)} disabled={!canPrev} aria-label="Tháng trước">
              <ChevronLeft aria-hidden />
            </Button>
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor="chon-thang">
                Chọn tháng
              </label>
              <select
                id="chon-thang"
                value={view.month}
                onChange={(e) => setView({ ...view, month: Number(e.target.value) })}
                className="h-10 rounded-lg border border-input bg-[#101a2e] px-2 font-display text-xl font-semibold text-[#f3e6c4] [color-scheme:dark]"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Tháng {i + 1}
                  </option>
                ))}
              </select>
              <label className="sr-only" htmlFor="chon-nam">
                Chọn năm
              </label>
              <select
                id="chon-nam"
                value={view.year}
                onChange={(e) => setView({ ...view, year: Number(e.target.value) })}
                className="h-10 rounded-lg border border-input bg-[#101a2e] px-2 font-display text-xl font-semibold text-[#f3e6c4] [color-scheme:dark]"
              >
                {Array.from({ length: SUPPORTED_MAX.year - SUPPORTED_MIN.year + 1 }, (_, i) => SUPPORTED_MIN.year + i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="ghost" size="icon" onClick={() => shiftMonth(1)} disabled={!canNext} aria-label="Tháng sau">
              <ChevronRight aria-hidden />
            </Button>
          </div>

          <div role="grid" aria-label={`Lịch tháng ${view.month} năm ${view.year}`} className="mt-3">
            <div role="row" className="grid grid-cols-7 text-center text-xs text-muted-foreground">
              {WEEK_HEADERS.map((w) => (
                <span key={w} role="columnheader" className="py-1.5">
                  {w}
                </span>
              ))}
            </div>
            {Array.from({ length: cells.length / 7 }, (_, r) => (
              <div role="row" key={r} className="grid grid-cols-7 gap-1">
                {cells.slice(r * 7, r * 7 + 7).map((c, i) => {
                  if (!c) return <span key={i} role="gridcell" aria-hidden className="aspect-square" />;
                  const isToday = compareDates(c.solar, today) === 0;
                  const isSel = compareDates(c.solar, selected) === 0;
                  const lunarText = c.lunar ? (c.lunar.day === 1 ? `${c.lunar.day}/${c.lunar.month}${c.lunar.isLeapMonth ? "n" : ""}` : String(c.lunar.day)) : "";
                  const sunday = i === 6;
                  const label = `${weekdayVi(c.solar)} ${formatVietnameseDate(c.solar)}${
                    c.lunar ? `, âm lịch ngày ${c.lunar.day} ${lunarMonthName(c.lunar.month, c.lunar.isLeapMonth)}` : ""
                  }${c.holidays.length ? `, ${c.holidays.join(", ")}` : ""}${c.term ? `, tiết ${c.term}` : ""}`;
                  return (
                    <span role="gridcell" key={i}>
                      <button
                        type="button"
                        disabled={!c.lunar}
                        onClick={() => setSelected(c.solar)}
                        aria-pressed={isSel}
                        aria-current={isToday ? "date" : undefined}
                        aria-label={label}
                        className={cn(
                          "relative flex aspect-square w-full flex-col items-center justify-center rounded-lg border border-transparent text-center transition-colors",
                          "hover:bg-[#1f2e4d] disabled:opacity-30",
                          isSel && "border-primary bg-[#d9c38f1f]",
                          isToday && !isSel && "border-[#d9c38f66]",
                        )}
                      >
                        <span className={cn("text-[0.95rem] font-medium leading-none sm:text-lg", sunday && "text-[#e3a28f]", isToday && "text-[#f3e4bd]")}>
                          {c.solar.day}
                        </span>
                        <span className={cn("mt-1 text-[0.625rem] leading-none sm:text-xs", c.lunar?.day === 1 ? "font-semibold text-primary" : "text-muted-foreground")}>
                          {lunarText}
                        </span>
                        {(c.holidays.length > 0 || c.term) && (
                          <span
                            aria-hidden
                            className={cn("absolute right-1 top-1 size-1.5 rounded-full", c.holidays.length ? "bg-primary" : "bg-[#7fa8d6]")}
                          />
                        )}
                      </button>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span aria-hidden className="size-1.5 rounded-full bg-primary" /> Ngày lễ
              </span>
              <span className="flex items-center gap-1.5">
                <span aria-hidden className="size-1.5 rounded-full bg-[#7fa8d6]" /> Đầu tiết khí
              </span>
            </span>
            <Button variant="outline" size="sm" onClick={() => jump(today)}>
              Về hôm nay
            </Button>
          </div>
        </Panel>

        <DayDetail info={dayInfo(selected)} today={today} outOfView={!isSelectedInView} />
      </div>

      {monthEvents.length > 0 && (
        <Section title={`Trong tháng ${view.month}/${view.year}`} id="trong-thang">
          <ul className="divide-y divide-[#2a395680] border-y border-[#2a395680]">
            {monthEvents.map((e) => (
              <li key={toISODate(e.solar)}>
                <button
                  type="button"
                  onClick={() => jump(e.solar)}
                  className="flex w-full items-baseline gap-4 py-3 text-left hover:bg-[#15213a80] md:px-2"
                >
                  <span className="w-20 shrink-0 tabular-nums text-muted-foreground">
                    {String(e.solar.day).padStart(2, "0")}/{String(e.solar.month).padStart(2, "0")}
                  </span>
                  <span>
                    {[...e.holidays, ...(e.term ? [`Tiết ${e.term}`] : [])].join(", ")}
                    {e.lunar && (
                      <span className="block text-sm text-muted-foreground">
                        Âm lịch {e.lunar.day}/{e.lunar.month}
                        {e.lunar.isLeapMonth ? " nhuận" : ""}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Converter onShow={jump} />
    </div>
  );
}

function DayDetail({ info, today, outOfView }: { info: DayInfo; today: CalendarDate; outOfView: boolean }) {
  const { solar, lunar } = info;
  if (!lunar) return null;
  const year = canChiOfLunarYear(lunar.year);
  const month = lunar.isLeapMonth ? null : canChiOfLunarMonth(lunar.year, lunar.month);
  const day = canChiOfDay(solar);
  const term = solarTermOf(solar);
  const diff = julianDayNumber(solar) - julianDayNumber(today);
  const rel = diff === 0 ? "Hôm nay" : diff === 1 ? "Ngày mai" : diff === -1 ? "Hôm qua" : diff > 0 ? `${diff} ngày nữa` : `${-diff} ngày trước`;
  return (
    <section id="chi-tiet-ngay" aria-labelledby="chi-tiet-title" aria-live="polite" className="scroll-mt-20 rounded-2xl border border-[#d9c38f40] bg-[#15213acc] p-5">
      <p className="text-sm text-muted-foreground">
        {weekdayVi(solar)}, {rel.toLowerCase()}
        {outOfView ? " (ngoài tháng đang xem)" : ""}
      </p>
      <h2 id="chi-tiet-title" className="mt-1 font-display text-4xl font-semibold text-[#f3e6c4]">
        {formatVietnameseDate(solar)}
      </h2>
      <p className="mt-2 font-display text-2xl text-[#e7d3a2]">
        Ngày {lunar.day} {lunarMonthName(lunar.month, lunar.isLeapMonth)}
      </p>
      <p className="text-sm text-foreground/85">
        Năm {year.name} (con {zodiacOf(year.branchIndex).toLowerCase()}), tháng {lunar.monthLength === 30 ? "đủ 30 ngày" : "thiếu 29 ngày"}
      </p>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 border-t border-[#2a395680] pt-4 text-sm">
        <dt className="text-muted-foreground">Ngày</dt>
        <dd>{day.name}</dd>
        <dt className="text-muted-foreground">Tháng</dt>
        <dd>{month ? month.name : "Tháng nhuận"}</dd>
        <dt className="text-muted-foreground">Năm</dt>
        <dd>{year.name}</dd>
        <dt className="text-muted-foreground">Tiết khí</dt>
        <dd>
          {term.name}
          {term.startsToday ? " (bắt đầu hôm nay)" : ""}
        </dd>
      </dl>
      {info.holidays.length > 0 && (
        <ul className="mt-4 grid gap-1.5">
          {info.holidays.map((h) => (
            <li key={h} className="rounded-lg border border-[#d9c38f40] px-3 py-2 text-sm text-[#f1e3bf]">
              {h}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Converter({ onShow }: { onShow: (d: CalendarDate) => void }) {
  const [solarValue, setSolarValue] = useState("");
  const [solarError, setSolarError] = useState<string | undefined>();
  const [solarResult, setSolarResult] = useState<{ solar: CalendarDate; lunar: LunarDate } | null>(null);

  const [lDay, setLDay] = useState("");
  const [lMonth, setLMonth] = useState("1");
  const [lYear, setLYear] = useState("");
  const [lLeap, setLLeap] = useState(false);
  const [lunarError, setLunarError] = useState<string | null>(null);
  const [lunarResult, setLunarResult] = useState<CalendarDate | null>(null);

  const convertSolar = (e: React.FormEvent) => {
    e.preventDefault();
    setSolarResult(null);
    const r = parseISODate(solarValue);
    if (!r.ok) return setSolarError(r.error === "empty" ? "Vui lòng nhập ngày dương lịch." : MESSAGES.dateInvalid.replace("Ngày sinh", "Ngày"));
    if (!isWithinSupportedRange(r.date)) return setSolarError(MESSAGES.dateRange.replace("ngày sinh ", "ngày "));
    setSolarError(undefined);
    setSolarResult({ solar: r.date, lunar: solarToLunar(r.date) });
  };

  const convertLunar = (e: React.FormEvent) => {
    e.preventDefault();
    setLunarResult(null);
    const day = Number(lDay);
    const month = Number(lMonth);
    const year = Number(lYear);
    if (!lDay || !Number.isInteger(day) || day < 1 || day > 30) return setLunarError("Ngày âm lịch phải từ 1 đến 30.");
    if (!lYear || !Number.isInteger(year) || year < 1900 || year > 2100) return setLunarError("Năm âm lịch phải từ 1900 đến 2100.");
    const r = lunarToSolar({ year, month, day, isLeapMonth: lLeap });
    if (r) {
      setLunarError(null);
      return setLunarResult(r);
    }
    if (lLeap) {
      const leap = leapMonthOfYear(year);
      return setLunarError(
        leap ? `Năm ${year} âm lịch chỉ nhuận tháng ${leap}, không có tháng ${month} nhuận.` : `Năm ${year} âm lịch không có tháng nhuận.`,
      );
    }
    if (day === 30 && lunarToSolar({ year, month, day: 29, isLeapMonth: false }))
      return setLunarError(`Tháng ${month} năm ${year} âm lịch là tháng thiếu, chỉ có 29 ngày.`);
    setLunarError("Ngày âm lịch này nằm ngoài phạm vi hỗ trợ (từ Tết năm 1900 đến hết năm 2100 dương lịch).");
  };

  return (
    <Section title="Đổi ngày" id="doi-ngay" description="Đổi qua lại giữa dương lịch và âm lịch Việt Nam (giờ Việt Nam).">
      <div className="grid gap-5 md:grid-cols-2">
        <Panel>
          <form noValidate onSubmit={convertSolar} className="grid gap-4">
            <h3 className="font-display text-xl font-semibold text-[#f1e3bf]">Dương lịch sang âm lịch</h3>
            <DateField
              label="Ngày dương lịch"
              value={solarValue}
              onChange={(e) => {
                setSolarValue(e.target.value);
                setSolarError(undefined);
              }}
              error={solarError}
            />
            <div>
              <Button type="submit">Đổi sang âm lịch</Button>
            </div>
            {solarResult && (
              <div aria-live="polite" className="rounded-xl border border-[#d9c38f40] p-4">
                <p className="font-display text-2xl text-[#f3e6c4]">
                  Ngày {solarResult.lunar.day} {lunarMonthName(solarResult.lunar.month, solarResult.lunar.isLeapMonth)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Năm {canChiOfLunarYear(solarResult.lunar.year).name} ({solarResult.lunar.year}), ngày {canChiOfDay(solarResult.solar).name}
                </p>
                <Button type="button" variant="link" className="mt-1 h-auto px-0" onClick={() => onShow(solarResult.solar)}>
                  Xem trên lịch
                </Button>
              </div>
            )}
          </form>
        </Panel>
        <Panel>
          <form noValidate onSubmit={convertLunar} className="grid gap-4">
            <h3 className="font-display text-xl font-semibold text-[#f1e3bf]">Âm lịch sang dương lịch</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="am-ngay">Ngày</Label>
                <Input id="am-ngay" inputMode="numeric" value={lDay} onChange={(e) => setLDay(e.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="1–30" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="am-thang">Tháng</Label>
                <select
                  id="am-thang"
                  value={lMonth}
                  onChange={(e) => setLMonth(e.target.value)}
                  className="h-11 rounded-lg border border-input bg-[#101a2e] px-2 text-base [color-scheme:dark]"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="am-nam">Năm</Label>
                <Input id="am-nam" inputMode="numeric" value={lYear} onChange={(e) => setLYear(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="2026" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="am-nhuan" checked={lLeap} onCheckedChange={(v) => setLLeap(v === true)} />
              <Label htmlFor="am-nhuan">Tháng nhuận</Label>
            </div>
            <div>
              <Button type="submit">Đổi sang dương lịch</Button>
            </div>
            {lunarError && (
              <p role="alert" className="text-sm text-destructive">
                {lunarError}
              </p>
            )}
            {lunarResult && (
              <div aria-live="polite" className="rounded-xl border border-[#d9c38f40] p-4">
                <p className="font-display text-2xl text-[#f3e6c4]">{formatVietnameseDate(lunarResult)}</p>
                <p className="text-sm text-muted-foreground">{weekdayVi(lunarResult)} dương lịch</p>
                <Button type="button" variant="link" className="mt-1 h-auto px-0" onClick={() => onShow(lunarResult)}>
                  Xem trên lịch
                </Button>
              </div>
            )}
          </form>
        </Panel>
      </div>
    </Section>
  );
}
