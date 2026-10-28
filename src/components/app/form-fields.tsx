"use client";

import { useId } from "react";
import { UsersRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioChip, RadioGroup } from "@/components/ui/radio-group";
import { DATE_MAX, DATE_MIN } from "@/lib/forms";
import type { Profile } from "@/lib/storage/schema";
import { formatVietnameseDate, parseISODate } from "@/lib/core/date";
import { cn } from "@/lib/utils";

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
}

export function FieldHint({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="text-[0.8125rem] leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

type InputProps = React.ComponentProps<"input">;

export function DateField({
  label = "Ngày sinh (dương lịch)",
  error,
  hint,
  ...props
}: InputProps & { label?: string; error?: string; hint?: React.ReactNode }) {
  const id = useId();
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="date"
        min={DATE_MIN}
        max={DATE_MAX}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(error && `${id}-err`, hint && `${id}-hint`) || undefined}
        {...props}
      />
      {hint && <FieldHint id={`${id}-hint`}>{hint}</FieldHint>}
      <FieldError id={`${id}-err`} message={error} />
    </div>
  );
}

export function TextField({
  label,
  error,
  hint,
  ...props
}: InputProps & { label: string; error?: string; hint?: React.ReactNode }) {
  const id = useId();
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(error && `${id}-err`, hint && `${id}-hint`) || undefined}
        {...props}
      />
      {hint && <FieldHint id={`${id}-hint`}>{hint}</FieldHint>}
      <FieldError id={`${id}-err`} message={error} />
    </div>
  );
}

export function GenderField({
  value,
  onChange,
  error,
  hint,
  label = "Giới tính theo quy ước cung phi",
}: {
  value: "nam" | "nu" | null;
  onChange: (v: "nam" | "nu") => void;
  error?: string;
  hint?: React.ReactNode;
  label?: string;
}) {
  const id = useId();
  return (
    <div className="grid gap-2">
      <span id={`${id}-label`} className="text-sm font-medium">
        {label}
      </span>
      <RadioGroup
        value={value ?? ""}
        onValueChange={(v) => onChange(v as "nam" | "nu")}
        className="grid-cols-2"
        aria-labelledby={`${id}-label`}
        aria-describedby={cn(error && `${id}-err`, hint && `${id}-hint`) || undefined}
      >
        <RadioChip value="nam">Nam</RadioChip>
        <RadioChip value="nu">Nữ</RadioChip>
      </RadioGroup>
      {hint && <FieldHint id={`${id}-hint`}>{hint}</FieldHint>}
      <FieldError id={`${id}-err`} message={error} />
    </div>
  );
}

export function SelectField({
  label,
  error,
  options,
  placeholder,
  ...props
}: React.ComponentProps<"select"> & {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className="h-11 w-full rounded-lg border border-input bg-[#101a2e] px-3 text-base text-foreground [color-scheme:dark] focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 aria-invalid:border-destructive"
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <FieldError id={`${id}-err`} message={error} />
    </div>
  );
}

/** Chọn nhanh một hồ sơ đã lưu để điền sẵn biểu mẫu. */
export function ProfilePicker({
  profiles,
  value,
  onPick,
}: {
  profiles: Profile[];
  value: string | null;
  onPick: (profile: Profile | null) => void;
}) {
  const id = useId();
  if (profiles.length === 0) return null;
  return (
    <div className="grid gap-2 rounded-xl border border-dashed border-[#d9c38f40] bg-[#d9c38f08] p-4">
      <Label htmlFor={id} className="flex items-center gap-2">
        <UsersRound className="size-4 text-primary" aria-hidden />
        Dùng hồ sơ đã lưu
      </Label>
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) => onPick(profiles.find((p) => p.id === e.target.value) ?? null)}
        className="h-11 w-full rounded-lg border border-input bg-[#101a2e] px-3 text-base text-foreground [color-scheme:dark] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        <option value="">Nhập thông tin mới</option>
        {profiles.map((p) => {
          const d = parseISODate(p.birthDate);
          return (
            <option key={p.id} value={p.id}>
              {p.name}
              {d.ok ? ` – ${formatVietnameseDate(d.date)}` : ""}
            </option>
          );
        })}
      </select>
    </div>
  );
}
