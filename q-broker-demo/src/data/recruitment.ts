// =============================================================
// DỮ LIỆU TRANG TUYỂN DỤNG  (/realtor/tuyen-dung)
// -------------------------------------------------------------
// Theo requirement "Tuyển dụng Môi giới Bất động sản":
// - Nhà tuyển dụng (sàn, chủ đầu tư...): đăng tin (kiểm duyệt), hồ sơ
//   doanh nghiệp, pipeline ứng viên, lịch phỏng vấn, báo cáo thống kê.
// - Ứng viên (môi giới): CV trực tuyến (Tier, điểm, chứng chỉ), tìm
//   việc theo tiêu chí, lưu tin, ứng tuyển & theo dõi trạng thái.
// =============================================================

export const img = (id: string, w = 300) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

// ---- Tuỳ chọn bộ lọc tìm việc (theo PDF) --------------------
export const REC_AREAS = [
  "Quận 1, TP.HCM",
  "Quận 7, TP.HCM",
  "TP. Thủ Đức, TP.HCM",
  "Bình Thạnh, TP.HCM",
  "Cầu Giấy, Hà Nội",
  "Hải Châu, Đà Nẵng",
] as const;

export const WORK_TYPES = ["Toàn thời gian", "Bán thời gian", "Cộng tác viên", "Linh hoạt"] as const;
export type WorkType = (typeof WORK_TYPES)[number];

export const SALARY_RANGES = [
  "Dưới 10 triệu",
  "10 - 20 triệu",
  "20 - 40 triệu",
  "Thoả thuận + hoa hồng",
] as const;
export type SalaryRange = (typeof SALARY_RANGES)[number];

export const COMPANY_TYPES = ["Sàn giao dịch", "Chủ đầu tư", "Công ty BĐS", "Đơn vị phân phối"] as const;
export type CompanyType = (typeof COMPANY_TYPES)[number];

export const PROPERTY_FOCUS = ["Căn hộ", "Nhà phố", "Đất nền", "BĐS nghỉ dưỡng", "Văn phòng"] as const;
export type PropertyFocus = (typeof PROPERTY_FOCUS)[number];

// ---- Tin tuyển dụng -----------------------------------------
export interface JobPosting {
  id: string;
  title: string;
  company: { name: string; logo: string; verified: boolean; type: CompanyType };
  position: string;
  openings: number; // số lượng tuyển
  area: string;
  workType: WorkType;
  salary: string; // hiển thị
  salaryRange: SalaryRange; // để lọc
  commission: number; // % hoa hồng tối đa
  focus: PropertyFocus;
  expYears: string; // "Không yêu cầu" / "1+ năm"...
  deadline: string;
  views: number;
  applicants: number;
  hot?: boolean;
  // Nội dung chi tiết bài đăng
  description?: string;
  requirement?: string;
  benefit?: string;
  contact?: string;
  postedAt?: string;
}

