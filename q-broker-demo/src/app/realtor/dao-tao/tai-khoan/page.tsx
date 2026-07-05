"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ACCOUNT_MENU, TRAINEE } from "@/data/training";
import { formatNumber } from "@/lib/utils";

// TAB TÀI KHOẢN — hồ sơ học viên, tiến trình hạng & danh sách cài đặt.
const NEXT_TIER = { name: "Bạc II", need: 20_000 };

export default function TaiKhoanPage() {
  const [copied, setCopied] = useState(false);
  const pct = Math.min(100, Math.round((TRAINEE.point / NEXT_TIER.need) * 100));

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(TRAINEE.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* demo: bỏ qua nếu trình duyệt chặn clipboard */
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Hồ sơ */}
      <div className="flex flex-col items-center rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={TRAINEE.avatar}
            alt={TRAINEE.name}
            className="h-24 w-24 rounded-full object-cover ring-4 ring-al-100"
          />
          <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-flame-500 text-white">
            <Icon name="Medal" className="h-3.5 w-3.5" />
          </span>
        </div>
        <h1 className="mt-4 text-xl font-bold text-al-700">{TRAINEE.name}</h1>
        <button
          onClick={copyId}
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-200"
        >
          ID: {TRAINEE.id}
          <Icon name={copied ? "Check" : "Copy"} className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Tiến trình hạng */}
      <div className="rounded-3xl bg-gradient-to-br from-al-700 to-al-500 p-6 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70">Hạng hiện tại</p>
            <p className="text-lg font-bold">{TRAINEE.tier}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/70">Tổng điểm</p>
            <p className="text-lg font-bold text-flame-400">
              {formatNumber(TRAINEE.point)}
            </p>
          </div>
        </div>
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-flame-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-white/70">
          Còn {formatNumber(NEXT_TIER.need - TRAINEE.point)} điểm để lên hạng{" "}
          <b className="text-white">{NEXT_TIER.name}</b>.
        </p>
      </div>

      {/* Nâng cấp VIP */}
      <button className="flex w-full items-center gap-4 rounded-3xl border border-flame-200 bg-flame-50 p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-flame-500 text-white">
          <Icon name="Crown" className="h-6 w-6" />
        </span>
        <span className="flex-1">
          <span className="block font-bold text-flame-600">Nâng cấp gói VIP</span>
          <span className="block text-sm text-flame-600/80">
            Mở khoá toàn bộ đề thi & tài liệu cao cấp, gỡ quảng cáo.
          </span>
        </span>
        <Icon name="ChevronRight" className="h-5 w-5 text-flame-500" />
      </button>

      {/* Danh sách cài đặt */}
      <div className="space-y-3">
        {ACCOUNT_MENU.map((item) => (
          <button
            key={item.label}
            className="flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition-colors hover:border-al-200 hover:bg-al-50/40"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-al-50 text-al-600">
              <Icon name={item.icon} className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-slate-800">
                {item.label}
              </span>
              {item.desc && (
                <span className="block text-xs text-slate-400">{item.desc}</span>
              )}
            </span>
            <Icon name="ChevronRight" className="h-5 w-5 text-slate-300" />
          </button>
        ))}
      </div>
    </div>
  );
}
