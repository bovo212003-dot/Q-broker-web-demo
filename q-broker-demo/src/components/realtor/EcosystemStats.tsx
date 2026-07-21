"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ECOSYSTEM_STATS, type EcosystemStat } from "@/data/homeModules";

// =============================================================
// DẢI SỐ LIỆU HỆ SINH THÁI — nằm ngay dưới hero, "gối" lên hero.
// Mỗi ô đếm động từ 0 -> giá trị khi cuộn tới (IntersectionObserver).
// =============================================================

export function EcosystemStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setRun(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative z-10 mx-auto -mt-12 max-w-6xl px-4 lg:px-8">
      <div
        ref={ref}
        className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-xl sm:grid-cols-4"
      >
        {ECOSYSTEM_STATS.map((stat, i) => (
          <StatCell key={stat.label} stat={stat} run={run} delay={i * 120} />
        ))}
      </div>
    </section>
  );
}

function StatCell({
  stat,
  run,
  delay,
}: {
  stat: EcosystemStat;
  run: boolean;
  delay: number;
}) {
  const value = useCountUp(stat.value, run, delay);
  return (
    <div className="group flex flex-col items-center gap-1 bg-white px-4 py-6 text-center transition-colors hover:bg-realtor-50/50">
      <span className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl bg-realtor-50 text-realtor-500 transition-transform group-hover:scale-110">
        <Icon name={stat.icon} className="h-5 w-5" />
      </span>
      <p className="text-2xl font-extrabold tracking-tight text-realtor-ink sm:text-3xl">
        {value}
        {stat.suffix}
      </p>
      <p className="text-xs font-medium text-slate-500">{stat.label}</p>
    </div>
  );
}

// Đếm động một chuỗi số kiểu VN ("12.500"). Trả về chuỗi đã định dạng lại.
function useCountUp(target: string, run: boolean, delay: number) {
  const goal = parseInt(target.replace(/\./g, ""), 10);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!run || Number.isNaN(goal)) return;
    let raf = 0;
    let start = 0;
    const duration = 1400;
    const timer = setTimeout(() => {
      const tick = (t: number) => {
        if (!start) start = t;
        const p = Math.min((t - start) / duration, 1);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(goal * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [run, goal, delay]);

  if (Number.isNaN(goal)) return target;
  return n.toLocaleString("vi-VN");
}