export const JOBS: JobPosting[] = [
  { id: "j1", title: "Chuyên viên môi giới căn hộ cao cấp khu Nam", company: { name: "Sàn Đất Vàng", logo: img("photo-1560179707-f14e90ef3623"), verified: true, type: "Sàn giao dịch" }, position: "Chuyên viên môi giới", openings: 10, area: "Quận 7, TP.HCM", workType: "Toàn thời gian", salary: "12 - 20 triệu + HH", salaryRange: "10 - 20 triệu", commission: 65, focus: "Căn hộ", expYears: "Không yêu cầu", deadline: "2026-07-31", views: 1240, applicants: 38, hot: true,
    description: "Tư vấn, giới thiệu và chốt giao dịch các sản phẩm căn hộ trung — cao cấp khu Nam. Chăm sóc tệp khách hàng được sàn cung cấp và tự phát triển kênh khách riêng.",
    requirement: "Giao tiếp tốt, đam mê kinh doanh BĐS. Ưu tiên ứng viên có chứng chỉ hành nghề và kinh nghiệm mảng căn hộ.",
    benefit: "Hoa hồng tới 65%, thưởng nóng theo quý, BHXH đầy đủ, hỗ trợ marketing & data khách hàng, đào tạo chứng chỉ miễn phí.",
    contact: "hr@sandatvang.vn · 0901 234 567", postedAt: "2026-07-01" },
  { id: "j2", title: "Trưởng nhóm kinh doanh dự án Emerald Bay", company: { name: "Chủ đầu tư SunLand", logo: img("photo-1486406146926-c627a92ad1ab"), verified: true, type: "Chủ đầu tư" }, position: "Trưởng nhóm kinh doanh", openings: 3, area: "TP. Thủ Đức, TP.HCM", workType: "Toàn thời gian", salary: "25 - 40 triệu + HH", salaryRange: "20 - 40 triệu", commission: 55, focus: "Căn hộ", expYears: "3+ năm", deadline: "2026-07-25", views: 860, applicants: 21,
    description: "Xây dựng, huấn luyện và dẫn dắt đội ngũ kinh doanh cho dự án căn hộ Emerald Bay; chịu trách nhiệm chỉ tiêu doanh số của nhóm.",
    requirement: "Tối thiểu 3 năm kinh nghiệm quản lý đội nhóm BĐS, có chứng chỉ hành nghề, kỹ năng lãnh đạo & đào tạo tốt.",
    benefit: "Lương cứng cạnh tranh + hoa hồng quản lý, thưởng vượt chỉ tiêu, du lịch nước ngoài, lộ trình lên quản lý vùng.",
    contact: "tuyendung@sunland.vn", postedAt: "2026-06-28" },
  { id: "j3", title: "Cộng tác viên môi giới đất nền vùng ven", company: { name: "Sàn Phú Gia", logo: img("photo-1497366811353-6870744d04b2"), verified: true, type: "Sàn giao dịch" }, position: "Cộng tác viên", openings: 30, area: "TP. Thủ Đức, TP.HCM", workType: "Cộng tác viên", salary: "Thu nhập theo hoa hồng", salaryRange: "Thoả thuận + hoa hồng", commission: 70, focus: "Đất nền", expYears: "Không yêu cầu", deadline: "2026-08-15", views: 2100, applicants: 96, hot: true,
    description: "Giới thiệu sản phẩm đất nền vùng ven tới khách hàng đầu tư; linh hoạt thời gian, phù hợp làm thêm hoặc chuyển hướng sang BĐS.",
    requirement: "Chủ động, ham học hỏi, không yêu cầu kinh nghiệm. Ưu tiên có sẵn mối quan hệ khách hàng đầu tư.",
    benefit: "Hoa hồng tới 70% — cao nhất thị trường, được cấp nguồn hàng & đào tạo miễn phí, không áp KPI cứng.",
    contact: "ctv@phugia.vn · 0938 111 222", postedAt: "2026-07-04" },
  { id: "j4", title: "Chuyên viên tư vấn BĐS nghỉ dưỡng Đà Nẵng", company: { name: "Công ty CoastalHomes", logo: img("photo-1552664730-d307ca884978"), verified: false, type: "Công ty BĐS" }, position: "Chuyên viên tư vấn", openings: 8, area: "Hải Châu, Đà Nẵng", workType: "Toàn thời gian", salary: "10 - 18 triệu + HH", salaryRange: "10 - 20 triệu", commission: 60, focus: "BĐS nghỉ dưỡng", expYears: "1+ năm", deadline: "2026-08-05", views: 540, applicants: 12,
    description: "Tư vấn các sản phẩm BĐS nghỉ dưỡng ven biển Đà Nẵng cho khách hàng trong và ngoài nước.",
    requirement: "Tối thiểu 1 năm kinh nghiệm BĐS, ngoại hình khá, giao tiếp tiếng Anh cơ bản là lợi thế.",
    benefit: "Lương cứng + hoa hồng 60%, hỗ trợ chỗ ở, thưởng dự án, môi trường trẻ trung.",
    contact: "hr@coastalhomes.vn", postedAt: "2026-07-02" },
  { id: "j5", title: "Nhân viên kinh doanh nhà phố trung tâm", company: { name: "Sàn Metro", logo: img("photo-1554469384-e58fac16e23a"), verified: true, type: "Sàn giao dịch" }, position: "Nhân viên kinh doanh", openings: 6, area: "Quận 1, TP.HCM", workType: "Linh hoạt", salary: "8 - 15 triệu + HH", salaryRange: "Dưới 10 triệu", commission: 50, focus: "Nhà phố", expYears: "Không yêu cầu", deadline: "2026-07-20", views: 720, applicants: 27,
    description: "Kinh doanh sản phẩm nhà phố khu trung tâm Quận 1, Bình Thạnh; thời gian làm việc linh hoạt.",
    requirement: "Nhiệt huyết, chăm chỉ, không yêu cầu kinh nghiệm — được đào tạo từ đầu.",
    benefit: "Lương cứng + hoa hồng 50%, đào tạo bài bản, lộ trình thăng tiến rõ ràng.",
    contact: "tuyendung@metro.vn · 0977 333 444", postedAt: "2026-06-25" },
  { id: "j6", title: "Chuyên viên phân phối dự án văn phòng Hà Nội", company: { name: "GreenHub Distribution", logo: img("photo-1507679799987-c73779587ccf"), verified: true, type: "Đơn vị phân phối" }, position: "Chuyên viên phân phối", openings: 5, area: "Cầu Giấy, Hà Nội", workType: "Bán thời gian", salary: "10 - 16 triệu + HH", salaryRange: "10 - 20 triệu", commission: 45, focus: "Văn phòng", expYears: "1+ năm", deadline: "2026-08-10", views: 430, applicants: 9,
    description: "Phân phối các sản phẩm văn phòng cho thuê & bán tại khu vực Cầu Giấy, Hà Nội.",
    requirement: "Có 1 năm kinh nghiệm mảng cho thuê văn phòng/BĐS thương mại, kỹ năng đàm phán tốt.",
    benefit: "Hoa hồng 45%, hỗ trợ nguồn hàng độc quyền, thời gian bán thời gian linh hoạt.",
    contact: "hr@greenhub.vn", postedAt: "2026-07-05" },
];

