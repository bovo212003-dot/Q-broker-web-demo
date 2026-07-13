// =============================================================
// DỮ LIỆU + LOGIC "PHIẾU TÍNH GIÁ 30S"  (/realtor/phieu-tinh-gia)
// -------------------------------------------------------------
// Công cụ cho môi giới: nhập giá + chiết khấu + phương án vay -> ra ngay
// bảng cơ cấu vốn, trả góp ngân hàng (dư nợ giảm dần) và tiến độ thanh toán
// theo đợt. Xuất "phiếu" đẹp để gửi khách.
// Mock tập trung tại đây — thay bằng API sau, giữ nguyên shape.
// =============================================================

// ---- Ngân hàng liên kết + lãi suất (mock) -------------------
export interface QuoteBank {
  id: string;
  name: string;
  short: string; // nhãn ngắn hiển thị trên phiếu
  color: string; // màu thương hiệu (dùng cho chấm/nhãn)
  promoRate: number; // lãi suất ưu đãi (%/năm)
  promoMonths: number; // số tháng ưu đãi
  rate: number; // lãi suất sau ưu đãi (%/năm)
  maxLtv: number; // tỷ lệ cho vay tối đa trên giá trị (%)
}

export const QUOTE_BANKS: QuoteBank[] = [
  { id: "vcb", name: "Vietcombank", short: "VCB", color: "#059669", promoRate: 6.5, promoMonths: 12, rate: 10.5, maxLtv: 70 },
  { id: "tcb", name: "Techcombank", short: "TCB", color: "#e11d48", promoRate: 6.9, promoMonths: 24, rate: 11.0, maxLtv: 75 },
  { id: "bidv", name: "BIDV", short: "BIDV", color: "#0e7490", promoRate: 6.2, promoMonths: 12, rate: 10.2, maxLtv: 70 },
  { id: "ocb", name: "OCB — Phương Đông", short: "OCB", color: "#0f766e", promoRate: 5.9, promoMonths: 6, rate: 11.5, maxLtv: 80 },
];

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
