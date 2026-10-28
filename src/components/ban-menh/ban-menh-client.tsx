"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DateField, GenderField, ProfilePicker, TextField } from "@/components/app/form-fields";
import { LoadingBlock, MISSING_ENTRY, MISSING_PROFILE, Note, Panel } from "@/components/app/page-header";
import { ResultActions } from "@/components/app/result-actions";
import { useAppData } from "@/hooks/use-app-data";
import { type BanMenhResult, computeBanMenh } from "@/lib/core/banmenh";
import { parseISODate } from "@/lib/core/date";
import { type BanMenhForm, banMenhSchema } from "@/lib/forms";
import { formatSavedAt } from "@/lib/history";
import type { AppData } from "@/lib/storage/schema";
import { BanMenhResultView } from "./ban-menh-result";

interface Shown {
  result: BanMenhResult;
  values: BanMenhForm;
  profileId: string | null;
  savedAt: string | null;
}

interface Initial {
  values: BanMenhForm;
  profileId: string | null;
  savedAt: string | null;
  autoShow: boolean;
  error: string | null;
}

const EMPTY: BanMenhForm = { name: "", birthDate: "", includeCungPhi: false, gender: null };

function compute(values: BanMenhForm, profileId: string | null, savedAt: string | null): Shown | string {
  const parsed = parseISODate(values.birthDate);
  if (!parsed.ok) return "Ngày sinh không hợp lệ.";
  const r = computeBanMenh({ birthDate: parsed.date, gender: values.includeCungPhi ? values.gender : null });
  if (!r.ok) return r.error === "out-of-range" ? "Ngày sinh nằm ngoài phạm vi hỗ trợ." : "Ngày sinh không hợp lệ.";
  return { result: r.result, values, profileId, savedAt };
}

/** Xác định trạng thái ban đầu từ đường dẫn: ?muc=<lịch sử> hoặc ?ho-so=<hồ sơ>. */
function resolveInitial(params: URLSearchParams, data: AppData): Initial {
  const entryId = params.get("muc");
  const pid = params.get("ho-so");
  if (entryId) {
    const entry = data.history.find((h) => h.id === entryId);
    if (!entry || entry.kind !== "ban-menh") {
      return { values: EMPTY, profileId: null, savedAt: null, autoShow: false, error: MISSING_ENTRY };
    }
    const profile = data.profiles.find((p) => p.id === entry.profileId);
    return {
      values: { name: profile?.name ?? "", birthDate: entry.birthDate, includeCungPhi: entry.gender !== null, gender: entry.gender },
      profileId: profile ? profile.id : null,
      savedAt: entry.createdAt,
      autoShow: true,
      error: null,
    };
  }
  if (pid) {
    const profile = data.profiles.find((p) => p.id === pid);
    if (!profile) return { values: EMPTY, profileId: null, savedAt: null, autoShow: false, error: MISSING_PROFILE };
    return {
      values: { name: profile.name, birthDate: profile.birthDate, includeCungPhi: profile.gender !== null, gender: profile.gender },
      profileId: profile.id,
      savedAt: null,
      autoShow: true,
      error: null,
    };
  }
  return { values: EMPTY, profileId: null, savedAt: null, autoShow: false, error: null };
}

export function BanMenhClient() {
  const params = useSearchParams();
  const { data, status } = useAppData();
  if (status === "loading" && (params.has("muc") || params.has("ho-so"))) return <LoadingBlock />;
  const key = params.toString();
  return <BanMenhView key={key} initial={resolveInitial(params, data)} />;
}

