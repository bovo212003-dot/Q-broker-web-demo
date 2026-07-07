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

// ---- Tin nhu cầu đã đăng của tôi ----------------------------
// "Chờ kết nối": tin đang treo trên bảng tin chờ — môi giới chủ động
// đăng ký tham gia, KHÔNG giới hạn thời gian. Tin chỉ kết thúc khi
// khách bắt đầu chọn môi giới hoặc tự đóng tin.
export type RequestStatus =
  | "Chờ kết nối"
  | "Đã ghép nối"
  | "Hoàn thành"
  | "Đã đóng";

export interface MyRequest {
  id: string;
  title: string;
  type: TransactionType;
  area: string;
  budget: string;
  status: RequestStatus;
  createdAt: string;
  brokerName?: string; // môi giới đã ghép (nếu có)
  joined?: number; // số môi giới đã đăng ký tham gia tin
  draft?: DemandDraft; // nhu cầu gốc — để mở lại trang chờ
}

/** Tin do khách tự đăng trong phiên demo — lưu localStorage để tin
 *  "Chờ kết nối" vẫn treo khi rời trang / tải lại. */
export type StoredRequest = MyRequest & { draft: DemandDraft; joined: number };

const STORAGE_KEY = "qb-my-requests";

export function loadMyRequests(): StoredRequest[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveMyRequests(list: StoredRequest[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
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
    status: "Chờ kết nối",
    createdAt: "2026-07-05",
    joined: 3,
    draft: {
      type: "Thuê",
      propertyType: "Văn phòng",
      area: "Quận 1, TP.HCM",
      budget: "25 - 50 triệu/th",
      size: "80",
      criteria: ["Gần Metro"],
      note: "",
    },
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

// =============================================================
// PHÍA MÔI GIỚI — BẢNG TIN NHU CẦU KHÁCH HÀNG
// Môi giới xem nhiều tin đang mở cùng lúc, lọc theo khu vực đảm nhiệm,
// "Nhận tư vấn" để xếp hàng đợi khách matching rồi mới trao đổi.
// =============================================================

// Ảnh minh hoạ tin đăng theo loại BĐS (đính kèm trong chat & thẻ tin).
export const PROPERTY_THUMB: Record<PropertyType, string> = {
  "Căn hộ": "photo-1522708323590-d24dbb6b0267",
  "Nhà riêng": "photo-1568605114967-8130f3a36994",
  "Nhà phố": "photo-1512917774080-9991f1c4c750",
  "Biệt thự": "photo-1613490493576-7fde63acd811",
  "Đất nền": "photo-1500382017468-9049fed747ef",
  "Văn phòng": "photo-1497366216548-37526070297c",
  "Mặt bằng": "photo-1497366811353-6870744d04b2",
};

export const propertyThumb = (t: PropertyType, w = 200) =>
  img(PROPERTY_THUMB[t] ?? PROPERTY_THUMB["Căn hộ"], w);

/** Hồ sơ môi giới đang đăng nhập (mock) — để lọc tin theo khu vực đảm nhiệm. */
export const BROKER_ME = {
  name: "Trần Minh Quân",
  avatar: img("photo-1560250097-0b93528c311a", 200),
  areas: ["Quận 7, TP.HCM", "Bình Thạnh, TP.HCM"] as string[],
  specialties: ["Căn hộ", "Nhà phố"] as PropertyType[],
};

export type DemandStatus = "Đang mở" | "Đã đóng";

/** Tin nhu cầu công khai của khách — hiển thị trên bảng tin phía môi giới. */
export interface OpenDemand {
  id: string;
  customer: string; // tên khách (rút gọn)
  avatar: string;
  type: TransactionType;
  propertyType: PropertyType;
  area: string;
  budget: string;
  size?: string;
  bedrooms?: string;
  criteria: string[];
  note: string;
  createdAt: string;
  status: DemandStatus;
  registered: number; // số môi giới đã nhận tư vấn (đang xếp hàng)
}

export const OPEN_DEMANDS: OpenDemand[] = [
  {
    id: "d1", customer: "Chị Ngọc A.", avatar: img("photo-1544005313-94ddf0286df2", 200),
    type: "Mua", propertyType: "Căn hộ", area: "Quận 7, TP.HCM", budget: "2 - 4 tỷ",
    size: "70", bedrooms: "2", criteria: ["Có sổ hồng", "Nội thất đầy đủ", "Gần trường học"],
    note: "Gia đình trẻ có 1 bé, ưu tiên khu dân cư an ninh, gần trường tiểu học quốc tế.",
    createdAt: "2026-07-06", status: "Đang mở", registered: 4,
  },
  {
    id: "d2", customer: "Anh Hải P.", avatar: img("photo-1507003211169-0a1dd7228f2d", 200),
    type: "Thuê", propertyType: "Căn hộ", area: "Quận 7, TP.HCM", budget: "10 - 25 triệu/th",
    size: "55", bedrooms: "2", criteria: ["Nội thất đầy đủ", "Tầng cao", "Cho nuôi thú cưng"],
    note: "Cần dọn vào trong tháng, ưu tiên căn view đẹp, có chỗ để xe hơi.",
    createdAt: "2026-07-06", status: "Đang mở", registered: 2,
  },
  {
    id: "d3", customer: "Chị Mai T.", avatar: img("photo-1573496359142-b8d87734a5a2", 200),
    type: "Mua", propertyType: "Nhà phố", area: "Bình Thạnh, TP.HCM", budget: "7 - 15 tỷ",
    size: "90", bedrooms: "4+", criteria: ["Có sổ hồng", "Khu an ninh"],
    note: "Mua để ở lâu dài, cần nhà hẻm xe hơi, pháp lý rõ ràng.",
    createdAt: "2026-07-05", status: "Đang mở", registered: 6,
  },
  {
    id: "d4", customer: "Anh Long V.", avatar: img("photo-1633332755192-727a05c4013d", 200),
    type: "Thuê", propertyType: "Văn phòng", area: "Quận 1, TP.HCM", budget: "25 - 50 triệu/th",
    size: "120", criteria: ["Gần Metro"],
    note: "Startup ~20 nhân sự, cần văn phòng hạng B trở lên, chỗ đậu xe máy rộng.",
    createdAt: "2026-07-05", status: "Đang mở", registered: 3,
  },
  {
    id: "d5", customer: "Chị Hương L.", avatar: img("photo-1580489944761-15a19d654956", 200),
    type: "Mua", propertyType: "Đất nền", area: "TP. Thủ Đức, TP.HCM", budget: "4 - 7 tỷ",
    size: "100", criteria: ["Có sổ hồng"],
    note: "Đầu tư trung hạn, ưu tiên khu quy hoạch rõ ràng, gần trục đường lớn.",
    createdAt: "2026-07-04", status: "Đang mở", registered: 5,
  },
  {
    id: "d6", customer: "Anh Khoa N.", avatar: img("photo-1472099645785-5658abf4ff4e", 200),
    type: "Mua", propertyType: "Nhà riêng", area: "Quận 7, TP.HCM", budget: "4 - 7 tỷ",
    size: "80", bedrooms: "3", criteria: ["Có sổ hồng", "Khu an ninh"],
    note: "Cần nhà 1 trệt 2 lầu, hẻm ô tô, gần chợ và trường.",
    createdAt: "2026-07-04", status: "Đang mở", registered: 1,
  },
  {
    id: "d7", customer: "Chị Vân K.", avatar: img("photo-1573497019940-1c28c88b4f3e", 200),
    type: "Mua", propertyType: "Căn hộ", area: "Cầu Giấy, Hà Nội", budget: "2 - 4 tỷ",
    size: "65", bedrooms: "2", criteria: ["Gần Metro", "Nội thất đầy đủ"],
    note: "Vợ chồng trẻ mua căn đầu tiên, ưu tiên dự án bàn giao ngay.",
    createdAt: "2026-07-03", status: "Đang mở", registered: 3,
  },
  {
    id: "d8", customer: "Anh Tuấn D.", avatar: img("photo-1552374196-c4e7ffc6e126", 200),
    type: "Mua", propertyType: "Biệt thự", area: "Hải Châu, Đà Nẵng", budget: "7 - 15 tỷ",
    size: "200", bedrooms: "4+", criteria: ["View sông", "Khu an ninh"],
    note: "Second home nghỉ dưỡng, ưu tiên biệt thự ven sông/biển.",
    createdAt: "2026-07-02", status: "Đang mở", registered: 2,
  },
  {
    id: "d9", customer: "Chị Thu H.", avatar: img("photo-1544005313-94ddf0286df2", 200),
    type: "Thuê", propertyType: "Nhà phố", area: "Quận 7, TP.HCM", budget: "25 - 50 triệu/th",
    size: "100", bedrooms: "4+", criteria: ["Nội thất đầy đủ"],
    note: "Thuê làm homestay, cần nhà nguyên căn mặt tiền, đã hoàn tất thuê.",
    createdAt: "2026-06-28", status: "Đã đóng", registered: 8,
  },
];
