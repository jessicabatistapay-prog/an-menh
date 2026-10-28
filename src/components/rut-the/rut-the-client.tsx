"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BookmarkCheck, BookmarkPlus, RefreshCw, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ElementDot, LogoMark } from "@/components/app/element-ring";
import { LoadingBlock, MISSING_ENTRY, Note } from "@/components/app/page-header";
import { writeErrorMessage } from "@/components/app/result-actions";
import { useAppData } from "@/hooks/use-app-data";
import { type ReflectionCard, drawCard, getCardById } from "@/lib/content/cards";
import { formatSavedAt } from "@/lib/history";
import type { AppData } from "@/lib/storage/schema";

interface Initial {
  card: ReflectionCard | null;
  savedAt: string | null;
  error: string | null;
}

function resolveInitial(params: URLSearchParams, data: AppData): Initial {
  const id = params.get("muc");
  if (!id) return { card: null, savedAt: null, error: null };
  const entry = data.history.find((h) => h.id === id);
  const c = entry && entry.kind === "rut-the" ? getCardById(entry.cardId) : undefined;
  if (!entry || !c) return { card: null, savedAt: null, error: MISSING_ENTRY };
  return { card: c, savedAt: entry.createdAt, error: null };
}

export function RutTheClient() {
  const params = useSearchParams();
  const { data, status } = useAppData();
  if (status === "loading" && params.has("muc")) return <LoadingBlock className="mx-auto aspect-[3/4.4] h-auto max-w-sm rounded-3xl" />;
  return <RutTheView key={params.toString()} initial={resolveInitial(params, data)} />;
}

function RutTheView({ initial }: { initial: Initial }) {
  const { data, status, repo } = useAppData();
  const [card, setCard] = useState<ReflectionCard | null>(initial.card);
  const [flipped, setFlipped] = useState(initial.card !== null);
  const [saved, setSaved] = useState(initial.savedAt !== null);
  const [savedAt, setSavedAt] = useState<string | null>(initial.savedAt);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(initial.error);
  const contentRef = useRef<HTMLDivElement>(null);

  const draw = () => {
    const next = drawCard(Math.random, card?.id);
    setFlipped(false);
    setSaved(false);
    setSavedAt(null);
    setMessage(null);
    setLoadError(null);
    // Đợi một khung hình để thẻ úp lại rồi mới lật mặt mới.
    window.setTimeout(
      () => {
        setCard(next);
        setFlipped(true);
        window.setTimeout(() => contentRef.current?.focus({ preventScroll: true }), 50);
      },
      card ? 250 : 30,
    );
  };

  const save = () => {
    if (!card || !repo) return;
    const r = repo.addHistory({ kind: "rut-the", cardId: card.id, profileId: null, label: `Thẻ ${card.name}` });
    if (r.ok) {
      setSaved(true);
      setMessage({ tone: "ok", text: "Đã lưu thẻ vào lịch sử trên trình duyệt này." });
    } else setMessage({ tone: "error", text: writeErrorMessage(r) });
  };

  return (
    <div>
      {loadError && (
        <Note tone="warn" className="mb-5">
          {loadError}
        </Note>
      )}
      {savedAt && <Note className="mb-5">Thẻ đã lưu lúc {formatSavedAt(savedAt)}.</Note>}

      <div className="card-flip mx-auto w-full max-w-sm">
        <div className="card-flip-inner relative aspect-[3/4.4]" data-flipped={flipped ? "true" : "false"}>
          {/* Mặt sau của thẻ (khi úp) */}
          <div
            className="card-face card-front-face absolute inset-0 grid place-items-center overflow-hidden rounded-[1.5rem] border border-[#d9c38f59] bg-[radial-gradient(circle_at_50%_40%,#1f3156_0%,#121c31_70%)]"
            aria-hidden={flipped}
          >
            <div className="absolute inset-3 rounded-[1.1rem] border border-[#d9c38f33]" />
            <div className="flex flex-col items-center gap-4 text-center">
              <LogoMark className="size-20" />
              <p className="font-display text-2xl text-[#e7d3a2]">An Mệnh</p>
              <p className="px-10 text-sm text-muted-foreground">24 thẻ chiêm nghiệm</p>
            </div>
          </div>
          {/* Mặt nội dung */}
          <div
            className="card-face card-back-face absolute inset-0 flex flex-col overflow-hidden rounded-[1.5rem] border border-[#d9c38f80] bg-[linear-gradient(170deg,#1b2a4a_0%,#121c31_100%)] p-6"
            aria-hidden={!flipped}
          >
            {card && (
              <div ref={contentRef} tabIndex={-1} className="flex h-full flex-col outline-none" aria-live="polite">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ElementDot element={card.motif} />
                  <span>Thẻ chiêm nghiệm</span>
                </div>
                <h2 className="mt-3 font-display text-[2.4rem] font-semibold leading-none text-[#f3e6c4]">{card.name}</h2>
                <p className="mt-5 font-display text-[1.45rem] leading-snug text-foreground/95">{card.message}</p>
                <div className="mt-auto grid gap-3 border-t border-[#d9c38f33] pt-4 text-sm">
                  <p>
                    <span className="block text-muted-foreground">Câu hỏi</span>
                    <span className="font-display text-lg italic leading-snug text-[#e7d3a2]">{card.question}</span>
                  </p>
                  <p>
                    <span className="block text-muted-foreground">Việc nhỏ hôm nay</span>
                    {card.action}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-sm flex-wrap justify-center gap-2">
        <Button size="lg" onClick={draw}>
          {card ? <RefreshCw aria-hidden /> : <Sparkle aria-hidden />}
          {card ? "Rút thẻ khác" : "Rút một thẻ"}
        </Button>
        {card && (
          <Button size="lg" variant="outline" onClick={save} disabled={saved || status === "loading"}>
            {saved ? <BookmarkCheck aria-hidden /> : <BookmarkPlus aria-hidden />}
            {saved ? "Đã lưu thẻ" : "Lưu vào lịch sử"}
          </Button>
        )}
      </div>
      <p
        aria-live="polite"
        className={message ? (message.tone === "ok" ? "mt-3 text-center text-sm text-success" : "mt-3 text-center text-sm text-destructive") : "sr-only"}
      >
        {message?.text ?? ""}
      </p>
      <p className="mx-auto mt-6 max-w-md text-center text-sm leading-relaxed text-muted-foreground">
        Thẻ được chọn ngẫu nhiên để gợi mở suy ngẫm. Bộ 24 thẻ do An Mệnh tự biên soạn, không phải một hệ thống bói toán cổ truyền và không
        dự báo điều gì. {data.history.some((h) => h.kind === "rut-the") ? "Các thẻ đã lưu nằm trong mục Hồ sơ." : ""}
      </p>
    </div>
  );
}
