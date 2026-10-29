import {
  BookOpen,
  CalendarDays,
  Compass,
  Dices,
  Grid3x3,
  Hash,
  HeartHandshake,
  Home,
  Layers,
  ScrollText,
  Sparkles,
  Sun,
  SwatchBook,
  UserRound,
  Waves,
  type LucideIcon,
} from "lucide-react";

export const PRIMARY_NAV = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/ban-menh", label: "Bản mệnh", icon: Sparkles },
  { href: "/phong-thuy", label: "Phong thủy", icon: Compass },
  { href: "/rut-the", label: "Rút thẻ", icon: Layers },
  { href: "/ho-so", label: "Hồ sơ", icon: UserRound },
] as const;

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const MORE_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Bói toán",
    items: [
      { href: "/gieo-que", label: "Gieo quẻ Kinh Dịch", icon: Waves },
      { href: "/xin-xam", label: "Xin xăm", icon: Dices },
      { href: "/tarot", label: "Bói bài Tarot", icon: SwatchBook },
      { href: "/tu-vi-hang-ngay", label: "Tử vi hằng ngày", icon: Sun },
      { href: "/la-so", label: "Lá số tử vi", icon: Grid3x3 },
    ],
  },
  {
    label: "Tra cứu",
    items: [
      { href: "/lich", label: "Lịch âm dương", icon: CalendarDays },
      { href: "/hop-tuoi", label: "Xem tuổi hai người", icon: HeartHandshake },
      { href: "/than-so-hoc", label: "Thần số học", icon: Hash },
    ],
  },
  {
    label: "Tìm hiểu",
    items: [
      { href: "/kien-thuc", label: "Kiến thức", icon: BookOpen },
      { href: "/phuong-phap", label: "Phương pháp và nguồn", icon: ScrollText },
    ],
  },
];

export const MORE_NAV: NavItem[] = MORE_GROUPS.flatMap((g) => g.items);

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
