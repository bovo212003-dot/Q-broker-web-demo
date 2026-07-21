import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import { MapSearchView } from "@/components/realtor/MapSearchView";
import { resolveRole } from "@/lib/role";

// =============================================================
// TRANG BẢN ĐỒ TÌM BĐS  (/realtor/ban-do)
// Bố cục kiểu Zillow: bản đồ Việt Nam cách điệu (pin giá) + danh sách
// đồng bộ hai chiều, kèm bộ lọc. Dữ liệu lấy từ LISTINGS (mock).
// =============================================================

export const metadata = {
  title: "Bản đồ tìm BĐS | Q-Broker",
};

export default function BanDoPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const { roleId, name } = resolveRole(searchParams.role);

  return (
    <div className="min-h-screen bg-slate-50">
      <RealtorHeader userName={name} roleId={roleId} />
      <MapSearchView />
      <RealtorFooter />

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
