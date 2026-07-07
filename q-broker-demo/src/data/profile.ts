import { RoleId } from "@/types";
import { NEWS_ARTICLES, type NewsArticle, type NewsCategoryId } from "./news";
import { LISTINGS, type Listing } from "./realtorListings";

// =============================================================
// DỮ LIỆU TRANG CÁ NHÂN (danh thiếp) — /realtor/profile
// MỖI ROLE có 1 hồ sơ riêng: role nào đăng nhập -> xem đúng hồ sơ của role đó.
// Avatar/ảnh dùng CSS background (lỗi tải không "vỡ"); role dạng công ty dùng
// avatar chữ cái (không ảnh). Bài viết & Sản phẩm lấy từ dữ liệu web dùng chung.
// =============================================================

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

export interface ContactRow {
  icon: string; // lucide-react
  label: string;
  value: string;
  href?: string;
}

export interface SocialRow {
  icon: string;
  label: string;
  value: string;
  href?: string;
}

export interface ProfileData {
  name: string;
  headline: string;
  avatarColor: string;
  avatarImage?: string; // bỏ trống -> avatar chữ cái (role công ty)
  coverImage: string;
  // Gradient nền dự phòng nếu ảnh bìa lỗi tải.
  coverFrom: string;
  coverVia: string;
  coverTo: string;
  bio: string;
  stats: { value: string; label: string }[];
  contact: ContactRow[];
  socials: SocialRow[];
  // Tab "Bài viết" & "Sản phẩm" khác nhau theo role (nhãn + nội dung riêng).
  articlesLabel: string;
  articles: NewsArticle[];
  productsLabel: string;
  products: Listing[];
}

// Lọc nhanh tin tức theo chuyên mục (dùng cho tab Bài viết của từng role).
const byCat = (...cats: NewsCategoryId[]): NewsArticle[] =>
  NEWS_ARTICLES.filter((a) => cats.includes(a.category));

// Nền bìa dự phòng dùng chung (xanh navy -> xanh realtor).
const COVER = { coverFrom: "#1e3a8a", coverVia: "#2563eb", coverTo: "#60a5fa" };

// Mạng xã hội mẫu dùng lại cho nhiều role.
const SOCIALS_DEFAULT: SocialRow[] = [
  { icon: "Facebook", label: "Facebook", value: "Link", href: "#" },
  { icon: "Linkedin", label: "LinkedIn", value: "Link", href: "#" },
  { icon: "Landmark", label: "OCB Bank", value: "0004600048126001" },
];

