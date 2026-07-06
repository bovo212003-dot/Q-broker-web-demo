// =============================================================
// DỮ LIỆU TRANG CHIA SẺ GIỎ HÀNG  (/realtor/chia-se-gio-hang)
// -------------------------------------------------------------
// Theo requirement "Chia sẻ nguồn hàng bất động sản":
// - 4 đối tượng: Môi giới, Sàn giao dịch, Ngân hàng, Chủ đầu tư (sau).
// - 3 hình thức chia sẻ, quy trình 6 bước, 5 phạm vi quyền chia sẻ.
// Mock tập trung tại đây — thay bằng API sau, giữ nguyên shape.
// =============================================================

import { RoleId } from "@/types";

export const img = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

// ---- Role được phép dùng trang (theo requirement) -----------
export const ALLOWED_ROLES: RoleId[] = ["broker", "exchange", "bank"];

// ---- 8 loại nguồn hàng (theo PDF) ---------------------------
export const PROPERTY_KINDS = [
  "Nhà ở",
  "Căn hộ",
  "Đất nền",
  "Biệt thự",
  "Văn phòng",
  "Mặt bằng kinh doanh",
  "Kho xưởng",
  "Tài sản thanh lý",
] as const;
export type PropertyKind = (typeof PROPERTY_KINDS)[number];

// ---- Nguồn chia sẻ (3 hình thức) ----------------------------
export type SourceKind = "broker" | "exchange" | "bank";

export const SOURCE_META: Record<
  SourceKind,
  { label: string; icon: string; tone: string }
> = {
  broker: { label: "Môi giới đầu chủ", icon: "UserRound", tone: "bg-sky-50 text-sky-600" },
  exchange: { label: "Sàn giao dịch", icon: "Building2", tone: "bg-purple-50 text-purple-600" },
  bank: { label: "Ngân hàng", icon: "Landmark", tone: "bg-amber-50 text-amber-600" },
};

// ---- 5 phạm vi quyền chia sẻ (theo PDF) ---------------------
export const SHARE_SCOPES = [
  "Chia sẻ cho toàn bộ môi giới",
  "Chỉ chia sẻ nội bộ trong sàn",
  "Chia sẻ theo nhóm đối tác",
  "Chỉ tài khoản đã được xác thực",
  "Không chia sẻ",
] as const;
export type ShareScope = (typeof SHARE_SCOPES)[number];

// ---- Khu vực ------------------------------------------------
export const SHARE_AREAS = [
  "Quận 1, TP.HCM",
  "Quận 7, TP.HCM",
  "TP. Thủ Đức, TP.HCM",
  "Bình Thạnh, TP.HCM",
  "Cầu Giấy, Hà Nội",
  "Hải Châu, Đà Nẵng",
] as const;

// ---- Nguồn hàng trong kho chung -----------------------------
export interface SharedProperty {
  id: string;
  title: string;
  kind: PropertyKind;
  area: string;
  price: string; // hiển thị sẵn: "4,2 tỷ" / "45 triệu/th"
  size: number; // m²
  image: string;
  source: { kind: SourceKind; name: string };
  commission: number; // % hoa hồng dành cho môi giới đầu khách
  scope: ShareScope;
  receivers: number; // số môi giới đã nhận vào giỏ
  postedAt: string;
}

