// =============================================================
// DỮ LIỆU MẪU cho trang DỰ ÁN (/realtor/du-an)
// Mô hình theo cách "trang dự án" của SalePro / SaleReal:
//   - Danh sách dự án (card) + bộ lọc trạng thái / khu vực.
//   - Chi tiết dự án: tổng quan, loại hình, phân khu, tiện ích,
//     chính sách bán hàng và GIỎ HÀNG căn (bảng điện) có lọc.
// Giá theo VND. Ảnh dùng Unsplash. Thiết kế shape để sau thay bằng API.
// =============================================================

export type ProjectStatus = "Đang mở bán" | "Sắp mở bán" | "Đã bàn giao";

/** Trạng thái mỗi căn trong giỏ hàng (bảng điện). */
export type UnitStatus = "available" | "hold" | "sold";

/** Một căn trong giỏ hàng dự án. */
export interface ProjectUnit {
  code: string; // mã căn, vd "S1.05-12A"
  subdivision: string; // tên phân khu
  type: string; // loại hình: Căn hộ / Biệt thự / Liền kề / Shophouse
  floor?: number | string; // tầng (căn hộ) hoặc "-" với thấp tầng
  area: number; // diện tích (m²)
  price: number; // giá bán (VND)
  direction: string; // hướng
  status: UnitStatus; // còn hàng / giữ chỗ / đã bán
}

/** Một phân khu trong dự án. */
export interface Subdivision {
  name: string;
  area: string; // quy mô, vd "37 ha"
  units: number; // số căn
  priceRange: string; // vd "13 - 28 tỷ"
}

/** Một nhóm loại hình sản phẩm. */
export interface PropertyType {
  name: string; // vd "Biệt thự đơn lập"
  areaRange: string; // vd "168 - 465 m²"
  priceRange: string; // vd "21 - 112 tỷ"
  icon: string; // tên icon lucide
}

/** Tiện ích tiêu điểm. */
export interface Amenity {
  name: string;
  desc: string;
  icon: string;
}

/** Điểm kết nối vùng (vị trí & liên kết). */
export interface ConnPoint {
  place: string;
  time: string; // vd "15 phút" / "liền kề"
  icon: string;
}

/** Mốc tiến độ dự án. */
export interface ProgressStep {
  period: string; // vd "Q2/2026"
  milestone: string;
  done: boolean;
}

/** Câu hỏi thường gặp. */
export interface Faq {
  q: string;
  a: string;
}

