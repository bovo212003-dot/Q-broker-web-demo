// =============================================================
// DỮ LIỆU MODULE ĐÀO TẠO  (/realtor/dao-tao)
// -------------------------------------------------------------
// Tái hiện nội dung các tab của Q-Broker mobile app lên web:
// Trang chủ · Chuyên đề · Trắc nghiệm · Tự luận.
// Toàn bộ mock tập trung tại đây — sau này thay bằng API, giữ nguyên shape.
// Ảnh dùng Unsplash (img thường) cho nhẹ, không cần cấu hình next/image.
// =============================================================

export const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

// ---- Người dùng đang đăng nhập (demo) -----------------------
export const TRAINEE = {
  name: "Võ Hoàng Tuấn",
  id: "6777298914879370940",
  avatar:
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=70",
  tier: "Bạc III",
  point: 18_250,
};

// ---- Xếp hạng & chuyên cần mỗi ngày (trang chủ Đào tạo) -----
export const RANK_INFO = {
  position: 159, // thứ hạng hiện tại trên bảng xếp hạng
  nextTier: "Vàng I",
  nextPoint: 20_000, // mốc điểm lên hạng kế tiếp
  gapPoint: 120, // cần thêm bao nhiêu điểm để vượt hạng liền trên
  gapRank: 158, // hạng liền trên
};

/** Bảng xếp hạng học viên (Top 100 — mock 9 người đầu).
 *  Mini leaderboard trong thẻ dùng 3 người đầu; modal hiển thị đủ. */
export interface LeaderboardEntry {
  rank: number;
  name: string;
  tier: string;
  points: number;
  avatar: string;
}

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Trần Thảo Vy", tier: "Kim cương", points: 45_210, avatar: img("photo-1573497019940-1c28c88b4f3e") },
  { rank: 2, name: "Lê Minh Quân", tier: "Bạch kim", points: 41_830, avatar: img("photo-1507003211169-0a1dd7228f2d") },
  { rank: 3, name: "Phạm Hồng Ngọc", tier: "Bạch kim", points: 39_540, avatar: img("photo-1544005313-94ddf0286df2") },
  { rank: 4, name: "Đỗ Văn Thành", tier: "Vàng I", points: 35_120, avatar: img("photo-1633332755192-727a05c4013d") },
  { rank: 5, name: "Vũ Hải Yến", tier: "Vàng II", points: 33_480, avatar: img("photo-1580489944761-15a19d654956") },
  { rank: 6, name: "Hoàng Văn Khang", tier: "Vàng II", points: 31_950, avatar: img("photo-1472099645785-5658abf4ff4e") },
  { rank: 7, name: "Đặng Thu Trang", tier: "Vàng III", points: 29_210, avatar: img("photo-1438761681033-6461ffad8d80") },
  { rank: 8, name: "Bùi Mai Anh", tier: "Vàng III", points: 27_640, avatar: img("photo-1534528741775-53994a69daeb") },
  { rank: 9, name: "Ngô Đức Mạnh", tier: "Vàng III", points: 25_980, avatar: img("photo-1552374196-c4e7ffc6e126") },
];

export interface StreakDay {
  day: number;
  reward: string;
  done: boolean;
  gift?: boolean; // ngày có quà đặc biệt
}

export const STREAK = {
  current: 2, // chuỗi ngày hiện tại
  best: 2, // kỷ lục chuỗi tốt nhất
  days: [
    { day: 1, reward: "+10đ", done: true },
    { day: 2, reward: "+10đ", done: true },
    { day: 3, reward: "+50đ", done: false, gift: true },
    { day: 4, reward: "+10đ", done: false },
    { day: 5, reward: "+10đ", done: false },
    { day: 6, reward: "+10đ", done: false },
    { day: 7, reward: "+50đ", done: false, gift: true },
  ] as StreakDay[],
  milestones: [
    { days: 3, reward: "+50đ" },
    { days: 7, reward: "+150đ" },
    { days: 15, reward: "+300đ" },
    { days: 30, reward: "+700đ" },
  ],
};

