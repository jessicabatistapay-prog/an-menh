import { ROMAN, type Suit, type TarotCard } from "@/lib/content/tarot";
import { cn } from "@/lib/utils";

const GOLD = "#d9c38f";
const GOLD_LIGHT = "#f3e4bd";
const SUIT_COLOR: Record<Suit, string> = { gay: "#e3957c", coc: "#7fa8d6", kiem: "#d7dbe2", tien: "#cfae72" };

function SuitSymbol({ suit, x, y, s = 1, color }: { suit: Suit; x: number; y: number; s?: number; color: string }) {
  const common = { fill: "none", stroke: color, strokeWidth: 1.8 / s, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {suit === "gay" && (
        <>
          <line x1={0} y1={-14} x2={0} y2={14} {...common} />
          <path d="M0 -9 q6 -2 7 -8 M0 -3 q-6 -2 -7 -8 M0 3 q6 -2 7 -7" {...common} />
        </>
      )}
      {suit === "coc" && (
        <>
          <path d="M-9 -11 h18 q0 12 -9 15 q-9 -3 -9 -15 z" {...common} />
          <path d="M0 4 v8 M-6 13 h12" {...common} />
        </>
      )}
      {suit === "kiem" && (
        <>
          <path d="M0 -15 l2.5 4 v15 h-5 v-15 z" {...common} />
          <path d="M-7 5 h14 M0 5 v8" {...common} />
          <circle cx={0} cy={14.5} r={1.8} {...common} />
        </>
      )}
      {suit === "tien" && (
        <>
          <circle r={11} {...common} />
          <path d="M0 -8 L4.7 6.5 L-7.6 -2.5 H7.6 L-4.7 6.5 Z" {...common} />
        </>
      )}
    </g>
  );
}

const PIPS: Record<number, [number, number][]> = {
  2: [[100, 120], [100, 220]],
  3: [[100, 100], [100, 170], [100, 240]],
  4: [[70, 120], [130, 120], [70, 220], [130, 220]],
  5: [[70, 115], [130, 115], [100, 170], [70, 225], [130, 225]],
  6: [[70, 100], [130, 100], [70, 170], [130, 170], [70, 240], [130, 240]],
  7: [[70, 100], [130, 100], [100, 135], [70, 170], [130, 170], [70, 240], [130, 240]],
  8: [[70, 100], [130, 100], [100, 135], [70, 170], [130, 170], [100, 205], [70, 240], [130, 240]],
  9: [[70, 95], [130, 95], [70, 145], [130, 145], [100, 170], [70, 195], [130, 195], [70, 245], [130, 245]],
  10: [[70, 95], [130, 95], [100, 120], [70, 150], [130, 150], [70, 190], [130, 190], [100, 220], [70, 245], [130, 245]],
};

