// =============================================================
// Kiểu dữ liệu dùng chung cho toàn bộ ứng dụng Q-Broker (demo)
// =============================================================

/** 6 role của hệ sinh thái Q-Broker */
export type RoleId =
  | "guest" // Người dùng chưa đăng nhập
  | "broker" // Môi giới
  | "customer" // Khách hàng (nhà đầu tư)
  | "exchange" // Sàn giao dịch
  | "bank" // Ngân hàng
  | "admin"; // Quản trị hệ thống

/** Một mục trong menu điều hướng của mỗi role */
export interface NavItem {
  label: string;
  href: string;
  icon: string; // tên icon trong lucide-react (xem components/ui/Icon.tsx)
}

/** Định nghĩa đầy đủ cho một role */
export interface RoleConfig {
  id: RoleId;
  name: string; // Tên hiển thị (VD: "Môi giới")
  shortDesc: string; // Mô tả ngắn hiển thị trên nút landing page
  icon: string; // Icon đại diện
  color: string; // Mã màu nhấn (hex)
  basePath: string; // Đường dẫn gốc (VD: "/broker")
  nav: NavItem[]; // Menu bên của role
}

// -------------------------------------------------------------
// Kiểu dữ liệu nghiệp vụ (mock)
// -------------------------------------------------------------

/** Bất động sản trong giỏ hàng chung */
export interface Property {
  id: string;
  title: string;
  address: string;
  price: number; // VND
  area: number; // m2
  type: "Căn hộ" | "Nhà phố" | "Đất nền" | "Biệt thự" | "Văn phòng";
  status: "Đang bán" | "Đã bán" | "Chờ duyệt";
  verified: boolean; // Đã thẩm định pháp lý chưa
  imageColor: string; // màu placeholder ảnh (demo, chưa có ảnh thật)
  exchangeName: string; // Sàn cung cấp
}

/** Người dùng chung (môi giới / khách hàng...) */
export interface Person {
  id: string;
  name: string;
  phone: string;
  role: RoleId;
  avatarColor: string;
}

/** Giao dịch / hoa hồng */
export interface Transaction {
  id: string;
  propertyTitle: string;
  brokerName: string;
  customerName: string;
  amount: number;
  commission: number;
  date: string;
  status: "Thành công" | "Đang xử lý" | "Đã hủy";
}

/** Hồ sơ vay vốn (phía ngân hàng) */
export interface LoanApplication {
  id: string;
  applicantName: string;
  propertyTitle: string;
  amount: number;
  term: number; // tháng
  status: "Chờ duyệt" | "Đã duyệt" | "Từ chối";
  submittedDate: string;
}

/** Kết quả thi thử của môi giới */
export interface ExamResult {
  id: string;
  title: string;
  score: number;
  total: number;
  passed: boolean;
  date: string;
}
