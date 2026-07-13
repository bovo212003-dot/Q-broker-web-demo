import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import { PriceQuoteView } from "@/components/realtor/PriceQuoteView";
import { resolveRole } from "@/lib/role";

// =============================================================
// TRANG PHIẾU TÍNH GIÁ 30S  (/realtor/phieu-tinh-gia)
// Công cụ bán hàng cho môi giới: nhập giá + chiết khấu + phương án vay
// -> xuất phiếu tính giá (cơ cấu vốn, trả góp, tiến độ) gửi khách.
// Thuộc cổng chung /realtor, đọc ?role= như các trang khác.
// =============================================================

export const metadata = {
  title: "Phiếu tính giá | Q-Broker",
};

export default function PhieuTinhGiaPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const { roleId, name } = resolveRole(searchParams.role);

  return (
    <div className="min-h-screen bg-slate-50">
      <RealtorHeader userName={name} roleId={roleId} />
      <PriceQuoteView agentName={name} />
      <RealtorFooter />
    </div>
  );
}
