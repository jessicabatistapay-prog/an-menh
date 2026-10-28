/** Bầu trời sao tĩnh, sinh theo hạt giống cố định để server và client giống nhau. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const rand = seeded(20260128);
const STARS = Array.from({ length: 70 }, () => ({
  x: +(rand() * 100).toFixed(2),
  y: +(rand() * 100).toFixed(2),
  r: +(0.4 + rand() * 1.1).toFixed(2),
  o: +(0.15 + rand() * 0.5).toFixed(2),
  twinkle: rand() < 0.12,
  delay: +(rand() * 6).toFixed(2),
}));

export function StarField() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <svg className="h-full w-full" preserveAspectRatio="none">
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.r}
            fill="#efe3c4"
            opacity={s.o}
            className={s.twinkle ? "twinkle" : undefined}
            style={s.twinkle ? { animationDelay: `${s.delay}s` } : undefined}
          />
        ))}
      </svg>
    </div>
  );
}
