import { BookOpen, Compass, Hash, Home, Layers, ScrollText, Sparkles, UserRound } from "lucide-react";

export const PRIMARY_NAV = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/ban-menh", label: "Bản mệnh", icon: Sparkles },
  { href: "/phong-thuy", label: "Phong thủy", icon: Compass },
  { href: "/rut-the", label: "Rút thẻ", icon: Layers },
  { href: "/ho-so", label: "Hồ sơ", icon: UserRound },
] as const;

export const MORE_NAV = [
  { href: "/than-so-hoc", label: "Thần số học", icon: Hash },
  { href: "/kien-thuc", label: "Kiến thức", icon: BookOpen },
  { href: "/phuong-phap", label: "Phương pháp và nguồn", icon: ScrollText },
] as const;

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
