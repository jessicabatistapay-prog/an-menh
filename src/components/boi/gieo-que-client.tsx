"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RotateCcw, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingBlock, MISSING_ENTRY, Note, Panel, Section } from "@/components/app/page-header";
import { useAppData } from "@/hooks/use-app-data";
import { HEXAGRAM_MEANINGS } from "@/lib/content/hexagrams";
import {
  type CoinToss,
  type Hexagram,
  LINE_LABELS,
  LINE_POSITION_NAMES,
  type LineValue,
  readingFromValues,
  tossLine,
} from "@/lib/core/iching";
import { formatSavedAt } from "@/lib/history";
import type { AppData } from "@/lib/storage/schema";
import { cn } from "@/lib/utils";
import { HexagramFigure } from "./hexagram-figure";
import { prefersReducedMotion, secureRandom } from "./random";
import { SaveHistoryButton } from "./save-history";

interface Initial {
  values: LineValue[];
  question: string;
  savedAt: string | null;
  error: string | null;
}

function resolveInitial(params: URLSearchParams, data: AppData): Initial {
  const id = params.get("muc");
  if (!id) return { values: [], question: "", savedAt: null, error: null };
  const entry = data.history.find((h) => h.id === id);
  if (!entry || entry.kind !== "gieo-que") return { values: [], question: "", savedAt: null, error: MISSING_ENTRY };
  return { values: entry.values.split("").map(Number) as LineValue[], question: entry.question, savedAt: entry.createdAt, error: null };
}

export function GieoQueClient() {
  const params = useSearchParams();
  const { data, status } = useAppData();
  if (status === "loading" && params.has("muc")) return <LoadingBlock />;
  return <GieoQueView key={params.toString()} initial={resolveInitial(params, data)} />;
}

function Coin({ heads, spinning }: { heads: boolean | null; spinning: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid size-14 place-items-center rounded-full border-2 transition-colors",
        heads === null ? "border-[#2a3956] bg-[#101a2e]" : heads ? "border-[#e7d3a2] bg-[#d9c38f]" : "border-[#8b7a55] bg-[#3a3324]",
        spinning && "coin-spin",
      )}
    >
      <span className={cn("size-4 rounded-[3px] border-2", heads ? "border-[#7a6436] bg-[#0d1524]" : "border-[#6b5d3f] bg-[#0d1524]")} />
    </span>
  );
}

function HexagramBlock({ h, label }: { h: Hexagram; label: string }) {
  const m = HEXAGRAM_MEANINGS[h.number - 1]!;
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-start gap-5">
        <div className="w-24 shrink-0">
          <HexagramFigure lines={h.lines} showMoving={false} title={`Quẻ ${h.fullName}`} />
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-3xl font-semibold leading-tight text-[#f3e6c4]">
            {h.fullName} <span className="font-normal text-[#e7d3a2]">{h.hanzi}</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Quẻ số {h.number}. Trên {h.upper.name} ({h.upper.nature}) {h.upper.symbol}, dưới {h.lower.name} ({h.lower.nature}) {h.lower.symbol}
          </p>
          <p className="mt-2 font-medium text-[#f1e3bf]">{m.keyword}</p>
        </div>
      </div>
      <p className="mt-3 font-display text-xl italic text-[#e7d3a2]">{m.image}</p>
      <p className="mt-2 leading-relaxed">{m.meaning}</p>
      <p className="mt-2 leading-relaxed text-foreground/90">
        <span className="text-muted-foreground">Gợi ý: </span>
        {m.advice}
      </p>
    </div>
  );
}