export interface Project {
  id: string; // slug dùng cho route /realtor/du-an/[id]
  name: string;
  tagline: string; // câu định vị ngắn
  developer: string; // chủ đầu tư
  city: string; // vị trí hiển thị
  region: string; // khu vực để lọc (khớp PROJECT_REGIONS)
  status: ProjectStatus;
  priceFrom: number; // giá "từ ..." (VND) cho card
  cover: string; // ảnh bìa
  gallery: string[]; // ảnh phụ (hero chi tiết)
  // ---- Thông số tổng quan ----
  totalArea: string; // tổng diện tích, vd "457 ha"
  towers?: number; // số toà cao tầng
  lowRiseUnits?: number; // số căn thấp tầng
  handoverYear: number; // năm bàn giao
  legal: string; // pháp lý
  highlights: string[]; // USP ngắn hiện ở hero
  description: string;
  propertyTypes: PropertyType[];
  subdivisions: Subdivision[];
  amenities: Amenity[];
  salesPolicy: string[]; // chính sách bán hàng
  connectivity: ConnPoint[]; // vị trí & liên kết vùng
  progress: ProgressStep[]; // tiến độ triển khai
  faqs: Faq[]; // hỏi đáp
  units: ProjectUnit[]; // giỏ hàng (bảng điện)
  hotline: string;
}

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=70`;

// Kho ảnh dùng chung cho gallery dự án.
const PIC = {
  city1: "photo-1545324418-cc1a3fa10c00",
  city2: "photo-1560448204-e02f11c3d0e2",
  villa: "photo-1613977257363-707ba9348227",
  pool: "photo-1600596542815-ffad4c1539a9",
  aerial: "photo-1502672260266-1c1ef2d93688",
  tower: "photo-1512917774080-9991f1c4c750",
  beach: "photo-1507525428034-b723cf961d3e",
  green: "photo-1448630360428-65456885c650",
  night: "photo-1470071459604-3b5ec3a7fe05",
};

// -------- Bộ tạo giỏ hàng mẫu cho một dự án --------
// Sinh danh sách căn có phân bố trạng thái thực tế (đa số đã bán / giữ chỗ,
// còn lại đang mở) để bảng điện trông "sống".
const DIRECTIONS = ["Đông", "Tây", "Nam", "Bắc", "Đông Nam", "Tây Bắc", "Đông Bắc", "Tây Nam"];

function genUnits(
  prefix: string,
  subdivision: string,
  type: string,
  count: number,
  areaBase: number,
  priceBase: number,
  startFloor = 1,
): ProjectUnit[] {
  const out: ProjectUnit[] = [];
  for (let i = 0; i < count; i++) {
    const floor = startFloor + Math.floor(i / 4);
    const line = (i % 4) + 1;
    const area = areaBase + (i % 5) * 6;
    // giá tăng nhẹ theo tầng + biến thiên diện tích
    const price = priceBase + floor * 40_000_000 + (i % 5) * 120_000_000;
    // phân bố trạng thái: 0-1 còn, 2 giữ chỗ, phần lớn đã bán
    const r = (i * 7 + 3) % 10;
    const status: UnitStatus = r < 3 ? "available" : r < 5 ? "hold" : "sold";
    out.push({
      code: `${prefix}-${String(floor).padStart(2, "0")}${String(line).padStart(2, "0")}`,
      subdivision,
      type,
      floor: type === "Căn hộ" ? floor : "-",
      area,
      price,
      direction: DIRECTIONS[(i * 3) % DIRECTIONS.length],
      status,
    });
  }
  return out;
}

export const PROJECTS: Project[] = [
  {
    id: "vinhomes-global-gate-ha-long",
    name: "Vinhomes Global Gate Hạ Long",
    tagline: "Siêu đô thị phức hợp bên vịnh di sản",
    developer: "Vinhomes",
    city: "TP. Hạ Long, Quảng Ninh",
    region: "Quảng Ninh",
    status: "Đang mở bán",
    priceFrom: 5_500_000_000,
    cover: img(PIC.aerial),
    gallery: [img(PIC.aerial), img(PIC.beach), img(PIC.night), img(PIC.green)],
    totalArea: "6.206 ha",
    lowRiseUnits: 79036,
    handoverYear: 2028,
    legal: "Sổ đỏ lâu dài",
    highlights: ["Biển Lagoon 680 ha", "Sân golf 950 ha", "Giá F0 chủ đầu tư"],
    description:
      "Đại đô thị lớn nhất của Vinhomes quy mô 6.206 ha, vốn đầu tư 18 tỷ USD, quy hoạch cho ~380.000 dân với mật độ xây dựng chỉ 28,5%. Tổ hợp 5 phân khu chủ đề châu lục, tâm điểm là biển Lagoon 680 ha, sân golf 950 ha và VinWonders Park — kết nối trực tiếp vịnh Hạ Long di sản.",
    propertyTypes: [
      { name: "Liền kề", areaRange: "75 - 120 m²", priceRange: "5,5 - 12 tỷ", icon: "Building" },
      { name: "Shophouse", areaRange: "90 - 160 m²", priceRange: "12 - 25 tỷ", icon: "Store" },
      { name: "Biệt thự song lập", areaRange: "160 - 250 m²", priceRange: "18 - 28 tỷ", icon: "Home" },
      { name: "Biệt thự đơn lập", areaRange: "250 - 500 m²", priceRange: "35 - 60+ tỷ", icon: "Castle" },
    ],
    subdivisions: [
      { name: "Phân khu Châu Âu", area: "1.480 ha", units: 29799, priceRange: "12 - 60 tỷ" },
      { name: "Phân khu Châu Á", area: "1.550 ha", units: 13133, priceRange: "5,5 - 40 tỷ" },
      { name: "Phân khu Châu Mỹ", area: "935 ha", units: 15139, priceRange: "12 - 45 tỷ" },
      { name: "Phân khu Châu Úc", area: "792 ha", units: 7285, priceRange: "8 - 30 tỷ" },
      { name: "Phân khu Kỳ Quan Mới", area: "788 ha", units: 13680, priceRange: "5,5 - 25 tỷ" },
    ],
    amenities: [
      { name: "Biển Lagoon 680 ha", desc: "Biển hồ nhân tạo lớn nhất khu vực", icon: "Waves" },
      { name: "Sân golf 950 ha", desc: "Sân golf ven vịnh Hạ Long", icon: "Flag" },
      { name: "Công viên rừng Globe", desc: "Rừng cảnh quan 662 ha", icon: "Trees" },
      { name: "VinWonders Park", desc: "Công viên giải trí 81 ha", icon: "FerrisWheel" },
      { name: "Nhà hát 3.000 chỗ", desc: "Trung tâm biểu diễn nghệ thuật", icon: "Drama" },
      { name: "Vinschool - Vinmec", desc: "Giáo dục & y tế nội khu", icon: "GraduationCap" },
    ],
    salesPolicy: [
      "Giá F0 trực tiếp chủ đầu tư đợt mở bán đầu tiên",
      "Hỗ trợ lãi suất 0% và ân hạn gốc tới 30 tháng",
      "Chiết khấu tới 12% cho khách thanh toán sớm",
      "Đặt cọc thiện chí hoàn 100% nếu không ký hợp đồng",
    ],
    connectivity: [
      { place: "Cao tốc Hà Nội – Hải Phòng – Hạ Long", time: "kết nối trực tiếp", icon: "Milestone" },
      { place: "Sân bay quốc tế Vân Đồn", time: "40 phút", icon: "Plane" },
      { place: "Vịnh Hạ Long (di sản UNESCO)", time: "10 phút", icon: "Waves" },
      { place: "Trung tâm TP. Hạ Long", time: "15 phút", icon: "Building2" },
    ],
    progress: [
      { period: "12/2025", milestone: "Khởi công dự án", done: true },
      { period: "Q2/2026", milestone: "Mở bán đợt 1 – giá F0", done: true },
      { period: "2026 – 2028", milestone: "Thi công hạ tầng & thấp tầng", done: false },
      { period: "2028 – 2030", milestone: "Bàn giao theo giai đoạn", done: false },
    ],
    faqs: [
      { q: "Giá bán hiện tại bao nhiêu?", a: "Sản phẩm thấp tầng có giá F0 từ 5,5 tỷ (liền kề) tới 60+ tỷ (biệt thự đơn lập), tuỳ phân khu và hướng view." },
      { q: "Pháp lý dự án thế nào?", a: "Sản phẩm thấp tầng sở hữu lâu dài, sổ đỏ trao tay theo tiến độ bàn giao." },
      { q: "Chính sách thanh toán ra sao?", a: "Hỗ trợ lãi suất 0% và ân hạn gốc tới 30 tháng, chiết khấu tới 12% cho khách thanh toán sớm." },
    ],
    units: [
      ...genUnits("EU", "Phân khu Châu Âu", "Shophouse", 14, 90, 12_000_000_000),
      ...genUnits("AS", "Phân khu Châu Á", "Liền kề", 16, 75, 5_500_000_000),
      ...genUnits("KQ", "Phân khu Kỳ Quan Mới", "Liền kề", 10, 80, 6_000_000_000),
    ],
    hotline: "0967 006 666",
  },
  {
    id: "ocean-park-2",
    name: "Vinhomes Ocean Park 2",
    tagline: "Thành phố biển hồ giữa lòng Ocean City",
    developer: "Vinhomes",
    city: "Gia Lâm - Văn Giang, Hưng Yên",
    region: "Hà Nội & vùng ven",
    status: "Đang mở bán",
    priceFrom: 6_000_000_000,
    cover: img(PIC.city1),
    gallery: [img(PIC.city1), img(PIC.aerial), img(PIC.pool), img(PIC.night)],
    totalArea: "457 ha",
    towers: 24,
    lowRiseUnits: 13000,
    handoverYear: 2024,
    legal: "Sổ đỏ / sổ hồng lâu dài",
    highlights: ["Biển tạo sóng 18 ha", "7% hỗ trợ về ở sớm", "30% nhận nhà"],
    description:
      "Đại đô thị biển hồ quy mô 457 ha với công viên biển tạo sóng Royal Wave Park, hồ nước mặn Laguna và hệ tiện ích all-in-one. Kết nối trung tâm Hà Nội qua Vành đai 3.5 và cao tốc, đầy đủ Vincom, Vinschool, Vinmec ngay nội khu.",
    propertyTypes: [
      { name: "Biệt thự đơn lập", areaRange: "168 - 465 m²", priceRange: "21 - 112 tỷ", icon: "Castle" },
      { name: "Biệt thự song lập", areaRange: "120 - 238 m²", priceRange: "13 - 40 tỷ", icon: "Home" },
      { name: "Liền kề", areaRange: "48 - 164 m²", priceRange: "6 - 24 tỷ", icon: "Building" },
      { name: "Shophouse", areaRange: "48 - 274 m²", priceRange: "6 - 40 tỷ", icon: "Store" },
    ],
    subdivisions: [
      { name: "San Hô", area: "37 ha", units: 2326, priceRange: "13 - 28 tỷ" },
      { name: "Cọ Xanh", area: "37 ha", units: 2326, priceRange: "15 - 35 tỷ" },
      { name: "Đảo Dừa", area: "24,6 ha", units: 1461, priceRange: "13 - 40 tỷ" },
      { name: "Sao Biển", area: "32 ha", units: 2402, priceRange: "13 - 28 tỷ" },
      { name: "Hải Âu", area: "21,5 ha", units: 1372, priceRange: "15 - 40 tỷ" },
      { name: "Chà Là", area: "26,5 ha", units: 1801, priceRange: "13 - 35 tỷ" },
    ],
    amenities: [
      { name: "Royal Wave Park", desc: "Công viên biển tạo sóng 18 ha", icon: "Waves" },
      { name: "Laguna", desc: "Hồ nước mặn 9,3 ha", icon: "Droplets" },
      { name: "Kingdom Avenue", desc: "Đại lộ ánh sáng dài 1 km", icon: "Sparkles" },
      { name: "Vincom Mega Mall", desc: "Trung tâm thương mại nội khu", icon: "ShoppingBag" },
      { name: "Vinschool", desc: "Hệ thống giáo dục liên cấp", icon: "GraduationCap" },
      { name: "Vinmec", desc: "Bệnh viện tiêu chuẩn quốc tế", icon: "HeartPulse" },
    ],
    salesPolicy: [
      "Hỗ trợ lãi suất 0% tới 30 tháng",
      "Chiết khấu 7% khi về ở sớm",
      "Thanh toán 30% nhận nhà, phần còn lại theo tiến độ",
      "Quà tặng nội thất tới 300 triệu cho căn thấp tầng",
    ],
    connectivity: [
      { place: "Vành đai 3.5 & cao tốc", time: "kết nối trực tiếp", icon: "Milestone" },
      { place: "Trung tâm Hà Nội", time: "20 phút", icon: "Building2" },
      { place: "Sân bay Nội Bài", time: "45 phút", icon: "Plane" },
      { place: "Ocean Park 1 (liền kề)", time: "sát ranh", icon: "MapPin" },
    ],
    progress: [
      { period: "2022", milestone: "Khởi công dự án", done: true },
      { period: "2023", milestone: "Mở bán các phân khu", done: true },
      { period: "2024", milestone: "Bàn giao thấp tầng", done: true },
      { period: "2024 – 2025", milestone: "Hoàn thiện tiện ích biển", done: false },
    ],
    faqs: [
      { q: "Dự án đã bàn giao chưa?", a: "Nhiều phân khu thấp tầng đã bàn giao và có cư dân về ở." },
      { q: "Tiện ích biển đã hoạt động chưa?", a: "Công viên biển Royal Wave Park và hồ Laguna đã đi vào vận hành." },
      { q: "Còn quỹ căn không?", a: "Còn quỹ căn thứ cấp và một số căn chủ đầu tư, xem chi tiết ở bảng giỏ hàng." },
    ],
    units: [
      ...genUnits("SH1", "San Hô", "Liền kề", 12, 90, 13_000_000_000),
      ...genUnits("SB2", "Sao Biển", "Shophouse", 12, 110, 18_000_000_000),
      ...genUnits("DD3", "Đảo Dừa", "Biệt thự song lập", 8, 168, 24_000_000_000),
    ],
    hotline: "0938 007 778",
  },
  {
    id: "vinhomes-central-park",
    name: "Vinhomes Central Park",
    tagline: "Sống đẳng cấp bên sông Sài Gòn",
    developer: "Vinhomes",
    city: "Bình Thạnh, TP.HCM",
    region: "TP. Hồ Chí Minh",
    status: "Đã bàn giao",
    priceFrom: 4_200_000_000,
    cover: img(PIC.tower),
    gallery: [img(PIC.tower), img(PIC.city2), img(PIC.pool), img(PIC.night)],
    totalArea: "43,9 ha",
    towers: 18,
    lowRiseUnits: 60,
    handoverYear: 2019,
    legal: "Sổ hồng lâu dài",
    highlights: ["Toà Landmark 81", "Công viên ven sông 14 ha", "Đã có cư dân"],
    description:
      "Khu phức hợp căn hộ cao cấp bên sông Sài Gòn, tâm điểm là toà nhà cao nhất Việt Nam Landmark 81. Công viên ven sông 14 ha, tiện ích 5 sao, cư dân hiện hữu — dòng sản phẩm mua ở và cho thuê ổn định.",
    propertyTypes: [
      { name: "Căn hộ 1PN", areaRange: "50 - 54 m²", priceRange: "3,2 - 3,8 tỷ", icon: "Building2" },
      { name: "Căn hộ 2PN", areaRange: "68 - 82 m²", priceRange: "4,2 - 5,5 tỷ", icon: "Building2" },
      { name: "Căn hộ 3PN", areaRange: "100 - 120 m²", priceRange: "6,5 - 9 tỷ", icon: "Building2" },
      { name: "Penthouse", areaRange: "200 - 400 m²", priceRange: "20 - 40 tỷ", icon: "Crown" },
    ],
    subdivisions: [
      { name: "Toà Park", area: "6 toà", units: 3200, priceRange: "3,2 - 9 tỷ" },
      { name: "Toà Central", area: "3 toà", units: 1800, priceRange: "5 - 12 tỷ" },
      { name: "Landmark", area: "3 toà", units: 1200, priceRange: "7 - 40 tỷ" },
    ],
    amenities: [
      { name: "Công viên ven sông", desc: "Công viên 14 ha dọc sông Sài Gòn", icon: "Trees" },
      { name: "Landmark 81 SkyView", desc: "Đài quan sát cao nhất VN", icon: "Building2" },
      { name: "Bến du thuyền", desc: "Marina bên sông", icon: "Sailboat" },
      { name: "Vinschool", desc: "Trường liên cấp nội khu", icon: "GraduationCap" },
    ],
    salesPolicy: [
      "Ngân hàng hỗ trợ vay tới 70%",
      "Nhận nhà ở ngay, có sổ hồng",
      "Cam kết cho thuê 6%/năm với căn cho thuê",
    ],
    connectivity: [
      { place: "Trung tâm Quận 1", time: "10 phút", icon: "Building2" },
      { place: "Sân bay Tân Sơn Nhất", time: "20 phút", icon: "Plane" },
      { place: "Metro Bến Thành – Suối Tiên", time: "gần ga", icon: "TrainFront" },
      { place: "Sông Sài Gòn", time: "view trực diện", icon: "Waves" },
    ],
    progress: [
      { period: "2016", milestone: "Khởi công dự án", done: true },
      { period: "2018", milestone: "Cất nóc Landmark 81", done: true },
      { period: "2019", milestone: "Bàn giao & vận hành", done: true },
      { period: "Hiện tại", milestone: "Cư dân ổn định, đầy đủ tiện ích", done: true },
    ],
    faqs: [
      { q: "Đã có sổ hồng chưa?", a: "Các toà đã bàn giao đều có sổ hồng lâu dài." },
      { q: "Khai thác cho thuê có tốt không?", a: "Tỷ lệ lấp đầy cao, dòng tiền ổn định nhờ vị trí trung tâm và tiện ích 5 sao." },
      { q: "Giá thứ cấp khoảng bao nhiêu?", a: "Từ khoảng 3,2 tỷ cho căn 1PN tới 40 tỷ cho penthouse." },
    ],
    units: [
      ...genUnits("P5", "Toà Park", "Căn hộ", 20, 50, 3_200_000_000, 8),
      ...genUnits("C2", "Toà Central", "Căn hộ", 16, 68, 4_500_000_000, 12),
    ],
    hotline: "0901 234 567",
  },
  {
    id: "the-global-city",
    name: "The Global City",
    tagline: "Trung tâm mới của TP.HCM",
    developer: "Masterise Homes",
    city: "TP. Thủ Đức, TP.HCM",
    region: "TP. Hồ Chí Minh",
    status: "Đang mở bán",
    priceFrom: 12_000_000_000,
    cover: img(PIC.city2),
    gallery: [img(PIC.city2), img(PIC.aerial), img(PIC.green), img(PIC.night)],
    totalArea: "117,4 ha",
    towers: 6,
    lowRiseUnits: 2000,
    handoverYear: 2025,
    legal: "Sổ hồng lâu dài",
    highlights: ["SOHO nhà phố thương mại", "Đại lộ SOHO Boulevard", "Kênh đào & quảng trường"],
    description:
      "Khu đô thị 117 ha do Masterise Homes phát triển, quy hoạch bởi Foster + Partners. Định vị là trung tâm mới của TP.HCM với nhà phố thương mại SOHO, quảng trường trung tâm và kênh đào cảnh quan.",
    propertyTypes: [
      { name: "Nhà phố SOHO", areaRange: "95 - 140 m²", priceRange: "12 - 22 tỷ", icon: "Store" },
      { name: "Biệt thự", areaRange: "180 - 300 m²", priceRange: "28 - 60 tỷ", icon: "Castle" },
      { name: "Căn hộ hàng hiệu", areaRange: "60 - 120 m²", priceRange: "7 - 18 tỷ", icon: "Building2" },
    ],
    subdivisions: [
      { name: "The Soho", area: "Nhà phố", units: 800, priceRange: "12 - 22 tỷ" },
      { name: "The Manhattan", area: "Nhà phố & biệt thự", units: 900, priceRange: "20 - 60 tỷ" },
    ],
    amenities: [
      { name: "SOHO Boulevard", desc: "Đại lộ thương mại sầm uất", icon: "Sparkles" },
      { name: "Quảng trường trung tâm", desc: "Central Plaza 3 ha", icon: "LandPlot" },
      { name: "Kênh đào cảnh quan", desc: "Canal dạo bộ", icon: "Droplets" },
      { name: "Công viên ánh sáng", desc: "Light Park về đêm", icon: "Lightbulb" },
    ],
    salesPolicy: [
      "Ân hạn gốc, hỗ trợ lãi suất 24 tháng",
      "Chiết khấu tới 9,5% thanh toán nhanh",
      "Cam kết mua lại với sản phẩm đầu tư",
    ],
    connectivity: [
      { place: "Trung tâm Quận 1", time: "15 phút", icon: "Building2" },
      { place: "Cao tốc Long Thành – Dầu Giây", time: "10 phút", icon: "Milestone" },
      { place: "Metro & Vành đai 2", time: "kết nối", icon: "TrainFront" },
      { place: "Thảo Điền – An Phú", time: "liền kề", icon: "MapPin" },
    ],
    progress: [
      { period: "2022", milestone: "Khởi công dự án", done: true },
      { period: "2023", milestone: "Mở bán phân khu The Soho", done: true },
      { period: "2024", milestone: "Bàn giao The Soho", done: true },
      { period: "2025", milestone: "Bàn giao The Manhattan", done: false },
    ],
    faqs: [
      { q: "Nhà phố SOHO khai thác thế nào?", a: "Vừa ở vừa kinh doanh, mặt tiền đại lộ thương mại SOHO Boulevard sầm uất." },
      { q: "Pháp lý ra sao?", a: "Sản phẩm sở hữu sổ hồng lâu dài." },
      { q: "Còn quỹ căn không?", a: "Còn quỹ căn phân khu The Manhattan, xem chi tiết ở bảng giỏ hàng." },
    ],
    units: [
      ...genUnits("SO", "The Soho", "Shophouse", 14, 95, 12_000_000_000),
      ...genUnits("MH", "The Manhattan", "Biệt thự", 10, 180, 28_000_000_000),
    ],
    hotline: "0902 345 678",
  },
  {
    id: "ecopark-grand",
    name: "Ecopark Grand The Island",
    tagline: "Đảo nghỉ dưỡng xanh giữa lòng Ecopark",
    developer: "Ecopark",
    city: "Văn Giang, Hưng Yên",
    region: "Hà Nội & vùng ven",
    status: "Sắp mở bán",
    priceFrom: 15_000_000_000,
    cover: img(PIC.green),
    gallery: [img(PIC.green), img(PIC.villa), img(PIC.pool), img(PIC.aerial)],
    totalArea: "60 ha",
    lowRiseUnits: 380,
    handoverYear: 2026,
    legal: "Sổ đỏ lâu dài",
    highlights: ["Biệt thự đảo bao quanh sông", "Mật độ xây dựng thấp", "Giữ chỗ ưu tiên"],
    description:
      "Phân khu đảo cao cấp nhất Ecopark, bao quanh bởi sông Bắc Hưng Hải, mật độ cây xanh và mặt nước lớn. Dòng biệt thự đảo giới hạn dành cho giới thượng lưu, hạ tầng và tiện ích nghỉ dưỡng hoàn thiện.",
    propertyTypes: [
      { name: "Biệt thự đảo đơn lập", areaRange: "250 - 500 m²", priceRange: "25 - 70 tỷ", icon: "Castle" },
      { name: "Biệt thự song lập", areaRange: "160 - 240 m²", priceRange: "15 - 30 tỷ", icon: "Home" },
    ],
    subdivisions: [
      { name: "Đảo Trung Tâm", area: "24 ha", units: 180, priceRange: "25 - 70 tỷ" },
      { name: "Đảo Ven Sông", area: "36 ha", units: 200, priceRange: "15 - 40 tỷ" },
    ],
    amenities: [
      { name: "Sông bao quanh đảo", desc: "Mặt nước tự nhiên 4 mặt", icon: "Waves" },
      { name: "Rừng cây xanh", desc: "Mật độ xây dựng chỉ 20%", icon: "Trees" },
      { name: "Bến thuyền nội khu", desc: "Marina dạo sông", icon: "Sailboat" },
      { name: "Clubhouse đảo", desc: "Tiện ích nghỉ dưỡng riêng", icon: "Sparkles" },
    ],
    salesPolicy: [
      "Đặt cọc giữ chỗ ưu tiên chọn căn",
      "Chính sách thanh toán giãn 36 tháng",
      "Hoàn cọc 100% nếu không ký hợp đồng",
    ],
    connectivity: [
      { place: "Trung tâm Hà Nội", time: "25 phút", icon: "Building2" },
      { place: "Vành đai 3.5", time: "kết nối", icon: "Milestone" },
      { place: "Trung tâm Ecopark", time: "liền kề", icon: "Trees" },
      { place: "Sông Bắc Hưng Hải", time: "bao quanh đảo", icon: "Waves" },
    ],
    progress: [
      { period: "2026", milestone: "Khởi công hạ tầng đảo", done: false },
      { period: "Q3/2026", milestone: "Mở bán đợt 1 – nhận giữ chỗ", done: false },
      { period: "2027 – 2028", milestone: "Bàn giao biệt thự đảo", done: false },
    ],
    faqs: [
      { q: "Khi nào mở bán chính thức?", a: "Dự kiến mở bán đợt 1 trong năm 2026, hiện đang nhận đặt chỗ ưu tiên chọn căn." },
      { q: "Đặt giữ chỗ có hoàn tiền không?", a: "Hoàn cọc 100% nếu khách không ký hợp đồng mua bán." },
      { q: "Mật độ xây dựng bao nhiêu?", a: "Chỉ khoảng 20%, phần còn lại là cây xanh và mặt nước bao quanh đảo." },
    ],
    units: [
      ...genUnits("IS", "Đảo Trung Tâm", "Biệt thự đơn lập", 10, 250, 25_000_000_000),
      ...genUnits("RV", "Đảo Ven Sông", "Biệt thự song lập", 12, 160, 15_000_000_000),
    ],
    hotline: "0904 567 890",
  },
];

/** Khu vực để lọc danh sách dự án. */
export const PROJECT_REGIONS: string[] = [
  "TP. Hồ Chí Minh",
  "Hà Nội & vùng ven",
  "Quảng Ninh",
];

export const PROJECT_STATUSES: ProjectStatus[] = [
  "Đang mở bán",
  "Sắp mở bán",
  "Đã bàn giao",
];

/** Màu badge theo trạng thái dự án / căn. */
export const STATUS_TONE: Record<ProjectStatus, string> = {
  "Đang mở bán": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "Sắp mở bán": "bg-amber-50 text-amber-700 ring-amber-200",
  "Đã bàn giao": "bg-slate-100 text-slate-600 ring-slate-200",
};

/** Nhãn + màu cho trạng thái căn trong giỏ hàng. */
export const UNIT_STATUS_META: Record<UnitStatus, { label: string; dot: string; text: string; row: string }> = {
  available: { label: "Còn hàng", dot: "bg-emerald-500", text: "text-emerald-700", row: "hover:bg-emerald-50/50" },
  hold: { label: "Giữ chỗ", dot: "bg-amber-500", text: "text-amber-700", row: "hover:bg-amber-50/50" },
  sold: { label: "Đã bán", dot: "bg-rose-500", text: "text-rose-600", row: "opacity-60 hover:bg-rose-50/40" },
};

/** Tra cứu 1 dự án theo id (slug). */
export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}
