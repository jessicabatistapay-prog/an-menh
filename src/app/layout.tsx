import type { Metadata, Viewport } from "next";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "./globals.css";
import { BottomNav } from "@/components/app/bottom-nav";
import { MusicToggle } from "@/components/app/music-toggle";
import { ServiceWorkerRegister } from "@/components/app/sw-register";
import { SiteFooter } from "@/components/app/site-footer";
import { SiteHeader } from "@/components/app/site-header";
import { StarField } from "@/components/app/star-field";

export const metadata: Metadata = {
  title: { default: "An Mệnh – Hiểu mình hơn, sống hài hòa hơn", template: "%s · An Mệnh" },
  description:
    "Tra cứu Can Chi, ngũ hành nạp âm, cung phi, phong thủy Bát trạch, thần số học và rút thẻ chiêm nghiệm. Nội dung mang tính tham khảo văn hóa và giải trí.",
  applicationName: "An Mệnh",
  appleWebApp: { capable: true, title: "An Mệnh", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0d1524",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi">
      <body className="flex min-h-dvh flex-col">
        <a
          href="#noi-dung"
          className="sr-only z-50 rounded-full bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
        >
          Bỏ qua đến nội dung chính
        </a>
        <StarField />
        <SiteHeader />
        <main id="noi-dung" className="mx-auto w-full max-w-5xl flex-1 px-4">
          {children}
        </main>
        <SiteFooter />
        <BottomNav />
        <MusicToggle />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
