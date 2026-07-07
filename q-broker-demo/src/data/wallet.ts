// =============================================================
// DỮ LIỆU VÍ Q-BROKER  (/realtor/wallet)
// Mock theo phong cách ví điện tử VN (MoMo / ZaloPay / Viettel Money) nhưng
// gắn với nghiệp vụ BĐS: hoa hồng, đặt cọc đấu giá, gói VIP, học phí, affiliate.
// Không backend — toàn bộ là dữ liệu demo.
// =============================================================

export const WALLET = {
  balance: 12_450_000, // số dư khả dụng (₫)
  accountNo: "VÍ 0046 0004 8126",
  points: 18_250, // điểm thưởng tích luỹ
  pendingCommission: 84_000_000, // hoa hồng đang chờ về ví
};

export interface LinkedSource {
  id: string;
  name: string; // tên hiển thị
  kind: "bank" | "ewallet"; // ngân hàng hay ví điện tử
  number: string; // số đã che
  color: string; // màu thẻ
  icon: string; // lucide-react
}

export const LINKED_SOURCES: LinkedSource[] = [
  { id: "s1", name: "OCB — Ngân hàng Phương Đông", kind: "bank", number: "•••• 6001", color: "#0f766e", icon: "Landmark" },
  { id: "s2", name: "Vietcombank", kind: "bank", number: "•••• 2288", color: "#059669", icon: "Landmark" },
  { id: "s3", name: "Ví MoMo", kind: "ewallet", number: "•••• 4567", color: "#a50064", icon: "Wallet" },
];

export type TxType = "in" | "out";

export interface WalletTx {
  id: string;
  type: TxType;
  title: string;
  category: string; // nhãn nhóm
  icon: string; // lucide-react
  method: string; // nguồn/đích
  amount: number; // luôn dương; dấu quyết định bởi type
  date: string; // "12/06/2026 · 14:32"
  status: "Thành công" | "Đang xử lý" | "Thất bại";
}

export const WALLET_TX: WalletTx[] = [
  {
    id: "w1",
    type: "in",
    title: "Hoa hồng giao dịch",
    category: "Hoa hồng",
    icon: "Handshake",
    method: "Vinhomes Central Park 2PN",
    amount: 84_000_000,
    date: "20/06/2026 · 09:12",
    status: "Thành công",
  },
  {
    id: "w2",
    type: "out",
    title: "Rút tiền về Vietcombank",
    category: "Rút tiền",
    icon: "ArrowUpFromLine",
    method: "Vietcombank •••• 2288",
    amount: 30_000_000,
    date: "19/06/2026 · 16:40",
    status: "Thành công",
  },
  {
    id: "w3",
    type: "out",
    title: "Đặt cọc phiên đấu giá",
    category: "Đấu giá",
    icon: "Gavel",
    method: "Phiên #A12 · Biệt thự Thảo Điền",
    amount: 5_000_000,
    date: "18/06/2026 · 20:05",
    status: "Đang xử lý",
  },
  {
    id: "w4",
    type: "in",
    title: "Nạp ví từ ngân hàng",
    category: "Nạp tiền",
    icon: "ArrowDownToLine",
    method: "OCB •••• 6001",
    amount: 20_000_000,
    date: "17/06/2026 · 08:30",
    status: "Thành công",
  },
  {
    id: "w5",
    type: "out",
    title: "Gia hạn gói VIP Pro",
    category: "Gói dịch vụ",
    icon: "Crown",
    method: "12 tháng",
    amount: 1_990_000,
    date: "15/06/2026 · 11:20",
    status: "Thành công",
  },
  {
    id: "w6",
    type: "in",
    title: "Thưởng giới thiệu (Affiliate)",
    category: "Thưởng",
    icon: "Gift",
    method: "3 người dùng mới",
    amount: 1_500_000,
    date: "14/06/2026 · 19:02",
    status: "Thành công",
  },
  {
    id: "w7",
    type: "out",
    title: "Học phí khoá đàm phán & chốt deal",
    category: "Đào tạo",
    icon: "GraduationCap",
    method: "GRESA",
    amount: 3_200_000,
    date: "12/06/2026 · 10:15",
    status: "Thành công",
  },
  {
    id: "w8",
    type: "in",
    title: "Hoàn cọc đấu giá",
    category: "Đấu giá",
    icon: "Undo2",
    method: "Phiên #A09 (không trúng)",
    amount: 5_000_000,
    date: "10/06/2026 · 22:48",
    status: "Thành công",
  },
];
