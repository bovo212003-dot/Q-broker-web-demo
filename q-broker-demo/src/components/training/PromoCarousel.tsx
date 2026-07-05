"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { PROMO_SLIDES } from "@/data/training";
import { cn } from "@/lib/utils";

// Banner khuyến mại / tuyển dụng tự động luân chuyển (auto 5s) + chấm điều hướng.
export function PromoCarousel() {
  const [i, setI] = useState(0);
  const count = PROMO_SLIDES.length;

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % count), 5000);
    return () => clearInterval(t);
  }, [count]);

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-lg">
      {/* Khung trượt */}
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {PROMO_SLIDES.map((s) => (
          <div key={s.id} className="relative w-full shrink-0">
            {/* Ảnh nền + phủ navy */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.image}
              alt={s.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-al-900/95 via-al-800/85 to-al-600/40" />

            <div className="relative flex min-h-[16rem] flex-col justify-center gap-4 p-6 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-widest text-flame-400">
                {s.eyebrow}
              </p>
              <h3 className="max-w-lg text-2xl font-bold leading-tight text-white sm:text-3xl">
                {s.title}
              </h3>
              <p className="max-w-md text-sm text-white/80">{s.desc}</p>

              {/* Số liệu */}
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {s.stats.map((st) => (
                  <div key={st.label}>
                    <p className="text-xl font-bold text-white">{st.value}</p>
                    <p className="text-[11px] uppercase tracking-wide text-white/60">
                      {st.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-xl bg-flame-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5 hover:bg-flame-600">
                  {s.cta}
                  <Icon name="ArrowRight" className="h-4 w-4" />
                </button>
                {s.phone && (
                  <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur">
                    <Icon name="Phone" className="h-4 w-4 text-flame-400" />
                    {s.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chấm điều hướng */}
      <div className="absolute bottom-4 left-6 flex gap-2 sm:left-10">
        {PROMO_SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={cn(
              "h-2 rounded-full transition-all",
              idx === i ? "w-6 bg-flame-500" : "w-2 bg-white/50 hover:bg-white/80"
            )}
          />
        ))}
      </div>
    </div>
  );
}
