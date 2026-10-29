"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateField, GenderField, ProfilePicker, SelectField, TextField } from "@/components/app/form-fields";
import { LoadingBlock, MISSING_ENTRY, Note, Panel, Section } from "@/components/app/page-header";
import { ResultActions } from "@/components/app/result-actions";
import { useAppData } from "@/hooks/use-app-data";
import { MAJOR_STAR_TEXT, MINOR_STAR_TEXT, MUTAGEN_TEXT, PALACE_TEXT } from "@/lib/content/tuvi-text";
import { type CalendarDate, formatVietnameseDate, parseISODate } from "@/lib/core/date";
import { type LunarDate, lunarMonthName, solarToLunar } from "@/lib/core/lunar";
import { HOUR_LABELS, type Palace, type TuViChart, buildChart } from "@/lib/core/tuvi";
import { MESSAGES, birthDateField, nameField } from "@/lib/forms";
import { formatSavedAt } from "@/lib/history";
import type { AppData } from "@/lib/storage/schema";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: nameField,
  birthDate: birthDateField,
  hour: z.string().refine((v) => /^(\d|1[01])$/.test(v), "Vui lòng chọn giờ sinh."),
  gender: z
    .enum(["nam", "nu"])
    .nullable()
    .refine((v) => v !== null, MESSAGES.genderRequired),
});
type FormIn = z.input<typeof schema>;
type FormOut = z.output<typeof schema>;

interface Shown {
  name: string;
  birthDate: string;
  birth: CalendarDate;
  hour: number;
  gender: "nam" | "nu";
  lunar: LunarDate;
  chart: TuViChart;
  savedAt: string | null;
}

function compute(name: string, birthDate: string, hour: number, gender: "nam" | "nu", savedAt: string | null): Shown | string {
  const r = parseISODate(birthDate);
  if (!r.ok) return "Ngày sinh không hợp lệ.";
  let lunar: LunarDate;
  try {
    lunar = solarToLunar(r.date);
  } catch {
    return "Ngày sinh nằm ngoài phạm vi hỗ trợ.";
  }
  const chart = buildChart({ lunarYear: lunar.year, lunarMonth: lunar.month, lunarDay: lunar.day, hour, gender });
  return { name, birthDate, birth: r.date, hour, gender, lunar, chart, savedAt };
}

interface Initial {
  form: FormIn;
  shown: Shown | null;
  error: string | null;
}

const EMPTY: FormIn = { name: "", birthDate: "", hour: "", gender: null };

function resolveInitial(params: URLSearchParams, data: AppData): Initial {
  const id = params.get("muc");
  const pid = params.get("ho-so");
  if (id) {
    const e = data.history.find((h) => h.id === id);
    if (!e || e.kind !== "la-so") return { form: EMPTY, shown: null, error: MISSING_ENTRY };
    const r = compute(e.name, e.birthDate, e.hour, e.gender, e.createdAt);
    return {
      form: { name: e.name, birthDate: e.birthDate, hour: String(e.hour), gender: e.gender },
      shown: typeof r === "string" ? null : r,
      error: typeof r === "string" ? r : null,
    };
  }
  if (pid) {
    const p = data.profiles.find((x) => x.id === pid);
    if (!p) return { form: EMPTY, shown: null, error: "Không tìm thấy hồ sơ này trên trình duyệt. Có thể nó đã bị xóa." };
    return { form: { ...EMPTY, name: p.name, birthDate: p.birthDate, gender: p.gender }, shown: null, error: null };
  }
  return { form: EMPTY, shown: null, error: null };
}

export function LaSoClient() {
  const params = useSearchParams();
  const { data, status } = useAppData();
  if (status === "loading" && (params.has("muc") || params.has("ho-so"))) return <LoadingBlock />;
  return <LaSoView key={params.toString()} initial={resolveInitial(params, data)} />;
}

