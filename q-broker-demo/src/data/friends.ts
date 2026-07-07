// =============================================================
// DỮ LIỆU MẪU: KẾT BẠN (mạng xã hội nội bộ Q-Broker) (/realtor/ket-ban)
// Tham khảo luồng kết bạn của các mạng xã hội lớn (Facebook, LinkedIn):
// danh sách bạn bè, lời mời đang chờ, gợi ý "Có thể bạn quen", và
// TRANG CÁ NHÂN của từng người (avatar + ảnh bìa + bio + ảnh).
//
// LUẬT KẾT BẠN (nghiệp vụ Q-Broker):
//   - Môi giới (broker)  chỉ kết bạn được với  môi giới.
//   - Khách hàng (customer) kết bạn được với  khách hàng + môi giới.
//   - Quản trị (admin) xem được cả hai nhóm (phục vụ quản lý).
//
// Ảnh dùng Unsplash qua CSS background (lỗi tải -> lộ màu nền, không
// "vỡ"). Dữ liệu mock, thiết kế để thay bằng API sau.
// =============================================================

import { RoleId } from "@/types";

/** Helper dựng URL ảnh Unsplash theo chuẩn dùng chung với data/profile.ts */
const img = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

/** Chỉ 2 nhóm người tham gia mạng kết bạn: môi giới & khách hàng. */
export type FriendRole = Extract<RoleId, "broker" | "customer">;

/** Quan hệ hiện tại giữa "tôi" và một người. */
export type Relationship =
  | "friend" // đã là bạn
  | "incoming" // họ gửi lời mời cho tôi
  | "none"; // chưa quen -> hiện ở mục Gợi ý

export interface FriendPerson {
  id: string;
  name: string;
  role: FriendRole;
  avatarColor: string; // màu nền avatar (dự phòng nếu ảnh lỗi)
  avatarImage: string; // ảnh chân dung thật
  coverColor: string; // màu dải bìa (dự phòng)
  coverImage: string; // ảnh bìa thật
  title: string; // chức danh / mô tả ngắn
  location: string; // khu vực hoạt động
  bio: string; // giới thiệu dài hơn (trang cá nhân)
  verified: boolean; // đã xác thực danh tính
  company: string; // đơn vị công tác / mô tả vai trò
  experience: string; // số năm kinh nghiệm / trạng thái
  website?: string; // trang cá nhân / công ty
  phone: string;
  email: string;
  specialties: string[]; // chuyên môn / lĩnh vực quan tâm
  areas: string[]; // khu vực hoạt động chi tiết
  languages: string[]; // ngôn ngữ
  mutual: number; // số bạn chung
  friendsCount: number; // tổng số bạn bè
  posts: number; // số bài đăng
  online: boolean;
  joined: string; // tham gia từ
  photos: string[]; // ảnh gallery trên trang cá nhân
  rel: Relationship;
}

// -------------------------------------------------------------
// LUẬT KẾT BẠN — nguồn sự thật duy nhất, dùng chung cho UI + logic.
// -------------------------------------------------------------

/** Các nhóm mà `role` được phép kết bạn / nhìn thấy trong mạng xã hội. */
export function friendableRoles(role?: RoleId): FriendRole[] {
  switch (role) {
    case "broker":
      return ["broker"]; // môi giới ⇄ môi giới
    case "customer":
      return ["customer", "broker"]; // khách hàng ⇄ khách hàng + môi giới
    case "admin":
      return ["broker", "customer"]; // quản trị thấy tất cả
    default:
      return [];
  }
}

/** Câu giải thích luật, hiển thị dưới tiêu đề trang theo từng role. */
export function friendRuleHint(role?: RoleId): string {
  switch (role) {
    case "broker":
      return "Là môi giới, bạn kết nối với các môi giới khác để mở rộng mạng lưới nghề nghiệp.";
    case "customer":
      return "Là khách hàng, bạn có thể kết bạn với khách hàng khác và cả môi giới đồng hành cùng bạn.";
    case "admin":
      return "Chế độ quản trị: xem toàn bộ mạng lưới môi giới và khách hàng.";
    default:
      return "";
  }
}

/** `me` (role) có được phép kết bạn với người thuộc `target` không. */
export function canFriend(me: RoleId | undefined, target: FriendRole): boolean {
  return friendableRoles(me).includes(target);
}

