import { ELEMENTS, GENERATES, OVERCOMES, type ElementKey } from "@/lib/core/elements";
import { cn } from "@/lib/utils";

/** Thứ tự trên vòng tương sinh, bắt đầu từ đỉnh: Hỏa ở trên (phương Nam trong đồ hình truyền thống). */
const RING_ORDER: ElementKey[] = ["hoa", "tho", "kim", "thuy", "moc"];

export const ELEMENT_COLOR_VAR: Record<ElementKey, string> = {
  kim: "var(--el-kim)",
  moc: "var(--el-moc)",
  thuy: "var(--el-thuy)",
  hoa: "var(--el-hoa)",
  tho: "var(--el-tho)",
};

function point(i: number, r: number, c: number) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
  return { x: c + r * Math.cos(angle), y: c + r * Math.sin(angle) };
}

interface ElementRingProps {
  highlight?: ElementKey | null;
  className?: string;
  animate?: boolean;
  showLabels?: boolean;
  title?: string;
}

/**
 * Đồ hình Ngũ hành: đường ngũ giác là vòng tương sinh, ngôi sao bên trong là vòng tương khắc.
 */
export function ElementRing({ highlight = null, className, animate = false, showLabels = true, title }: ElementRingProps) {
  const size = 320;
  const c = size / 2;
  const R = 112;
  const pts = Object.fromEntries(RING_ORDER.map((e, i) => [e, point(i, R, c)])) as Record<ElementKey, { x: number; y: number }>;

  const generating = RING_ORDER.map((e) => ({ from: pts[e], to: pts[GENERATES[e]], key: `g-${e}`, active: highlight === e || highlight === GENERATES[e] }));
  const overcoming = RING_ORDER.map((e) => ({ from: pts[e], to: pts[OVERCOMES[e]], key: `o-${e}`, active: highlight === e || highlight === OVERCOMES[e] }));

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={cn("h-auto w-full", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <circle cx={c} cy={c} r={R + 34} fill="none" stroke="#d9c38f" strokeOpacity="0.14" />
      <circle cx={c} cy={c} r={R + 40} fill="none" stroke="#d9c38f" strokeOpacity="0.08" strokeDasharray="1 6" />
      {overcoming.map((l) => (
        <line
          key={l.key}
          x1={l.from.x}
          y1={l.from.y}
          x2={l.to.x}
          y2={l.to.y}
          stroke="#a3aec2"
          strokeOpacity={highlight ? (l.active ? 0.55 : 0.12) : 0.22}
          strokeWidth="1"
          strokeDasharray="3 5"
          pathLength={1}
          className={animate ? "ring-draw" : undefined}
        />
      ))}
      {generating.map((l) => (
        <line
          key={l.key}
          x1={l.from.x}
          y1={l.from.y}
          x2={l.to.x}
          y2={l.to.y}
          stroke="#d9c38f"
          strokeOpacity={highlight ? (l.active ? 0.95 : 0.3) : 0.7}
          strokeWidth={highlight && l.active ? 1.8 : 1.2}
          pathLength={1}
          className={animate ? "ring-draw" : undefined}
        />
      ))}
      {RING_ORDER.map((e) => {
        const p = pts[e];
        const isOn = highlight === e;
        const dim = highlight && !isOn;
        return (
          <g key={e} opacity={dim ? 0.55 : 1}>
            {isOn && <circle cx={p.x} cy={p.y} r={30} fill={ELEMENT_COLOR_VAR[e]} fillOpacity="0.14" />}
            <circle
              cx={p.x}
              cy={p.y}
              r={isOn ? 22 : 18}
              fill="#0d1524"
              stroke={ELEMENT_COLOR_VAR[e]}
              strokeWidth={isOn ? 2 : 1.25}
            />
            <circle cx={p.x} cy={p.y} r={4} fill={ELEMENT_COLOR_VAR[e]} />
            {showLabels && (
              <text
                x={p.x}
                y={p.y + (p.y > c + 10 ? 44 : -32)}
                textAnchor="middle"
                fill={isOn ? "#f3e4bd" : "#c9cfdb"}
                fontSize={isOn ? 19 : 16}
                fontWeight={isOn ? 600 : 500}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {ELEMENTS[e].name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function ElementDot({ element, className }: { element: ElementKey; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block size-2.5 shrink-0 rounded-full ring-2 ring-[#0d1524]", className)}
      style={{ background: ELEMENT_COLOR_VAR[element], boxShadow: `0 0 0 3px ${ELEMENT_COLOR_VAR[element]}33` }}
    />
  );
}

export function LogoMark({ className }: { className?: string }) {
  const c = 16;
  const pts = [0, 1, 2, 3, 4].map((i) => point(i, 11, c));
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ") + " Z";
  const star = [0, 2, 4, 1, 3].map((i, k) => `${k === 0 ? "M" : "L"}${pts[i]!.x.toFixed(2)} ${pts[i]!.y.toFixed(2)}`).join(" ") + " Z";
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7", className)} aria-hidden>
      <circle cx={c} cy={c} r={15} fill="none" stroke="#d9c38f" strokeOpacity="0.45" />
      <path d={star} fill="none" stroke="#d9c38f" strokeOpacity="0.45" strokeWidth="0.8" />
      <path d={d} fill="none" stroke="#d9c38f" strokeWidth="1.3" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={1.9} fill="#e7d3a2" />
      ))}
    </svg>
  );
}
