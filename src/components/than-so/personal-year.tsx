"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/app/page-header";
import { type CalendarDate, todayInVietnam } from "@/lib/core/date";
import { PERSONAL_YEAR_MEANINGS, personalYear } from "@/lib/core/numerology";

export function PersonalYearSection({ birth }: { birth: CalendarDate }) {
  const [year, setYear] = useState(() => todayInVietnam().year);
  const current = todayInVietnam().year;
  const r = personalYear(birth, year);
  const m = PERSONAL_YEAR_MEANINGS[r.number]!;
  return (
    <Section title="Năm cá nhân" id="nam-ca-nhan" description="Chủ đề gợi ý cho từng năm trong chu kỳ 9 năm.">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="size-10" onClick={() => setYear(year - 1)} disabled={year <= 1900} aria-label="Năm trước">
          <Minus aria-hidden />
        </Button>
        <p className="min-w-28 text-center font-display text-2xl font-semibold text-[#f3e6c4]" aria-live="polite">
          {year}
          {year === current && <span className="block font-sans text-xs font-normal text-muted-foreground">năm nay</span>}
        </p>
        <Button variant="outline" size="icon" className="size-10" onClick={() => setYear(year + 1)} disabled={year >= 2100} aria-label="Năm sau">
          <Plus aria-hidden />
        </Button>
        {year !== current && (
          <Button variant="ghost" size="sm" onClick={() => setYear(current)}>
            Về năm nay
          </Button>
        )}
      </div>
      <div className="mt-4 flex items-start gap-4 rounded-2xl border border-[#d9c38f40] bg-[#15213acc] p-5">
        <span className="font-display text-6xl font-semibold leading-none text-[#e7d3a2]" aria-hidden>
          {r.number}
        </span>
        <div>
          <p className="font-display text-2xl font-semibold text-[#f1e3bf]">
            <span className="sr-only">Năm cá nhân {r.number}: </span>
            {m.theme}
          </p>
          <p className="mt-1 leading-relaxed">{m.focus}</p>
          <p className="mt-2 text-sm text-muted-foreground">Gợi ý: {m.suggestion}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Cách tính: {r.steps.map((s) => `${s.expression} = ${s.result}`).join("; ")}. Năm cá nhân cộng ngày và tháng sinh với năm đang xét, rồi
        rút gọn về một chữ số từ 1 đến 9 (không giữ 11, 22, 33).
      </p>
    </Section>
  );
}
