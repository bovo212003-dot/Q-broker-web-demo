"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Listing, formatVnd } from "@/data/realtorListings";

// Popup chi tiết sản phẩm BĐS: thư viện ảnh + đầy đủ thông số,
// mô tả, tiện ích và thông tin liên hệ môi giới.
// Hiển thị ngay trên trang hiện tại (không điều hướng sang trang khác).

const TAG_TONE: Record<NonNullable<Listing["tagTone"]>, string> = {
  new: "bg-realtor-500 text-white",
  tour: "bg-slate-900/80 text-white",
  open: "bg-emerald-600 text-white",
};

export function PropertyModal({
  listing,
  onClose,
}: {
  listing: Listing;
  onClose: () => void;
}) {
  // Toàn bộ ảnh = ảnh đại diện + ảnh phụ.
  const images = [listing.image, ...(listing.gallery ?? [])];
  const [active, setActive] = useState(0);

  // Bảng thông số nhanh.
  const specs: { label: string; value: string; icon: string }[] = [
    { label: "Phòng ngủ", value: `${listing.beds} PN`, icon: "BedDouble" },
    { label: "Vệ sinh", value: `${listing.baths} WC`, icon: "Bath" },
    { label: "Diện tích", value: `${listing.area} m²`, icon: "Ruler" },
    ...(listing.lot ? [{ label: "Loại hình", value: listing.lot, icon: "Home" }] : []),
    ...(listing.direction ? [{ label: "Hướng", value: listing.direction, icon: "Compass" }] : []),
    ...(listing.floors ? [{ label: "Số tầng", value: `${listing.floors}`, icon: "Layers" }] : []),
    ...(listing.legal ? [{ label: "Pháp lý", value: listing.legal, icon: "FileCheck" }] : []),
    ...(listing.furniture ? [{ label: "Nội thất", value: listing.furniture, icon: "Sofa" }] : []),
    ...(listing.yearBuilt ? [{ label: "Năm hoàn thành", value: `${listing.yearBuilt}`, icon: "Calendar" }] : []),
  ];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"
          aria-label="Đóng"
        >
          <Icon name="X" className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto">
          {/* Thư viện ảnh */}
          <div className="bg-slate-100">
            <div className="relative h-64 w-full sm:h-80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[active]}
                alt={listing.address}
                className="h-full w-full object-cover"
              />
              {listing.tag && (
                <span
                  className={
                    "absolute left-4 top-4 rounded px-2 py-1 text-xs font-semibold " +
                    TAG_TONE[listing.tagTone ?? "new"]
                  }
                >
                  {listing.tag}
                </span>
              )}
            </div>
            {/* Hàng ảnh nhỏ để chuyển ảnh */}
            <div className="flex gap-2 overflow-x-auto p-3">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={
                    "h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 " +
                    (active === i ? "border-realtor-500" : "border-transparent")
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Ảnh ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Nội dung */}
          <div className="p-5 sm:p-6">
            <p className="text-2xl font-bold text-realtor-ink">
              {formatVnd(listing.price)}
            </p>
            <p className="mt-1 text-base font-semibold text-slate-800">
              {listing.address}
            </p>
            <p className="flex items-center gap-1 text-sm text-slate-500">
              <Icon name="MapPin" className="h-4 w-4" />
              {listing.city}
            </p>

            {/* Thông số nhanh */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
                >
                  <Icon name={s.icon} className="h-5 w-5 shrink-0 text-realtor-500" />
                  <div className="min-w-0">
                    <p className="text-[0.7rem] uppercase tracking-wide text-slate-400">
                      {s.label}
                    </p>
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {s.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mô tả */}
            {listing.description && (
              <div className="mt-6">
                <h3 className="text-base font-bold text-slate-900">Mô tả sản phẩm</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {listing.description}
                </p>
              </div>
            )}

            {/* Tiện ích / điểm nổi bật */}
            {listing.features && listing.features.length > 0 && (
              <div className="mt-6">
                <h3 className="text-base font-bold text-slate-900">Tiện ích & điểm nổi bật</h3>
                <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {listing.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                      <Icon name="Check" className="h-4 w-4 shrink-0 text-emerald-600" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Môi giới + liên hệ */}
            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {listing.broker}
                </p>
                {listing.phone && (
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                    <Icon name="Phone" className="h-4 w-4 text-realtor-500" />
                    {listing.phone}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-lg bg-realtor-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-realtor-600"
                >
                  <Icon name="Headphones" className="h-4 w-4" />
                  Tư vấn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
