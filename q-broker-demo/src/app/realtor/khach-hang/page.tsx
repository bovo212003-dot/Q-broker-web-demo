import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import { CrmView } from "@/components/realtor/CrmView";
import { resolveRole, withRole } from "@/lib/role";
import { RoleId } from "@/types";

// =============================================================
// TRANG KHÁCH HÀNG (CRM)  (/realtor/khach-hang)
// Màn quản lý khách của môi giới: KPI pipeline, việc cần làm hôm
// nay, bảng pipeline (kanban) / danh sách, hồ sơ chi tiết. Thuộc
// cổng chung /realtor, đọc ?role= như các trang khác.
// CHỈ dành cho role MÔI GIỚI (broker) — role khác hoặc chưa đăng
// nhập sẽ thấy màn thông báo giới hạn thay vì nội dung CRM.
// =============================================================

export const metadata = {
  title: "Khách hàng (CRM) | Q-Broker",
};

export default function KhachHangPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const { roleId, name } = resolveRole(searchParams.role);
  const isBroker = roleId === "broker";

  return (
    <div className="min-h-screen bg-slate-50">
      <RealtorHeader userName={name} roleId={roleId} />
      {isBroker ? <CrmView /> : <BrokerOnly roleId={roleId} />}
      <RealtorFooter />
    </div>
  );
}

/** Màn thông báo khi role khác broker cố vào trang CRM */
function BrokerOnly({ roleId }: { roleId?: RoleId }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-realtor-50 text-realtor-500">
        <Icon name="Lock" className="h-8 w-8" />
      </span>
      <h1 className="mt-5 text-xl font-bold text-realtor-ink">
        Trang chỉ dành cho môi giới
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Khách hàng (CRM) là công cụ quản lý khách của môi giới Q-Broker. Vui lòng
        đăng nhập bằng tài khoản môi giới để sử dụng.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={withRole("/realtor", roleId)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Icon name="ArrowLeft" className="h-4 w-4" />
          Về trang chủ
        </Link>
        <Link
          href="/realtor/khach-hang?role=broker"
          className="inline-flex items-center gap-2 rounded-full bg-realtor-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-realtor-600"
        >
          <Icon name="Handshake" className="h-4 w-4" />
          Xem với vai trò môi giới
        </Link>
      </div>
    </div>
  );
}
