// =============================================================
// DỮ LIỆU MẪU cho trang TIN TỨC (/realtor/tin-tuc)
// Bố cục mô phỏng các trang tin BĐS thế giới:
// - Zillow Front Porch / Porchlight: bài featured + chuyên mục
//   (market trends, guides, first-person stories) + newsletter
// - Realtor.com News & Insights: widget số liệu thị trường,
//   sidebar "most read"
// =============================================================

export type NewsCategoryId =
  | "thi-truong"
  | "chinh-sach"
  | "tai-chinh"
  | "du-an"
  | "cam-nang"
  | "dau-gia";

export interface NewsCategory {
  id: NewsCategoryId;
  label: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: NewsCategoryId;
  date: string; // "05/07/2026"
  readMins: number;
  author: string;
  views: number; // dùng xếp "Đọc nhiều nhất"
  featured?: boolean; // bài hero đầu trang
}

/** Một dòng trong widget "Chỉ số thị trường" (giá TB theo thành phố) */
export interface MarketIndexRow {
  city: string;
  price: string; // giá TB, vd "68,5 tr/m²"
  change: number; // % so với quý trước (+/-)
}

export const NEWS_CATEGORIES: NewsCategory[] = [
  { id: "thi-truong", label: "Thị trường" },
  { id: "chinh-sach", label: "Chính sách & Quy hoạch" },
  { id: "tai-chinh", label: "Tài chính - Lãi suất" },
  { id: "du-an", label: "Dự án mới" },
  { id: "cam-nang", label: "Cẩm nang" },
  { id: "dau-gia", label: "Đấu giá" },
];

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=70`;

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "n1",
    title:
      "Thị trường căn hộ TP.HCM quý III/2026: nguồn cung tăng 40%, giá vẫn neo cao",
    excerpt:
      "Hơn 12.000 căn hộ mới dự kiến mở bán trong quý III, tập trung ở khu Đông. Dù nguồn cung cải thiện, giá sơ cấp trung bình vẫn tăng 6% theo năm do chi phí đất và lãi vay của chủ đầu tư.",
    image: img("photo-1545324418-cc1a3fa10c00"),
    category: "thi-truong",
    date: "05/07/2026",
    readMins: 6,
    author: "Minh Anh",
    views: 15420,
    featured: true,
  },
  {
    id: "n2",
    title: "Lãi suất vay mua nhà giảm về 7,2%/năm — thấp nhất 3 năm",
    excerpt:
      "Bốn ngân hàng lớn đồng loạt hạ lãi suất gói vay mua nhà ở thực. Chuyên gia dự báo dòng tiền sẽ quay lại phân khúc căn hộ tầm trung ngay trong quý này.",
    image: img("photo-1554224155-6726b3ff858f"),
    category: "tai-chinh",
    date: "04/07/2026",
    readMins: 4,
    author: "Quốc Bảo",
    views: 12850,
  },
  {
    id: "n3",
    title: "Chính thức: bảng giá đất mới áp dụng từ 01/01/2027, sát giá thị trường",
    excerpt:
      "Bảng giá đất điều chỉnh tiệm cận giá giao dịch thực tế sẽ tác động trực tiếp tới thuế, phí chuyển nhượng và chi phí đền bù giải phóng mặt bằng.",
    image: img("photo-1450101499163-c8848c66ca85"),
    category: "chinh-sach",
    date: "03/07/2026",
    readMins: 8,
    author: "Thu Hằng",
    views: 11240,
  },
  {
    id: "n4",
    title: "Toàn cảnh 5 dự án hạ tầng nghìn tỷ đổi diện mạo khu Đông TP.HCM",
    excerpt:
      "Vành đai 3, nút giao An Phú, metro số 1 nối dài... — bản đồ hạ tầng đang vẽ lại mặt bằng giá bất động sản khu Đông trong 5 năm tới.",
    image: img("photo-1477959858617-67f85cf4f1df"),
    category: "chinh-sach",
    date: "02/07/2026",
    readMins: 7,
    author: "Minh Anh",
    views: 9860,
  },
  {
    id: "n5",
    title: "Ecopark công bố phân khu mới ven hồ 54 ha, mở bán cuối tháng 7",
    excerpt:
      "Phân khu Aqua Forest gồm 1.200 sản phẩm thấp tầng và căn hộ, quy hoạch 60% diện tích cho cây xanh mặt nước — mức hiếm có ở các đại đô thị phía Bắc.",
    image: img("photo-1512917774080-9991f1c4c750"),
    category: "du-an",
    date: "01/07/2026",
    readMins: 5,
    author: "Hải Đăng",
    views: 8420,
  },
  {
    id: "n6",
    title: "Mua nhà lần đầu: 7 bước kiểm tra pháp lý trước khi xuống cọc",
    excerpt:
      "Từ tra cứu quy hoạch, xác minh sổ hồng tới kiểm tra thế chấp ngân hàng — checklist giúp người mua lần đầu tránh 90% rủi ro phổ biến.",
    image: img("photo-1560518883-ce09059eeffa"),
    category: "cam-nang",
    date: "30/06/2026",
    readMins: 9,
    author: "Thu Hằng",
    views: 13670,
  },
  {
    id: "n7",
    title:
      "Phiên đấu giá online lập kỷ lục: biệt thự Thảo Điền chốt 52 tỷ sau 28 lượt trả",
    excerpt:
      "Phiên livestream đấu giá trên Q-Broker thu hút hơn 4.000 người xem trực tiếp. Mức chốt cao hơn 18% giá khởi điểm — kỷ lục mới của kênh đấu giá trực tuyến.",
    image: img("photo-1613490493576-7fde63acd811"),
    category: "dau-gia",
    date: "29/06/2026",
    readMins: 4,
    author: "Quốc Bảo",
    views: 10930,
  },
  {
    id: "n8",
    title: "Đất nền vùng ven Hà Nội: sóng thật hay sốt ảo?",
    excerpt:
      "Giá đất một số huyện ven tăng 15–20% chỉ trong 2 tháng. Dữ liệu giao dịch thực tế cho thấy thanh khoản không theo kịp mức tăng giá rao.",
    image: img("photo-1500382017468-9049fed747ef"),
    category: "thi-truong",
    date: "28/06/2026",
    readMins: 6,
    author: "Hải Đăng",
    views: 7650,
  },
  {
    id: "n9",
    title: "Hướng dẫn định giá nhà trước khi bán: 5 phương pháp môi giới hay dùng",
    excerpt:
      "So sánh giao dịch tương đồng, suất vốn hoá dòng tiền cho thuê, chi phí thay thế... — và cách kết hợp chúng để ra giá bán không hớ.",
    image: img("photo-1460317442991-0ec209397118"),
    category: "cam-nang",
    date: "27/06/2026",
    readMins: 8,
    author: "Minh Anh",
    views: 6980,
  },
  {
    id: "n10",
    title: "Vốn FDI vào bất động sản 6 tháng đạt 2,8 tỷ USD, tăng 34%",
    excerpt:
      "Khối ngoại đổ mạnh vào bất động sản công nghiệp và văn phòng hạng A. Ba thương vụ M&A lớn nhất đều thuộc về nhà đầu tư Singapore và Nhật Bản.",
    image: img("photo-1486406146926-c627a92ad1ab"),
    category: "thi-truong",
    date: "26/06/2026",
    readMins: 5,
    author: "Thu Hằng",
    views: 5840,
  },
  {
    id: "n11",
    title: "Gói tín dụng 120.000 tỷ cho nhà ở xã hội: đã giải ngân được bao nhiêu?",
    excerpt:
      "Sau nhiều lần hạ lãi suất và nới điều kiện, tốc độ giải ngân đã cải thiện nhưng vẫn xa mục tiêu. Điểm nghẽn lớn nhất nằm ở nguồn cung dự án đủ điều kiện.",
    image: img("photo-1560520653-9e0e4c89eb11"),
    category: "tai-chinh",
    date: "25/06/2026",
    readMins: 7,
    author: "Quốc Bảo",
    views: 4720,
  },
  {
    id: "n12",
    title: "Vinhomes khởi công đại đô thị 460 ha tại Long An, quy mô 5 tỷ USD",
    excerpt:
      "Dự án nằm giáp ranh TP.HCM qua trục Nguyễn Hữu Thọ nối dài, định vị phân khúc vừa túi tiền — động thái đón đầu làn sóng giãn dân khỏi nội đô.",
    image: img("photo-1503387762-592deb58ef4e"),
    category: "du-an",
    date: "24/06/2026",
    readMins: 5,
    author: "Hải Đăng",
    views: 9120,
  },
];

/** Widget "Chỉ số thị trường" — giá TB căn hộ & biến động theo quý */
export const MARKET_INDEX: MarketIndexRow[] = [
  { city: "TP.HCM", price: "68,5 tr/m²", change: 3.2 },
  { city: "Hà Nội", price: "62,4 tr/m²", change: 4.1 },
  { city: "Đà Nẵng", price: "48,7 tr/m²", change: 1.8 },
  { city: "Bình Dương", price: "38,2 tr/m²", change: 2.5 },
  { city: "Khánh Hoà", price: "41,6 tr/m²", change: -0.7 },
];

/** Map nhanh id -> nhãn chuyên mục */
export const CATEGORY_LABEL: Record<NewsCategoryId, string> =
  Object.fromEntries(
    NEWS_CATEGORIES.map((c) => [c.id, c.label])
  ) as Record<NewsCategoryId, string>;

/** Top bài đọc nhiều nhất (cho sidebar) */
export const MOST_READ: NewsArticle[] = [...NEWS_ARTICLES]
  .sort((a, b) => b.views - a.views)
  .slice(0, 5);
