import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import { AuctionTicker } from "@/components/realtor/AuctionTicker";
import { AuctionLiveRoom } from "@/components/realtor/AuctionLiveRoom";
import { UpcomingAuctions } from "@/components/realtor/UpcomingAuctions";
import { ROLES } from "@/config/roles";
import { RoleId } from "@/types";

// =============================================================
// TRANG LIVE STREAM  (route: /realtor/livestream)
// Phong cách TikTok Live (video + chat + tim bay). Khi muốn đấu giá,
// người xem bấm nút búa (Gavel) trên video để mở bảng đấu giá
// trực tiếp của sản phẩm đang phát.
// Dùng chung header/footer với trang /realtor.
// =============================================================

export const metadata = {
  title: "Live stream | Q-Broker",
};

export default function LivestreamPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  // Giữ cơ chế role như trang /realtor: ?role=... -> hiện tên ở header.
  const roleId = searchParams.role as RoleId | undefined;
  const role = roleId && roleId !== "guest" ? ROLES[roleId] : undefined;

  return (
    <div className="min-h-screen bg-white">
      <RealtorHeader userName={role?.name} roleId={role?.id} />

      {/* Sân khấu tối: ticker giá + phòng livestream */}
      <AuctionTicker />
      <AuctionLiveRoom />

      {/* Phiên sắp diễn ra (nền sáng) */}
      <UpcomingAuctions />

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