// ---- Dòng thông báo chạy (marquee) --------------------------
export const ANNOUNCEMENTS: string[] = [
  "Thông báo lịch thi của Sở Xây dựng TP. Hồ Chí Minh — xem chi tiết.",
  "Ứng dụng vừa cập nhật ngân hàng câu hỏi mới cho phần Chuyên môn.",
  "Ủng hộ nhóm phát triển ứng dụng để mở khoá thêm nhiều tính năng.",
  "Liên hệ quảng cáo: 0947 820 427.",
];

// ---- Lối tắt nhanh (Quick Actions) --------------------------
// ---- Banner ảnh trong hero (cuộn ngang 3s) ------------------
// Chỉ chứa ẢNH — sau này thay bằng ảnh quảng cáo/thông báo của công ty
// (đặt file vào public/ rồi đổi image thành "/ten-anh.png").
export interface HeroBannerSlide {
  id: string;
  image: string;
  alt?: string;
}

export const HERO_BANNERS: HeroBannerSlide[] = [
  { id: "hb1", image: img("photo-1521791136064-7986c2920216"), alt: "Banner 1" },
  { id: "hb2", image: img("photo-1450101499163-c8848c66ca85"), alt: "Banner 2" },
  { id: "hb3", image: img("photo-1554224155-6726b3ff858f"), alt: "Banner 3" },
  { id: "hb4", image: img("photo-1523240795612-9a054b0db644"), alt: "Banner 4" },
];

export interface QuickAction {
  label: string;
  icon: string; // lucide-react
  href: string;
  tone: "rose" | "sky" | "pink" | "slate" | "flame" | "amber";
  desc: string; // mô tả ngắn hiển thị trên tile
}

export const QUICK_ACTIONS: QuickAction[] = [
  { label: "Câu sai", icon: "XCircle", href: "/realtor/dao-tao/trac-nghiem", tone: "rose", desc: "Ôn lại các câu đã làm sai" },
  { label: "Đánh dấu", icon: "Bookmark", href: "/realtor/dao-tao/trac-nghiem", tone: "sky", desc: "Câu hỏi bạn đã lưu lại" },
  { label: "Bài học", icon: "BookOpen", href: "/realtor/dao-tao/chuyen-de", tone: "pink", desc: "Tiếp tục bài đang học dở" },
  { label: "Phiếu đăng ký", icon: "FileText", href: "/realtor/dao-tao", tone: "slate", desc: "Đăng ký kỳ thi sát hạch" },
  { label: "Gói VIP", icon: "Crown", href: "/realtor/dao-tao", tone: "flame", desc: "Mở khoá toàn bộ đề thi" },
  { label: "Lịch sử", icon: "History", href: "/realtor/dao-tao/trac-nghiem", tone: "amber", desc: "Xem lại các lần luyện đề" },
  { label: "Chuyên đề", icon: "Layers", href: "/realtor/dao-tao/chuyen-de", tone: "sky", desc: "16 chuyên đề chuẩn theo khung chương trình môi giới BĐS" },
  { label: "Trắc nghiệm", icon: "ListChecks", href: "/realtor/dao-tao/trac-nghiem", tone: "flame", desc: "Bộ đề tổng hợp — tự tạo đề luyện thi, chấm điểm tức thì" },
  { label: "Tự luận", icon: "PenLine", href: "/realtor/dao-tao/tu-luan", tone: "pink", desc: "Kho câu hỏi tự luận kèm gợi ý" },
];

// ---- Banner khuyến mại / tuyển dụng (carousel) --------------
export interface PromoSlide {
  id: string;
  eyebrow: string;
  title: string;
  desc: string;
  image: string;
  stats: { value: string; label: string }[];
  cta: string;
  phone?: string;
}

