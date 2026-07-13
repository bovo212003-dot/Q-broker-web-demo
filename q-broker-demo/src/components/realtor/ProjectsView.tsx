"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { withRole } from "@/lib/role";
import { RoleId } from "@/types";
import { formatVnd } from "@/data/realtorListings";
import {
  PROJECTS,
  PROJECT_REGIONS,
  PROJECT_STATUSES,
  STATUS_TONE,
  type ProjectStatus,
} from "@/data/projects";

// =============================================================
// DANH SÁCH DỰ ÁN (/realtor/du-an)
// Banner + bộ lọc (trạng thái, khu vực, tìm kiếm) + lưới card dự án.
// Bấm card -> sang trang chi tiết /realtor/du-an/[id].
// =============================================================

export function ProjectsView({ roleId }: { roleId?: RoleId }) {
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [region, setRegion] = useState<string | "all">("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return PROJECTS.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (region !== "all" && p.region !== region) return false;
      if (kw && !(`${p.name} ${p.developer} ${p.city}`.toLowerCase().includes(kw)))
        return false;
      return true;
    });
  }, [status, region, q]);

  return (
    <div className="bg-slate-50">
      {/* Banner */}
      <section className="relative overflow-hidden bg-realtor-ink">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=60)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-realtor-ink via-realtor-ink/90 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
            <Icon name="Building2" className="h-3.5 w-3.5" />
            Kho dự án Q-Broker
          </span>
          <h1 className="mt-4 max-w-2xl text-3xl font-bold text-white lg:text-4xl">
            Dự án bất động sản — giỏ hàng &amp; chính sách trực tiếp từ chủ đầu tư
          </h1>
          <p className="mt-3 max-w-xl text-sm text-slate-200 lg:text-base">
            Tra cứu bảng giá, phân khu, tiện ích và giỏ hàng căn theo thời gian
            thực. Cập nhật trạng thái căn còn/giữ chỗ/đã bán như bảng điện.
          </p>
        </div>
      </section>

      {/* Thanh lọc */}
      <div className="sticky top-16 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:px-8">
          {/* Tìm kiếm */}
          <div className="relative flex-1">
            <Icon
              name="Search"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm theo tên dự án, chủ đầu tư, vị trí..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-800 outline-none focus:border-realtor-500 focus:bg-white"
            />
          </div>

          {/* Lọc trạng thái */}
          <div className="flex flex-wrap items-center gap-1.5">
            <FilterChip active={status === "all"} onClick={() => setStatus("all")}>
              Tất cả
            </FilterChip>
            {PROJECT_STATUSES.map((s) => (
              <FilterChip key={s} active={status === s} onClick={() => setStatus(s)}>
                {s}
              </FilterChip>
            ))}
          </div>

          {/* Lọc khu vực */}
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-realtor-500"
          >
            <option value="all">Toàn quốc</option>
            {PROJECT_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lưới dự án */}
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <p className="mb-4 text-sm text-slate-500">
          <b className="text-slate-800">{filtered.length}</b> dự án
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <Icon name="SearchX" className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">
              Không tìm thấy dự án phù hợp bộ lọc.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <Link
                key={p.id}
                href={withRole(`/realtor/du-an/${p.id}`, roleId)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.cover}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span
                    className={
                      "absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 " +
                      STATUS_TONE[p.status]
                    }
                  >
                    {p.status}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-xs font-medium text-slate-200">
                      {p.developer}
                    </p>
                    <h3 className="text-lg font-bold text-white">{p.name}</h3>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <p className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Icon name="MapPin" className="h-4 w-4 shrink-0 text-slate-400" />
                    {p.city}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{p.tagline}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.highlights.slice(0, 2).map((h) => (
                      <span
                        key={h}
                        className="rounded-full bg-realtor-50 px-2 py-0.5 text-xs font-medium text-realtor-600"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3">
                    <div>
                      <p className="text-xs text-slate-400">Giá từ</p>
                      <p className="text-lg font-bold text-realtor-ink">
                        {formatVnd(p.priceFrom)}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-realtor-500 group-hover:gap-2 group-hover:transition-all">
                      Xem giỏ hàng
                      <Icon name="ArrowRight" className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold transition-colors " +
        (active
          ? "bg-realtor-500 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200")
      }
    >
      {children}
    </button>
  );
}
