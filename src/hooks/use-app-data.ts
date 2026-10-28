"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Repository, getBrowserStorage } from "@/lib/storage/repository";
import { type AppData, STORAGE_KEY, emptyData } from "@/lib/storage/schema";
import type { LoadStatus } from "@/lib/storage/repository";

let repo: Repository | null = null;

/** Kho dữ liệu dùng chung, chỉ khởi tạo trên trình duyệt. */
export function getRepository(): Repository {
  if (!repo) repo = new Repository(getBrowserStorage());
  return repo;
}

export interface AppDataSnapshot {
  data: AppData;
  status: LoadStatus | "loading";
  droppedCount: number;
}

const SERVER_SNAPSHOT: AppDataSnapshot = { data: emptyData(), status: "loading", droppedCount: 0 };
const noopSubscribe = () => () => {};

export function useAppData(): AppDataSnapshot & { repo: Repository | null } {
  const isClient = typeof window !== "undefined";
  const snapshot = useSyncExternalStore<AppDataSnapshot>(
    isClient ? getRepository().subscribe : noopSubscribe,
    () => getRepository().getSnapshot(),
    () => SERVER_SNAPSHOT,
  );

  // Đồng bộ khi dữ liệu thay đổi ở tab khác của cùng trình duyệt.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) getRepository().reload();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { ...snapshot, repo: snapshot.status === "loading" ? null : getRepository() };
}
