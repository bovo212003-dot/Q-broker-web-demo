"use client";

import { useEffect, useRef } from "react";

// =============================================================
// KHUNG NHÚNG VIDEO INTRO Q-BROKER
// Animation GSAP chạy trong public/qbroker-intro.html — nhúng qua iframe
// để giữ nguyên fonts/CDN của nó mà không đụng global CSS của app.
//
// variant:
//   "card" (mặc định) — khung 16:9 bo góc 16px + đổ bóng, dùng khi đặt
//                       trong container có padding.
//   "full"            — banner full-bleed: không bo góc, không shadow;
//                       21:9 từ breakpoint lg trở lên, 16:9 trên mobile.
//
// Sân khấu bên trong là 1920×820 (~21:9) và scale kiểu "contain"
// (xem fitStage trong qbroker-intro.html). Khung 21:9 ở desktop khớp gần
// như tuyệt đối; khung 16:9 ở mobile sẽ dư một dải trên/dưới, nhưng nền
// ngoài sân khấu dùng đúng gradient navy nên không lộ mép.
//
// Là client component vì cần IntersectionObserver: khi banner cuộn ra khỏi
// màn hình, ta báo xuống iframe để nó dừng timeline + vòng vẽ particles.
// Không có phần này thì animation chạy vĩnh viễn dưới nền và đốt pin.
// =============================================================

export function QBrokerIntroVideo({
  className = "",
  variant = "card",
}: {
  className?: string;
  variant?: "full" | "card";
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || typeof IntersectionObserver === "undefined") return;

    const send = (msg: string) => {
      // targetOrigin giới hạn ở chính origin của app — iframe là file tĩnh
      // cùng origin nên không cần "*".
      frameRef.current?.contentWindow?.postMessage(msg, window.location.origin);
    };

    const io = new IntersectionObserver(
      ([entry]) =>
        send(entry.isIntersecting ? "qb-intro:visible" : "qb-intro:hidden"),
      // Chớm thấy 10% là cho chạy lại, tránh bật/tắt liên tục ở rìa màn hình.
      { threshold: 0.1 }
    );
    io.observe(box);
    return () => io.disconnect();
  }, []);

  const shape =
    variant === "full"
      ? "aspect-video lg:aspect-[21/9]"
      : "aspect-video rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/10";

  return (
    <div
      ref={boxRef}
      className={`relative w-full overflow-hidden bg-realtor-ink ${shape} ${className}`}
    >
      <iframe
        ref={frameRef}
        src="/qbroker-intro.html"
        title="Q-Broker Intro"
        allow="autoplay; fullscreen"
        loading="lazy"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
