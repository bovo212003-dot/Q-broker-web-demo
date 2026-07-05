// =============================================================
// DỮ LIỆU MODULE ĐÀO TẠO  (/realtor/dao-tao)
// -------------------------------------------------------------
// Tái hiện nội dung 5 tab của Q-Broker mobile app lên web:
// Trang chủ · Chuyên đề · Trắc nghiệm · Tự luận · Tài khoản.
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
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=70",
  tier: "Bạc III",
  point: 18_250,
};

// ---- Dòng thông báo chạy (marquee) --------------------------
export const ANNOUNCEMENTS: string[] = [
  "Lịch thi sát hạch đợt tháng 8 do Sở Xây dựng TP. Hồ Chí Minh công bố — xem chi tiết.",
  "Ứng dụng vừa cập nhật ngân hàng câu hỏi mới cho phần Chuyên môn.",
  "Ủng hộ nhóm phát triển ứng dụng để mở khoá thêm nhiều tính năng.",
];

// ---- Lối tắt nhanh (Quick Actions) --------------------------
export interface QuickAction {
  label: string;
  icon: string; // lucide-react
  href: string;
  tone: "rose" | "sky" | "pink" | "slate" | "flame" | "amber";
}

export const QUICK_ACTIONS: QuickAction[] = [
  { label: "Câu sai", icon: "XCircle", href: "/realtor/dao-tao/trac-nghiem", tone: "rose" },
  { label: "Đánh dấu", icon: "Bookmark", href: "/realtor/dao-tao/trac-nghiem", tone: "sky" },
  { label: "Bài học", icon: "BookOpen", href: "/realtor/dao-tao/chuyen-de", tone: "pink" },
  { label: "Phiếu đăng ký", icon: "FileText", href: "/realtor/dao-tao", tone: "slate" },
  { label: "Gói VIP", icon: "Crown", href: "/realtor/dao-tao/tai-khoan", tone: "flame" },
  { label: "Lịch sử", icon: "History", href: "/realtor/dao-tao/trac-nghiem", tone: "amber" },
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
export type CourseProvider = "GRESA" | "TREBS";

export interface Course {
  id: string;
  title: string;
  level: "Cơ bản" | "Nâng cao";
  language: string;
  provider: CourseProvider;
  price: "FREE" | "Liên hệ";
  image: string;
  lessons: number;
  hours: number;
}

export const COURSES: Course[] = [
  {
    id: "c1",
    title: "Khoá học chứng chỉ môi giới",
    level: "Nâng cao",
    language: "Tiếng Việt",
    provider: "GRESA",
    price: "Liên hệ",
    image: img("photo-1521791136064-7986c2920216"),
    lessons: 24,
    hours: 32,
  },
  {
    id: "c2",
    title: "Khoá học môi giới dự án",
    level: "Nâng cao",
    language: "Tiếng Việt",
    provider: "GRESA",
    price: "Liên hệ",
    image: img("photo-1486406146926-c627a92ad1ab"),
    lessons: 18,
    hours: 24,
  },
  {
    id: "c3",
    title: "Kỹ năng đàm phán & chốt giao dịch",
    level: "Nâng cao",
    language: "Tiếng Việt",
    provider: "GRESA",
    price: "Liên hệ",
    image: img("photo-1552664730-d307ca884978"),
    lessons: 12,
    hours: 16,
  },
  {
    id: "c4",
    title: "Định giá bất động sản thực chiến",
    level: "Nâng cao",
    language: "Tiếng Việt",
    provider: "TREBS",
    price: "Liên hệ",
    image: img("photo-1554224155-6726b3ff858f"),
    lessons: 15,
    hours: 20,
  },
  {
    id: "c5",
    title: "Pháp lý dự án cho nhà môi giới",
    level: "Cơ bản",
    language: "Tiếng Việt",
    provider: "TREBS",
    price: "FREE",
    image: img("photo-1450101499163-c8848c66ca85"),
    lessons: 10,
    hours: 12,
  },
  {
    id: "c6",
    title: "Marketing bất động sản thời đại số",
    level: "Cơ bản",
    language: "Tiếng Việt",
    provider: "TREBS",
    price: "FREE",
    image: img("photo-1460925895917-afdab827c52f"),
    lessons: 9,
    hours: 10,
  },
];

// ---- 16 chuyên đề chuẩn (tab Chuyên đề) ---------------------
export interface Topic {
  id: number;
  title: string;
  group: "Cơ bản" | "Chuyên môn";
  lessons: number;
  minutes: number;
  free: boolean;
  image: string;
}

export const TOPICS: Topic[] = [
  { id: 1, title: "Các quy định pháp luật về kinh doanh bất động sản", group: "Cơ bản", lessons: 9, minutes: 120, free: true, image: img("photo-1450101499163-c8848c66ca85") },
  { id: 2, title: "Các quy định pháp luật về nhà ở liên quan đến kinh doanh BĐS", group: "Cơ bản", lessons: 7, minutes: 100, free: true, image: img("photo-1486406146926-c627a92ad1ab") },
  { id: 3, title: "Các quy định pháp luật về đất đai liên quan đến kinh doanh BĐS", group: "Cơ bản", lessons: 8, minutes: 110, free: true, image: img("photo-1500382017468-9049fed747ef") },
  { id: 4, title: "Pháp lý đầu tư bất động sản — trình tự & nội dung dự án", group: "Cơ bản", lessons: 6, minutes: 90, free: true, image: img("photo-1487958449943-2429e8be8625") },
  { id: 5, title: "Tổng quan về dịch vụ môi giới bất động sản", group: "Cơ bản", lessons: 6, minutes: 80, free: true, image: img("photo-1521791136064-7986c2920216") },
  { id: 6, title: "Quy trình và kỹ năng môi giới bất động sản", group: "Chuyên môn", lessons: 8, minutes: 130, free: false, image: img("photo-1560518883-ce09059eeffa") },
  { id: 7, title: "Định giá bất động sản", group: "Chuyên môn", lessons: 7, minutes: 120, free: false, image: img("photo-1554224155-6726b3ff858f") },
  { id: 8, title: "Marketing bất động sản", group: "Chuyên môn", lessons: 5, minutes: 70, free: false, image: img("photo-1460925895917-afdab827c52f") },
  { id: 9, title: "Đầu tư & tài chính bất động sản", group: "Chuyên môn", lessons: 6, minutes: 100, free: false, image: img("photo-1454165804606-c3d57bc86b40") },
  { id: 10, title: "Quản lý và điều hành sàn giao dịch BĐS", group: "Chuyên môn", lessons: 6, minutes: 95, free: false, image: img("photo-1497366216548-37526070297c") },
  { id: 11, title: "Phát triển đô thị & nhà ở xã hội", group: "Chuyên môn", lessons: 5, minutes: 80, free: false, image: img("photo-1479839672679-a46483c0e34c") },
  { id: 12, title: "Thẩm định hồ sơ pháp lý bất động sản", group: "Chuyên môn", lessons: 7, minutes: 110, free: false, image: img("photo-1591696205602-2f950c417cb9") },
  { id: 13, title: "Kỹ năng tư vấn & chăm sóc khách hàng", group: "Chuyên môn", lessons: 5, minutes: 75, free: false, image: img("photo-1573164713988-8665fc963095") },
  { id: 14, title: "Đạo đức nghề nghiệp môi giới BĐS", group: "Cơ bản", lessons: 4, minutes: 60, free: true, image: img("photo-1507679799987-c73779587ccf") },
  { id: 15, title: "Ứng dụng công nghệ trong môi giới BĐS", group: "Chuyên môn", lessons: 5, minutes: 70, free: false, image: img("photo-1519389950473-47ba0277781c") },
  { id: 16, title: "Ôn tập tổng hợp & luyện đề sát hạch", group: "Chuyên môn", lessons: 8, minutes: 140, free: false, image: img("photo-1434030216411-0b793f4b4173") },
];

// ---- Trắc nghiệm (tab Trắc nghiệm) --------------------------
export type ExamGroup = "Cơ sở" | "Chuyên môn";

export interface ExamSet {
  id: string;
  index: number;
  title: string;
  group: ExamGroup;
  questions: number;
  minutes: number;
  done: boolean;
  score?: number; // % nếu đã làm
}

/** Sinh danh sách đề theo nhóm (mô phỏng 50 đề Cơ sở, 40 đề Chuyên môn) */
function makeExamSets(group: ExamGroup, count: number, doneUpto: number): ExamSet[] {
  const prefix = group === "Cơ sở" ? "Đề Cơ Sở Số" : "Đề Chuyên Môn Số";
  return Array.from({ length: count }, (_, i) => {
    const index = i + 1;
    const done = index <= doneUpto;
    return {
      id: `${group === "Cơ sở" ? "cs" : "cm"}-${index}`,
      index,
      title: `${prefix} ${index}`,
      group,
      questions: 40,
      minutes: 120,
      done,
      score: done ? 72 + ((index * 7) % 25) : undefined,
    };
  });
}

export const EXAM_SETS: Record<ExamGroup, ExamSet[]> = {
  "Cơ sở": makeExamSets("Cơ sở", 50, 1),
  "Chuyên môn": makeExamSets("Chuyên môn", 40, 0),
};

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

// ---- Tài khoản (tab Tài khoản) ------------------------------
export interface AccountItem {
  label: string;
  icon: string;
  desc?: string;
}

export const ACCOUNT_MENU: AccountItem[] = [
  { label: "Ngôn ngữ", icon: "Globe", desc: "Tiếng Việt" },
  { label: "Điều khoản sử dụng", icon: "FileText" },
  { label: "Chăm sóc khách hàng", icon: "Headphones" },
  { label: "Mời bạn bè", icon: "Users" },
  { label: "Đóng góp ý kiến", icon: "Lightbulb" },
  { label: "Hướng dẫn nhanh", icon: "PlayCircle" },
];
