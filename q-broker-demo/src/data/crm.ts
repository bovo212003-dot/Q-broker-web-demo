// =============================================================
// DỮ LIỆU MẪU: CRM KHÁCH HÀNG của môi giới (/realtor/khach-hang)
// Tham khảo CRM bất động sản thực tế (Follow Up Boss, kvCORE,
// HubSpot, Zillow Premier Agent): pipeline theo giai đoạn, chấm
// điểm khách (nóng/ấm/lạnh), việc cần làm hôm nay, hồ sơ + lịch sử
// tương tác. Dữ liệu mock, thiết kế để thay bằng API sau.
// =============================================================

export type CrmStage = "moi" | "lien-he" | "xem-nha" | "dam-phan" | "chot" | "mat";
export type LeadScore = "hot" | "warm" | "cold";
export type Demand = "mua" | "thue" | "ban";

/** Một mốc trong lịch sử tương tác với khách */
export interface CrmActivity {
  time: string;
  text: string;
  icon: string;
}

export interface CrmCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  color: string; // màu nền avatar chữ cái
  source: string; // nguồn khách
  sourceIcon: string;
  demand: Demand;
  property: string; // BĐS khách quan tâm
  district: string;
  budget: number; // đồng — giá giao dịch (mua/bán) hoặc tiền thuê/tháng
  budgetUnit: "total" | "month"; // total = trọn giao dịch, month = /tháng
  stage: CrmStage;
  score: LeadScore;
  lastContact: string; // "2 giờ trước"
  nextAction: string; // việc tiếp theo cần làm
  nextDate: string; // "Hôm nay, 15:00" ...
  today: boolean; // có việc cần làm hôm nay
  note: string;
  timeline: CrmActivity[];
}