function GieoQueView({ initial }: { initial: Initial }) {
  const [question, setQuestion] = useState(initial.question);
  const [values, setValues] = useState<LineValue[]>(initial.values);
  const [lastToss, setLastToss] = useState<CoinToss | null>(null);
  const [spinning, setSpinning] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const done = values.length === 6;

  const focusResult = () =>
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
      resultRef.current?.querySelector<HTMLElement>("#ket-qua-que")?.focus({ preventScroll: true });
    });

  const tossOne = () => {
    if (done || spinning) return;
    const t = tossLine(secureRandom);
    const commit = () => {
      setLastToss(t);
      setSpinning(false);
      const next = [...values, t.value];
      setValues(next);
      if (next.length === 6) focusResult();
    };
    if (prefersReducedMotion()) return commit();
    setSpinning(true);
    setLastToss(null);
    window.setTimeout(commit, 650);
  };

  const tossAll = () => {
    if (spinning) return;
    const next = [...values];
    let last: CoinToss | null = null;
    while (next.length < 6) {
      last = tossLine(secureRandom);
      next.push(last.value);
    }
    setLastToss(last);
    setValues(next);
    focusResult();
  };

  const reset = () => {
    setValues([]);
    setLastToss(null);
  };

  const reading = done ? readingFromValues(values) : null;

  return (
    <div>
      {initial.error && (
        <Note tone="warn" className="mb-5">
          {initial.error}
        </Note>
      )}
      {initial.savedAt && done && <Note className="mb-5">Quẻ đã lưu lúc {formatSavedAt(initial.savedAt)}.</Note>}

      <Panel className="md:p-7">
        <div className="grid gap-6 md:grid-cols-[1fr_11rem] md:items-start">
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="cau-hoi">Điều bạn đang băn khoăn (không bắt buộc)</Label>
              <Input
                id="cau-hoi"
                value={question}
                maxLength={200}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ví dụ: Mình nên chuẩn bị gì cho công việc mới?"
                disabled={values.length > 0}
              />
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                Tĩnh tâm nghĩ về điều mình muốn hỏi, rồi gieo lần lượt 6 hào từ dưới lên. Câu hỏi chỉ được lưu nếu bạn chọn lưu quẻ.
              </p>
            </div>

            <div className="flex items-center gap-3" aria-hidden={!spinning && !lastToss}>
              {[0, 1, 2].map((i) => (
                <Coin key={i} heads={spinning ? null : (lastToss?.coins[i] ?? null)} spinning={spinning} />
              ))}
              <p className="text-sm text-muted-foreground" aria-live="polite">
                {spinning
                  ? "Đang gieo…"
                  : lastToss
                    ? `${lastToss.coins.filter(Boolean).length} ngửa, ${3 - lastToss.coins.filter(Boolean).length} sấp: ${LINE_LABELS[lastToss.value].toLowerCase()} (${lastToss.value})`
                    : "Ba đồng xu: ngửa tính 3, sấp tính 2."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {!done ? (
                <>
                  <Button size="lg" onClick={tossOne} disabled={spinning}>
                    <Sparkles aria-hidden />
                    {values.length === 0 ? "Gieo hào sơ" : `Gieo ${LINE_POSITION_NAMES[values.length]!.toLowerCase()}`}
                  </Button>
                  <Button size="lg" variant="outline" onClick={tossAll} disabled={spinning}>
                    <Zap aria-hidden />
                    {values.length === 0 ? "Gieo nhanh cả 6 hào" : "Gieo nốt các hào còn lại"}
                  </Button>
                </>
              ) : (
                <Button size="lg" variant="outline" onClick={reset}>
                  <RotateCcw aria-hidden />
                  Gieo quẻ khác
                </Button>
              )}
            </div>
          </div>
          <div className="mx-auto w-40 md:w-full">
            <HexagramFigure values={[...values, ...Array(6 - values.length).fill(null)]} title={`Đã gieo ${values.length} trên 6 hào`} />
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {done ? "○ lão dương, × lão âm (hào động)" : `Đã gieo ${values.length}/6 hào`}
            </p>
          </div>
        </div>
      </Panel>

      {reading && (
        <div ref={resultRef} className="scroll-mt-20">
          <Section title="Kết quả" id="ket-qua">
            <div id="ket-qua-que" tabIndex={-1} className="outline-none">
              {question.trim() && (
                <p className="mb-5 border-l-2 border-primary pl-4 font-display text-xl italic text-[#e7d3a2]">“{question.trim()}”</p>
              )}
              <HexagramBlock h={reading.primary} label={reading.changed ? "Quẻ chủ – tình thế hiện tại" : "Quẻ chủ (không có hào động)"} />
            </div>
          </Section>

          {reading.changed && (
            <>
              <Section title="Hào động" id="hao-dong">
                <ul className="grid gap-1.5">
                  {reading.movingLines.map((n) => (
                    <li key={n} className="rounded-lg border border-[#d9c38f33] px-3 py-2 text-sm">
                      {LINE_POSITION_NAMES[n - 1]}: {LINE_LABELS[values[n - 1]!].toLowerCase()}, sẽ đổi thành hào{" "}
                      {values[n - 1] === 9 ? "âm" : "dương"}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Theo cách đọc phổ biến, quẻ chủ cho biết tình thế hiện tại, hào động là chỗ đang chuyển mình, còn quẻ biến gợi xu hướng
                  mọi việc có thể đi tới.
                </p>
              </Section>
              <Section title="Quẻ biến" id="que-bien">
                <HexagramBlock h={reading.changed} label="Xu hướng chuyển biến" />
              </Section>
            </>
          )}

          <Note className="mt-8">
            Kết quả gieo là ngẫu nhiên. Lời giải do An Mệnh tự diễn giải ngắn gọn từ tinh thần của Kinh Dịch, dùng để gợi mở suy nghĩ, không
            phải lời tiên đoán.
          </Note>
          <div className="mt-6 flex flex-wrap items-start gap-3">
            <SaveHistoryButton
              key={values.join("")}
              alreadySaved={initial.savedAt !== null && initial.values.join("") === values.join("")}
              onSave={(repo) =>
                repo.addHistory({
                  kind: "gieo-que",
                  values: values.join(""),
                  question: question.trim().slice(0, 200),
                  profileId: null,
                  label: `Quẻ ${reading.primary.fullName}`,
                })
              }
            />
            <Button size="lg" variant="ghost" onClick={reset}>
              <RotateCcw aria-hidden />
              Gieo quẻ khác
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
