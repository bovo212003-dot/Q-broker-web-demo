"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Icon } from "@/components/ui/Icon";
import {
  DEMO_EARNINGS,
  DEMO_LINK,
  DEMO_REFERRALS,
  DEMO_STATS,
  REFERRAL_STATUS,
} from "@/data/affiliate";

// Màu chart lấy theo design token (SVG không nhận class Tailwind
// nên phải truyền hex): realtor-500 / slate-200 / slate-500.
const CHART = {
  bar: "#2563eb", // realtor-500
  grid: "#e2e8f0", // slate-200
  tick: "#64748b", // slate-500
};

/** Tooltip tuỳ biến: "Tháng 6 — 45.000.000 đ" */
function EarningsTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value?: number | string }[];
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  const v = Number(payload[0]?.value ?? 0);
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-slate-500">Tháng {String(label).replace("T", "")}</p>
      <p className="mt-0.5 font-mono text-sm font-bold text-realtor-ink">
        {(v * 1_000_000).toLocaleString("vi-VN")} đ
      </p>
    </div>
  );
}

// =============================================================
// DASHBOARD ĐỐI TÁC (demo) — mô phỏng trang theo dõi realtime
// kiểu ShareASale/Zillow: link giới thiệu + 4 chỉ số chính +
// bảng lịch sử khách giới thiệu với trạng thái đối soát.
// =============================================================

export function AffiliateDashboard() {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(DEMO_LINK);
    } catch {
      // Trình duyệt chặn clipboard -> vẫn báo đã copy cho demo mượt.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-realtor-500">
            Minh bạch từng cú click
          </p>
          <h2 className="mt-2 text-2xl font-bold text-realtor-ink sm:text-3xl">
            Dashboard đối tác theo dõi realtime
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
            Mỗi lượt bấm link, mỗi khách để lại thông tin và từng đồng hoa hồng
            đều được ghi nhận tức thì — bạn luôn biết khách của mình đang ở bước nào.
          </p>
        </div>

        {/* Link giới thiệu + nút copy */}
        <div className="mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-realtor-50 text-realtor-500">
            <Icon name="Link2" className="h-5 w-5" />
          </span>
          <code className="min-w-0 flex-1 truncate font-mono text-sm text-slate-700">
            {DEMO_LINK}
          </code>
          <button
            type="button"
            onClick={copyLink}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
              copied ? "bg-emerald-500" : "bg-realtor-500 hover:bg-realtor-600"
            }`}
          >
            <Icon name={copied ? "Check" : "Copy"} className="h-4 w-4" />
            {copied ? "Đã sao chép" : "Sao chép"}
          </button>
        </div>

        {/* 4 chỉ số chính */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {DEMO_STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Icon name={s.icon} className="h-4 w-4 text-realtor-500" />
                {s.label}
              </p>
              <p className="mt-2 text-xl font-extrabold text-realtor-ink sm:text-2xl">
                {s.value}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{s.note}</p>
            </div>
          ))}
        </div>

        {/* Biểu đồ hoa hồng 6 tháng gần nhất (1 chuỗi -> không cần legend) */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-realtor-ink">
            <Icon name="TrendingUp" className="h-4 w-4 text-realtor-500" />
            Hoa hồng 6 tháng gần nhất
          </p>
          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEMO_EARNINGS} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid
                  vertical={false}
                  stroke={CHART.grid}
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: CHART.tick }}
                />
                <YAxis
                  width={44}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: CHART.tick }}
                  tickFormatter={(v: number) => `${v} tr`}
                />
                <Tooltip
                  cursor={{ fill: "rgba(37, 99, 235, 0.06)" }}
                  content={<EarningsTooltip />}
                />
                <Bar
                  dataKey="value"
                  fill={CHART.bar}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={44}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bảng khách giới thiệu gần đây */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <p className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 text-sm font-bold text-realtor-ink">
            <Icon name="History" className="h-4 w-4 text-realtor-500" />
            Khách giới thiệu gần đây
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2.5 font-semibold">Khách hàng</th>
                  <th className="px-4 py-2.5 font-semibold">Sản phẩm / dịch vụ</th>
                  <th className="px-4 py-2.5 font-semibold">Ngày</th>
                  <th className="px-4 py-2.5 font-semibold">Giá trị</th>
                  <th className="px-4 py-2.5 font-semibold">Hoa hồng</th>
                  <th className="px-4 py-2.5 font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_REFERRALS.map((r) => {
                  const st = REFERRAL_STATUS[r.status];
                  return (
                    <tr key={r.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        {r.customer}
                      </td>
                      <td className="max-w-56 truncate px-4 py-3 text-slate-600">
                        {r.product}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                        {r.date}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {r.value}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-bold text-realtor-ink">
                        {r.commission}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${st.className}`}
                        >
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
