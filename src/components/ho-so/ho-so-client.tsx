"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Compass, Hash, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Section } from "@/components/app/page-header";
import { StorageNotice } from "@/components/app/storage-notice";
import { writeErrorMessage } from "@/components/app/result-actions";
import { useAppData } from "@/hooks/use-app-data";
import { formatVietnameseDate, parseISODate } from "@/lib/core/date";
import { GENDER_LABELS, type ProfileForm } from "@/lib/forms";
import { HISTORY_KIND_LABELS, describeHistory, formatSavedAt, historyHref } from "@/lib/history";
import type { WriteResult } from "@/lib/storage/repository";
import type { HistoryKind, Profile } from "@/lib/storage/schema";
import { cn } from "@/lib/utils";
import { ProfileDialog } from "./profile-dialog";

type Filter = "all" | HistoryKind;

function ConfirmDelete({
  trigger,
  title,
  description,
  confirmLabel,
  onConfirm,
}: {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function HoSoClient() {
  const { data, status, repo } = useAppData();
  const [dialog, setDialog] = useState<{ mode: "create" | "edit"; profile: Profile | null } | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  const dialogInitial = useMemo<ProfileForm | null>(
    () => (dialog?.profile ? { name: dialog.profile.name, birthDate: dialog.profile.birthDate, gender: dialog.profile.gender } : null),
    [dialog],
  );

  const report = (r: WriteResult, okText: string) =>
    setMessage(r.ok ? { tone: "ok", text: okText } : { tone: "error", text: writeErrorMessage(r) });

  if (status === "loading") {
    return <div className="h-64 animate-pulse rounded-2xl bg-[#15213a99]" aria-busy="true" aria-label="Đang tải dữ liệu" />;
  }

  const canWrite = repo?.canWrite ?? false;
  const profiles = [...data.profiles].sort((a, b) => a.name.localeCompare(b.name, "vi"));
  const kindsPresent = new Set(data.history.map((h) => h.kind));
  const activeFilter: Filter = filter !== "all" && !kindsPresent.has(filter) ? "all" : filter;
  const history = activeFilter === "all" ? data.history : data.history.filter((h) => h.kind === activeFilter);

  const submitProfile = (values: ProfileForm) => {
    if (!repo || !dialog) return;
    if (dialog.mode === "create") {
      report(repo.addProfile(values), `Đã thêm hồ sơ “${values.name.trim()}”.`);
    } else if (dialog.profile) {
      report(repo.updateProfile(dialog.profile.id, values), `Đã cập nhật hồ sơ “${values.name.trim()}”.`);
    }
    setDialog(null);
  };

  return (
    <div>
      <StorageNotice always />
      <p aria-live="polite" className={message ? cn("mt-4 text-sm", message.tone === "ok" ? "text-success" : "text-destructive") : "sr-only"}>
        {message?.text ?? ""}
      </p>

      <Section title="Hồ sơ" id="ho-so">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">{profiles.length > 0 ? `${profiles.length} hồ sơ` : "Chưa có hồ sơ nào."}</p>
          <Button size="sm" onClick={() => setDialog({ mode: "create", profile: null })} disabled={!canWrite}>
            <Plus aria-hidden />
            Thêm hồ sơ
          </Button>
        </div>
        {profiles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9c38f40] p-6 text-sm leading-relaxed text-muted-foreground">
            Hồ sơ giúp bạn lưu ngày sinh của mình hoặc người thân để xem lại nhanh. Bạn có thể thêm ở đây hoặc chọn “Lưu thành hồ sơ” ở trang
            kết quả.
          </div>
        ) : (
          <ul className="divide-y divide-[#2a395680] rounded-2xl border border-border bg-[#15213acc]">
            {profiles.map((p) => {
              const d = parseISODate(p.birthDate);
              const q = `ho-so=${encodeURIComponent(p.id)}`;
              return (
                <li key={p.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-display text-xl font-semibold text-[#f1e3bf]">{p.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Sinh {d.ok ? formatVietnameseDate(d.date) : p.birthDate}
                        {p.gender ? `, ${GENDER_LABELS[p.gender].toLowerCase()}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-9"
                        aria-label={`Sửa hồ sơ ${p.name}`}
                        disabled={!canWrite}
                        onClick={() => setDialog({ mode: "edit", profile: p })}
                      >
                        <Pencil aria-hidden />
                      </Button>
                      <ConfirmDelete
                        trigger={
                          <Button size="icon" variant="ghost" className="size-9" aria-label={`Xóa hồ sơ ${p.name}`} disabled={!canWrite}>
                            <Trash2 aria-hidden />
                          </Button>
                        }
                        title="Xóa hồ sơ này?"
                        description={`Hồ sơ “${p.name}” sẽ bị xóa khỏi trình duyệt này. Các kết quả đã lưu vẫn được giữ trong lịch sử.`}
                        confirmLabel="Xóa hồ sơ"
                        onConfirm={() => repo && report(repo.deleteProfile(p.id), `Đã xóa hồ sơ “${p.name}”.`)}
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link href={`/ban-menh?${q}`} className={buttonVariants({ size: "sm", variant: "secondary" })}>
                      <Sparkles aria-hidden /> Bản mệnh
                    </Link>
                    <Link href={`/phong-thuy?${q}`} className={buttonVariants({ size: "sm", variant: "secondary" })}>
                      <Compass aria-hidden /> Phong thủy
                    </Link>
                    <Link href={`/than-so-hoc?${q}`} className={buttonVariants({ size: "sm", variant: "secondary" })}>
                      <Hash aria-hidden /> Thần số học
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section title="Lịch sử đã lưu" id="lich-su">
        {data.history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9c38f40] p-6 text-sm leading-relaxed text-muted-foreground">
            Chưa có kết quả nào được lưu. Ở mỗi trang kết quả, chọn “Lưu kết quả” để xem lại sau.
          </div>
        ) : (
          <>
            <div role="group" aria-label="Lọc lịch sử" className="mb-4 flex flex-wrap gap-2">
              {(["all", "ban-menh", "phong-thuy", "than-so", "rut-the", "hop-tuoi"] as const)
                .filter((k) => k === "all" || kindsPresent.has(k))
                .map((k) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={activeFilter === k}
                    onClick={() => setFilter(k)}
                    className={cn(
                      "h-9 rounded-full border px-4 text-sm",
                      activeFilter === k ? "border-primary bg-[#d9c38f1f] text-[#f3e4bd]" : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {k === "all" ? "Tất cả" : HISTORY_KIND_LABELS[k]}
                  </button>
                ))}
            </div>
            <ul className="divide-y divide-[#2a395680] rounded-2xl border border-border bg-[#15213acc]">
              {history.map((h) => (
                <li key={h.id} className="flex items-center justify-between gap-3 p-4">
                  <Link href={historyHref(h)} className="min-w-0 flex-1 rounded-md">
                    <p className="truncate font-medium hover:text-[#f1e3bf]">{h.label || HISTORY_KIND_LABELS[h.kind]}</p>
                    <p className="text-sm text-muted-foreground">
                      {HISTORY_KIND_LABELS[h.kind]}: {describeHistory(h)}
                    </p>
                    <p className="text-xs text-muted-foreground/80">Lưu lúc {formatSavedAt(h.createdAt)}</p>
                  </Link>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-9 shrink-0"
                    aria-label={`Xóa mục ${h.label || HISTORY_KIND_LABELS[h.kind]}`}
                    disabled={!canWrite}
                    onClick={() => repo && report(repo.deleteHistory(h.id), "Đã xóa một mục khỏi lịch sử.")}
                  >
                    <Trash2 aria-hidden />
                  </Button>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <ConfirmDelete
                trigger={
                  <Button variant="outline" size="sm" disabled={!canWrite}>
                    Xóa toàn bộ lịch sử
                  </Button>
                }
                title="Xóa toàn bộ lịch sử?"
                description="Tất cả kết quả đã lưu sẽ bị xóa khỏi trình duyệt này. Hồ sơ vẫn được giữ lại."
                confirmLabel="Xóa lịch sử"
                onConfirm={() => repo && report(repo.clearHistory(), "Đã xóa toàn bộ lịch sử.")}
              />
            </div>
          </>
        )}
      </Section>

      <Section title="Dữ liệu trên trình duyệt này" id="du-lieu">
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          An Mệnh không có tài khoản và không gửi dữ liệu lên máy chủ. Mọi hồ sơ và lịch sử nằm trong bộ nhớ của trình duyệt hiện tại; nếu
          dùng điện thoại khác hay trình duyệt khác, bạn sẽ không thấy chúng.
        </p>
        <div className="mt-4">
          <ConfirmDelete
            trigger={
              <Button variant="destructive" size="sm" disabled={status === "unavailable"}>
                <Trash2 aria-hidden /> Xóa toàn bộ dữ liệu
              </Button>
            }
            title="Xóa toàn bộ dữ liệu?"
            description="Toàn bộ hồ sơ và lịch sử của An Mệnh trên trình duyệt này sẽ bị xóa vĩnh viễn và không thể khôi phục."
            confirmLabel="Xóa tất cả"
            onConfirm={() => repo && report(repo.clearAll(), "Đã xóa toàn bộ dữ liệu của An Mệnh trên trình duyệt này.")}
          />
        </div>
      </Section>

      <ProfileDialog
        open={dialog !== null}
        onOpenChange={(o) => !o && setDialog(null)}
        mode={dialog?.mode ?? "create"}
        initial={dialogInitial}
        onSubmit={submitProfile}
      />
    </div>
  );
}