function BanMenhView({ initial }: { initial: Initial }) {
  const { data, repo } = useAppData();
  const [shown, setShown] = useState<Shown | null>(() => {
    if (!initial.autoShow) return null;
    const r = compute(initial.values, initial.profileId, initial.savedAt);
    return typeof r === "string" ? null : r;
  });
  const [profileId, setProfileId] = useState<string | null>(initial.profileId);
  const [loadError, setLoadError] = useState<string | null>(initial.error);
  const resultRef = useRef<HTMLDivElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  const form = useForm<BanMenhForm>({ resolver: zodResolver(banMenhSchema), defaultValues: initial.values, mode: "onTouched" });
  const includeCungPhi = useWatch({ control: form.control, name: "includeCungPhi" });

  const show = (values: BanMenhForm, pid: string | null) => {
    const r = compute(values, pid, null);
    if (typeof r === "string") return setLoadError(r);
    setLoadError(null);
    setShown(r);
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ block: "start" });
      resultRef.current?.querySelector<HTMLElement>("#ket-qua-title")?.focus({ preventScroll: true });
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => form.handleSubmit((values) => show(values, profileId))(e);

  const backToForm = (focusGender = false) => {
    setShown(null);
    if (focusGender) form.setValue("includeCungPhi", true);
    requestAnimationFrame(() => {
      formTopRef.current?.scrollIntoView({ block: "start" });
      const target = formTopRef.current?.querySelector<HTMLElement>(focusGender ? "[role=radiogroup] button" : "input[type=date]");
      target?.focus({ preventScroll: true });
    });
  };

  if (shown) {
    const fromProfile = shown.profileId !== null && data.profiles.some((p) => p.id === shown.profileId);
    return (
      <div ref={resultRef} className="scroll-mt-20">
        {shown.savedAt && <Note className="mb-6">Kết quả đã lưu lúc {formatSavedAt(shown.savedAt)}, được tính lại từ thông tin đã lưu.</Note>}
        <BanMenhResultView result={shown.result} name={shown.values.name || undefined} onRequestCungPhi={() => backToForm(true)} />
        <ResultActions
          key={`${shown.values.birthDate}-${shown.values.gender}-${shown.savedAt}`}
          onEdit={() => backToForm()}
          alreadySaved={shown.savedAt !== null}
          onSaveHistory={() =>
            repo
              ? repo.addHistory({
                  kind: "ban-menh",
                  birthDate: shown.values.birthDate,
                  gender: shown.values.includeCungPhi ? shown.values.gender : null,
                  profileId: fromProfile ? shown.profileId : null,
                  label: shown.values.name ? `Bản mệnh – ${shown.values.name}` : "Bản mệnh",
                })
              : { ok: false, reason: "unavailable" }
          }
          profileDraft={
            fromProfile
              ? null
              : {
                  name: shown.values.name,
                  birthDate: shown.values.birthDate,
                  gender: shown.values.includeCungPhi ? shown.values.gender : null,
                }
          }
        />
      </div>
    );
  }

  const errors = form.formState.errors;

  return (
    <div ref={formTopRef} className="scroll-mt-20">
      {loadError && (
        <Note tone="warn" className="mb-5">
          {loadError}
        </Note>
      )}
      <Panel className="md:p-7">
        <form onSubmit={onSubmit} noValidate className="grid gap-5">
          <ProfilePicker
            profiles={data.profiles}
            value={profileId}
            onPick={(p) => {
              setProfileId(p?.id ?? null);
              form.reset(
                p ? { name: p.name, birthDate: p.birthDate, includeCungPhi: p.gender !== null, gender: p.gender } : EMPTY,
              );
            }}
          />
          <TextField
            label="Tên gọi (không bắt buộc)"
            placeholder="Để hiển thị trên kết quả"
            autoComplete="nickname"
            maxLength={60}
            error={errors.name?.message}
            {...form.register("name")}
          />
          <DateField
            error={errors.birthDate?.message}
            hint="Nhập ngày sinh theo dương lịch. Năm âm lịch sẽ được tính theo Tết Nguyên đán, giờ Việt Nam."
            {...form.register("birthDate", { onChange: () => setProfileIdIfEdited() })}
          />
          <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
            Không cần giờ sinh: Can Chi năm, nạp âm và cung phi chỉ phụ thuộc vào ngày sinh.
          </p>

          <div className="grid gap-4 rounded-xl border border-border p-4">
            <Controller
              control={form.control}
              name="includeCungPhi"
              render={({ field }) => (
                <div className="flex items-start gap-3">
                  <Checkbox id="xem-cung-phi" checked={field.value} onCheckedChange={(v) => field.onChange(v === true)} className="mt-0.5" />
                  <div className="grid gap-1">
                    <Label htmlFor="xem-cung-phi">Xem cả cung phi</Label>
                    <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                      Cung phi theo quy ước truyền thống tính khác nhau cho nam và nữ, nên cần thêm thông tin này.
                    </p>
                  </div>
                </div>
              )}
            />
            {includeCungPhi && (
              <Controller
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <GenderField value={field.value} onChange={field.onChange} error={errors.gender?.message} />
                )}
              />
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg">
              Xem bản mệnh
            </Button>
          </div>
          <p className="text-[0.8125rem] text-muted-foreground">
            Thông tin chỉ dùng để tính trên thiết bị của bạn và không được lưu, trừ khi bạn chọn lưu ở trang kết quả.
          </p>
        </form>
      </Panel>
    </div>
  );

  function setProfileIdIfEdited() {
    /* Khi người dùng sửa ngày sinh của hồ sơ, kết quả không còn gắn với hồ sơ đó nữa. */
    if (profileId) setProfileId(null);
  }
}