export const PROMO_SLIDES: PromoSlide[] = [
  {
    id: "promo-1",
    eyebrow: "Automation Land tuyển dụng",
    title: "Kiến tạo sự nghiệp bất động sản",
    desc: "Gia nhập hệ sinh thái để phát triển sự nghiệp bền vững và bứt phá thu nhập.",
    image: img("photo-1454165804606-c3d57bc86b40"),
    stats: [
      { value: "7+", label: "Năm" },
      { value: "100+", label: "Dự án" },
      { value: "3000+", label: "Giao dịch" },
      { value: "500+", label: "Chuyên viên" },
    ],
    cta: "Ứng tuyển ngay",
    phone: "0797 096 034",
  },
  {
    id: "promo-2",
    eyebrow: "Lộ trình luyện thi",
    title: "Chinh phục chứng chỉ hành nghề trong 30 ngày",
    desc: "16 chuyên đề chuẩn, ngân hàng đề bám sát kỳ sát hạch thật, chấm điểm tức thì.",
    image: img("photo-1524178232363-1fb2b075b655"),
    stats: [
      { value: "16", label: "Chuyên đề" },
      { value: "90", label: "Đề thi thử" },
      { value: "1200+", label: "Câu hỏi" },
      { value: "70%", label: "Mốc đạt" },
    ],
    cta: "Bắt đầu học",
  },
];

// ---- Khoá học (Khám phá khoá học) ---------------------------
// Các tập giá trị dùng cho cả thẻ khoá học lẫn bộ lọc trong modal.
export const COURSE_PROVIDERS = ["GRESA", "TREBS"] as const;
export const COURSE_FEES = ["Miễn phí", "Trả phí"] as const;
export const COURSE_LEVELS = [
  "Cơ bản",
  "Trung cấp",
  "Nâng cao",
  "Chuyên nghiệp",
  "Hội thảo",
] as const;
export const COURSE_FORMATS = ["Trực tuyến", "Trực tiếp", "Kết hợp"] as const;
export const COURSE_LANGUAGES = ["Tiếng Việt", "Tiếng Anh", "Tiếng Thái"] as const;

export type CourseProvider = (typeof COURSE_PROVIDERS)[number];
export type CourseFee = (typeof COURSE_FEES)[number];
export type CourseLevel = (typeof COURSE_LEVELS)[number];
export type CourseFormat = (typeof COURSE_FORMATS)[number];
export type CourseLanguage = (typeof COURSE_LANGUAGES)[number];

export interface Course {
  id: string;
  title: string;
  provider: CourseProvider;
  fee: CourseFee;
  level: CourseLevel;
  format: CourseFormat;
  language: CourseLanguage;
  image: string;
  lessons: number;
  hours: number;
}

