/**
 * Lược đồ dữ liệu lưu trên trình duyệt (LocalStorage).
 * Chỉ lưu ĐẦU VÀO do người dùng chủ động chọn lưu; kết quả được tính lại khi xem
 * (các phép tính có tính xác định nên luôn cho cùng kết quả).
 */

import { z } from "zod";
import { DIRECTIONS } from "@/lib/core/battrach";
import { parseISODate } from "@/lib/core/date";

export const STORAGE_KEY = "an-menh:data";
export const CORRUPT_BACKUP_KEY = "an-menh:data:hong";
export const SCHEMA_VERSION = 2;

const isoDate = z.string().refine((v) => parseISODate(v).ok, "Ngày không hợp lệ");
const gender = z.enum(["nam", "nu"]).nullable();
const timestamp = z.string().min(1);

export const profileSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(60),
  birthDate: isoDate,
  gender,
  createdAt: timestamp,
  updatedAt: timestamp,
});

export type Profile = z.infer<typeof profileSchema>;

export const SPACE_TYPES = ["phong-khach", "phong-ngu", "goc-lam-viec"] as const;
export type SpaceType = (typeof SPACE_TYPES)[number];

const base = {
  id: z.string().min(1),
  createdAt: timestamp,
  profileId: z.string().nullable(),
  label: z.string().max(80),
};

export const historyEntrySchema = z.discriminatedUnion("kind", [
  z.object({ ...base, kind: z.literal("ban-menh"), birthDate: isoDate, gender }),
  z.object({
    ...base,
    kind: z.literal("phong-thuy"),
    birthDate: isoDate,
    gender: z.enum(["nam", "nu"]),
    facing: z.enum(DIRECTIONS as unknown as [string, ...string[]]),
    space: z.enum(SPACE_TYPES),
  }),
  z.object({ ...base, kind: z.literal("than-so"), birthDate: isoDate }),
  z.object({ ...base, kind: z.literal("rut-the"), cardId: z.string().min(1) }),
  // Thêm từ phiên bản 2
  z.object({
    ...base,
    kind: z.literal("hop-tuoi"),
    nameA: z.string().max(60),
    birthDateA: isoDate,
    genderA: gender,
    nameB: z.string().max(60),
    birthDateB: isoDate,
    genderB: gender,
  }),
]);

export type HistoryEntry = z.infer<typeof historyEntrySchema>;
export type HistoryKind = HistoryEntry["kind"];

export interface AppData {
  version: typeof SCHEMA_VERSION;
  profiles: Profile[];
  history: HistoryEntry[];
}

export function emptyData(): AppData {
  return { version: SCHEMA_VERSION, profiles: [], history: [] };
}

export const MAX_HISTORY = 200;
export const MAX_PROFILES = 30;
