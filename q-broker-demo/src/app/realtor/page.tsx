import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorHero } from "@/components/realtor/RealtorHero";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import { RealtorListings } from "@/components/realtor/RealtorListings";
import { AffiliateBanner } from "@/components/realtor/AffiliateBanner";
import { LISTINGS, POPULAR_CITIES } from "@/data/realtorListings";
import { ROLES } from "@/config/roles";
import { RoleId } from "@/types";

// =============================================================
// TRANG CLONE REALTOR.COM  (route: /realtor)
// Tái hiện trang chủ realtor.com: header + hero tìm kiếm +
// "Homes for you" + khám phá thành phố + CTA tải app + footer.
// Trang độc lập, KHÔNG dùng RoleShell (full-width như site thật).
// =============================================================

export default function RealtorPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  // Role đã đăng nhập (được truyền từ trang landing qua ?role=...).
  // - guest / không có role  -> không hiện tên, giữ nút "Đăng nhập".
  // - role hợp lệ khác        -> hiện tên role ở góc phải header.
  const roleId = searchParams.role as RoleId | undefined;
  const role =
    roleId && roleId !== "guest" ? ROLES[roleId] : undefined;
  const userName = role?.name; // sau này thay bằng tên thật của người dùng

  return (
    <div className="min-h-screen bg-white">
      <RealtorHeader userName={userName} roleId={role?.id} />
      <RealtorHero />

      {/* Sản phẩm + bộ lọc theo khu vực */}
      <RealtorListings listings={LISTINGS} regions={POPULAR_CITIES} />

      {/* Banner chương trình đối tác affiliate (giữ ?role= khi điều hướng) */}
      <AffiliateBanner
        href={
          role ? `/realtor/affiliate?role=${role.id}` : "/realtor/affiliate"
        }
      />

      {/* CTA tải app */}
      <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 overflow-hidden rounded-2xl bg-realtor-500 px-8 py-10 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Tải ứng dụng Q-BROKER
            </h2>
            <p className="mt-2 max-w-lg text-realtor-50/90">
              Tìm nhà mọi lúc mọi nơi, nhận thông báo tức thì khi có tin mới và
              kết nối với môi giới — tất cả trong một ứng dụng.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-realtor-ink hover:bg-realtor-50"
            >
              <Icon name="Apple" className="h-5 w-5" />
              App Store
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-realtor-ink hover:bg-realtor-50"
            >
              <Icon name="Play" className="h-5 w-5" />
              Google Play
            </a>
          </div>
        </div>
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
