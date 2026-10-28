"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { DateField, ProfilePicker } from "@/components/app/form-fields";
import { LoadingBlock, MISSING_ENTRY, MISSING_PROFILE, Note, Panel, Section } from "@/components/app/page-header";
import { ResultActions } from "@/components/app/result-actions";
import { useAppData } from "@/hooks/use-app-data";
import { type CalendarDate, formatVietnameseDate, parseISODate } from "@/lib/core/date";
import { LIFE_PATH_MEANINGS, type LifePathResult, lifePathNumber } from "@/lib/core/numerology";
import { type ThanSoForm, thanSoSchema } from "@/lib/forms";
import { formatSavedAt } from "@/lib/history";
import type { AppData } from "@/lib/storage/schema";

interface Shown {
  birthDate: string;
  birth: CalendarDate;
  result: LifePathResult;
  profileId: string | null;
  savedAt: string | null;
}

interface Initial {
  birthDate: string;
  profileId: string | null;
  show: { savedAt: string | null } | null;
  error: string | null;
}

function compute(birthDate: string, profileId: string | null, savedAt: string | null): Shown | null {
  const parsed = parseISODate(birthDate);
  if (!parsed.ok) return null;
  return { birthDate, birth: parsed.date, result: lifePathNumber(parsed.date), profileId, savedAt };
}

function resolveInitial(params: URLSearchParams, data: AppData): Initial {
  const entryId = params.get("muc");
  const pid = params.get("ho-so");
  if (entryId) {
    const entry = data.history.find((h) => h.id === entryId);
    if (!entry || entry.kind !== "than-so") return { birthDate: "", profileId: null, show: null, error: MISSING_ENTRY };
    const profileId = data.profiles.some((p) => p.id === entry.profileId) ? entry.profileId : null;
    return { birthDate: entry.birthDate, profileId, show: { savedAt: entry.createdAt }, error: null };
  }
  if (pid) {
    const p = data.profiles.find((x) => x.id === pid);
    if (!p) return { birthDate: "", profileId: null, show: null, error: MISSING_PROFILE };
    return { birthDate: p.birthDate, profileId: p.id, show: { savedAt: null }, error: null };
  }
  return { birthDate: "", profileId: null, show: null, error: null };
}

export function ThanSoClient() {
  const params = useSearchParams();
  const { data, status } = useAppData();
  if (status === "loading" && (params.has("muc") || params.has("ho-so"))) return <LoadingBlock />;
  return <ThanSoView key={params.toString()} initial={resolveInitial(params, data)} />;
}

