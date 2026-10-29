"use client";

import { useState } from "react";
import { BookmarkCheck, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { writeErrorMessage } from "@/components/app/result-actions";
import { useAppData } from "@/hooks/use-app-data";
import type { Repository, WriteResult } from "@/lib/storage/repository";
import { cn } from "@/lib/utils";

/** Nút "Lưu vào lịch sử" kèm thông báo trạng thái đúng với kết quả ghi thực tế. */
export function SaveHistoryButton({
  onSave,
  alreadySaved = false,
  className,
}: {
  onSave: (repo: Repository) => WriteResult;
  alreadySaved?: boolean;
  className?: string;
}) {
  const { repo, status } = useAppData();
  const [saved, setSaved] = useState(alreadySaved);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  return (
    <div className={className}>
      <Button
        variant="outline"
        size="lg"
        disabled={saved || status === "loading"}
        onClick={() => {
          if (!repo) return;
          const r = onSave(repo);
          if (r.ok) {
            setSaved(true);
            setMessage({ ok: true, text: "Đã lưu vào lịch sử trên trình duyệt này." });
          } else setMessage({ ok: false, text: writeErrorMessage(r) });
        }}
      >
        {saved ? <BookmarkCheck aria-hidden /> : <BookmarkPlus aria-hidden />}
        {saved ? (alreadySaved ? "Đã có trong lịch sử" : "Đã lưu") : "Lưu vào lịch sử"}
      </Button>
      <p aria-live="polite" className={message ? cn("mt-2 text-sm", message.ok ? "text-success" : "text-destructive") : "sr-only"}>
        {message?.text ?? ""}
      </p>
    </div>
  );
}
