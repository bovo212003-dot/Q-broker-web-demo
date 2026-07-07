import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import { FriendsView } from "@/components/realtor/FriendsView";
import { resolveRole } from "@/lib/role";

// =============================================================
// TRANG KẾT BẠN  (/realtor/ket-ban)
// Mạng xã hội nội bộ Q-Broker (kiểu Facebook/LinkedIn). Danh sách
// bạn bè / lời mời / gợi ý được lọc theo LUẬT KẾT BẠN của role hiện
// tại (xem data/friends.ts):
//   - Môi giới   chỉ kết bạn với  môi giới.
//   - Khách hàng kết bạn với  khách hàng + môi giới.
// Thuộc cổng chung /realtor, đọc ?role= như các trang khác.
// =============================================================

export const metadata = {
  title: "Kết bạn | Q-Broker",
};

export default function KetBanPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const { roleId, name } = resolveRole(searchParams.role);

  return (
    <div className="min-h-screen bg-slate-50">
      <RealtorHeader userName={name} roleId={roleId} />
      <FriendsView roleId={roleId} />
      <RealtorFooter />
    </div>
  );
}