/** Nhãn + màu badge cho từng nhóm người (đồng bộ màu role landing). */
export const FRIEND_ROLE_META: Record<
  FriendRole,
  { label: string; icon: string; chip: string; solid: string }
> = {
  broker: {
    label: "Môi giới",
    icon: "Handshake",
    chip: "bg-emerald-50 text-emerald-600",
    solid: "#059669",
  },
  customer: {
    label: "Khách hàng",
    icon: "UserCheck",
    chip: "bg-blue-50 text-blue-600",
    solid: "#2563eb",
  },
};

// Bể ảnh BĐS/không gian dùng cho gallery trang cá nhân (tái sử dụng).
const GALLERY = [
  img("photo-1586023492125-27b2c045efd7", 600),
  img("photo-1560185007-cde436f6a4d0", 600),
  img("photo-1512917774080-9991f1c4c750", 600),
  img("photo-1600596542815-ffad4c1539a9", 600),
  img("photo-1600607687939-ce8a6c25118c", 600),
  img("photo-1600585154340-be6161a56a0c", 600),
  img("photo-1600566753086-00f18fb6b3ea", 600),
  img("photo-1600047509807-ba8f99d2cdde", 600),
];

// -------------------------------------------------------------
// KHO NGƯỜI DÙNG (mock). Trộn cả môi giới & khách hàng ở mọi trạng
// thái để mỗi role thấy kết quả có ý nghĩa sau khi lọc theo luật.
// -------------------------------------------------------------