export const SHARED_INVENTORY: SharedProperty[] = [
  { id: "s1", title: "Căn hộ Vinhomes Central Park 2PN view sông", kind: "Căn hộ", area: "Bình Thạnh, TP.HCM", price: "4,2 tỷ", size: 72, image: img("photo-1512917774080-9991f1c4c750"), source: { kind: "broker", name: "Trần Minh Quân" }, commission: 50, scope: "Chia sẻ cho toàn bộ môi giới", receivers: 24, postedAt: "2026-07-04" },
  { id: "s2", title: "Nhà phố Thảo Điền 1 trệt 3 lầu full nội thất", kind: "Nhà ở", area: "TP. Thủ Đức, TP.HCM", price: "18,5 tỷ", size: 120, image: img("photo-1570129477492-45c003edd2be"), source: { kind: "broker", name: "Lê Thị Hồng Nhung" }, commission: 40, scope: "Chỉ tài khoản đã được xác thực", receivers: 11, postedAt: "2026-07-03" },
  { id: "s3", title: "Quỹ căn hộ The Origami — 12 căn 2-3PN", kind: "Căn hộ", area: "TP. Thủ Đức, TP.HCM", price: "Từ 3,8 tỷ", size: 68, image: img("photo-1545324418-cc1a3fa10c00"), source: { kind: "exchange", name: "Sàn Đất Vàng" }, commission: 55, scope: "Chia sẻ cho toàn bộ môi giới", receivers: 68, postedAt: "2026-07-05" },
  { id: "s4", title: "Shophouse mặt tiền Nguyễn Văn Linh", kind: "Mặt bằng kinh doanh", area: "Quận 7, TP.HCM", price: "22 tỷ", size: 140, image: img("photo-1441986300917-64674bd600d8"), source: { kind: "exchange", name: "Sàn Phú Gia" }, commission: 45, scope: "Chia sẻ theo nhóm đối tác", receivers: 19, postedAt: "2026-07-02" },
  { id: "s5", title: "Biệt thự nghỉ dưỡng ven biển — tài sản thanh lý", kind: "Tài sản thanh lý", area: "Hải Châu, Đà Nẵng", price: "12,9 tỷ", size: 250, image: img("photo-1600596542815-ffad4c1539a9"), source: { kind: "bank", name: "Ngân hàng VietHome" }, commission: 35, scope: "Chỉ tài khoản đã được xác thực", receivers: 32, postedAt: "2026-07-01" },
  { id: "s6", title: "Kho xưởng 800m² KCN Sóng Thần — thanh lý", kind: "Kho xưởng", area: "TP. Thủ Đức, TP.HCM", price: "16 tỷ", size: 800, image: img("photo-1586528116311-ad8dd3c8310d"), source: { kind: "bank", name: "Ngân hàng VietHome" }, commission: 30, scope: "Chia sẻ cho toàn bộ môi giới", receivers: 8, postedAt: "2026-06-29" },
  { id: "s7", title: "Sàn văn phòng hạng B trung tâm Quận 1", kind: "Văn phòng", area: "Quận 1, TP.HCM", price: "45 triệu/th", size: 85, image: img("photo-1497366216548-37526070297c"), source: { kind: "exchange", name: "Sàn Metro" }, commission: 60, scope: "Chia sẻ cho toàn bộ môi giới", receivers: 41, postedAt: "2026-07-05" },
  { id: "s8", title: "Đất nền sổ đỏ KDC hiện hữu 100m²", kind: "Đất nền", area: "TP. Thủ Đức, TP.HCM", price: "5,6 tỷ", size: 100, image: img("photo-1500382017468-9049fed747ef"), source: { kind: "broker", name: "Hoàng Văn Khang" }, commission: 50, scope: "Chia sẻ cho toàn bộ môi giới", receivers: 15, postedAt: "2026-06-30" },
  { id: "s9", title: "Biệt thự Palm Residence view sông", kind: "Biệt thự", area: "TP. Thủ Đức, TP.HCM", price: "32 tỷ", size: 250, image: img("photo-1580587771525-78b9dba3b914"), source: { kind: "exchange", name: "Sàn Phú Gia" }, commission: 40, scope: "Chỉ chia sẻ nội bộ trong sàn", receivers: 6, postedAt: "2026-06-28" },
];

// ---- Giỏ chia sẻ của tôi (theo role đang đăng nhập) ---------
export type MyItemStatus = "Đã duyệt" | "Chờ xác minh" | "Yêu cầu bổ sung";

export interface MyShareItem {
  id: string;
  title: string;
  kind: PropertyKind;
  area: string;
  price: string;
  commission: number;
  scope: ShareScope;
  status: MyItemStatus;
  receivers: number;
}

