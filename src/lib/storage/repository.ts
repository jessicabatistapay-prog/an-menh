/**
 * Kho dữ liệu LocalStorage có xử lý:
 * - LocalStorage không khả dụng (chế độ riêng tư, bị chặn, hết dung lượng).
 * - Dữ liệu hỏng (JSON lỗi, sai cấu trúc): sao lưu bản hỏng rồi khởi tạo lại.
 * - Từng mục lỗi: bỏ qua mục lỗi, giữ các mục hợp lệ.
 * - Phiên bản lược đồ: chuyển đổi phiên bản cũ; phiên bản mới hơn (do bản app mới hơn ghi)
 *   thì chỉ đọc, không ghi đè để tránh mất dữ liệu.
 */

import {
  type AppData,
  CORRUPT_BACKUP_KEY,
  type HistoryEntry,
  MAX_HISTORY,
  MAX_PROFILES,
  type Profile,
  SCHEMA_VERSION,
  STORAGE_KEY,
  emptyData,
  historyEntrySchema,
  profileSchema,
} from "./schema";

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type LoadStatus =
  | "ok"
  | "empty"
  | "unavailable"
  | "corrupt-reset"
  | "partially-recovered"
  | "newer-version";

export interface LoadResult {
  data: AppData;
  status: LoadStatus;
  droppedCount: number;
}

/**
 * Chuyển đổi từ các phiên bản cũ: MIGRATIONS[n] đổi dữ liệu phiên bản n sang n + 1.
 * 1 → 2: thêm loại lịch sử "hop-tuoi"; dữ liệu cũ giữ nguyên cấu trúc.
 * (Nâng phiên bản để bản app cũ hơn mở dữ liệu mới ở chế độ chỉ đọc, không vô tình xóa mục "hop-tuoi".)
 */
const MIGRATIONS: Record<number, (input: Record<string, unknown>) => Record<string, unknown>> = {
  1: (input) => ({ ...input, version: 2 }),
};

export function parseStoredData(raw: string | null): LoadResult {
  if (raw === null || raw === "") return { data: emptyData(), status: "empty", droppedCount: 0 };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { data: emptyData(), status: "corrupt-reset", droppedCount: 0 };
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { data: emptyData(), status: "corrupt-reset", droppedCount: 0 };
  }

  let obj = parsed as Record<string, unknown>;
  const rawVersion = obj.version;
  if (typeof rawVersion !== "number" || !Number.isInteger(rawVersion) || rawVersion < 1) {
    return { data: emptyData(), status: "corrupt-reset", droppedCount: 0 };
  }
  let version: number = rawVersion;

  let newer = false;
  if (version > SCHEMA_VERSION) {
    newer = true;
  } else {
    while (version < SCHEMA_VERSION) {
      const migrate = MIGRATIONS[version];
      if (!migrate) return { data: emptyData(), status: "corrupt-reset", droppedCount: 0 };
      obj = migrate(obj);
      version = version + 1;
    }
  }

  const rawProfiles = Array.isArray(obj.profiles) ? obj.profiles : null;
  const rawHistory = Array.isArray(obj.history) ? obj.history : null;
  if (rawProfiles === null || rawHistory === null) {
    return { data: emptyData(), status: "corrupt-reset", droppedCount: 0 };
  }

  let dropped = 0;
  const profiles: Profile[] = [];
  const seenProfile = new Set<string>();
  for (const p of rawProfiles) {
    const r = profileSchema.safeParse(p);
    if (r.success && !seenProfile.has(r.data.id)) {
      profiles.push(r.data);
      seenProfile.add(r.data.id);
    } else dropped++;
  }
  const history: HistoryEntry[] = [];
  const seenHistory = new Set<string>();
  for (const h of rawHistory) {
    const r = historyEntrySchema.safeParse(h);
    if (r.success && !seenHistory.has(r.data.id)) {
      history.push(r.data);
      seenHistory.add(r.data.id);
    } else dropped++;
  }

  const data: AppData = { version: SCHEMA_VERSION, profiles, history };
  if (newer) return { data, status: "newer-version", droppedCount: dropped };
  return { data, status: dropped > 0 ? "partially-recovered" : "ok", droppedCount: dropped };
}

/** Lấy localStorage an toàn; trả về null nếu không dùng được. */
export function getBrowserStorage(): StorageAdapter | null {
  if (typeof window === "undefined") return null;
  try {
    const ls = window.localStorage;
    const probe = "an-menh:probe";
    ls.setItem(probe, "1");
    ls.removeItem(probe);
    return ls;
  } catch {
    return null;
  }
}

