"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Controller, useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { RadioChip, RadioGroup } from "@/components/ui/radio-group";
import { DateField, ProfilePicker, TextField } from "@/components/app/form-fields";
import { ElementDot } from "@/components/app/element-ring";
import { LoadingBlock, MISSING_ENTRY, Note, Panel, Section } from "@/components/app/page-header";
import { ResultActions } from "@/components/app/result-actions";
import { useAppData } from "@/hooks/use-app-data";
import { GROUP_NAMES } from "@/lib/core/battrach";
import { type CompatResult, type PersonInfo, computeCompat } from "@/lib/core/compat";
import { formatVietnameseDate, parseISODate } from "@/lib/core/date";
import { ELEMENTS } from "@/lib/core/elements";
import { type HopTuoiForm, hopTuoiSchema } from "@/lib/forms";
import { formatSavedAt } from "@/lib/history";
import type { AppData, Profile } from "@/lib/storage/schema";

const EMPTY: HopTuoiForm = { nameA: "", birthDateA: "", genderA: null, nameB: "", birthDateB: "", genderB: null };

interface Shown {
  values: HopTuoiForm;
  result: CompatResult;
  savedAt: string | null;
}

function compute(values: HopTuoiForm, savedAt: string | null): Shown | string {
  const a = parseISODate(values.birthDateA);
  const b = parseISODate(values.birthDateB);
  if (!a.ok || !b.ok) return "Ngày sinh không hợp lệ.";
  const r = computeCompat(
    { name: values.nameA, birthDate: a.date, gender: values.genderA },
    { name: values.nameB, birthDate: b.date, gender: values.genderB },
  );
  if (!r.ok) return r.error === "out-of-range" ? "Ngày sinh nằm ngoài phạm vi hỗ trợ." : "Ngày sinh không hợp lệ.";
  return { values, result: r.result, savedAt };
}

interface Initial {
  values: HopTuoiForm;
  shown: Shown | null;
  error: string | null;
}

function resolveInitial(params: URLSearchParams, data: AppData): Initial {
  const id = params.get("muc");
  if (!id) return { values: EMPTY, shown: null, error: null };
  const entry = data.history.find((h) => h.id === id);
  if (!entry || entry.kind !== "hop-tuoi") return { values: EMPTY, shown: null, error: MISSING_ENTRY };
  const values: HopTuoiForm = {
    nameA: entry.nameA,
    birthDateA: entry.birthDateA,
    genderA: entry.genderA,
    nameB: entry.nameB,
    birthDateB: entry.birthDateB,
    genderB: entry.genderB,
  };
  const r = compute(values, entry.createdAt);
  return { values, shown: typeof r === "string" ? null : r, error: typeof r === "string" ? r : null };
}

export function HopTuoiClient() {
  const params = useSearchParams();
  const { data, status } = useAppData();
  if (status === "loading" && params.has("muc")) return <LoadingBlock />;
  return <HopTuoiView key={params.toString()} initial={resolveInitial(params, data)} />;
}

function PersonFields({
  form,
  who,
  title,
  profiles,
}: {
  form: UseFormReturn<HopTuoiForm>;
  who: "A" | "B";
  title: string;
  profiles: Profile[];
}) {
  const [pid, setPid] = useState<string | null>(null);
  const errors = form.formState.errors;
  const nameKey = `name${who}` as const;
  const dateKey = `birthDate${who}` as const;
  const genderKey = `gender${who}` as const;
  return (
    <fieldset className="grid gap-4 rounded-xl border border-border p-4">
      <legend className="px-1 font-display text-xl font-semibold text-[#f1e3bf]">{title}</legend>
      <ProfilePicker
        profiles={profiles}
        value={pid}
        onPick={(p) => {
          setPid(p?.id ?? null);
          form.setValue(nameKey, p?.name ?? "");
          form.setValue(dateKey, p?.birthDate ?? "", { shouldValidate: !!p });
          form.setValue(genderKey, p?.gender ?? null);
        }}
      />
      <TextField label="Tên gọi (không bắt buộc)" maxLength={60} error={errors[nameKey]?.message} {...form.register(nameKey)} />
      <DateField error={errors[dateKey]?.message} {...form.register(dateKey, { onChange: () => setPid(null) })} />
      <Controller
        control={form.control}
        name={genderKey}
        render={({ field }) => (
          <div className="grid gap-2">
            <span id={`gt-${who}`} className="text-sm font-medium">
              Giới tính theo quy ước cung phi (không bắt buộc)
            </span>
            <RadioGroup
              value={field.value ?? "khong"}
              onValueChange={(v) => field.onChange(v === "khong" ? null : v)}
              aria-labelledby={`gt-${who}`}
              className="grid-cols-3"
            >
              <RadioChip value="khong">Bỏ qua</RadioChip>
              <RadioChip value="nam">Nam</RadioChip>
              <RadioChip value="nu">Nữ</RadioChip>
            </RadioGroup>
          </div>
        )}
      />
    </fieldset>
  );
}

