"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingBlock, MISSING_ENTRY, Note, Panel } from "@/components/app/page-header";
import { useAppData } from "@/hooks/use-app-data";
import { type Xam, XAM, getXam } from "@/lib/content/xam";
import { formatSavedAt } from "@/lib/history";
import type { AppData } from "@/lib/storage/schema";
import { cn } from "@/lib/utils";
import { prefersReducedMotion, secureRandom } from "./random";
import { SaveHistoryButton } from "./save-history";

interface Initial {
  xam: Xam | null;
  question: string;
  savedAt: string | null;
  error: string | null;
}

function resolveInitial(params: URLSearchParams, data: AppData): Initial {
  const id = params.get("muc");
  if (!id) return { xam: null, question: "", savedAt: null, error: null };
  const entry = data.history.find((h) => h.id === id);
  const x = entry && entry.kind === "xin-xam" ? getXam(entry.number) : undefined;
  if (!entry || entry.kind !== "xin-xam" || !x) return { xam: null, question: "", savedAt: null, error: MISSING_ENTRY };
  return { xam: x, question: entry.question, savedAt: entry.createdAt, error: null };
}

export function XinXamClient() {
  const params = useSearchParams();
  const { data, status } = useAppData();
  if (status === "loading" && params.has("muc")) return <LoadingBlock />;
  return <XinXamView key={params.toString()} initial={resolveInitial(params, data)} />;
}

function Tube({ shaking, number }: { shaking: boolean; number: number | null }) {
  const sticks = [-26, -16, -7, 2, 11, 20, 28];
  return (
    <svg viewBox="0 0 160 220" className={cn("h-auto w-40", shaking && "tube-shake")} aria-hidden>
      {sticks.map((x, i) => (
        <rect key={i} x={80 + x - 3} y={40 + (i % 3) * 6} width={6} height={120} rx={2} fill="#b08a4f" opacity={0.85} />
      ))}
      {number !== null && (
        <g className="stick-rise">
          <rect x={77} y={-2} width={8} height={120} rx={2} fill="#e7d3a2" />
          <text x={81} y={28} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1a1f2b" transform="rotate(-90 81 28)">
            {number}
          </text>
        </g>
      )}
      <path d="M38 92 h84 l-8 120 h-68 z" fill="#5a2f2a" stroke="#d9c38f" strokeOpacity="0.55" />
      <path d="M38 92 h84" stroke="#e7d3a2" strokeWidth="3" />
      <path d="M44 120 h72 M47 185 h66" stroke="#d9c38f" strokeOpacity="0.45" />
      <text x="80" y="160" textAnchor="middle" fontSize="20" fill="#e7d3a2" style={{ fontFamily: "var(--font-display)" }}>
        籤
      </text>
    </svg>
  );
}

function XinXamView({ initial }: { initial: Initial }) {
  const [question, setQuestion] = useState(initial.question);
  const [xam, setXam] = useState<Xam | null>(initial.xam);
  const [shaking, setShaking] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const shake = () => {
    if (shaking) return;
    const pick = XAM[Math.floor(secureRandom() * XAM.length)]!;
    const reveal = () => {
      setShaking(false);
      setXam(pick);
      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
        resultRef.current?.focus({ preventScroll: true });
      });
    };
    setXam(null);
    if (prefersReducedMotion()) return reveal();
    setShaking(true);
    window.setTimeout(reveal, 1400);
  };

  return (
    <div>
      {initial.error && (
        <Note tone="warn" className="mb-5">
          {initial.error}
        </Note>
      )}
      <Panel className="md:p-7">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="xam-hoi">Điều bạn muốn hỏi (không bắt buộc)</Label>
              <Input
                id="xam-hoi"
                value={question}
                maxLength={200}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ví dụ: Mình nên chú ý điều gì trong tháng này?"
              />
            </div>
            <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
              Tĩnh tâm vài nhịp thở, nghĩ về điều mình muốn hỏi rồi lắc ống xăm. Một trong 36 quẻ sẽ được rút ngẫu nhiên.
            </p>
            <div>
              <Button size="lg" onClick={shake} disabled={shaking}>
                {xam ? <RotateCcw aria-hidden /> : <Sparkles aria-hidden />}
                {shaking ? "Đang lắc…" : xam ? "Xin quẻ khác" : "Lắc ống xăm"}
              </Button>
            </div>
          </div>
          <div className="mx-auto">
            <Tube shaking={shaking} number={xam?.number ?? null} />
          </div>
        </div>
      </Panel>

      {xam && (
        <div ref={resultRef} tabIndex={-1} className="mt-8 scroll-mt-20 outline-none" aria-live="polite">
          {initial.savedAt && initial.xam?.number === xam.number && <Note className="mb-5">Quẻ đã lưu lúc {formatSavedAt(initial.savedAt)}.</Note>}
          <article className="relative overflow-hidden rounded-2xl border border-[#d9c38f66] bg-[linear-gradient(170deg,#1b2a4a,#121c31)] p-6 md:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-sm text-muted-foreground">Quẻ số {xam.number}</p>
              <p className="rounded-full border border-[#d9c38f59] px-3 py-1 text-sm text-[#f1e3bf]">Quẻ {xam.level.toLowerCase()}</p>
            </div>
            <h2 className="mt-2 font-display text-4xl font-semibold text-[#f3e6c4]">{xam.title}</h2>
            {question.trim() && <p className="mt-2 text-sm text-muted-foreground">Cho câu hỏi: “{question.trim()}”</p>}
            <blockquote className="mt-6 border-l-2 border-primary pl-4 font-display text-[1.3rem] italic leading-snug text-[#e7d3a2] sm:pl-5 sm:text-2xl">
              <p>{xam.poem[0]}</p>
              <p className="sm:pl-6">{xam.poem[1]}</p>
            </blockquote>
            <p className="mt-6 leading-relaxed">{xam.meaning}</p>
            <dl className="mt-6 grid gap-4 border-t border-[#d9c38f33] pt-5 md:grid-cols-3">
              {(
                [
                  ["Công việc", xam.work],
                  ["Gia đạo", xam.family],
                  ["Tình duyên", xam.love],
                ] as const
              ).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-sm text-muted-foreground">{k}</dt>
                  <dd className="mt-0.5 leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>
          </article>
          <Note className="mt-6">
            Bộ 36 quẻ xăm và lời bàn do An Mệnh tự soạn, không phải xăm của đền chùa nào. Quẻ được rút ngẫu nhiên để gợi mở suy nghĩ; không có
            quẻ báo điều xấu.
          </Note>
          <SaveHistoryButton
            key={xam.number}
            className="mt-6"
            alreadySaved={initial.savedAt !== null && initial.xam?.number === xam.number}
            onSave={(repo) =>
              repo.addHistory({
                kind: "xin-xam",
                number: xam.number,
                question: question.trim().slice(0, 200),
                profileId: null,
                label: `Xăm số ${xam.number}: ${xam.title}`,
              })
            }
          />
        </div>
      )}
    </div>
  );
}
