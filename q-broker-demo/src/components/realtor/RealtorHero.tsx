"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

// Hero của Realtor.com: ảnh nền + lớp phủ tối, tiêu đề lớn,
// hàng tab (Buy/Rent/Sell/Sold/Home value) và ô tìm kiếm có nút đỏ.

const TABS = ["Mua", "Thuê", "Bán", "Đã bán", "Định giá"] as const;
type Tab = (typeof TABS)[number];

const HERO_BG =
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1600&q=70";

export function RealtorHero() {
  const [tab, setTab] = useState<Tab>("Mua");

  return (
    <section className="relative">
      {/* Ảnh nền + phủ tối */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/55" />

      {/* Nội dung */}
      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
        <h1 className="text-3xl font-bold text-white drop-shadow-sm sm:text-5xl">
          Tìm nhà bán và cho thuê gần bạn
        </h1>
        <p className="mt-3 text-base text-white/90 sm:text-lg">
          Tin đăng bất động sản chính xác nhất, cập nhật theo thời gian thực.
        </p>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap justify-center gap-1 rounded-t-xl">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "rounded-t-lg px-4 py-2.5 text-sm font-semibold transition-colors " +
                (tab === t
                  ? "bg-white text-realtor-ink"
                  : "bg-black/25 text-white hover:bg-black/40")
              }
            >
              {t}
            </button>
          ))}
        </div>

        {/* Ô tìm kiếm */}
        <div className="flex items-stretch overflow-hidden rounded-b-xl rounded-tr-xl bg-white shadow-xl">
          <div className="flex flex-1 items-center gap-2 px-4">
            <Icon name="MapPin" className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Địa chỉ, quận/huyện, thành phố hoặc khu vực"
              className="w-full bg-transparent py-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <button
            className="flex items-center gap-2 bg-realtor-500 px-5 font-semibold text-white transition-colors hover:bg-realtor-600"
            aria-label="Tìm kiếm"
          >
            <Icon name="Search" className="h-5 w-5" />
            <span className="hidden sm:inline">Tìm kiếm</span>
          </button>
        </div>
      </div>
    </section>
  );
}
