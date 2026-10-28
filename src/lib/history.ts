import { DIRECTION_NAMES, type Direction } from "@/lib/core/battrach";
import { formatVietnameseDate, parseISODate } from "@/lib/core/date";
import { getCardById } from "@/lib/content/cards";
import type { HistoryEntry } from "@/lib/storage/schema";
import { SPACE_LABELS } from "@/lib/forms";

export const HISTORY_KIND_LABELS: Record<HistoryEntry["kind"], string> = {
  "ban-menh": "Bản mệnh",
  "phong-thuy": "Phong thủy",
  "than-so": "Thần số học",
  "rut-the": "Rút thẻ",
};

const HISTORY_ROUTES: Record<HistoryEntry["kind"], string> = {
  "ban-menh": "/ban-menh",
  "phong-thuy": "/phong-thuy",
  "than-so": "/than-so-hoc",
  "rut-the": "/rut-the",
};

export function historyHref(entry: HistoryEntry): string {
  return `${HISTORY_ROUTES[entry.kind]}?muc=${encodeURIComponent(entry.id)}`;
}

function dateText(iso: string) {
  const r = parseISODate(iso);
  return r.ok ? formatVietnameseDate(r.date) : iso;
}

export function describeHistory(entry: HistoryEntry): string {
  switch (entry.kind) {
    case "ban-menh":
      return `Ngày sinh ${dateText(entry.birthDate)}`;
    case "than-so":
      return `Ngày sinh ${dateText(entry.birthDate)}`;
    case "phong-thuy":
      return `Nhà hướng ${DIRECTION_NAMES[entry.facing as Direction]}, ${SPACE_LABELS[entry.space].toLowerCase()}`;
    case "rut-the":
      return getCardById(entry.cardId)?.name ?? "Thẻ không còn trong bộ thẻ";
  }
}

export function formatSavedAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