export const MY_INVENTORY: Record<"broker" | "exchange" | "bank", MyShareItem[]> = {
  broker: [
    { id: "m1", title: "Căn hộ Masteri Thảo Điền 2PN", kind: "Căn hộ", area: "TP. Thủ Đức, TP.HCM", price: "4,9 tỷ", commission: 50, scope: "Chia sẻ cho toàn bộ môi giới", status: "Đã duyệt", receivers: 17 },
    { id: "m2", title: "Nhà riêng hẻm xe hơi Bình Thạnh", kind: "Nhà ở", area: "Bình Thạnh, TP.HCM", price: "7,2 tỷ", commission: 45, scope: "Chỉ tài khoản đã được xác thực", status: "Chờ xác minh", receivers: 0 },
  ],
  exchange: [
    { id: "m3", title: "Quỹ căn The Origami — 12 căn", kind: "Căn hộ", area: "TP. Thủ Đức, TP.HCM", price: "Từ 3,8 tỷ", commission: 55, scope: "Chia sẻ cho toàn bộ môi giới", status: "Đã duyệt", receivers: 68 },
    { id: "m4", title: "Shophouse Nguyễn Văn Linh", kind: "Mặt bằng kinh doanh", area: "Quận 7, TP.HCM", price: "22 tỷ", commission: 45, scope: "Chia sẻ theo nhóm đối tác", status: "Đã duyệt", receivers: 19 },
    { id: "m5", title: "Officetel Millennium tầng cao", kind: "Văn phòng", area: "Quận 1, TP.HCM", price: "3,1 tỷ", commission: 50, scope: "Chỉ chia sẻ nội bộ trong sàn", status: "Yêu cầu bổ sung", receivers: 0 },
  ],
  bank: [
    { id: "m6", title: "Biệt thự ven biển Đà Nẵng — thanh lý", kind: "Tài sản thanh lý", area: "Hải Châu, Đà Nẵng", price: "12,9 tỷ", commission: 35, scope: "Chỉ tài khoản đã được xác thực", status: "Đã duyệt", receivers: 32 },
    { id: "m7", title: "Kho xưởng 800m² KCN Sóng Thần", kind: "Kho xưởng", area: "TP. Thủ Đức, TP.HCM", price: "16 tỷ", commission: 30, scope: "Chia sẻ cho toàn bộ môi giới", status: "Đã duyệt", receivers: 8 },
  ],
};

// ---- 3 hình thức chia sẻ (theo PDF) -------------------------
export const SHARING_FORMS = [
  {
    icon: "UsersRound",
    title: "Môi giới đầu chủ ↔ Môi giới đầu khách",
    desc: "Môi giới có nguồn hàng chia sẻ cho môi giới đang có khách. Giao dịch thành công, hoa hồng chia theo thỏa thuận.",
    benefit: "Nhân đôi cơ hội chốt giao dịch",
  },
  {
    icon: "Building2",
    title: "Sàn giao dịch → Môi giới",
    desc: "Sàn phân phối kho hàng lớn cho các môi giới đang có khách nhưng thiếu sản phẩm phù hợp.",
    benefit: "Tiêu thụ nguồn hàng nhanh hơn",
  },
  {
    icon: "Landmark",
    title: "Ngân hàng → Môi giới",
    desc: "Ngân hàng chia sẻ tài sản thanh lý, tài sản bảo đảm đến cộng đồng môi giới để đẩy nhanh chuyển nhượng.",
    benefit: "Nguồn hàng sạch, pháp lý rõ ràng",
  },
] as const;

// ---- Quy trình 6 bước (theo PDF) ----------------------------
export const SHARING_STEPS = [
  { icon: "Upload", title: "Đăng tải nguồn hàng", desc: "Đơn vị sở hữu tạo và đăng thông tin bất động sản." },
  { icon: "ShieldCheck", title: "AI Realtor + chuyên gia xác minh", desc: "Tin được kiểm duyệt trước khi chia sẻ đến cộng đồng." },
  { icon: "Share2", title: "Chia sẻ theo quyền", desc: "Nguồn hàng đến đúng đối tượng được cấp quyền." },
  { icon: "Search", title: "Môi giới tìm nguồn phù hợp", desc: "Lọc theo nhu cầu khách hàng của mình." },
  { icon: "HeartHandshake", title: "Tư vấn & kết nối khách", desc: "Giới thiệu sản phẩm phù hợp đến khách hàng." },
  { icon: "BadgeDollarSign", title: "Giao dịch & chia hoa hồng", desc: "Thành công — các bên phân chia lợi ích minh bạch." },
] as const;

// ---- Điều kiện tham gia (theo PDF) --------------------------
export const JOIN_CONDITIONS = [
  "Đã xác thực tài khoản",
  "Không vi phạm quy định của hệ thống",
  "Có hồ sơ cá nhân đầy đủ",
  "Tuân thủ quy định đăng tin & chia sẻ thông tin",
] as const;
