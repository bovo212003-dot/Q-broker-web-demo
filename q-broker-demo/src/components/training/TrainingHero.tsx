import { Icon } from "@/components/ui/Icon";
import { TRAINEE } from "@/data/training";
import { formatNumber } from "@/lib/utils";

// Hero chào mừng đầu tab Trang chủ — nền gradient navy Automation Land,
// khối trang trí bay lơ lửng (animate-float) tạo cảm giác trẻ trung.
export function TrainingHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-al-700 via-al-600 to-al-500 px-6 py-8 text-white shadow-lg sm:px-10 sm:py-10">
      {/* Đốm trang trí */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-flame-500/30 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-al-300/20 blur-2xl" />
      <div className="pointer-events-none absolute right-10 top-8 hidden animate-float sm:block">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
          <Icon name="GraduationCap" className="h-7 w-7 text-white" />
        </span>
      </div>

      <div className="relative max-w-2xl">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur">
          <Icon name="Sparkles" className="h-3.5 w-3.5 text-flame-400" />
          Trung tâm đào tạo Q-Broker
        </p>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
          Chào, {TRAINEE.name} 👋
        </h1>
        <p className="mt-2 text-base text-white/80">
          Hôm nay bạn muốn học gì? Chọn một chuyên đề hoặc luyện đề ngay bên dưới.
        </p>

        {/* Chip hạng & điểm */}
        <div className="mt-5 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 text-sm font-semibold backdrop-blur">
            <Icon name="Medal" className="h-4 w-4 text-flame-400" />
            Hạng {TRAINEE.tier}
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 text-sm font-semibold backdrop-blur">
            <Icon name="Star" className="h-4 w-4 text-flame-400" />
            {formatNumber(TRAINEE.point)} điểm
          </span>
        </div>
      </div>
    </section>
  );
}
