// =============================================================
// DỮ LIỆU TIN NHẮN — mock, không backend.
// Dùng chung cho: dropdown nút tin nhắn trên header + trang tin nhắn
// đầy đủ (/realtor/tin-nhan). Hội thoại với khách hàng, môi giới khác,
// sàn, ngân hàng... Mỗi hội thoại kèm một luồng tin nhắn chi tiết
// (THREADS) để trang chat render được nội dung trò chuyện.
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
  role?: string; // vai trò/mô tả ngắn (khách hàng, môi giới, sàn, ngân hàng)
}

/** Card sản phẩm (căn nhà) ghim đầu hội thoại — kiểu Shopee. */
export interface ChatProduct {
  title: string; // tên/địa chỉ căn
  subtitle: string; // khu vực / mô tả ngắn
  price: string; // giá đã định dạng
  image: string; // ảnh đại diện
  href?: string; // link xem chi tiết (tuỳ chọn)
}

/** Loại tin nhắn kiểu Messenger: chữ (mặc định), ảnh, tin thoại, thả tim/like. */
export type MessageKind = "text" | "image" | "voice" | "like";

/** Một tin nhắn trong luồng hội thoại. */
export interface ChatMessage {
  id: string;
  fromMe: boolean; // true -> tin do mình gửi (căn phải)
  text: string;
  time: string; // giờ hiển thị, VD "10:24"
  kind?: MessageKind; // thiếu -> "text"
  image?: string; // data URL ảnh (khi kind = "image")
  duration?: number; // độ dài tin thoại tính bằng giây (khi kind = "voice")
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
    role: "Khách hàng",
  },
  {
    id: "c2",
    name: "Lê Thị Hồng",
    color: "#0d9488",
    last: "Ok mình chốt lịch xem nhà thứ 7 nha",
    time: "15 phút",
    unread: true,
    role: "Khách hàng",
  },
  {
    id: "c3",
    name: "Sàn Đất Vàng",
    color: "#7c3aed",
    last: "Đã cập nhật giá căn Vinhomes Central Park",
    time: "1 giờ",
    unread: false,
    role: "Sàn giao dịch",
  },
  {
    id: "c4",
    name: "Phạm Thu Hà",
    color: "#db2777",
    last: "Cảm ơn anh nhiều 😊",
    time: "3 giờ",
    unread: false,
    fromMe: false,
    role: "Khách hàng",
  },
  {
    id: "c5",
    name: "OCB Bank",
    color: "#0f766e",
    last: "Bạn: Hồ sơ vay của khách đã đủ chưa ạ?",
    time: "Hôm qua",
    unread: false,
    fromMe: true,
    role: "Ngân hàng",
  },
];

// -------------------------------------------------------------
// LUỒNG TIN NHẮN CHI TIẾT theo từng hội thoại (id -> danh sách tin).
// Sắp xếp từ cũ -> mới. Dùng cho trang chat /realtor/tin-nhan.
// -------------------------------------------------------------

export const THREADS: Record<string, ChatMessage[]> = {
  c1: [
    { id: "c1-1", fromMe: false, text: "Chào anh, em thấy tin căn hộ Vinhomes Grand Park mình đăng ạ.", time: "09:12" },
    { id: "c1-2", fromMe: true, text: "Chào An, đúng rồi em. Em đang quan tâm phân khu nào vậy?", time: "09:14" },
    { id: "c1-3", fromMe: false, text: "Dạ em thích toà Origami, 2 phòng ngủ view sông ạ.", time: "09:15" },
    { id: "c1-4", fromMe: true, text: "Bên anh còn vài căn đẹp giá tốt. Anh gửi em bảng hàng nhé.", time: "09:16" },
    { id: "c1-5", fromMe: false, text: "Vâng anh gửi giúp em. Ngân sách em khoảng 3,2 tỷ ạ.", time: "09:18" },
    { id: "c1-6", fromMe: false, text: "Anh cho em xem thêm căn Origami nhé?", time: "09:20" },
  ],
  c2: [
    { id: "c2-1", fromMe: true, text: "Chào chị Hồng, căn nhà phố Gò Vấp mình hẹn xem cuối tuần này chị nhé.", time: "Hôm qua" },
    { id: "c2-2", fromMe: false, text: "Ừ em, chị rảnh sáng thứ 7. Mấy giờ tiện em?", time: "Hôm qua" },
    { id: "c2-3", fromMe: true, text: "Dạ 9h sáng thứ 7 em đón chị tại dự án ạ.", time: "08:30" },
    { id: "c2-4", fromMe: false, text: "Ok mình chốt lịch xem nhà thứ 7 nha", time: "08:45" },
  ],
  c3: [
    { id: "c3-1", fromMe: false, text: "Chào anh, sàn vừa cập nhật giỏ hàng mới tháng này.", time: "Thứ 2" },
    { id: "c3-2", fromMe: true, text: "Cảm ơn sàn. Cho mình xin bảng giá Vinhomes Central Park với.", time: "Thứ 2" },
    { id: "c3-3", fromMe: false, text: "Đã cập nhật giá căn Vinhomes Central Park", time: "10:05" },
  ],
  c4: [
    { id: "c4-1", fromMe: true, text: "Chào chị Hà, hồ sơ sang tên của mình đã hoàn tất rồi ạ.", time: "Thứ 3" },
    { id: "c4-2", fromMe: false, text: "Ôi tốt quá, cảm ơn em đã hỗ trợ nhiệt tình.", time: "Thứ 3" },
    { id: "c4-3", fromMe: false, text: "Cảm ơn anh nhiều 😊", time: "Thứ 3" },
  ],
  c5: [
    { id: "c5-1", fromMe: false, text: "Chào anh, bên em là OCB hỗ trợ khoản vay khách anh giới thiệu.", time: "Hôm qua" },
    { id: "c5-2", fromMe: true, text: "Chào em, khách của anh cần vay 70% giá trị căn hộ.", time: "Hôm qua" },
    { id: "c5-3", fromMe: false, text: "Dạ được ạ, anh chuẩn bị giúp sao kê lương và hợp đồng lao động nhé.", time: "Hôm qua" },
    { id: "c5-4", fromMe: true, text: "Hồ sơ vay của khách đã đủ chưa ạ?", time: "Hôm qua" },
  ],
};

/** Tra cứu nhanh 1 hội thoại theo id. */
export function getConversation(id: string): Conversation | undefined {
  return CONVERSATIONS.find((c) => c.id === id);
}

/** Lấy luồng tin nhắn của một hội thoại (rỗng nếu chưa có). */
export function getThread(id: string): ChatMessage[] {
  return THREADS[id] ?? [];
}

// -------------------------------------------------------------
// FAKE AUTO-REPLY — câu trả lời tự động (demo, không backend).
// Sau khi mình gửi tin, đối phương "trả lời" bằng một câu ngẫu nhiên.
// -------------------------------------------------------------

export const AUTO_REPLIES: string[] = [
  "Dạ em nhận được rồi ạ, để em xem qua nhé 👍",
  "Vâng anh/chị, em phản hồi sớm nhất có thể ạ.",
  "Ok mình trao đổi thêm nha 😊",
  "Anh/chị cho em xin thêm chút thông tin với ạ.",
  "Được ạ, em sắp xếp rồi báo lại mình liền.",
  "Cảm ơn anh/chị đã nhắn, em ghi nhận thông tin rồi ạ.",
  "Dạ vâng, cái này em tư vấn kỹ hơn khi mình gặp trực tiếp nhé.",
];

/** Lấy một câu trả lời tự động ngẫu nhiên. */
export function randomReply(): string {
  return AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
}
