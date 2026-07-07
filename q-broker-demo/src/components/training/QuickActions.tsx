import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { QUICK_ACTIONS, QuickAction } from "@/data/training";
import { withRole } from "@/lib/role";
import { RoleId } from "@/types";

// Lưới lối tắt nhanh (6 ô) — tile gradient nguyên khối kiểu quick-action app:
// icon trong vòng kính mờ, watermark icon lớn phía sau, shine quét + bóng màu
// nổi lên khi hover. Đổ bóng màu ngay khi nghỉ để tile như "nổi" trên nền.
const TONE: Record<QuickAction["tone"], { grad: string; shadow: string }> = {
  rose: { grad: "from-rose-500 to-rose-600", shadow: "shadow-rose-500/40" },
  sky: { grad: "from-sky-500 to-sky-600", shadow: "shadow-sky-500/40" },
  pink: { grad: "from-pink-500 to-pink-600", shadow: "shadow-pink-500/40" },
  slate: { grad: "from-slate-500 to-slate-700", shadow: "shadow-slate-500/40" },
  flame: { grad: "from-flame-500 to-flame-600", shadow: "shadow-flame-500/40" },
  amber: { grad: "from-amber-500 to-orange-600", shadow: "shadow-amber-500/40" },
};

export function QuickActions({ roleId }: { roleId?: RoleId }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-6">
      {QUICK_ACTIONS.map((a, i) => {
        const tone = TONE[a.tone];
        return (
          <Link
            key={a.label}
            href={withRole(a.href, roleId)}
            style={{ animationDelay: `${i * 60}ms` }}
            className={`group relative flex animate-fade-up flex-col items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br ${tone.grad} p-4 text-center shadow-lg ${tone.shadow} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl`}
          >
            {/* Watermark icon lớn phía sau — phóng to & nghiêng khi hover */}
            <Icon
              name={a.icon}
              className="pointer-events-none absolute -bottom-4 -right-3 h-24 w-24 text-white/10 transition-all duration-500 group-hover:-rotate-12 group-hover:scale-125 group-hover:text-white/20"
            />

            {/* Lớp bóng gương phía trên cho tile bóng bẩy */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent" />

            {/* Shine quét chéo khi hover */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[140%]" />

            {/* Icon trong vòng kính mờ */}
            <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white ring-1 ring-white/40 backdrop-blur transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
              <Icon name={a.icon} className="h-6 w-6" />
            </span>

            <span className="relative z-10 text-xs font-bold text-white drop-shadow sm:text-sm">
              {a.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
