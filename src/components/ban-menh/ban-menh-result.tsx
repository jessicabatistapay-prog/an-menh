import Link from "next/link";
import { ElementDot, ElementRing } from "@/components/app/element-ring";
import { Note, Panel, Section } from "@/components/app/page-header";
import { buttonVariants } from "@/components/ui/button";
import { BAT_TRACH_TABLE, DIRECTION_NAMES, GROUP_NAMES, STARS } from "@/lib/core/battrach";
import type { BanMenhResult } from "@/lib/core/banmenh";
import { EARTHLY_BRANCHES, HEAVENLY_STEMS } from "@/lib/core/canchi";
import { formatVietnameseDate } from "@/lib/core/date";
import { ELEMENTS, type ElementKey } from "@/lib/core/elements";
import { lunarMonthName } from "@/lib/core/lunar";
import { ELEMENT_INSIGHTS } from "@/lib/content/insights";

function sentence(words: string[]) {
  const t = words.join(", ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function Swatches({ element }: { element: ElementKey }) {
  return (
    <span className="flex gap-1" aria-hidden>
      {ELEMENTS[element].swatches.map((c) => (
        <span key={c} className="size-5 rounded-full border border-white/10" style={{ background: c }} />
      ))}
    </span>
  );
}

export function BanMenhResultView({
  result,
  name,
  onRequestCungPhi,
}: {
  result: BanMenhResult;
  name?: string;
  onRequestCungPhi?: () => void;
}) {
  const { lunar, canChi, napAm, relations, cungPhi } = result;
  const el = ELEMENTS[napAm.element];
  const insight = ELEMENT_INSIGHTS[napAm.element];
  const stem = HEAVENLY_STEMS[canChi.stemIndex];
  const branch = EARTHLY_BRANCHES[canChi.branchIndex];

  return (
    <article aria-labelledby="ket-qua-title">
      <header>
        <h2 id="ket-qua-title" tabIndex={-1} className="font-display text-4xl font-semibold leading-tight text-[#f3e6c4] outline-none md:text-5xl">
          {name ? `Bản mệnh của ${name}` : "Bản mệnh của bạn"}
        </h2>
        <p className="mt-2 text-muted-foreground">
          Sinh ngày {formatVietnameseDate(result.birthDate)} dương lịch, tức ngày {lunar.day} {lunarMonthName(lunar.month, lunar.isLeapMonth)} năm{" "}
          {canChi.name} ({lunar.year}) âm lịch.
        </p>
      </header>

      <div className="mt-6 grid items-center gap-6 md:grid-cols-[1fr_15rem]">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
          <div>
            <dt className="text-sm text-muted-foreground">Năm âm lịch</dt>
            <dd className="font-display text-3xl font-semibold text-[#f3e6c4]">{lunar.year}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Can Chi</dt>
            <dd className="font-display text-3xl font-semibold text-[#f3e6c4]">{canChi.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Con giáp</dt>
            <dd className="font-display text-3xl font-semibold text-[#f3e6c4]">{result.zodiac}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Mệnh nạp âm</dt>
            <dd className="flex items-center gap-2 font-display text-3xl font-semibold text-[#f3e6c4]">
              <ElementDot element={napAm.element} />
              {el.name}
            </dd>
          </div>
        </dl>
        <div className="mx-auto w-full max-w-[13rem]">
          <ElementRing highlight={napAm.element} title={`Đồ hình ngũ hành, làm nổi hành ${el.name}`} />
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {result.bornBeforeTet && result.tetOfBirthYear ? (
          <Note>
            Bạn sinh trước Tết Nguyên đán năm {result.birthDate.year} (Tết rơi vào ngày {formatVietnameseDate(result.tetOfBirthYear)}), nên
            theo âm lịch bạn thuộc năm {lunar.year} – {canChi.name}, không phải năm {result.birthDate.year}.
          </Note>
        ) : result.tetOfBirthYear ? (
          <Note>
            Tết Nguyên đán năm {result.birthDate.year} rơi vào ngày {formatVietnameseDate(result.tetOfBirthYear)}. Bạn sinh sau Tết nên năm
            âm lịch là {lunar.year}.
          </Note>
        ) : null}
        {result.historicalNote && (
          <Note tone="warn">
            Lưu ý về lịch cũ: lịch âm Việt Nam trước năm 1968 (và ở miền Nam đến năm 1975) thường được tính theo múi giờ UTC+8. Theo cách
            tính đó, ngày sinh của bạn là ngày {result.historicalNote.lunarUtc8.day}{" "}
            {lunarMonthName(result.historicalNote.lunarUtc8.month, result.historicalNote.lunarUtc8.isLeapMonth)} năm{" "}
            {result.historicalNote.canChiUtc8}
            {result.historicalNote.yearDiffers ? ", tức thuộc một năm âm lịch khác" : ""}. An Mệnh dùng thống nhất múi giờ UTC+7; hãy đối
            chiếu với giấy tờ hoặc lịch gia đình nếu cần.
          </Note>
        )}
      </div>

      <Section title={`Nạp âm: ${napAm.name}`} id="nap-am">
        <p className="leading-relaxed text-foreground/90">
          <span className="font-display text-xl italic text-[#e7d3a2]">{napAm.meaning}.</span> Đây là nạp âm của cặp {napAm.pair[0]} –{" "}
          {napAm.pair[1]}, thuộc hành {el.name}. {insight.summary}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Nạp âm xét cả cặp Can Chi của năm, nên có thể khác với hành riêng của Can và Chi: Can {stem} thuộc hành{" "}
          {ELEMENTS[result.stemElement].name}, Chi {branch} thuộc hành {ELEMENTS[result.branchElement].name}.
        </p>
      </Section>

      <Section title="Tương sinh, tương khắc" id="sinh-khac" description="Quan hệ của hành nạp âm với bốn hành còn lại.">
        <dl className="grid gap-3 sm:grid-cols-2">
          {[
            { k: relations.supportedBy, label: "Được nuôi dưỡng bởi", text: `${ELEMENTS[relations.supportedBy].name} sinh ${el.name}` },
            { k: relations.supports, label: "Nuôi dưỡng", text: `${el.name} sinh ${ELEMENTS[relations.supports].name}` },
            { k: relations.controls, label: "Chế ngự", text: `${el.name} khắc ${ELEMENTS[relations.controls].name}` },
            { k: relations.controlledBy, label: "Được chế ngự bởi", text: `${ELEMENTS[relations.controlledBy].name} khắc ${el.name}` },
          ].map((r) => (
            <div key={r.label} className="flex items-center gap-3 rounded-xl border border-border bg-[#15213a99] px-4 py-3">
              <ElementDot element={r.k} />
              <div>
                <dt className="text-sm text-muted-foreground">{r.label}</dt>
                <dd className="font-medium">{r.text}</dd>
              </div>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Tương khắc trong quan niệm ngũ hành mang nghĩa kiềm chế để giữ cân bằng, không có nghĩa là xung đột hay điều xấu.
        </p>
      </Section>

      <Section title="Màu sắc tham khảo" id="mau-sac">
        <ul className="grid gap-3">
          {result.colors.harmonious.map((c) => (
            <li key={c.element} className="flex items-center justify-between gap-4 border-b border-[#2a395680] pb-3">
              <div>
                <p className="font-medium">{sentence(c.colors)}</p>
                <p className="text-sm text-muted-foreground">{c.reason}</p>
              </div>
              <Swatches element={c.element} />
            </li>
          ))}
          {result.colors.useSparingly.map((c) => (
            <li key={c.element} className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{sentence(c.colors)}</p>
                <p className="text-sm text-muted-foreground">{c.reason}</p>
              </div>
              <Swatches element={c.element} />
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          Đây là quy ước phổ biến để tham khảo khi chọn đồ dùng hay trang trí. Màu bạn thấy dễ chịu vẫn là lựa chọn tốt nhất.
        </p>
      </Section>

      <Section title="Gợi ý suy ngẫm" id="dien-giai">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-display text-xl font-semibold text-[#f1e3bf]">Điểm mạnh thường gắn với hành {el.name}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-foreground/90 marker:text-primary">
              {insight.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-[#f1e3bf]">Điều có thể cân bằng</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-foreground/90 marker:text-primary">
              {insight.balance.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-5 border-l-2 border-primary pl-4 font-display text-xl italic leading-snug text-[#e7d3a2]">{insight.reflection}</p>
      </Section>

      <Section title="Cung phi" id="cung-phi">
        {cungPhi ? (
          <Panel>
            <p className="text-sm text-muted-foreground">
              {cungPhi.gender === "nam" ? "Nam" : "Nữ"} sinh năm âm lịch {cungPhi.lunarYear}
            </p>
            <p className="mt-1 font-display text-3xl font-semibold text-[#f3e6c4]">
              Cung {cungPhi.trigram.name}, hành {ELEMENTS[cungPhi.trigram.element].name}
            </p>
            <p className="mt-1">Thuộc nhóm {GROUP_NAMES[cungPhi.trigram.group]} trong hệ Bát trạch.</p>
            {cungPhi.rawNumber === 5 && (
              <p className="mt-2 text-sm text-muted-foreground">
                Số Lạc Thư tính được là 5 (trung cung, không có quẻ), nên theo quy ước {cungPhi.gender === "nam" ? "nam quy về Khôn" : "nữ quy về Cấn"}.
              </p>
            )}
            <p className="mt-4 text-sm text-muted-foreground">Bốn hướng được xem là thuận theo Bát trạch:</p>
            <ul className="mt-2 grid grid-cols-2 gap-2 text-sm">
              {(["sinhKhi", "thienY", "dienNien", "phucVi"] as const).map((s) => (
                <li key={s} className="rounded-lg border border-[#d9c38f33] px-3 py-2">
                  <span className="block text-muted-foreground">{STARS[s].name}</span>
                  <span className="font-medium">{DIRECTION_NAMES[BAT_TRACH_TABLE[cungPhi.trigram.key][s]]}</span>
                </li>
              ))}
            </ul>
            <Link href="/phong-thuy" className={buttonVariants({ variant: "outline", size: "sm", className: "mt-4" })}>
              Xem phong thủy nhà ở
            </Link>
          </Panel>
        ) : (
          <Panel>
            <p className="leading-relaxed">
              Cung phi cần thêm thông tin giới tính, vì quy ước truyền thống tính cung phi khác nhau cho nam và nữ cùng năm sinh.
            </p>
            {onRequestCungPhi && (
              <button type="button" onClick={onRequestCungPhi} className={buttonVariants({ variant: "outline", size: "sm", className: "mt-4" })}>
                Thêm thông tin để xem cung phi
              </button>
            )}
          </Panel>
        )}
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Nạp âm và cung phi là hai hệ quy chiếu khác nhau. Nạp âm dựa trên cặp Can Chi của năm sinh (60 năm lặp lại một vòng); cung phi
          dựa trên số Lạc Thư và Bát quái, có tính đến giới tính. Vì vậy hành của cung phi có thể khác hành nạp âm. Cả hai đều dùng năm âm
          lịch tính từ Tết Nguyên đán.
        </p>
      </Section>
    </article>
  );
}
