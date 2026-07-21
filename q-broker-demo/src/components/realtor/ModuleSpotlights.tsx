import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { withRole } from "@/lib/role";
import { HOME_MODULES, type HomeModule, type ModuleTone } from "@/data/homeModules";
import { RoleId } from "@/types";

// =============================================================
// MODULE SPOTLIGHTS — MỖI TRỤ CỘT LÀ 1 PANEL RIÊNG, viền rõ, xếp dọc.
// Trong panel: vạch màu trên đỉnh + số thứ tự lớn + nội dung + visual mock
// (xen kẽ trái/phải) + badge số liệu nổi trên visual. Luôn hiện đầy đủ.
// Visual dựng bằng gradient + icon (không phụ thuộc ảnh ngoài).
// =============================================================

const TONES: Record<
  ModuleTone,
  {
    text: string; // chữ nhấn (eyebrow, số thứ tự)
    chip: string; // chip số liệu
    bullet: string; // ô icon gạch đầu dòng
    btn: string; // nút CTA
    overlay: string; // lớp phủ màu (gradient trong suốt) đè lên ảnh nền
    wrap: string; // nền + viền của panel ngoài
    bar: string; // vạch màu trên đỉnh panel
    badgeIcon: string; // ô icon trong badge nổi
  }
> = {
  training: {
    text: "text-al-600",
    chip: "bg-white text-al-700 ring-1 ring-al-100",
    bullet: "bg-al-50 text-al-600",
    btn: "bg-al-600 hover:bg-al-700 shadow-al-600/25",
    overlay: "from-al-600/95 via-al-700/85 to-al-900/90",
    wrap: "border-al-100 bg-gradient-to-br from-al-50/60 to-white",
    bar: "from-al-400 to-al-600",
    badgeIcon: "bg-al-50 text-al-600",
  },
  sharing: {
    text: "text-emerald-600",
    chip: "bg-white text-emerald-700 ring-1 ring-emerald-100",
    bullet: "bg-emerald-50 text-emerald-600",
    btn: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25",
    overlay: "from-emerald-600/95 via-teal-700/85 to-teal-900/90",
    wrap: "border-emerald-100 bg-gradient-to-br from-emerald-50/60 to-white",
    bar: "from-emerald-400 to-teal-600",
    badgeIcon: "bg-emerald-50 text-emerald-600",
  },
  demand: {
    text: "text-realtor-600",
    chip: "bg-white text-realtor-700 ring-1 ring-realtor-100",
    bullet: "bg-realtor-50 text-realtor-500",
    btn: "bg-realtor-500 hover:bg-realtor-600 shadow-realtor-500/25",
    overlay: "from-realtor-600/95 via-realtor-700/85 to-realtor-ink/90",
    wrap: "border-realtor-100 bg-gradient-to-br from-realtor-50/60 to-white",
    bar: "from-realtor-400 to-realtor-600",
    badgeIcon: "bg-realtor-50 text-realtor-500",
  },
  live: {
    text: "text-rose-600",
    chip: "bg-white text-rose-700 ring-1 ring-rose-100",
    bullet: "bg-rose-50 text-rose-600",
    btn: "bg-rose-500 hover:bg-rose-600 shadow-rose-500/25",
    overlay: "from-rose-600/95 via-rose-700/85 to-rose-900/90",
    wrap: "border-rose-100 bg-gradient-to-br from-rose-50/60 to-white",
    bar: "from-rose-400 to-rose-600",
    badgeIcon: "bg-rose-50 text-rose-600",
  },
  recruit: {
    text: "text-violet-600",
    chip: "bg-white text-violet-700 ring-1 ring-violet-100",
    bullet: "bg-violet-50 text-violet-600",
    btn: "bg-violet-600 hover:bg-violet-700 shadow-violet-600/25",
    overlay: "from-violet-600/95 via-indigo-700/85 to-indigo-900/90",
    wrap: "border-violet-100 bg-gradient-to-br from-violet-50/60 to-white",
    bar: "from-violet-400 to-indigo-600",
    badgeIcon: "bg-violet-50 text-violet-600",
  },
};