function PersonCard({ p }: { p: PersonInfo }) {
  return (
    <div className="rounded-xl border border-border bg-[#15213a99] p-4">
      <p className="truncate font-display text-2xl font-semibold text-[#f3e6c4]">{p.name}</p>
      <p className="text-sm text-muted-foreground">Sinh {formatVietnameseDate(p.birthDate)}, năm âm lịch {p.lunarYear}</p>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        <dt className="text-muted-foreground">Can Chi</dt>
        <dd>
          {p.canChi.name} (con {p.zodiac.toLowerCase()})
        </dd>
        <dt className="text-muted-foreground">Nạp âm</dt>
        <dd className="flex items-center gap-2">
          <ElementDot element={p.napAm.element} /> {p.napAm.name}
        </dd>
        <dt className="text-muted-foreground">Cung phi</dt>
        <dd>{p.cungPhi ? `${p.cungPhi.trigram.name}, ${GROUP_NAMES[p.cungPhi.trigram.group]}` : "Chưa chọn giới tính"}</dd>
      </dl>
    </div>
  );
}

function HopTuoiView({ initial }: { initial: Initial }) {
  const { data, repo } = useAppData();
  const [shown, setShown] = useState<Shown | null>(initial.shown);
  const [error, setError] = useState<string | null>(initial.error);
  const topRef = useRef<HTMLDivElement>(null);
  const form = useForm<HopTuoiForm>({ resolver: zodResolver(hopTuoiSchema), defaultValues: initial.values, mode: "onTouched" });

  const submit = (e: React.FormEvent<HTMLFormElement>) =>
    form.handleSubmit((values) => {
      const r = compute(values, null);
      if (typeof r === "string") return setError(r);
      setError(null);
      setShown(r);
      requestAnimationFrame(() => {
        topRef.current?.scrollIntoView({ block: "start" });
        topRef.current?.querySelector<HTMLElement>("#ht-title")?.focus({ preventScroll: true });
      });
    })(e);

  if (shown) {
    const { result: r, values } = shown;
    return (
      <div ref={topRef} className="scroll-mt-20">
        {shown.savedAt && <Note className="mb-6">Kết quả đã lưu lúc {formatSavedAt(shown.savedAt)}, được tính lại từ thông tin đã lưu.</Note>}
        <h2 id="ht-title" tabIndex={-1} className="font-display text-4xl font-semibold leading-tight text-[#f3e6c4] outline-none md:text-5xl">
          {r.a.zodiac} và {r.b.zodiac}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {r.a.canChi.name} và {r.b.canChi.name}, theo năm âm lịch tính từ Tết Nguyên đán.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <PersonCard p={r.a} />
          <PersonCard p={r.b} />
        </div>

        <Section title={`Địa Chi: ${r.branch.title}`} id="dia-chi">
          <p className="leading-relaxed text-foreground/90">{r.branch.text}</p>
        </Section>
        <Section title={`Ngũ hành nạp âm: ${r.element.title}`} id="nap-am">
          <p className="leading-relaxed text-foreground/90">
            {r.a.name}: {r.a.napAm.name} (hành {ELEMENTS[r.a.napAm.element].name}). {r.b.name}: {r.b.napAm.name} (hành{" "}
            {ELEMENTS[r.b.napAm.element].name}). {r.element.text}
          </p>
        </Section>
        <Section title="Thiên Can" id="thien-can">
          <p className="leading-relaxed text-foreground/90">{r.stem.text}</p>
        </Section>
        <Section title="Nhóm Bát trạch" id="bat-trach">
          {r.group ? (
            <p className="leading-relaxed text-foreground/90">{r.group.text}</p>
          ) : (
            <p className="leading-relaxed text-muted-foreground">
              Cần chọn giới tính cho cả hai người để biết cung phi và nhóm Đông/Tây tứ mệnh.
            </p>
          )}
        </Section>

        <Note className="mt-8">
          An Mệnh không chấm điểm hay kết luận hai người hợp hay không hợp. Các quan hệ trên chỉ là quan niệm truyền thống, mỗi trường phái
          có cách luận khác nhau; một mối quan hệ được vun đắp bởi cách hai người đối xử với nhau.
        </Note>

        <ResultActions
          key={`${values.birthDateA}-${values.birthDateB}-${values.genderA}-${values.genderB}-${shown.savedAt}`}
          alreadySaved={shown.savedAt !== null}
          onEdit={() => setShown(null)}
          onSaveHistory={() =>
            repo
              ? repo.addHistory({
                  kind: "hop-tuoi",
                  nameA: values.nameA.trim(),
                  birthDateA: values.birthDateA,
                  genderA: values.genderA,
                  nameB: values.nameB.trim(),
                  birthDateB: values.birthDateB,
                  genderB: values.genderB,
                  profileId: null,
                  label:
                    values.nameA.trim() || values.nameB.trim()
                      ? `Xem tuổi – ${values.nameA.trim() || "Người thứ nhất"} và ${values.nameB.trim() || "Người thứ hai"}`
                      : `Xem tuổi ${r.a.zodiac} và ${r.b.zodiac}`,
                })
              : { ok: false, reason: "unavailable" }
          }
        />
      </div>
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-20">
      {error && (
        <Note tone="warn" className="mb-5">
          {error}
        </Note>
      )}
      <Panel className="md:p-7">
        <form noValidate onSubmit={submit} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <PersonFields form={form} who="A" title="Người thứ nhất" profiles={data.profiles} />
            <PersonFields form={form} who="B" title="Người thứ hai" profiles={data.profiles} />
          </div>
          <div>
            <Button type="submit" size="lg">
              Xem quan hệ tuổi
            </Button>
          </div>
          <p className="text-[0.8125rem] text-muted-foreground">Thông tin chỉ dùng để tính trên thiết bị của bạn, trừ khi bạn chọn lưu kết quả.</p>
        </form>
      </Panel>
    </div>
  );
}
