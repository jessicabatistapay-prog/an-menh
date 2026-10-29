"use client";

import { useEffect, useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";
import { audioSupported } from "@/lib/audio/ambient";
import { LoopPlayer, prefetchMusic } from "@/lib/audio/loop-player";
import { cn } from "@/lib/utils";

const PREF_KEY = "an-menh:nhac";

type Pref = "on" | "off";
type Status = "off" | "waiting" | "loading" | "playing" | "unsupported";

function readPref(): Pref {
  try {
    return window.localStorage.getItem(PREF_KEY) === "off" ? "off" : "on";
  } catch {
    return "on";
  }
}

function writePref(p: Pref) {
  try {
    window.localStorage.setItem(PREF_KEY, p);
  } catch {
    /* trình duyệt chặn bộ nhớ: chỉ không ghi nhớ được lựa chọn */
  }
}

/**
 * Nút bật/tắt nhạc nền. Mặc định bật: vì trình duyệt không cho phát âm thanh trước khi người dùng
 * tương tác, nhạc bắt đầu ở lần chạm, bấm hoặc nhấn phím đầu tiên trên trang.
 */
export function MusicToggle() {
  const engine = useRef<LoopPlayer | null>(null);
  const [status, setStatus] = useState<Status>("off");
  const [hint, setHint] = useState(false);

  // Khởi tạo trạng thái sau khi gắn vào trình duyệt.
  useEffect(() => {
    if (!audioSupported()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- đọc khả năng của trình duyệt sau khi hydrate
      setStatus("unsupported");
      return;
    }
    engine.current = new LoopPlayer();
    const on = readPref() === "on";
    setStatus(on ? "waiting" : "off");
    if (!on) return;
    // Tải trước bản nhạc khi trình duyệt rảnh để lần chạm đầu tiên phát gần như ngay lập tức.
    const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number };
    const run = () => prefetchMusic().catch(() => undefined);
    if (w.requestIdleCallback) w.requestIdleCallback(run);
    else window.setTimeout(run, 2000);
  }, []);

  // Chờ thao tác đầu tiên của người dùng để bắt đầu phát.
  useEffect(() => {
    if (status !== "waiting") return;
    const showHint = window.setTimeout(() => setHint(true), 1200);
    const hideHint = window.setTimeout(() => setHint(false), 9000);
    const onGesture = (e: Event) => {
      const target = e.target as Element | null;
      if (target?.closest?.("[data-music-toggle]")) return; // nút nhạc tự xử lý
      setStatus("loading");
      engine.current?.start().then((ok) => setStatus(ok ? "playing" : "waiting"));
    };
    const opts = { capture: true } as const;
    window.addEventListener("pointerdown", onGesture, opts);
    window.addEventListener("keydown", onGesture, opts);
    return () => {
      window.clearTimeout(showHint);
      window.clearTimeout(hideHint);
      window.removeEventListener("pointerdown", onGesture, opts);
      window.removeEventListener("keydown", onGesture, opts);
    };
  }, [status]);

  // Tạm dừng khi rời tab, phát tiếp khi quay lại.
  useEffect(() => {
    if (status !== "playing") return;
    const onVis = () => {
      if (document.hidden) engine.current?.pause();
      else engine.current?.start();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [status]);

  useEffect(() => () => engine.current?.pause(), []);

  if (status === "unsupported") return null;

  const toggle = () => {
    setHint(false);
    if (status === "playing") {
      engine.current?.stop();
      writePref("off");
      setStatus("off");
    } else {
      writePref("on");
      setStatus("loading");
      engine.current?.start().then((ok) => setStatus(ok ? "playing" : "waiting"));
    }
  };

  const playing = status === "playing";
  const label = playing
    ? "Tắt nhạc nền"
    : status === "loading"
      ? "Đang tải nhạc nền"
      : status === "waiting"
        ? "Bật nhạc nền (nhạc sẽ phát khi bạn chạm vào trang)"
        : "Bật nhạc nền";

  return (
    <div className="fixed right-4 z-40 flex items-center gap-2 bottom-[calc(env(safe-area-inset-bottom)+4.75rem)] md:bottom-6 md:right-6">
      {hint && status === "waiting" && (
        <p
          role="status"
          className="max-w-[12rem] rounded-xl border border-[#d9c38f40] bg-[#16233d] px-3 py-2 text-xs leading-snug text-foreground shadow-xl animate-in fade-in-0"
        >
          Chạm vào trang để nghe nhạc nền “Huyền Không”
        </p>
      )}
      <button
        type="button"
        data-music-toggle
        onClick={toggle}
        aria-pressed={playing}
        aria-label={label}
        title={label}
        className={cn(
          "grid size-11 place-items-center rounded-full border bg-[#101a2e]/90 shadow-lg backdrop-blur transition-colors",
          playing ? "border-[#d9c38f80] text-primary" : "border-[#2a3956] text-muted-foreground hover:text-foreground",
        )}
      >
        {playing ? (
          <EqualizerIcon />
        ) : status === "loading" ? (
          <Music className="size-[1.1rem] animate-pulse" aria-hidden />
        ) : status === "waiting" ? (
          <Music className="size-[1.1rem]" aria-hidden />
        ) : (
          <VolumeX className="size-[1.1rem]" aria-hidden />
        )}
      </button>
    </div>
  );
}

function EqualizerIcon() {
  return (
    <span aria-hidden className="flex h-4 items-end gap-[3px]">
      {[0, 0.25, 0.5].map((d) => (
        <span key={d} className="music-bar w-[3px] rounded-full bg-current" style={{ animationDelay: `${d}s` }} />
      ))}
    </span>
  );
}
