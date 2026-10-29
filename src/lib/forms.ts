import { z } from "zod";
import { DIRECTIONS, type Direction } from "@/lib/core/battrach";
import { formatVietnameseDate, isWithinSupportedRange, parseISODate, SUPPORTED_MAX, SUPPORTED_MIN, toISODate } from "@/lib/core/date";
import { SPACE_TYPES } from "@/lib/storage/schema";

export const DATE_MIN = toISODate(SUPPORTED_MIN);
export const DATE_MAX = toISODate(SUPPORTED_MAX);

export const MESSAGES = {
  dateRequired: "Vui lòng nhập ngày sinh.",
  dateInvalid: "Ngày sinh không tồn tại. Hãy kiểm tra lại ngày, tháng và năm.",
  dateRange: `An Mệnh hỗ trợ ngày sinh từ ${formatVietnameseDate(SUPPORTED_MIN)} đến ${formatVietnameseDate(SUPPORTED_MAX)}.`,
  genderRequired: "Vui lòng chọn Nam hoặc Nữ để tính cung phi.",
  directionRequired: "Vui lòng chọn hướng nhà.",
  spaceRequired: "Vui lòng chọn loại không gian.",
  nameTooLong: "Tên gọi tối đa 60 ký tự.",
  nameRequired: "Vui lòng đặt tên cho hồ sơ.",
} as const;

export const birthDateField = z.string().superRefine((value, ctx) => {
  const r = parseISODate(value);
  if (!r.ok) {
    ctx.addIssue({ code: "custom", message: r.error === "empty" ? MESSAGES.dateRequired : MESSAGES.dateInvalid });
    return;
  }
  if (!isWithinSupportedRange(r.date)) ctx.addIssue({ code: "custom", message: MESSAGES.dateRange });
});

export const nameField = z.string().trim().max(60, MESSAGES.nameTooLong);

export const banMenhSchema = z
  .object({
    name: nameField,
    birthDate: birthDateField,
    includeCungPhi: z.boolean(),
    gender: z.enum(["nam", "nu"]).nullable(),
  })
  .superRefine((v, ctx) => {
    if (v.includeCungPhi && !v.gender) ctx.addIssue({ code: "custom", path: ["gender"], message: MESSAGES.genderRequired });
  });
export type BanMenhForm = z.infer<typeof banMenhSchema>;

export const phongThuySchema = z.object({
  birthDate: birthDateField,
  gender: z.enum(["nam", "nu"], { error: MESSAGES.genderRequired }).nullable().refine((v) => v !== null, MESSAGES.genderRequired),
  facing: z
    .string()
    .refine((v): v is Direction => (DIRECTIONS as readonly string[]).includes(v), MESSAGES.directionRequired),
  space: z.string().refine((v) => (SPACE_TYPES as readonly string[]).includes(v), MESSAGES.spaceRequired),
});
export type PhongThuyInput = z.input<typeof phongThuySchema>;
export type PhongThuyForm = z.output<typeof phongThuySchema>;

export const thanSoSchema = z.object({ birthDate: birthDateField });
export type ThanSoForm = z.infer<typeof thanSoSchema>;

export const profileFormSchema = z.object({
  name: z.string().trim().min(1, MESSAGES.nameRequired).max(60, MESSAGES.nameTooLong),
  birthDate: birthDateField,
  gender: z.enum(["nam", "nu"]).nullable(),
});
export type ProfileForm = z.infer<typeof profileFormSchema>;

export const SPACE_LABELS: Record<(typeof SPACE_TYPES)[number], string> = {
  "phong-khach": "Phòng khách",
  "phong-ngu": "Phòng ngủ",
  "goc-lam-viec": "Góc làm việc",
};

export const GENDER_LABELS = { nam: "Nam", nu: "Nữ" } as const;

const optionalGender = z.enum(["nam", "nu"]).nullable();

export const hopTuoiSchema = z.object({
  nameA: nameField,
  birthDateA: birthDateField,
  genderA: optionalGender,
  nameB: nameField,
  birthDateB: birthDateField,
  genderB: optionalGender,
});
export type HopTuoiForm = z.infer<typeof hopTuoiSchema>;
