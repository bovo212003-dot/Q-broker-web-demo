"use client";

import { Icon } from "@/components/ui/Icon";
import { SharedProperty, SOURCE_META } from "@/data/sharing";
import { cn } from "@/lib/utils";

// Thẻ nguồn hàng trong kho chung.
// received: đã nhận vào giỏ của tôi chưa (toggle từ view cha).
export function InventoryCard({
  item,
  received,
  onToggle,
}: {
  item: SharedProperty;
  received: boolean;
  onToggle: () => void;
}) {
  const src = SOURCE_META[item.source.kind];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      {/* Ảnh */}
      <div className="relative h-44 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        {/* Badge xác minh (bắt buộc theo requirement) */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">
          <Icon name="ShieldCheck" className="h-3.5 w-3.5" />
          Đã xác minh
        </span>
        {/* Hoa hồng chia sẻ */}
        <span className="absolute right-3 top-3 rounded-full bg-flame-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">
          Hoa hồng {item.commission}%
        </span>

        {/* Giá */}
        <p className="absolute bottom-3 left-3 text-xl font-bold text-white drop-shadow">
          {item.price}
        </p>
      </div>

      {/* Nội dung */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-bold leading-snug text-slate-800">
          {item.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
          <Icon name="MapPin" className="h-3.5 w-3.5" />
          {item.area}
          <span className="text-slate-300">·</span>
          <Icon name="Ruler" className="h-3.5 w-3.5" />
          {item.size} m²
          <span className="text-slate-300">·</span>
          {item.kind}
        </p>

        {/* Nguồn chia sẻ */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
              src.tone
            )}
          >
            <Icon name={src.icon} className="h-3.5 w-3.5" />
            {item.source.name}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
            <Icon name="Users" className="h-3.5 w-3.5" />
            {item.receivers + (received ? 1 : 0)} môi giới đã nhận
          </span>
        </div>

        {/* Hành động */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={onToggle}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold transition-all",
              received
                ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                : "bg-al-600 text-white hover:bg-al-700"
            )}
          >
            <Icon name={received ? "CheckCircle2" : "ShoppingCart"} className="h-4 w-4" />
            {received ? "Đã nhận vào giỏ" : "Nhận vào giỏ"}
          </button>
          <button
            aria-label="Chia sẻ qua Zalo"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:border-al-300 hover:text-al-600"
          >
            <Icon name="Share2" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
