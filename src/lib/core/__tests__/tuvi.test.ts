import { describe, expect, it } from "vitest";
import { MAJOR_STARS, MINOR_STARS, buildChart, tuViPosition } from "../tuvi";

const starsAt = (c: ReturnType<typeof buildChart>, branch: number) =>
  c.palaces[branch]!.stars.map((s) => `${s.name}${s.mutagen ?? ""}`).sort();

describe("Lá số tử vi", () => {
  // Mẫu đã đối chiếu với iztro: âm lịch 17/7/2000 (Canh Thìn), giờ Dần, nam.
  const c = buildChart({ lunarYear: 2000, lunarMonth: 7, lunarDay: 17, hour: 2, gender: "nam" });

  it("an Mệnh, Thân, Cục, Mệnh chủ, Thân chủ", () => {
    expect(c.yearCanChi).toBe("Canh Thìn");
    expect(c.yinYangGender).toBe("Dương Nam");
    expect(c.menhBranch).toBe(6); // Ngọ
    expect(c.thanBranch).toBe(10); // Tuất
    expect(c.thanPalace).toBe("Quan Lộc");
    expect(c.bureau.name).toBe("Mộc tam cục");
    expect(c.palaces[6]!.stemName).toBe("Nhâm");
    expect(c.palaces[2]!.stemName).toBe("Mậu");
    expect(c.soulMaster).toBe("Phá Quân");
    expect(c.bodyMaster).toBe("Văn Xương");
  });

  it("vị trí sao và Tứ Hóa", () => {
    expect(starsAt(c, 6)).toEqual(["Tử Vi", "Văn Khúc"].sort());
    expect(starsAt(c, 2)).toEqual(["Thiên Mã", "Thiên Tướng", "Vũ KhúcQuyền"].sort());
    expect(starsAt(c, 3)).toEqual(["Thiên Lương", "Thái DươngLộc"].sort());
    expect(starsAt(c, 1)).toEqual(["Cự Môn", "Thiên ĐồngKỵ", "Địa Kiếp"].sort());
    expect(starsAt(c, 10)).toEqual(["Liêm Trinh", "Thiên Phủ", "Tả Phù"].sort());
    expect(starsAt(c, 8)).toEqual(["Lộc Tồn", "Phá Quân", "Văn Xương"].sort());
    expect(starsAt(c, 11)).toEqual(["Thái ÂmKhoa"]);
  });

  it("đại hạn và vòng Trường Sinh", () => {
    expect(c.palaces[6]!.decade).toEqual([3, 12]);
    expect(c.palaces[7]!.decade).toEqual([13, 22]); // Dương Nam đi thuận
    expect(c.palaces[11]!.changSheng).toBe("Trường Sinh"); // Mộc cục khởi ở Hợi
  });

  it("mỗi chính tinh và phụ tinh xuất hiện đúng một lần, 12 cung không trùng tên", () => {
    for (let t = 0; t < 300; t++) {
      const ch = buildChart({ lunarYear: 1950 + (t % 80), lunarMonth: 1 + (t % 12), lunarDay: 1 + (t % 30), hour: t % 12, gender: t % 2 ? "nam" : "nu" });
      const all = ch.palaces.flatMap((p) => p.stars.map((s) => s.name));
      for (const s of [...MAJOR_STARS, ...MINOR_STARS]) expect(all.filter((x) => x === s)).toHaveLength(1);
      expect(new Set(ch.palaces.map((p) => p.name)).size).toBe(12);
      expect(ch.palaces.filter((p) => p.isBody)).toHaveLength(1);
      expect(ch.palaces.filter((p) => p.tuan)).toHaveLength(2);
      expect(ch.palaces.filter((p) => p.triet)).toHaveLength(2);
      const starts = ch.palaces.map((p) => p.decade[0]).sort((a, b) => a - b);
      starts.forEach((v, i) => expect(v).toBe(ch.bureau.number + i * 10));
    }
  });

  it("Tuần, Triệt: năm Giáp Tý tuần ở Tuất – Hợi, triệt ở Thân – Dậu", () => {
    const g = buildChart({ lunarYear: 1984, lunarMonth: 3, lunarDay: 5, hour: 4, gender: "nu" });
    expect(g.palaces.filter((p) => p.tuan).map((p) => p.branchName)).toEqual(["Tuất", "Hợi"]);
    expect(g.palaces.filter((p) => p.triet).map((p) => p.branchName)).toEqual(["Thân", "Dậu"]);
    expect(g.yinYangGender).toBe("Dương Nữ");
    expect(g.forward).toBe(false);
  });

  it("vị trí Tử Vi theo ngày và cục", () => {
    expect(tuViPosition(1, 2)).toBe(1); // Thủy nhị cục, ngày 1 → Sửu
    expect(tuViPosition(2, 2)).toBe(2); // ngày 2 → Dần
    expect(tuViPosition(1, 3)).toBe(4); // Mộc tam cục, ngày 1 → Thìn
    expect(tuViPosition(1, 6)).toBe(9); // Hỏa lục cục, ngày 1 → Dậu
    expect(tuViPosition(30, 6)).toBe(6); // ngày 30 → Ngọ
  });

  it("báo lỗi đầu vào", () => {
    expect(() => buildChart({ lunarYear: 2000, lunarMonth: 13, lunarDay: 1, hour: 0, gender: "nam" })).toThrow();
    expect(() => buildChart({ lunarYear: 2000, lunarMonth: 1, lunarDay: 31, hour: 0, gender: "nam" })).toThrow();
    expect(() => buildChart({ lunarYear: 2000, lunarMonth: 1, lunarDay: 1, hour: 12, gender: "nam" })).toThrow();
  });
});