/** Cấu hình các cột pipeline (theo thứ tự trái -> phải) */
export const CRM_STAGES: {
  id: CrmStage;
  label: string;
  dot: string; // màu chấm tiêu đề cột
  chip: string; // màu badge trạng thái
}[] = [
  { id: "moi", label: "Khách mới", dot: "bg-sky-500", chip: "bg-sky-50 text-sky-600" },
  { id: "lien-he", label: "Đang liên hệ", dot: "bg-violet-500", chip: "bg-violet-50 text-violet-600" },
  { id: "xem-nha", label: "Hẹn xem nhà", dot: "bg-amber-500", chip: "bg-amber-50 text-amber-600" },
  { id: "dam-phan", label: "Đàm phán", dot: "bg-orange-500", chip: "bg-orange-50 text-orange-600" },
  { id: "chot", label: "Đã chốt", dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-600" },
];

/** Nhãn cho trạng thái "Mất" (không hiện thành cột pipeline) */
export const STAGE_LOST = {
  id: "mat" as CrmStage,
  label: "Đã mất",
  chip: "bg-slate-100 text-slate-500",
};

export const SCORE_META: Record<
  LeadScore,
  { label: string; className: string; icon: string }
> = {
  hot: { label: "Nóng", className: "bg-rose-50 text-rose-600", icon: "Flame" },
  warm: { label: "Ấm", className: "bg-amber-50 text-amber-600", icon: "ThermometerSun" },
  cold: { label: "Lạnh", className: "bg-sky-50 text-sky-600", icon: "Snowflake" },
};

export const DEMAND_META: Record<Demand, { label: string; icon: string }> = {
  mua: { label: "Mua", icon: "Home" },
  thue: { label: "Thuê", icon: "KeyRound" },
  ban: { label: "Ký gửi bán", icon: "Tag" },
};

/** Nhãn ngân sách gọn: "3,2 tỷ" hoặc "30 tr/tháng" */
export function budgetLabel(c: CrmCustomer): string {
  if (c.budgetUnit === "month") {
    return `${(c.budget / 1_000_000).toLocaleString("vi-VN")} tr/tháng`;
  }
  if (c.budget >= 1_000_000_000) {
    const ty = c.budget / 1_000_000_000;
    return `${ty.toLocaleString("vi-VN", { maximumFractionDigits: 1 })} tỷ`;
  }
  return `${(c.budget / 1_000_000).toLocaleString("vi-VN")} tr`;
}

export const CRM_CUSTOMERS: CrmCustomer[] = [
  {
    id: "c1",
    name: "Nguyễn Thị Hà",
    phone: "0903 218 774",
    email: "ha.nguyen@gmail.com",
    color: "#2563eb",
    source: "Đối tác Affiliate",
    sourceIcon: "Share2",
    demand: "mua",
    property: "Căn hộ Vinhomes Grand Park",
    district: "TP. Thủ Đức",
    budget: 3_200_000_000,
    budgetUnit: "total",
    stage: "moi",
    score: "hot",
    lastContact: "2 giờ trước",
    nextAction: "Gọi tư vấn lần đầu, xác nhận nhu cầu",
    nextDate: "Hôm nay, 15:00",
    today: true,
    note: "Khách cần mua ở, dọn vào trước Q3. Đã có sổ tiết kiệm, vay thêm ~40%.",
    timeline: [
      { time: "Hôm nay, 09:12", text: "Để lại thông tin qua link đối tác QB-8823", icon: "UserPlus" },
      { time: "Hôm nay, 09:15", text: "Tự động gửi tin nhắn chào mừng qua Zalo", icon: "MessageCircle" },
    ],
  },
  {
    id: "c2",
    name: "Trần Minh Khoa",
    phone: "0987 305 112",
    email: "khoatran@gmail.com",
    color: "#059669",
    source: "Facebook Ads",
    sourceIcon: "Facebook",
    demand: "mua",
    property: "Nhà phố Gò Vấp",
    district: "Gò Vấp, TP.HCM",
    budget: 5_500_000_000,
    budgetUnit: "total",
    stage: "moi",
    score: "warm",
    lastContact: "Hôm qua",
    nextAction: "Nhắn Zalo gửi 3 căn phù hợp ngân sách",
    nextDate: "Hôm nay, 17:30",
    today: true,
    note: "Quan tâm nhà phố có sân để xe hơi, ưu tiên gần trường học.",
    timeline: [
      { time: "Hôm qua, 20:04", text: "Bấm quảng cáo Facebook, để lại SĐT", icon: "MousePointerClick" },
    ],
  },
  {
    id: "c3",
    name: "Lê Thu Vân",
    phone: "0912 774 908",
    email: "van.le@outlook.com",
    color: "#7c3aed",
    source: "Tự tìm qua hồ sơ",
    sourceIcon: "UserRound",
    demand: "thue",
    property: "Căn hộ Thảo Điền cho thuê",
    district: "TP. Thủ Đức",
    budget: 30_000_000,
    budgetUnit: "month",
    stage: "moi",
    score: "cold",
    lastContact: "2 ngày trước",
    nextAction: "Chờ khách phản hồi ngày dọn vào",
    nextDate: "Thứ 5 tuần này",
    today: false,
    note: "Khách nước ngoài, cần căn 2PN có nội thất, hợp đồng tối thiểu 1 năm.",
    timeline: [
      { time: "2 ngày trước", text: "Nhắn hỏi căn Thảo Điền qua trang hồ sơ", icon: "MessageCircle" },
    ],
  },
  {
    id: "c4",
    name: "Phạm Quỳnh Dung",
    phone: "0938 190 556",
    email: "dungpham@gmail.com",
    color: "#db2777",
    source: "Đối tác Affiliate",
    sourceIcon: "Share2",
    demand: "mua",
    property: "Căn hộ The Sailing Tower",
    district: "Quận 1, TP.HCM",
    budget: 2_600_000_000,
    budgetUnit: "total",
    stage: "lien-he",
    score: "hot",
    lastContact: "3 giờ trước",
    nextAction: "Gọi lại chốt lịch xem nhà cuối tuần",
    nextDate: "Hôm nay, 16:00",
    today: true,
    note: "Mua cho thuê lại, quan tâm dòng tiền và tỷ suất cho thuê khu trung tâm.",
    timeline: [
      { time: "Hôm qua", text: "Tư vấn qua điện thoại 12 phút", icon: "Phone" },
      { time: "3 giờ trước", text: "Gửi bảng tính dòng tiền cho thuê", icon: "FileText" },
    ],
  },
  {
    id: "c5",
    name: "Đỗ Văn Thành",
    phone: "0909 445 218",
    email: "thanhdo@gmail.com",
    color: "#0891b2",
    source: "Giới thiệu từ khách cũ",
    sourceIcon: "Users",
    demand: "mua",
    property: "Đất nền Long An",
    district: "Bến Lức, Long An",
    budget: 1_800_000_000,
    budgetUnit: "total",
    stage: "lien-he",
    score: "warm",
    lastContact: "Hôm qua",
    nextAction: "Gửi pháp lý lô đất khách hỏi",
    nextDate: "Ngày mai",
    today: false,
    note: "Đầu tư lướt sóng, cần lô pháp lý sạch, sang tên nhanh.",
    timeline: [
      { time: "3 ngày trước", text: "Khách cũ (anh Sơn) giới thiệu", icon: "Users" },
      { time: "Hôm qua", text: "Gọi tư vấn khu vực, khách quan tâm 2 lô", icon: "Phone" },
    ],
  },
  {
    id: "c6",
    name: "Vũ Hải Yến",
    phone: "0977 612 300",
    email: "yenvu@gmail.com",
    color: "#f97316",
    source: "Sàn giao dịch",
    sourceIcon: "Building2",
    demand: "ban",
    property: "Ký gửi bán nhà phố Bình Thạnh",
    district: "Bình Thạnh, TP.HCM",
    budget: 7_200_000_000,
    budgetUnit: "total",
    stage: "lien-he",
    score: "warm",
    lastContact: "4 giờ trước",
    nextAction: "Hẹn khảo sát, chụp ảnh đăng tin",
    nextDate: "Thứ 6 tuần này",
    today: false,
    note: "Chủ nhà cần bán trong 2 tháng, có thể thương lượng giá 3-5%.",
    timeline: [
      { time: "Hôm qua", text: "Sàn chuyển hồ sơ ký gửi", icon: "Building2" },
      { time: "4 giờ trước", text: "Gọi xác nhận thông tin nhà, giá kỳ vọng", icon: "Phone" },
    ],
  },
  {
    id: "c7",
    name: "Hoàng Anh Tuấn",
    phone: "0913 008 776",
    email: "tuanha@gmail.com",
    color: "#e11d48",
    source: "Đối tác Affiliate",
    sourceIcon: "Share2",
    demand: "mua",
    property: "Biệt thự Ecopark Aqua Bay",
    district: "Văn Giang, Hưng Yên",
    budget: 7_800_000_000,
    budgetUnit: "total",
    stage: "xem-nha",
    score: "hot",
    lastContact: "Hôm nay",
    nextAction: "Dẫn khách xem nhà thực tế",
    nextDate: "Hôm nay, 10:00",
    today: true,
    note: "Đã duyệt vay sơ bộ. Quan tâm suất đấu giá sắp tới của dự án.",
    timeline: [
      { time: "3 ngày trước", text: "Nhận khách từ đối tác QB-8823", icon: "Share2" },
      { time: "Hôm qua", text: "Tư vấn, chốt lịch xem nhà", icon: "CalendarCheck" },
    ],
  },
  {
    id: "c8",
    name: "Bùi Thị Lan",
    phone: "0966 214 559",
    email: "lanbui@gmail.com",
    color: "#9333ea",
    source: "Website Q-Broker",
    sourceIcon: "Globe",
    demand: "mua",
    property: "Căn hộ Masteri Thảo Điền",
    district: "TP. Thủ Đức",
    budget: 4_100_000_000,
    budgetUnit: "total",
    stage: "xem-nha",
    score: "warm",
    lastContact: "2 ngày trước",
    nextAction: "Nhắc lịch xem nhà, gửi định vị",
    nextDate: "Chủ nhật này",
    today: false,
    note: "Đã xem 1 căn, muốn xem thêm căn tầng cao view sông.",
    timeline: [
      { time: "1 tuần trước", text: "Đăng ký xem BĐS trên website", icon: "Globe" },
      { time: "2 ngày trước", text: "Xem căn tầng 12, chưa ưng view", icon: "Eye" },
    ],
  },
  {
    id: "c9",
    name: "Ngô Đức Mạnh",
    phone: "0908 771 023",
    email: "manhngo@gmail.com",
    color: "#0d9488",
    source: "Giới thiệu từ khách cũ",
    sourceIcon: "Users",
    demand: "mua",
    property: "Nhà phố The Sailing Residence",
    district: "Quận 1, TP.HCM",
    budget: 6_400_000_000,
    budgetUnit: "total",
    stage: "dam-phan",
    score: "hot",
    lastContact: "1 giờ trước",
    nextAction: "Chốt giá cuối với chủ nhà, chuẩn bị cọc",
    nextDate: "Hôm nay, 18:00",
    today: true,
    note: "Hai bên lệch 150 triệu. Khách sẵn sàng cọc nếu chủ giảm thêm.",
    timeline: [
      { time: "Tuần trước", text: "Xem nhà lần 2, rất ưng", icon: "Eye" },
      { time: "Hôm qua", text: "Đàm phán giá vòng 1", icon: "Handshake" },
      { time: "1 giờ trước", text: "Chủ nhà đồng ý xem lại giá", icon: "Phone" },
    ],
  },
  {
    id: "c10",
    name: "Đặng Phương Thảo",
    phone: "0934 556 187",
    email: "thaodang@gmail.com",
    color: "#c026d3",
    source: "Facebook Ads",
    sourceIcon: "Facebook",
    demand: "thue",
    property: "Nhà phố Thảo Điền cho thuê",
    district: "TP. Thủ Đức",
    budget: 38_000_000,
    budgetUnit: "month",
    stage: "dam-phan",
    score: "warm",
    lastContact: "Hôm qua",
    nextAction: "Thương lượng điều khoản hợp đồng thuê",
    nextDate: "Ngày mai",
    today: false,
    note: "Khách muốn thuê 2 năm, xin giảm 2 triệu/tháng và miễn phí 1 tháng đầu.",
    timeline: [
      { time: "4 ngày trước", text: "Bấm quảng cáo, để lại SĐT", icon: "MousePointerClick" },
      { time: "Hôm qua", text: "Xem nhà, thống nhất thuê", icon: "Eye" },
    ],
  },
  {
    id: "c11",
    name: "Trịnh Văn Hùng",
    phone: "0918 330 244",
    email: "hungtrinh@gmail.com",
    color: "#16a34a",
    source: "Sàn giao dịch",
    sourceIcon: "Building2",
    demand: "mua",
    property: "Căn hộ Vinhomes Central Park",
    district: "Bình Thạnh, TP.HCM",
    budget: 4_200_000_000,
    budgetUnit: "total",
    stage: "chot",
    score: "hot",
    lastContact: "Hôm qua",
    nextAction: "Hoàn tất công chứng, xuất hoá đơn hoa hồng",
    nextDate: "Đã hẹn thứ 3 tới",
    today: false,
    note: "Đã cọc 200 triệu. Chờ ngày công chứng sang tên.",
    timeline: [
      { time: "2 tuần trước", text: "Nhận khách từ sàn Ecopark", icon: "Building2" },
      { time: "Tuần trước", text: "Xem nhà, đàm phán giá", icon: "Handshake" },
      { time: "Hôm qua", text: "Ký cọc 200 triệu", icon: "BadgeCheck" },
    ],
  },
  {
    id: "c12",
    name: "Cao Thị Mai",
    phone: "0902 118 675",
    email: "maicao@gmail.com",
    color: "#64748b",
    source: "Website Q-Broker",
    sourceIcon: "Globe",
    demand: "mua",
    property: "Đất nền Nhơn Trạch",
    district: "Nhơn Trạch, Đồng Nai",
    budget: 1_500_000_000,
    budgetUnit: "total",
    stage: "mat",
    score: "cold",
    lastContact: "1 tuần trước",
    nextAction: "Khách đã mua nơi khác — lưu chăm sóc lại sau",
    nextDate: "—",
    today: false,
    note: "Khách chốt lô của môi giới khác do gần nhà người thân hơn.",
    timeline: [
      { time: "3 tuần trước", text: "Đăng ký tư vấn đất nền", icon: "Globe" },
      { time: "1 tuần trước", text: "Báo đã mua nơi khác", icon: "XCircle" },
    ],
  },
];
