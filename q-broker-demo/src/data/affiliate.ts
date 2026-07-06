// =============================================================
// DỮ LIỆU MẪU cho trang AFFILIATE (/realtor/affiliate)
// Cơ chế mô phỏng theo các chương trình affiliate BĐS thế giới:
// - Zillow Affiliate: link giới thiệu + cookie + % hoa hồng cố định
// - Zillow Flex / Realtor.com ReadyConnect: "pay-at-closing" — chỉ
//   trả phí giới thiệu khi giao dịch CHỐT thành công (25–35%)
// - Agent-to-agent referral: chuẩn ngành 25% hoa hồng gộp
// - Carrot / Showcase IDX: hoa hồng recurring cho gói subscription
// =============================================================

/** Một bước trong quy trình "Cách hoạt động" */
export interface AffiliateStep {
  icon: string; // tên icon lucide-react
  title: string;
  desc: string;
}

/** Hạng đối tác (tier) — quyết định tỷ lệ hoa hồng */
export interface AffiliateTier {
  id: string;
  name: string;
  condition: string; // điều kiện đạt hạng (số giao dịch/quý)
  dealRate: number; // % phí môi giới nhận được khi giao dịch chốt
  recurringRate: number; // % recurring gói hội viên
  perks: string[]; // quyền lợi kèm theo
  featured?: boolean; // hạng nổi bật (highlight ở giữa)
}

/** Hoa hồng theo từng loại sản phẩm/dịch vụ */
export interface CommissionProduct {
  icon: string;
  product: string;
  fee: string; // phí nền tảng thu
  commission: string; // phần affiliate nhận
  example: string; // ví dụ tính tiền cụ thể
  payType: "closing" | "recurring" | "flat";
}

/** Câu hỏi thường gặp */
export interface AffiliateFaq {
  q: string;
  a: string;
}

/** Một dòng trong bảng lịch sử giới thiệu (dashboard demo) */
export interface ReferralRow {
  id: string;
  customer: string; // tên đã che
  product: string;
  date: string;
  value: string; // giá trị giao dịch / gói
  commission: string; // hoa hồng dự kiến/đã nhận
  status: "closed" | "pending" | "consulting";
}

export const AFFILIATE_STEPS: AffiliateStep[] = [
  {
    icon: "UserPlus",
    title: "1. Đăng ký miễn phí",
    desc: "Tạo tài khoản đối tác trong 2 phút, nhận ngay link giới thiệu và mã QR gắn thương hiệu riêng của bạn.",
  },
  {
    icon: "Share2",
    title: "2. Chia sẻ link",
    desc: "Gắn link vào bài viết, video, Zalo, Facebook... Cookie ghi nhận 30 ngày — khách quay lại sau vẫn tính cho bạn.",
  },
  {
    icon: "Handshake",
    title: "3. Khách giao dịch",
    desc: "Khách đăng ký xem nhà, tham gia đấu giá hoặc mua gói hội viên qua link. Hệ thống theo dõi realtime từng bước.",
  },
  {
    icon: "Wallet",
    title: "4. Nhận hoa hồng",
    desc: "Giao dịch chốt thành công là tiền về ví — thanh toán ngày 15 hàng tháng, không giới hạn thu nhập.",
  },
];

export const AFFILIATE_TIERS: AffiliateTier[] = [
  {
    id: "dong",
    name: "Đối tác Đồng",
    condition: "0 – 2 giao dịch chốt / quý",
    dealRate: 20,
    recurringRate: 15,
    perks: [
      "Link + mã QR giới thiệu riêng",
      "Dashboard theo dõi realtime",
      "Kho banner, nội dung mẫu",
      "Cookie ghi nhận 30 ngày",
    ],
  },
  {
    id: "bac",
    name: "Đối tác Bạc",
    condition: "3 – 9 giao dịch chốt / quý",
    dealRate: 25,
    recurringRate: 20,
    featured: true,
    perks: [
      "Toàn bộ quyền lợi hạng Đồng",
      "Landing page riêng theo tên bạn",
      "Ưu tiên phân bổ khách khu vực",
      "Hỗ trợ tư vấn viên chốt hộ",
    ],
  },
  {
    id: "vang",
    name: "Đối tác Vàng",
    condition: "Từ 10 giao dịch chốt / quý",
    dealRate: 30,
    recurringRate: 25,
    perks: [
      "Toàn bộ quyền lợi hạng Bạc",
      "Thưởng quý tới 50.000.000 đ",
      "Quản lý đối tác riêng (1-1)",
      "Mời tham dự sự kiện VIP Q-Broker",
    ],
  },
];

