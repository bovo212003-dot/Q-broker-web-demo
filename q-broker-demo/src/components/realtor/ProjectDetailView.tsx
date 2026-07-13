"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { withRole } from "@/lib/role";
import { RoleId } from "@/types";
import { formatVnd } from "@/data/realtorListings";
import {
  type Project,
  type UnitStatus,
  STATUS_TONE,
  UNIT_STATUS_META,
} from "@/data/projects";

// =============================================================
// CHI TIẾT DỰ ÁN (/realtor/du-an/[id]) — GIAO DIỆN TAB kiểu SalePro
// Header gradient + breadcrumb + Chia sẻ -> thanh tab dính ->
// nội dung theo tab: Tổng quan / Vị trí / Phân khu / Quỹ căn /
// Chính sách / Tiến độ / Hỏi đáp. Giữ palette realtor (xanh) của sàn.
// =============================================================

const TABS = [
  { id: "tong-quan", label: "Tổng quan", icon: "LayoutGrid" },
  { id: "vi-tri", label: "Vị trí", icon: "MapPin" },
  { id: "phan-khu", label: "Phân khu", icon: "Grid3x3" },
  { id: "quy-can", label: "Quỹ căn", icon: "House" },
  { id: "chinh-sach", label: "Chính sách bán hàng", icon: "FileText" },
  { id: "tien-do", label: "Tiến độ", icon: "CalendarDays" },
  { id: "hoi-dap", label: "Hỏi đáp", icon: "HelpCircle" },
] as const;

const UNIT_FILTERS: { key: UnitStatus | "all"; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "available", label: "Còn hàng" },
  { key: "hold", label: "Giữ chỗ" },
  { key: "sold", label: "Đã bán" },
];

