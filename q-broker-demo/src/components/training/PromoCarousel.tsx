"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PROMO_SLIDES } from "@/data/training";
import { cn } from "@/lib/utils";

// Banner khuyến mại / tuyển dụng tự động luân chuyển (auto 6s) + mũi tên + chấm.
// - ctaHref: nếu truyền vào, nút CTA của mỗi slide ("Ứng tuyển ngay" / "Bắt đầu
//   học") trở thành liên kết điều hướng tới trang đó (vd trang Đào tạo). Không
//   truyền -> giữ nút thường (dùng trong chính trang Đào tạo).
export function PromoCarousel({ ctaHref }: { ctaHref?: string }) {
  const [i, setI] = useState(0);
  const count = PROMO_SLIDES.length;

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % count), 6000);
    return () => clearInterval(t);
  }, [count]);

  const go = (dir: number) => setI((v) => (v + dir + count) % count);

  // Class dùng chung cho nút CTA (render dưới dạng Link hoặc button).
  const ctaClass =
    "group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-flame-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-flame-500/30 transition-all hover:-translate-y-0.5 hover:bg-flame-600";

  const ctaInner = (label: string) => (
    <>
      {/* Vệt sáng quét qua khi hover */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-white/25 transition-transform duration-700 group-hover/btn:translate-x-[220%]" />
      <span className="relative">{label}</span>
      <Icon
        name="ArrowRight"
        className="relative h-4 w-4 transition-transform group-hover/btn:translate-x-1"
      />
    </>
  );

  return (
    <div className="group relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-al-900/30">
      {/* Khung trượt */}
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {PROMO_SLIDES.map((s) => (
          <div
            key={s.id}
            // Nền gradient navy LUÔN có sẵn làm lớp đáy.
            className="relative w-full shrink-0 overflow-hidden bg-gradient-to-br from-al-900 via-al-800 to-al-700"
          >
            {/* Ảnh nền qua CSS background-image (KHÔNG dùng thẻ <img>):
                nếu URL lỗi -> KHÔNG hiện icon "ảnh vỡ", chỉ lộ nền gradient. */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-out group-hover:scale-110"
              style={{ backgroundImage: `url("${s.image}")` }}
            />
            {/* Phủ gradient navy + đáy tối cho chữ/chấm nổi rõ */}
            <div className="absolute inset-0 bg-gradient-to-r from-al-900/95 via-al-900/80 to-al-700/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-al-900/80 via-transparent to-transparent" />
            {/* Quầng sáng cam trang trí */}
            <div className="absolute -right-20 -top-20 h-72 w-72 animate-float rounded-full bg-flame-500/25 blur-3xl" />

            <div className="relative flex min-h-[19rem] flex-col justify-center gap-4 p-6 sm:min-h-[23rem] sm:p-12">
              {/* Eyebrow dạng pill */}
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-flame-400/40 bg-flame-500/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-flame-400 backdrop-blur">
                <Icon name="Sparkles" className="h-3.5 w-3.5" />
                {s.eyebrow}
              </span>

              <h3 className="max-w-xl text-3xl font-extrabold leading-tight text-white drop-shadow sm:text-4xl">
                {s.title}
              </h3>
              <p className="max-w-md text-sm text-white/85 sm:text-base">
                {s.desc}
              </p>

              {/* Số liệu dạng thẻ kính mờ */}
              <div className="flex flex-wrap gap-2.5">
                {s.stats.map((st) => (
                  <div
                    key={st.label}
                    className="rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 backdrop-blur"
                  >
                    <p className="text-lg font-bold text-white">{st.value}</p>
                    <p className="text-[10px] uppercase tracking-wide text-white/60">
                      {st.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-3">
                {ctaHref ? (
                  <Link href={ctaHref} className={ctaClass}>
                    {ctaInner(s.cta)}
                  </Link>
                ) : (
                  <button type="button" className={ctaClass}>
                    {ctaInner(s.cta)}
                  </button>
                )}
                {s.phone && (
                  <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur">
                    <Icon name="Phone" className="h-4 w-4 text-flame-400" />
                    {s.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mũi tên điều hướng (hiện khi hover, ẩn trên mobile) */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Slide trước"
        className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition hover:bg-white/30 group-hover:opacity-100 sm:flex"
      >
        <Icon name="ChevronLeft" className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Slide sau"
        className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition hover:bg-white/30 group-hover:opacity-100 sm:flex"
      >
        <Icon name="ChevronRight" className="h-5 w-5" />
      </button>

      {/* Chấm điều hướng */}
      <div className="absolute bottom-4 left-6 flex gap-2 sm:left-12">
        {PROMO_SLIDES.map((s, idx) => (
          <button
            key={s.id}
            type="button"
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
