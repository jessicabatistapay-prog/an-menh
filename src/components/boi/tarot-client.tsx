"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RotateCcw, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioChip, RadioGroup } from "@/components/ui/radio-group";
import { LoadingBlock, MISSING_ENTRY, Note, Panel, Section } from "@/components/app/page-header";
import { useAppData } from "@/hooks/use-app-data";
import { SPREADS, SUITS, type SpreadKey, TAROT_DECK, type TarotCard, getTarotCard } from "@/lib/content/tarot";
import { formatSavedAt } from "@/lib/history";
import type { AppData } from "@/lib/storage/schema";
import { cn } from "@/lib/utils";
import { prefersReducedMotion, secureRandom, shuffle } from "./random";
import { SaveHistoryButton } from "./save-history";
import { TarotBack, TarotFace } from "./tarot-card";

interface Drawn {
  card: TarotCard;
  reversed: boolean;
}

interface Initial {
  spread: SpreadKey;
  drawn: Drawn[];
  question: string;
  savedAt: string | null;
  error: string | null;
}

function resolveInitial(params: URLSearchParams, data: AppData): Initial {
  const empty: Initial = { spread: "3", drawn: [], question: "", savedAt: null, error: null };
  const id = params.get("muc");
  if (!id) return empty;
  const entry = data.history.find((h) => h.id === id);
  if (!entry || entry.kind !== "tarot") return { ...empty, error: MISSING_ENTRY };
  const drawn = entry.cards.flatMap((c) => {
    const card = getTarotCard(c.id);
    return card ? [{ card, reversed: c.reversed }] : [];
  });
  if (drawn.length !== Number(entry.spread)) return { ...empty, error: MISSING_ENTRY };
  return { spread: entry.spread, drawn, question: entry.question, savedAt: entry.createdAt, error: null };
}

export function TarotClient() {
  const params = useSearchParams();
  const { data, status } = useAppData();
  if (status === "loading" && params.has("muc")) return <LoadingBlock />;
  return <TarotView key={params.toString()} initial={resolveInitial(params, data)} />;
}