export function ProjectDetailView({
  project,
  roleId,
}: {
  project: Project;
  roleId?: RoleId;
}) {
  const [tab, setTab] = useState<string>("tong-quan");
  const [heroIdx, setHeroIdx] = useState(0);
  const [subFilter, setSubFilter] = useState<string | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UnitStatus | "all">("all");

  const stats = useMemo(() => {
    const s = { total: project.units.length, available: 0, hold: 0, sold: 0 };
    for (const u of project.units) s[u.status]++;
    return s;
  }, [project.units]);

  const units = useMemo(() => {
    return project.units.filter((u) => {
      if (subFilter !== "all" && u.subdivision !== subFilter) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      return true;
    });
  }, [project.units, subFilter, statusFilter]);

  const subNames = useMemo(
    () => Array.from(new Set(project.units.map((u) => u.subdivision))),
    [project.units],
  );

  // Danh sách thông số tổng quan (kiểu bullet của SalePro).
  const overviewRows = [
    { label: "Tên dự án", value: project.name },
    { label: "Vị trí", value: project.city },
    { label: "Chủ đầu tư", value: project.developer },
    { label: "Quy mô dự án", value: project.totalArea },
    { label: "Năm bàn giao", value: String(project.handoverYear) },
    { label: "Loại hình", value: project.propertyTypes.map((t) => t.name).join(", ") },
    { label: "Pháp lý", value: project.legal },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 pt-6 text-sm text-slate-500">
          <Link
            href={withRole("/realtor/du-an", roleId)}
            className="hover:text-realtor-500"
          >
            Dự án
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-400">Chi tiết dự án</span>
        </nav>

        {/* Header tiêu đề (gradient nhạt) */}
        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={
                "rounded-full px-3 py-1 text-xs font-semibold ring-1 " +
                STATUS_TONE[project.status]
              }
            >
              {project.status}
            </span>
            <span className="text-sm font-medium text-slate-500">
              {project.developer}
            </span>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-realtor-200 px-3 py-1.5 text-sm font-semibold text-realtor-600 hover:bg-realtor-50"
          >
            Chia sẻ
            <Icon name="Share2" className="h-4 w-4" />
          </button>
        </div>

        <div
          className="mt-3 rounded-2xl border border-slate-200 px-5 py-6 lg:py-7"
          style={{
            background:
              "linear-gradient(135deg, #eef2f7 0%, #ffffff 100%)",
          }}
        >
          <h1 className="text-2xl font-bold uppercase tracking-tight text-realtor-ink lg:text-[1.75rem]">
            {project.name}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
            Theo dõi thông tin chi tiết và bảng giá, quỹ căn, mặt bằng, tiến độ và
            chính sách bán hàng dự án {project.name}.
          </p>
        </div>

        {/* Thanh tab dính */}
        <div className="sticky top-16 z-20 -mx-4 mt-4 border-b border-slate-200 bg-slate-50/95 px-4 backdrop-blur lg:-mx-8 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-thin">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={
                    "flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition-colors " +
                    (active
                      ? "border-realtor-500 text-realtor-600"
                      : "border-transparent text-slate-500 hover:text-realtor-500")
                  }
                >
                  <Icon name={t.icon} className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Nội dung tab */}
        <div className="py-6">
          {/* ============ TỔNG QUAN ============ */}
          {tab === "tong-quan" && (
            <div className="space-y-8">
              {/* Gallery hero */}
              <div>
                <div className="relative overflow-hidden rounded-2xl bg-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.gallery[heroIdx]}
                    alt={project.name}
                    className="h-[260px] w-full object-cover sm:h-[380px] lg:h-[460px]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setHeroIdx(
                        (heroIdx - 1 + project.gallery.length) %
                          project.gallery.length,
                      )
                    }
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
                    aria-label="Ảnh trước"
                  >
                    <Icon name="ChevronLeft" className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setHeroIdx((heroIdx + 1) % project.gallery.length)
                    }
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
                    aria-label="Ảnh sau"
                  >
                    <Icon name="ChevronRight" className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-thin">
                  {project.gallery.map((g, i) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setHeroIdx(i)}
                      className={
                        "h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors " +
                        (i === heroIdx ? "border-realtor-500" : "border-transparent")
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={g} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 thẻ KPI */}
              <div className="grid gap-4 sm:grid-cols-3">
                <KpiCard icon="LandPlot" label="Quy mô dự án" value={project.totalArea} />
                <KpiCard
                  icon="Building2"
                  label={project.towers ? "Số toà cao tầng" : "Tổng sản phẩm"}
                  value={
                    project.towers
                      ? `${project.towers} toà`
                      : project.lowRiseUnits
                        ? project.lowRiseUnits.toLocaleString("vi-VN")
                        : "—"
                  }
                />
                <KpiCard
                  icon="CalendarCheck"
                  label="Bàn giao"
                  value={String(project.handoverYear)}
                />
              </div>

              {/* Tổng quan: thông số + mô tả */}
              <section className="grid gap-6 lg:grid-cols-2">
                <div>
                  <SectionTitle icon="Info" text="Tổng quan dự án" />
                  <ul className="mt-3 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    {overviewRows.map((r) => (
                      <li
                        key={r.label}
                        className="flex gap-3 px-4 py-2.5 text-sm"
                      >
                        <span className="w-28 shrink-0 font-semibold text-slate-500">
                          {r.label}
                        </span>
                        <span className="font-medium text-realtor-ink">
                          {r.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <SectionTitle icon="FileText" text="Giới thiệu dự án" />
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.highlights.map((h) => (
                      <span
                        key={h}
                        className="rounded-full bg-realtor-50 px-3 py-1 text-xs font-medium text-realtor-600"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Sản phẩm (loại hình) */}
              <section>
                <SectionTitle icon="LayoutGrid" text="Sản phẩm" />
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {project.propertyTypes.map((t) => (
                    <div
                      key={t.name}
                      className="rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-realtor-50 text-realtor-500">
                        <Icon name={t.icon} className="h-5 w-5" />
                      </span>
                      <p className="mt-2 font-semibold text-realtor-ink">{t.name}</p>
                      <p className="text-sm text-slate-500">{t.areaRange}</p>
                      <p className="mt-0.5 text-sm font-semibold text-realtor-500">
                        {t.priceRange}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tiện ích */}
              <section>
                <SectionTitle icon="Sparkles" text="Tiện ích nổi bật" />
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {project.amenities.map((a) => (
                    <div
                      key={a.name}
                      className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <Icon name={a.icon} className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-realtor-ink">{a.name}</p>
                        <p className="text-sm text-slate-500">{a.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Liên hệ tư vấn */}
              <section>
                <SectionTitle icon="Headphones" text="Liên hệ tư vấn" />
                <div className="mt-3 flex flex-col items-start justify-between gap-4 rounded-2xl border border-realtor-200 bg-realtor-50 p-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-realtor-500 text-white">
                      <Icon name="UserRound" className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="font-semibold text-realtor-ink">
                        Chuyên viên tư vấn dự án
                      </p>
                      <p className="text-sm text-slate-500">
                        Hỗ trợ chọn căn, bảng giá &amp; chính sách 24/7
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`tel:${project.hotline.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-realtor-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-realtor-600"
                    >
                      <Icon name="Phone" className="h-4 w-4" />
                      {project.hotline}
                    </a>
                    <Link
                      href={withRole("/realtor/tin-nhan", roleId)}
                      className="inline-flex items-center gap-2 rounded-xl border border-realtor-300 bg-white px-4 py-2.5 text-sm font-semibold text-realtor-600 hover:bg-realtor-50"
                    >
                      <Icon name="MessageCircle" className="h-4 w-4" />
                      Nhắn tin
                    </Link>
                    <Link
                      href={withRole("/realtor/phieu-tinh-gia", roleId)}
                      className="inline-flex items-center gap-2 rounded-xl border border-realtor-300 bg-white px-4 py-2.5 text-sm font-semibold text-realtor-600 hover:bg-realtor-50"
                    >
                      <Icon name="Calculator" className="h-4 w-4" />
                      Tham khảo bảng giá
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ============ VỊ TRÍ ============ */}
          {tab === "vi-tri" && (
            <div className="space-y-5">
              <SectionTitle icon="MapPinned" text="Vị trí & liên kết vùng" />
              <div className="grid gap-3 sm:grid-cols-2">
                {project.connectivity.map((c) => (
                  <div
                    key={c.place}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-realtor-50 text-realtor-500">
                      <Icon name={c.icon} className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-realtor-ink">{c.place}</p>
                      <p className="text-sm font-semibold text-realtor-500">
                        {c.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Bản đồ (placeholder) */}
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center">
                <Icon name="Map" className="h-10 w-10 text-slate-300" />
                <p className="mt-2 text-sm font-semibold text-slate-600">
                  {project.city}
                </p>
                <p className="text-xs text-slate-400">Bản đồ vị trí dự án</p>
              </div>
            </div>
          )}

          {/* ============ PHÂN KHU ============ */}
          {tab === "phan-khu" && (
            <div className="space-y-4">
              <SectionTitle icon="Grid3x3" text="Phân khu dự án" />
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[520px] text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">Phân khu</th>
                      <th className="px-4 py-2.5 font-semibold">Quy mô</th>
                      <th className="px-4 py-2.5 font-semibold">Số căn</th>
                      <th className="px-4 py-2.5 font-semibold">Khoảng giá</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {project.subdivisions.map((s) => (
                      <tr key={s.name} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-semibold text-slate-800">
                          {s.name}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">{s.area}</td>
                        <td className="px-4 py-2.5 text-slate-600">
                          {s.units.toLocaleString("vi-VN")}
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-realtor-500">
                          {s.priceRange}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============ QUỸ CĂN (bảng hàng) ============ */}
          {tab === "quy-can" && (
            <div className="space-y-4">
              <SectionTitle icon="House" text="Bảng hàng — Quỹ căn" />

              {/* Tóm tắt trạng thái */}
              <div className="grid grid-cols-4 gap-2">
                <SummaryPill label="Tổng căn" value={stats.total} tone="ink" />
                <SummaryPill label="Còn hàng" value={stats.available} tone="green" />
                <SummaryPill label="Giữ chỗ" value={stats.hold} tone="amber" />
                <SummaryPill label="Đã bán" value={stats.sold} tone="rose" />
              </div>

              {/* Bộ lọc */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {UNIT_FILTERS.map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setStatusFilter(f.key)}
                      className={
                        "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors " +
                        (statusFilter === f.key
                          ? "bg-realtor-500 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200")
                      }
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <select
                  value={subFilter}
                  onChange={(e) => setSubFilter(e.target.value)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-realtor-500"
                >
                  <option value="all">Tất cả phân khu</option>
                  {subNames.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bảng điện */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[680px] text-sm">
                  <thead className="bg-realtor-ink text-left text-xs uppercase tracking-wide text-slate-300">
                    <tr>
                      <th className="px-3 py-2.5 font-semibold">Mã căn</th>
                      <th className="px-3 py-2.5 text-right font-semibold">Giá bán</th>
                      <th className="px-3 py-2.5 font-semibold">Loại hình</th>
                      <th className="px-3 py-2.5 font-semibold">Hướng</th>
                      <th className="px-3 py-2.5 text-right font-semibold">DT (m²)</th>
                      <th className="px-3 py-2.5 font-semibold">Phân khu</th>
                      <th className="px-3 py-2.5 font-semibold">Tình trạng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {units.map((u) => {
                      const meta = UNIT_STATUS_META[u.status];
                      return (
                        <tr key={u.code} className={"transition-colors " + meta.row}>
                          <td className="px-3 py-2.5 font-mono font-semibold text-slate-800">
                            {u.code}
                          </td>
                          <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-realtor-ink">
                            {formatVnd(u.price)}
                          </td>
                          <td className="px-3 py-2.5 text-slate-600">{u.type}</td>
                          <td className="px-3 py-2.5 text-slate-600">{u.direction}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-slate-700">
                            {u.area}
                          </td>
                          <td className="px-3 py-2.5 text-slate-600">{u.subdivision}</td>
                          <td className="px-3 py-2.5">
                            <span
                              className={
                                "inline-flex items-center gap-1.5 text-xs font-semibold " +
                                meta.text
                              }
                            >
                              <span className={"h-2 w-2 rounded-full " + meta.dot} />
                              {meta.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {units.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-400">
                  Không có căn nào khớp bộ lọc.
                </p>
              )}
              <p className="text-xs text-slate-400">
                * Giá và tình trạng căn mang tính minh hoạ, cập nhật theo thời gian.
                Liên hệ chuyên viên để chốt căn thực tế.
              </p>
            </div>
          )}

          {/* ============ CHÍNH SÁCH ============ */}
          {tab === "chinh-sach" && (
            <div className="space-y-4">
              <SectionTitle icon="BadgePercent" text="Chính sách bán hàng" />
              <ul className="space-y-2">
                {project.salesPolicy.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-700"
                  >
                    <Icon
                      name="CheckCircle2"
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ============ TIẾN ĐỘ ============ */}
          {tab === "tien-do" && (
            <div className="space-y-4">
              <SectionTitle icon="CalendarDays" text="Tiến độ triển khai" />
              <ol className="relative ml-2 border-l-2 border-slate-200">
                {project.progress.map((s) => (
                  <li key={s.period + s.milestone} className="mb-5 ml-5 last:mb-0">
                    <span
                      className={
                        "absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-slate-50 " +
                        (s.done ? "bg-emerald-500" : "bg-slate-300")
                      }
                    >
                      {s.done && <Icon name="Check" className="h-2.5 w-2.5 text-white" />}
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-wide text-realtor-500">
                      {s.period}
                    </p>
                    <p
                      className={
                        "text-sm " +
                        (s.done ? "font-semibold text-realtor-ink" : "text-slate-500")
                      }
                    >
                      {s.milestone}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* ============ HỎI ĐÁP ============ */}
          {tab === "hoi-dap" && (
            <div className="space-y-4">
              <SectionTitle icon="HelpCircle" text="Câu hỏi thường gặp" />
              <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
                {project.faqs.map((f) => (
                  <FaqItem key={f.q} q={f.q} a={f.a} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Sub-components ----------

function SectionTitle({ icon, text }: { icon: string; text: string }) {
  return (
    <h2 className="flex items-center gap-2 text-lg font-bold text-realtor-ink">
      <Icon name={icon} className="h-5 w-5 text-realtor-500" />
      {text}
    </h2>
  );
}

function KpiCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-realtor-50 text-realtor-500">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-lg font-bold text-realtor-ink">{value}</p>
      </div>
    </div>
  );
}

const PILL_TONE: Record<string, string> = {
  ink: "bg-slate-100 text-slate-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-600",
};

function SummaryPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className={"rounded-xl px-3 py-2 text-center " + PILL_TONE[tone]}>
      <p className="text-lg font-bold tabular-nums">{value}</p>
      <p className="text-xs font-medium">{label}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50"
      >
        <span className="text-sm font-semibold text-realtor-ink">{q}</span>
        <Icon
          name="ChevronDown"
          className={
            "h-4 w-4 shrink-0 text-slate-400 transition-transform " +
            (open ? "rotate-180" : "")
          }
        />
      </button>
      {open && <p className="px-4 pb-3 text-sm text-slate-600">{a}</p>}
    </div>
  );
}
