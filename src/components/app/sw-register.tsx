"use client";

import { useEffect } from "react";

/** Đăng ký service worker (chỉ ở bản production) để có thể cài đặt và mở lại khi mạng chập chờn. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      /* không bắt buộc: ứng dụng vẫn chạy bình thường nếu đăng ký thất bại */
    });
  }, []);
  return null;
}