// ---- Hồ sơ nghề nghiệp của ứng viên (CV trực tuyến) ---------
export interface CvExperience {
  role: string;
  org: string;
  period: string;
  desc: string;
  highlights: string[];
}
export interface CvEducation {
  school: string;
  major: string;
  period: string;
}
export interface CvCertificate {
  name: string;
  issuer: string;
  year: string;
}
export interface CvAward {
  title: string;
  detail: string;
  year: string;
}
export interface CvSkill {
  name: string;
  level: number; // 0-100
}
export interface CvLanguage {
  name: string;
  level: string;
}

export const CANDIDATE_CV = {
  name: "Võ Hoàng Tuấn",
  avatar: img("photo-1560250097-0b93528c311a", 200),
  headline: "Chuyên viên môi giới căn hộ & nhà phố khu Nam TP.HCM",
  area: "Quận 7, TP.HCM",
  phone: "0912 345 678",
  email: "vohoangtuan.broker@gmail.com",
  years: 4,
  tier: "Bạc III",
  points: 18_250,
  certified: true, // chứng chỉ hành nghề
  verified: true, // chứng nhận đã xác minh
  bio: "Chuyên viên môi giới 4 năm kinh nghiệm mảng căn hộ & nhà phố khu Nam TP.HCM. Thế mạnh tư vấn tài chính, đàm phán giá và chăm sóc khách hàng dài hạn. Đã chốt hơn 80 giao dịch với tỷ lệ khách quay lại cao.",
  specialties: ["Căn hộ", "Nhà phố"],
  projects: ["Vinhomes Central Park", "The Origami", "Sunrise City"],
  completeness: 85, // % hoàn thiện hồ sơ

  // Thành tích & năng lực
  deals: 87, // giao dịch thành công
  gmv: "420 tỷ", // tổng giá trị giao dịch đã chốt
  rating: 4.9,
  reviews: 63,
  responseRate: 98, // % phản hồi khách hàng

  // Mong muốn công việc
  expectedSalary: "20 - 30 triệu + hoa hồng",
  availability: "Có thể bắt đầu ngay",
  desiredWorkTypes: ["Toàn thời gian", "Linh hoạt"] as string[],
  desiredAreas: ["Quận 7, TP.HCM", "TP. Thủ Đức, TP.HCM"] as string[],

  languages: [
    { name: "Tiếng Việt", level: "Bản ngữ" },
    { name: "Tiếng Anh", level: "Giao tiếp tốt" },
  ] as CvLanguage[],

  skills: [
    { name: "Tư vấn & chốt giao dịch", level: 95 },
    { name: "Đàm phán giá", level: 90 },
    { name: "Chăm sóc khách hàng", level: 92 },
    { name: "Livestream bán hàng", level: 80 },
    { name: "Marketing BĐS", level: 78 },
    { name: "Phân tích pháp lý", level: 72 },
  ] as CvSkill[],

  experiences: [
    {
      role: "Chuyên viên môi giới cấp cao",
      org: "Sàn Đất Vàng",
      period: "2024 — nay",
      desc: "Phụ trách phân khúc căn hộ cao cấp khu Nam, dẫn dắt nhóm 4 cộng tác viên.",
      highlights: [
        "Chốt 42 giao dịch trong năm 2025, đạt 130% chỉ tiêu",
        "Xây kênh khách hàng đầu tư dài hạn, tỷ lệ quay lại 35%",
      ],
    },
    {
      role: "Chuyên viên môi giới",
      org: "Sàn Metro",
      period: "2022 — 2024",
      desc: "Tư vấn nhà phố & căn hộ khu trung tâm Quận 1, Bình Thạnh.",
      highlights: [
        "Top 5 nhân viên xuất sắc 2023",
        "Trung bình 3 giao dịch/tháng",
      ],
    },
    {
      role: "Cộng tác viên kinh doanh",
      org: "SunLand",
      period: "2021 — 2022",
      desc: "Bắt đầu sự nghiệp môi giới với dự án Emerald Bay.",
      highlights: ["Hoàn thành đào tạo nghề & thi chứng chỉ hành nghề"],
    },
  ] as CvExperience[],

  education: [
    { school: "Đại học Kinh tế TP.HCM (UEH)", major: "Quản trị kinh doanh", period: "2016 — 2020" },
  ] as CvEducation[],

  certificates: [
    { name: "Chứng chỉ hành nghề môi giới BĐS", issuer: "Sở Xây dựng TP.HCM", year: "2021" },
    { name: "Chứng nhận định giá BĐS cơ bản", issuer: "Hiệp hội BĐS Việt Nam", year: "2023" },
  ] as CvCertificate[],

  awards: [
    { title: "Môi giới tiêu biểu Quý II/2025", detail: "Sàn Đất Vàng", year: "2025" },
    { title: "Top 5 doanh số 2023", detail: "Sàn Metro", year: "2023" },
  ] as CvAward[],
};

