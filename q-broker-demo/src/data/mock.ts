import {
  ExamResult,
  LoanApplication,
  Person,
  Property,
  Transaction,
} from "@/types";

// =============================================================
// MOCK DATA — Toàn bộ dữ liệu demo tập trung tại đây.
// Không có backend / database. Mỗi role import phần cần dùng.
// Muốn đổi dữ liệu hiển thị: sửa trực tiếp các mảng bên dưới.
// =============================================================

// ---- Bất động sản (giỏ hàng chung) --------------------------
export const PROPERTIES: Property[] = [
  {
    id: "p1",
    title: "Căn hộ Vinhomes Central Park 2PN",
    address: "208 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM",
    price: 4_200_000_000,
    area: 72,
    type: "Căn hộ",
    status: "Đang bán",
    verified: true,
    imageColor: "#93c5fd",
    exchangeName: "Sàn Đất Vàng",
  },
  {
    id: "p2",
    title: "Nhà phố Thảo Điền 1 trệt 3 lầu",
    address: "Đường 41, Thảo Điền, TP. Thủ Đức",
    price: 18_500_000_000,
    area: 120,
    type: "Nhà phố",
    status: "Đang bán",
    verified: true,
    imageColor: "#fca5a5",
    exchangeName: "Sàn Phú Gia",
  },
  {
    id: "p3",
    title: "Đất nền KDC Long Hậu 100m²",
    address: "Long Hậu, Cần Giuộc, Long An",
    price: 2_100_000_000,
    area: 100,
    type: "Đất nền",
    status: "Chờ duyệt",
    verified: false,
    imageColor: "#fcd34d",
    exchangeName: "Sàn Đất Vàng",
  },
  {
    id: "p4",
    title: "Biệt thự Palm Residence view sông",
    address: "Nguyễn Duy Trinh, TP. Thủ Đức",
    price: 32_000_000_000,
    area: 250,
    type: "Biệt thự",
    status: "Đang bán",
    verified: true,
    imageColor: "#86efac",
    exchangeName: "Sàn Phú Gia",
  },
  {
    id: "p5",
    title: "Văn phòng hạng B trung tâm Q.1",
    address: "Lê Lợi, Quận 1, TP.HCM",
    price: 9_800_000_000,
    area: 85,
    type: "Văn phòng",
    status: "Đã bán",
    verified: true,
    imageColor: "#c4b5fd",
    exchangeName: "Sàn Metro",
  },
  {
    id: "p6",
    title: "Căn hộ The Origami 3PN",
    address: "Vinhomes Grand Park, TP. Thủ Đức",
    price: 5_600_000_000,
    area: 88,
    type: "Căn hộ",
    status: "Đang bán",
    verified: true,
    imageColor: "#f9a8d4",
    exchangeName: "Sàn Metro",
  },
];

// ---- Con người (môi giới, khách hàng) -----------------------
export const PEOPLE: Person[] = [
  { id: "u1", name: "Trần Minh Quân", phone: "0901 234 567", role: "broker", avatarColor: "#059669" },
  { id: "u2", name: "Lê Thị Hồng", phone: "0912 345 678", role: "broker", avatarColor: "#0d9488" },
  { id: "u3", name: "Nguyễn Văn An", phone: "0987 654 321", role: "customer", avatarColor: "#2563eb" },
  { id: "u4", name: "Phạm Thu Hà", phone: "0977 888 999", role: "customer", avatarColor: "#3b82f6" },
  { id: "u5", name: "Đỗ Quang Huy", phone: "0966 111 222", role: "customer", avatarColor: "#1d4ed8" },
];

