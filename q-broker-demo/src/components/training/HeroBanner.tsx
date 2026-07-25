"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { HERO_BANNERS } from "@/data/training";

// Banner ẢNH trong hero Đào tạo (ô bên phải): chỉ hiển thị ảnh,
// cuộn ngang tự động mỗi 3 giây; dừng khi rê chuột; chấm chuyển slide.
// Ảnh lấy từ HERO_BANNERS (data/training.ts) — thay bằng ảnh công ty sau.

const INTERVAL_MS = 3000;

export function HeroBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(
      () => setIndex((i) => (i + 1) % HERO_BANNERS.length),
      INTERVAL_MS
    );
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative h-60 overflow-hidden rounded-2xl border border-white/15 bg-white/10 sm:h-64"
    >
      {/* Dải ảnh cuộn ngang */}
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {HERO_BANNERS.map((b) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={b.id}
            src={b.image}
            alt={b.alt ?? ""}
            className="h-full w-full shrink-0 object-cover"
          />
        ))}
      </div>

      {/* Chấm chuyển slide */}
      <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
        {HERO_BANNERS.map((b, i) => (
          <button
            key={b.id}
            onClick={() => setIndex(i)}
            aria-label={`Banner ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === index ? "w-5 bg-flame-400" : "w-1.5 bg-white/50 hover:bg-white/80"
            )}
          />
        ))}
      </div>
    </div>
  );
}