// ---- Đơn ứng tuyển của tôi (phía môi giới) ------------------
export type ApplicationStatus =
  | "Hồ sơ mới"
  | "Đã xem"
  | "Đang liên hệ"
  | "Mời phỏng vấn"
  | "Đã phỏng vấn"
  | "Chờ kết quả"
  | "Đã tuyển"
  | "Không phù hợp";

export interface MyApplication {
  id: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: ApplicationStatus;
  interview?: { date: string; time: string }; // khi status = Mời phỏng vấn
}

export const MY_APPLICATIONS: MyApplication[] = [
  { id: "a1", jobTitle: "Chuyên viên môi giới căn hộ cao cấp khu Nam", company: "Sàn Đất Vàng", appliedAt: "2026-07-03", status: "Mời phỏng vấn", interview: { date: "2026-07-09", time: "09:30" } },
  { id: "a2", jobTitle: "Trưởng nhóm kinh doanh dự án Emerald Bay", company: "Chủ đầu tư SunLand", appliedAt: "2026-07-01", status: "Đang liên hệ" },
  { id: "a3", jobTitle: "Nhân viên kinh doanh nhà phố trung tâm", company: "Sàn Metro", appliedAt: "2026-06-27", status: "Đã xem" },
];

// ---- Phía nhà tuyển dụng ------------------------------------
// Nhà tuyển dụng = Sàn giao dịch + Ngân hàng (+ Chủ đầu tư ở giai đoạn sau).
// Các role này DÙNG CHUNG một giao diện; nội dung cá nhân hoá theo role.
export type EmployerRole = "exchange" | "bank";

/** Lời hero theo role nhà tuyển dụng */
export const EMPLOYER_HERO: Record<EmployerRole, { title: string; desc: string }> = {
  exchange: {
    title: "Tuyển đúng người, xây đội ngũ môi giới mạnh",
    desc: "Đăng tin, sàng lọc ứng viên theo Tier & chứng chỉ hành nghề, quản lý phỏng vấn — tất cả trên một nền tảng.",
  },
  bank: {
    title: "Tuyển môi giới phân phối tài sản thanh lý",
    desc: "Đăng tin tiếp cận cộng đồng môi giới đã xác thực để đẩy nhanh chuyển nhượng tài sản bảo đảm, tài sản phát mãi.",
  },
};

