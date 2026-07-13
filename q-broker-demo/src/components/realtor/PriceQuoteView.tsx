"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { RoleId } from "@/types";
import { withRole } from "@/lib/role";
import { formatVnd } from "@/lib/utils";
import { LISTINGS } from "@/data/realtorListings";
import {
  QUOTE_BANKS,
  DEFAULT_QUOTE_INPUT,
  computeQuote,
  formatFull,
  type QuoteInput,
} from "@/data/priceQuote";

// Chỉ giữ chữ số -> number (dùng cho ô nhập giá có phân tách nghìn).
function parseDigits(v: string): number {
  const n = Number(v.replace(/\D/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function PriceQuoteView({
  agentName = "Môi giới Q-Broker",
  roleId,
}: {
  agentName?: string;
  roleId?: RoleId;
}) {
  const [input, setInput] = useState<QuoteInput>(DEFAULT_QUOTE_INPUT);
  const [copied, setCopied] = useState(false);
  const [bankOpen, setBankOpen] = useState(false); // dropdown ngân hàng
  const bankRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown ngân hàng khi click ra ngoài.
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (bankRef.current && !bankRef.current.contains(e.target as Node))
        setBankOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Bảng giá tham khảo mở cho mọi vai trò (khách, môi giới...).
  const bank = QUOTE_BANKS.find((b) => b.id === input.bankId) ?? QUOTE_BANKS[0];
  const listing = LISTINGS.find((l) => l.id === input.listingId);
  const result = useMemo(() => computeQuote(input, bank), [input, bank]);

  const patch = (p: Partial<QuoteInput>) => {
    setInput((prev) => ({ ...prev, ...p }));
    setCopied(false);
  };

  // Chọn căn từ giỏ hàng -> nạp luôn giá niêm yết.
  const pickListing = (id: string) => {
    const l = LISTINGS.find((x) => x.id === id);
    patch({ listingId: id || undefined, price: l ? l.price : input.price });
  };

  const today = new Date().toLocaleDateString("vi-VN");

  const copySummary = async () => {
    const lines = [
      `PHIẾU TÍNH GIÁ — Q-BROKER`,
      listing ? `Sản phẩm: ${listing.address}, ${listing.city}` : null,
      `Giá niêm yết: ${formatFull(input.price)}`,
      `Chiết khấu ${input.discountPct}%: -${formatFull(result.discountAmount)}`,
      `Giá sau chiết khấu: ${formatFull(result.netPrice)}`,
      `Vốn tự có: ${formatFull(result.ownCapital)}`,
      `Vay ${bank.name} (${input.ltvPct}%): ${formatFull(result.loanAmount)}`,
      `Trả tháng đầu: ${formatFull(result.monthlyFirst)} • Bình quân: ${formatFull(result.monthlyAvg)}/tháng`,
      `Kỳ hạn ${input.termYears} năm — ưu đãi ${bank.promoRate}%/năm (${bank.promoMonths} tháng đầu), sau đó ${bank.rate}%/năm`,
      `— ${agentName} • ${today}`,
    ].filter(Boolean);
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Print: CHỈ in đúng tấm phiếu (data-quote), ẩn mọi thứ khác kể cả
          header/footer của trang. Kỹ thuật: ẩn toàn bộ rồi hiện lại riêng
          tấm phiếu và đưa nó lên đầu trang giấy. */}
      <style>{`
        @media print {
          body { background: #fff !important; }
          body * { visibility: hidden !important; }
          [data-quote], [data-quote] * { visibility: visible !important; }
          [data-quote] {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }
          @page { margin: 12mm; }
        }
      `}</style>

      {/* Banner */}
      <div
        data-noprint
        className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-realtor-600 to-realtor-500 px-6 py-7 text-white shadow-card sm:px-8"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide">
          <Icon name="Zap" className="h-3.5 w-3.5" />
          Chốt deal nhanh
        </span>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Phiếu tính giá 30 giây</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-white/80">
          Nhập giá, chiết khấu và phương án vay — nhận ngay bảng cơ cấu vốn, trả góp
          ngân hàng và tiến độ thanh toán. Xuất phiếu đẹp gửi khách tức thì.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* ---------------- CỘT TRÁI: FORM ---------------- */}
        <section
          data-noprint
          className="lg:col-span-2 space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
        >
          {/* Chọn căn từ giỏ hàng */}
          <Field label="Chọn căn từ giỏ hàng" hint="(tuỳ chọn — tự điền giá)">
            <div className="relative">
              <select
                value={input.listingId ?? ""}
                onChange={(e) => pickListing(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pr-9 text-sm font-medium text-slate-800 focus:border-realtor-500 focus:outline-none focus:ring-2 focus:ring-realtor-100"
              >
                <option value="">— Nhập giá thủ công —</option>
                {LISTINGS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.address} • {formatVnd(l.price)}
                  </option>
                ))}
              </select>
              <Icon
                name="ChevronDown"
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
            </div>
          </Field>

          {/* Giá niêm yết */}
          <Field label="Giá niêm yết">
            <div className="relative">
              <input
                inputMode="numeric"
                value={input.price.toLocaleString("vi-VN")}
                onChange={(e) => patch({ price: parseDigits(e.target.value) })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-right text-sm font-bold text-slate-900 focus:border-realtor-500 focus:outline-none focus:ring-2 focus:ring-realtor-100"
              />
              <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                ₫
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">≈ {formatVnd(input.price)}</p>
          </Field>

          {/* Chiết khấu */}
          <SliderField
            label="Chiết khấu"
            value={input.discountPct}
            min={0}
            max={15}
            step={0.5}
            suffix="%"
            onChange={(v) => patch({ discountPct: v })}
            valueText={`-${formatVnd(result.discountAmount)}`}
          />

          {/* Tỷ lệ vay */}
          <SliderField
            label="Tỷ lệ vay ngân hàng"
            value={input.ltvPct}
            min={0}
            max={bank.maxLtv}
            step={5}
            suffix="%"
            onChange={(v) => patch({ ltvPct: v })}
            valueText={`Vay ${formatVnd(result.loanAmount)} • tối đa ${bank.maxLtv}%`}
          />

          {/* Ngân hàng — dropdown */}
          <Field label="Ngân hàng cho vay">
            <div ref={bankRef} className="relative">
              <button
                type="button"
                onClick={() => setBankOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-realtor-500 focus:outline-none focus:ring-2 focus:ring-realtor-100"
                aria-haspopup="listbox"
                aria-expanded={bankOpen}
              >
                <span className="flex min-w-0 items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bank.logo}
                    alt={bank.short}
                    className="h-6 w-6 shrink-0 rounded-md"
                  />
                  <span className="truncate">{bank.name}</span>
                </span>
                <Icon
                  name="ChevronDown"
                  className={
                    "h-4 w-4 shrink-0 text-slate-400 transition-transform " +
                    (bankOpen ? "rotate-180" : "")
                  }
                />
              </button>

              {bankOpen && (
                <div
                  className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
                  role="listbox"
                >
                  {QUOTE_BANKS.map((b) => {
                    const active = b.id === input.bankId;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          patch({ bankId: b.id, ltvPct: Math.min(input.ltvPct, b.maxLtv) });
                          setBankOpen(false);
                        }}
                        className={
                          "flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-slate-50 " +
                          (active ? "bg-realtor-50" : "")
                        }
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={b.logo}
                            alt={b.short}
                            className="h-6 w-6 shrink-0 rounded-md"
                          />
                          <span
                            className={
                              "truncate font-semibold " +
                              (active ? "text-realtor-700" : "text-slate-700")
                            }
                          >
                            {b.name}
                          </span>
                        </span>
                        <span className="shrink-0 text-xs text-slate-400">
                          ưu đãi {b.promoRate}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              Ưu đãi {bank.promoRate}%/năm trong {bank.promoMonths} tháng, sau đó {bank.rate}%/năm.
            </p>
          </Field>

          {/* Kỳ hạn — thanh kéo */}
          <SliderField
            label="Kỳ hạn vay"
            value={input.termYears}
            min={5}
            max={30}
            step={1}
            suffix=" năm"
            onChange={(v) => patch({ termYears: v })}
            valueText={`${input.termYears} năm • ${input.termYears * 12} tháng`}
          />

          {/* Nhân viên hỗ trợ khoản vay theo ngân hàng đã chọn */}
          <Field
            label={`Nhân viên hỗ trợ khoản vay (${bank.sales.length})`}
          >
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bank.logo} alt={bank.short} className="h-5 w-5 rounded" />
              {bank.name}
            </div>
            <div className="space-y-2">
              {bank.sales.map((rep) => {
                const consultHref = withRole(
                  `/realtor/tin-nhan?bank=${bank.id}&rep=${rep.id}` +
                    (input.listingId ? `&product=${input.listingId}` : ""),
                  roleId,
                );
                return (
                  <div
                    key={rep.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-2.5"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: bank.color }}
                    >
                      {rep.name.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {rep.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">{rep.title}</p>
                    </div>
                    <Link
                      href={consultHref}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-realtor-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-realtor-600"
                    >
                      <Icon name="MessageCircle" className="h-3.5 w-3.5" />
                      Tư vấn ngay
                    </Link>
                  </div>
                );
              })}
            </div>
          </Field>
        </section>

        {/* ---------------- CỘT PHẢI: PHIẾU ---------------- */}
        <section className="lg:col-span-3">
          {/* Nút hành động */}
          <div data-noprint className="mb-3 flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={copySummary}
              className={
                "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors " +
                (copied
                  ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                  : "border-slate-300 text-slate-700 hover:border-slate-400")
              }
            >
              <Icon name={copied ? "Check" : "Copy"} className="h-4 w-4" />
              {copied ? "Đã sao chép" : "Sao chép nội dung"}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl bg-realtor-500 px-4 py-2 text-sm font-semibold text-white hover:bg-realtor-600"
            >
              <Icon name="Printer" className="h-4 w-4" />
              In / Lưu PDF
            </button>
          </div>

          {/* PHIẾU */}
          <div
            data-quote
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
          >
            {/* Header phiếu */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-dark.png" alt="Q-Broker" className="h-9 w-auto" />
              <div className="text-right">
                <p className="text-sm font-bold uppercase tracking-wide text-realtor-ink">
                  Phiếu tính giá
                </p>
                <p className="text-xs text-slate-400">Ngày lập: {today}</p>
              </div>
            </div>

            <div className="space-y-5 px-6 py-5">
              {/* Sản phẩm */}
              {listing && (
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={listing.image}
                    alt={listing.address}
                    className="h-14 w-20 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {listing.address}
                    </p>
                    <p className="truncate text-xs text-slate-500">{listing.city}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {listing.beds} PN • {listing.baths} WC • {listing.area} m²
                    </p>
                  </div>
                </div>
              )}

              {/* Giá & chiết khấu */}
              <Block title="Giá & chiết khấu" icon="Tag">
                <Row label="Giá niêm yết" value={formatFull(input.price)} />
                <Row
                  label={`Chiết khấu ${input.discountPct}%`}
                  value={`- ${formatFull(result.discountAmount)}`}
                  tone="down"
                />
                <Row label="Giá sau chiết khấu" value={formatFull(result.netPrice)} strong />
              </Block>

              {/* Cơ cấu vốn */}
              <Block title="Cơ cấu vốn" icon="PieChart">
                <Row label="Vốn tự có" value={formatFull(result.ownCapital)} strong />
                <Row
                  label={`Vay ${bank.name} (${input.ltvPct}%)`}
                  value={formatFull(result.loanAmount)}
                />
                {/* Thanh tỉ lệ vốn tự có / vay */}
                <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="bg-realtor-500"
                    style={{
                      width: `${Math.max(0, 100 - input.ltvPct)}%`,
                    }}
                  />
                  <div className="bg-amber-400" style={{ width: `${input.ltvPct}%` }} />
                </div>
                <div className="mt-1.5 flex justify-between text-[11px] font-medium text-slate-400">
                  <span>● Vốn tự có {100 - input.ltvPct}%</span>
                  <span>Vay {input.ltvPct}% ●</span>
                </div>
              </Block>

              {/* Trả góp ngân hàng */}
              <Block title="Trả góp ngân hàng (dư nợ giảm dần)" icon="Landmark">
                <div className="grid grid-cols-2 gap-3">
                  <Stat
                    label="Trả tháng đầu"
                    value={formatFull(result.monthlyFirst)}
                    accent
                  />
                  <Stat label="Bình quân / tháng" value={formatFull(result.monthlyAvg)} />
                  <Stat label="Tổng lãi toàn kỳ" value={formatFull(result.totalInterest)} />
                  <Stat
                    label="Kỳ hạn"
                    value={`${input.termYears} năm (${result.months} tháng)`}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Lãi ưu đãi {bank.promoRate}%/năm trong {bank.promoMonths} tháng đầu, sau đó{" "}
                  {bank.rate}%/năm.
                </p>
              </Block>

              {/* Tiến độ thanh toán */}
              <Block title="Tiến độ thanh toán dự kiến" icon="ListChecks">
                <div className="overflow-hidden rounded-xl border border-slate-100">
                  {result.stages.map((s, i) => (
                    <div
                      key={s.label}
                      className={
                        "flex items-center gap-3 px-3 py-2.5 " +
                        (i % 2 ? "bg-slate-50/60" : "bg-white")
                      }
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-realtor-50 text-xs font-bold text-realtor-600">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {s.label}
                        </p>
                        {s.note && <p className="truncate text-xs text-slate-400">{s.note}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">
                          {formatFull(s.amount)}
                        </p>
                        <p className="text-xs text-slate-400">{s.percent}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Block>
            </div>

            {/* Footer phiếu */}
            <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">{agentName}</p>
                <p className="text-xs text-slate-500">Tư vấn viên Q-Broker • Hotline 1900 6067</p>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400 sm:max-w-[50%] sm:text-right">
                * Số liệu mang tính tham khảo, chưa bao gồm phí công chứng, bảo hiểm khoản vay.
                Lãi suất có thể thay đổi theo chính sách ngân hàng.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// ---------------- Sub-components ----------------

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label} {hint && <span className="font-normal text-slate-400">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  suffix,
  valueText,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  valueText: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className="rounded-lg bg-realtor-50 px-2 py-0.5 text-sm font-bold text-realtor-600">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-realtor-500"
      />
      <p className="mt-1 text-xs text-slate-400">{valueText}</p>
    </div>
  );
}

function Block({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Icon name={icon} className="h-4 w-4 text-realtor-500" />
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  tone,
}: {
  label: string;
  value: string;
  strong?: boolean;
  tone?: "down";
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 py-1.5 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span
        className={
          "text-sm " +
          (strong ? "font-bold text-slate-900" : "font-semibold ") +
          (tone === "down" ? "text-rose-500" : strong ? "" : "text-slate-700")
        }
      >
        {value}
      </span>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={
        "rounded-xl border p-3 " +
        (accent ? "border-realtor-200 bg-realtor-50" : "border-slate-100 bg-slate-50")
      }
    >
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p
        className={
          "mt-0.5 text-base font-bold " + (accent ? "text-realtor-700" : "text-slate-800")
        }
      >
        {value}
      </p>
    </div>
  );
}