function CourtMark({ rank, color }: { rank: number; color: string }) {
  const c = { fill: "none", stroke: color, strokeWidth: 1.8, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  if (rank === 11) return <path d="M100 88 l4 9 10 1 -8 6 3 10 -9 -6 -9 6 3 -10 -8 -6 10 -1 z" {...c} />;
  if (rank === 12) return <path d="M84 112 q16 -28 32 0 M90 112 v-6 M110 112 v-6 M84 112 h32" {...c} />;
  if (rank === 13) return <path d="M84 112 l4 -18 8 10 4 -14 4 14 8 -10 4 18 z" {...c} />;
  return <path d="M80 112 l3 -20 9 12 8 -18 8 18 9 -12 3 20 z M80 116 h40" {...c} />;
}

function MajorGlyph({ n }: { n: number }) {
  const c = { fill: "none", stroke: GOLD, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const dot = { fill: GOLD_LIGHT };
  switch (n) {
    case 0:
      return (
        <g>
          <circle cx={130} cy={115} r={14} {...c} />
          <path d="M55 225 q30 -40 60 -20 t40 -30 M150 175 v70" {...c} />
          <circle cx={95} cy={190} r={4} {...dot} />
        </g>
      );
    case 1:
      return (
        <g>
          <path d="M70 120 c0 -14 26 -14 30 0 c4 14 30 14 30 0 c0 -14 -26 -14 -30 0 c-4 14 -30 14 -30 0 z" {...c} />
          <path d="M100 150 v90 M85 165 l15 -15 15 15" {...c} />
        </g>
      );
    case 2:
      return (
        <g>
          <path d="M62 100 v140 M138 100 v140 M56 100 h12 M132 100 h12" {...c} />
          <path d="M112 140 a24 24 0 1 1 0 46 a18 18 0 1 0 0 -46 z" {...c} />
        </g>
      );
    case 3:
      return (
        <g>
          <circle cx={100} cy={140} r={24} {...c} />
          <path d="M100 164 v46 M82 190 h36 M70 245 q30 -20 60 0" {...c} />
        </g>
      );
    case 4:
      return (
        <g>
          <rect x={65} y={140} width={70} height={90} {...c} />
          <path d="M65 140 l35 -40 35 40 M100 160 v50 M80 185 h40" {...c} />
        </g>
      );
    case 5:
      return <path d="M100 95 v150 M80 120 h40 M72 145 h56 M64 170 h72 M82 245 h36" {...c} />;
    case 6:
      return (
        <g>
          <circle cx={84} cy={185} r={26} {...c} />
          <circle cx={116} cy={185} r={26} {...c} />
          <path d="M100 105 v20 M80 115 l8 10 M120 115 l-8 10" {...c} />
        </g>
      );
    case 7:
      return (
        <g>
          <rect x={66} y={150} width={68} height={50} {...c} />
          <circle cx={78} cy={215} r={13} {...c} />
          <circle cx={122} cy={215} r={13} {...c} />
          <path d="M100 105 l5 12 13 1 -10 8 3 13 -11 -7 -11 7 3 -13 -10 -8 13 -1 z" {...c} />
        </g>
      );
    case 8:
      return (
        <g>
          <path d="M74 115 c0 -11 20 -11 26 0 c6 11 26 11 26 0 c0 -11 -20 -11 -26 0 c-6 11 -26 11 -26 0 z" {...c} />
          <circle cx={100} cy={195} r={34} {...c} />
          <path d="M84 192 q16 16 32 0" {...c} />
        </g>
      );
    case 9:
      return (
        <g>
          <path d="M70 110 l60 135" {...c} />
          <path d="M92 150 l16 0 8 14 -8 14 -16 0 -8 -14 z" {...c} />
          <path d="M100 157 l2.5 5 5.5 .5 -4 4 1 5.5 -5 -3 -5 3 1 -5.5 -4 -4 5.5 -.5 z" {...dot} />
        </g>
      );
    case 10:
      return (
        <g>
          <circle cx={100} cy={170} r={50} {...c} />
          <circle cx={100} cy={170} r={14} {...c} />
          {[0, 45, 90, 135].map((a) => (
            <line key={a} x1={100 - 50 * Math.cos((a * Math.PI) / 180)} y1={170 - 50 * Math.sin((a * Math.PI) / 180)} x2={100 + 50 * Math.cos((a * Math.PI) / 180)} y2={170 + 50 * Math.sin((a * Math.PI) / 180)} {...c} strokeWidth={1.2} />
          ))}
        </g>
      );
    case 11:
      return (
        <g>
          <path d="M100 100 v140 M60 130 h80 M80 240 h40" {...c} />
          <path d="M60 130 l-14 40 h28 z M140 130 l-14 40 h28 z" {...c} />
        </g>
      );
    case 12:
      return (
        <g>
          <path d="M60 100 h80 M100 100 v30" {...c} />
          <path d="M100 130 l-22 60 h44 z" {...c} />
          <circle cx={100} cy={205} r={12} {...c} />
        </g>
      );
    case 13:
      return (
        <g>
          <path d="M55 205 h90" {...c} />
          <path d="M70 205 a30 30 0 0 1 60 0" {...c} />
          <path d="M100 160 v-22 M74 171 l-14 -14 M126 171 l14 -14" {...c} />
          <path d="M100 240 q-12 -14 0 -22 q12 8 0 22 z" {...c} />
        </g>
      );
    case 14:
      return (
        <g>
          <path d="M60 120 h30 q0 22 -15 26 q-15 -4 -15 -26 z M110 190 h30 q0 22 -15 26 q-15 -4 -15 -26 z" {...c} />
          <path d="M80 140 q40 10 45 50" {...c} strokeDasharray="4 4" />
        </g>
      );
    case 15:
      return (
        <g>
          <ellipse cx={84} cy={175} rx={22} ry={14} {...c} />
          <ellipse cx={116} cy={175} rx={22} ry={14} {...c} />
          <path d="M100 110 v30 M100 210 v30" {...c} />
        </g>
      );
    case 16:
      return (
        <g>
          <path d="M82 245 v-110 h36 v110 M76 135 h48 l-24 -28 z" {...c} />
          <path d="M140 95 l-18 28 h12 l-16 30" {...c} />
          <path d="M92 165 h16 M92 195 h16" {...c} />
        </g>
      );
    case 17:
      return (
        <g>
          <path d="M100 110 l9 32 32 9 -32 9 -9 32 -9 -32 -32 -9 32 -9 z" {...c} />
          {[[60, 220], [80, 240], [120, 240], [140, 220], [60, 110], [140, 110], [100, 250]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={3} {...dot} />
          ))}
        </g>
      );
    case 18:
      return (
        <g>
          <path d="M118 110 a32 32 0 1 0 0 60 a26 26 0 1 1 0 -60 z" {...c} />
          <path d="M60 245 v-40 h14 v40 M126 245 v-40 h14 v40 M50 250 q12 -8 25 0 t25 0 t25 0 t25 0" {...c} />
        </g>
      );
    case 19:
      return (
        <g>
          <circle cx={100} cy={170} r={28} {...c} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6;
            return <line key={i} x1={100 + 38 * Math.cos(a)} y1={170 + 38 * Math.sin(a)} x2={100 + 54 * Math.cos(a)} y2={170 + 54 * Math.sin(a)} {...c} />;
          })}
        </g>
      );
    case 20:
      return (
        <g>
          <path d="M60 150 l70 -30 v60 z M130 140 h14 v20 h-14" {...c} />
          <path d="M70 215 v30 M100 205 v40 M130 215 v30" {...c} />
        </g>
      );
    default:
      return (
        <g>
          <ellipse cx={100} cy={172} rx={40} ry={62} {...c} />
          <ellipse cx={100} cy={172} rx={30} ry={52} {...c} strokeDasharray="2 5" />
          {[[45, 95], [155, 95], [45, 250], [155, 250]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={4} {...dot} />
          ))}
        </g>
      );
  }
}

