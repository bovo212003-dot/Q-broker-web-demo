import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import { AuctionTicker } from "@/components/realtor/AuctionTicker";
import { AuctionExchange } from "@/components/realtor/AuctionExchange";
import { ROLES } from "@/config/roles";
import { RoleId } from "@/types";

// =============================================================
// SÀN ĐẤU GIÁ  (route: /realtor/dau-gia)
// Bảng điện kiểu cafef/HOSE: mỗi lô BĐS là một "mã", giá nhảy
// realtime, có biểu đồ diễn biến + panel đặt lệnh.
// Nút búa ở trang livestream dẫn sang đây kèm ?lot=<id> để chọn
// sẵn đúng lô đang phát.
// =============================================================

export const metadata = {
  title: "Sàn đấu giá | Q-Broker",
};

export default function DauGiaPage({
  searchParams,
}: {
  searchParams: { role?: string; lot?: string };
}) {
  // Giữ cơ chế role như trang /realtor: ?role=... -> hiện tên ở header.
  const roleId = searchParams.role as RoleId | undefined;
  const role = roleId && roleId !== "guest" ? ROLES[roleId] : undefined;

  return (
    <div className="min-h-screen bg-white">
      <RealtorHeader userName={role?.name} roleId={role?.id} />

      {/* Sân khấu tối: ticker giá + bảng điện sàn đấu giá */}
      <AuctionTicker />
      <AuctionExchange initialLotId={searchParams.lot} />

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
