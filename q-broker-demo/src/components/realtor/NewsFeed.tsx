"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  CATEGORY_LABEL,
  NEWS_ARTICLES,
  NEWS_CATEGORIES,
  NewsCategoryId,
} from "@/data/news";

// =============================================================
// FEED TIN TỨC (client) — thanh tab chuyên mục + lưới bài viết.
// Lọc tại chỗ theo chuyên mục, kiểu chuyên trang tin của
// Zillow/Realtor.com. "Xem thêm" tăng dần số bài hiển thị.
// =============================================================

const PAGE_SIZE = 6;

export function NewsFeed() {
  const [cat, setCat] = useState<NewsCategoryId | "all">("all");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const articles = NEWS_ARTICLES.filter(
    (a) => cat === "all" || a.category === cat
  );
  const visible = articles.slice(0, limit);

  const pick = (id: NewsCategoryId | "all") => {
    setCat(id);
    setLimit(PAGE_SIZE); // đổi chuyên mục -> reset phân trang
  };

  return (
    <div>
      {/* Thanh tab chuyên mục (cuộn ngang trên mobile) */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[{ id: "all" as const, label: "Tất cả" }, ...NEWS_CATEGORIES].map(
          (c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => pick(c.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                cat === c.id
                  ? "bg-realtor-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c.label}
            </button>
          )
        )}
      </div>

      {/* Lưới bài viết */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {visible.map((a) => (
          <a
            key={a.id}
            href="#"
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative h-44 overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.image}
                alt={a.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-realtor-600 backdrop-blur-sm">
                {CATEGORY_LABEL[a.category]}
              </span>
            </div>
            <div className="p-4">
              <h3 className="line-clamp-2 text-base font-bold leading-snug text-realtor-ink group-hover:text-realtor-600">
                {a.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                {a.excerpt}
              </p>
              <p className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-realtor-50 text-[10px] font-bold text-realtor-600">
                  {a.author.charAt(0)}
                </span>
                {a.author}
                <span className="ml-auto">{a.date}</span>
                <span>·</span>
                <span>{a.readMins} phút</span>
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Trạng thái rỗng (chuyên mục chưa có bài) */}
      {visible.length === 0 && (
        <p className="mt-10 text-center text-sm text-slate-500">
          Chưa có bài viết trong chuyên mục này.
        </p>
      )}

      {/* Xem thêm */}
      {articles.length > limit && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setLimit((v) => v + PAGE_SIZE)}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:border-realtor-500 hover:text-realtor-500"
          >
            Xem thêm bài viết
            <Icon name="ChevronDown" className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