export const COURSES: Course[] = [
  // --- GRESA (9 khoá) ---
  { id: "c1", title: "Khoá học chứng chỉ môi giới", provider: "GRESA", fee: "Trả phí", level: "Nâng cao", format: "Kết hợp", language: "Tiếng Việt", image: img("photo-1521791136064-7986c2920216"), lessons: 24, hours: 32 },
  { id: "c2", title: "Khoá học môi giới dự án", provider: "GRESA", fee: "Trả phí", level: "Nâng cao", format: "Trực tuyến", language: "Tiếng Việt", image: img("photo-1486406146926-c627a92ad1ab"), lessons: 18, hours: 24 },
  { id: "c3", title: "Kỹ năng đàm phán & chốt giao dịch", provider: "GRESA", fee: "Trả phí", level: "Chuyên nghiệp", format: "Trực tuyến", language: "Tiếng Việt", image: img("photo-1552664730-d307ca884978"), lessons: 12, hours: 16 },
  { id: "c4", title: "Khoá học môi giới kiều bào", provider: "GRESA", fee: "Trả phí", level: "Cơ bản", format: "Trực tuyến", language: "Tiếng Anh", image: img("photo-1477959858617-67f85cf4f1df"), lessons: 10, hours: 14 },
  { id: "c5", title: "Khoá học marketing bất động sản", provider: "GRESA", fee: "Trả phí", level: "Trung cấp", format: "Trực tuyến", language: "Tiếng Việt", image: img("photo-1460925895917-afdab827c52f"), lessons: 14, hours: 18 },
  { id: "c6", title: "Khoá học môi giới nhà phố", provider: "GRESA", fee: "Trả phí", level: "Cơ bản", format: "Trực tiếp", language: "Tiếng Việt", image: img("photo-1570129477492-45c003edd2be"), lessons: 9, hours: 12 },
  { id: "c7", title: "Khoá học môi giới quốc tế", provider: "GRESA", fee: "Trả phí", level: "Nâng cao", format: "Trực tuyến", language: "Tiếng Anh", image: img("photo-1512453979798-5ea266f8880c"), lessons: 16, hours: 22 },
  { id: "c8", title: "Khoá học quản lý sàn giao dịch", provider: "GRESA", fee: "Trả phí", level: "Chuyên nghiệp", format: "Kết hợp", language: "Tiếng Việt", image: img("photo-1497366216548-37526070297c"), lessons: 20, hours: 28 },
  { id: "c9", title: "Hội thảo: Xu hướng thị trường BĐS 2026", provider: "GRESA", fee: "Miễn phí", level: "Hội thảo", format: "Trực tiếp", language: "Tiếng Việt", image: img("photo-1517245386807-bb43f82c33c4"), lessons: 3, hours: 4 },
  // --- TREBS (7 khoá) ---
  { id: "c10", title: "Ứng dụng AI vào bất động sản", provider: "TREBS", fee: "Miễn phí", level: "Cơ bản", format: "Trực tuyến", language: "Tiếng Việt", image: img("photo-1518770660439-4636190af475"), lessons: 8, hours: 10 },
  { id: "c11", title: "Pháp lý dự án cho nhà môi giới", provider: "TREBS", fee: "Miễn phí", level: "Cơ bản", format: "Trực tuyến", language: "Tiếng Việt", image: img("photo-1450101499163-c8848c66ca85"), lessons: 10, hours: 12 },
  { id: "c12", title: "Định giá bất động sản thực chiến", provider: "TREBS", fee: "Trả phí", level: "Nâng cao", format: "Kết hợp", language: "Tiếng Việt", image: img("photo-1554224155-6726b3ff858f"), lessons: 15, hours: 20 },
  { id: "c13", title: "Đầu tư bất động sản cho người mới", provider: "TREBS", fee: "Miễn phí", level: "Trung cấp", format: "Trực tuyến", language: "Tiếng Việt", image: img("photo-1560518883-ce09059eeffa"), lessons: 12, hours: 14 },
  { id: "c14", title: "Quản trị rủi ro pháp lý giao dịch", provider: "TREBS", fee: "Trả phí", level: "Chuyên nghiệp", format: "Trực tuyến", language: "Tiếng Việt", image: img("photo-1591696205602-2f950c417cb9"), lessons: 11, hours: 15 },
  { id: "c15", title: "Phân tích thị trường & dữ liệu BĐS", provider: "TREBS", fee: "Trả phí", level: "Trung cấp", format: "Kết hợp", language: "Tiếng Anh", image: img("photo-1454165804606-c3d57bc86b40"), lessons: 13, hours: 18 },
  { id: "c16", title: "Kỹ năng livestream bán bất động sản", provider: "TREBS", fee: "Miễn phí", level: "Cơ bản", format: "Trực tuyến", language: "Tiếng Việt", image: img("photo-1524178232363-1fb2b075b655"), lessons: 7, hours: 9 },
];

// ---- 16 chuyên đề chuẩn (tab Chuyên đề) ---------------------
export interface Topic {
  id: number;
  title: string;
  group: "Cơ sở" | "Chuyên môn";
  lessons: number;
  minutes: number;
  free: boolean;
  image: string;
}

