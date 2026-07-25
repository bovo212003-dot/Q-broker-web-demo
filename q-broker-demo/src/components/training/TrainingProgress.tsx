"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { LEADERBOARD, RANK_INFO, STREAK, TRAINEE } from "@/data/training";
import { cn, formatNumber } from "@/lib/utils";
import { LeaderboardModal } from "./LeaderboardModal";

// Xếp hạng + Chuyên cần mỗi ngày (dưới hero trang chủ Đào tạo).
// Web hoá từ mobile app: 2 thẻ đặt cạnh nhau trên desktop (xếp hạng trái,
// chuyên cần phải), đủ 7 ngày trên một hàng — không cần cuộn ngang như app.

// Màu huy hiệu hạng 1/2/3 của mini leaderboard.
const RANK_TONE: Record<number, string> = {
  1: "bg-gradient-to-br from-yellow-300 to-amber-500 text-white",
  2: "bg-gradient-to-br from-slate-300 to-slate-400 text-white",
  3: "bg-gradient-to-br from-orange-400 to-amber-700 text-white",
};

export function TrainingProgress() {
  const [boardOpen, setBoardOpen] = useState(false);
  const pct = Math.min(
    100,
    Math.round((TRAINEE.point / RANK_INFO.nextPoint) * 100)
  );
  const remain = Math.max(0, RANK_INFO.nextPoint - TRAINEE.point);

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_1.5fr]">
      {/* ---------- Thẻ xếp hạng ---------- */}
      <div className="flex animate-fade-up flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={TRAINEE.avatar}
            alt={TRAINEE.name}
            className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-amber-200"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold text-slate-800">Bạn</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-600">
                <Icon name="Medal" className="h-3 w-3" />
                {TRAINEE.tier}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-slate-500">
              Xếp hạng hiện tại:{" "}
              <b className="text-slate-800">#{RANK_INFO.position}</b>
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="flex items-center justify-end gap-1 text-xl font-bold text-slate-800">
              <Icon name="Star" className="h-4 w-4 fill-amber-400 text-amber-400" />
              {formatNumber(TRAINEE.point)}
            </p>
            <p className="text-[11px] text-slate-400">Tổng điểm</p>
          </div>
        </div>

        {/* Mini bảng xếp hạng tuần: Top 3 + vị trí của bạn */}
        <div className="flex flex-1 flex-col justify-center py-4">
          <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">
            <Icon name="Trophy" className="h-3.5 w-3.5 text-amber-500" />
            Bảng xếp hạng tuần này
          </p>
          <div className="space-y-1.5">
            {LEADERBOARD.slice(0, 3).map((u) => (
              <div key={u.rank} className="flex items-center gap-2.5 rounded-xl px-2 py-1.5">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold shadow-sm",
                    RANK_TONE[u.rank]
                  )}
                >
                  {u.rank}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
                />
                <p className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700">
                  {u.name}
                </p>
                <p className="shrink-0 text-sm font-bold text-slate-600">
                  {formatNumber(u.points)}
                </p>
              </div>
            ))}

            <p className="text-center text-xs leading-none text-slate-300">•••</p>

            {/* Hàng của bạn — nổi bật */}
            <div className="flex items-center gap-2.5 rounded-xl border border-flame-200 bg-flame-50/70 px-2 py-1.5">
              <span className="flex h-6 min-w-[24px] shrink-0 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-flame-600 ring-1 ring-flame-200">
                {RANK_INFO.position}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={TRAINEE.avatar}
                alt="Bạn"
                className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-flame-200"
              />
              <p className="min-w-0 flex-1 truncate text-sm font-bold text-slate-800">Bạn</p>
              <p className="shrink-0 text-sm font-bold text-flame-600">
                {formatNumber(TRAINEE.point)}
              </p>
            </div>

            {/* Nút mở bảng xếp hạng đầy đủ */}
            <button
              onClick={() => setBoardOpen(true)}
              className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl border border-al-200 py-2 text-sm font-bold text-al-600 transition-colors hover:border-al-300 hover:bg-al-50"
            >
              <Icon name="Trophy" className="h-4 w-4" />
              Xem bảng xếp hạng
            </button>
          </div>
        </div>

        {/* Tiến độ lên cấp */}
        <div className="mt-auto pt-2">
          <p className="text-center text-sm text-slate-600">
            Còn <b className="text-flame-600">{formatNumber(remain)} Point</b>{" "}
            để lên cấp
          </p>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-al-500 to-flame-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500">{TRAINEE.tier}</span>
            <span className="text-flame-600">{pct}%</span>
            <span className="text-slate-400">{RANK_INFO.nextTier}</span>
          </div>
        </div>
      </div>

      {/* ---------- Thẻ chuyên cần mỗi ngày ---------- */}
      {/* flex-col: phần giữa tự giãn đều theo chiều cao thẻ trái, kỷ lục ghim đáy */}
      <div
        style={{ animationDelay: "80ms" }}
        className="flex animate-fade-up flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 font-bold text-slate-800">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-flame-50">
              <Icon name="Flame" className="h-4 w-4 text-flame-500" />
            </span>
            Chuyên cần mỗi ngày
          </h2>
          <span className="rounded-full bg-flame-50 px-3 py-1 text-xs font-bold text-flame-600">
            Chuỗi hiện tại: {STREAK.current} ngày
          </span>
        </div>

        {/* Vùng giữa giãn đều: 7 ngày + mốc thưởng chia đều khoảng trống */}
        <div className="flex flex-1 flex-col justify-evenly">

        {/* 7 ngày — đủ một hàng, không cần cuộn ngang như app */}
        <div className="mt-4 grid grid-cols-7 gap-1.5 sm:gap-2">
          {STREAK.days.map((d) => (
            <div
              key={d.day}
              className={cn(
                "flex flex-col items-center justify-center gap-2.5 rounded-xl border py-6 transition-colors",
                d.done
                  ? "border-flame-200 bg-flame-50/70"
                  : "border-slate-100 bg-slate-50"
              )}
            >
              <span
                className={cn(
                  "text-[10px] font-bold",
                  d.done ? "text-flame-600" : "text-slate-400"
                )}
              >
                N.{d.day}
              </span>
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  d.done
                    ? "bg-gradient-to-br from-flame-400 to-flame-600 text-white shadow-sm"
                    : "bg-white text-slate-300 ring-1 ring-slate-100"
                )}
              >
                <Icon name={d.gift ? "Gift" : "Flame"} className="h-4 w-4" />
              </span>
              <span
                className={cn(
                  "text-[10px] font-bold",
                  d.done ? "text-flame-600" : "text-slate-400"
                )}
              >
                {d.reward}
              </span>
            </div>
          ))}
        </div>

        {/* Mốc nhận thưởng */}
        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="text-sm font-bold text-slate-700">Các mốc nhận thưởng</p>
          <div className="relative mt-3">
            {/* Đường ngang nối các mốc (chạy qua tâm vòng tròn) */}
            <span className="absolute left-8 right-8 top-5 h-0.5 bg-slate-200" />
            <div className="relative flex items-start justify-between">
            {STREAK.milestones.map((m) => {
              const reached = STREAK.current >= m.days;
              const next =
                !reached &&
                STREAK.milestones.find((x) => STREAK.current < x.days)?.days ===
                  m.days;
              return (
                <div key={m.days} className="flex w-16 flex-col items-center gap-1">
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ring-2",
                      reached
                        ? "bg-flame-500 text-white ring-flame-500"
                        : next
                        ? "bg-white text-flame-600 ring-flame-400"
                        : "bg-white text-slate-400 ring-slate-200"
                    )}
                  >
                    {reached ? <Icon name="Check" className="h-4 w-4" /> : m.days}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-bold",
                      reached || next ? "text-flame-600" : "text-slate-500"
                    )}
                  >
                    {m.reward}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Mốc {m.days} ngày
                  </span>
                </div>
              );
            })}
            </div>
          </div>
        </div>

        </div>

        {/* Kỷ lục — ghim đáy thẻ */}
        <p className="mt-auto flex items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2.5 text-xs text-slate-500">
          <Icon name="Trophy" className="h-3.5 w-3.5 text-amber-500" />
          Kỷ lục chuỗi tốt nhất:{" "}
          <b className="text-slate-700">{STREAK.best} ngày liên tiếp</b>
        </p>
      </div>

      {/* Modal bảng xếp hạng đầy đủ */}
      {boardOpen && <LeaderboardModal onClose={() => setBoardOpen(false)} />}
    </section>
  );
}