export const PROFILES: Partial<Record<RoleId, ProfileData>> = {
  // ---- MÔI GIỚI ----
  broker: {
    name: "Nguyễn Văn An",
    headline: "Chuyên viên môi giới bất động sản · Q-Broker",
    avatarColor: "#059669",
    avatarImage: img("photo-1507003211169-0a1dd7228f2d", 400),
    coverImage: img("photo-1449824913935-59a10b8d2000", 1600),
    ...COVER,
    bio: "Kết nối người mua & người bán bằng sự minh bạch. 5 năm kinh nghiệm thị trường BĐS TP.HCM.",
    stats: [
      { value: "12", label: "Sản phẩm" },
      { value: "6", label: "Bài viết" },
      { value: "1.2K", label: "Theo dõi" },
    ],
    contact: [
      { icon: "Phone", label: "Số điện thoại", value: "0374 047 117", href: "tel:0374047117" },
      { icon: "Mail", label: "Email", value: "an.nguyen@q-broker.vn", href: "mailto:an.nguyen@q-broker.vn" },
      { icon: "MapPin", label: "Địa chỉ", value: "Quận 1, TP. Hồ Chí Minh" },
      { icon: "Globe", label: "Website", value: "q-broker.vn/an.nguyen", href: "#" },
    ],
    socials: SOCIALS_DEFAULT,
    articlesLabel: "Bài viết",
    articles: NEWS_ARTICLES.slice(0, 6),
    productsLabel: "Sản phẩm đang bán",
    products: LISTINGS.slice(0, 6),
  },

  // ---- KHÁCH HÀNG (NHÀ ĐẦU TƯ) ----
  customer: {
    name: "Phạm Thu Hà",
    headline: "Nhà đầu tư bất động sản",
    avatarColor: "#2563eb",
    avatarImage: img("photo-1494790108377-be9c29b29330", 400),
    coverImage: img("photo-1444723121867-7a241cacace9", 1600),
    ...COVER,
    bio: "Đang tìm căn hộ 2–3PN khu Đông TP.HCM để đầu tư dòng tiền. Ưu tiên sản phẩm pháp lý minh bạch.",
    stats: [
      { value: "8", label: "Tin đã lưu" },
      { value: "3", label: "Nhu cầu" },
      { value: "5", label: "Môi giới" },
    ],
    contact: [
      { icon: "Phone", label: "Số điện thoại", value: "0977 888 999", href: "tel:0977888999" },
      { icon: "Mail", label: "Email", value: "ha.pham@gmail.com", href: "mailto:ha.pham@gmail.com" },
      { icon: "MapPin", label: "Khu vực quan tâm", value: "TP. Thủ Đức, TP.HCM" },
      { icon: "Wallet", label: "Ngân sách", value: "4 – 5 tỷ" },
    ],
    socials: SOCIALS_DEFAULT,
    articlesLabel: "Bài viết đã lưu",
    articles: byCat("cam-nang", "thi-truong"),
    productsLabel: "BĐS đã lưu",
    products: LISTINGS.slice(2, 8),
  },

  // ---- SÀN GIAO DỊCH ----
  exchange: {
    name: "Sàn Đất Vàng",
    headline: "Sàn giao dịch bất động sản · Đối tác Q-Broker",
    avatarColor: "#7c3aed",
    coverImage: img("photo-1470071459604-3b5ec3a7fe05", 1600),
    ...COVER,
    bio: "Sàn giao dịch uy tín với hàng trăm sản phẩm đã thẩm định pháp lý, đóng góp vào giỏ hàng chung Q-Broker.",
    stats: [
      { value: "156", label: "Sản phẩm" },
      { value: "340", label: "Môi giới" },
      { value: "22", label: "GD/tháng" },
    ],
    contact: [
      { icon: "Phone", label: "Hotline", value: "1900 6060", href: "tel:19006060" },
      { icon: "Mail", label: "Email", value: "info@datvang.vn", href: "mailto:info@datvang.vn" },
      { icon: "MapPin", label: "Văn phòng", value: "Toà nhà Landmark, Bình Thạnh, TP.HCM" },
      { icon: "Globe", label: "Website", value: "datvang.vn", href: "#" },
    ],
    socials: SOCIALS_DEFAULT,
    articlesLabel: "Tin của sàn",
    articles: byCat("du-an", "thi-truong"),
    productsLabel: "Kho sản phẩm",
    products: LISTINGS.slice(0, 9),
  },

  // ---- NGÂN HÀNG ----
  bank: {
    name: "OCB — Ngân hàng Phương Đông",
    headline: "Đối tác tài chính · Cho vay mua bất động sản",
    avatarColor: "#d97706",
    coverImage: img("photo-1554224155-6726b3ff858f", 1600),
    ...COVER,
    bio: "Đồng hành cùng khách hàng Q-Broker với gói vay mua nhà lãi suất ưu đãi, thủ tục nhanh, duyệt hồ sơ trong ngày.",
    stats: [
      { value: "6", label: "Gói vay" },
      { value: "31", label: "Duyệt/tháng" },
      { value: "128 tỷ", label: "Giải ngân" },
    ],
    contact: [
      { icon: "Phone", label: "Tổng đài", value: "1800 6678", href: "tel:18006678" },
      { icon: "Mail", label: "Email", value: "vay@ocb.com.vn", href: "mailto:vay@ocb.com.vn" },
      { icon: "MapPin", label: "Hội sở", value: "41 Lê Duẩn, Quận 1, TP.HCM" },
      { icon: "Globe", label: "Website", value: "ocb.com.vn", href: "#" },
    ],
    socials: SOCIALS_DEFAULT,
    articlesLabel: "Tài chính & lãi suất",
    articles: byCat("tai-chinh"),
    productsLabel: "BĐS nhận thế chấp",
    products: LISTINGS.slice(0, 6),
  },

  // ---- QUẢN TRỊ VIÊN ----
  admin: {
    name: "Trần Quản Trị",
    headline: "Quản trị viên hệ thống · Q-Broker",
    avatarColor: "#e11d48",
    avatarImage: img("photo-1560250097-0b93528c311a", 400),
    coverImage: img("photo-1449824913935-59a10b8d2000", 1600),
    ...COVER,
    bio: "Quản lý vận hành, kiểm duyệt nội dung và bảo đảm minh bạch cho toàn bộ hệ sinh thái Q-Broker.",
    stats: [
      { value: "12.480", label: "Người dùng" },
      { value: "1.920", label: "VIP" },
      { value: "17", label: "Chờ duyệt" },
    ],
    contact: [
      { icon: "Phone", label: "Nội bộ", value: "0900 000 001", href: "tel:0900000001" },
      { icon: "Mail", label: "Email", value: "admin@q-broker.vn", href: "mailto:admin@q-broker.vn" },
      { icon: "MapPin", label: "Trụ sở", value: "Q-Broker HQ, Quận 1, TP.HCM" },
      { icon: "Globe", label: "Website", value: "q-broker.vn", href: "#" },
    ],
    socials: SOCIALS_DEFAULT,
    articlesLabel: "Thông báo hệ thống",
    articles: byCat("chinh-sach"),
    productsLabel: "Tin nổi bật",
    products: LISTINGS.slice(0, 3),
  },
};