/** Báo cáo & thống kê (theo PDF) */
export const RECRUIT_STATS = [
  { icon: "Eye", value: "5.890", label: "Lượt xem tin" },
  { icon: "FileText", value: "203", label: "Lượt ứng tuyển" },
  { icon: "UserCheck", value: "64", label: "Ứng viên đạt yêu cầu" },
  { icon: "CalendarDays", value: "18", label: "Buổi phỏng vấn" },
  { icon: "Trophy", value: "9", label: "Tuyển thành công" },
] as const;

/** Hồ sơ doanh nghiệp (trang riêng của nhà tuyển dụng) — theo role */
export interface EmployerProfile {
  name: string;
  logo: string;
  verified: boolean;
  type: string;
  intro: string;
  size: string;
  areas: string[];
  projectsLabel: string;
  projects: string[];
  commissionPolicy: string;
  trainingPolicy: string;
  benefits: string[];
  office: string[];
}

export const EMPLOYER_PROFILES: Record<EmployerRole, EmployerProfile> = {
  exchange: {
    name: "Sàn Đất Vàng",
    logo: img("photo-1560179707-f14e90ef3623", 200),
    verified: true,
    type: "Sàn giao dịch",
    intro:
      "Sàn phân phối BĐS khu Nam TP.HCM với 8 năm hoạt động, tập trung căn hộ trung — cao cấp và nhà phố.",
    size: "120+ nhân sự",
    areas: ["Quận 7", "TP. Thủ Đức", "Bình Thạnh"],
    projectsLabel: "Dự án đang triển khai",
    projects: ["Emerald Bay", "The Origami", "Sunrise Riverside"],
    commissionPolicy: "Hoa hồng tới 65%, thưởng nóng theo quý",
    trainingPolicy: "Đào tạo chứng chỉ hành nghề miễn phí cho nhân sự mới",
    benefits: ["BHXH đầy đủ", "Marketing hỗ trợ", "Data khách hàng", "Du lịch năm 2 lần"],
    office: [img("photo-1497366216548-37526070297c", 500), img("photo-1524758631624-e2822e304c36", 500)],
  },
  bank: {
    name: "Ngân hàng VietHome",
    logo: img("photo-1601597111158-2fceff292cdc", 200),
    verified: true,
    type: "Ngân hàng",
    intro:
      "Khối xử lý tài sản của VietHome hợp tác cùng cộng đồng môi giới để chuyển nhượng nhanh tài sản bảo đảm, tài sản thanh lý.",
    size: "Danh mục 200+ tài sản",
    areas: ["Toàn quốc"],
    projectsLabel: "Danh mục tài sản",
    projects: ["Căn hộ thanh lý", "Nhà phố phát mãi", "Kho xưởng KCN", "Đất nền dự án"],
    commissionPolicy: "Phí môi giới hấp dẫn theo giá trị tài sản chuyển nhượng",
    trainingPolicy: "Hỗ trợ hồ sơ pháp lý & định giá minh bạch cho từng tài sản",
    benefits: ["Nguồn hàng pháp lý rõ ràng", "Thanh toán nhanh", "Ưu tiên tài khoản đã xác thực"],
    office: [img("photo-1554224155-6726b3ff858f", 500), img("photo-1486406146926-c627a92ad1ab", 500)],
  },
};

/** Tin tuyển dụng tôi đã đăng */
export type PostingStatus = "Đang hiển thị" | "Chờ kiểm duyệt" | "Hết hạn";

export interface MyPosting {
  id: string;
  title: string;
  status: PostingStatus;
  views: number;
  applicants: number;
  deadline: string;
  // Nội dung chi tiết của tin (để nhà tuyển dụng xem lại bài đã đăng)
  position?: string;
  openings?: number;
  area?: string;
  workType?: string;
  salary?: string;
  commission?: number;
  description?: string;
  requirement?: string;
  benefit?: string;
  contact?: string;
  postedAt?: string;
}

