import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import { CanThueMuaView } from "@/components/auction/CanThueMuaView";
import { resolveRole } from "@/lib/role";

// =============================================================
// TRANG CẦN THUÊ - MUA  (/realtor/can-thue-mua)
// Đăng nhu cầu Mua / Thuê BĐS & Đấu giá quyền môi giới (Broker Auction).
// Trang thuộc cổng chung (/realtor) nhưng trải nghiệm hiện tại dành cho
// role KHÁCH HÀNG; giao diện cho Môi giới sẽ xây riêng sau.
// =============================================================
export default function CanThueMuaPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const { roleId, name } = resolveRole(searchParams.role);

  return (
    <div className="min-h-screen bg-slate-50">
      <RealtorHeader userName={name} roleId={roleId} />
      <CanThueMuaView roleId={roleId} roleName={name} />
      <RealtorFooter />
    </div>
  );
}