export function TarotFace({ card, reversed = false, className }: { card: TarotCard; reversed?: boolean; className?: string }) {
  const color = card.suit ? SUIT_COLOR[card.suit] : GOLD;
  const top = card.arcana === "major" ? ROMAN[card.number] : card.number <= 10 ? (card.number === 1 ? "Át" : String(card.number)) : "";
  return (
    <svg viewBox="0 0 200 340" className={cn("h-auto w-full", className)} role="img" aria-label={`${card.name}${reversed ? " (ngược)" : ""}`}>
      <g transform={reversed ? "rotate(180 100 170)" : undefined}>
        <rect x={1} y={1} width={198} height={338} rx={14} fill="#121c31" stroke={GOLD} strokeOpacity={0.7} strokeWidth={1.5} />
        <rect x={9} y={9} width={182} height={322} rx={9} fill="none" stroke={GOLD} strokeOpacity={0.3} />
        <text x={100} y={42} textAnchor="middle" fontSize={20} fill={GOLD_LIGHT} style={{ fontFamily: "var(--font-display)" }}>
          {top}
        </text>
        {card.arcana === "major" ? (
          <MajorGlyph n={card.number} />
        ) : card.number === 1 ? (
          <g>
            <circle cx={100} cy={170} r={52} fill="none" stroke={color} strokeOpacity={0.25} />
            <SuitSymbol suit={card.suit!} x={100} y={170} s={3} color={color} />
          </g>
        ) : card.number <= 10 ? (
          PIPS[card.number]!.map(([x, y], i) => <SuitSymbol key={i} suit={card.suit!} x={x} y={y} s={1.15} color={color} />)
        ) : (
          <g>
            <CourtMark rank={card.number} color={GOLD} />
            <SuitSymbol suit={card.suit!} x={100} y={190} s={2.4} color={color} />
          </g>
        )}
        <text x={100} y={300} textAnchor="middle" fontSize={card.name.length > 14 ? 15 : 18} fontWeight={600} fill={GOLD_LIGHT} style={{ fontFamily: "var(--font-display)" }}>
          {card.name}
        </text>
        <text x={100} y={318} textAnchor="middle" fontSize={10} fill="#a3aec2">
          {card.en}
        </text>
      </g>
    </svg>
  );
}

export function TarotBack({ className }: { className?: string }) {
  const pts = [0, 1, 2, 3, 4].map((i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return [100 + 40 * Math.cos(a), 170 + 40 * Math.sin(a)] as const;
  });
  const star = [0, 2, 4, 1, 3].map((i, k) => `${k ? "L" : "M"}${pts[i]![0].toFixed(1)} ${pts[i]![1].toFixed(1)}`).join(" ") + "Z";
  return (
    <svg viewBox="0 0 200 340" className={cn("h-auto w-full", className)} aria-hidden>
      <rect x={1} y={1} width={198} height={338} rx={14} fill="#16233d" stroke={GOLD} strokeOpacity={0.7} strokeWidth={1.5} />
      <rect x={12} y={12} width={176} height={316} rx={8} fill="none" stroke={GOLD} strokeOpacity={0.35} />
      <circle cx={100} cy={170} r={62} fill="none" stroke={GOLD} strokeOpacity={0.35} />
      <circle cx={100} cy={170} r={70} fill="none" stroke={GOLD} strokeOpacity={0.2} strokeDasharray="1 6" />
      <path d={star} fill="none" stroke={GOLD} strokeOpacity={0.8} />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} fill={GOLD_LIGHT} />
      ))}
      {[[40, 50], [160, 50], [40, 290], [160, 290], [100, 60], [100, 280]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.6} fill={GOLD_LIGHT} opacity={0.6} />
      ))}
    </svg>
  );
}