/** Vị trí 12 cung trên lưới 4×4 truyền thống: Tỵ Ngọ Mùi Thân ở trên, Dần Sửu Tý Hợi ở dưới. */
const GRID: Record<number, [number, number]> = {
  5: [1, 1], 6: [1, 2], 7: [1, 3], 8: [1, 4],
  4: [2, 1], 9: [2, 4],
  3: [3, 1], 10: [3, 4],
  2: [4, 1], 1: [4, 2], 0: [4, 3], 11: [4, 4],
};

function StarLine({ p }: { p: Palace }) {
  const majors = p.stars.filter((s) => s.kind === "chinh");
  const minors = p.stars.filter((s) => s.kind === "phu");
  return (
    <>
      {majors.length === 0 && <span className="block text-[0.65rem] italic text-muted-foreground sm:text-xs">Vô chính diệu</span>}
      {majors.map((s) => (
        <span key={s.name} className="block text-[0.7rem] font-semibold leading-tight text-[#f3e4bd] sm:text-[0.8rem]">
          {s.name}
          {s.mutagen && <span className="ml-0.5 rounded bg-[#d9c38f33] px-0.5 text-[0.6rem] text-primary sm:text-[0.65rem]">{s.mutagen}</span>}
        </span>
      ))}
      {minors.map((s) => (
        <span key={s.name} className="block text-[0.62rem] leading-tight text-foreground/75 sm:text-[0.72rem]">
          {s.name}
          {s.mutagen && <span className="ml-0.5 text-primary">{s.mutagen}</span>}
        </span>
      ))}
    </>
  );
}

function ChartGrid({ chart, selected, onSelect, shown }: { chart: TuViChart; selected: number; onSelect: (b: number) => void; shown: Shown }) {
  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-px overflow-hidden rounded-xl border border-[#d9c38f40] bg-[#d9c38f30]" role="group" aria-label="Lá số 12 cung">
      {chart.palaces.map((p) => {
        const [r, c] = GRID[p.branch]!;
        return (
          <button
            key={p.branch}
            type="button"
            onClick={() => onSelect(p.branch)}
            aria-pressed={selected === p.branch}
            aria-label={`Cung ${p.name} tại ${p.branchName}: ${p.stars.map((s) => s.name + (s.mutagen ? ` hóa ${s.mutagen}` : "")).join(", ") || "vô chính diệu"}`}
            style={{ gridRow: r, gridColumn: c }}
            className={cn(
              "flex min-h-32 flex-col bg-[#121c31] p-1.5 text-left align-top transition-colors hover:bg-[#182540] sm:min-h-40 sm:p-2",
              selected === p.branch && "bg-[#1d2c4d] outline outline-1 -outline-offset-1 outline-primary",
            )}
          >
            <span className="flex items-start justify-between gap-1">
              <span className={cn("text-[0.68rem] font-semibold leading-tight sm:text-xs", p.name === "Mệnh" ? "text-primary" : "text-[#c9cfdb]")}>
                {p.name}
                {p.isBody && <span className="ml-1 rounded bg-primary px-1 text-[0.55rem] text-primary-foreground">Thân</span>}
              </span>
            </span>
            <span className="text-[0.6rem] text-muted-foreground sm:text-[0.68rem]">
              {p.stemName} {p.branchName}
            </span>
            <span className="mt-1 flex-1">
              <StarLine p={p} />
            </span>
            <span className="mt-1 flex items-end justify-between gap-1 text-[0.58rem] text-muted-foreground sm:text-[0.65rem]">
              <span>{p.changSheng}</span>
              <span className="tabular-nums">{p.decade[0]}</span>
            </span>
            {(p.tuan || p.triet) && (
              <span className="text-[0.58rem] text-[#e3a28f] sm:text-[0.65rem]">{[p.tuan && "Tuần", p.triet && "Triệt"].filter(Boolean).join(", ")}</span>
            )}
          </button>
        );
      })}
      <div style={{ gridRow: "2 / span 2", gridColumn: "2 / span 2" }} className="flex flex-col justify-center gap-1 bg-[#0f1829] p-2 text-center sm:p-4">
        <p className="font-display text-base font-semibold leading-tight text-[#f3e6c4] sm:text-2xl">{shown.name || "Lá số tử vi"}</p>
        <p className="text-[0.62rem] text-muted-foreground sm:text-xs">
          {formatVietnameseDate(shown.birth)}, giờ {HOUR_LABELS[shown.hour]!.split(" ")[0]}
        </p>
        <p className="text-[0.62rem] sm:text-xs">
          Âm lịch {shown.lunar.day}/{shown.lunar.month}
          {shown.lunar.isLeapMonth ? " nhuận" : ""} năm {chart.yearCanChi}
        </p>
        <p className="text-[0.62rem] text-[#e7d3a2] sm:text-xs">
          {chart.yinYangGender}, {chart.bureau.name}
        </p>
        <p className="hidden text-xs text-muted-foreground sm:block">
          Mệnh chủ {chart.soulMaster}, Thân chủ {chart.bodyMaster}
        </p>
      </div>
    </div>
  );
}

