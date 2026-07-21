import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorHero } from "@/components/realtor/RealtorHero";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import { EcosystemStats } from "@/components/realtor/EcosystemStats";
import { ModuleSpotlights } from "@/components/realtor/ModuleSpotlights";
import { AffiliateBanner } from "@/components/realtor/AffiliateBanner";
import { Reveal } from "@/components/ui/Reveal";
import { ROLES } from "@/config/roles";
import { RoleId } from "@/types";

// =============================================================
// TRANG CHỦ HỆ SINH THÁI Q-BROKER  (route: /realtor)
// Không rao bán sản phẩm — trọng tâm là 5 trụ cột dịch vụ:
// Đào tạo · Chia sẻ giỏ hàng · Cần thuê-mua · Live stream · Tuyển dụng.
// Bố cục: hero + số liệu + tổng quan trụ cột + spotlight chi tiết +
// affiliate + CTA tải app + footer. Trang full-width (không RoleShell).
// =============================================================

export default function RealtorPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  // Role đã đăng nhập (được truyền từ trang landing qua ?role=...).
  const roleId = searchParams.role as RoleId | undefined;
  const role = roleId && roleId !== "guest" ? ROLES[roleId] : undefined;
  const userName = role?.name;

  const affiliateHref = role
    ? `/realtor/affiliate?role=${role.id}`
    : "/realtor/affiliate";

  return (
    <div className="min-h-screen bg-white">
      <RealtorHeader userName={userName} roleId={role?.id} />
      <RealtorHero roleId={role?.id} />

      {/* Dải số liệu hệ sinh thái (gối lên hero) */}
      <EcosystemStats />

      {/* 5 trụ cột — mỗi module 1 panel chi tiết, xen kẽ trái/phải */}
      <ModuleSpotlights roleId={role?.id} />

      {/* Banner chương trình đối tác affiliate */}
      <AffiliateBanner href={affiliateHref} />

      {/* CTA tải app */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <Reveal>
          <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-realtor-600 to-realtor-500 px-8 py-12 text-center sm:flex-row sm:text-left">
            <Icon
              name="Smartphone"
              className="pointer-events-none absolute -bottom-6 right-8 h-40 w-40 rotate-12 text-white/10"
            />
            <div className="relative">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Cả hệ sinh thái trong túi bạn
              </h2>
              <p className="mt-2 max-w-lg text-realtor-50/90">
                Học nghề, bắt nhu cầu, xem live và kết nối đối tác — nhận thông
                báo tức thì mọi lúc mọi nơi trên ứng dụng Q-Broker.
              </p>
            </div>
            <div className="relative flex shrink-0 gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-realtor-ink transition-transform hover:-translate-y-0.5"
              >
                <Icon name="Apple" className="h-5 w-5" />
                App Store
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-realtor-ink transition-transform hover:-translate-y-0.5"
              >
                <Icon name="Play" className="h-5 w-5" />
                Google Play
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <RealtorFooter />

      {/* Nút nhỏ quay lại demo Q-Broker */}
      <div className="fixed bottom-4 right-4 z-30">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full bg-realtor-ink px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-slate-800"
        >
          <Icon name="ArrowLeft" className="h-3.5 w-3.5" />
          Về demo Q-Broker
        </Link>
      </div>
    </div>
  );
}