export const COMMISSION_PRODUCTS: CommissionProduct[] = [
  {
    icon: "Home",
    product: "Giao dịch mua bán nhà đất",
    fee: "Phí môi giới 2% giá trị",
    commission: "20 – 30% phí môi giới",
    example: "Căn 4 tỷ → phí 80 triệu → bạn nhận 16 – 24 triệu",
    payType: "closing",
  },
  {
    icon: "KeyRound",
    product: "Giao dịch cho thuê",
    fee: "Phí 1 tháng tiền thuê",
    commission: "20 – 30% phí môi giới",
    example: "Thuê 25 triệu/tháng → bạn nhận 5 – 7,5 triệu",
    payType: "closing",
  },
  {
    icon: "Gavel",
    product: "Đấu giá trực tuyến",
    fee: "Phí dịch vụ theo lô",
    commission: "5.000.000 đ / lô chốt",
    example: "Khách trúng đấu giá qua link → nhận cố định 5 triệu",
    payType: "flat",
  },
  {
    icon: "BadgeCheck",
    product: "Gói hội viên Pro Broker",
    fee: "499.000 đ / tháng",
    commission: "15 – 25% mỗi tháng, trong 12 tháng",
    example: "10 môi giới đăng ký → tới 1,25 triệu đều đặn hàng tháng",
    payType: "recurring",
  },
];

export const AFFILIATE_FAQS: AffiliateFaq[] = [
  {
    q: "Ai có thể tham gia chương trình affiliate?",
    a: "Bất kỳ ai: môi giới, KOL/KOC, chủ kênh nội dung nhà đất, hay người có mạng lưới quan hệ rộng. Không yêu cầu chứng chỉ, không phí tham gia.",
  },
  {
    q: "Cookie 30 ngày nghĩa là gì?",
    a: "Khi khách bấm link của bạn, hệ thống ghi nhớ 30 ngày. Trong thời gian đó khách quay lại và giao dịch (kể cả không qua link) thì hoa hồng vẫn tính cho bạn — dài hơn chuẩn 7 ngày của các nền tảng quốc tế.",
  },
  {
    q: "Khi nào tôi được thanh toán?",
    a: "Hoa hồng được đối soát khi giao dịch chốt thành công (mô hình pay-at-closing như Zillow Flex) và chuyển về ví Q-Broker của bạn vào ngày 15 hàng tháng. Rút về ngân hàng bất kỳ lúc nào, tối thiểu 500.000 đ.",
  },
  {
    q: "Tôi theo dõi khách giới thiệu ở đâu?",
    a: "Dashboard đối tác hiển thị realtime: lượt bấm link, khách để lại thông tin, trạng thái tư vấn của từng khách và hoa hồng dự kiến — minh bạch từng bước, không lo mất khách.",
  },
  {
    q: "Giới thiệu khách nhưng người khác chốt thì sao?",
    a: "Hoa hồng tính theo NGUỒN khách. Khách đến từ link của bạn thì dù môi giới nào của Q-Broker chốt, bạn vẫn nhận đủ tỷ lệ theo hạng — giống cơ chế referral fee chuẩn ngành 25%.",
  },
];

// ---- Dashboard demo (số liệu mẫu của một đối tác hạng Bạc) ----

export const DEMO_LINK = "https://q-broker.vn/ref/QB-8823-MINH";

export const DEMO_STATS = [
  { icon: "MousePointerClick", label: "Lượt bấm link", value: "1.284", note: "30 ngày qua" },
  { icon: "Users", label: "Khách để lại thông tin", value: "96", note: "tỷ lệ 7,5%" },
  { icon: "Handshake", label: "Giao dịch chốt", value: "12", note: "5 đang tư vấn" },
  { icon: "Wallet", label: "Hoa hồng tích luỹ", value: "186.500.000 đ", note: "+38,2 triệu tháng này" },
];

export const DEMO_REFERRALS: ReferralRow[] = [
  {
    id: "r1",
    customer: "Nguyễn T. H***",
    product: "Mua căn hộ Vinhomes Central Park",
    date: "02/07/2026",
    value: "4,2 tỷ",
    commission: "21.000.000 đ",
    status: "closed",
  },
  {
    id: "r2",
    customer: "Trần M. K***",
    product: "Gói hội viên Pro Broker (12 tháng)",
    date: "28/06/2026",
    value: "499k/tháng",
    commission: "99.800 đ/tháng",
    status: "closed",
  },
  {
    id: "r3",
    customer: "Lê V. P***",
    product: "Đấu giá biệt thự Ecopark Aqua Bay",
    date: "25/06/2026",
    value: "7,8 tỷ",
    commission: "5.000.000 đ",
    status: "pending",
  },
  {
    id: "r4",
    customer: "Phạm Q. D***",
    product: "Thuê nhà phố Thảo Điền",
    date: "21/06/2026",
    value: "38 triệu/tháng",
    commission: "9.500.000 đ",
    status: "consulting",
  },
  {
    id: "r5",
    customer: "Võ N. A***",
    product: "Mua nhà phố The Sailing Tower",
    date: "17/06/2026",
    value: "6,4 tỷ",
    commission: "32.000.000 đ",
    status: "consulting",
  },
];

