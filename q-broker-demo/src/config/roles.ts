import { RoleConfig, RoleId } from "@/types";

// =============================================================
// CẤU HÌNH TRUNG TÂM CHO 6 ROLE
// -------------------------------------------------------------
// Đây là "nguồn sự thật" duy nhất về các role.
// - Trang landing (src/app/page.tsx) đọc danh sách này để render 6 nút.
// - RoleShell (layout của mỗi role) đọc `nav` để render menu bên.
//
// => Muốn thêm 1 trang mới cho 1 role: chỉ cần thêm 1 mục vào `nav`
//    của role đó, rồi tạo file page.tsx tương ứng. Xong.
// =============================================================

export const ROLES: Record<RoleId, RoleConfig> = {
  // 1) NGƯỜI DÙNG CHƯA ĐĂNG NHẬP -------------------------------
  guest: {
    id: "guest",
    name: "Khách vãng lai",
    shortDesc: "Người dùng chưa đăng nhập",
    icon: "UserRound",
    color: "#64748b",
    basePath: "/guest",
    nav: [
      { label: "Trang chủ", href: "/guest", icon: "Home" },
      { label: "Giới thiệu Q-Broker", href: "/guest/about", icon: "Info" },
      { label: "Khóa học & luyện thi", href: "/guest/courses", icon: "GraduationCap" },
      { label: "Kho BĐS công khai", href: "/guest/properties", icon: "Building2" },
      { label: "Đăng nhập / Đăng ký", href: "/guest/login", icon: "LogIn" },
    ],
  },

  // 2) MÔI GIỚI ------------------------------------------------
  broker: {
    id: "broker",
    name: "Môi giới",
    shortDesc: "Học tập, luyện thi & chia sẻ giỏ hàng",
    icon: "Handshake",
    color: "#059669",
    basePath: "/broker",
    nav: [
      { label: "Tổng quan", href: "/broker", icon: "LayoutDashboard" },
      { label: "Học tập & chuyên đề", href: "/broker/study", icon: "BookOpen" },
      { label: "Thi thử", href: "/broker/exams", icon: "ClipboardList" },
      { label: "Giỏ hàng chung", href: "/broker/listings", icon: "Building2" },
      { label: "Khách hàng của tôi", href: "/broker/customers", icon: "Users" },
      { label: "Hoa hồng", href: "/broker/commission", icon: "Wallet" },
      { label: "Hồ sơ cá nhân", href: "/broker/profile", icon: "UserRound" },
    ],
  },

  // 3) KHÁCH HÀNG (NHÀ ĐẦU TƯ) ---------------------------------
  customer: {
    id: "customer",
    name: "Khách hàng",
    shortDesc: "Tìm mua / bán bất động sản đã xác thực",
    icon: "UserCheck",
    color: "#2563eb",
    basePath: "/customer",
    nav: [
      { label: "Tổng quan", href: "/customer", icon: "LayoutDashboard" },
      { label: "Tìm bất động sản", href: "/customer/search", icon: "Search" },
      { label: "Tin đã đăng", href: "/customer/my-posts", icon: "FileText" },
      { label: "BĐS đã lưu", href: "/customer/saved", icon: "Bookmark" },
      { label: "Môi giới liên hệ", href: "/customer/brokers", icon: "Handshake" },
      { label: "Hồ sơ cá nhân", href: "/customer/profile", icon: "UserRound" },
    ],
  },

  // 4) SÀN GIAO DỊCH -------------------------------------------
  exchange: {
    id: "exchange",
    name: "Sàn giao dịch",
    shortDesc: "Thẩm định & quản lý kho sản phẩm",
    icon: "Building2",
    color: "#7c3aed",
    basePath: "/exchange",
    nav: [
      { label: "Tổng quan", href: "/exchange", icon: "LayoutDashboard" },
      { label: "Kho sản phẩm", href: "/exchange/inventory", icon: "Warehouse" },
      { label: "Thẩm định hồ sơ", href: "/exchange/verification", icon: "ShieldCheck" },
      { label: "Mạng lưới môi giới", href: "/exchange/brokers", icon: "Network" },
      { label: "Giao dịch", href: "/exchange/transactions", icon: "ArrowLeftRight" },
      { label: "Cài đặt sàn", href: "/exchange/settings", icon: "Settings" },
    ],
  },

  // 5) NGÂN HÀNG -----------------------------------------------
  bank: {
    id: "bank",
    name: "Ngân hàng",
    shortDesc: "Sản phẩm vay & duyệt hồ sơ tín dụng",
    icon: "Landmark",
    color: "#d97706",
    basePath: "/bank",
    nav: [
      { label: "Tổng quan", href: "/bank", icon: "LayoutDashboard" },
      { label: "Hồ sơ vay", href: "/bank/loans", icon: "FileSpreadsheet" },
      { label: "Sản phẩm tín dụng", href: "/bank/products", icon: "CreditCard" },
      { label: "Định giá tài sản", href: "/bank/valuation", icon: "Calculator" },
      { label: "Đối tác sàn", href: "/bank/partners", icon: "Building2" },
      { label: "Cài đặt", href: "/bank/settings", icon: "Settings" },
    ],
  },

  // 6) ADMIN ---------------------------------------------------
  admin: {
    id: "admin",
    name: "Quản trị viên",
    shortDesc: "Quản lý toàn bộ hệ sinh thái",
    icon: "ShieldCheck",
    color: "#e11d48",
    basePath: "/admin",
    nav: [
      { label: "Tổng quan", href: "/admin", icon: "LayoutDashboard" },
      { label: "Người dùng", href: "/admin/users", icon: "Users" },
      { label: "Duyệt nội dung", href: "/admin/moderation", icon: "ShieldCheck" },
      { label: "Ngân hàng đề thi", href: "/admin/exam-bank", icon: "ClipboardList" },
      { label: "Doanh thu & gói VIP", href: "/admin/revenue", icon: "TrendingUp" },
      { label: "Cấu hình hệ thống", href: "/admin/settings", icon: "Settings" },
    ],
  },
};

/** Thứ tự hiển thị 6 nút trên landing page */
export const ROLE_ORDER: RoleId[] = [
  "guest",
  "broker",
  "customer",
  "exchange",
  "bank",
  "admin",
];

/** Lấy cấu hình role theo id (dùng trong layout) */
export function getRole(id: RoleId): RoleConfig {
  return ROLES[id];
}
