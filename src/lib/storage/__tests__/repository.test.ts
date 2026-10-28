import { describe, expect, it } from "vitest";
import { Repository, type StorageAdapter, parseStoredData } from "../repository";
import { CORRUPT_BACKUP_KEY, STORAGE_KEY, SCHEMA_VERSION } from "../schema";

class MemoryStorage implements StorageAdapter {
  store = new Map<string, string>();
  failWrites = false;
  getItem(k: string) {
    return this.store.has(k) ? this.store.get(k)! : null;
  }
  setItem(k: string, v: string) {
    if (this.failWrites) throw new Error("QuotaExceededError");
    this.store.set(k, v);
  }
  removeItem(k: string) {
    this.store.delete(k);
  }
}

const validProfile = {
  id: "p1",
  name: "Minh",
  birthDate: "1990-12-29",
  gender: "nam",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("parseStoredData", () => {
  it("dữ liệu trống", () => {
    expect(parseStoredData(null).status).toBe("empty");
  });

  it("JSON hỏng", () => {
    expect(parseStoredData("{not json").status).toBe("corrupt-reset");
    expect(parseStoredData("[]").status).toBe("corrupt-reset");
    expect(parseStoredData('"abc"').status).toBe("corrupt-reset");
  });

  it("thiếu hoặc sai phiên bản", () => {
    expect(parseStoredData(JSON.stringify({ profiles: [], history: [] })).status).toBe("corrupt-reset");
    expect(parseStoredData(JSON.stringify({ version: "1", profiles: [], history: [] })).status).toBe("corrupt-reset");
  });

  it("phiên bản mới hơn → chỉ đọc", () => {
    const r = parseStoredData(JSON.stringify({ version: SCHEMA_VERSION + 1, profiles: [validProfile], history: [] }));
    expect(r.status).toBe("newer-version");
    expect(r.data.profiles).toHaveLength(1);
  });

  it("bỏ qua mục lỗi, giữ mục hợp lệ", () => {
    const raw = JSON.stringify({
      version: SCHEMA_VERSION,
      profiles: [
        validProfile,
        { ...validProfile, id: "p2", birthDate: "2023-02-29" }, // ngày không tồn tại
        { ...validProfile, id: "p3", name: "" },
        validProfile, // trùng id
      ],
      history: [
        { id: "h1", kind: "than-so", createdAt: "x", profileId: null, label: "a", birthDate: "2000-01-08" },
        { id: "h2", kind: "khong-ro", createdAt: "x", profileId: null, label: "a" },
        { id: "h3", kind: "phong-thuy", createdAt: "x", profileId: null, label: "a", birthDate: "2000-01-08", gender: "nam", facing: "UP", space: "phong-khach" },
      ],
    });
    const r = parseStoredData(raw);
    expect(r.status).toBe("partially-recovered");
    expect(r.droppedCount).toBe(5);
    expect(r.data.profiles.map((p) => p.id)).toEqual(["p1"]);
    expect(r.data.history.map((h) => h.id)).toEqual(["h1"]);
  });
});

describe("Repository", () => {
  it("không có LocalStorage → báo không khả dụng, mọi thao tác ghi đều thất bại rõ ràng", () => {
    const repo = new Repository(null);
    expect(repo.getSnapshot().status).toBe("unavailable");
    expect(repo.addProfile({ name: "A", birthDate: "2000-01-01", gender: null })).toEqual({ ok: false, reason: "unavailable" });
    expect(repo.getSnapshot().data.profiles).toHaveLength(0);
  });

  it("đọc LocalStorage bị lỗi (trình duyệt chặn)", () => {
    const repo = new Repository({
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => undefined,
      removeItem: () => undefined,
    });
    expect(repo.getSnapshot().status).toBe("unavailable");
  });

  it("dữ liệu hỏng được sao lưu rồi khởi tạo lại", () => {
    const mem = new MemoryStorage();
    mem.setItem(STORAGE_KEY, "{oops");
    const repo = new Repository(mem);
    expect(repo.getSnapshot().status).toBe("corrupt-reset");
    expect(mem.getItem(CORRUPT_BACKUP_KEY)).toBe("{oops");
    expect(mem.getItem(STORAGE_KEY)).toBeNull();
  });

  it("tạo, sửa, xóa hồ sơ và lịch sử", () => {
    const mem = new MemoryStorage();
    const repo = new Repository(mem);
    const added = repo.addProfile({ name: "Lan", birthDate: "1995-05-20", gender: "nu" });
    expect(added.ok).toBe(true);
    const id = added.id!;
    expect(repo.updateProfile(id, { name: "Lan Anh" }).ok).toBe(true);
    expect(repo.getSnapshot().data.profiles[0]!.name).toBe("Lan Anh");

    const h = repo.addHistory({ kind: "than-so", birthDate: "1995-05-20", profileId: id, label: "Thần số học" });
    expect(h.ok).toBe(true);
    // dữ liệu đã thực sự ghi xuống bộ nhớ
    const persisted = parseStoredData(mem.getItem(STORAGE_KEY));
    expect(persisted.data.profiles).toHaveLength(1);
    expect(persisted.data.history).toHaveLength(1);

    expect(repo.deleteProfile(id).ok).toBe(true);
    expect(repo.getSnapshot().data.history[0]!.profileId).toBeNull();
    expect(repo.deleteHistory(h.id!).ok).toBe(true);
    expect(repo.getSnapshot().data.history).toHaveLength(0);
  });

  it("ghi thất bại (hết dung lượng) không làm thay đổi trạng thái trong bộ nhớ", () => {
    const mem = new MemoryStorage();
    const repo = new Repository(mem);
    mem.failWrites = true;
    const r = repo.addProfile({ name: "A", birthDate: "2000-01-01", gender: null });
    expect(r).toEqual({ ok: false, reason: "quota" });
    expect(repo.getSnapshot().data.profiles).toHaveLength(0);
  });

  it("dữ liệu phiên bản mới hơn không bị ghi đè", () => {
    const mem = new MemoryStorage();
    const raw = JSON.stringify({ version: SCHEMA_VERSION + 1, profiles: [], history: [] });
    mem.setItem(STORAGE_KEY, raw);
    const repo = new Repository(mem);
    expect(repo.canWrite).toBe(false);
    expect(repo.addHistory({ kind: "rut-the", cardId: "mam-non", profileId: null, label: "x" })).toEqual({
      ok: false,
      reason: "read-only",
    });
    expect(mem.getItem(STORAGE_KEY)).toBe(raw);
  });

  it("xóa toàn bộ dữ liệu", () => {
    const mem = new MemoryStorage();
    const repo = new Repository(mem);
    repo.addProfile({ name: "A", birthDate: "2000-01-01", gender: null });
    expect(repo.clearAll().ok).toBe(true);
    expect(mem.getItem(STORAGE_KEY)).toBeNull();
    expect(repo.getSnapshot().data.profiles).toHaveLength(0);
  });

  it("từ chối hồ sơ có ngày sinh không hợp lệ", () => {
    const repo = new Repository(new MemoryStorage());
    expect(() => repo.addProfile({ name: "A", birthDate: "2023-02-29", gender: null })).toThrow();
  });
});
