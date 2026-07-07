// =============================================================
// DỮ LIỆU THÔNG BÁO (dropdown chuông trên header)  — mock, không backend.
// Nội dung gắn nghiệp vụ Q-Broker: hoa hồng, đấu giá, khách hàng, đào tạo...
// =============================================================

export type NotiTone = "green" | "blue" | "amber" | "violet" | "rose";

export interface AppNotification {
  id: string;
  icon: string; // lucide-react
  tone: NotiTone; // màu vòng icon
  title: string;
  text: string;
  time: string;
  unread: boolean;
}

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    icon: "Wallet",
    tone: "green",
    title: "Hoa hồng đã về ví",
    text: "+84.000.000 ₫ từ giao dịch Vinhomes Central Park 2PN.",
    time: "5 phút trước",
    unread: true,
  },
  {
    id: "n2",
    icon: "Gavel",
    tone: "rose",
    title: "Bạn bị trả giá cao hơn",
    text: "Phiên đấu giá #A12 — Biệt thự Thảo Điền. Trả giá lại ngay!",
    time: "22 phút trước",
    unread: true,
  },
  {
    id: "n3",
    icon: "UserPlus",
    tone: "blue",
    title: "Nhu cầu khách hàng mới",
    text: "Có khách cần mua căn hộ 2PN khu Quận 2, ngân sách 4–5 tỷ.",
    time: "1 giờ trước",
    unread: true,
  },
  {
    id: "n4",
    icon: "CheckCircle2",
    tone: "green",
    title: "Tin đăng đã được duyệt",
    text: "“Căn hộ The Origami 3PN” đã hiển thị trên giỏ hàng chung.",
    time: "3 giờ trước",
    unread: false,
  },
  {
    id: "n5",
    icon: "GraduationCap",
    tone: "violet",
    title: "Mở đăng ký kỳ sát hạch",
    text: "Sở Xây dựng TP.HCM mở đăng ký thi chứng chỉ tháng 8.",
    time: "Hôm qua",
    unread: false,
  },
  {
    id: "n6",
    icon: "Crown",
    tone: "amber",
    title: "Gói VIP sắp hết hạn",
    text: "Gói VIP Pro của bạn còn 5 ngày. Gia hạn để không gián đoạn.",
    time: "2 ngày trước",
    unread: false,
  },
];
