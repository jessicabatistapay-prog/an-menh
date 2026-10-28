import { DIRECTION_NAMES, type Direction, type DirectionChartEntry } from "@/lib/core/battrach";

const ANGLE: Record<Direction, number> = { N: -90, NE: -45, E: 0, SE: 45, S: 90, SW: 135, W: 180, NW: -135 };

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** Sơ đồ 8 hướng tĩnh (Bắc ở trên). Không phải la bàn. */
export function DirectionChart({ chart, facing }: { chart: DirectionChartEntry[]; facing: Direction }) {
  const size = 340;
  const c = size / 2;
  const R = 150;
  const r0 = 46;
  const byDir = Object.fromEntries(chart.map((e) => [e.direction, e])) as Record<Direction, DirectionChartEntry>;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full" role="img" aria-label="Sơ đồ tám hướng theo Bát trạch, phía Bắc ở trên">
      {(Object.keys(ANGLE) as Direction[]).map((d) => {
        const e = byDir[d];
        const a = ANGLE[d];
        const p1 = polar(c, c, R, a - 22.5);
        const p2 = polar(c, c, R, a + 22.5);
        const p3 = polar(c, c, r0, a + 22.5);
        const p4 = polar(c, c, r0, a - 22.5);
        const path = `M${p1.x} ${p1.y} A${R} ${R} 0 0 1 ${p2.x} ${p2.y} L${p3.x} ${p3.y} A${r0} ${r0} 0 0 0 ${p4.x} ${p4.y} Z`;
        const isFacing = d === facing;
        const label = polar(c, c, (R + r0) / 2 + 6, a);
        const good = e.star.favorable;
        return (
          <g key={d}>
            <path
              d={path}
              fill={good ? "#d9c38f" : "#7f8aa3"}
              fillOpacity={good ? (isFacing ? 0.42 : 0.2) : isFacing ? 0.32 : 0.08}
              stroke={isFacing ? "#f3e4bd" : "#2a3956"}
              strokeWidth={isFacing ? 2 : 1}
            />
            <text x={label.x} y={label.y - 7} textAnchor="middle" fontSize="13" fontWeight="600" fill="#eee7d7">
              {DIRECTION_NAMES[d]}
            </text>
            <text x={label.x} y={label.y + 11} textAnchor="middle" fontSize="11.5" fill={good ? "#e7d3a2" : "#a3aec2"}>
              {e.star.name}
            </text>
          </g>
        );
      })}
      <circle cx={c} cy={c} r={r0 - 6} fill="#0d1524" stroke="#d9c38f55" />
      <text x={c} y={c - 4} textAnchor="middle" fontSize="11" fill="#a3aec2">
        Bắc ở
      </text>
      <text x={c} y={c + 11} textAnchor="middle" fontSize="11" fill="#a3aec2">
        phía trên
      </text>
    </svg>
  );
}
