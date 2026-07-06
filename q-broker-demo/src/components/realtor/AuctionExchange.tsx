"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Icon } from "@/components/ui/Icon";
import { formatVnd } from "@/data/realtorListings";
import {
  AUCTION_LOTS,
  AuctionBid,
  AuctionLot,
  BIDDER_NAMES,
  INITIAL_MARKETS,
  PricePoint,
} from "@/data/auctionLive";
import { LegalModal } from "./LegalModal";

// =============================================================
// SÀN ĐẤU GIÁ — bảng điện kiểu cafef/HOSE cho các lô BĐS
// - Chỉ số phiên (số lô đang khớp, giá trị đã chốt, lượt trả, chênh TB)
// - Trái: bảng điện — mỗi lô 1 hàng, ô giá loé xanh khi có lượt trả
// - Phải: chi tiết lô đang chọn — video live thu nhỏ, biểu đồ diễn
//   biến giá (đường vàng = khởi điểm), sổ lệnh, panel đặt lệnh
// - Quy ước màu bảng điện VN: vàng = khởi điểm, xanh lá = tăng,
//   đỏ = LIVE, tím = chốt vượt 10% khởi điểm
// - Mô phỏng realtime phía client; khi một lô chốt, lô "sắp mở"
//   kế tiếp được đưa lên LIVE để sàn không bao giờ trống.
// =============================================================

const ROUND_SECONDS = 45;
// Màu biểu đồ đã chạy qua validator dataviz trên nền slate-950/900.
const CHART_LINE = "#059669"; // đường giá (emerald-600)
const CHART_REF = "#d97706"; // đường khởi điểm (amber-600)

type Phase = "bidding" | "sold";

/** Trạng thái realtime của một lô đã lên sàn */
interface Market {
  price: number;
  bids: AuctionBid[]; // mới nhất đứng đầu
  countdown: number;
  phase: Phase;
  history: PricePoint[]; // cũ -> mới, vẽ biểu đồ
}

const LOT_MAP: Record<string, AuctionLot> = Object.fromEntries(
  AUCTION_LOTS.map((l) => [l.id, l])
);

const timeStr = () => new Date().toLocaleTimeString("vi-VN", { hour12: false });
const shortTime = () => timeStr().slice(0, 5); // "14:02"

/** "4.400.000.000 đ" — kiểu bảng giá đầy đủ số */
const fullVnd = (v: number) => `${v.toLocaleString("vi-VN")} đ`;

/** "4,4 tỷ" gọn cho trục Y biểu đồ */
const tyAxis = (v: number) =>
  `${(v / 1e9).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} tỷ`;

const pctOf = (price: number, start: number) => ((price - start) / start) * 100;

const fmtPct = (p: number) =>
  `${p >= 0 ? "+" : ""}${p.toLocaleString("vi-VN", { maximumFractionDigits: 1 })}%`;

const buildInitialMarkets = (): Record<string, Market> =>
  Object.fromEntries(
    Object.entries(INITIAL_MARKETS).map(([id, init]) => [
      id,
      {
        price: init.bids[0].price,
        bids: init.bids,
        countdown: ROUND_SECONDS,
        phase: "bidding" as Phase,
        history: init.history,
      },
    ])
  );