export const TOPICS: Topic[] = [
  { id: 1, title: "Các quy định pháp luật về kinh doanh bất động sản", group: "Cơ sở", lessons: 9, minutes: 120, free: true, image: img("photo-1450101499163-c8848c66ca85") },
  { id: 2, title: "Các quy định pháp luật về nhà ở liên quan đến kinh doanh BĐS", group: "Cơ sở", lessons: 7, minutes: 100, free: true, image: img("photo-1486406146926-c627a92ad1ab") },
  { id: 3, title: "Các quy định pháp luật về đất đai liên quan đến kinh doanh BĐS", group: "Cơ sở", lessons: 8, minutes: 110, free: true, image: img("photo-1500382017468-9049fed747ef") },
  { id: 4, title: "Pháp lý đầu tư bất động sản — trình tự & nội dung dự án", group: "Cơ sở", lessons: 6, minutes: 90, free: true, image: img("photo-1487958449943-2429e8be8625") },
  { id: 5, title: "Tổng quan về dịch vụ môi giới bất động sản", group: "Cơ sở", lessons: 6, minutes: 80, free: true, image: img("photo-1521791136064-7986c2920216") },
  { id: 6, title: "Quy trình và kỹ năng môi giới bất động sản", group: "Chuyên môn", lessons: 8, minutes: 130, free: false, image: img("photo-1560518883-ce09059eeffa") },
  { id: 7, title: "Định giá bất động sản", group: "Chuyên môn", lessons: 7, minutes: 120, free: false, image: img("photo-1554224155-6726b3ff858f") },
  { id: 8, title: "Marketing bất động sản", group: "Chuyên môn", lessons: 5, minutes: 70, free: false, image: img("photo-1460925895917-afdab827c52f") },
  { id: 9, title: "Đầu tư & tài chính bất động sản", group: "Chuyên môn", lessons: 6, minutes: 100, free: false, image: img("photo-1454165804606-c3d57bc86b40") },
  { id: 10, title: "Quản lý và điều hành sàn giao dịch BĐS", group: "Chuyên môn", lessons: 6, minutes: 95, free: false, image: img("photo-1497366216548-37526070297c") },
  { id: 11, title: "Phát triển đô thị & nhà ở xã hội", group: "Chuyên môn", lessons: 5, minutes: 80, free: false, image: img("photo-1479839672679-a46483c0e34c") },
  { id: 12, title: "Thẩm định hồ sơ pháp lý bất động sản", group: "Chuyên môn", lessons: 7, minutes: 110, free: false, image: img("photo-1591696205602-2f950c417cb9") },
  { id: 13, title: "Kỹ năng tư vấn & chăm sóc khách hàng", group: "Chuyên môn", lessons: 5, minutes: 75, free: false, image: img("photo-1573164713988-8665fc963095") },
  { id: 14, title: "Đạo đức nghề nghiệp môi giới BĐS", group: "Cơ sở", lessons: 4, minutes: 60, free: true, image: img("photo-1507679799987-c73779587ccf") },
  { id: 15, title: "Ứng dụng công nghệ trong môi giới BĐS", group: "Chuyên môn", lessons: 5, minutes: 70, free: false, image: img("photo-1519389950473-47ba0277781c") },
  { id: 16, title: "Ôn tập tổng hợp & luyện đề sát hạch", group: "Chuyên môn", lessons: 8, minutes: 140, free: false, image: img("photo-1434030216411-0b793f4b4173") },
];

// ---- Trắc nghiệm (tab Trắc nghiệm) --------------------------
export type ExamGroup = "Cơ sở" | "Chuyên môn";

/** Cấu hình đề TỰ LUYỆN theo nhóm (bản web hoá màn "Bộ đề tổng hợp" trên app):
 *  người dùng tạo đề ngẫu nhiên theo phạm vi chuyên đề của từng nhóm. */
export interface SelfPracticeConfig {
  questions: number; // tổng số câu
  minutes: number; // thời gian làm bài
  rangeLabel: string; // phạm vi câu hỏi hiển thị
  desc: string; // mô tả nguồn câu hỏi
  startNo: number; // số thứ tự đề mặc định kế tiếp
}

export const SELF_PRACTICE: Record<ExamGroup, SelfPracticeConfig> = {
  "Cơ sở": {
    questions: 40,
    minutes: 120,
    rangeLabel: "Chuyên đề 1 - 12",
    desc: "Bộ đề thi gồm 40 câu hỏi được tạo ngẫu nhiên từ Chuyên đề 1 đến Chuyên đề 12.",
    startNo: 2,
  },
  "Chuyên môn": {
    questions: 40,
    minutes: 120,
    rangeLabel: "Chuyên đề 13 & 14",
    desc: "Bộ đề thi gồm 40 câu hỏi được tạo ngẫu nhiên từ Chuyên đề 13 và Chuyên đề 14.",
    startNo: 1,
  },
};

