"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { CATEGORY_LABEL, NewsArticle } from "@/data/news";

// =============================================================
// HERO SLIDER TIN NỔI BẬT — tự chuyển tin mỗi 5s với hiệu ứng
// crossfade + zoom nhẹ (kiểu hero carousel báo lớn). Có mũi tên
// trái/phải, chấm điều hướng + thanh tiến trình; dừng khi hover.
// =============================================================

const INTERVAL_MS = 5000;

export function NewsHeroSlider({ slides }: { slides: NewsArticle[] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  // Đổi key để restart animation thanh tiến trình mỗi lần chuyển slide.
  const tickRef = useRef(0);
  tickRef.current += 1;

  // Tự chuyển tin; dừng khi đang hover (người dùng đang đọc).
  useEffect(() => {
    if (paused || slides.length < 2) return;
    const iv = setInterval(
      () => setIdx((i) => (i + 1) % slides.length),
      INTERVAL_MS
    );
    return () => clearInterval(iv);
  }, [paused, slides.length]);

  const go = (i: number) => setIdx((i + slides.length) % slides.length);

  return (
    <div
      className="group relative min-h-80 overflow-hidden rounded-2xl bg-slate-900 lg:min-h-[26rem]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Các slide chồng lên nhau, crossfade bằng opacity */}
      {slides.map((a, i) => (
        <a
          key={a.id}
          href="#"
          aria-hidden={i !== idx}
          tabIndex={i === idx ? 0 : -1}
          className={`absolute inset-0 block transition-opacity duration-700 ease-out ${
            i === idx ? "z-10 opacity-100" : "z-0 pointer-events-none opacity-0"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={a.image}
            alt={a.title}
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[6000ms] ease-linear ${
              i === idx ? "scale-105" : "scale-100"
            }`}
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

          {/* Nội dung chữ: trượt nhẹ từ dưới lên khi slide active */}
          <div
            className={`absolute inset-x-0 bottom-0 p-6 pb-12 transition-all delay-150 duration-700 ${
              i === idx ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/75">
              <span className="rounded-full bg-white/20 px-2 py-0.5 font-semibold text-white">
                {CATEGORY_LABEL[a.category]}
              </span>
              <span>{a.date}</span>
              <span>·</span>
              <span>{a.readMins} phút đọc</span>
            </p>
            <h2 className="mt-2 text-xl font-extrabold leading-snug text-white sm:text-2xl">
              {a.title}
            </h2>
            <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-white/80">
              {a.excerpt}
            </p>
          </div>
        </a>
      ))}

      {/* Mũi tên trái/phải (hiện rõ khi hover) */}
      <button
        type="button"
        onClick={() => go(idx - 1)}
        aria-label="Tin trước"
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/60 focus:opacity-100 group-hover:opacity-100"
      >
        <Icon name="ChevronLeft" className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(idx + 1)}
        aria-label="Tin tiếp theo"
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/60 focus:opacity-100 group-hover:opacity-100"
      >
        <Icon name="ChevronRight" className="h-5 w-5" />
      </button>

      {/* Chấm điều hướng: chấm active giãn thành thanh tiến trình */}
      <div className="absolute bottom-4 left-6 z-20 flex items-center gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(i)}
            aria-label={`Chuyển tới tin ${i + 1}`}
            className={`h-1.5 overflow-hidden rounded-full transition-all duration-300 ${
              i === idx ? "w-8 bg-white/40" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
          >
            {i === idx && (
              <span
                key={tickRef.current}
                className="block h-full rounded-full bg-white"
                style={{
                  animation: paused
                    ? "none"
                    : `news-progress ${INTERVAL_MS}ms linear forwards`,
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
