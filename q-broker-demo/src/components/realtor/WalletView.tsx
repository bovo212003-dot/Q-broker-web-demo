"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { formatNumber } from "@/lib/utils";
import {
  LINKED_SOURCES,
  WALLET,
  WALLET_TX,
  type LinkedSource,
  type WalletTx,
} from "@/data/wallet";

// =============================================================
// TRANG VÍ Q-BROKER — tham khảo ví điện tử VN (MoMo/ZaloPay/Viettel Money):
// thẻ số dư gradient + ẩn/hiện, thao tác nhanh, lịch sử giao dịch (lọc Thu/Chi),
// nguồn tiền liên kết, điểm thưởng. Nút là demo (chưa gắn logic thanh toán).
// =============================================================

const dong = (n: number) => `${formatNumber(n)} ₫`;

type Filter = "all" | "in" | "out";

export function WalletView() {
  const [show, setShow] = useState(true); // hiện/ẩn số dư
  const [filter, setFilter] = useState<Filter>("all");

  const txs =
    filter === "all" ? WALLET_TX : WALLET_TX.filter((t) => t.type === filter);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        {/* ---------- Thẻ số dư ---------- */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-realtor-ink via-realtor-700 to-realtor-500 p-6 text-white shadow-xl sm:p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 animate-float rounded-full bg-flame-500/30 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.10]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,.6) 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/70">Số dư ví Q-Broker</p>
                <div className="mt-1 flex items-center gap-3">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {show ? dong(WALLET.balance) : "•••••••• ₫"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="rounded-full p-1.5 text-white/80 hover:bg-white/10"
                    aria-label={show ? "Ẩn số dư" : "Hiện số dư"}
                  >
                    <Icon name={show ? "Eye" : "EyeOff"} className="h-5 w-5" />
                  </button>
                </div>
                <p className="mt-1 text-sm text-white/60">{WALLET.accountNo}</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                <Icon name="Wallet" className="h-4 w-4 text-flame-400" />
                Q-Broker Pay
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-realtor-700 shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <Icon name="Plus" className="h-4 w-4" />
                Nạp tiền
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                <Icon name="ArrowUpFromLine" className="h-4 w-4" />
                Rút tiền
              </button>
            </div>
          </div>
        </section>

        {/* ---------- 3 thẻ số liệu ---------- */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MiniStat
            icon="Star"
            iconClass="bg-flame-50 text-flame-500"
            label="Điểm thưởng"
            value={formatNumber(WALLET.points)}
            suffix="điểm"
          />
          <MiniStat
            icon="Clock"
            iconClass="bg-realtor-50 text-realtor-500"
            label="Hoa hồng chờ về"
            value={dong(WALLET.pendingCommission)}
          />
          <MiniStat
            icon="Link2"
            iconClass="bg-slate-100 text-slate-600"
            label="Nguồn liên kết"
            value={String(LINKED_SOURCES.length)}
            suffix="nguồn"
          />
        </div>

        {/* ---------- Thao tác nhanh ---------- */}
        <Card>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            <QuickAction icon="ArrowDownToLine" label="Nạp tiền" color="#2563eb" />
            <QuickAction icon="ArrowUpFromLine" label="Rút tiền" color="#059669" />
            <QuickAction icon="ArrowLeftRight" label="Chuyển tiền" color="#7c3aed" />
            <QuickAction icon="Receipt" label="Thanh toán" color="#db2777" />
            <QuickAction icon="Crown" label="Nạp VIP" color="#f97316" />
            <QuickAction icon="History" label="Lịch sử" color="#0891b2" />
          </div>
        </Card>

        {/* ---------- 2 cột: giao dịch + nguồn liên kết ---------- */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Giao dịch */}
          <div className="lg:col-span-3">
            <Card className="!p-0">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4">
                <h2 className="font-bold text-realtor-ink">Giao dịch gần đây</h2>
                <div className="inline-flex gap-1 rounded-full bg-slate-100 p-1">
                  {(
                    [
                      ["all", "Tất cả"],
                      ["in", "Tiền vào"],
                      ["out", "Tiền ra"],
                    ] as [Filter, string][]
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFilter(key)}
                      className={
                        "rounded-full px-3 py-1 text-xs font-semibold transition-colors " +
                        (filter === key
                          ? "bg-white text-realtor-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-700")
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {txs.map((t) => (
                  <TxRow key={t.id} tx={t} />
                ))}
                {txs.length === 0 && (
                  <p className="py-10 text-center text-sm text-slate-400">
                    Không có giao dịch.
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Nguồn liên kết + điểm thưởng */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-bold text-realtor-ink">Nguồn tiền liên kết</h2>
                <button
                  type="button"
                  className="text-sm font-semibold text-realtor-500 hover:text-realtor-600"
                >
                  + Thêm
                </button>
              </div>
              <div className="space-y-3">
                {LINKED_SOURCES.map((s) => (
                  <SourceRow key={s.id} source={s} />
                ))}
              </div>
            </Card>

            {/* Điểm thưởng */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-flame-600 to-flame-500 p-5 text-white shadow-lg">
              <Icon
                name="Star"
                className="absolute -right-3 -top-3 h-24 w-24 text-white/15"
              />
              <p className="text-sm text-white/80">Điểm thưởng Q-Broker</p>
              <p className="mt-1 text-3xl font-bold">
                {formatNumber(WALLET.points)}
              </p>
              <p className="mt-1 text-xs text-white/70">
                Đổi điểm lấy ưu đãi khoá học, gói VIP và phí dịch vụ.
              </p>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-flame-600 hover:bg-flame-50"
              >
                Đổi thưởng
                <Icon name="ArrowRight" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= Thành phần con =================

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm " + className
      }
    >
      {children}
    </div>
  );
}

function MiniStat({
  icon,
  iconClass,
  label,
  value,
  suffix,
}: {
  icon: string;
  iconClass: string;
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <span
        className={"grid h-11 w-11 shrink-0 place-items-center rounded-xl " + iconClass}
      >
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="truncate font-bold text-realtor-ink">
          {value}
          {suffix && (
            <span className="ml-1 text-xs font-medium text-slate-400">
              {suffix}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  color,
}: {
  icon: string;
  label: string;
  color: string;
}) {
  return (
    <button
      type="button"
      className="flex flex-col items-center gap-2 rounded-2xl px-2 py-3 transition-colors hover:bg-slate-50"
    >
      <span
        className="grid h-12 w-12 place-items-center rounded-2xl text-white shadow-sm"
        style={{ backgroundColor: color }}
      >
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <span className="text-center text-xs font-medium text-slate-600">
        {label}
      </span>
    </button>
  );
}

function TxRow({ tx }: { tx: WalletTx }) {
  const isIn = tx.type === "in";
  return (
    <div className="flex items-center gap-3 p-4">
      <span
        className={
          "grid h-11 w-11 shrink-0 place-items-center rounded-full " +
          (isIn ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500")
        }
      >
        <Icon name={tx.icon} className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-800">{tx.title}</p>
        <p className="truncate text-xs text-slate-400">{tx.method}</p>
        <p className="mt-0.5 text-xs text-slate-400">{tx.date}</p>
      </div>
      <div className="text-right">
        <p
          className={
            "font-bold " + (isIn ? "text-emerald-600" : "text-slate-800")
          }
        >
          {isIn ? "+" : "−"}
          {formatNumber(tx.amount)} ₫
        </p>
        <TxStatus status={tx.status} />
      </div>
    </div>
  );
}

function TxStatus({ status }: { status: WalletTx["status"] }) {
  const map: Record<WalletTx["status"], string> = {
    "Thành công": "text-emerald-600",
    "Đang xử lý": "text-amber-600",
    "Thất bại": "text-rose-600",
  };
  return (
    <p className={"mt-0.5 text-xs font-medium " + map[status]}>{status}</p>
  );
}

function SourceRow({ source }: { source: LinkedSource }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
        style={{ backgroundColor: source.color }}
      >
        <Icon name={source.icon} className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">
          {source.name}
        </p>
        <p className="text-xs text-slate-400">
          {source.kind === "bank" ? "Ngân hàng" : "Ví điện tử"} · {source.number}
        </p>
      </div>
      <Icon name="ChevronRight" className="h-4 w-4 shrink-0 text-slate-300" />
    </div>
  );
}
