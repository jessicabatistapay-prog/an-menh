"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { RadioChip, RadioGroup } from "@/components/ui/radio-group";
import { DateField, FieldError, GenderField, ProfilePicker } from "@/components/app/form-fields";
import { ElementDot } from "@/components/app/element-ring";
import { LoadingBlock, MISSING_ENTRY, MISSING_PROFILE, Note, Panel, Section } from "@/components/app/page-header";
import { ResultActions } from "@/components/app/result-actions";
import { useAppData } from "@/hooks/use-app-data";
import {
  type CungPhiResult,
  DIRECTIONS,
  DIRECTION_NAMES,
  type Direction,
  GROUP_NAMES,
  type HouseEvaluation,
  cungPhi,
  evaluateHouse,
} from "@/lib/core/battrach";
import { type CalendarDate, formatVietnameseDate, parseISODate } from "@/lib/core/date";
import { ELEMENTS } from "@/lib/core/elements";
import { solarToLunar } from "@/lib/core/lunar";
import { canChiOfLunarYear } from "@/lib/core/canchi";
import { SPACE_GUIDES } from "@/lib/content/spaces";
import { GENDER_LABELS, type PhongThuyForm, type PhongThuyInput, SPACE_LABELS, phongThuySchema } from "@/lib/forms";
import { formatSavedAt } from "@/lib/history";
import { type AppData, SPACE_TYPES, type SpaceType } from "@/lib/storage/schema";
import { DirectionChart } from "./direction-chart";

interface Shown {
  values: { birthDate: string; gender: "nam" | "nu"; facing: Direction; space: SpaceType };
  cung: CungPhiResult;
  birth: CalendarDate;
  lunarYear: number;
  canChi: string;
  bornBeforeTet: boolean;
  house: HouseEvaluation;
  profileId: string | null;
  savedAt: string | null;
}

const EMPTY: PhongThuyInput = { birthDate: "", gender: null, facing: "", space: "phong-khach" };

type Values = Shown["values"];

interface Initial {
  form: PhongThuyInput;
  show: { values: Values; profileId: string | null; savedAt: string | null } | null;
  profileId: string | null;
  error: string | null;
}

function compute(v: Values, pid: string | null, savedAt: string | null): Shown | string {
  const parsed = parseISODate(v.birthDate);
  if (!parsed.ok) return "Ngày sinh không hợp lệ.";
  let lunar;
  try {
    lunar = solarToLunar(parsed.date);
  } catch {
    return "Ngày sinh nằm ngoài phạm vi hỗ trợ.";
  }
  const cung = cungPhi(lunar.year, v.gender);
  return {
    values: v,
    cung,
    birth: parsed.date,
    lunarYear: lunar.year,
    canChi: canChiOfLunarYear(lunar.year).name,
    bornBeforeTet: lunar.year < parsed.date.year,
    house: evaluateHouse(cung.trigram.key, v.facing),
    profileId: pid,
    savedAt,
  };
}

function resolveInitial(params: URLSearchParams, data: AppData): Initial {
  const entryId = params.get("muc");
  const pid = params.get("ho-so");
  if (entryId) {
    const entry = data.history.find((h) => h.id === entryId);
    if (!entry || entry.kind !== "phong-thuy") return { form: EMPTY, show: null, profileId: null, error: MISSING_ENTRY };
    const values: Values = { birthDate: entry.birthDate, gender: entry.gender, facing: entry.facing as Direction, space: entry.space };
    const profileId = data.profiles.some((p) => p.id === entry.profileId) ? entry.profileId : null;
    return { form: values, show: { values, profileId, savedAt: entry.createdAt }, profileId, error: null };
  }
  if (pid) {
    const p = data.profiles.find((x) => x.id === pid);
    if (!p) return { form: EMPTY, show: null, profileId: null, error: MISSING_PROFILE };
    return { form: { ...EMPTY, birthDate: p.birthDate, gender: p.gender }, show: null, profileId: p.id, error: null };
  }
  return { form: EMPTY, show: null, profileId: null, error: null };
}

