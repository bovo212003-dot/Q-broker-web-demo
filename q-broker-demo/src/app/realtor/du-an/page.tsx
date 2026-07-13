import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import { ProjectsView } from "@/components/realtor/ProjectsView";
import { resolveRole } from "@/lib/role";

// =============================================================
// TRANG DỰ ÁN  (/realtor/du-an)
// Danh sách dự án + bộ lọc. Mỗi dự án dẫn tới /realtor/du-an/[id]
// hiển thị giỏ hàng căn (bảng điện) + tổng quan/tiện ích/chính sách.
// =============================================================

export const metadata = {
  title: "Dự án | Q-Broker",
};

export default function DuAnPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const { roleId, name } = resolveRole(searchParams.role);

  return (
    <div className="min-h-screen bg-slate-50">
      <RealtorHeader userName={name} roleId={roleId} />
      <ProjectsView roleId={roleId} />
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
