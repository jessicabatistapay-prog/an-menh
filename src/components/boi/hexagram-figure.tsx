import type { LineValue } from "@/lib/core/iching";
import { cn } from "@/lib/utils";

/**
 * Vẽ quẻ 6 hào (hào sơ ở dưới cùng). Hào động được đánh dấu: ○ lão dương, × lão âm.
 * `values` có thể ít hơn 6 khi đang gieo dở; các hào chưa gieo vẽ mờ.
 */
export function HexagramFigure({
  values,
  lines,
  className,
  showMoving = true,
  title,
}: {
  values?: (LineValue | null)[];
  lines?: boolean[];
  className?: string;
  showMoving?: boolean;
  title?: string;
}) {
  const rows = Array.from({ length: 6 }, (_, i) => {
    const v = values?.[i] ?? null;
    const yang = lines ? lines[i] : v === null ? null : v === 7 || v === 9;
    const moving = v === 6 || v === 9;
    return { yang, moving, value: v };
  });
  const W = 120;
  const H = 6 * 18;
  return (
    <svg viewBox={`0 0 ${W + 26} ${H}`} className={cn("h-auto w-full", className)} role="img" aria-label={title ?? "Hình quẻ"}>
      {rows.map((r, i) => {
        const y = H - (i + 1) * 18 + 4;
        const color = r.moving && showMoving ? "#f3e4bd" : "#d9c38f";
        if (r.yang === null)
          return <rect key={i} x={0} y={y} width={W} height={9} rx={2} fill="none" stroke="#2a3956" strokeDasharray="3 4" />;
        return (
          <g key={i}>
            {r.yang ? (
              <rect x={0} y={y} width={W} height={9} rx={2} fill={color} />
            ) : (
              <>
                <rect x={0} y={y} width={W * 0.43} height={9} rx={2} fill={color} />
                <rect x={W * 0.57} y={y} width={W * 0.43} height={9} rx={2} fill={color} />
              </>
            )}
            {r.moving && showMoving && (
              r.value === 9 ? (
                <circle cx={W + 14} cy={y + 4.5} r={4.5} fill="none" stroke="#f3e4bd" strokeWidth={1.6} />
              ) : (
                <path d={`M${W + 10} ${y} l8 9 M${W + 18} ${y} l-8 9`} stroke="#f3e4bd" strokeWidth={1.6} />
              )
            )}
          </g>
        );
      })}
    </svg>
  );
}