export const MY_POSTINGS: Record<EmployerRole, MyPosting[]> = {
  exchange: [
    {
      id: "p1", title: "Chuyên viên môi giới căn hộ cao cấp khu Nam", status: "Đang hiển thị", views: 1240, applicants: 38, deadline: "2026-07-31",
      position: "Chuyên viên môi giới", openings: 10, area: "Quận 7, TP.HCM", workType: "Toàn thời gian", salary: "12 - 20 triệu + hoa hồng", commission: 65,
      description: "Tư vấn, giới thiệu và chốt giao dịch các sản phẩm căn hộ trung — cao cấp khu Nam; chăm sóc tệp khách hàng được sàn cung cấp và tự phát triển.",
      requirement: "Giao tiếp tốt, đam mê kinh doanh BĐS. Ưu tiên ứng viên có chứng chỉ hành nghề và kinh nghiệm mảng căn hộ.",
      benefit: "Hoa hồng tới 65%, thưởng nóng theo quý, BHXH đầy đủ, hỗ trợ marketing & data khách hàng, đào tạo chứng chỉ miễn phí.",
      contact: "hr@sandatvang.vn · 0901 234 567", postedAt: "2026-07-01",
    },
    {
      id: "p2", title: "Thực tập sinh kinh doanh BĐS", status: "Chờ kiểm duyệt", views: 0, applicants: 0, deadline: "2026-08-20",
      position: "Thực tập sinh", openings: 5, area: "TP. Thủ Đức, TP.HCM", workType: "Bán thời gian", salary: "5 - 8 triệu + hoa hồng", commission: 40,
      description: "Hỗ trợ đội kinh doanh tìm kiếm khách hàng, chuẩn bị hồ sơ sản phẩm và tham gia các buổi xem nhà.",
      requirement: "Sinh viên năm cuối hoặc mới ra trường, chăm chỉ, ham học hỏi. Không yêu cầu kinh nghiệm.",
      benefit: "Được đào tạo bài bản, lộ trình lên nhân viên chính thức, hỗ trợ ôn & thi chứng chỉ hành nghề.",
      contact: "hr@sandatvang.vn", postedAt: "2026-07-06",
    },
    {
      id: "p3", title: "Trưởng phòng kinh doanh khu Đông", status: "Hết hạn", views: 980, applicants: 17, deadline: "2026-06-15",
      position: "Trưởng phòng kinh doanh", openings: 2, area: "TP. Thủ Đức, TP.HCM", workType: "Toàn thời gian", salary: "25 - 40 triệu + hoa hồng", commission: 55,
      description: "Xây dựng, huấn luyện và dẫn dắt đội ngũ môi giới khu Đông; chịu trách nhiệm chỉ tiêu doanh số phòng.",
      requirement: "Tối thiểu 3 năm kinh nghiệm quản lý đội nhóm BĐS, có chứng chỉ hành nghề, kỹ năng lãnh đạo tốt.",
      benefit: "Lương cứng cạnh tranh + hoa hồng quản lý, thưởng vượt chỉ tiêu, du lịch nước ngoài hàng năm.",
      contact: "hr@sandatvang.vn · 0901 234 567", postedAt: "2026-05-20",
    },
  ],
  bank: [
    {
      id: "pb1", title: "Môi giới phân phối căn hộ thanh lý khu Nam", status: "Đang hiển thị", views: 1560, applicants: 44, deadline: "2026-08-05",
      position: "Môi giới phân phối", openings: 15, area: "Toàn TP.HCM", workType: "Linh hoạt", salary: "Thu nhập theo hoa hồng", commission: 40,
      description: "Tiếp nhận danh mục căn hộ thanh lý của ngân hàng, giới thiệu tới khách hàng có nhu cầu và hỗ trợ hoàn tất chuyển nhượng.",
      requirement: "Có tệp khách hàng đầu tư, am hiểu pháp lý tài sản bảo đảm là một lợi thế. Ưu tiên tài khoản đã xác thực.",
      benefit: "Nguồn hàng pháp lý rõ ràng, hỗ trợ hồ sơ & định giá minh bạch, thanh toán hoa hồng nhanh.",
      contact: "taisan@viethome.vn · 1900 6060", postedAt: "2026-07-02",
    },
    {
      id: "pb2", title: "Cộng tác viên chuyển nhượng tài sản phát mãi", status: "Đang hiển thị", views: 890, applicants: 26, deadline: "2026-08-12",
      position: "Cộng tác viên", openings: 30, area: "Toàn quốc", workType: "Cộng tác viên", salary: "Hoa hồng hấp dẫn theo giá trị tài sản", commission: 45,
      description: "Giới thiệu các tài sản phát mãi (nhà phố, đất, kho xưởng) đến nhà đầu tư; kết nối và đẩy nhanh quá trình chuyển nhượng.",
      requirement: "Chủ động, có mạng lưới khách hàng đầu tư. Không yêu cầu kinh nghiệm ngân hàng.",
      benefit: "Hoa hồng cao theo giá trị tài sản, được cấp thông tin tài sản đầy đủ & pháp lý minh bạch.",
      contact: "taisan@viethome.vn", postedAt: "2026-07-03",
    },
    {
      id: "pb3", title: "Chuyên viên kinh doanh kho xưởng KCN", status: "Chờ kiểm duyệt", views: 0, applicants: 0, deadline: "2026-08-25",
      position: "Chuyên viên kinh doanh", openings: 4, area: "TP. Thủ Đức, TP.HCM", workType: "Toàn thời gian", salary: "15 - 25 triệu + hoa hồng", commission: 35,
      description: "Phụ trách mảng kho xưởng, mặt bằng công nghiệp trong danh mục tài sản của ngân hàng.",
      requirement: "Có kinh nghiệm mảng BĐS công nghiệp/kho xưởng, kỹ năng đàm phán tốt.",
      benefit: "Lương cứng + hoa hồng, nguồn hàng độc quyền từ ngân hàng, hỗ trợ pháp lý.",
      contact: "taisan@viethome.vn", postedAt: "2026-07-06",
    },
  ],
};