function ThanSoView({ initial }: { initial: Initial }) {
  const { data, repo } = useAppData();
  const [shown, setShown] = useState<Shown | null>(() =>
    initial.show ? compute(initial.birthDate, initial.profileId, initial.show.savedAt) : null,
  );
  const [profileId, setProfileId] = useState<string | null>(initial.profileId);
  const [loadError, setLoadError] = useState<string | null>(initial.error);
  const topRef = useRef<HTMLDivElement>(null);
  const form = useForm<ThanSoForm>({
    resolver: zodResolver(thanSoSchema),
    defaultValues: { birthDate: initial.birthDate },
    mode: "onTouched",
  });

  const show = (birthDate: string, pid: string | null) => {
    const r = compute(birthDate, pid, null);
    if (!r) return;
    setLoadError(null);
    setShown(r);
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ block: "start" });
      topRef.current?.querySelector<HTMLElement>("#ts-title")?.focus({ preventScroll: true });
    });
  };

  if (shown) {
    const { result } = shown;
    const meaning = LIFE_PATH_MEANINGS[result.number]!;
    const profile = data.profiles.find((p) => p.id === shown.profileId);
    return (
      <div ref={topRef} className="scroll-mt-20">
        {shown.savedAt && <Note className="mb-6">Kết quả đã lưu lúc {formatSavedAt(shown.savedAt)}, được tính lại từ ngày sinh đã lưu.</Note>}
        <div className="flex items-end gap-5">
          <span
            className="font-display text-[6.5rem] font-semibold leading-[0.8] text-[#e7d3a2] md:text-[8rem]"
            aria-hidden
          >
            {result.number}
          </span>
          <div className="pb-1">
            <p className="text-sm text-muted-foreground">
              Số chủ đạo{profile ? ` của ${profile.name}` : ""}, sinh {formatVietnameseDate(shown.birth)}
            </p>
            <h2 id="ts-title" tabIndex={-1} className="font-display text-3xl font-semibold leading-tight text-[#f3e6c4] outline-none md:text-4xl">
              <span className="sr-only">Số chủ đạo {result.number}: </span>
              {meaning.title}
            </h2>
          </div>
        </div>
        <p className="mt-4 text-muted-foreground">Từ khóa gợi ý: {meaning.keywords.join(", ")}.</p>

        <Section title="Cách tính" id="cach-tinh">
          <ol className="grid gap-2">
            {result.steps.map((s, i) => (
              <li key={i} className="rounded-xl border border-border bg-[#15213a99] px-4 py-3">
                <span className="text-sm text-muted-foreground">Bước {i + 1}</span>
                <p className="mt-0.5 font-medium tabular-nums">
                  {s.expression} = <span className="text-[#f1e3bf]">{s.result}</span>
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {result.isMaster
              ? `${result.number} là số đặc biệt nên được giữ nguyên, không rút gọn tiếp.`
              : "Cộng tiếp các chữ số đến khi còn một chữ số từ 1 đến 9."}{" "}
            Quy tắc: cộng tất cả chữ số của ngày sinh dạng DD MM YYYY; nếu tổng (hoặc một bước rút gọn) là 11, 22 hoặc 33 thì giữ nguyên.
            Một số trường phái khác rút gọn riêng ngày, tháng, năm trước khi cộng nên có thể ra số khác.
          </p>
        </Section>

        <Section title="Điểm mạnh" id="diem-manh">
          <ul className="list-disc space-y-1.5 pl-5 marker:text-primary">
            {meaning.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Section>
        <Section title="Xu hướng cần cân bằng" id="can-bang">
          <ul className="list-disc space-y-1.5 pl-5 marker:text-primary">
            {meaning.balance.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Section>
        <Section title="Câu hỏi tự suy ngẫm" id="suy-ngam">
          <ul className="grid gap-3">
            {meaning.reflection.map((q) => (
              <li key={q} className="border-l-2 border-primary pl-4 font-display text-xl italic leading-snug text-[#e7d3a2]">
                {q}
              </li>
            ))}
          </ul>
        </Section>
        <Note className="mt-8">
          Thần số học là một hệ thống biểu tượng hiện đại, không có cơ sở khoa học. Diễn giải do An Mệnh biên soạn để gợi mở suy ngẫm, không
          mô tả chắc chắn tính cách hay tương lai.
        </Note>
        <ResultActions
          key={`${shown.birthDate}-${shown.savedAt}`}
          alreadySaved={shown.savedAt !== null}
          onEdit={() => setShown(null)}
          onSaveHistory={() =>
            repo
              ? repo.addHistory({
                  kind: "than-so",
                  birthDate: shown.birthDate,
                  profileId: profile ? profile.id : null,
                  label: `Số chủ đạo ${result.number}${profile ? ` – ${profile.name}` : ""}`,
                })
              : { ok: false, reason: "unavailable" }
          }
          profileDraft={profile ? null : { name: "", birthDate: shown.birthDate, gender: null }}
        />
      </div>
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-20">
      {loadError && (
        <Note tone="warn" className="mb-5">
          {loadError}
        </Note>
      )}
      <Panel className="md:p-7">
        <form
          noValidate
          className="grid gap-5"
          onSubmit={(e) => form.handleSubmit((v) => show(v.birthDate, profileId))(e)}
        >
          <ProfilePicker
            profiles={data.profiles}
            value={profileId}
            onPick={(p) => {
              setProfileId(p?.id ?? null);
              form.reset({ birthDate: p?.birthDate ?? "" });
            }}
          />
          <DateField
            error={form.formState.errors.birthDate?.message}
            {...form.register("birthDate", { onChange: () => profileId && setProfileId(null) })}
          />
          <div>
            <Button type="submit" size="lg">
              Tính số chủ đạo
            </Button>
          </div>
        </form>
      </Panel>
      <details className="mt-6 rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground">
        <summary className="cursor-pointer font-medium text-foreground">Vì sao chưa có chỉ số theo tên?</summary>
        <p className="mt-2 leading-relaxed">
          Các chỉ số theo tên cần quy tắc chuyển chữ tiếng Việt có dấu (ă, â, đ, ơ, ư và các thanh điệu) sang số. Hiện chưa có quy ước
          thống nhất, nên An Mệnh chưa triển khai để tránh đưa ra con số thiếu căn cứ.
        </p>
      </details>
    </div>
  );
}
