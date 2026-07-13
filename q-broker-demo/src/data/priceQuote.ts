// =============================================================
// DỮ LIỆU + LOGIC "PHIẾU TÍNH GIÁ 30S"  (/realtor/phieu-tinh-gia)
// -------------------------------------------------------------
// Công cụ cho môi giới: nhập giá + chiết khấu + phương án vay -> ra ngay
// bảng cơ cấu vốn, trả góp ngân hàng (dư nợ giảm dần) và tiến độ thanh toán
// theo đợt. Xuất "phiếu" đẹp để gửi khách.
// Mock tập trung tại đây — thay bằng API sau, giữ nguyên shape.
// =============================================================

// ---- Ngân hàng liên kết + lãi suất (mock) -------------------
// Nhân viên tín dụng hỗ trợ khoản vay theo từng ngân hàng.
export interface BankSalesRep {
  id: string;
  name: string;
  title: string; // chức danh
}

export interface QuoteBank {
  id: string;
  name: string;
  short: string; // nhãn ngắn hiển thị trên phiếu
  color: string; // màu thương hiệu (dùng cho chấm/nhãn)
  logo: string; // đường dẫn logo (trong /public)
  promoRate: number; // lãi suất ưu đãi (%/năm)
  promoMonths: number; // số tháng ưu đãi
  rate: number; // lãi suất sau ưu đãi (%/năm)
  maxLtv: number; // tỷ lệ cho vay tối đa trên giá trị (%)
  sales: BankSalesRep[]; // nhân viên hỗ trợ khoản vay (5–8 người)
}

// Sinh danh sách nhân viên sale (mock) — deterministic theo bankId để
// không lệch giữa server render và client (tránh lỗi hydration).
const REP_SURNAMES = [
  "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đỗ", "Bùi",
  "Đặng", "Ngô", "Dương", "Lý", "Phan", "Hồ", "Trịnh", "Mai",
];
const REP_NAMES = [
  "Thu Hà", "Quốc Anh", "Minh Tuấn", "Thanh Nga", "Văn Bình", "Thị Lan",
  "Đức Duy", "Thị Hương", "Hải Đăng", "Thu Trang", "Quang Huy", "Thị Yến",
  "Văn Lâm", "Thị Thu", "Ngọc Mai", "Hữu Phúc", "Thúy Vy", "Gia Bảo",
  "Khánh Linh", "Tấn Phát",
];
const REP_TITLES = [
  "Chuyên viên tín dụng",
  "Cán bộ quan hệ khách hàng",
  "Chuyên viên tư vấn vay mua nhà",
  "Cán bộ tín dụng cá nhân",
  "Chuyên viên khách hàng ưu tiên",
];

function genReps(bankId: string, count: number): BankSalesRep[] {
  const seed = bankId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return Array.from({ length: count }, (_, i) => ({
    id: `${bankId}-r${i + 1}`,
    name: `${REP_SURNAMES[(seed + i * 3) % REP_SURNAMES.length]} ${
      REP_NAMES[(seed * 2 + i * 5) % REP_NAMES.length]
    }`,
    title: REP_TITLES[(seed + i) % REP_TITLES.length],
  }));
}

export const QUOTE_BANKS: QuoteBank[] = [
  { id: "vcb", name: "Vietcombank", short: "VCB", color: "#059669", logo: "/banks/vcb.svg", promoRate: 6.5, promoMonths: 12, rate: 10.5, maxLtv: 70, sales: genReps("vcb", 6) },
  { id: "tcb", name: "Techcombank", short: "TCB", color: "#e11d48", logo: "/banks/tcb.svg", promoRate: 6.9, promoMonths: 24, rate: 11.0, maxLtv: 75, sales: genReps("tcb", 7) },
  { id: "bidv", name: "BIDV", short: "BIDV", color: "#0e7490", logo: "/banks/bidv.svg", promoRate: 6.2, promoMonths: 12, rate: 10.2, maxLtv: 70, sales: genReps("bidv", 5) },
  { id: "ocb", name: "OCB — Phương Đông", short: "OCB", color: "#0f766e", logo: "/banks/ocb.svg", promoRate: 5.9, promoMonths: 6, rate: 11.5, maxLtv: 80, sales: genReps("ocb", 6) },
  { id: "ctg", name: "VietinBank", short: "CTG", color: "#1e3a8a", logo: "/banks/ctg.svg", promoRate: 6.4, promoMonths: 12, rate: 10.4, maxLtv: 70, sales: genReps("ctg", 8) },
  { id: "mbb", name: "MB Bank", short: "MBB", color: "#2563eb", logo: "/banks/mbb.svg", promoRate: 6.8, promoMonths: 18, rate: 10.8, maxLtv: 75, sales: genReps("mbb", 6) },
  { id: "vpb", name: "VPBank", short: "VPB", color: "#15803d", logo: "/banks/vpb.svg", promoRate: 7.2, promoMonths: 24, rate: 11.2, maxLtv: 80, sales: genReps("vpb", 7) },
  { id: "agr", name: "Agribank", short: "AGR", color: "#9f1239", logo: "/banks/agr.svg", promoRate: 6.0, promoMonths: 12, rate: 10.0, maxLtv: 75, sales: genReps("agr", 5) },
];