export type WriteResult = { ok: true } | { ok: false; reason: "unavailable" | "read-only" | "quota" | "limit" };

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export class Repository {
  private data: AppData;
  private status: LoadStatus;
  private droppedCount: number;
  private listeners = new Set<() => void>();
  private snapshot: { data: AppData; status: LoadStatus; droppedCount: number };

  constructor(private readonly adapter: StorageAdapter | null) {
    if (!adapter) {
      this.data = emptyData();
      this.status = "unavailable";
      this.droppedCount = 0;
    } else {
      let raw: string | null = null;
      let readFailed = false;
      try {
        raw = adapter.getItem(STORAGE_KEY);
      } catch {
        readFailed = true;
      }
      if (readFailed) {
        this.data = emptyData();
        this.status = "unavailable";
        this.droppedCount = 0;
      } else {
        const result = parseStoredData(raw);
        this.data = result.data;
        this.status = result.status;
        this.droppedCount = result.droppedCount;
        if (result.status === "corrupt-reset" && raw !== null) {
          try {
            adapter.setItem(CORRUPT_BACKUP_KEY, raw);
            adapter.removeItem(STORAGE_KEY);
          } catch {
            /* bỏ qua: không sao lưu được thì vẫn dùng dữ liệu trống */
          }
        }
      }
    }
    this.snapshot = { data: this.data, status: this.status, droppedCount: this.droppedCount };
  }

  getSnapshot = () => this.snapshot;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  get canWrite(): boolean {
    return this.adapter !== null && this.status !== "unavailable" && this.status !== "newer-version";
  }

  private commit(next: AppData): WriteResult {
    if (!this.adapter || this.status === "unavailable") return { ok: false, reason: "unavailable" };
    if (this.status === "newer-version") return { ok: false, reason: "read-only" };
    try {
      this.adapter.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      return { ok: false, reason: "quota" };
    }
    this.data = next;
    if (this.status !== "ok") this.status = "ok";
    this.droppedCount = 0;
    this.snapshot = { data: this.data, status: this.status, droppedCount: 0 };
    this.listeners.forEach((l) => l());
    return { ok: true };
  }

  /** Đọc lại từ bộ nhớ (ví dụ khi tab khác thay đổi dữ liệu). */
  reload(): void {
    if (!this.adapter) return;
    let raw: string | null = null;
    try {
      raw = this.adapter.getItem(STORAGE_KEY);
    } catch {
      return;
    }
    const r = parseStoredData(raw);
    this.data = r.data;
    this.status = r.status === "empty" ? "ok" : r.status;
    this.droppedCount = r.droppedCount;
    this.snapshot = { data: this.data, status: this.status, droppedCount: this.droppedCount };
    this.listeners.forEach((l) => l());
  }

  addProfile(input: Pick<Profile, "name" | "birthDate" | "gender">): WriteResult & { id?: string } {
    if (this.data.profiles.length >= MAX_PROFILES) return { ok: false, reason: "limit" };
    const now = new Date().toISOString();
    const profile = profileSchema.parse({ ...input, id: createId(), createdAt: now, updatedAt: now });
    const r = this.commit({ ...this.data, profiles: [...this.data.profiles, profile] });
    return r.ok ? { ok: true, id: profile.id } : r;
  }

  updateProfile(id: string, patch: Partial<Pick<Profile, "name" | "birthDate" | "gender">>): WriteResult {
    const existing = this.data.profiles.find((p) => p.id === id);
    if (!existing) return { ok: false, reason: "unavailable" };
    const updated = profileSchema.parse({ ...existing, ...patch, updatedAt: new Date().toISOString() });
    return this.commit({
      ...this.data,
      profiles: this.data.profiles.map((p) => (p.id === id ? updated : p)),
    });
  }

  deleteProfile(id: string): WriteResult {
    return this.commit({
      ...this.data,
      profiles: this.data.profiles.filter((p) => p.id !== id),
      // Giữ lịch sử nhưng bỏ liên kết tới hồ sơ đã xóa
      history: this.data.history.map((h) => (h.profileId === id ? { ...h, profileId: null } : h)),
    });
  }

  addHistory(entry: DistributiveOmit<HistoryEntry, "id" | "createdAt">): WriteResult & { id?: string } {
    const full = historyEntrySchema.parse({ ...entry, id: createId(), createdAt: new Date().toISOString() });
    const history = [full, ...this.data.history].slice(0, MAX_HISTORY);
    const r = this.commit({ ...this.data, history });
    return r.ok ? { ok: true, id: full.id } : r;
  }

  deleteHistory(id: string): WriteResult {
    return this.commit({ ...this.data, history: this.data.history.filter((h) => h.id !== id) });
  }

  clearHistory(): WriteResult {
    return this.commit({ ...this.data, history: [] });
  }

  /** Xóa toàn bộ dữ liệu của An Mệnh trên trình duyệt này. */
  clearAll(): WriteResult {
    if (!this.adapter || this.status === "unavailable") return { ok: false, reason: "unavailable" };
    try {
      this.adapter.removeItem(STORAGE_KEY);
      this.adapter.removeItem(CORRUPT_BACKUP_KEY);
    } catch {
      return { ok: false, reason: "unavailable" };
    }
    this.data = emptyData();
    this.status = "ok";
    this.droppedCount = 0;
    this.snapshot = { data: this.data, status: this.status, droppedCount: 0 };
    this.listeners.forEach((l) => l());
    return { ok: true };
  }
}

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
