import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import { RecruitmentView } from "@/components/recruitment/RecruitmentView";
import { resolveRole } from "@/lib/role";

// =============================================================
// TRANG TUYỂN DỤNG  (/realtor/tuyen-dung)
// Kết nối nhân sự BĐS 2 phía: Nhà tuyển dụng (sàn/chủ đầu tư) đăng tin,
// quản lý ứng viên; Môi giới ứng tuyển bằng CV trực tuyến (Tier/điểm/chứng chỉ).
// =============================================================
export default function TuyenDungPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const { roleId, name } = resolveRole(searchParams.role);

  return (
    <div className="min-h-screen bg-slate-50">
      <RealtorHeader userName={name} roleId={roleId} />
      <RecruitmentView roleId={roleId} roleName={name} />
      <RealtorFooter />
    </div>
  );
}