// ---- Ngân hàng câu hỏi (mock) & bài thi đang làm ------------
export interface QuizQuestion {
  q: string;
  options: string[]; // 3-4 lựa chọn
  answer: number; // index đáp án đúng
}

const CO_SO_BANK: QuizQuestion[] = [
  {
    q: "Cá nhân bán/cho thuê mua nhà ở, công trình xây dựng không nhằm mục đích kinh doanh hoặc dưới mức quy mô nhỏ phải tuân thủ yêu cầu hình thức hợp đồng nào?",
    options: [
      "Không có yêu cầu đặc biệt.",
      "Sử dụng mẫu hợp đồng do Bộ Tài chính ban hành.",
      "Hợp đồng lập thành văn bản và được công chứng hoặc chứng thực.",
      "Đăng ký hợp đồng tại Sở Xây dựng.",
    ],
    answer: 2,
  },
  {
    q: "Thời hạn sở hữu nhà chung cư theo Luật Nhà ở 2023 được xác định như thế nào?",
    options: [
      "Sở hữu có thời hạn 50 năm.",
      "Sở hữu có thời hạn 70 năm.",
      "Theo thời hạn ghi trong hợp đồng mua bán.",
      "Không quy định thời hạn sở hữu; chỉ có thời hạn sử dụng theo thiết kế/kiểm định. Quyền sử dụng đất ổn định lâu dài.",
    ],
    answer: 3,
  },
  {
    q: "Giá đất cụ thể được áp dụng trong trường hợp nào sau đây theo Luật Đất đai 2024?",
    options: [
      "Tính tiền thuê đất trả tiền hàng năm.",
      "Tính thuế sử dụng đất phi nông nghiệp đối với hộ gia đình.",
      "Tính phí trước bạ khi chuyển nhượng quyền sử dụng đất.",
      "Tính tiền bồi thường khi Nhà nước thu hồi đất.",
    ],
    answer: 3,
  },
  {
    q: "Đối với dự án đầu tư xây dựng nhà ở thương mại, yêu cầu nào sau đây không bắt buộc?",
    options: [
      "Phải có phương án đầu tư xây dựng hệ thống hạ tầng kỹ thuật.",
      "Phải cam kết tiến độ bán hàng cụ thể.",
      "Phải phù hợp với quy hoạch phát triển nhà ở.",
      "Phải có phương án đóng góp quỹ phát triển nhà ở xã hội.",
    ],
    answer: 1,
  },
  {
    q: "Sở hữu chung hợp nhất được hiểu là gì?",
    options: [
      "Là sở hữu chung mà trong đó, phần quyền sở hữu của mỗi chủ sở hữu chung không được xác định đối với tài sản chung.",
      "Là sở hữu chung hợp nhất có thể phân chia.",
      "Là sở hữu của nhiều chủ thể đối với tài sản.",
      "Là sở hữu chung mà trong đó phần quyền sở hữu của mỗi chủ sở hữu được xác định đối với tài sản chung.",
    ],
    answer: 0,
  },
  {
    q: "Cơ quan nào quy định việc phân hạng và công nhận phân hạng nhà chung cư?",
    options: ["Chính phủ.", "Bộ Xây dựng.", "UBND cấp tỉnh.", "Sở Xây dựng."],
    answer: 1,
  },
  {
    q: "Việc chuyển nhượng hợp đồng mua bán, thuê mua nhà ở hình thành trong tương lai không được áp dụng đối với?",
    options: [
      "Hợp đồng cho thuê, cho thuê lại quyền sử dụng đất.",
      "Hợp đồng mua bán, thuê mua nhà ở xã hội.",
      "Hợp đồng thuê nhà ở, công trình xây dựng thương mại.",
      "Hợp đồng chuyển nhượng quyền sử dụng đất.",
    ],
    answer: 1,
  },
  {
    q: "Thời điểm tính thuế khi hợp đồng chuyển nhượng có hiệu lực theo quy định của pháp luật được áp dụng trong trường hợp nào?",
    options: [
      "Khi cá nhân nhận chuyển nhượng nhà ở hình thành trong tương lai, quyền sử dụng đất gắn với công trình xây dựng tương lai.",
      "Khi hợp đồng chuyển nhượng có thỏa thuận bên mua là người nộp thuế thay cho bên bán.",
      "Khi hợp đồng chuyển nhượng không có thỏa thuận bên mua là người nộp thuế thay cho bên bán.",
    ],
    answer: 2,
  },
  {
    q: "Diện tích tối thiểu để tách thửa đất ở do cơ quan nào quy định?",
    options: [
      "Chính phủ.",
      "Bộ Tài nguyên và Môi trường.",
      "UBND cấp tỉnh.",
      "Văn phòng đăng ký đất đai.",
    ],
    answer: 2,
  },
  {
    q: '"Sổ hồng" là tên gọi thường dùng của loại giấy tờ nào?',
    options: [
      "Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở và tài sản khác gắn liền với đất.",
      "Hợp đồng mua bán nhà.",
      "Giấy phép xây dựng.",
      "Biên bản bàn giao nhà.",
    ],
    answer: 0,
  },
];