function PalaceDetail({ p }: { p: Palace }) {
  return (
    <div className="rounded-2xl border border-[#d9c38f40] bg-[#15213acc] p-5" aria-live="polite">
      <p className="text-sm text-muted-foreground">
        {p.stemName} {p.branchName}, đại hạn {p.decade[0]}–{p.decade[1]} tuổi, {p.changSheng}
        {p.tuan ? ", có Tuần" : ""}
        {p.triet ? ", có Triệt" : ""}
      </p>
      <h3 className="mt-1 font-display text-2xl font-semibold text-[#f3e6c4]">
        Cung {p.name}
        {p.isBody ? " (Thân cư)" : ""}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{PALACE_TEXT[p.name]}</p>
      <ul className="mt-3 grid gap-2">
        {p.stars.length === 0 && (
          <li className="text-sm">Cung vô chính diệu: không có chính tinh; theo cách luận thường gặp, xem thêm các sao ở cung đối diện.</li>
        )}
        {p.stars.map((s) => (
          <li key={s.name} className="text-sm leading-relaxed">
            <span className={cn("font-medium", s.kind === "chinh" ? "text-[#f1e3bf]" : "text-foreground")}>{s.name}</span>
            {s.kind === "chinh" ? (
              <>
                {" "}
                – {MAJOR_STAR_TEXT[s.name]!.keyword}. {MAJOR_STAR_TEXT[s.name]!.text}
              </>
            ) : (
              <> – {MINOR_STAR_TEXT[s.name]}</>
            )}
            {s.mutagen && <span className="block text-primary">{MUTAGEN_TEXT[s.mutagen]}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LaSoView({ initial }: { initial: Initial }) {
  const { data, repo } = useAppData();
  const [shown, setShown] = useState<Shown | null>(initial.shown);
  const [error, setError] = useState<string | null>(initial.error);
  const [selected, setSelected] = useState<number>(initial.shown?.chart.menhBranch ?? 0);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [pid, setPid] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const form = useForm<FormIn, unknown, FormOut>({ resolver: zodResolver(schema), defaultValues: initial.form, mode: "onTouched" });
  const errors = form.formState.errors;

  const submit = (e: React.FormEvent<HTMLFormElement>) =>
    form.handleSubmit((v) => {
      const r = compute(v.name.trim(), v.birthDate, Number(v.hour), v.gender as "nam" | "nu", null);
      if (typeof r === "string") return setError(r);
      setError(null);
      setShown(r);
      setSelected(r.chart.menhBranch);
      requestAnimationFrame(() => {
        topRef.current?.scrollIntoView({ block: "start" });
        topRef.current?.querySelector<HTMLElement>("#ls-title")?.focus({ preventScroll: true });
      });
    })(e);

  if (shown) {
    const { chart } = shown;
    const menh = chart.palaces[chart.menhBranch]!;
    const menhMajors = menh.stars.filter((s) => s.kind === "chinh");
    const opposite = chart.palaces[(chart.menhBranch + 6) % 12]!;
    const borrowed = opposite.stars.filter((s) => s.kind === "chinh");
    const keyPalaces = ["Quan Lộc", "Tài Bạch", "Phu Thê", "Phúc Đức"].map((n) => chart.palaces.find((p) => p.name === n)!);
    const ordered = Array.from({ length: 12 }, (_, i) => chart.palaces.find((p) => p.name === ["Mệnh", "Phụ Mẫu", "Phúc Đức", "Điền Trạch", "Quan Lộc", "Nô Bộc", "Thiên Di", "Tật Ách", "Tài Bạch", "Tử Tức", "Phu Thê", "Huynh Đệ"][i])!);
    const profile = data.profiles.find((p) => p.birthDate === shown.birthDate && p.name === shown.name);

    return (
      <div ref={topRef} className="scroll-mt-20">
        {shown.savedAt && <Note className="mb-6">Lá số đã lưu lúc {formatSavedAt(shown.savedAt)}, được lập lại từ thông tin đã lưu.</Note>}
        <h2 id="ls-title" tabIndex={-1} className="font-display text-4xl font-semibold leading-tight text-[#f3e6c4] outline-none md:text-5xl">
          {shown.name ? `Lá số của ${shown.name}` : "Lá số tử vi"}
        </h2>
        <p className="mt-2 text-muted-foreground">
          Sinh {formatVietnameseDate(shown.birth)} giờ {HOUR_LABELS[shown.hour]}, tức ngày {shown.lunar.day}{" "}
          {lunarMonthName(shown.lunar.month, shown.lunar.isLeapMonth)} năm {chart.yearCanChi} âm lịch. {chart.yinYangGender}, {chart.bureau.name}, mệnh nạp âm{" "}
          {chart.menhNapAm} tại cung Mệnh.
        </p>
        {shown.lunar.isLeapMonth && (
          <Note className="mt-4">Bạn sinh vào tháng nhuận; An Mệnh an sao theo tháng {shown.lunar.month} chính (một số trường phái chia đôi tháng nhuận).</Note>
        )}

        <div className="mt-6 flex justify-end gap-2" role="group" aria-label="Cách hiển thị lá số">
          <Button size="sm" variant={view === "grid" ? "secondary" : "ghost"} aria-pressed={view === "grid"} onClick={() => setView("grid")}>
            <LayoutGrid aria-hidden /> Lá số
          </Button>
          <Button size="sm" variant={view === "list" ? "secondary" : "ghost"} aria-pressed={view === "list"} onClick={() => setView("list")}>
            <List aria-hidden /> Danh sách
          </Button>
        </div>

        {view === "grid" ? (
          <div className="mt-3 grid gap-5 lg:grid-cols-[1fr_20rem] lg:items-start">
            <ChartGrid chart={chart} selected={selected} onSelect={setSelected} shown={shown} />
            <PalaceDetail p={chart.palaces[selected]!} />
          </div>
        ) : (
          <div className="mt-3 grid gap-3">
            {ordered.map((p) => (
              <PalaceDetail key={p.branch} p={p} />
            ))}
          </div>
        )}
        {view === "grid" && <p className="mt-2 text-xs text-muted-foreground">Chạm vào một cung để xem ý nghĩa các sao. Số ở góc dưới là tuổi bắt đầu đại hạn.</p>}

        <Section title="Nét chính" id="net-chinh">
          <div className="grid gap-4 leading-relaxed">
            <p>
              <span className="text-muted-foreground">Cung Mệnh tại {menh.branchName}: </span>
              {menhMajors.length > 0
                ? menhMajors.map((s) => `${s.name} (${MAJOR_STAR_TEXT[s.name]!.keyword.toLowerCase()})`).join(" và ") + ". " + menhMajors.map((s) => MAJOR_STAR_TEXT[s.name]!.text).join(" ")
                : `vô chính diệu. Theo cách luận phổ biến, xem các sao ở cung Thiên Di đối diện${borrowed.length ? `: ${borrowed.map((s) => s.name).join(", ")}` : ""}.`}
            </p>
            <p>
              <span className="text-muted-foreground">Thân cư {chart.thanPalace}: </span>
              theo quan niệm tử vi, cung này thể hiện điều bạn chú trọng nhiều hơn khi trưởng thành.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {keyPalaces.map((p) => {
                const majors = p.stars.filter((s) => s.kind === "chinh");
                return (
                  <li key={p.name} className="rounded-xl border border-border px-4 py-3 text-sm">
                    <span className="font-medium text-[#f1e3bf]">{p.name}</span>
                    <span className="text-muted-foreground"> ({p.branchName}): </span>
                    {majors.length ? majors.map((s) => `${s.name} – ${MAJOR_STAR_TEXT[s.name]!.keyword.toLowerCase()}`).join("; ") : "vô chính diệu"}
                  </li>
                );
              })}
            </ul>
          </div>
        </Section>

        <Note className="mt-8">
          Lá số gồm 14 chính tinh, 10 phụ tinh, Tứ Hóa, Tuần, Triệt, vòng Trường Sinh và đại hạn; vị trí các sao đã được đối chiếu với thư
          viện mã nguồn mở iztro. Chưa có Thiên Khôi, Thiên Việt, Hỏa Tinh, Linh Tinh, các vòng sao phụ khác, lưu niên và độ sáng của sao.
          Diễn giải chỉ mô tả xu hướng theo quan niệm tử vi, không dự đoán sự kiện, sức khỏe hay tuổi thọ.
        </Note>
        <ResultActions
          key={`${shown.birthDate}-${shown.hour}-${shown.gender}-${shown.savedAt}`}
          alreadySaved={shown.savedAt !== null}
          onEdit={() => setShown(null)}
          onSaveHistory={() =>
            repo
              ? repo.addHistory({
                  kind: "la-so",
                  name: shown.name,
                  birthDate: shown.birthDate,
                  hour: shown.hour,
                  gender: shown.gender,
                  profileId: profile?.id ?? null,
                  label: shown.name ? `Lá số tử vi – ${shown.name}` : "Lá số tử vi",
                })
              : { ok: false, reason: "unavailable" }
          }
          profileDraft={profile ? null : { name: shown.name, birthDate: shown.birthDate, gender: shown.gender }}
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
          <ProfilePicker
            profiles={data.profiles}
            value={pid}
            onPick={(p) => {
              setPid(p?.id ?? null);
              const cur = form.getValues();
              form.reset({ ...cur, name: p?.name ?? "", birthDate: p?.birthDate ?? "", gender: p?.gender ?? null });
            }}
          />
          <TextField label="Tên gọi (không bắt buộc)" maxLength={60} error={errors.name?.message} {...form.register("name")} />
          <DateField error={errors.birthDate?.message} {...form.register("birthDate", { onChange: () => setPid(null) })} />
          <SelectField
            label="Giờ sinh"
            placeholder="Chọn giờ sinh"
            options={HOUR_LABELS.map((l, i) => ({ value: String(i), label: l }))}
            error={errors.hour?.message}
            {...form.register("hour")}
          />
          <Controller
            control={form.control}
            name="gender"
            render={({ field }) => (
              <GenderField
                value={field.value}
                onChange={field.onChange}
                error={errors.gender?.message}
                label="Giới tính"
                hint="Tử vi dùng giới tính cùng âm dương của năm sinh để xác định chiều đi của đại hạn và vòng Trường Sinh."
              />
            )}
          />
          <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
            Lá số cần giờ sinh chính xác. Nếu bạn sinh từ 23h đến 24h, An Mệnh vẫn tính giờ Tý của ngày đã nhập; một số trường phái tính sang
            ngày hôm sau.
          </p>
          <div>
            <Button type="submit" size="lg">
              Lập lá số
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
