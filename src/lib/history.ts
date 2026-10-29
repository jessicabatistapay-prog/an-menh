import { DIRECTION_NAMES, type Direction } from "@/lib/core/battrach";
import { formatVietnameseDate, parseISODate } from "@/lib/core/date";
import { getCardById } from "@/lib/content/cards";
import type { HistoryEntry } from "@/lib/storage/schema";
import { SPACE_LABELS } from "@/lib/forms";
import { EARTHLY_BRANCHES } from "@/lib/core/canchi";
import { type LineValue, readingFromValues } from "@/lib/core/iching";
import { getXam } from "@/lib/content/xam";
import { getTarotCard } from "@/lib/content/tarot";

export const HISTORY_KIND_LABELS: Record<HistoryEntry["kind"], string> = {
  "ban-menh": "Bản mệnh",
  "phong-thuy": "Phong thủy",
  "than-so": "Thần số học",
  "rut-the": "Rút thẻ",
  "hop-tuoi": "Xem tuổi",
  "gieo-que": "Gieo quẻ",
  "xin-xam": "Xin xăm",
  tarot: "Tarot",
  "la-so": "Lá số tử vi",
};

const HISTORY_ROUTES: Record<HistoryEntry["kind"], string> = {
  "ban-menh": "/ban-menh",
  "phong-thuy": "/phong-thuy",
  "than-so": "/than-so-hoc",
  "rut-the": "/rut-the",
  "hop-tuoi": "/hop-tuoi",
  "gieo-que": "/gieo-que",
  "xin-xam": "/xin-xam",
  tarot: "/tarot",
  "la-so": "/la-so",
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
    case "hop-tuoi":
      return `${entry.nameA || "Người thứ nhất"} (${dateText(entry.birthDateA)}) và ${entry.nameB || "Người thứ hai"} (${dateText(entry.birthDateB)})`;
    case "gieo-que": {
      const r = readingFromValues(entry.values.split("").map(Number) as LineValue[]);
      return `Quẻ ${r.primary.fullName}${r.changed ? `, biến ${r.changed.fullName}` : ""}`;
    }
    case "xin-xam":
      return `Quẻ xăm số ${entry.number}${getXam(entry.number) ? `: ${getXam(entry.number)!.title}` : ""}`;
    case "tarot":
      return entry.cards.map((c) => `${getTarotCard(c.id)?.name ?? c.id}${c.reversed ? " (ngược)" : ""}`).join(", ");
    case "la-so":
      return `${entry.name ? `${entry.name}, ` : ""}sinh ${dateText(entry.birthDate)}, giờ ${EARTHLY_BRANCHES[entry.hour]}`;
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