const CHUYEN_MON_BANK: QuizQuestion[] = [
  {
    q: "Trong tư vấn BĐS, nguyên tắc quan trọng nhất khi cung cấp thông tin cho khách hàng là gì?",
    options: [
      "Trung thực, chính xác và đầy đủ.",
      "Chỉ nêu ưu điểm của sản phẩm.",
      "Giấu thông tin bất lợi để dễ chốt.",
      "Phóng đại giá trị đầu tư.",
    ],
    answer: 0,
  },
  {
    q: "Kỹ năng lắng nghe chủ động giúp môi giới điều gì?",
    options: [
      "Hiểu đúng nhu cầu thực sự của khách hàng.",
      "Rút ngắn thời gian bằng cách nói nhiều hơn.",
      "Chốt deal mà không cần tìm hiểu.",
      "Bỏ qua phản hồi của khách.",
    ],
    answer: 0,
  },
  {
    q: "Đạo đức nghề nghiệp môi giới BĐS yêu cầu điều nào sau đây?",
    options: [
      "Bảo mật thông tin khách hàng.",
      "Ưu tiên hoa hồng hơn lợi ích khách.",
      "Cạnh tranh bằng cách nói xấu đồng nghiệp.",
      "Cam kết vượt quá khả năng thực hiện.",
    ],
    answer: 0,
  },
  {
    q: "Khi định giá sơ bộ một bất động sản, yếu tố nào ảnh hưởng lớn nhất?",
    options: [
      "Vị trí và tình trạng pháp lý.",
      "Màu sơn của căn nhà.",
      "Tên của chủ nhà.",
      "Hướng gió theo phong thủy tuyệt đối.",
    ],
    answer: 0,
  },
  {
    q: "Quy trình môi giới chuẩn thường bắt đầu bằng bước nào?",
    options: [
      "Tìm hiểu nhu cầu khách hàng.",
      "Ký hợp đồng đặt cọc.",
      "Bàn giao nhà.",
      "Thu hoa hồng.",
    ],
    answer: 0,
  },
  {
    q: "Marketing bất động sản hiệu quả nên tập trung vào điều gì?",
    options: [
      "Đúng tệp khách hàng mục tiêu.",
      "Đăng càng nhiều nơi càng tốt bất kể đối tượng.",
      "Chỉ dùng tờ rơi giấy.",
      "Không cần hình ảnh sản phẩm.",
    ],
    answer: 0,
  },
];

export const QUIZ_BANK: Record<ExamGroup, QuizQuestion[]> = {
  "Cơ sở": CO_SO_BANK,
  "Chuyên môn": CHUYEN_MON_BANK,
};

/** Bài thi đang làm — lưu localStorage để quay lại còn tiếp tục được. */
export interface ActiveExam {
  id: string;
  name: string;
  group: ExamGroup;
  questions: QuizQuestion[];
  answers: (number | null)[]; // đáp án đã chọn theo từng câu
  marked: number[]; // các câu đã đánh dấu
  current: number; // câu đang xem
  remainingSec: number; // thời gian còn lại (giây)
  createdAt: string; // "13/07/2026 16:06"
}

