import Link from "next/link";
import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import { FriendProfileView } from "@/components/realtor/FriendProfileView";
import { Icon } from "@/components/ui/Icon";
import { resolveRole, withRole } from "@/lib/role";
import { canFriend, getFriendPerson } from "@/data/friends";
import { RoleId } from "@/types";

// =============================================================
// TRANG CÁ NHÂN BẠN BÈ  (/realtor/ket-ban/[id])
// Xem hồ sơ của một người trong mạng kết bạn. Áp LUẬT KẾT BẠN: nếu
// role hiện tại không được phép kết nối với nhóm của người này (VD
// môi giới mở hồ sơ khách hàng), hiển thị màn giới hạn thay vì hồ sơ.
// =============================================================

export const metadata = {
  title: "Trang cá nhân | Q-Broker",
};

export default function FriendProfilePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { role?: string };
}) {
  const { roleId, name } = resolveRole(searchParams.role);
  const person = getFriendPerson(params.id);

  // Không tìm thấy người, hoặc role không được phép xem nhóm này.
  const allowed = person ? canFriend(roleId, person.role) : false;

  return (
    <div className="min-h-screen bg-slate-50">
      <RealtorHeader userName={name} roleId={roleId} />
      {person && allowed ? (
        <FriendProfileView person={person} roleId={roleId} />
      ) : (
        <NotAllowed roleId={roleId} found={!!person} />
      )}
      <RealtorFooter />
    </div>
  );
}

/** Màn thông báo khi không tìm thấy hoặc không được phép xem hồ sơ. */
function NotAllowed({ roleId, found }: { roleId?: RoleId; found: boolean }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-realtor-50 text-realtor-500">
        <Icon name={found ? "Lock" : "UserX"} className="h-8 w-8" />
      </span>
      <h1 className="mt-5 text-xl font-bold text-realtor-ink">
        {found ? "Không thể xem hồ sơ này" : "Không tìm thấy người dùng"}
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        {found
          ? "Hồ sơ này thuộc nhóm bạn không được phép kết nối theo quy tắc kết bạn của Q-Broker."
          : "Người dùng bạn tìm không tồn tại hoặc đã rời khỏi hệ thống."}
      </p>
      <Link
        href={withRole("/realtor/ket-ban", roleId)}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-realtor-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-realtor-600"
      >
        <Icon name="ArrowLeft" className="h-4 w-4" />
        Về trang Kết bạn
      </Link>
    </div>
  );
}
