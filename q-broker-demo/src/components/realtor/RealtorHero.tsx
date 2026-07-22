import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { QBrokerIntroVideo } from "@/components/QBrokerIntroVideo";
import { withRole } from "@/lib/role";
import { RoleId } from "@/types";

// =============================================================
// HERO TRANG CHỦ — banner video full-bleed
// Video intro GSAP (public/qbroker-intro.html) chiếm trọn chiều rộng
// hero, tràn sát mép trái/phải: 21:9 từ lg trở lên, 16:9 trên mobile.
// Không còn cột chữ — nội dung giới thiệu đã nằm trong chính video.
// Dưới video là 2 CTA căn giữa; dải số liệu (EcosystemStats) do
// src/app/realtor/page.tsx render tiếp ngay sau section này.
// =============================================================

export function RealtorHero({ roleId }: { roleId?: RoleId }) {
  return (
    <section
      className="relative overflow-hidden bg-realtor-ink"
      aria-label="Giới thiệu hệ sinh thái Q-Broker"
    >
      {/* Vệt sáng nền cho khớp tông navy/vàng của video */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 -right-40 h-[34rem] w-[34rem] rounded-full bg-amber-400/10 blur-3xl"
      />

      {/* Video full-bleed: đặt ngoài container có padding nên tự tràn
          sát hai mép, không cần negative margin. */}
      <QBrokerIntroVideo variant="full" />

      {/* CTA căn giữa ngay dưới video */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 pb-20 pt-10 sm:flex-row sm:justify-center lg:px-8">
        <a
          href="#dich-vu"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-realtor-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-realtor-900/30 transition-all hover:-translate-y-0.5 hover:bg-realtor-600 sm:w-auto"
        >
          <Icon name="Compass" className="h-4 w-4" />
          Khám phá dịch vụ
        </a>
        <Link
          href={withRole("/realtor/dao-tao", roleId)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/20 sm:w-auto"
        >
          <Icon name="GraduationCap" className="h-4 w-4" />
          Bắt đầu học nghề
        </Link>
      </div>
    </section>
  );
}
