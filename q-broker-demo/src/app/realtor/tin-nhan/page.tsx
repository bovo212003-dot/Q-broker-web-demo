import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { MessagesView } from "@/components/realtor/MessagesView";
import { resolveRole } from "@/lib/role";
import { getFriendPerson, FRIEND_ROLE_META } from "@/data/friends";
import type { Conversation, ChatProduct } from "@/data/messages";
import { getBank, getBankRep } from "@/data/priceQuote";
import { LISTINGS, formatVnd } from "@/data/realtorListings";

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
  searchParams: {
    role?: string;
    c?: string;
    f?: string;
    bank?: string;
    rep?: string;
    product?: string;
  };
}) {
  const { roleId, name } = resolveRole(searchParams.role);

  // Tư vấn vay: nút "Tư vấn ngay" ở phiếu tính giá -> dựng hội thoại với
  // nhân viên sale của ngân hàng + ghim card căn nhà (kiểu Shopee).
  const bank = getBank(searchParams.bank);
  const rep = getBankRep(searchParams.bank, searchParams.rep);
  const listing = searchParams.product
    ? LISTINGS.find((l) => l.id === searchParams.product)
    : undefined;

  const product: ChatProduct | undefined = listing
    ? {
        title: listing.address,
        subtitle: listing.city,
        price: formatVnd(listing.price),
        image: listing.image,
      }
    : undefined;

  // Nhắn tin từ mạng kết bạn: dựng một hội thoại tạm từ hồ sơ người đó.
  const friend = searchParams.f ? getFriendPerson(searchParams.f) : undefined;

  // Ưu tiên hội thoại tư vấn vay (bank+rep); nếu không thì hội thoại kết bạn.
  const extraConv: Conversation | undefined =
    bank && rep
      ? {
          id: rep.id,
          name: rep.name,
          color: bank.color,
          last: "",
          time: "",
          unread: false,
          online: true,
          role: `${rep.title} • ${bank.name}`,
        }
      : friend
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

  // Card sản phẩm chỉ áp cho hội thoại tư vấn vay vừa mở.
  const productConvId = bank && rep ? rep.id : undefined;

  return (
    <div className="min-h-screen bg-slate-50">
      <RealtorHeader userName={name} roleId={roleId} />
      <MessagesView
        initialId={extraConv?.id ?? searchParams.c}
        extraConv={extraConv}
        product={productConvId ? product : undefined}
        productConvId={productConvId}
      />
    </div>
  );
}
