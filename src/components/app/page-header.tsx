import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("mb-8 pt-6 md:pt-10", className)}>
      <h1 className="font-display text-4xl font-semibold leading-[1.05] text-[#f3e6c4] md:text-5xl">{title}</h1>
      {description && <div className="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-muted-foreground">{description}</div>}
      {children}
    </div>
  );
}

export function Section({
  title,
  children,
  className,
  id,
  description,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
  description?: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className={cn("mt-10", className)}>
      <h2 id={id ? `${id}-title` : undefined} className="font-display text-[1.75rem] font-semibold leading-tight text-[#f1e3bf]">
        {title}
      </h2>
      {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Khối nội dung nền tối nhẹ. Dùng cho nhóm thông tin, không dùng cho mọi thứ. */
export function Panel({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("rounded-2xl border border-border bg-[#15213acc] p-5", className)} {...props} />;
}

export function Note({ className, tone = "info", ...props }: React.ComponentProps<"div"> & { tone?: "info" | "warn" }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 text-sm leading-relaxed",
        tone === "info" ? "border-[#2a3956] bg-[#121d33] text-muted-foreground" : "border-[#e08a7c55] bg-[#e08a7c12] text-[#f2cfc6]",
        className,
      )}
      {...props}
    />
  );
}

export const MISSING_ENTRY = "Không tìm thấy kết quả đã lưu này trên trình duyệt. Có thể nó đã bị xóa.";
export const MISSING_PROFILE = "Không tìm thấy hồ sơ này trên trình duyệt. Có thể nó đã bị xóa.";

export function LoadingBlock({ className }: { className?: string }) {
  return (
    <div className={cn("h-72 animate-pulse rounded-2xl bg-[#15213a99]", className)} aria-busy="true">
      <span className="sr-only">Đang tải dữ liệu đã lưu</span>
    </div>
  );
}
