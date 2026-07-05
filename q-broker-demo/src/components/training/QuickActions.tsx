import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { QUICK_ACTIONS, QuickAction } from "@/data/training";
import { withRole } from "@/lib/role";
import { RoleId } from "@/types";

// Lưới lối tắt nhanh (6 ô) — tái hiện block Quick Actions của mobile app.
const TONE: Record<QuickAction["tone"], { bg: string; fg: string }> = {
  rose: { bg: "bg-rose-50", fg: "text-rose-500" },
  sky: { bg: "bg-sky-50", fg: "text-sky-500" },
  pink: { bg: "bg-pink-50", fg: "text-pink-500" },
  slate: { bg: "bg-slate-100", fg: "text-slate-500" },
  flame: { bg: "bg-flame-50", fg: "text-flame-500" },
  amber: { bg: "bg-amber-50", fg: "text-amber-500" },
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
            className="group flex animate-fade-up flex-col items-center gap-2.5 rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-al-200 hover:shadow-md"
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone.bg} ${tone.fg} transition-transform group-hover:scale-110`}
            >
              <Icon name={a.icon} className="h-6 w-6" />
            </span>
            <span className="text-xs font-semibold text-slate-700 sm:text-sm">
              {a.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