function TarotView({ initial }: { initial: Initial }) {
  const [spread, setSpread] = useState<SpreadKey>(initial.spread);
  const [allowReversed, setAllowReversed] = useState(true);
  const [question, setQuestion] = useState(initial.question);
  const [drawn, setDrawn] = useState<Drawn[]>(initial.drawn);
  const [flipped, setFlipped] = useState<boolean[]>(initial.drawn.map(() => true));
  const resultRef = useRef<HTMLDivElement>(null);
  const allFlipped = drawn.length > 0 && flipped.every(Boolean);

  const draw = () => {
    const n = Number(spread);
    const picked = shuffle(TAROT_DECK).slice(0, n).map((card) => ({ card, reversed: allowReversed && secureRandom() < 0.5 }));
    setDrawn(picked);
    setFlipped(picked.map(() => prefersReducedMotion()));
  };

  const flip = (i: number) => {
    const next = flipped.map((v, k) => (k === i ? true : v));
    setFlipped(next);
    if (next.every(Boolean))
      window.setTimeout(() => resultRef.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" }), 750);
  };

  const flipAll = () => {
    setFlipped(drawn.map(() => true));
    window.setTimeout(() => resultRef.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" }), 750);
  };

  const positions = SPREADS[spread].positions;
  const fromHistory = initial.savedAt !== null && drawn === initial.drawn;

  return (
    <div>
      {initial.error && (
        <Note tone="warn" className="mb-5">
          {initial.error}
        </Note>
      )}
      <Panel className="md:p-7">
        <div className="grid gap-5">
          <div className="grid gap-2">
            <span id="kieu-trai" className="text-sm font-medium">
              Kiểu trải bài
            </span>
            <RadioGroup
              value={spread}
              onValueChange={(v) => {
                setSpread(v as SpreadKey);
                setDrawn([]);
                setFlipped([]);
              }}
              aria-labelledby="kieu-trai"
              className="grid-cols-2"
            >
              <RadioChip value="1">Một lá: thông điệp</RadioChip>
              <RadioChip value="3">Ba lá: quá khứ, hiện tại, hướng đi</RadioChip>
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tarot-hoi">Câu hỏi của bạn (không bắt buộc)</Label>
            <Input id="tarot-hoi" value={question} maxLength={200} onChange={(e) => setQuestion(e.target.value)} placeholder="Ví dụ: Mình cần chú ý điều gì trong công việc?" />
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="la-nguoc" checked={allowReversed} onCheckedChange={(v) => setAllowReversed(v === true)} />
            <Label htmlFor="la-nguoc">Cho phép lá ngược (mang sắc thái khác của lá bài)</Label>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="lg" onClick={draw}>
              {drawn.length ? <RotateCcw aria-hidden /> : <Shuffle aria-hidden />}
              {drawn.length ? "Xào lại và rút" : "Xào bài và rút"}
            </Button>
            {drawn.length > 0 && !allFlipped && (
              <Button size="lg" variant="outline" onClick={flipAll}>
                Lật tất cả
              </Button>
            )}
          </div>
        </div>
      </Panel>

      {drawn.length > 0 && (
        <div className={cn("mx-auto mt-8 grid gap-3 sm:gap-5", drawn.length === 1 ? "max-w-[13rem]" : "max-w-xl grid-cols-3")}>
          {drawn.map((d, i) => (
            <figure key={`${d.card.id}-${i}`} className="text-center">
              <button
                type="button"
                className="card-flip block w-full rounded-[14px]"
                onClick={() => flip(i)}
                disabled={flipped[i]}
                aria-label={flipped[i] ? `${positions[i]}: ${d.card.name}${d.reversed ? " (ngược)" : ""}` : `Lật lá ${positions[i]?.toLowerCase()}`}
              >
                <span className="card-flip-inner relative block aspect-[200/340]" data-flipped={flipped[i] ? "true" : "false"}>
                  <span className="card-face card-front-face absolute inset-0">
                    <TarotBack />
                  </span>
                  <span className="card-face card-back-face absolute inset-0">
                    <TarotFace card={d.card} reversed={d.reversed} />
                  </span>
                </span>
              </button>
              <figcaption className="mt-2 text-xs text-muted-foreground sm:text-sm">{flipped[i] ? positions[i] : "Chạm để lật"}</figcaption>
            </figure>
          ))}
        </div>
      )}

      {allFlipped && (
        <div ref={resultRef} className="scroll-mt-20">
          {fromHistory && initial.savedAt && <Note className="mt-8">Lượt rút đã lưu lúc {formatSavedAt(initial.savedAt)}.</Note>}
          <Section title="Ý nghĩa" id="y-nghia">
            {question.trim() && <p className="mb-4 border-l-2 border-primary pl-4 font-display text-xl italic text-[#e7d3a2]">“{question.trim()}”</p>}
            <ol className="grid gap-4">
              {drawn.map((d, i) => (
                <li key={i} className="rounded-2xl border border-border bg-[#15213acc] p-5">
                  <p className="text-sm text-muted-foreground">{positions[i]}</p>
                  <h3 className="mt-1 font-display text-2xl font-semibold text-[#f3e6c4]">
                    {d.card.name}
                    {d.reversed ? " (ngược)" : ""} <span className="font-sans text-sm font-normal text-muted-foreground">{d.card.en}</span>
                  </h3>
                  <p className="mt-2 font-medium text-[#f1e3bf]">{d.reversed ? d.card.reversed : d.card.upright}</p>
                  {d.card.meaning && <p className="mt-1 leading-relaxed">{d.card.meaning}</p>}
                  {d.card.suit && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Bộ {SUITS[d.card.suit].name} nói về {SUITS[d.card.suit].domain}.
                    </p>
                  )}
                  {d.reversed && (
                    <p className="mt-1 text-sm text-muted-foreground">Chiều xuôi của lá này: {d.card.upright.toLowerCase()}.</p>
                  )}
                </li>
              ))}
            </ol>
          </Section>
          <Note className="mt-8">
            Lá bài được xào và rút ngẫu nhiên. Hình vẽ và lời giải do An Mệnh tự thiết kế, tóm tắt từ cách đọc Tarot phổ biến; hãy xem đây là
            gợi ý để suy ngẫm, không phải lời tiên đoán.
          </Note>
          <SaveHistoryButton
            key={drawn.map((d) => d.card.id + d.reversed).join()}
            className="mt-6"
            alreadySaved={fromHistory}
            onSave={(repo) =>
              repo.addHistory({
                kind: "tarot",
                spread,
                cards: drawn.map((d) => ({ id: d.card.id, reversed: d.reversed })),
                question: question.trim().slice(0, 200),
                profileId: null,
                label: `Tarot ${SPREADS[spread].name.toLowerCase()}: ${drawn.map((d) => d.card.name).join(", ")}`.slice(0, 80),
              })
            }
          />
        </div>
      )}
    </div>
  );
}