export function AuctionExchange({ initialLotId }: { initialLotId?: string }) {
  const [markets, setMarkets] = useState<Record<string, Market>>(
    buildInitialMarkets
  );
  const [selectedId, setSelectedId] = useState(
    initialLotId && LOT_MAP[initialLotId] ? initialLotId : AUCTION_LOTS[0].id
  );
  const [steps, setSteps] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [legalOpen, setLegalOpen] = useState(false);

  const idRef = useRef(1000); // sinh id cho bid mới
  // Hạn mức bot còn lại của từng lô — hết hạn mức thì đồng hồ chạy về 0
  // và lô được chốt giá.
  const botBudgets = useRef<Record<string, number>>({ a1: 5, a2: 4, a3: 6 });
  // Các lô "sắp mở" chưa được đưa lên LIVE (theo thứ tự).
  const promoteQueue = useRef(
    AUCTION_LOTS.filter((l) => l.status === "upcoming").map((l) => l.id)
  );
  const handledSold = useRef<Set<string>>(new Set());
  const toastTimer = useRef<number | undefined>(undefined);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  /** Trả về market mới sau một lượt trả giá (bot hoặc của bạn) */
  const applyBid = useCallback(
    (mk: Market, lot: AuctionLot, name: string, stepsN: number, mine?: boolean): Market => {
      const price = mk.price + lot.step * stepsN;
      const bid: AuctionBid = {
        id: ++idRef.current,
        name,
        price,
        delta: stepsN,
        time: timeStr(),
        mine,
      };
      return {
        ...mk,
        price,
        countdown: ROUND_SECONDS,
        bids: [bid, ...mk.bids].slice(0, 30),
        history: [...mk.history, { time: shortTime(), price }].slice(-80),
      };
    },
    []
  );

  // ---- Nhịp chính 1s: bot trả giá / đếm ngược cho MỌI lô đang khớp ----
  useEffect(() => {
    const iv = setInterval(() => {
      setMarkets((prev) => {
        const next: Record<string, Market> = { ...prev };
        for (const id of Object.keys(next)) {
          const mk = next[id];
          if (mk.phase !== "bidding") continue;
          const lot = LOT_MAP[id];
          const hot = mk.countdown <= 8;
          const budget = botBudgets.current[id] ?? 0;
          if (budget > 0 && Math.random() < (hot ? 0.4 : 0.15)) {
            botBudgets.current[id] = budget - 1;
            next[id] = applyBid(
              mk,
              lot,
              BIDDER_NAMES[Math.floor(Math.random() * BIDDER_NAMES.length)],
              Math.random() < 0.8 ? 1 : 2
            );
          } else {
            const cd = mk.countdown - 1;
            next[id] =
              cd <= 0 ? { ...mk, countdown: 0, phase: "sold" } : { ...mk, countdown: cd };
          }
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [applyBid]);

  // ---- Lô vừa chốt -> sau 20s đưa lô "sắp mở" kế tiếp lên LIVE ----
  useEffect(() => {
    const soldIds = Object.keys(markets).filter(
      (id) => markets[id].phase === "sold" && !handledSold.current.has(id)
    );
    if (soldIds.length === 0) return;
    const timers = soldIds.map((soldId) => {
      handledSold.current.add(soldId);
      return window.setTimeout(() => {
        const nextId = promoteQueue.current.shift();
        if (!nextId) return;
        const lot = LOT_MAP[nextId];
        botBudgets.current[nextId] = 4 + Math.floor(Math.random() * 5);
        setMarkets((prev) => ({
          ...prev,
          [nextId]: {
            price: lot.startPrice,
            bids: [
              {
                id: ++idRef.current,
                name: "Giá khởi điểm",
                price: lot.startPrice,
                delta: 0,
                time: timeStr(),
              },
            ],
            countdown: ROUND_SECONDS,
            phase: "bidding",
            history: [{ time: shortTime(), price: lot.startPrice }],
          },
        }));
      }, 20_000);
    });
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [markets]);

  const placeOrder = () => {
    const mk = markets[selectedId];
    const lot = LOT_MAP[selectedId];
    if (!mk || mk.phase !== "bidding") return;
    setMarkets((prev) => ({
      ...prev,
      [selectedId]: applyBid(prev[selectedId], lot, "Bạn", steps, true),
    }));
    showToast(`Đặt lệnh thành công: ${formatVnd(mk.price + lot.step * steps)}`);
  };

  const lot = LOT_MAP[selectedId];
  const market: Market | undefined = markets[selectedId];
  const yourPrice = market ? market.price + lot.step * steps : 0;

  // ---- Chỉ số phiên (tính từ mọi lô đã lên sàn) ----
  const stats = useMemo(() => {
    const list = Object.entries(markets);
    const liveCount = list.filter(([, m]) => m.phase === "bidding").length;
    const soldValue = list
      .filter(([, m]) => m.phase === "sold")
      .reduce((s, [, m]) => s + m.price, 0);
    const totalBids = list.reduce(
      (s, [, m]) => s + m.bids.filter((b) => b.delta > 0).length,
      0
    );
    const pcts = list.map(([id, m]) => pctOf(m.price, LOT_MAP[id].startPrice));
    const avgPct = pcts.length
      ? pcts.reduce((s, p) => s + p, 0) / pcts.length
      : 0;
    return { liveCount, soldValue, totalBids, avgPct };
  }, [markets]);

  return (
    <section className="bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {/* ===== CHỈ SỐ PHIÊN HÔM NAY ===== */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Lô đang khớp lệnh",
              value: `${stats.liveCount}`,
              icon: "Radio",
              tone: "text-rose-400",
            },
            {
              label: "Giá trị đã chốt",
              value: stats.soldValue > 0 ? formatVnd(stats.soldValue) : "0 đ",
              icon: "Landmark",
              tone: "text-violet-400",
            },
            {
              label: "Tổng lượt trả giá",
              value: `${stats.totalBids}`,
              icon: "Activity",
              tone: "text-emerald-400",
            },
            {
              label: "Chênh TB so khởi điểm",
              value: fmtPct(stats.avgPct),
              icon: "TrendingUp",
              tone: "text-emerald-400",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3"
            >
              <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-slate-500">
                <Icon name={s.icon} className={`h-3.5 w-3.5 ${s.tone}`} />
                {s.label}
              </p>
              <p className={`mt-1 font-mono text-xl font-extrabold ${s.tone}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_400px]">
          {/* ===== BẢNG ĐIỆN CÁC LÔ ===== */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300">
                <Icon name="Gavel" className="h-4 w-4 text-amber-400" />
                Bảng điện sàn đấu giá
              </p>
              <p className="hidden items-center gap-3 text-[10px] uppercase tracking-wide text-slate-500 sm:flex">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-amber-400" /> Khởi điểm
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-emerald-400" /> Tăng
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-violet-400" /> Đã chốt
                </span>
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-2 text-left">Mã</th>
                    <th className="px-3 py-2 text-left">Tài sản</th>
                    <th className="px-3 py-2 text-right">Khởi điểm</th>
                    <th className="px-3 py-2 text-right">Giá hiện tại</th>
                    <th className="px-3 py-2 text-right">+/-</th>
                    <th className="px-3 py-2 text-right">Lượt</th>
                    <th className="px-3 py-2 text-right">Còn lại</th>
                    <th className="px-3 py-2 text-center">Phiên</th>
                  </tr>
                </thead>
                <tbody>
                  {AUCTION_LOTS.map((l) => {
                    const mk = markets[l.id];
                    const pct = mk ? pctOf(mk.price, l.startPrice) : 0;
                    const soldHot = mk?.phase === "sold" && pct >= 10;
                    const urgent =
                      mk?.phase === "bidding" && mk.countdown <= 10;
                    return (
                      <tr
                        key={l.id}
                        onClick={() => setSelectedId(l.id)}
                        className={`cursor-pointer border-b border-slate-800/60 transition-colors last:border-0 ${
                          l.id === selectedId
                            ? "bg-slate-800/70"
                            : "hover:bg-slate-800/40"
                        }`}
                      >
                        <td className="px-3 py-2.5 font-mono font-bold text-sky-400">
                          {l.code}
                        </td>
                        <td className="max-w-[180px] truncate px-3 py-2.5 text-slate-300">
                          {l.title}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono font-semibold text-amber-400">
                          {formatVnd(l.startPrice)}
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          {mk ? (
                            <span
                              key={mk.price}
                              className={`animate-price-flash inline-block font-mono font-bold ${
                                soldHot ? "text-violet-400" : "text-white"
                              }`}
                            >
                              {formatVnd(mk.price)}
                            </span>
                          ) : (
                            <span className="font-mono text-slate-600">—</span>
                          )}
                        </td>
                        <td
                          className={`px-3 py-2.5 text-right font-mono font-bold ${
                            !mk
                              ? "text-slate-600"
                              : soldHot
                                ? "text-violet-400"
                                : pct > 0
                                  ? "text-emerald-400"
                                  : "text-amber-400"
                          }`}
                        >
                          {mk ? fmtPct(pct) : "—"}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-slate-300">
                          {mk ? mk.bids.filter((b) => b.delta > 0).length : "—"}
                        </td>
                        <td
                          className={`px-3 py-2.5 text-right font-mono font-bold ${
                            !mk
                              ? "text-slate-500"
                              : mk.phase === "sold"
                                ? "text-slate-600"
                                : urgent
                                  ? "animate-pulse text-rose-400"
                                  : "text-emerald-400"
                          }`}
                        >
                          {!mk
                            ? l.startLabel
                            : mk.phase === "sold"
                              ? "—"
                              : `00:${String(mk.countdown).padStart(2, "0")}`}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          {!mk ? (
                            <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-400">
                              Sắp mở
                            </span>
                          ) : mk.phase === "sold" ? (
                            <span className="rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-violet-400">
                              Đã chốt
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-400">
                              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-rose-400" />
                              Live
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="border-t border-slate-800 px-4 py-2.5 text-[11px] text-slate-500">
              Bấm vào một mã để xem diễn biến chi tiết và đặt lệnh. Khi một lô
              chốt giá, lô kế tiếp trong hàng chờ sẽ tự động lên sàn.
            </p>
          </div>

          {/* ===== CHI TIẾT LÔ ĐANG CHỌN ===== */}
          <div className="flex flex-col gap-4">
            {/* --- Video live thu nhỏ + tên lô --- */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <div className="relative h-36">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lot.image}
                  alt={lot.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />
                {market?.phase === "bidding" && (
                  <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-rose-600 px-2 py-1 text-[10px] font-bold uppercase text-white">
                    <span className="h-1.5 w-1.5 animate-ping rounded-full bg-white" />
                    Live
                  </span>
                )}
                <Link
                  href="/realtor/livestream"
                  className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm hover:bg-black/70"
                >
                  <Icon name="PlayCircle" className="h-3.5 w-3.5" />
                  Xem livestream
                </Link>
                <div className="absolute bottom-2 left-3 right-3">
                  <p className="font-mono text-xs font-bold text-sky-400">
                    {lot.code}
                  </p>
                  <p className="truncate text-sm font-bold text-white">
                    {lot.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-slate-800 px-4 py-2.5 text-[11px] text-slate-400">
                <span className="flex min-w-0 items-center gap-1 truncate">
                  <Icon name="MapPin" className="h-3 w-3 shrink-0" />
                  {lot.address}, {lot.city}
                </span>
                {lot.legalInfo && (
                  <button
                    type="button"
                    onClick={() => setLegalOpen(true)}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-700 px-2 py-1 font-semibold text-slate-300 hover:bg-slate-800"
                  >
                    <Icon name="FileText" className="h-3 w-3" />
                    Hồ sơ pháp lý
                  </button>
                )}
              </div>
            </div>

            {/* --- Diễn biến giá + sổ lệnh + đặt lệnh --- */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300">
                  <Icon name="LineChart" className="h-4 w-4 text-emerald-400" />
                  Diễn biến giá
                </p>
                {market?.phase === "bidding" && (
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-xs font-bold ${
                      market.countdown <= 10
                        ? "animate-pulse bg-rose-500/20 text-rose-400"
                        : "bg-slate-800 text-emerald-400"
                    }`}
                  >
                    <Icon name="Timer" className="h-3.5 w-3.5" />
                    00:{String(market.countdown).padStart(2, "0")}
                  </span>
                )}
              </div>

              {market ? (
                <>
                  {/* Giá hiện tại */}
                  <div className="px-4 pb-1 pt-3 text-center">
                    <p
                      key={market.price}
                      className="animate-price-flash font-mono text-2xl font-extrabold tracking-tight text-white"
                    >
                      {fullVnd(market.price)}
                    </p>
                    <p className="mt-0.5 text-xs">
                      <span className="font-bold text-emerald-400">
                        ▲ {fmtPct(pctOf(market.price, lot.startPrice))}
                      </span>{" "}
                      <span className="text-slate-500">so với khởi điểm</span>{" "}
                      <span className="font-semibold text-amber-400">
                        {formatVnd(lot.startPrice)}
                      </span>
                    </p>
                  </div>

                  {/* Biểu đồ giá theo thời gian thực */}
                  <div className="h-44 px-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={market.history}
                        margin={{ top: 12, right: 12, bottom: 0, left: 0 }}
                      >
                        <CartesianGrid
                          stroke="#1e293b"
                          strokeDasharray="3 3"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="time"
                          tick={{ fill: "#64748b", fontSize: 10 }}
                          tickLine={false}
                          axisLine={{ stroke: "#334155" }}
                          minTickGap={28}
                        />
                        <YAxis
                          domain={[
                            (min: number) => min - lot.step,
                            (max: number) => max + lot.step,
                          ]}
                          tickFormatter={tyAxis}
                          tick={{ fill: "#64748b", fontSize: 10 }}
                          tickLine={false}
                          axisLine={false}
                          width={52}
                        />
                        <Tooltip
                          formatter={(v) => [fullVnd(Number(v)), "Giá"]}
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            border: "1px solid #334155",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                          labelStyle={{ color: "#94a3b8" }}
                          itemStyle={{ color: "#e2e8f0" }}
                        />
                        <ReferenceLine
                          y={lot.startPrice}
                          stroke={CHART_REF}
                          strokeDasharray="4 4"
                          label={{
                            value: "Khởi điểm",
                            fill: CHART_REF,
                            fontSize: 10,
                            position: "insideBottomLeft",
                          }}
                        />
                        <Line
                          type="stepAfter"
                          dataKey="price"
                          stroke={CHART_LINE}
                          strokeWidth={2}
                          dot={false}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Sổ lệnh: 3 lượt trả dẫn đầu */}
                  <div className="border-t border-slate-800 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Sổ lệnh — dẫn đầu
                    </p>
                    <div className="mt-2 space-y-1.5">
                      {market.bids.slice(0, 3).map((b, i) => (
                        <div
                          key={b.id}
                          className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-xs ${
                            i === 0
                              ? "bg-emerald-500/10"
                              : b.mine
                                ? "bg-sky-500/10"
                                : "bg-slate-800/50"
                          }`}
                        >
                          <span className="w-4 shrink-0 font-mono font-bold text-slate-500">
                            {i + 1}
                          </span>
                          <span
                            className={`min-w-0 flex-1 truncate font-semibold ${
                              b.mine ? "text-sky-400" : "text-slate-300"
                            }`}
                          >
                            {b.mine ? "Bạn" : b.name}
                          </span>
                          <span className="shrink-0 font-mono text-[10px] text-slate-500">
                            {b.time}
                          </span>
                          <span className="shrink-0 font-mono font-bold text-white">
                            {formatVnd(b.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Panel đặt lệnh */}
                  <div className="border-t border-slate-800 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Đặt lệnh trả giá
                    </p>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {[1, 2, 5].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setSteps(m)}
                          className={`rounded-lg border py-1.5 text-xs font-bold transition-colors ${
                            steps === m
                              ? "border-emerald-500 bg-emerald-500/15 text-emerald-400"
                              : "border-slate-700 text-slate-400 hover:bg-slate-800"
                          }`}
                        >
                          +{m} bước
                        </button>
                      ))}
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={steps}
                        onChange={(e) =>
                          setSteps(
                            Math.max(1, Math.min(20, Number(e.target.value) || 1))
                          )
                        }
                        aria-label="Số bước giá"
                        className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-center font-mono text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <p className="mt-2.5 flex items-baseline justify-between text-xs">
                      <span className="text-slate-500">Giá của bạn sẽ là</span>
                      <span className="font-mono text-base font-extrabold text-emerald-400">
                        {fullVnd(yourPrice)}
                      </span>
                    </p>
                    <button
                      type="button"
                      disabled={market.phase !== "bidding"}
                      onClick={placeOrder}
                      className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Icon name="Gavel" className="h-4 w-4" />
                      {market.phase === "bidding"
                        ? `Đặt lệnh +${steps} bước (+${formatVnd(lot.step * steps)})`
                        : "Phiên đã chốt giá"}
                    </button>
                    <p className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
                      <Icon name="Wallet" className="h-3 w-3" />
                      Tiền đặt trước {formatVnd(lot.deposit)} · {lot.bidders} nhà
                      đầu tư đủ điều kiện
                    </p>
                  </div>
                </>
              ) : (
                /* Lô chưa mở phiên */
                <div className="px-4 py-8 text-center">
                  <Icon
                    name="Clock"
                    className="mx-auto h-8 w-8 text-slate-600"
                  />
                  <p className="mt-2 text-sm font-semibold text-white">
                    Phiên mở lúc {lot.startLabel}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Giá khởi điểm{" "}
                    <span className="font-semibold text-amber-400">
                      {formatVnd(lot.startPrice)}
                    </span>{" "}
                    · Tiền đặt trước {formatVnd(lot.deposit)}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      showToast(`Đã đăng ký tham gia lô ${lot.code}`)
                    }
                    className="mt-4 rounded-lg bg-realtor-500 px-4 py-2 text-xs font-bold text-white hover:bg-realtor-600"
                  >
                    Đăng ký tham gia
                  </button>
                </div>
              )}
            </div>

            {/* Lịch sử khớp lệnh */}
            {market && (
              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                <p className="border-b border-slate-800 px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-300">
                  Lịch sử khớp lệnh
                </p>
                <div className="max-h-48 overflow-y-auto">
                  {market.bids.map((b, i) => (
                    <div
                      key={b.id}
                      className={`flex items-center justify-between gap-2 px-4 py-2 text-xs ${
                        i === 0 ? "animate-slide-in bg-emerald-500/10" : ""
                      } ${b.mine ? "bg-sky-500/10" : ""}`}
                    >
                      <span className="w-14 shrink-0 font-mono text-slate-500">
                        {b.time}
                      </span>
                      <span
                        className={`min-w-0 flex-1 truncate font-semibold ${
                          b.mine ? "text-sky-400" : "text-slate-300"
                        }`}
                      >
                        {b.mine ? "Bạn" : b.name}
                      </span>
                      {b.delta > 0 && (
                        <span className="shrink-0 text-emerald-400">
                          +{b.delta} bước
                        </span>
                      )}
                      <span className="shrink-0 font-mono font-bold text-white">
                        {formatVnd(b.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast xác nhận đặt lệnh / đăng ký */}
      {toast && (
        <div className="animate-toast fixed bottom-20 left-1/2 z-[80] flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-2xl ring-1 ring-white/10">
          <Icon name="Check" className="h-4 w-4 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Popup hồ sơ pháp lý của lô đang chọn */}
      {legalOpen && <LegalModal lot={lot} onClose={() => setLegalOpen(false)} />}
    </section>
  );
}