/** Nhãn + tông màu cho trạng thái dòng giới thiệu */
export const REFERRAL_STATUS: Record<
  ReferralRow["status"],
  { label: string; className: string }
> = {
  closed: { label: "Đã chốt — đã trả", className: "bg-emerald-50 text-emerald-600" },
  pending: { label: "Chờ đối soát", className: "bg-amber-50 text-amber-600" },
  consulting: { label: "Đang tư vấn", className: "bg-sky-50 text-sky-600" },
};

/** Hoa hồng 6 tháng gần nhất (triệu đồng) — tổng khớp 186,5 triệu tích luỹ */
export const DEMO_EARNINGS: { month: string; value: number }[] = [
  { month: "T2", value: 18.5 },
  { month: "T3", value: 22.0 },
  { month: "T4", value: 29.3 },
  { month: "T5", value: 33.5 },
  { month: "T6", value: 45.0 },
  { month: "T7", value: 38.2 },
];

// ---- Máy tính hoa hồng ----

/** Phí môi giới nền tảng thu trên mỗi giao dịch (2% giá trị) */
export const BROKERAGE_FEE_RATE = 0.02;
/** Giá gói hội viên Pro Broker (đ/tháng) */
export const MEMBERSHIP_PRICE = 499_000;

/** Xác định hạng đối tác theo số giao dịch chốt mỗi QUÝ */
export function tierForQuarterDeals(deals: number): AffiliateTier {
  if (deals >= 10) return AFFILIATE_TIERS[2];
  if (deals >= 3) return AFFILIATE_TIERS[1];
  return AFFILIATE_TIERS[0];
}

// ---- Bảng xếp hạng đối tác (leaderboard) ----

export interface LeaderboardRow {
  rank: number;
  name: string; // tên đã che
  region: string;
  deals: number; // giao dịch chốt trong quý
  earnings: string; // hoa hồng quý
  tierId: string; // khớp AffiliateTier.id
}

export const AFFILIATE_LEADERBOARD: LeaderboardRow[] = [
  { rank: 1, name: "Trần Q. M***", region: "TP. Thủ Đức", deals: 18, earnings: "412.000.000 đ", tierId: "vang" },
  { rank: 2, name: "Nguyễn H. L***", region: "Bình Thạnh", deals: 14, earnings: "356.500.000 đ", tierId: "vang" },
  { rank: 3, name: "Lê T. V***", region: "Hà Nội", deals: 11, earnings: "298.000.000 đ", tierId: "vang" },
  { rank: 4, name: "Phạm N. K***", region: "Đà Nẵng", deals: 8, earnings: "204.500.000 đ", tierId: "bac" },
  { rank: 5, name: "Võ M. T***", region: "Nha Trang", deals: 7, earnings: "186.500.000 đ", tierId: "bac" },
];

// ---- Kho tài liệu marketing (creative assets) ----

export interface MarketingAsset {
  id: string;
  icon: string;
  name: string;
  spec: string; // kích thước / định dạng
  desc: string;
  gradient: string; // lớp gradient placeholder cho thumbnail
}

export const MARKETING_ASSETS: MarketingAsset[] = [
  {
    id: "m1",
    icon: "Image",
    name: "Banner Facebook / Zalo",
    spec: "1200 × 628 · PNG",
    desc: "Bộ 6 banner gắn sẵn link và mã đối tác của bạn.",
    gradient: "from-realtor-500 to-sky-400",
  },
  {
    id: "m2",
    icon: "Smartphone",
    name: "Story / Reels dọc",
    spec: "1080 × 1920 · PNG + MP4",
    desc: "Template story kèm video 15s giới thiệu đấu giá livestream.",
    gradient: "from-violet-500 to-fuchsia-400",
  },
  {
    id: "m3",
    icon: "QrCode",
    name: "Mã QR + standee",
    spec: "A4 / A1 · PDF in ấn",
    desc: "QR trỏ thẳng về link của bạn — dùng cho sự kiện, quán cà phê.",
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    id: "m4",
    icon: "FileText",
    name: "Bộ caption mẫu",
    spec: "20 bài · DOCX",
    desc: "Nội dung đăng bài theo từng nhóm khách: mua ở, đầu tư, cho thuê.",
    gradient: "from-amber-500 to-orange-400",
  },
];
