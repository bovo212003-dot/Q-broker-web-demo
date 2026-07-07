import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import { ProfileView } from "@/components/realtor/ProfileView";
import { resolveRole } from "@/lib/role";
import { getProfile } from "@/data/profile";

// =============================================================
// TRANG CÁ NHÂN  (/realtor/profile)
// Danh thiếp số: ảnh bìa + avatar + tabs (Giới thiệu / Bài viết / Ảnh / Sản phẩm).
// Đọc ?role= -> hiện đúng hồ sơ của role đang đăng nhập (getProfile).
// =============================================================
export default function ProfilePage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const { roleId, name } = resolveRole(searchParams.role);
  const profile = getProfile(roleId);

  return (
    <div className="min-h-screen bg-slate-100">
      <RealtorHeader userName={name} roleId={roleId} />
      <ProfileView profile={profile} />
      <RealtorFooter />
    </div>
  );
}
