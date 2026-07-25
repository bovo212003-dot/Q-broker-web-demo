import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { withRole } from "@/lib/role";
import { RoleId } from "@/types";
import { HeroBanner } from "./HeroBanner";

// Hero đầu tab Trang chủ — gradient navy phẳng + hoạ tiết chấm chìm,
// bên phải là BANNER cuộn ngang 3s (quảng cáo khoá học + thông báo).
// CTA giữ ?role= khi điều hướng.

const MINI_STATS = [
  { value: "16", label: "Chuyên đề" },
  { value: "1200+", label: "Câu hỏi" },
  { value: "90", label: "Đề thi thử" },
];

export function TrainingHero({
  name,
  roleId,
}: {
  name?: string;
  roleId?: RoleId;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-al-800 via-al-700 to-al-600 text-white shadow-lg">
      {/* Hoạ tiết chấm chìm + quầng sáng */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,.07) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-flame-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-al-300/15 blur-3xl" />

      <div className="relative grid items-center gap-8 px-6 py-9 sm:px-10 lg:grid-cols-[1.5fr_1fr]">
        {/* Cột trái */}
        <div>
          <p className="inline-flex animate-fade-up items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur">
            <Icon name="GraduationCap" className="h-3.5 w-3.5 text-flame-400" />
            Trung tâm đào tạo Q-Broker
          </p>
          <h1
            style={{ animationDelay: "70ms" }}
            className="mt-4 animate-fade-up text-3xl font-bold leading-tight sm:text-4xl"
          >
            Chào, {name ?? "bạn"} !
          </h1>
          <p
            style={{ animationDelay: "140ms" }}
            className="mt-2 max-w-lg animate-fade-up text-base text-white/75"
          >
            Chinh phục chứng chỉ hành nghề môi giới với lộ trình chuẩn: học
            chuyên đề, luyện đề sát hạch và theo dõi tiến bộ mỗi ngày.
          </p>

          {/* CTA */}
          <div
            style={{ animationDelay: "210ms" }}
            className="mt-6 flex animate-fade-up flex-wrap gap-3"
          >
            <Link
              href={withRole("/realtor/dao-tao/trac-nghiem", roleId)}
              className="group inline-flex items-center gap-2 rounded-xl bg-flame-500 px-6 py-3 text-sm font-bold shadow-lg shadow-flame-900/30 transition-all hover:-translate-y-0.5 hover:bg-flame-600"
            >
              <Icon name="PencilLine" className="h-4 w-4" />
              Luyện đề ngay
              <Icon
                name="ArrowRight"
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href={withRole("/realtor/dao-tao/chuyen-de", roleId)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3 text-sm font-bold text-white/90 transition-colors hover:border-white/50 hover:bg-white/10"
            >
              <Icon name="BookOpen" className="h-4 w-4" />
              Khám phá chuyên đề
            </Link>
          </div>

          {/* Mini stats */}
          <div
            style={{ animationDelay: "280ms" }}
            className="mt-7 flex animate-fade-up items-center gap-6"
          >
            {MINI_STATS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-6">
                {i > 0 && <span className="h-8 w-px bg-white/15" />}
                <div>
                  <p className="text-xl font-bold leading-tight">{s.value}</p>
                  <p className="text-xs text-white/60">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cột phải: banner khoá học + thông báo (cuộn ngang 3s) */}
        <div style={{ animationDelay: "200ms" }} className="animate-fade-up">
          <HeroBanner />
        </div>
      </div>
    </section>
  );
}
