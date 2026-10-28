"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookmarkCheck, BookmarkPlus, PencilLine, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppData } from "@/hooks/use-app-data";
import type { WriteResult } from "@/lib/storage/repository";
import { MESSAGES } from "@/lib/forms";
import { TextField } from "./form-fields";

export function writeErrorMessage(result: WriteResult): string {
  if (result.ok) return "";
  switch (result.reason) {
    case "unavailable":
      return "Chưa lưu được: trình duyệt này đang chặn bộ nhớ cục bộ (thường gặp ở chế độ duyệt riêng tư nghiêm ngặt).";
    case "read-only":
      return "Chưa lưu được: dữ liệu trên trình duyệt này được tạo bởi phiên bản An Mệnh mới hơn. Hãy tải lại trang để dùng phiên bản mới.";
    case "quota":
      return "Chưa lưu được: bộ nhớ trình duyệt đã đầy. Hãy xóa bớt lịch sử trong mục Hồ sơ.";
    case "limit":
      return "Đã đạt giới hạn 30 hồ sơ. Hãy xóa bớt hồ sơ cũ trong mục Hồ sơ.";
  }
}

export interface ProfileDraft {
  name: string;
  birthDate: string;
  gender: "nam" | "nu" | null;
}

export function ResultActions({
  onEdit,
  onSaveHistory,
  profileDraft,
  editLabel = "Sửa thông tin",
  alreadySaved = false,
}: {
  onEdit?: () => void;
  /** Lưu kết quả vào lịch sử. */
  onSaveHistory: () => WriteResult;
  /** Thông tin có thể lưu thành hồ sơ (bỏ trống nếu đã dùng hồ sơ có sẵn). */
  profileDraft?: ProfileDraft | null;
  editLabel?: string;
  /** Kết quả mở từ lịch sử thì không lưu lặp lại. */
  alreadySaved?: boolean;
}) {
  const router = useRouter();
  const { repo, status } = useAppData();
  const [saved, setSaved] = useState(alreadySaved);
  const [profileSaved, setProfileSaved] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [profileName, setProfileName] = useState(profileDraft?.name ?? "");
  const [nameError, setNameError] = useState<string | undefined>();

  const storageReady = status !== "loading";

  const handleSave = () => {
    const r = onSaveHistory();
    if (r.ok) {
      setSaved(true);
      setMessage({ tone: "ok", text: "Đã lưu vào lịch sử trên trình duyệt này." });
    } else {
      setMessage({ tone: "error", text: writeErrorMessage(r) });
    }
  };

  const handleSaveProfile = () => {
    if (!repo || !profileDraft) return;
    const name = profileName.trim();
    if (!name) return setNameError(MESSAGES.nameRequired);
    if (name.length > 60) return setNameError(MESSAGES.nameTooLong);
    const r = repo.addProfile({ name, birthDate: profileDraft.birthDate, gender: profileDraft.gender });
    setDialogOpen(false);
    if (r.ok) {
      setProfileSaved(true);
      setMessage({ tone: "ok", text: `Đã lưu hồ sơ “${name}”. Bạn có thể quản lý hồ sơ trong mục Hồ sơ.` });
    } else {
      setMessage({ tone: "error", text: writeErrorMessage(r) });
    }
  };

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) router.back();
    else router.push("/");
  };

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSave} disabled={!storageReady || saved}>
          {saved ? <BookmarkCheck aria-hidden /> : <BookmarkPlus aria-hidden />}
          {saved ? (alreadySaved ? "Đã có trong lịch sử" : "Đã lưu kết quả") : "Lưu kết quả"}
        </Button>
        {profileDraft && (
          <Button
            variant="outline"
            disabled={!storageReady || profileSaved}
            onClick={() => {
              setNameError(undefined);
              setProfileName(profileDraft.name);
              setDialogOpen(true);
            }}
          >
            <UserRoundPlus aria-hidden />
            {profileSaved ? "Đã lưu hồ sơ" : "Lưu thành hồ sơ"}
          </Button>
        )}
        {onEdit && (
          <Button variant="outline" onClick={onEdit}>
            <PencilLine aria-hidden />
            {editLabel}
          </Button>
        )}
        <Button variant="ghost" onClick={goBack}>
          <ArrowLeft aria-hidden />
          Quay lại
        </Button>
      </div>
      <p
        aria-live="polite"
        className={message ? (message.tone === "ok" ? "mt-3 text-sm text-success" : "mt-3 text-sm text-destructive") : "sr-only"}
      >
        {message?.text ?? ""}
      </p>

      {profileDraft && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lưu thành hồ sơ</DialogTitle>
              <DialogDescription>
                Ngày sinh {profileDraft.gender ? "và giới tính " : ""}sẽ được lưu trên trình duyệt này để dùng lại. Dữ liệu không
                được gửi đi và không tự đồng bộ sang thiết bị khác.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProfile();
              }}
            >
              <TextField
                label="Tên hồ sơ"
                value={profileName}
                onChange={(e) => {
                  setProfileName(e.target.value);
                  setNameError(undefined);
                }}
                placeholder="Ví dụ: Mẹ, Anh Tuấn, Bản thân"
                maxLength={60}
                error={nameError}
                autoFocus
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Lưu hồ sơ</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
