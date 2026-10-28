/**
 * Đối chiếu độc lập bộ chuyển đổi âm lịch với hai thư viện bên ngoài trên MỌI ngày 31/01/1900 – 31/12/2100.
 * Hai thư viện này KHÔNG phải dependency của ứng dụng (chỉ dùng để kiểm tra):
 *  - amlich (bản JS của mã Hồ Ngọc Đức; giấy phép chỉ cho dùng cá nhân, phi thương mại) – so sánh ở UTC+7.
 *  - lunar-javascript (6tail, MIT; mô hình thiên văn khác, lịch Trung Quốc) – so sánh ở UTC+8.
 *
 * Cách chạy:
 *   mkdir -p /tmp/xcheck && (cd /tmp/xcheck && npm init -y && npm i amlich lunar-javascript)
 *   XCHECK_DIR=/tmp/xcheck npm run verify:lunar
 */
import { createRequire } from "node:module";
import { expect, it } from "vitest";
import { solarToLunar } from "@/lib/core/lunar";
import { fromJulianDayNumber, julianDayNumber } from "@/lib/core/date";

const dir = process.env.XCHECK_DIR;

it.skipIf(!dir)("đối chiếu toàn phạm vi", () => {
  const req = createRequire(`${dir!.replace(/\/$/, "")}/`);
  const amlich = req("amlich");
  const { Solar } = req("lunar-javascript");
  const j0 = julianDayNumber({ year: 1900, month: 1, day: 31 });
  const j1 = julianDayNumber({ year: 2100, month: 12, day: 31 });
  const hndDiffs: string[] = [];
  const tailDiffMonths = new Set<string>();
  let tailDiffDays = 0;
  for (let j = j0; j <= j1; j++) {
    const d = fromJulianDayNumber(j);
    const mine = solarToLunar(d, 7);
    const [ld, lm, ly, leap] = amlich.convertSolar2Lunar(d.day, d.month, d.year, 7);
    if (ld !== mine.day || lm !== mine.month || ly !== mine.year || !!leap !== mine.isLeapMonth) {
      hndDiffs.push(`${d.year}-${d.month}-${d.day}: HND ${ld}/${lm}/${ly} | An Mệnh ${mine.day}/${mine.month}/${mine.year}`);
    }
    const mine8 = solarToLunar(d, 8);
    const l = Solar.fromYmd(d.year, d.month, d.day).getLunar();
    const m6 = l.getMonth();
    if (l.getYear() !== mine8.year || Math.abs(m6) !== mine8.month || l.getDay() !== mine8.day || m6 < 0 !== mine8.isLeapMonth) {
      tailDiffDays++;
      tailDiffMonths.add(`${d.year}-${String(d.month).padStart(2, "0")}`);
    }
  }
  console.log(`Tổng số ngày: ${j1 - j0 + 1}`);
  console.log(`Khác amlich (UTC+7): ${hndDiffs.length} ngày`, hndDiffs);
  console.log(`Khác lunar-javascript (UTC+8): ${tailDiffDays} ngày, ở các tháng: ${[...tailDiffMonths].join(", ")}`);
  // amlich trả về "ngày 0" ở 2 ngày sát thời điểm sóc (lỗi đã biết của bản gốc); An Mệnh xử lý đúng.
  expect(hndDiffs.length).toBeLessThanOrEqual(2);
});
