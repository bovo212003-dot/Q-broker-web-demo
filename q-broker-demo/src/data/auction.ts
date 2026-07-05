// =============================================================
// DỮ LIỆU TRANG CẦN THUÊ - MUA  (/realtor/can-thue-mua)
// -------------------------------------------------------------
// Mock cho luồng: Đăng nhu cầu -> Phiên đấu giá 30' -> Quẹt chọn
// môi giới (kiểu Tinder) -> AI ghép nối 1 môi giới phù hợp nhất.
// Sau này thay bằng API, giữ nguyên shape.
// =============================================================

export const img = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

// ---- Tuỳ chọn của form đăng nhu cầu -------------------------
export const TRANSACTION_TYPES = ["Mua", "Thuê"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const PROPERTY_TYPES = [
  "Căn hộ",
  "Nhà riêng",
  "Nhà phố",
  "Biệt thự",
  "Đất nền",
  "Văn phòng",
  "Mặt bằng",
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const AREAS = [
  "Quận 1, TP.HCM",
  "Quận 7, TP.HCM",
  "TP. Thủ Đức, TP.HCM",
  "Bình Thạnh, TP.HCM",
  "Cầu Giấy, Hà Nội",
  "Nam Từ Liêm, Hà Nội",
  "Hải Châu, Đà Nẵng",
] as const;

/** Khoảng ngân sách theo loại giao dịch */
export const BUDGETS: Record<TransactionType, string[]> = {
  Mua: ["Dưới 2 tỷ", "2 - 4 tỷ", "4 - 7 tỷ", "7 - 15 tỷ", "Trên 15 tỷ"],
  Thuê: ["Dưới 5 triệu/th", "5 - 10 triệu/th", "10 - 25 triệu/th", "25 - 50 triệu/th", "Trên 50 triệu/th"],
};

export const BEDROOM_OPTIONS = ["1", "2", "3", "4+"] as const;

export const CRITERIA_OPTIONS = [
  "Có sổ hồng",
  "Gần trường học",
  "Gần Metro",
  "Nội thất đầy đủ",
  "View sông",
  "Tầng cao",
  "Cho nuôi thú cưng",
  "Khu an ninh",
] as const;

/** Nhu cầu khách hàng nhập ở Bước 1 */
export interface DemandDraft {
  type: TransactionType;
  propertyType: PropertyType;
  area: string;
  budget: string;
  size?: string; // m² mong muốn
  bedrooms?: string;
  criteria: string[];
  note: string;
}

// ---- Môi giới tham gia phiên đấu giá ------------------------
export interface AuctionBroker {
  id: string;
  name: string;
  avatar: string;
  years: number; // năm kinh nghiệm
  area: string; // khu vực hoạt động chính
  specialty: PropertyType[]; // loại BĐS chuyên
  deals: number; // giao dịch đã hoàn thành
  reputation: number; // điểm uy tín 0-100
  trust: number; // điểm tín nhiệm 0-100
  responseRate: number; // % tỷ lệ phản hồi
  avgResponseMin: number; // phút phản hồi trung bình
  rating: number; // sao trung bình
  reviews: number; // số đánh giá
  tagline: string;
}

export const AUCTION_BROKERS: AuctionBroker[] = [
  {
    id: "b1",
    name: "Trần Minh Quân",
    avatar: img("photo-1560250097-0b93528c311a", 700),
    years: 8,
    area: "Quận 7, TP.HCM",
    specialty: ["Căn hộ", "Nhà phố"],
    deals: 86,
    reputation: 94,
    trust: 91,
    responseRate: 98,
    avgResponseMin: 5,
    rating: 4.9,
    reviews: 132,
    tagline: "Chuyên căn hộ khu Nam, cam kết phản hồi trong 15 phút.",
  },
  {
    id: "b2",
    name: "Lê Thị Hồng Nhung",
    avatar: img("photo-1573496359142-b8d87734a5a2", 700),
    years: 6,
    area: "TP. Thủ Đức, TP.HCM",
    specialty: ["Căn hộ", "Biệt thự"],
    deals: 64,
    reputation: 90,
    trust: 95,
    responseRate: 96,
    avgResponseMin: 8,
    rating: 4.8,
    reviews: 98,
    tagline: "Đồng hành từ xem nhà đến công chứng, minh bạch từng bước.",
  },
  {
    id: "b3",
    name: "Phạm Đức Long",
    avatar: img("photo-1507003211169-0a1dd7228f2d", 700),
    years: 10,
    area: "Quận 1, TP.HCM",
    specialty: ["Văn phòng", "Mặt bằng"],
    deals: 120,
    reputation: 88,
    trust: 84,
    responseRate: 90,
    avgResponseMin: 20,
    rating: 4.6,
    reviews: 156,
    tagline: "10 năm thương lượng mặt bằng trung tâm, giá tốt nhất khu vực.",
  },
  {
    id: "b4",
    name: "Nguyễn Thảo Vy",
    avatar: img("photo-1573497019940-1c28c88b4f3e", 700),
    years: 4,
    area: "Bình Thạnh, TP.HCM",
    specialty: ["Căn hộ"],
    deals: 41,
    reputation: 85,
    trust: 92,
    responseRate: 99,
    avgResponseMin: 3,
    rating: 4.9,
    reviews: 67,
    tagline: "Phản hồi nhanh nhất hệ thống, hỗ trợ cả ngoài giờ.",
  },
  {
    id: "b5",
    name: "Hoàng Văn Khang",
    avatar: img("photo-1472099645785-5658abf4ff4e", 700),
    years: 7,
    area: "Quận 7, TP.HCM",
    specialty: ["Nhà phố", "Đất nền"],
    deals: 73,
    reputation: 82,
    trust: 78,
    responseRate: 85,
    avgResponseMin: 35,
    rating: 4.4,
    reviews: 88,
    tagline: "Am hiểu pháp lý đất nền, thẩm định hồ sơ trước khi tư vấn.",
  },
  {
    id: "b6",
    name: "Đặng Thu Trang",
    avatar: img("photo-1580489944761-15a19d654956", 700),
    years: 5,
    area: "Cầu Giấy, Hà Nội",
    specialty: ["Căn hộ", "Văn phòng"],
    deals: 52,
    reputation: 87,
    trust: 89,
    responseRate: 94,
    avgResponseMin: 10,
    rating: 4.7,
    reviews: 74,
    tagline: "Tư vấn tài chính & gói vay kèm theo từng căn hộ.",
  },
  {
    id: "b7",
    name: "Vũ Quốc Bảo",
    avatar: img("photo-1633332755192-727a05c4013d", 700),
    years: 3,
    area: "TP. Thủ Đức, TP.HCM",
    specialty: ["Căn hộ", "Nhà riêng"],
    deals: 28,
    reputation: 76,
    trust: 82,
    responseRate: 92,
    avgResponseMin: 12,
    rating: 4.5,
    reviews: 39,
    tagline: "Thế hệ môi giới mới: tour 3D, báo cáo thị trường mỗi tuần.",
  },
  {
    id: "b8",
    name: "Bùi Mai Anh",
    avatar: img("photo-1544005313-94ddf0286df2", 700),
    years: 9,
    area: "Hải Châu, Đà Nẵng",
    specialty: ["Biệt thự", "Nhà phố"],
    deals: 95,
    reputation: 92,
    trust: 88,
    responseRate: 93,
    avgResponseMin: 15,
    rating: 4.8,
    reviews: 121,
    tagline: "Chuyên BĐS nghỉ dưỡng & biệt thự ven biển miền Trung.",
  },
];

/**
 * Matching Score (0-100) — mô phỏng cơ chế ghép nối thông minh trong
 * requirement: không "trả giá", chấm theo uy tín + tín nhiệm + phản hồi
 * + kinh nghiệm giao dịch + tốc độ phản hồi.
 */
export function matchScore(b: AuctionBroker): number {
  const dealsScore = Math.min(b.deals, 100);
  const speedScore = Math.max(0, 100 - b.avgResponseMin * 2);
  const s =
    b.reputation * 0.3 +
    b.trust * 0.25 +
    b.responseRate * 0.2 +
    dealsScore * 0.15 +
    speedScore * 0.1;
  return Math.round(s);
}

// ---- Tin nhu cầu đã đăng của tôi (mock) ---------------------
export type RequestStatus = "Đang đấu giá" | "Đã ghép nối" | "Hoàn thành";

export interface MyRequest {
  id: string;
  title: string;
  type: TransactionType;
  area: string;
  budget: string;
  status: RequestStatus;
  createdAt: string;
  brokerName?: string; // môi giới đã ghép (nếu có)
}

export const MY_REQUESTS: MyRequest[] = [
  {
    id: "r1",
    title: "Cần mua căn hộ 2PN cho gia đình trẻ",
    type: "Mua",
    area: "Quận 7, TP.HCM",
    budget: "2 - 4 tỷ",
    status: "Đã ghép nối",
    createdAt: "2026-07-02",
    brokerName: "Trần Minh Quân",
  },
  {
    id: "r2",
    title: "Tìm thuê văn phòng 80m² gần trung tâm",
    type: "Thuê",
    area: "Quận 1, TP.HCM",
    budget: "25 - 50 triệu/th",
    status: "Đang đấu giá",
    createdAt: "2026-07-05",
  },
  {
    id: "r3",
    title: "Mua đất nền khu dân cư có sổ",
    type: "Mua",
    area: "TP. Thủ Đức, TP.HCM",
    budget: "4 - 7 tỷ",
    status: "Hoàn thành",
    createdAt: "2026-06-18",
    brokerName: "Hoàng Văn Khang",
  },
];