export function ModuleSpotlights({ roleId }: { roleId?: RoleId }) {
  return (
    <section id="dich-vu" className="relative scroll-mt-16 bg-slate-50">
      {/* Nền trang trí mờ */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:radial-gradient(circle_at_1px_1px,theme(colors.slate.200)_1px,transparent_0)] [background-size:26px_26px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        {/* Các panel module xếp dọc */}
        <div className="space-y-8 lg:space-y-10">
          {HOME_MODULES.map((m, i) => (
            <SpotlightPanel
              key={m.id}
              module={m}
              index={i}
              reverse={i % 2 === 1}
              roleId={roleId}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SpotlightPanel({
  module: m,
  index,
  reverse,
  roleId,
}: {
  module: HomeModule;
  index: number;
  reverse: boolean;
  roleId?: RoleId;
}) {
  const t = TONES[m.tone];
  return (
    <Reveal>
      <article
        className={
          "group relative overflow-hidden rounded-[1.75rem] border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl " +
          t.wrap
        }
      >
        {/* Vạch màu trên đỉnh */}
        <span
          className={"absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r " + t.bar}
        />

        <div className="grid items-center gap-8 p-6 pt-8 sm:p-10 sm:pt-11 lg:grid-cols-2 lg:gap-14">
          {/* Nội dung */}
          <div className={reverse ? "lg:order-2" : ""}>
            <div className="flex items-center gap-4">
              <span
                className={
                  "text-4xl font-black leading-none tracking-tight " + t.text
                }
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="h-8 w-px bg-slate-200" />
              <p
                className={
                  "inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] " +
                  t.text
                }
              >
                <Icon name={m.icon} className="h-4 w-4" />
                {m.eyebrow}
              </p>
            </div>

            <h3 className="mt-4 text-2xl font-bold tracking-tight text-realtor-ink sm:text-[28px]">
              {m.title}
            </h3>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-600">
              {m.desc}
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-1">
              {m.bullets.map((b) => (
                <li key={b.text} className="flex items-start gap-3">
                  <span
                    className={
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg " +
                      t.bullet
                    }
                  >
                    <Icon name={b.icon} className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    {b.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* Chip số liệu + CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={withRole(m.href, roleId)}
                className={
                  "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 " +
                  t.btn
                }
              >
                {m.cta}
                <Icon
                  name="ArrowRight"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <div className="flex flex-wrap items-center gap-2">
                {m.stats.map((s) => (
                  <span
                    key={s.label}
                    className={
                      "rounded-full px-3 py-1.5 text-xs font-bold shadow-sm " +
                      t.chip
                    }
                  >
                    {s.value}{" "}
                    <span className="font-medium opacity-70">{s.label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Visual mock */}
          <div className={reverse ? "lg:order-1" : ""}>
            <SpotlightVisual module={m} tone={t} />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

// ---- Visual mock cho từng module -----------------------------------------

function SpotlightVisual({
  module: m,
  tone,
}: {
  module: HomeModule;
  tone: (typeof TONES)[ModuleTone];
}) {
  const primary = m.stats[0];
  return (
    <div className="relative">
      {/* Badge số liệu nổi ở góc */}
      <div className="absolute -left-2 -top-3 z-10 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-xl ring-1 ring-black/5 sm:-left-4">
        <span
          className={
            "flex h-8 w-8 items-center justify-center rounded-lg " +
            tone.badgeIcon
          }
        >
          <Icon name={m.icon} className="h-4 w-4" />
        </span>
        <span className="pr-1">
          <span className="block text-sm font-extrabold leading-none text-realtor-ink">
            {primary.value}
          </span>
          <span className="block text-[11px] font-medium text-slate-400">
            {primary.label}
          </span>
        </span>
      </div>

      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] p-6 shadow-2xl ring-1 ring-black/5 sm:p-8">
        {/* Ảnh nền thật (ken burns nhẹ khi hover) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={m.image}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Lớp phủ màu theo tông + hoạ tiết chấm */}
        <div
          className={"absolute inset-0 bg-gradient-to-br " + tone.overlay}
        />
        <div className="pointer-events-none absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />
        <Icon
          name={m.icon}
          className="pointer-events-none absolute -bottom-8 -right-8 h-48 w-48 text-white/10 transition-transform duration-500 group-hover:scale-110"
        />
        <div className="relative flex h-full flex-col justify-center">
          {m.tone === "training" && <TrainingMock />}
          {m.tone === "sharing" && <SharingMock />}
          {m.tone === "demand" && <DemandMock />}
          {m.tone === "live" && <LiveMock />}
          {m.tone === "recruit" && <RecruitMock />}
        </div>
      </div>
    </div>
  );
}

// Thẻ trắng nổi dùng chung trong các mock.
function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "rounded-2xl bg-white p-4 shadow-lg ring-1 ring-black/5 " + className
      }
    >
      {children}
    </div>
  );
}

// Đào tạo: thẻ khoá học + vòng tiến độ + huy hiệu chứng chỉ.
function TrainingMock() {
  return (
    <div className="space-y-3">
      <GlassCard className="animate-fade-up">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-al-100 text-al-600">
            <Icon name="PlayCircle" className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-800">
              Chứng chỉ hành nghề môi giới
            </p>
            <p className="text-xs text-slate-400">12 chuyên đề · 6 giờ học</p>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-3/4 rounded-full bg-al-500" />
        </div>
        <p className="mt-1.5 text-right text-[11px] font-semibold text-al-600">
          Hoàn thành 75%
        </p>
      </GlassCard>
      <div className="flex items-center gap-3 pl-6 [animation-delay:150ms] animate-fade-up">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-al-600 shadow-lg ring-4 ring-white/40">
          <Icon name="Award" className="h-6 w-6" />
        </span>
        <div className="rounded-xl bg-white/15 px-3 py-2 backdrop-blur">
          <p className="text-xs font-bold text-white">Đã cấp chứng chỉ</p>
          <p className="text-[11px] text-white/80">Ghi nhận trên hồ sơ</p>
        </div>
      </div>
    </div>
  );
}

// Chia sẻ giỏ hàng: 2 bên trao đổi quỹ căn.
function SharingMock() {
  return (
    <div className="space-y-3">
      <GlassCard className="animate-fade-up">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-800">
            Quỹ căn The Origami
          </p>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
            12 căn
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-400">2–3 PN · Đang chia sẻ</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-2">
            {["A", "M", "N"].map((c) => (
              <span
                key={c}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white ring-2 ring-white"
              >
                {c}
              </span>
            ))}
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <Icon name="ArrowLeftRight" className="h-4 w-4" />
            Kết nối
          </span>
        </div>
      </GlassCard>
      <div className="flex items-center gap-2 [animation-delay:150ms] animate-fade-up">
        <span className="rounded-lg bg-white/15 px-3 py-2 text-xs font-semibold text-white backdrop-blur">
          Sàn Đất Vàng
        </span>
        <Icon name="ArrowRight" className="h-4 w-4 text-white/70" />
        <span className="rounded-lg bg-white/15 px-3 py-2 text-xs font-semibold text-white backdrop-blur">
          Ngân hàng VietHome
        </span>
      </div>
    </div>
  );
}

// Cần thuê - mua: thẻ nhu cầu + môi giới đang đấu giá quyền phục vụ.
function DemandMock() {
  return (
    <div className="space-y-3">
      <GlassCard className="animate-fade-up">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-realtor-50 px-2 py-0.5 text-[11px] font-bold text-realtor-600">
            CẦN MUA
          </span>
          <span className="text-xs text-slate-400">Đăng 2 giờ trước</span>
        </div>
        <p className="mt-2 text-sm font-bold text-slate-800">
          Căn hộ 2PN, quận 7
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-medium text-slate-500">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1">
            <Icon name="Wallet" className="h-3.5 w-3.5" /> 3–3.5 tỷ
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1">
            <Icon name="MapPin" className="h-3.5 w-3.5" /> Quận 7
          </span>
        </div>
      </GlassCard>
      <GlassCard className="ml-6 [animation-delay:150ms] animate-fade-up">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-realtor-50 text-realtor-500">
            <Icon name="Gavel" className="h-4 w-4" />
          </span>
          <p className="text-xs font-semibold text-slate-700">
            <span className="font-bold text-realtor-600">3 môi giới</span> đang
            đấu giá quyền phục vụ
          </p>
        </div>
      </GlassCard>
    </div>
  );
}

// Live stream: khung video LIVE + tim bay + nút đấu giá.
function LiveMock() {
  return (
    <div className="relative">
      <GlassCard className="animate-fade-up !bg-slate-900 !p-0 !ring-white/10">
        <div className="flex items-center justify-between px-3 pt-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-bold text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            LIVE
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white">
            <Icon name="Eye" className="h-3.5 w-3.5" /> 8.5K
          </span>
        </div>
        <div className="flex h-28 items-center justify-center">
          <Icon name="Video" className="h-10 w-10 text-white/30" />
        </div>
        <div className="flex items-center gap-2 px-3 pb-3">
          <div className="flex-1 rounded-full bg-white/10 px-3 py-1.5 text-[11px] text-white/60">
            Nhập bình luận…
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white">
            <Icon name="Gavel" className="h-4 w-4" />
          </span>
        </div>
      </GlassCard>
      {/* Tim bay */}
      <Icon
        name="Heart"
        className="absolute -right-1 top-10 h-6 w-6 animate-float fill-rose-400 text-rose-400"
      />
      <Icon
        name="Heart"
        className="absolute right-6 top-20 h-4 w-4 animate-float fill-white text-white [animation-delay:1s]"
      />
    </div>
  );
}

// Tuyển dụng: thẻ tin tuyển + CV gắn Tier.
function RecruitMock() {
  return (
    <div className="space-y-3">
      <GlassCard className="animate-fade-up">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <Icon name="Building2" className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-800">
              Trưởng nhóm KD dự án
            </p>
            <p className="text-xs text-slate-400">Sàn Đất Vàng · Hồ Chí Minh</p>
          </div>
          <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-bold text-violet-600">
            Hot
          </span>
        </div>
      </GlassCard>
      <GlassCard className="ml-6 [animation-delay:150ms] animate-fade-up">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500 text-xs font-bold text-white">
            CV
          </span>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-800">Hồ sơ môi giới</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-600">
                Tier 3
              </span>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-slate-500">
                <Icon name="Star" className="h-3 w-3 fill-amber-400 text-amber-400" />
                4.8 · 320 điểm
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