/** Lấy hồ sơ theo role hiện tại; guest/không rõ -> mặc định hồ sơ Môi giới. */
export function getProfile(roleId?: RoleId): ProfileData {
  return (roleId && PROFILES[roleId]) || PROFILES.broker!;
}

export interface Photo {
  id: string;
  image: string; // ảnh thật (qua CSS background)
  from: string; // màu nền dự phòng nếu ảnh lỗi tải
  to: string;
}

// Ô ảnh: ảnh thật + gradient nền dự phòng (lỗi tải -> lộ gradient, không "vỡ").
export const PHOTOS: Photo[] = [
  { id: "ph1", image: img("photo-1586023492125-27b2c045efd7", 600), from: "#93c5fd", to: "#2563eb" },
  { id: "ph2", image: img("photo-1522708323590-d24dbb6b0267", 600), from: "#fca5a5", to: "#dc2626" },
  { id: "ph3", image: img("photo-1560185007-cde436f6a4d0", 600), from: "#fcd34d", to: "#d97706" },
  { id: "ph4", image: img("photo-1556911220-bff31c812dba", 600), from: "#86efac", to: "#059669" },
  { id: "ph5", image: img("photo-1584622650111-993a426fbf0a", 600), from: "#c4b5fd", to: "#7c3aed" },
  { id: "ph6", image: img("photo-1600607687939-ce8a6c25118c", 600), from: "#f9a8d4", to: "#db2777" },
  { id: "ph7", image: img("photo-1600585154340-be6161a56a0c", 600), from: "#67e8f9", to: "#0891b2" },
  { id: "ph8", image: img("photo-1600596542815-ffad4c1539a9", 600), from: "#bef264", to: "#65a30d" },
  { id: "ph9", image: img("photo-1568605114967-8130f3a36994", 600), from: "#fdba74", to: "#ea580c" },
];
