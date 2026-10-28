"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { LogoMark } from "./element-ring";
import { MORE_NAV, PRIMARY_NAV, isActive } from "./nav-config";

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-[#2a395680] bg-[#0d1524]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 md:h-16">
        <Link href="/" className="flex items-center gap-2.5 rounded-md" aria-label="An Mệnh – về trang chủ">
          <LogoMark />
          <span className="font-display text-2xl font-semibold tracking-wide text-[#f1e3bf]">An Mệnh</span>
        </Link>

        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 md:flex">
          {PRIMARY_NAV.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
                isActive(pathname, item.href) && "bg-[#d9c38f1a] text-[#f1e3bf]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            className="flex h-10 items-center gap-2 rounded-full border border-[#2a3956] px-3.5 text-sm text-muted-foreground hover:text-foreground data-[state=open]:text-foreground"
            aria-label="Mở menu mở rộng"
          >
            <Menu className="size-4" aria-hidden />
            <span>Thêm</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {MORE_NAV.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
                  <item.icon aria-hidden />
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/ho-so">
                <UserRound aria-hidden />
                Hồ sơ và lịch sử
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