export const FRIEND_PEOPLE: FriendPerson[] = [
  // ----- Đã là bạn -----
  {
    id: "u1",
    name: "Trần Minh Quân",
    role: "broker",
    avatarColor: "#059669",
    avatarImage: img("photo-1507003211169-0a1dd7228f2d", 400),
    coverColor: "#d1fae5",
    coverImage: img("photo-1449824913935-59a10b8d2000", 1200),
    title: "Môi giới cấp cao · Đất Xanh Miền Nam",
    location: "Quận 7, TP.HCM",
    bio: "5 năm gắn bó với thị trường BĐS khu Nam Sài Gòn. Chuyên căn hộ cao cấp và nhà phố Phú Mỹ Hưng. Luôn đặt sự minh bạch và lợi ích khách hàng lên hàng đầu, hỗ trợ trọn gói từ xem nhà, pháp lý đến vay ngân hàng.",
    verified: true,
    company: "Đất Xanh Miền Nam",
    experience: "5 năm kinh nghiệm",
    website: "q-broker.vn/quan.tran",
    phone: "0901 234 567",
    email: "quan.tran@datxanh.vn",
    specialties: ["Căn hộ cao cấp", "Nhà phố", "Phú Mỹ Hưng"],
    areas: ["Quận 7", "Nhà Bè", "Quận 4"],
    languages: ["Tiếng Việt", "Tiếng Anh"],
    mutual: 24,
    friendsCount: 842,
    posts: 63,
    online: true,
    joined: "Tháng 3, 2021",
    photos: GALLERY.slice(0, 6),
    rel: "friend",
  },
  {
    id: "u2",
    name: "Nguyễn Thị Lan",
    role: "broker",
    avatarColor: "#0d9488",
    avatarImage: img("photo-1494790108377-be9c29b29330", 400),
    coverColor: "#ccfbf1",
    coverImage: img("photo-1512453979798-5ea266f8880c", 1200),
    title: "Chuyên căn hộ khu Đông",
    location: "TP. Thủ Đức",
    bio: "Đồng hành cùng khách hàng trẻ tìm căn hộ đầu tiên tại khu Đông. Am hiểu Vinhomes Grand Park và các dự án lân cận, tư vấn dòng tiền cho thuê và lộ trình trả góp hợp lý.",
    verified: true,
    company: "Q-Broker",
    experience: "4 năm kinh nghiệm",
    website: "q-broker.vn/lan.nguyen",
    phone: "0912 345 678",
    email: "lan.nguyen@q-broker.vn",
    specialties: ["Căn hộ khu Đông", "Vinhomes Grand Park", "Cho thuê"],
    areas: ["TP. Thủ Đức", "Quận 9", "Quận 2"],
    languages: ["Tiếng Việt", "Tiếng Anh"],
    mutual: 12,
    friendsCount: 511,
    posts: 38,
    online: false,
    joined: "Tháng 8, 2021",
    photos: GALLERY.slice(1, 7),
    rel: "friend",
  },
  {
    id: "u3",
    name: "Phạm Gia Bảo",
    role: "customer",
    avatarColor: "#2563eb",
    avatarImage: img("photo-1500648767791-00dcc994a43e", 400),
    coverColor: "#dbeafe",
    coverImage: img("photo-1444723121867-7a241cacace9", 1200),
    title: "Nhà đầu tư · quan tâm đất nền",
    location: "Bình Dương",
    bio: "Nhà đầu tư cá nhân, ưu tiên đất nền pháp lý rõ ràng vùng ven TP.HCM và Bình Dương. Tầm nhìn trung – dài hạn, quan tâm hạ tầng kết nối và quy hoạch. Sẵn sàng xuống tiền nhanh khi gặp sản phẩm phù hợp.",
    verified: true,
    company: "Nhà đầu tư cá nhân",
    experience: "Đầu tư từ 2019",
    phone: "0977 888 111",
    email: "bao.pham@gmail.com",
    specialties: ["Đất nền", "Đầu tư dài hạn", "Pháp lý"],
    areas: ["Bình Dương", "Đồng Nai", "Long An"],
    languages: ["Tiếng Việt"],
    mutual: 8,
    friendsCount: 276,
    posts: 12,
    online: true,
    joined: "Tháng 1, 2022",
    photos: GALLERY.slice(2, 8),
    rel: "friend",
  },
  {
    id: "u4",
    name: "Lê Hoàng Yến",
    role: "customer",
    avatarColor: "#7c3aed",
    avatarImage: img("photo-1438761681033-6461ffad8d80", 400),
    coverColor: "#ede9fe",
    coverImage: img("photo-1486406146926-c627a92ad1ab", 1200),
    title: "Tìm mua nhà phố để ở",
    location: "Gò Vấp, TP.HCM",
    bio: "Đang tìm nhà phố 1 trệt 2 lầu khu Gò Vấp cho gia đình nhỏ. Mong gặp môi giới tận tâm, tư vấn thật lòng và hỗ trợ thủ tục sang tên, vay vốn. Ngân sách khoảng 5–6 tỷ, ưu tiên khu dân cư an ninh.",
    verified: false,
    company: "Khách hàng cá nhân",
    experience: "Mua để ở",
    phone: "0933 222 444",
    email: "yen.le@gmail.com",
    specialties: ["Nhà phố", "Mua để ở", "Khu Gò Vấp"],
    areas: ["Gò Vấp", "Quận 12", "Bình Thạnh"],
    languages: ["Tiếng Việt"],
    mutual: 3,
    friendsCount: 189,
    posts: 5,
    online: false,
    joined: "Tháng 6, 2023",
    photos: GALLERY.slice(0, 6),
    rel: "friend",
  },

  // ----- Lời mời đang chờ (họ gửi cho tôi) -----
  {
    id: "u5",
    name: "Đỗ Anh Khoa",
    role: "broker",
    avatarColor: "#ea580c",
    avatarImage: img("photo-1506794778202-cad84cf45f1d", 400),
    coverColor: "#ffedd5",
    coverImage: img("photo-1470071459604-3b5ec3a7fe05", 1200),
    title: "Môi giới BĐS nghỉ dưỡng",
    location: "Nha Trang",
    bio: "Chuyên biệt thự biển và condotel Nha Trang – Cam Ranh. Kết nối nhà đầu tư với dòng sản phẩm nghỉ dưỡng sinh lời, cam kết cho thuê và pháp lý sở hữu rõ ràng. Đồng hành cùng khách từ Bắc vào Nam.",
    verified: true,
    company: "Q-Broker",
    experience: "6 năm kinh nghiệm",
    website: "q-broker.vn/khoa.do",
    phone: "0905 111 222",
    email: "khoa.do@q-broker.vn",
    specialties: ["BĐS nghỉ dưỡng", "Condotel", "Biệt thự biển"],
    areas: ["Nha Trang", "Cam Ranh", "Hồ Tràm"],
    languages: ["Tiếng Việt", "Tiếng Anh"],
    mutual: 15,
    friendsCount: 623,
    posts: 47,
    online: false,
    joined: "Tháng 5, 2020",
    photos: GALLERY.slice(2, 8),
    rel: "incoming",
  },
  {
    id: "u6",
    name: "Vũ Khánh Chi",
    role: "customer",
    avatarColor: "#db2777",
    avatarImage: img("photo-1544005313-94ddf0286df2", 400),
    coverColor: "#fce7f3",
    coverImage: img("photo-1512917774080-9991f1c4c750", 1200),
    title: "Quan tâm căn hộ cho thuê",
    location: "Quận 2, TP.HCM",
    bio: "Tìm căn hộ 1–2PN khu Thảo Điền để đầu tư cho thuê. Ưu tiên bàn giao nội thất, cộng đồng dân trí cao và tiện ích quốc tế. Đang so sánh vài dự án, cần môi giới phân tích tỷ suất cho thuê thực tế.",
    verified: false,
    company: "Khách hàng cá nhân",
    experience: "Đầu tư cho thuê",
    phone: "0966 333 555",
    email: "chi.vu@gmail.com",
    specialties: ["Căn hộ cho thuê", "Thảo Điền", "Đầu tư dòng tiền"],
    areas: ["Quận 2", "Thảo Điền", "Bình Thạnh"],
    languages: ["Tiếng Việt", "Tiếng Anh"],
    mutual: 5,
    friendsCount: 214,
    posts: 9,
    online: true,
    joined: "Tháng 9, 2022",
    photos: GALLERY.slice(1, 7),
    rel: "incoming",
  },
  {
    id: "u7",
    name: "Hoàng Đức Thịnh",
    role: "broker",
    avatarColor: "#0891b2",
    avatarImage: img("photo-1519085360753-af0119f7cbe7", 400),
    coverColor: "#cffafe",
    coverImage: img("photo-1449824913935-59a10b8d2000", 1200),
    title: "Trưởng nhóm kinh doanh",
    location: "Long An",
    bio: "Dẫn dắt đội ngũ 20 môi giới khu vực Long An – Đức Hòa. Chuyên đất nền khu công nghiệp và dự án vệ tinh TP.HCM. Nhiều năm kinh nghiệm phân phối dự án lớn, đào tạo và xây dựng đội nhóm kinh doanh.",
    verified: true,
    company: "Trưởng nhóm · Q-Broker",
    experience: "8 năm kinh nghiệm",
    website: "q-broker.vn/thinh.hoang",
    phone: "0918 444 666",
    email: "thinh.hoang@q-broker.vn",
    specialties: ["Đất nền KCN", "Dự án vệ tinh", "Quản lý đội nhóm"],
    areas: ["Long An", "Đức Hòa", "Bến Lức"],
    languages: ["Tiếng Việt"],
    mutual: 31,
    friendsCount: 1024,
    posts: 88,
    online: false,
    joined: "Tháng 2, 2019",
    photos: GALLERY.slice(0, 6),
    rel: "incoming",
  },

  // ----- Gợi ý (chưa quen) -----
  {
    id: "u8",
    name: "Bùi Thanh Tùng",
    role: "broker",
    avatarColor: "#16a34a",
    avatarImage: img("photo-1531123897727-8f129e1688ce", 400),
    coverColor: "#dcfce7",
    coverImage: img("photo-1486406146926-c627a92ad1ab", 1200),
    title: "Chuyên đất nền vùng ven",
    location: "Đồng Nai",
    bio: "Bám sát các đợt mở bán đất nền Nhơn Trạch, Long Thành. Cập nhật pháp lý và tiến độ hạ tầng sân bay liên tục, tư vấn thời điểm vào – ra hợp lý cho nhà đầu tư lướt sóng lẫn dài hạn.",
    verified: true,
    company: "Q-Broker",
    experience: "3 năm kinh nghiệm",
    website: "q-broker.vn/tung.bui",
    phone: "0902 555 777",
    email: "tung.bui@q-broker.vn",
    specialties: ["Đất nền", "Long Thành", "Đầu tư lướt sóng"],
    areas: ["Nhơn Trạch", "Long Thành", "Biên Hòa"],
    languages: ["Tiếng Việt"],
    mutual: 18,
    friendsCount: 470,
    posts: 34,
    online: true,
    joined: "Tháng 7, 2021",
    photos: GALLERY.slice(2, 8),
    rel: "none",
  },
  {
    id: "u9",
    name: "Đặng Mỹ Linh",
    role: "broker",
    avatarColor: "#9333ea",
    avatarImage: img("photo-1534528741775-53994a69daeb", 400),
    coverColor: "#f3e8ff",
    coverImage: img("photo-1512453979798-5ea266f8880c", 1200),
    title: "Môi giới căn hộ hạng sang",
    location: "Quận 1, TP.HCM",
    bio: "Chuyên phân khúc căn hộ hàng hiệu trung tâm Quận 1. Phục vụ khách hàng cao cấp với dịch vụ trọn gói, bảo mật thông tin và tư vấn danh mục đầu tư BĐS hạng sang trong và ngoài nước.",
    verified: true,
    company: "Q-Broker Luxury",
    experience: "4 năm kinh nghiệm",
    website: "q-broker.vn/linh.dang",
    phone: "0938 666 888",
    email: "linh.dang@q-broker.vn",
    specialties: ["Căn hộ hạng sang", "Branded residences", "Khách VIP"],
    areas: ["Quận 1", "Quận 3", "Bình Thạnh"],
    languages: ["Tiếng Việt", "Tiếng Anh", "Tiếng Trung"],
    mutual: 9,
    friendsCount: 358,
    posts: 26,
    online: false,
    joined: "Tháng 11, 2022",
    photos: GALLERY.slice(0, 6),
    rel: "none",
  },
  {
    id: "u10",
    name: "Ngô Bảo Nam",
    role: "customer",
    avatarColor: "#d97706",
    avatarImage: img("photo-1633332755192-727a05c4013d", 400),
    coverColor: "#fef3c7",
    coverImage: img("photo-1444723121867-7a241cacace9", 1200),
    title: "Nhà đầu tư dài hạn",
    location: "Vũng Tàu",
    bio: "Phân bổ danh mục vào BĐS ven biển Vũng Tàu – Hồ Tràm. Ưu tiên sản phẩm dòng tiền và tiềm năng tăng giá, kỳ vọng nắm giữ 3–5 năm. Quan tâm shophouse và second home gần biển.",
    verified: false,
    company: "Nhà đầu tư cá nhân",
    experience: "Đầu tư dài hạn",
    phone: "0909 777 999",
    email: "nam.ngo@gmail.com",
    specialties: ["BĐS ven biển", "Shophouse", "Second home"],
    areas: ["Vũng Tàu", "Hồ Tràm", "Long Hải"],
    languages: ["Tiếng Việt", "Tiếng Anh"],
    mutual: 6,
    friendsCount: 133,
    posts: 4,
    online: true,
    joined: "Tháng 4, 2023",
    photos: GALLERY.slice(1, 7),
    rel: "none",
  },
  {
    id: "u11",
    name: "Trịnh Thu Hà",
    role: "customer",
    avatarColor: "#e11d48",
    avatarImage: img("photo-1524504388940-b1c1722653e1", 400),
    coverColor: "#ffe4e6",
    coverImage: img("photo-1486406146926-c627a92ad1ab", 1200),
    title: "Tìm biệt thự ven sông",
    location: "TP. Thủ Đức",
    bio: "Quan tâm biệt thự compound ven sông khu Đông. Mong tìm được cộng đồng sống xanh, an ninh cho gia đình có trẻ nhỏ. Ưu tiên dự án đã bàn giao, tiện ích nội khu đầy đủ và pháp lý sổ hồng.",
    verified: false,
    company: "Khách hàng cá nhân",
    experience: "Mua để ở",
    phone: "0944 888 000",
    email: "ha.trinh@gmail.com",
    specialties: ["Biệt thự compound", "Ven sông", "Sống xanh"],
    areas: ["TP. Thủ Đức", "Quận 2", "Quận 9"],
    languages: ["Tiếng Việt"],
    mutual: 2,
    friendsCount: 97,
    posts: 3,
    online: false,
    joined: "Tháng 10, 2023",
    photos: GALLERY.slice(2, 8),
    rel: "none",
  },
  {
    id: "u12",
    name: "Phan Quốc Việt",
    role: "broker",
    avatarColor: "#4f46e5",
    avatarImage: img("photo-1472099645785-5658abf4ff4e", 400),
    coverColor: "#e0e7ff",
    coverImage: img("photo-1470071459604-3b5ec3a7fe05", 1200),
    title: "Môi giới khu công nghiệp",
    location: "Bình Phước",
    bio: "Chuyên nhà xưởng, kho bãi và đất khu công nghiệp Bình Phước – Bình Dương. Đối tác của nhiều doanh nghiệp FDI, hỗ trợ thủ tục thuê đất KCN, xây dựng và pháp lý đầu tư sản xuất.",
    verified: true,
    company: "Q-Broker Industrial",
    experience: "7 năm kinh nghiệm",
    website: "q-broker.vn/viet.phan",
    phone: "0913 999 111",
    email: "viet.phan@q-broker.vn",
    specialties: ["Nhà xưởng", "Kho bãi", "Đất KCN"],
    areas: ["Bình Phước", "Bình Dương", "Đồng Nai"],
    languages: ["Tiếng Việt", "Tiếng Anh"],
    mutual: 21,
    friendsCount: 588,
    posts: 41,
    online: false,
    joined: "Tháng 6, 2020",
    photos: GALLERY.slice(0, 6),
    rel: "none",
  },
  {
    id: "u13",
    name: "Lý Gia Hân",
    role: "customer",
    avatarColor: "#0284c7",
    avatarImage: img("photo-1573496359142-b8d87734a5a2", 400),
    coverColor: "#e0f2fe",
    coverImage: img("photo-1512917774080-9991f1c4c750", 1200),
    title: "Mua căn hộ lần đầu",
    location: "Quận 9, TP.HCM",
    bio: "Vợ chồng trẻ tìm căn hộ 2PN vừa túi tiền khu Quận 9. Cần môi giới tư vấn vay ngân hàng và pháp lý chi tiết, ưu tiên dự án gần metro và trường học. Ngân sách 2–2,5 tỷ, có thể vay tới 60%.",
    verified: false,
    company: "Khách hàng cá nhân",
    experience: "Mua lần đầu",
    phone: "0977 000 222",
    email: "han.ly@gmail.com",
    specialties: ["Căn hộ 2PN", "Vay ngân hàng", "Gần metro"],
    areas: ["Quận 9", "TP. Thủ Đức", "Quận 2"],
    languages: ["Tiếng Việt"],
    mutual: 4,
    friendsCount: 156,
    posts: 6,
    online: true,
    joined: "Tháng 2, 2024",
    photos: GALLERY.slice(1, 7),
    rel: "none",
  },
  {
    id: "u14",
    name: "Cao Minh Đức",
    role: "broker",
    avatarColor: "#059669",
    avatarImage: img("photo-1607746882042-944635dfe10e", 400),
    coverColor: "#d1fae5",
    coverImage: img("photo-1449824913935-59a10b8d2000", 1200),
    title: "Chuyên nhà phố trung tâm",
    location: "Quận 3, TP.HCM",
    bio: "Am hiểu từng con hẻm khu trung tâm Quận 1, Quận 3. Chuyên nhà phố mặt tiền kinh doanh và cho thuê dòng tiền, định giá sát thị trường và thương lượng tốt cho cả bên mua lẫn bên bán.",
    verified: true,
    company: "Q-Broker",
    experience: "5 năm kinh nghiệm",
    website: "q-broker.vn/duc.cao",
    phone: "0906 111 333",
    email: "duc.cao@q-broker.vn",
    specialties: ["Nhà phố mặt tiền", "Kinh doanh", "Cho thuê"],
    areas: ["Quận 1", "Quận 3", "Quận 10"],
    languages: ["Tiếng Việt", "Tiếng Anh"],
    mutual: 13,
    friendsCount: 402,
    posts: 29,
    online: false,
    joined: "Tháng 9, 2021",
    photos: GALLERY.slice(2, 8),
    rel: "none",
  },
];

/** Tra cứu nhanh 1 người theo id (dùng cho route trang cá nhân). */
export function getFriendPerson(id: string): FriendPerson | undefined {
  return FRIEND_PEOPLE.find((p) => p.id === id);
}

/**
 * Vài "bạn chung" để hiển thị preview trên trang cá nhân — lấy người
 * khác cùng nhóm role được phép, khác chính người đang xem.
 */
export function mutualPreview(
  person: FriendPerson,
  viewer?: RoleId,
  take = 5
): FriendPerson[] {
  const allowed = friendableRoles(viewer);
  return FRIEND_PEOPLE.filter(
    (p) => p.id !== person.id && allowed.includes(p.role)
  ).slice(0, take);
}
