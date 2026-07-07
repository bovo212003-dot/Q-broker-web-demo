import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { MessagesView } from "@/components/realtor/MessagesView";
import { resolveRole } from "@/lib/role";
import { getFriendPerson, FRIEND_ROLE_META } from "@/data/friends";
import type { Conversation } from "@/data/messages";

// =============================================================
// TRANG TIN NHẮN  (/realtor/tin-nhan)
// Chat đầy đủ kiểu Messenger/Zalo: danh sách hội thoại + khung trò
// chuyện. Thuộc cổng chung /realtor, đọc ?role= như các trang khác.
//   ?c=<id> -> mở sẵn một hội thoại có sẵn (bấm từ dropdown header).
//   ?f=<id> -> nhắn tin cho một người trong mạng kết bạn (nút "Nhắn tin"
//              ở thẻ/trang cá nhân). Hội thoại được dựng từ dữ liệu bạn bè.
// Không có footer để khung chat chiếm trọn chiều cao màn hình.
// =============================================================

export const metadata = {
  title: "Tin nhắn | Q-Broker",
};

export default function TinNhanPage({
  searchParams,
}: {
  searchParams: { role?: string; c?: string; f?: string };
}) {
  const { roleId, name } = resolveRole(searchParams.role);

  // Nhắn tin từ mạng kết bạn: dựng một hội thoại tạm từ hồ sơ người đó.
  const friend = searchParams.f ? getFriendPerson(searchParams.f) : undefined;
  const extraConv: Conversation | undefined = friend
    ? {
        id: friend.id,
        name: friend.name,
        color: friend.avatarColor,
        last: "",
        time: "",
        unread: false,
        online: friend.online,
        role: FRIEND_ROLE_META[friend.role].label,
      }
    : undefined;

  return (
    <div className="min-h-screen bg-slate-50">
      <RealtorHeader userName={name} roleId={roleId} />
      <MessagesView initialId={extraConv?.id ?? searchParams.c} extraConv={extraConv} />
    </div>
  );
}