/** Pipeline ứng viên (7 trạng thái theo PDF) */
export const PIPELINE_STATUSES: ApplicationStatus[] = [
  "Hồ sơ mới",
  "Đã xem",
  "Đang liên hệ",
  "Đã phỏng vấn",
  "Chờ kết quả",
  "Đã tuyển",
  "Không phù hợp",
];

export interface Applicant {
  id: string;
  name: string;
  avatar: string;
  tier: string;
  points: number;
  certified: boolean; // chứng chỉ hành nghề
  verified: boolean; // chứng nhận đã xác minh
  years: number;
  area: string;
  appliedFor: string;
  status: ApplicationStatus;
  // Hồ sơ chi tiết (CV trực tuyến) cho nhà tuyển dụng xem
  phone: string;
  email: string;
  deals: number; // giao dịch đã hoàn thành
  rating: number; // đánh giá trung bình
  specialties: string[];
  projects: string[];
  appliedAt: string;
  intro: string;
  coverLetter?: string; // lời giới thiệu khi ứng tuyển
}

// Hồ sơ nền của ứng viên (không gắn với 1 tin cụ thể).
type CandidateProfile = Omit<Applicant, "appliedFor" | "status">;

const PROFILES: Record<string, CandidateProfile> = {
  quan: { id: "c1", name: "Trần Minh Quân", avatar: img("photo-1560250097-0b93528c311a", 400), tier: "Vàng I", points: 42_300, certified: true, verified: true, years: 8, area: "Quận 7, TP.HCM", phone: "0901 234 567", email: "quan.tran@qbroker.vn", deals: 86, rating: 4.9, specialties: ["Căn hộ", "Nhà phố"], projects: ["Vinhomes Central Park", "The Origami", "Sunrise City"], appliedAt: "2026-07-03", intro: "8 năm chuyên căn hộ khu Nam, thế mạnh chốt deal nhanh và chăm sóc khách VIP.", coverLetter: "Tôi mong muốn tham gia đội ngũ để phát triển mảng căn hộ cao cấp, sẵn sàng nhận chỉ tiêu doanh số ngay từ tháng đầu." },
  nhung: { id: "c2", name: "Lê Thị Hồng Nhung", avatar: img("photo-1573496359142-b8d87734a5a2", 400), tier: "Bạc III", points: 19_800, certified: true, verified: true, years: 6, area: "TP. Thủ Đức, TP.HCM", phone: "0912 345 678", email: "nhung.le@qbroker.vn", deals: 64, rating: 4.8, specialties: ["Căn hộ", "Biệt thự"], projects: ["Masteri Thảo Điền", "The Origami"], appliedAt: "2026-07-02", intro: "Tư vấn tận tâm, đồng hành khách từ xem nhà đến công chứng, minh bạch từng bước.", coverLetter: "Tôi có tệp khách hàng khu Đông sẵn có và kinh nghiệm xử lý hồ sơ vay, phù hợp với quỹ căn của quý sàn." },
  bao: { id: "c3", name: "Vũ Quốc Bảo", avatar: img("photo-1633332755192-727a05c4013d", 400), tier: "Đồng III", points: 3_400, certified: false, verified: false, years: 1, area: "Bình Thạnh, TP.HCM", phone: "0977 888 999", email: "bao.vu@qbroker.vn", deals: 5, rating: 4.5, specialties: ["Căn hộ"], projects: ["Sunrise Riverside"], appliedAt: "2026-07-01", intro: "Thế hệ môi giới mới, thành thạo công cụ số, tour 3D và làm nội dung mạng xã hội.", coverLetter: "Tôi mong được học hỏi và cống hiến, sẵn sàng thử thách chỉ tiêu và hoàn thiện chứng chỉ hành nghề." },
  vy: { id: "c4", name: "Nguyễn Thảo Vy", avatar: img("photo-1573497019940-1c28c88b4f3e", 400), tier: "Bạc II", points: 12_100, certified: true, verified: true, years: 4, area: "Quận 7, TP.HCM", phone: "0966 111 222", email: "vy.nguyen@qbroker.vn", deals: 41, rating: 4.9, specialties: ["Căn hộ"], projects: ["Phú Mỹ Hưng", "Eco Green"], appliedAt: "2026-06-30", intro: "Phản hồi nhanh nhất khu vực, hỗ trợ khách cả ngoài giờ, tỷ lệ hài lòng cao.", coverLetter: "Tôi tự tin với mảng căn hộ khu Nam và cam kết tốc độ phản hồi khách trong 15 phút." },
  maianh: { id: "c5", name: "Bùi Mai Anh", avatar: img("photo-1544005313-94ddf0286df2", 400), tier: "Vàng II", points: 71_500, certified: true, verified: true, years: 9, area: "Hải Châu, Đà Nẵng", phone: "0905 222 333", email: "maianh.bui@qbroker.vn", deals: 95, rating: 4.8, specialties: ["Biệt thự", "BĐS nghỉ dưỡng"], projects: ["FLC Sầm Sơn", "Cocobay Đà Nẵng"], appliedAt: "2026-06-28", intro: "9 năm dẫn dắt đội nhóm BĐS nghỉ dưỡng miền Trung, từng quản lý team 20 người.", coverLetter: "Tôi có năng lực xây dựng và huấn luyện đội ngũ, mong đảm nhận vị trí quản lý để mở rộng thị trường miền Trung." },
};