export function PhongThuyClient() {
  const params = useSearchParams();
  const { data, status } = useAppData();
  if (status === "loading" && (params.has("muc") || params.has("ho-so"))) return <LoadingBlock />;
  return <PhongThuyView key={params.toString()} initial={resolveInitial(params, data)} />;
}

function PhongThuyView({ initial }: { initial: Initial }) {
  const { data, repo } = useAppData();
  const [shown, setShown] = useState<Shown | null>(() => {
    if (!initial.show) return null;
    const r = compute(initial.show.values, initial.show.profileId, initial.show.savedAt);
    return typeof r === "string" ? null : r;
  });
  const [profileId, setProfileId] = useState<string | null>(initial.profileId);
  const [loadError, setLoadError] = useState<string | null>(initial.error);
  const topRef = useRef<HTMLDivElement>(null);

  const form = useForm<PhongThuyInput, unknown, PhongThuyForm>({
    resolver: zodResolver(phongThuySchema),
    defaultValues: initial.form,
    mode: "onTouched",
  });

  const show = (v: Values, pid: string | null) => {
    const r = compute(v, pid, null);
    if (typeof r === "string") return setLoadError(r);
    setLoadError(null);
    setShown(r);
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ block: "start" });
      topRef.current?.querySelector<HTMLElement>("#pt-title")?.focus({ preventScroll: true });
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    form.handleSubmit((v) =>
      show({ birthDate: v.birthDate, gender: v.gender as "nam" | "nu", facing: v.facing, space: v.space as SpaceType }, profileId),
    )(e);

  const errors = form.formState.errors;

  if (shown) {
    const { house, cung, values } = shown;
    const guide = SPACE_GUIDES[values.space];
    const el = ELEMENTS[cung.trigram.element];
    const good = house.chart.filter((e) => e.star.favorable);
    const profile = data.profiles.find((p) => p.id === shown.profileId);
    return (
      <div ref={topRef} className="scroll-mt-20">
        {shown.savedAt && <Note className="mb-6">Kết quả đã lưu lúc {formatSavedAt(shown.savedAt)}, được tính lại từ thông tin đã lưu.</Note>}
        <h2 id="pt-title" tabIndex={-1} className="font-display text-4xl font-semibold leading-tight text-[#f3e6c4] outline-none md:text-5xl">
          Nhà hướng {DIRECTION_NAMES[values.facing]}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {profile ? `${profile.name}, ` : ""}
          {GENDER_LABELS[values.gender].toLowerCase()} sinh {formatVietnameseDate(shown.birth)}, năm âm lịch {shown.lunarYear} ({shown.canChi}). Không gian: {SPACE_LABELS[values.space].toLowerCase()}.
        </p>
        {shown.bornBeforeTet && (
          <Note className="mt-4">Bạn sinh trước Tết nên cung phi được tính theo năm âm lịch {shown.lunarYear}.</Note>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_20rem] md:items-start">
          <div className="grid gap-5">
            <Panel>
              <p className="text-sm text-muted-foreground">Cung phi</p>
              <p className="mt-1 flex items-center gap-2 font-display text-3xl font-semibold text-[#f3e6c4]">
                <ElementDot element={cung.trigram.element} /> {cung.trigram.name}
              </p>
              <p className="mt-1">
                Hành {el.name}, thuộc <strong className="font-semibold text-[#f1e3bf]">{GROUP_NAMES[cung.trigram.group]}</strong>.
              </p>
            </Panel>
            <Panel className={house.facingStar.favorable ? "border-[#d9c38f66]" : undefined}>
              <p className="text-sm text-muted-foreground">Hướng mặt nhà so với cung phi</p>
              <p className="mt-1 font-display text-3xl font-semibold text-[#f3e6c4]">{house.facingStar.name}</p>
              <p className="mt-1">
                {house.facingStar.favorable
                  ? `Hướng ${DIRECTION_NAMES[values.facing]} nằm trong bốn hướng được xem là thuận với cung ${cung.trigram.name}.`
                  : `Hướng ${DIRECTION_NAMES[values.facing]} không nằm trong bốn hướng thuận của cung ${cung.trigram.name}.`}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{house.facingStar.traditionalMeaning}</p>
              {!house.facingStar.favorable && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Hướng nhà thường không dễ thay đổi. Theo cách làm phổ biến, người ta điều chỉnh những thứ linh hoạt hơn như hướng
                  bàn làm việc, đầu giường hay vị trí ngồi về các hướng thuận bên dưới.
                </p>
              )}
            </Panel>
            <Panel>
              <p className="text-sm text-muted-foreground">Trạch của ngôi nhà</p>
              <p className="mt-1">
                Nhà hướng {DIRECTION_NAMES[values.facing]} thì tọa (lưng nhà) {DIRECTION_NAMES[house.sitting]}, thuộc {house.houseTrigram.name} trạch,
                nhóm {house.houseTrigram.group === "dong" ? "Đông tứ trạch" : "Tây tứ trạch"}.{" "}
                {house.sameGroup
                  ? "Cùng nhóm Đông/Tây với cung phi của bạn."
                  : "Khác nhóm Đông/Tây với cung phi của bạn."}
              </p>
            </Panel>
          </div>
          <figure>
            <DirectionChart chart={house.chart} facing={values.facing} />
            <figcaption className="mt-2 text-center text-xs leading-relaxed text-muted-foreground">
              Sơ đồ tham khảo cho cung {cung.trigram.name}, không phải la bàn. Ô viền sáng là hướng nhà bạn chọn.
            </figcaption>
          </figure>
        </div>

        <Section title="Bốn hướng thuận theo Bát trạch" id="huong-thuan">
          <ul className="grid gap-2 sm:grid-cols-2">
            {good.map((e) => (
              <li key={e.star.key} className="rounded-xl border border-[#d9c38f40] px-4 py-3">
                <p className="font-medium text-[#f1e3bf]">
                  {DIRECTION_NAMES[e.direction]}: {e.star.name}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">{e.star.traditionalMeaning}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={`Gợi ý cho ${SPACE_LABELS[values.space].toLowerCase()}`} id="khong-gian">
          <div className="grid gap-6">
            <div>
              <h3 className="font-display text-xl font-semibold text-[#f1e3bf]">Theo quan niệm Bát trạch</h3>
              <p className="mt-1 leading-relaxed text-foreground/90">
                {guide.traditional} Với cung {cung.trigram.name}: Sinh Khí ở {DIRECTION_NAMES[good[0]!.direction]}, Thiên Y ở{" "}
                {DIRECTION_NAMES[good[1]!.direction]}, Diên Niên ở {DIRECTION_NAMES[good[2]!.direction]}, Phục Vị ở{" "}
                {DIRECTION_NAMES[good[3]!.direction]}.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Màu tham khảo theo hành {el.name} của quẻ {cung.trigram.name}: {el.colors.join(", ")}.
              </p>
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-[#f1e3bf]">Lời khuyên thực tế cho không gian sống</h3>
              <p className="mt-1 text-sm text-muted-foreground">Áp dụng được cho mọi hướng nhà, không phụ thuộc cung phi.</p>
              <dl className="mt-3 grid gap-4 md:grid-cols-3">
                {(
                  [
                    ["Ánh sáng", guide.light],
                    ["Thông gió", guide.ventilation],
                    ["Bố trí", guide.layout],
                  ] as const
                ).map(([title, items]) => (
                  <div key={title}>
                    <dt className="font-medium text-[#f1e3bf]">{title}</dt>
                    <dd>
                      <ul className="mt-1 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground/90 marker:text-primary">
                        {items.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Section>

        <Note className="mt-8">
          Quy ước dùng ở đây: cung phi tính theo năm âm lịch (chuyển năm tại Tết Nguyên đán); hướng nhà là hướng mặt nhà, tức hướng bạn nhìn
          thấy khi đứng trong nhà nhìn ra cửa chính. Hãy xác định hướng bằng la bàn thật, vì ứng dụng không đọc cảm biến của thiết bị. Bát
          trạch là quan niệm truyền thống; một hướng nhà không quyết định sức khỏe, tài chính hay hạnh phúc gia đình.
        </Note>

        <ResultActions
          key={`${values.birthDate}-${values.gender}-${values.facing}-${values.space}-${shown.savedAt}`}
          alreadySaved={shown.savedAt !== null}
          onEdit={() => setShown(null)}
          onSaveHistory={() =>
            repo
              ? repo.addHistory({
                  kind: "phong-thuy",
                  birthDate: values.birthDate,
                  gender: values.gender,
                  facing: values.facing,
                  space: values.space,
                  profileId: profile ? profile.id : null,
                  label: profile ? `Phong thủy – ${profile.name}` : "Phong thủy nhà ở",
                })
              : { ok: false, reason: "unavailable" }
          }
          profileDraft={profile ? null : { name: "", birthDate: values.birthDate, gender: values.gender }}
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
        <form onSubmit={onSubmit} noValidate className="grid gap-6">
          <ProfilePicker
            profiles={data.profiles}
            value={profileId}
            onPick={(p) => {
              setProfileId(p?.id ?? null);
              const cur = form.getValues();
              form.reset({ ...cur, birthDate: p?.birthDate ?? "", gender: p?.gender ?? null });
            }}
          />
          <DateField
            error={errors.birthDate?.message}
            {...form.register("birthDate", { onChange: () => profileId && setProfileId(null) })}
          />
          <Controller
            control={form.control}
            name="gender"
            render={({ field }) => (
              <GenderField
                value={field.value}
                onChange={(v) => {
                  field.onChange(v);
                  if (profileId) setProfileId(null);
                }}
                error={errors.gender?.message}
                hint="Cung phi theo quy ước truyền thống tính khác nhau cho nam và nữ cùng năm sinh."
              />
            )}
          />
          <Controller
            control={form.control}
            name="facing"
            render={({ field }) => (
              <div className="grid gap-2">
                <span id="huong-label" className="text-sm font-medium">
                  Hướng nhà (hướng mặt nhà)
                </span>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-labelledby="huong-label"
                  aria-describedby="huong-hint"
                  className="grid-cols-4"
                >
                  {DIRECTIONS.map((d) => (
                    <RadioChip key={d} value={d} className="px-1 text-[0.8125rem]">
                      {DIRECTION_NAMES[d]}
                    </RadioChip>
                  ))}
                </RadioGroup>
                <p id="huong-hint" className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                  Đứng trong nhà, nhìn thẳng ra cửa chính và đo bằng la bàn: đó là hướng nhà.
                </p>
                <FieldError id="huong-err" message={errors.facing?.message} />
              </div>
            )}
          />
          <Controller
            control={form.control}
            name="space"
            render={({ field }) => (
              <div className="grid gap-2">
                <span id="khong-gian-label" className="text-sm font-medium">
                  Không gian muốn bố trí
                </span>
                <RadioGroup value={field.value} onValueChange={field.onChange} aria-labelledby="khong-gian-label" className="grid-cols-3">
                  {SPACE_TYPES.map((s) => (
                    <RadioChip key={s} value={s} className="px-1 text-[0.8125rem]">
                      {SPACE_LABELS[s]}
                    </RadioChip>
                  ))}
                </RadioGroup>
                <FieldError id="kg-err" message={errors.space?.message} />
              </div>
            )}
          />
          <div>
            <Button type="submit" size="lg">
              Xem gợi ý phong thủy
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
