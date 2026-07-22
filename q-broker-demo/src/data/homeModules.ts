// =============================================================
// DỮ LIỆU TRANG CHỦ /realtor — Hệ sinh thái Q-Broker
// Tập trung nội dung các trụ cột (đào tạo, chia sẻ giỏ hàng,
// cần thuê-mua, live stream, tuyển dụng) + số liệu tổng quan.
// "Sửa một nơi, áp dụng toàn bộ" — trang chỉ đọc, không hardcode.
// =============================================================

// Số liệu tổng quan hiển thị ở dải thống kê dưới hero.
export type EcosystemStat = {
  icon: string; // tên icon lucide
  value: string; // phần số (đếm động ở client)
  suffix?: string; // hậu tố giữ nguyên (vd "+")
  label: string;
};

export const ECOSYSTEM_STATS: EcosystemStat[] = [
  { icon: "Users", value: "12.500", suffix: "+", label: "Môi giới trong mạng lưới" },
  { icon: "Handshake", value: "3.200", suffix: "+", label: "Giao dịch kết nối thành công" },
  { icon: "GraduationCap", value: "48", label: "Khoá đào tạo & chứng chỉ" },
  { icon: "Radio", value: "150", suffix: "+", label: "Phiên live đấu giá mỗi tháng" },
];

// Khoá màu (tone) của mỗi module — map sang class Tailwind tĩnh trong component.
export type ModuleTone =
  | "training"
  | "sharing"
  | "demand"
  | "live"
  | "recruit";

// Một trụ cột của hệ sinh thái.
export type HomeModule = {
  id: string;
  tone: ModuleTone;
  icon: string;
  eyebrow: string; // nhãn nhỏ phía trên tiêu đề
  title: string;
  desc: string;
  href: string; // đường dẫn gốc (role ghép ở component)
  cta: string;
  image: string; // ảnh nền chủ đề cho khung visual
  bullets: { icon: string; text: string }[];
  stats: { value: string; label: string }[];
};

// Ảnh nền của mỗi module: file local trong public/home/ (đã tuyển chọn,
// không hotlink ra ngoài) — dùng chung cho hero "video" và panel chi tiết.

export const HOME_MODULES: HomeModule[] = [
  {
    id: "dao-tao",
    tone: "training",
    icon: "GraduationCap",
    eyebrow: "Học viện Q-Broker",
    title: "Đào tạo & chứng chỉ môi giới",
    desc: "Lộ trình bài bản từ nhập môn tới chuyên sâu: luyện thi chứng chỉ hành nghề, kỹ năng đàm phán, marketing BĐS — đồng hành cùng Automation Land.",
    href: "/realtor/dao-tao",
    cta: "Khám phá khoá học",
    image: "/home/dao-tao.jpg",
    bullets: [
      { icon: "BookOpen", text: "Chuyên đề theo chủ đề, học mọi lúc mọi nơi" },
      { icon: "PencilLine", text: "Ngân hàng trắc nghiệm & tự luận sát đề thi" },
      { icon: "BadgeCheck", text: "Chứng chỉ hoàn thành ghi nhận trên hồ sơ" },
    ],
    stats: [
      { value: "48", label: "khoá học" },
      { value: "9.4/10", label: "hài lòng" },
    ],
  },
  {
    id: "chia-se-gio-hang",
    tone: "sharing",
    icon: "Share2",
    eyebrow: "Nguồn hàng liên kết",
    title: "Chia sẻ giỏ hàng",
    desc: "Kho nguồn hàng dùng chung giữa môi giới, sàn giao dịch và ngân hàng. Đăng quỹ căn, kết nối đúng người bán — đúng người cần, tỉ lệ chốt cao hơn.",
    href: "/realtor/chia-se-gio-hang",
    cta: "Xem giỏ hàng chia sẻ",
    image: "/home/chia-se-gio-hang.jpg",
    bullets: [
      { icon: "Boxes", text: "Chia sẻ quỹ căn, dự án, thanh lý theo khu vực" },
      { icon: "Percent", text: "Thoả thuận tỉ lệ hoa hồng minh bạch" },
      { icon: "ShieldCheck", text: "Chỉ dành cho đối tác đã xác thực" },
    ],
    stats: [
      { value: "1.800+", label: "quỹ hàng" },
      { value: "24h", label: "kết nối" },
    ],
  },
  {
    id: "can-thue-mua",
    tone: "demand",
    icon: "Search",
    eyebrow: "Nhu cầu thực",
    title: "Cần thuê - mua",
    desc: "Khách đăng nhu cầu mua/thuê thật; môi giới đấu giá quyền phục vụ (Broker Auction). Đúng nhu cầu, đúng ngân sách — không còn tin rác, không spam.",
    href: "/realtor/can-thue-mua",
    cta: "Xem nhu cầu đang mở",
    image: "/home/can-thue-mua.jpg",
    bullets: [
      { icon: "ClipboardList", text: "Đăng nhu cầu mua/thuê chi tiết theo tiêu chí" },
      { icon: "Gavel", text: "Đấu giá quyền môi giới phục vụ khách" },
      { icon: "Target", text: "Khớp ngân sách & khu vực tự động" },
    ],
    stats: [
      { value: "2.600+", label: "nhu cầu" },
      { value: "92%", label: "khớp đúng" },
    ],
  },
  {
    id: "livestream",
    tone: "live",
    icon: "Radio",
    eyebrow: "Phát trực tiếp",
    title: "Live stream & đấu giá",
    desc: "Trải nghiệm bán hàng kiểu TikTok Live: xem dự án trực tiếp, chat cùng môi giới, và bấm nút búa để tham gia đấu giá ngay trên sóng.",
    href: "/realtor/livestream",
    cta: "Vào phòng live",
    image: "/home/livestream.jpg",
    bullets: [
      { icon: "Video", text: "Giới thiệu dự án qua video thời gian thực" },
      { icon: "MessagesSquare", text: "Chat, thả tim, hỏi đáp tức thì" },
      { icon: "Gavel", text: "Đấu giá trực tiếp — chốt giá minh bạch" },
    ],
    stats: [
      { value: "150+", label: "phiên/tháng" },
      { value: "8.5K", label: "lượt xem TB" },
    ],
  },
  {
    id: "tuyen-dung",
    tone: "recruit",
    icon: "Briefcase",
    eyebrow: "Nghề môi giới",
    title: "Tuyển dụng",
    desc: "Sàn tuyển dụng BĐS hai chiều: sàn & chủ đầu tư đăng tin, quản lý ứng viên; môi giới ứng tuyển bằng CV trực tuyến gắn Tier, điểm và chứng chỉ.",
    href: "/realtor/tuyen-dung",
    cta: "Xem tin tuyển dụng",
    image: "/home/tuyen-dung.jpg",
    bullets: [
      { icon: "UserCheck", text: "CV trực tuyến gắn Tier & chứng chỉ Q-Broker" },
      { icon: "Building2", text: "Nhà tuyển dụng đăng tin, lọc ứng viên nhanh" },
      { icon: "TrendingUp", text: "Minh bạch năng lực bằng điểm uy tín" },
    ],
    stats: [
      { value: "320+", label: "tin tuyển" },
      { value: "5 Tier", label: "xếp hạng" },
    ],
  },
];