/** Sinh bài thi 40 câu từ ngân hàng câu hỏi của nhóm (lặp vòng cho đủ 40). */
export function buildExam(group: ExamGroup, name: string): ActiveExam {
  const bank = QUIZ_BANK[group];
  const total = SELF_PRACTICE[group].questions;
  const questions = Array.from({ length: total }, (_, i) => bank[i % bank.length]);
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return {
    id: `ex-${Date.now()}`,
    name,
    group,
    questions,
    answers: Array(total).fill(null),
    marked: [],
    current: 0,
    remainingSec: SELF_PRACTICE[group].minutes * 60,
    createdAt: `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`,
  };
}

const ACTIVE_EXAM_KEY = "qb-active-exam";

export function loadActiveExam(): ActiveExam | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ACTIVE_EXAM_KEY);
    return raw ? (JSON.parse(raw) as ActiveExam) : null;
  } catch {
    return null;
  }
}

export function saveActiveExam(exam: ActiveExam | null) {
  if (typeof window === "undefined") return;
  if (exam) localStorage.setItem(ACTIVE_EXAM_KEY, JSON.stringify(exam));
  else localStorage.removeItem(ACTIVE_EXAM_KEY);
}

// ---- Tự luận (tab Tự luận) ----------------------------------
export type EssayGroup = "Kiến thức cơ sở" | "Kiến thức chuyên môn";

export interface EssayQuestion {
  id: number;
  group: EssayGroup;
  prompt: string;
  keywords: string[];
}

export const ESSAY_QUESTIONS: EssayQuestion[] = [
  { id: 1, group: "Kiến thức cơ sở", prompt: "Trình bày các nguyên tắc kinh doanh bất động sản theo Luật KDBĐS 2023. Theo anh/chị nguyên tắc nào là quan trọng nhất, giải thích lý do và liên hệ thực tiễn.", keywords: ["Luật KDBĐS 2023", "nguyên tắc", "minh bạch"] },
  { id: 2, group: "Kiến thức cơ sở", prompt: "Trình bày các hình thức phát triển nhà ở xã hội theo quy định hiện hành? Liên hệ thực tiễn một hình thức phát triển NOXH và phân tích, bình luận.", keywords: ["nhà ở xã hội", "hình thức phát triển"] },
  { id: 3, group: "Kiến thức cơ sở", prompt: "Trình bày các nguyên tắc đầu tư phát triển đô thị? Lựa chọn một vài nguyên tắc quan trọng, điển hình, khác biệt để phân tích, bình luận.", keywords: ["đầu tư", "phát triển đô thị"] },
  { id: 4, group: "Kiến thức cơ sở", prompt: "Trình bày một số loại vi phạm hành chính về đất đai theo quy định của pháp luật hiện nay. Lựa chọn một loại VPHC về đất đai để phân tích.", keywords: ["VPHC", "đất đai", "xử phạt"] },
  { id: 5, group: "Kiến thức chuyên môn", prompt: "Trình bày quy trình môi giới một sản phẩm bất động sản từ khâu tiếp nhận nguồn hàng đến khi hoàn tất giao dịch. Nêu các rủi ro thường gặp và cách phòng tránh.", keywords: ["quy trình môi giới", "rủi ro"] },
  { id: 6, group: "Kiến thức chuyên môn", prompt: "Phân tích các phương pháp định giá bất động sản. Áp dụng một phương pháp để định giá một sản phẩm cụ thể mà anh/chị biết.", keywords: ["định giá", "phương pháp so sánh"] },
  { id: 7, group: "Kiến thức chuyên môn", prompt: "Trình bày vai trò của sàn giao dịch bất động sản trong việc bảo đảm tính minh bạch của thị trường. Liên hệ cơ chế xác thực sản phẩm.", keywords: ["sàn giao dịch", "minh bạch", "xác thực"] },
  { id: 8, group: "Kiến thức chuyên môn", prompt: "Phân tích tác động của chuyển đổi số đến hoạt động môi giới bất động sản. Đề xuất giải pháp ứng dụng công nghệ nâng cao hiệu quả môi giới.", keywords: ["chuyển đổi số", "công nghệ"] },
];
