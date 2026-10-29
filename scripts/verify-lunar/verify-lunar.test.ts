/**
 * Đối chiếu độc lập bộ chuyển đổi âm lịch với hai thư viện bên ngoài trên MỌI ngày 31/01/1900 – 31/12/2100.
 * Hai thư viện này KHÔNG phải dependency của ứng dụng (chỉ dùng để kiểm tra):
 *  - amlich (bản JS của mã Hồ Ngọc Đức; giấy phép chỉ cho dùng cá nhân, phi thương mại) – so sánh ở UTC+7.
 *  - lunar-javascript (6tail, MIT; mô hình thiên văn khác, lịch Trung Quốc) – so sánh ở UTC+8, và ngày/giờ hoàng đạo.
 *  - iztro (MIT) – đối chiếu vị trí sao trong lá số tử vi.
 *
 * Cách chạy:
 *   mkdir -p /tmp/xcheck && (cd /tmp/xcheck && npm init -y && npm i amlich lunar-javascript iztro)
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

it.skipIf(!dir)("đối chiếu ngày và giờ hoàng đạo với lunar-javascript (1950–2050)", async () => {
  const { dayAuspice, monthBranch } = await import("@/lib/core/hoangdao");
  const req = createRequire(`${dir!.replace(/\/$/, "")}/`);
  const { Solar } = req("lunar-javascript");
  const MAP: Record<string, string> = {
    青龙: "Thanh Long", 明堂: "Minh Đường", 天刑: "Thiên Hình", 朱雀: "Chu Tước", 金匮: "Kim Quỹ", 天德: "Kim Đường",
    白虎: "Bạch Hổ", 玉堂: "Ngọc Đường", 天牢: "Thiên Lao", 玄武: "Huyền Vũ", 司命: "Tư Mệnh", 勾陈: "Câu Trận",
  };
  const ZHI = "子丑寅卯辰巳午未申酉戌亥";
  let hourBad = 0;
  let dayCompared = 0;
  let dayBad = 0;
  const j0 = julianDayNumber({ year: 1950, month: 1, day: 1 });
  const j1 = julianDayNumber({ year: 2050, month: 12, day: 31 });
  for (let j = j0; j <= j1; j++) {
    const d = fromJulianDayNumber(j);
    const a = dayAuspice(d);
    const l = Solar.fromYmd(d.year, d.month, d.day).getLunar();
    const times = l.getTimes();
    for (let h = 0; h < 12; h++) if (MAP[times[h].getTianShen()] !== a.hours[h]!.god.name) hourBad++;
    // lunar-javascript tính tháng theo tiết khí; chỉ so ngày khi chi tháng hai bên trùng nhau.
    if (ZHI.indexOf(l.getMonthZhi()) === monthBranch(solarToLunar(d).month)) {
      dayCompared++;
      if (MAP[l.getDayTianShen()] !== a.dayGod.name) dayBad++;
    }
  }
  console.log(`Giờ hoàng đạo sai khác: ${hourBad}; ngày so sánh được: ${dayCompared}, sai khác: ${dayBad}`);
  expect(hourBad).toBe(0);
  expect(dayBad).toBe(0);
});

const TV_N: Record<string, string> = { 紫微: "Tử Vi", 天机: "Thiên Cơ", 太阳: "Thái Dương", 武曲: "Vũ Khúc", 天同: "Thiên Đồng", 廉贞: "Liêm Trinh", 天府: "Thiên Phủ", 太阴: "Thái Âm", 贪狼: "Tham Lang", 巨门: "Cự Môn", 天相: "Thiên Tướng", 天梁: "Thiên Lương", 七杀: "Thất Sát", 破军: "Phá Quân", 文昌: "Văn Xương", 文曲: "Văn Khúc", 左辅: "Tả Phù", 右弼: "Hữu Bật", 禄存: "Lộc Tồn", 擎羊: "Kình Dương", 陀罗: "Đà La", 地空: "Địa Không", 地劫: "Địa Kiếp", 天马: "Thiên Mã", 火星: "Hỏa Tinh" };
const TV_P: Record<string, string> = { 命宫: "Mệnh", 父母: "Phụ Mẫu", 福德: "Phúc Đức", 田宅: "Điền Trạch", 官禄: "Quan Lộc", 仆役: "Nô Bộc", 迁移: "Thiên Di", 疾厄: "Tật Ách", 财帛: "Tài Bạch", 子女: "Tử Tức", 夫妻: "Phu Thê", 兄弟: "Huynh Đệ" };
const TV_M: Record<string, string> = { 禄: "Lộc", 权: "Quyền", 科: "Khoa", 忌: "Kỵ" };
const TV_CS: Record<string, string> = { 长生: "Trường Sinh", 沐浴: "Mộc Dục", 冠带: "Quan Đới", 临官: "Lâm Quan", 帝旺: "Đế Vượng", 衰: "Suy", 病: "Bệnh", 死: "Tử", 墓: "Mộ", 绝: "Tuyệt", 胎: "Thai", 养: "Dưỡng" };

it.skipIf(!dir)("đối chiếu lá số tử vi với iztro (4000 lá số ngẫu nhiên)", async () => {
  const { buildChart } = await import("@/lib/core/tuvi");
  const req = createRequire(`${dir!.replace(/\/$/, "")}/`);
  const { astro } = req("iztro");
  let s = 7; const rnd = (n: number) => { s = (s * 1103515245 + 12345) % 2147483648; return s % n; };
  const bad: Record<string, number> = {}; const ex: Record<string, string> = {};
  const note = (k: string, e: string) => { bad[k] = (bad[k] ?? 0) + 1; if (!ex[k]) ex[k] = e; };
  const TOTAL = 4000;
  for (let t = 0; t < TOTAL; t++) {
    const y = 1901 + rnd(199), m = 1 + rnd(12), d = 1 + rnd(29), h = rnd(12), g = rnd(2) ? "nam" : "nu";
    const c = buildChart({ lunarYear: y, lunarMonth: m, lunarDay: d, hour: h, gender: g });
    const a = astro.byLunar(`${y}-${m}-${d}`, h, g === "nam" ? "男" : "女", false, false, "zh-CN");
    const tag = `${y}-${m}-${d} h${h} ${g}`;
    if (!a.fiveElementsClass.startsWith(c.bureau.name[0] === "T" && c.bureau.name.startsWith("Thủy") ? "水" : c.bureau.name.startsWith("Mộc") ? "木" : c.bureau.name.startsWith("Kim") ? "金" : c.bureau.name.startsWith("Thổ") ? "土" : "火")) note("cuc", tag);
    if (TV_N[a.soul] !== c.soulMaster) note("menhchu", tag + " " + a.soul + " " + c.soulMaster);
    if (TV_N[a.body] !== c.bodyMaster) note("thanchu", tag + " " + a.body + " " + c.bodyMaster);
    for (const p of a.palaces) {
      const b = (p.index + 2) % 12;
      const mine = c.palaces[b]!;
      if (TV_P[p.name] !== mine.name) note("cung", tag);
      if (p.isBodyPalace !== mine.isBody) note("than", tag);
      if (TV_CS[p.changsheng12] !== mine.changSheng) note("truongsinh", tag + " " + p.changsheng12 + " " + mine.changSheng);
      if (p.decadal.range[0] !== mine.decade[0] || p.decadal.range[1] !== mine.decade[1]) note("daihan", tag + " " + p.decadal.range + " " + mine.decade);
      const theirs = [...p.majorStars, ...p.minorStars].filter((s2: { name: string }) => TV_N[s2.name] && s2.name !== "火星").map((s2: { name: string; mutagen?: string }) => `${TV_N[s2.name]}${s2.mutagen ? TV_M[s2.mutagen] : ""}`).sort();
      const ours = mine.stars.map((s2) => `${s2.name}${s2.mutagen ?? ""}`).sort();
      const stripNham = (arr: string[]) => (y % 10 === 2 ? arr.map((x) => x.replace(/Khoa$/, "")) : arr);
      if (JSON.stringify(stripNham(theirs)) !== JSON.stringify(stripNham(ours))) note("sao", tag + " cung " + b + " theirs=" + theirs + " ours=" + ours);
    }
  }
  console.log(`Lá số đã so: ${TOTAL}; sai khác:`, JSON.stringify(bad), JSON.stringify(ex, null, 1));
  expect(Object.keys(bad)).toEqual([]);
});
