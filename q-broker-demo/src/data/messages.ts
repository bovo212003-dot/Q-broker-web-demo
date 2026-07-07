// =============================================================
// DỮ LIỆU TIN NHẮN (dropdown nút tin nhắn trên header) — mock, không backend.
// Hội thoại với khách hàng, môi giới khác, sàn, ngân hàng...
// =============================================================

export interface Conversation {
  id: string;
  name: string;
  color: string; // màu avatar
  last: string; // nội dung tin gần nhất
  time: string;
  unread: boolean;
  online?: boolean;
  fromMe?: boolean; // tin gần nhất do mình gửi
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    name: "Nguyễn Văn An",
    color: "#2563eb",
    last: "Anh cho em xem thêm căn Origami nhé?",
    time: "2 phút",
    unread: true,
    online: true,
  },
  {
    id: "c2",
    name: "Lê Thị Hồng",
    color: "#0d9488",
    last: "Ok mình chốt lịch xem nhà thứ 7 nha",
    time: "15 phút",
    unread: true,
  },
  {
    id: "c3",
    name: "Sàn Đất Vàng",
    color: "#7c3aed",
    last: "Đã cập nhật giá căn Vinhomes Central Park",
    time: "1 giờ",
    unread: false,
  },
  {
    id: "c4",
    name: "Phạm Thu Hà",
    color: "#db2777",
    last: "Cảm ơn anh nhiều 😊",
    time: "3 giờ",
    unread: false,
    fromMe: false,
  },
  {
    id: "c5",
    name: "OCB Bank",
    color: "#0f766e",
    last: "Bạn: Hồ sơ vay của khách đã đủ chưa ạ?",
    time: "Hôm qua",
    unread: false,
    fromMe: true,
  },
];