/** Tra cứu 1 ngân hàng theo id. */
export function getBank(id?: string): QuoteBank | undefined {
  return QUOTE_BANKS.find((b) => b.id === id);
}

/** Tra cứu 1 nhân viên sale theo ngân hàng + id. */
export function getBankRep(bankId?: string, repId?: string): BankSalesRep | undefined {
  return getBank(bankId)?.sales.find((r) => r.id === repId);
}

// ---- Tiến độ thanh toán mẫu (thị trường sơ cấp) -------------
export interface ScheduleStage {
  label: string;
  percent: number; // % trên giá sau chiết khấu
  note?: string;
}

export const PAYMENT_SCHEDULE: ScheduleStage[] = [
  { label: "Đặt cọc thiện chí", percent: 5, note: "Ký thoả thuận đặt cọc" },
  { label: "Đợt 1 — Ký HĐMB", percent: 25, note: "Trong 7 ngày sau cọc" },
  { label: "Đợt 2 — Xây thô", percent: 20 },
  { label: "Đợt 3 — Cất nóc", percent: 20 },
  { label: "Nhận bàn giao nhà", percent: 25 },
  { label: "Ra sổ hồng", percent: 5, note: "Khi có Giấy chứng nhận" },
];

// ---- Đầu vào của phiếu --------------------------------------
export interface QuoteInput {
  listingId?: string; // nếu chọn từ giỏ hàng
  price: number; // giá niêm yết (VND)
  discountPct: number; // chiết khấu (%)
  ltvPct: number; // tỷ lệ vay (%)
  bankId: string;
  termYears: number; // kỳ hạn vay (năm)
}

export const DEFAULT_QUOTE_INPUT: QuoteInput = {
  listingId: "l1", // chọn sẵn 1 căn để có "sản phẩm" khi tư vấn
  price: 4_200_000_000,
  discountPct: 3,
  ltvPct: 70,
  bankId: "vcb",
  termYears: 20,
};

// ---- Kết quả tính toán --------------------------------------
export interface QuoteStageAmount extends ScheduleStage {
  amount: number; // số tiền của đợt (VND)
}

export interface QuoteResult {
  discountAmount: number; // số tiền chiết khấu
  netPrice: number; // giá sau chiết khấu
  loanAmount: number; // số tiền vay
  ownCapital: number; // vốn tự có
  months: number; // tổng số tháng vay
  principalPerMonth: number; // gốc trả mỗi tháng (đều)
  firstInterest: number; // lãi tháng đầu (kỳ ưu đãi)
  monthlyFirst: number; // trả tháng đầu (gốc + lãi)
  monthlyAvg: number; // trả bình quân/tháng
  totalInterest: number; // tổng lãi toàn kỳ
  stages: QuoteStageAmount[]; // tiến độ thanh toán
}

// Trả góp theo "dư nợ giảm dần": gốc chia đều, lãi tính trên dư nợ còn lại.
// Có xét kỳ ưu đãi (promoMonths tháng đầu dùng promoRate).
export function computeQuote(input: QuoteInput, bank: QuoteBank): QuoteResult {
  const discountAmount = Math.round((input.price * input.discountPct) / 100);
  const netPrice = input.price - discountAmount;
  const loanAmount = Math.round((netPrice * input.ltvPct) / 100);
  const ownCapital = netPrice - loanAmount;

  const months = Math.max(1, Math.round(input.termYears * 12));
  const principalPerMonth = loanAmount / months;
  const rPromo = bank.promoRate / 100 / 12;
  const rNormal = bank.rate / 100 / 12;

  let balance = loanAmount;
  let totalInterest = 0;
  let firstInterest = 0;
  for (let m = 1; m <= months; m++) {
    const r = m <= bank.promoMonths ? rPromo : rNormal;
    const interest = balance * r;
    if (m === 1) firstInterest = interest;
    totalInterest += interest;
    balance -= principalPerMonth;
  }

  const monthlyFirst = principalPerMonth + firstInterest;
  const monthlyAvg = (loanAmount + totalInterest) / months;

  const stages: QuoteStageAmount[] = PAYMENT_SCHEDULE.map((s) => ({
    ...s,
    amount: Math.round((netPrice * s.percent) / 100),
  }));

  return {
    discountAmount,
    netPrice,
    loanAmount,
    ownCapital,
    months,
    principalPerMonth,
    firstInterest,
    monthlyFirst,
    monthlyAvg,
    totalInterest,
    stages,
  };
}

/** Định dạng tiền đầy đủ: 4200000000 -> "4.200.000.000 ₫" */
export function formatFull(value: number): string {
  return `${Math.round(value).toLocaleString("vi-VN")} ₫`;
}
