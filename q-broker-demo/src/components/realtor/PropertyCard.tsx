"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Listing, formatVnd } from "@/data/realtorListings";
import { PropertyModal } from "./PropertyModal";

// Thẻ tin BĐS theo phong cách Realtor.com:
// ảnh (nút lưu tim + nhãn góc), giá đậm, dòng beds/baths/sqft, địa chỉ, môi giới.
// Bấm vào thẻ -> mở popup chi tiết ngay trên trang (không đổi trang).

const TAG_TONE: Record<NonNullable<Listing["tagTone"]>, string> = {
  new: "bg-realtor-500 text-white",
  tour: "bg-slate-900/80 text-white",
  open: "bg-emerald-600 text-white",
};

export function PropertyCard({ listing }: { listing: Listing }) {
  const [saved, setSaved] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  return (
    <article
      onClick={() => setOpenDetail(true)}
      className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Ảnh */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing.image}
          alt={listing.address}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {listing.tag && (
          <span
            className={
              "absolute left-3 top-3 rounded px-2 py-1 text-xs font-semibold " +
              TAG_TONE[listing.tagTone ?? "new"]
            }
          >
            {listing.tag}
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSaved((v) => !v);
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"
          aria-label={saved ? "Bỏ lưu" : "Lưu tin"}
        >
          <Icon
            name="Heart"
            className={
              "h-4 w-4 " + (saved ? "fill-realtor-500 text-realtor-500" : "")
            }
          />
        </button>
        {/* Nhãn khẳng định nguồn hàng từ Sàn đã được thẩm định pháp lý */}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-semibold text-emerald-700 shadow">
          <Icon name="BadgeCheck" className="h-3.5 w-3.5" />
          Đã thẩm định
        </span>
      </div>

      {/* Thông tin */}
      <div className="p-4">
        <p className="text-xl font-bold text-realtor-ink">
          {formatVnd(listing.price)}
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-slate-700">
          <span>
            <b className="font-semibold">{listing.beds}</b> PN
          </span>
          <span className="text-slate-300">|</span>
          <span>
            <b className="font-semibold">{listing.baths}</b> WC
          </span>
          <span className="text-slate-300">|</span>
          <span>
            <b className="font-semibold">{listing.area.toLocaleString("vi-VN")}</b> m²
          </span>
          {listing.lot && (
            <>
              <span className="text-slate-300">|</span>
              <span>{listing.lot}</span>
            </>
          )}
        </p>
        <p className="mt-1 text-sm text-slate-800">{listing.address}</p>
        <p className="text-sm text-slate-500">{listing.city}</p>
        <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
          {listing.broker}
        </p>
      </div>

      {/* Popup chi tiết */}
      {openDetail && (
        <PropertyModal listing={listing} onClose={() => setOpenDetail(false)} />
      )}
    </article>
  );
}
