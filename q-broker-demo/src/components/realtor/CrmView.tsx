"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  CRM_CUSTOMERS,
  CRM_STAGES,
  DEMAND_META,
  SCORE_META,
  STAGE_LOST,
  budgetLabel,
  crmAvatar,
  crmPropertyImg,
  type CrmCustomer,
  type CrmStage,
} from "@/data/crm";

// =============================================================
// CRM KHÁCH HÀNG — màn quản lý khách của môi giới, bố cục GỌN:
// tiêu đề -> dải số liệu mảnh -> 3 tab (Pipeline / Hôm nay / Danh
// sách) -> hồ sơ chi tiết (drawer trượt). Ảnh chân dung + ảnh BĐS
// lấy từ data/crm.ts. Tương tác demo: tìm kiếm, chuyển giai đoạn.
// =============================================================

type Tab = "pipeline" | "today" | "list";

/** Gộp map cấu hình giai đoạn (kể cả "Đã mất") để tra nhanh */
const STAGE_LABEL: Record<CrmStage, string> = {
  ...Object.fromEntries(CRM_STAGES.map((s) => [s.id, s.label])),
  mat: STAGE_LOST.label,
} as Record<CrmStage, string>;

const STAGE_CHIP: Record<CrmStage, string> = {
  ...Object.fromEntries(CRM_STAGES.map((s) => [s.id, s.chip])),
  mat: STAGE_LOST.chip,
} as Record<CrmStage, string>;

/** "12,3 tỷ" cho tổng giá trị */
const fmtTy = (n: number) =>
  n >= 1_000_000_000
    ? `${(n / 1_000_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} tỷ`
    : `${(n / 1_000_000).toLocaleString("vi-VN")} tr`;

const ACTIVE_STAGES: CrmStage[] = ["moi", "lien-he", "xem-nha", "dam-phan"];

export function CrmView() {
  const [customers, setCustomers] = useState<CrmCustomer[]>(CRM_CUSTOMERS);
  const [tab, setTab] = useState<Tab>("pipeline");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      q
        ? customers.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.property.toLowerCase().includes(q) ||
              c.phone.replace(/\s/g, "").includes(q.replace(/\s/g, ""))
          )
        : customers,
    [customers, q]
  );

  // ----- Số liệu tổng quan (gọn) -----
  const kpi = useMemo(() => {
    const total = customers.length;
    const today = customers.filter((c) => c.today).length;
    const pipelineValue = customers
      .filter((c) => ACTIVE_STAGES.includes(c.stage) && c.budgetUnit === "total")
      .reduce((s, c) => s + c.budget, 0);
    const won = customers.filter((c) => c.stage === "chot").length;
    const lost = customers.filter((c) => c.stage === "mat").length;
    const winRate = won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0;
    return { total, today, pipelineValue, winRate };
  }, [customers]);

  const todayTasks = customers.filter((c) => c.today);
  const openCustomer = customers.find((c) => c.id === openId) ?? null;

  const moveStage = (id: string, stage: CrmStage) =>
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, stage } : c))
    );

  const TABS: { id: Tab; label: string; icon: string; badge?: number }[] = [
    { id: "pipeline", label: "Pipeline", icon: "Columns3" },
    { id: "today", label: "Hôm nay", icon: "CalendarClock", badge: todayTasks.length },
    { id: "list", label: "Danh sách", icon: "List" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 lg:px-8">
        {/* ---------- Hero: ảnh nền + gradient + số liệu kính mờ ---------- */}
        <section className="relative overflow-hidden rounded-2xl text-white shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=70"
            alt=""
            className="absolute inset-0 h-full w-full animate-kenburns object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-realtor-700/95 via-realtor-600/85 to-realtor-500/50" />
          <div className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex flex-wrap items-center gap-4 px-5 py-6 sm:px-7">
            <div className="min-w-0 flex-1 animate-fade-up">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide backdrop-blur">
                <Icon name="BarChart3" className="h-3.5 w-3.5" />
                Không gian làm việc của môi giới
              </p>
              <h1 className="mt-2.5 text-2xl font-bold sm:text-3xl">Khách hàng (CRM)</h1>
              <p className="mt-1 text-sm text-white/80">
                Quản lý khách theo phễu bán hàng — không để lọt khách nào.
              </p>
            </div>

            <div className="flex animate-fade-up flex-col items-stretch gap-2.5 sm:items-end">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-realtor-600 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Icon name="UserPlus" className="h-4 w-4" />
                Thêm khách
              </button>
              <div className="flex gap-2">
                <HeroStat value={String(kpi.total)} label="khách" />
                <HeroStat value={fmtTy(kpi.pipelineValue)} label="pipeline" />
                <HeroStat value={`${kpi.winRate}%`} label="tỷ lệ chốt" />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Tab + tìm kiếm ---------- */}
        <div className="flex animate-fade-up flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-full bg-slate-100 p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors " +
                  (tab === t.id
                    ? "bg-white text-realtor-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700")
                }
              >
                <Icon name={t.icon} className="h-4 w-4" />
                {t.label}
                {t.badge ? (
                  <span
                    className={
                      "min-w-[18px] rounded-full px-1 text-center text-[11px] font-bold " +
                      (tab === t.id ? "bg-amber-100 text-amber-700" : "bg-amber-400 text-white")
                    }
                  >
                    {t.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          {tab !== "today" && (
            <div className="relative w-full min-w-[180px] sm:w-72">
              <Icon name="Search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm tên, BĐS, số điện thoại..."
                className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-realtor-500 focus:outline-none focus:ring-2 focus:ring-realtor-500/20"
              />
            </div>
          )}
        </div>

        {/* ---------- Nội dung theo tab ---------- */}
        {tab === "pipeline" && (
          <>
            <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Icon name="Move" className="h-3 w-3" />
              Kéo thẻ sang cột khác để chuyển giai đoạn · bấm thẻ để mở hồ sơ
            </p>
            <PipelineBoard customers={filtered} onOpen={setOpenId} onMove={moveStage} />
          </>
        )}
        {tab === "today" && <TodayList tasks={todayTasks} onOpen={setOpenId} />}
        {tab === "list" && <CustomerTable customers={filtered} onOpen={setOpenId} />}
      </div>

      {/* ---------- Hồ sơ chi tiết ---------- */}
      {openCustomer && (
        <CustomerDetail
          customer={openCustomer}
          onClose={() => setOpenId(null)}
          onMove={moveStage}
        />
      )}
    </div>
  );
}

// ================= Tab "Hôm nay" =================

function TodayList({
  tasks,
  onOpen,
}: {
  tasks: CrmCustomer[];
  onOpen: (id: string) => void;
}) {
  if (tasks.length === 0) {
    return (
      <div className="animate-fade-up rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
        <p className="text-3xl">🎉</p>
        <p className="mt-2 text-sm text-slate-400">Hôm nay không còn việc nào — nghỉ ngơi thôi!</p>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-3xl space-y-2.5">
      {tasks.map((c, i) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onOpen(c.id)}
          style={{ animationDelay: `${i * 60}ms` }}
          className="flex w-full animate-fade-up items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
        >
          <Avatar c={c} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-800">{c.name}</p>
            <p className="truncate text-xs text-slate-500">{c.nextAction}</p>
          </div>
          <span className="shrink-0 whitespace-nowrap rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
            {c.nextDate.replace("Hôm nay, ", "")}
          </span>
          <Icon name="ChevronRight" className="h-4 w-4 shrink-0 text-slate-300" />
        </button>
      ))}
    </div>
  );
}

