"use client";

import { useEffect, useRef, type ReactNode } from "react";

// =============================================================
// PARALLAX — dịch chuyển một lớp theo tiến trình cuộn, tạo chiều sâu.
// Lớp con nên cao/rộng hơn khung chứa (vd h-[130%] -top-[15%]) để khi
// dịch không lộ mép. Tôn trọng prefers-reduced-motion (tắt hiệu ứng).
// speed: biên độ dịch tối đa (px). Số dương -> lớp trôi chậm hơn nền.
// =============================================================

export function Parallax({
  speed = 40,
  className = "",
  children,
}: {
  speed?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progress ~ -1 (dưới màn hình) .. 0 (giữa) .. 1 (trên màn hình)
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      el.style.transform = `translate3d(0, ${(-progress * speed).toFixed(
        1
      )}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={ref} className={"will-change-transform " + className}>
      {children}
    </div>
  );
}
