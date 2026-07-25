"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { LEADERBOARD, RANK_INFO, TRAINEE } from "@/data/training";
import { cn, formatNumber } from "@/lib/utils";

// Modal BẢNG XẾP HẠNG (web hoá màn app): podium Top 3 (bảng vàng vinh danh),
// danh sách #4 trở đi, và thanh "Bạn" ghim ở đáy kèm điểm cần để vượt hạng.

const PODIUM: Record<
  number,
  { avatar: string; ring: string; crown: string; block: string; num: string; h: string }
> = {
  1: { avatar: "h-20 w-20", ring: "ring-amber-400", crown: "text-amber-400", block: "from-yellow-300 to-amber-500", num: "text-amber-800 text-3xl", h: "h-20" },
  2: { avatar: "h-16 w-16", ring: "ring-slate-300", crown: "text-slate-400", block: "from-slate-200 to-slate-400", num: "text-slate-600 text-2xl", h: "h-14" },
  3: { avatar: "h-16 w-16", ring: "ring-orange-400", crown: "text-orange-500", block: "from-orange-300 to-amber-600", num: "text-amber-900 text-2xl", h: "h-10" },
};

export function LeaderboardModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const top3 = LEADERBOARD.slice(0, 3);
  const rest = LEADERBOARD.slice(3);

  return (
    <div
      className="fixed inset-0 z-[60] flex animate-fade-in items-end justify-center bg-slate-900/70 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex max-h-[92vh] w-full animate-pop-in flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-al-700 to-al-500 px-5 py-4 text-white">
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="absolute right-3 top-3 rounded-lg p-2 text-white/80 hover:bg-white/10"
          >
            <Icon name="X" className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-bold">Bảng xếp hạng</h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/75">
            <Icon name="Crown" className="h-3.5 w-3.5 text-amber-300" />
            Top 100 học viên · Bảng vàng vinh danh
          </p>
        </div>

        {/* Nội dung cuộn */}
        <div className="flex-1 overflow-y-auto">
          {/* Podium Top 3 — thứ tự hiển thị: #2, #1, #3 */}
          <div className="bg-gradient-to-b from-al-50/60 to-white px-5 pb-5 pt-8">
            <div className="flex items-end justify-center gap-3">
              {[top3[1], top3[0], top3[2]].map((u) => {
                const p = PODIUM[u.rank];
                return (
                  <div
                    key={u.rank}
                    className={cn(
                      "flex flex-col items-center",
                      u.rank === 1 ? "w-32" : "w-28"
                    )}
                  >
                    <div className="relative">
                      <Icon
                        name="Crown"
                        className={cn(
                          "absolute -top-5 left-1/2 -translate-x-1/2",
                          u.rank === 1 ? "h-6 w-6" : "h-5 w-5",
                          p.crown
                        )}
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className={cn("rounded-full object-cover ring-4", p.avatar, p.ring)}
                      />
                    </div>
                    <p className="mt-2 w-full truncate text-center text-xs font-bold text-slate-800">
                      {u.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs font-bold text-flame-600">
                      <Icon name="Star" className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {formatNumber(u.points)}
                    </p>
                    <div
                      className={cn(
                        "mt-2 flex w-full items-center justify-center rounded-t-xl bg-gradient-to-b font-bold shadow-inner",
                        p.block,
                        p.num,
                        p.h
                      )}
                    >
                      {u.rank}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Danh sách #4 trở đi */}
          <div className="divide-y divide-slate-100 border-t border-slate-100">
            {rest.map((u) => (
              <div key={u.rank} className="flex items-center gap-3 px-5 py-3">
                <span className="w-8 shrink-0 text-sm font-bold text-slate-500">
                  #{u.rank}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-800">{u.name}</p>
                  <span className="mt-0.5 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                    {u.tier}
                  </span>
                </div>
                <p className="flex shrink-0 items-center gap-1 text-sm font-bold text-slate-700">
                  <Icon name="Star" className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {formatNumber(u.points)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Thanh "Bạn" ghim đáy */}
        <div className="bg-al-800 px-5 py-3.5 text-white">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={TRAINEE.avatar}
              alt="Bạn"
              className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white/30"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold">Bạn</p>
                <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  {TRAINEE.tier}
                </span>
                <span className="text-xs text-white/60">#{RANK_INFO.position}</span>
              </div>
            </div>
            <p className="flex shrink-0 items-center gap-1 text-base font-bold">
              <Icon name="Star" className="h-4 w-4 fill-amber-400 text-amber-400" />
              {formatNumber(TRAINEE.point)}
            </p>
          </div>
          <p className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 text-sm font-semibold text-flame-300">
            <span>
              Cần thêm {RANK_INFO.gapPoint} Point để vượt hạng #{RANK_INFO.gapRank}
            </span>
            <Icon name="ChevronRight" className="h-4 w-4" />
          </p>
        </div>
      </div>
    </div>
  );
}
