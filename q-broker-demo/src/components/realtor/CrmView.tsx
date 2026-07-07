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
  type CrmCustomer,
  type CrmStage,
} from "@/data/crm";

// =============================================================
// CRM KHÁCH HÀNG — màn quản lý khách của môi giới.
// Bố cục: KPI sức khỏe pipeline -> việc cần làm hôm nay -> bảng
// pipeline (kanban) / danh sách -> hồ sơ chi tiết + lịch sử.
// Tương tác demo (chưa nối API): tìm kiếm, đổi view, chuyển giai
// đoạn khách (cập nhật state cục bộ), mở hồ sơ.
// =============================================================

type ViewMode = "pipeline" | "list";

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
  const [view, setView] = useState<ViewMode>("pipeline");
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

  // ----- KPI dẫn xuất -----
  const kpi = useMemo(() => {
    const total = customers.length;
    const moi = customers.filter((c) => c.stage === "moi").length;
    const nurturing = customers.filter((c) =>
      ["lien-he", "xem-nha", "dam-phan"].includes(c.stage)
    ).length;
    const today = customers.filter((c) => c.today).length;
    const pipelineValue = customers
      .filter((c) => ACTIVE_STAGES.includes(c.stage) && c.budgetUnit === "total")
      .reduce((s, c) => s + c.budget, 0);
    const won = customers.filter((c) => c.stage === "chot").length;
    const lost = customers.filter((c) => c.stage === "mat").length;
    const winRate = won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0;
    return { total, moi, nurturing, today, pipelineValue, won, winRate };
  }, [customers]);

  const todayTasks = customers.filter((c) => c.today);
  const openCustomer = customers.find((c) => c.id === openId) ?? null;

  const moveStage = (id: string, stage: CrmStage) =>
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, stage } : c))
    );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 lg:px-8">
        {/* ---------- Tiêu đề ---------- */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-realtor-ink">Khách hàng (CRM)</h1>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý toàn bộ khách theo phễu bán hàng — không để lọt khách nào.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-realtor-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-realtor-600"
          >
            <Icon name="UserPlus" className="h-4 w-4" />
            Thêm khách
          </button>
        </div>

        {/* ---------- KPI ---------- */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <Kpi icon="Users" tone="bg-realtor-50 text-realtor-500" label="Tổng khách" value={String(kpi.total)} />
          <Kpi icon="Sparkles" tone="bg-sky-50 text-sky-600" label="Khách mới" value={String(kpi.moi)} />
          <Kpi icon="HeartHandshake" tone="bg-violet-50 text-violet-600" label="Đang chăm sóc" value={String(kpi.nurturing)} />
          <Kpi icon="CalendarClock" tone="bg-amber-50 text-amber-600" label="Việc hôm nay" value={String(kpi.today)} />
          <Kpi icon="TrendingUp" tone="bg-emerald-50 text-emerald-600" label="Giá trị pipeline" value={fmtTy(kpi.pipelineValue)} />
          <Kpi icon="Trophy" tone="bg-orange-50 text-orange-600" label="Tỷ lệ chốt" value={`${kpi.winRate}%`} />
        </div>

        {/* ---------- Việc cần làm hôm nay ---------- */}
        {todayTasks.length > 0 && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-amber-700">
              <Icon name="CalendarClock" className="h-4 w-4" />
              Việc cần làm hôm nay ({todayTasks.length})
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {todayTasks.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setOpenId(c.id)}
                  className="flex items-center gap-3 rounded-xl border border-amber-100 bg-white p-3 text-left shadow-sm transition-shadow hover:shadow-md"
                >
                  <Avatar name={c.name} color={c.color} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{c.name}</p>
                    <p className="truncate text-xs text-slate-500">{c.nextAction}</p>
                  </div>
                  <span className="shrink-0 whitespace-nowrap rounded-full bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-700">
                    {c.nextDate.replace("Hôm nay, ", "")}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ---------- Thanh công cụ: tìm kiếm + đổi view ---------- */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Icon name="Search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tên, BĐS hoặc số điện thoại..."
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-realtor-500 focus:outline-none focus:ring-2 focus:ring-realtor-500/20"
            />
          </div>
          <div className="inline-flex rounded-full bg-slate-100 p-1">
            {(
              [
                ["pipeline", "Pipeline", "Columns3"],
                ["list", "Danh sách", "List"],
              ] as [ViewMode, string, string][]
            ).map(([key, label, icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => setView(key)}
                className={
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors " +
                  (view === key
                    ? "bg-white text-realtor-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700")
                }
              >
                <Icon name={icon} className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ---------- Nội dung: Pipeline hoặc Danh sách ---------- */}
        {view === "pipeline" ? (
          <PipelineBoard
            customers={filtered}
            onOpen={setOpenId}
          />
        ) : (
          <CustomerTable customers={filtered} onOpen={setOpenId} />
        )}
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

// ================= Bảng Pipeline (kanban) =================

function PipelineBoard({
  customers,
  onOpen,
}: {
  customers: CrmCustomer[];
  onOpen: (id: string) => void;
}) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:px-0">
      <div className="flex min-w-[900px] gap-4 lg:min-w-0">
        {CRM_STAGES.map((stage) => {
          const items = customers.filter((c) => c.stage === stage.id);
          const value = items
            .filter((c) => c.budgetUnit === "total")
            .reduce((s, c) => s + c.budget, 0);
          return (
            <div key={stage.id} className="flex-1 rounded-2xl bg-slate-100/70 p-2.5">
              <div className="flex items-center justify-between gap-2 px-1.5 py-1.5">
                <div className="flex items-center gap-2">
                  <span className={"h-2.5 w-2.5 rounded-full " + stage.dot} />
                  <span className="text-sm font-bold text-slate-700">{stage.label}</span>
                  <span className="rounded-full bg-white px-1.5 text-xs font-semibold text-slate-500">
                    {items.length}
                  </span>
                </div>
              </div>
              {value > 0 && (
                <p className="px-1.5 pb-2 text-[11px] font-semibold text-slate-400">
                  {fmtTy(value)}
                </p>
              )}
              <div className="space-y-2.5">
                {items.map((c) => (
                  <PipelineCard key={c.id} c={c} onOpen={onOpen} />
                ))}
                {items.length === 0 && (
                  <p className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400">
                    Trống
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
  onOpen,
}: {
  c: CrmCustomer;
  onOpen: (id: string) => void;
}) {
  const score = SCORE_META[c.score];
  const demand = DEMAND_META[c.demand];
  return (
    <button
      type="button"
      onClick={() => onOpen(c.id)}
      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center gap-2.5">
        <Avatar name={c.name} color={c.color} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-800">{c.name}</p>
          <p className="truncate text-[11px] text-slate-400">{c.district}</p>
        </div>
        <span className={"inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold " + score.className}>
          <Icon name={score.icon} className="h-3 w-3" />
          {score.label}
        </span>
      </div>
      <p className="mt-2 line-clamp-1 text-xs text-slate-600">
        <Icon name={demand.icon} className="mr-1 inline h-3 w-3 text-slate-400" />
        {c.property}
      </p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-realtor-ink">
          {budgetLabel(c)}
        </span>
        <span className="text-[10px] font-medium text-slate-400">{demand.label}</span>
      </div>
      <div
        className={
          "mt-2 flex items-center gap-1.5 border-t border-slate-100 pt-2 text-[11px] " +
          (c.today ? "text-amber-600" : "text-slate-500")
        }
      >
        <Icon name={c.today ? "CalendarClock" : "ArrowRight"} className="h-3 w-3 shrink-0" />
        <span className="truncate">{c.nextAction}</span>
      </div>
    </button>
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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
                className="cursor-pointer border-b border-slate-50 last:border-0 hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={c.name} color={c.color} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800">{c.name}</p>
                      <p className="truncate text-xs text-slate-400">{c.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{DEMAND_META[c.demand].label}</td>
                <td className="px-4 py-3">
                  <p className="text-slate-700">{c.property}</p>
                  <p className="text-xs text-slate-400">{c.district}</p>
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
      className="fixed inset-0 z-[60] flex justify-end bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-md flex-col overflow-hidden bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-realtor-700 to-realtor-500 px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ring-2 ring-white/40"
                style={{ backgroundColor: c.color }}
              >
                {c.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-lg font-bold">{c.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className={"inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold " + score.className}>
                    <Icon name={score.icon} className="h-3 w-3" />
                    {score.label}
                  </span>
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold">
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
                className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:border-realtor-200 hover:bg-realtor-50 hover:text-realtor-600"
              >
                <Icon name={a.icon} className="h-4 w-4" />
                {a.label}
              </button>
            ))}
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
                <li key={i} className="relative">
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

function Avatar({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

function Kpi({
  icon,
  tone,
  label,
  value,
}: {
  icon: string;
  tone: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <span className={"grid h-9 w-9 place-items-center rounded-xl " + tone}>
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <p className="mt-2.5 text-xl font-extrabold text-realtor-ink">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
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