// ---- Giao dịch / hoa hồng -----------------------------------
export const TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    propertyTitle: "Căn hộ Vinhomes Central Park 2PN",
    brokerName: "Trần Minh Quân",
    customerName: "Nguyễn Văn An",
    amount: 4_200_000_000,
    commission: 84_000_000,
    date: "2026-06-12",
    status: "Thành công",
  },
  {
    id: "t2",
    propertyTitle: "Căn hộ The Origami 3PN",
    brokerName: "Lê Thị Hồng",
    customerName: "Phạm Thu Hà",
    amount: 5_600_000_000,
    commission: 112_000_000,
    date: "2026-06-20",
    status: "Đang xử lý",
  },
  {
    id: "t3",
    propertyTitle: "Văn phòng hạng B trung tâm Q.1",
    brokerName: "Trần Minh Quân",
    customerName: "Đỗ Quang Huy",
    amount: 9_800_000_000,
    commission: 196_000_000,
    date: "2026-05-30",
    status: "Thành công",
  },
];

// ---- Hồ sơ vay (ngân hàng) ----------------------------------
export const LOANS: LoanApplication[] = [
  {
    id: "l1",
    applicantName: "Nguyễn Văn An",
    propertyTitle: "Căn hộ Vinhomes Central Park 2PN",
    amount: 2_940_000_000,
    term: 240,
    status: "Chờ duyệt",
    submittedDate: "2026-06-25",
  },
  {
    id: "l2",
    applicantName: "Phạm Thu Hà",
    propertyTitle: "Căn hộ The Origami 3PN",
    amount: 3_360_000_000,
    term: 180,
    status: "Đã duyệt",
    submittedDate: "2026-06-18",
  },
  {
    id: "l3",
    applicantName: "Đỗ Quang Huy",
    propertyTitle: "Nhà phố Thảo Điền 1 trệt 3 lầu",
    amount: 11_100_000_000,
    term: 300,
    status: "Từ chối",
    submittedDate: "2026-06-10",
  },
];

// ---- Kết quả thi thử (môi giới) -----------------------------
export const EXAM_RESULTS: ExamResult[] = [
  { id: "e1", title: "Đề mô phỏng sát hạch #12", score: 38, total: 45, passed: true, date: "2026-06-28" },
  { id: "e2", title: "Đề chuyên môn - Pháp luật", score: 27, total: 30, passed: true, date: "2026-06-22" },
  { id: "e3", title: "Đề cơ sở - Kiến thức chung", score: 19, total: 30, passed: false, date: "2026-06-15" },
];

// ---- 16 chuyên đề học tập (rút gọn tên) ---------------------
export const SYLLABUS_TOPICS: { id: number; title: string; lessons: number }[] = [
  { id: 1, title: "Tổng quan về BĐS & thị trường", lessons: 6 },
  { id: 2, title: "Pháp luật về đất đai", lessons: 8 },
  { id: 3, title: "Pháp luật về nhà ở", lessons: 7 },
  { id: 4, title: "Pháp luật kinh doanh BĐS", lessons: 9 },
  { id: 5, title: "Đầu tư & tài chính BĐS", lessons: 5 },
  { id: 6, title: "Quy trình môi giới", lessons: 6 },
  { id: 7, title: "Định giá bất động sản", lessons: 7 },
  { id: 8, title: "Marketing & bán hàng", lessons: 5 },
];

// ---- Số liệu tổng quan cho từng dashboard -------------------
export const STATS = {
  broker: {
    listings: 24,
    activeCustomers: 8,
    monthlyCommission: 280_000_000,
    examPassRate: 82,
  },
  customer: {
    savedProperties: 12,
    activePosts: 2,
    contactedBrokers: 5,
    viewings: 3,
  },
  exchange: {
    inventory: 156,
    pendingVerification: 9,
    linkedBrokers: 340,
    monthlyDeals: 22,
  },
  bank: {
    pendingLoans: 14,
    approvedThisMonth: 31,
    totalDisbursed: 128_000_000_000,
    partnerExchanges: 6,
  },
  admin: {
    totalUsers: 12_480,
    vipUsers: 1_920,
    monthlyRevenue: 190_000_000,
    pendingModeration: 17,
  },
};
