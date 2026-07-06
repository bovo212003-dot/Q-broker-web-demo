"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { PropertyCard } from "./PropertyCard";
import { Listing } from "@/data/realtorListings";

// Khối sản phẩm + bộ lọc khu vực (dùng chung state).
// - Không lọc (Tất cả): trang 1 = 8 sản phẩm gốc, trang 2 = sản phẩm mở rộng.
// - Bấm 1 khu vực bên dưới -> lưới hiển thị đúng sản phẩm khu vực đó.

const PER_PAGE = 8; // số sản phẩm mỗi trang

export function RealtorListings({
  listings,
  regions,
}: {
  listings: Listing[];
  regions: string[];
}) {
  const [region, setRegion] = useState<string | null>(null); // null = Tất cả
  const [page, setPage] = useState(1);

  const filtered = region
    ? listings.filter((l) => l.region === region)
    : listings;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const current = filtered.slice(start, start + PER_PAGE);

  const goTo = (p: number) => setPage(Math.min(totalPages, Math.max(1, p)));

  // Chọn khu vực -> đặt lại về trang 1.
  const pickRegion = (r: string | null) => {
    setRegion(r);
    setPage(1);
  };

  return (
    <>
      {/* Danh sách sản phẩm */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-realtor-ink">
              Bất động sản cho bạn
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {region
                ? `Sản phẩm tại ${region}`
                : "Dựa trên các tin bạn vừa xem gần đây"}
            </p>
          </div>
          {region && (
            <button
              type="button"
              onClick={() => pickRegion(null)}
              className="hidden items-center gap-1 text-sm font-semibold text-realtor-500 hover:text-realtor-600 sm:inline-flex"
            >
              <Icon name="X" className="h-4 w-4" />
              Bỏ lọc
            </button>
          )}
        </div>

        {current.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {current.map((l) => (
              <PropertyCard key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
            Chưa có sản phẩm tại khu vực này.
          </div>
        )}

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={() => goTo(page - 1)}
              disabled={page === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Trang trước"
            >
              <Icon name="ChevronLeft" className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => goTo(p)}
                className={
                  "flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-semibold transition-colors " +
                  (p === page
                    ? "bg-realtor-500 text-white"
                    : "border border-slate-300 text-slate-600 hover:bg-slate-100")
                }
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              onClick={() => goTo(page + 1)}
              disabled={page === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Trang sau"
            >
              <Icon name="ChevronRight" className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>

      {/* Bộ lọc theo khu vực */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <h2 className="text-2xl font-bold text-realtor-ink">
            Khám phá bất động sản theo khu vực
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Chọn khu vực để xem các sản phẩm tương ứng
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {/* Chip "Tất cả" */}
            <button
              type="button"
              onClick={() => pickRegion(null)}
              className={
                "flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-semibold shadow-sm transition-colors " +
                (region === null
                  ? "border-realtor-500 bg-realtor-500 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-realtor-200 hover:text-realtor-500")
              }
            >
              Tất cả khu vực
              <Icon name="LayoutGrid" className="h-4 w-4" />
            </button>

            {regions.map((city) => {
              const active = region === city;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => pickRegion(city)}
                  className={
                    "flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-semibold shadow-sm transition-colors " +
                    (active
                      ? "border-realtor-500 bg-realtor-500 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-realtor-200 hover:text-realtor-500")
                  }
                >
                  Nhà tại {city}
                  <Icon
                    name="ChevronRight"
                    className={"h-4 w-4 " + (active ? "text-white" : "text-slate-400")}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
