import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import { WalletView } from "@/components/realtor/WalletView";
import { resolveRole } from "@/lib/role";

// =============================================================
// TRANG VÍ  (/realtor/wallet)
// Ví điện tử Q-Broker: số dư, thao tác nhanh, lịch sử giao dịch, nguồn liên
// kết, điểm thưởng. Thuộc cổng chung /realtor, đọc ?role= như các trang khác.
// =============================================================
export default function WalletPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const { roleId, name } = resolveRole(searchParams.role);

  return (
    <div className="min-h-screen bg-slate-50">
      <RealtorHeader userName={name} roleId={roleId} />
      <WalletView />
      <RealtorFooter />
    </div>
  );
}
