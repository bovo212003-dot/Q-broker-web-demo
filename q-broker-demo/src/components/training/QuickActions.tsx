import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { QUICK_ACTIONS, QuickAction } from "@/data/training";
import { withRole } from "@/lib/role";
import { RoleId } from "@/types";
import { cn } from "@/lib/utils";

// Lối tắt nhanh — 2 tầng:
//  1) 3 thẻ HỌC CHÍNH (Trắc nghiệm / Chuyên đề / Tự luận): nền pastel dịu,
//     icon trong ô trắng, mô tả + chip thông số, nút mũi tên tròn.
//  2) 6 TIỆN ÍCH còn lại: thẻ trắng gọn một hàng.
// Đủ 9 feature; fade-up so le khi vào trang.

const FEATURED: {
  label: string;
  chips: string[];
  card: string; // nền + viền pastel
  icon: string; // màu icon
  arrow: string; // nền nút mũi tên
}[] = [
  {
    label: "Trắc nghiệm",
    chips: ["40 câu/đề", "120 phút", "Chấm điểm ngay"],
    card: "border-orange-100 bg-orange-50/80 hover:border-orange-200",
    icon: "text-flame-600",
    arrow: "bg-flame-500",
  },
  {
    label: "Chuyên đề",
    chips: ["Cơ sở", "Chuyên môn", "16 chủ đề"],
    card: "border-sky-100 bg-sky-50/80 hover:border-sky-200",
    icon: "text-sky-600",
    arrow: "bg-sky-500",
  },
  {
    label: "Tự luận",
    chips: ["Cơ sở", "Chuyên môn", "Gợi ý đáp án"],
    card: "border-pink-100 bg-pink-50/80 hover:border-pink-200",
    icon: "text-pink-600",
    arrow: "bg-pink-500",
  },
];

const UTIL_TONE: Record<QuickAction["tone"], { bg: string; fg: string }> = {
  rose: { bg: "bg-rose-50", fg: "text-rose-600" },
  sky: { bg: "bg-sky-50", fg: "text-sky-600" },
  pink: { bg: "bg-pink-50", fg: "text-pink-600" },
  slate: { bg: "bg-slate-100", fg: "text-slate-600" },
  flame: { bg: "bg-flame-50", fg: "text-flame-600" },
  amber: { bg: "bg-amber-50", fg: "text-amber-600" },
};

const byLabel = (label: string) => QUICK_ACTIONS.find((a) => a.label === label)!;

export function QuickActions({ roleId }: { roleId?: RoleId }) {
  const featuredLabels = FEATURED.map((f) => f.label);
  const utils = QUICK_ACTIONS.filter((a) => !featuredLabels.includes(a.label));

  return (
    <div className="space-y-4">
      {/* Tầng 1 — 3 thẻ học chính */}
      <div className="grid gap-4 lg:grid-cols-3">
        {FEATURED.map((f, i) => {
          const a = byLabel(f.label);
          return (
            <Link
              key={a.label}
              href={withRole(a.href, roleId)}
              style={{ animationDelay: `${i * 80}ms` }}
              className={cn(
                "group relative animate-fade-up overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60",
                f.card
              )}
            >
              <div className="flex items-start justify-between">
                <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm", f.icon)}>
                  <Icon name={a.icon} className="h-6 w-6" />
                </span>
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-white opacity-0 shadow-md transition-all duration-200 group-hover:opacity-100",
                    f.arrow
                  )}
                >
                  <Icon name="ArrowRight" className="h-4 w-4" />
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">{a.label}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{a.desc}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {f.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-lg bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-slate-600 shadow-sm"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Tầng 2 — 6 tiện ích gọn */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {utils.map((a, i) => {
          const tone = UTIL_TONE[a.tone];
          return (
            <Link
              key={a.label}
              href={withRole(a.href, roleId)}
              title={a.desc}
              style={{ animationDelay: `${240 + i * 50}ms` }}
              className="group flex animate-fade-up items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", tone.bg, tone.fg)}>
                <Icon name={a.icon} className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                {a.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