/** Gắn hồ sơ vào 1 tin cụ thể (đặt vị trí ứng tuyển + trạng thái). */
const mk = (p: CandidateProfile, appliedFor: string, status: ApplicationStatus): Applicant => ({
  ...p,
  appliedFor,
  status,
});

/**
 * Danh sách ứng viên THEO TỪNG TIN tuyển dụng (key = id của MyPosting).
 * Tin "Chờ kiểm duyệt" chưa hiển thị công khai nên chưa có ứng viên.
 */
export const APPLICANTS_BY_POSTING: Record<string, Applicant[]> = {
  // --- Sàn giao dịch ---
  p1: [
    mk(PROFILES.quan, "Chuyên viên môi giới căn hộ cao cấp khu Nam", "Hồ sơ mới"),
    mk(PROFILES.vy, "Chuyên viên môi giới căn hộ cao cấp khu Nam", "Đã phỏng vấn"),
    mk(PROFILES.nhung, "Chuyên viên môi giới căn hộ cao cấp khu Nam", "Đang liên hệ"),
    mk(PROFILES.bao, "Chuyên viên môi giới căn hộ cao cấp khu Nam", "Đã xem"),
  ],
  p2: [],
  p3: [mk(PROFILES.maianh, "Trưởng phòng kinh doanh khu Đông", "Chờ kết quả")],
  // --- Ngân hàng ---
  pb1: [
    mk(PROFILES.quan, "Môi giới phân phối căn hộ thanh lý khu Nam", "Hồ sơ mới"),
    mk(PROFILES.maianh, "Môi giới phân phối căn hộ thanh lý khu Nam", "Đang liên hệ"),
    mk(PROFILES.nhung, "Môi giới phân phối căn hộ thanh lý khu Nam", "Đã xem"),
  ],
  pb2: [
    mk(PROFILES.vy, "Cộng tác viên chuyển nhượng tài sản phát mãi", "Hồ sơ mới"),
    mk(PROFILES.bao, "Cộng tác viên chuyển nhượng tài sản phát mãi", "Đã phỏng vấn"),
  ],
  pb3: [],
};
