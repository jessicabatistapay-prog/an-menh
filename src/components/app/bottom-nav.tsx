"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV, isActive } from "./nav-config";

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Điều hướng dưới"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#2a395699] bg-[#0b1220]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {PRIMARY_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium text-muted-foreground transition-colors",
                  active && "text-[#f1e3bf]",
                )}
              >
                <span
                  className={cn(
                    "grid h-7 w-12 place-items-center rounded-full transition-colors",
                    active && "bg-[#d9c38f24]",
                  )}
                >
                  <item.icon className="size-[1.15rem]" aria-hidden strokeWidth={active ? 2.2 : 1.8} />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