// ================= Bảng Pipeline (kanban, kéo-thả) =================

/** Chấm màu mức độ quan tâm (thay chip to cho gọn) */
const SCORE_DOT: Record<CrmCustomer["score"], string> = {
  hot: "bg-rose-500",
  warm: "bg-amber-400",
  cold: "bg-sky-400",
};

function PipelineBoard({
  customers,
  onOpen,
  onMove,
}: {
  customers: CrmCustomer[];
  onOpen: (id: string) => void;
  onMove: (id: string, stage: CrmStage) => void;
}) {
  const [over, setOver] = useState<CrmStage | null>(null); // cột đang được kéo vào

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:px-0">
      <div className="flex min-w-[880px] gap-3 lg:min-w-0">
        {CRM_STAGES.map((stage) => {
          const items = customers.filter((c) => c.stage === stage.id);
          const value = items
            .filter((c) => c.budgetUnit === "total")
            .reduce((s, c) => s + c.budget, 0);
          const isOver = over === stage.id;
          return (
            <div
              key={stage.id}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(stage.id);
              }}
              onDragLeave={() => setOver((o) => (o === stage.id ? null : o))}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                if (id) onMove(id, stage.id);
                setOver(null);
              }}
              className={
                "flex-1 rounded-xl p-2 transition-colors " +
                (isOver
                  ? "bg-realtor-50 ring-2 ring-realtor-300"
                  : "bg-slate-100/70")
              }
            >
              <div className={"mx-1 mb-1.5 h-0.5 rounded-full " + stage.dot} />
              <div className="flex items-center justify-between gap-2 px-1 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-bold text-slate-700">{stage.label}</span>
                  <span className="rounded-full bg-white px-1.5 text-[11px] font-semibold text-slate-500">
                    {items.length}
                  </span>
                </div>
                {value > 0 && (
                  <span className="text-[10px] font-semibold text-slate-400">{fmtTy(value)}</span>
                )}
              </div>
              <div className="space-y-1.5">
                {items.map((c, i) => (
                  <PipelineCard key={c.id} c={c} i={i} onOpen={onOpen} />
                ))}
                {items.length === 0 && (
                  <p
                    className={
                      "rounded-lg border border-dashed py-5 text-center text-[11px] transition-colors " +
                      (isOver
                        ? "border-realtor-300 text-realtor-500"
                        : "border-slate-200 text-slate-400")
                    }
                  >
                    {isOver ? "Thả vào đây" : "Trống"}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PipelineCard({
  c,
  i,
  onOpen,
}: {
  c: CrmCustomer;
  i: number;
  onOpen: (id: string) => void;
}) {
  const score = SCORE_META[c.score];
  return (
    <div
      role="button"
      tabIndex={0}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", c.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={() => onOpen(c.id)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(c.id)}
      style={{ animationDelay: `${(i % 8) * 40}ms` }}
      className="group animate-fade-up cursor-grab rounded-lg border border-slate-200 bg-white px-2.5 py-2 shadow-sm transition-all hover:border-realtor-300 hover:shadow-md active:cursor-grabbing"
    >
      {/* Dòng 1: khách + mức độ quan tâm */}
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={crmAvatar(c, 80)}
          alt={c.name}
          className="h-6 w-6 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
        />
        <p className="min-w-0 flex-1 truncate text-[13px] font-bold text-slate-800">
          {c.name}
        </p>
        <span
          title={score.label}
          className={"h-2 w-2 shrink-0 rounded-full " + SCORE_DOT[c.score]}
        />
      </div>

      {/* Dòng 2: BĐS quan tâm */}
      <p className="mt-1 truncate text-[11px] text-slate-500">{c.property}</p>

      {/* Dòng 3: giá trị + lịch/việc tiếp theo */}
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="truncate text-xs font-bold text-realtor-ink">
          {budgetLabel(c)}
          <span className="ml-1 font-medium text-slate-400">
            {DEMAND_META[c.demand].label}
          </span>
        </span>
        {c.today ? (
          <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
            {c.nextDate.replace("Hôm nay, ", "")}
          </span>
        ) : (
          <span className="shrink-0 text-[10px] text-slate-400">{c.nextDate}</span>
        )}
      </div>
    </div>
  );
}

// ================= Danh sách (table) =================

function CustomerTable({
  customers,
  onOpen,
}: {
  customers: CrmCustomer[];
  onOpen: (id: string) => void;
}) {
  return (
    <div className="animate-fade-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-semibold">Khách hàng</th>
              <th className="px-4 py-3 font-semibold">Nhu cầu</th>
              <th className="px-4 py-3 font-semibold">BĐS quan tâm</th>
              <th className="px-4 py-3 font-semibold">Ngân sách</th>
              <th className="px-4 py-3 font-semibold">Nguồn</th>
              <th className="px-4 py-3 font-semibold">Giai đoạn</th>
              <th className="px-4 py-3 font-semibold">Việc tiếp theo</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr
                key={c.id}
                onClick={() => onOpen(c.id)}
                className="cursor-pointer border-b border-slate-50 transition-colors last:border-0 hover:bg-realtor-50/40"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar c={c} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800">{c.name}</p>
                      <p className="truncate text-xs text-slate-400">{c.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{DEMAND_META[c.demand].label}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={crmPropertyImg(c, 160)}
                      alt=""
                      className="h-9 w-12 shrink-0 rounded-md object-cover ring-1 ring-slate-200"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-slate-700">{c.property}</p>
                      <p className="text-xs text-slate-400">{c.district}</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-realtor-ink">
                  {budgetLabel(c)}
                </td>
                <td className="px-4 py-3 text-slate-600">{c.source}</td>
                <td className="px-4 py-3">
                  <span className={"whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold " + STAGE_CHIP[c.stage]}>
                    {STAGE_LABEL[c.stage]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className={"max-w-[220px] truncate text-xs " + (c.today ? "font-semibold text-amber-600" : "text-slate-500")}>
                    {c.nextAction}
                  </p>
                  <p className="text-[11px] text-slate-400">{c.nextDate}</p>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">
                  Không tìm thấy khách phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ================= Hồ sơ chi tiết =================

function CustomerDetail({
  customer: c,
  onClose,
  onMove,
}: {
  customer: CrmCustomer;
  onClose: () => void;
  onMove: (id: string, stage: CrmStage) => void;
}) {
  const score = SCORE_META[c.score];
  const demand = DEMAND_META[c.demand];
  return (
    <div
      className="fixed inset-0 z-[60] flex animate-fade-in justify-end bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-md animate-slide-in-right flex-col overflow-hidden bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: ảnh BĐS quan tâm làm nền */}
        <div className="relative px-6 py-6 text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={crmPropertyImg(c, 800)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-realtor-700/95 via-realtor-700/85 to-realtor-500/70" />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={crmAvatar(c)}
                alt={c.name}
                className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-white/60"
              />
              <div>
                <p className="text-lg font-bold">{c.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className={"inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold " + score.className}>
                    <Icon name={score.icon} className="h-3 w-3" />
                    {score.label}
                  </span>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold backdrop-blur">
                    {STAGE_LABEL[c.stage]}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 hover:bg-white/20"
              aria-label="Đóng"
            >
              <Icon name="X" className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Nội dung cuộn */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Liên hệ nhanh */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: "Phone", label: "Gọi" },
              { icon: "MessageCircle", label: "Nhắn" },
              { icon: "CalendarPlus", label: "Đặt lịch" },
              { icon: "FileText", label: "Ghi chú" },
            ].map((a) => (
              <button
                key={a.label}
                type="button"
                className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition-all hover:-translate-y-0.5 hover:border-realtor-200 hover:bg-realtor-50 hover:text-realtor-600 hover:shadow-sm"
              >
                <Icon name={a.icon} className="h-4 w-4" />
                {a.label}
              </button>
            ))}
          </div>

          {/* BĐS quan tâm */}
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="relative h-28">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={crmPropertyImg(c, 800)}
                alt={c.property}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between gap-2 text-white">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{c.property}</p>
                  <p className="text-xs text-white/80">
                    <Icon name="MapPin" className="mr-0.5 inline h-3 w-3" />
                    {c.district}
                  </p>
                </div>
                <span className="shrink-0 rounded-md bg-white/90 px-2 py-0.5 text-xs font-bold text-realtor-ink">
                  {budgetLabel(c)}
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin */}
          <div className="space-y-2.5 rounded-2xl border border-slate-200 p-4">
            <InfoRow icon="Phone" label="Điện thoại" value={c.phone} />
            <InfoRow icon="Mail" label="Email" value={c.email} />
            <InfoRow icon={c.sourceIcon} label="Nguồn khách" value={c.source} />
            <InfoRow icon={demand.icon} label="Nhu cầu" value={`${demand.label} · ${c.property}`} />
            <InfoRow icon="MapPin" label="Khu vực" value={c.district} />
            <InfoRow icon="Wallet" label="Ngân sách" value={budgetLabel(c)} />
          </div>

          {/* Ghi chú */}
          <div>
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">Ghi chú</p>
            <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
              {c.note}
            </p>
          </div>

          {/* Chuyển giai đoạn */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Chuyển giai đoạn</p>
            <div className="flex flex-wrap gap-1.5">
              {CRM_STAGES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onMove(c.id, s.id)}
                  className={
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors " +
                    (c.stage === s.id
                      ? "bg-realtor-500 text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50")
                  }
                >
                  {s.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => onMove(c.id, "mat")}
                className={
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors " +
                  (c.stage === "mat"
                    ? "bg-slate-500 text-white"
                    : "border border-slate-200 text-slate-400 hover:bg-slate-50")
                }
              >
                Đã mất
              </button>
            </div>
          </div>

          {/* Lịch sử tương tác */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Lịch sử tương tác</p>
            <ol className="relative space-y-4 border-l border-slate-200 pl-5">
              {c.timeline.map((t, i) => (
                <li
                  key={i}
                  style={{ animationDelay: `${i * 70}ms` }}
                  className="relative animate-fade-up"
                >
                  <span className="absolute -left-[27px] flex h-6 w-6 items-center justify-center rounded-full bg-realtor-50 text-realtor-500 ring-4 ring-white">
                    <Icon name={t.icon} className="h-3 w-3" />
                  </span>
                  <p className="text-sm text-slate-700">{t.text}</p>
                  <p className="text-xs text-slate-400">{t.time}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Footer: việc tiếp theo */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Việc tiếp theo</p>
          <div className="mt-0.5 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-700">{c.nextAction}</p>
            <span className={"shrink-0 whitespace-nowrap text-xs font-bold " + (c.today ? "text-amber-600" : "text-slate-400")}>
              {c.nextDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= Thành phần con dùng chung =================

/** Chip số liệu kính mờ trên hero */
function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <span className="flex flex-col items-center rounded-xl bg-white/15 px-3 py-1.5 text-center backdrop-blur">
      <b className="text-sm leading-tight">{value}</b>
      <span className="text-[10px] text-white/75">{label}</span>
    </span>
  );
}

function Avatar({ c }: { c: CrmCustomer }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={crmAvatar(c)}
      alt={c.name}
      className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
    />
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon name={icon} className="h-4 w-4 shrink-0 text-slate-400" />
      <span className="w-24 shrink-0 text-xs text-slate-400">{label}</span>
      <span className="min-w-0 flex-1 truncate font-medium text-slate-700">{value}</span>
    </div>
  );
}
