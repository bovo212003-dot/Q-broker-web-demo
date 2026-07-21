"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// =============================================================
// REVEAL — hiệu ứng xuất hiện khi cuộn tới (IntersectionObserver).
// Bọc bất kỳ nội dung nào; khi lọt vào khung nhìn sẽ trượt/mờ dần lên.
// - delay: trễ (ms) để tạo hiệu ứng so-le giữa các phần tử.
// - Tôn trọng prefers-reduced-motion: hiện luôn, không animate.
// =============================================================

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Hướng trượt vào: lên (mặc định), trái, phải. */
  from?: "up" | "left" | "right";
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  from = "up",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Người dùng tắt hiệu ứng -> hiện luôn.
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hidden =
    from === "left"
      ? "-translate-x-8 opacity-0"
      : from === "right"
      ? "translate-x-8 opacity-0"
      : "translate-y-8 opacity-0";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={
        "transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none " +
        (shown ? "translate-x-0 translate-y-0 opacity-100" : hidden) +
        (className ? " " + className : "")
      }
    >
      {children}
    </div>
  );
}
