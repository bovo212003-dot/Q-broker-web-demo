import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import { ShareCartView } from "@/components/sharing/ShareCartView";
import { resolveRole } from "@/lib/role";

// =============================================================
// TRANG CHIA SẺ GIỎ HÀNG  (/realtor/chia-se-gio-hang)
// Chia sẻ nguồn hàng bất động sản giữa các bên trong hệ sinh thái.
// Theo requirement, chỉ dành cho: Môi giới, Sàn giao dịch, Ngân hàng
// (+ Chủ đầu tư ở giai đoạn tiếp theo). Role khác thấy màn giới thiệu.
// =============================================================
export default function ChiaSeGioHangPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const { roleId, name } = resolveRole(searchParams.role);

  return (
    <div className="min-h-screen bg-slate-50">
      <RealtorHeader userName={name} roleId={roleId} />
      <ShareCartView roleId={roleId} roleName={name} />
      <RealtorFooter />
    </div>
  );
}
