import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import { CanThueMuaView } from "@/components/auction/CanThueMuaView";
import { resolveRole } from "@/lib/role";

// =============================================================
// TRANG CẦN THUÊ - MUA  (/realtor/can-thue-mua)
// Bảng tin chờ kết nối giữa khách hàng và môi giới. Giao diện tách
// theo vai trò:
//   - Khách hàng: đăng nhu cầu -> tin treo chờ môi giới đăng ký ->
//     chọn môi giới -> AI ghép nối 1 người phù hợp nhất.
//   - Môi giới  : bảng tin nhu cầu đang mở, lọc theo khu vực đảm
//     nhiệm -> "Nhận tư vấn" (xếp hàng đợi) -> trao đổi với khách.
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
