// =============================================================
// DỮ LIỆU MẪU cho trang LIVESTREAM ĐẤU GIÁ (/realtor/livestream)
// - AUCTION_LOTS: các tài sản trong phiên (live + sắp diễn ra)
// - INITIAL_BIDS / INITIAL_CHAT: trạng thái ban đầu (cố định để
//   SSR không lệch hydration; mô phỏng realtime chạy sau khi mount)
// - CHAT_POOL / BIDDER_NAMES: nguồn sinh tin nhắn & lượt trả giá
// =============================================================

/** Hồ sơ pháp lý đầy đủ của tài sản (hiện trong popup "Hồ sơ pháp lý") */
export interface LegalInfo {
  certificate: string; // loại giấy chứng nhận
  certNumber: string; // số giấy chứng nhận
  issuedBy: string; // cơ quan cấp
  owner: string; // chủ sở hữu hiện tại
  landUse: string; // mục đích sử dụng
  landTerm: string; // thời hạn sử dụng
  landArea: string; // diện tích đất / sàn xây dựng
  planning: string; // tình trạng quy hoạch
  dispute: string; // tranh chấp
  mortgage: string; // thế chấp / kê biên
  documents: string[]; // hồ sơ đính kèm trong hồ sơ mời đấu giá
}

export interface AuctionLot {
  id: string;
  title: string;
  address: string;
  city: string;
  image: string;
  area: number; // m²
  legal: string; // pháp lý (tóm tắt)
  legalInfo?: LegalInfo; // hồ sơ pháp lý đầy đủ (popup)
  highlights?: string[]; // điểm nổi bật (hiện ở thẻ thông tin trong phòng live)
  startPrice: number; // giá khởi điểm (VND)
  step: number; // bước giá (VND)
  deposit: number; // tiền đặt trước (VND)
  bidders: number; // số người đủ điều kiện tham gia
  status: "live" | "upcoming";
  startLabel?: string; // giờ bắt đầu (lô sắp diễn ra)
  agency: string; // đơn vị tổ chức đấu giá
  /** % chênh so với giá khởi điểm — dùng cho dải ticker kiểu bảng điện */
  tickerChange: number;
}

export interface AuctionBid {
  id: number;
  name: string; // tên đã che, vd "Trần V. H***"
  price: number;
  delta: number; // số bước giá vừa nâng
  time: string;
  mine?: boolean; // lượt trả giá của chính người xem
}

export interface ChatMessage {
  id: number;
  name: string;
  text: string;
  system?: boolean; // thông báo hệ thống (vào phòng, chốt giá...)
}

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=70`;

export const AUCTION_LOTS: AuctionLot[] = [
  // ---- Hàng chờ phát LIVE (phiên hiện tại + 2 lô kế tiếp) ----
  {
    id: "a1",
    title: "Căn hộ 3PN Vinhomes Central Park, Toà Park 5",
    address: "208 Nguyễn Hữu Cảnh, Phường 22",
    city: "Bình Thạnh, TP.HCM",
    image: img("photo-1568605114967-8130f3a36994"),
    area: 82,
    legal: "Sổ hồng lâu dài",
    highlights: [
      "View sông Sài Gòn & công viên nội khu",
      "Full nội thất cao cấp, nhận nhà ở ngay",
      "Tiện ích 5 sao, an ninh 24/7",
      "Liền kề Landmark 81, trường quốc tế",
    ],
    legalInfo: {
      certificate: "Giấy chứng nhận QSDĐ, QSH nhà ở (Sổ hồng)",
      certNumber: "CS 06841 / HĐ-2019",
      issuedBy: "Sở TN&MT TP.HCM cấp ngày 12/07/2019",
      owner: "Ông Trần Minh Đức & bà Lê Thị Hồng",
      landUse: "Đất ở đô thị (căn hộ chung cư)",
      landTerm: "Lâu dài",
      landArea: "82 m² sàn sử dụng",
      planning: "Không nằm trong quy hoạch giải toả",
      dispute: "Không tranh chấp, khiếu kiện",
      mortgage: "Không thế chấp, không kê biên thi hành án",
      documents: [
        "Bản sao công chứng Sổ hồng",
        "Hợp đồng mua bán với chủ đầu tư Vinhomes",
        "Biên bản bàn giao căn hộ",
        "Chứng thư thẩm định giá độc lập",
        "Quy chế cuộc đấu giá & phiếu trả giá",
      ],
    },
    startPrice: 4_200_000_000,
    step: 50_000_000,
    deposit: 420_000_000,
    bidders: 24,
    status: "live",
    agency: "Công ty Đấu giá Hợp danh Q-Broker",
    tickerChange: 4.8,
  },
  {
    id: "a2",
    title: "Nhà phố Thảo Điền 1 trệt 2 lầu, Đường 41",
    address: "Khu compound Thảo Điền",
    city: "TP. Thủ Đức, TP.HCM",
    image: img("photo-1570129477492-45c003edd2be"),
    area: 220,
    legal: "Sổ hồng riêng",
    highlights: [
      "Khu compound an ninh, yên tĩnh",
      "Gara ô tô trong nhà, đường 8m",
      "Sân vườn riêng, thiết kế tối giản",
      "Gần trường quốc tế BIS, Metro An Phú",
    ],
    legalInfo: {
      certificate: "Giấy chứng nhận QSDĐ, QSH nhà ở (Sổ hồng)",
      certNumber: "CT 21597 / TĐ-2021",
      issuedBy: "Sở TN&MT TP.HCM cấp ngày 03/03/2021",
      owner: "Công ty CP Đầu tư Thảo Điền Land",
      landUse: "Đất ở tại đô thị",
      landTerm: "Lâu dài",
      landArea: "160 m² đất, 220 m² sàn xây dựng (1 trệt 2 lầu)",
      planning: "Phù hợp quy hoạch khu compound Thảo Điền",
      dispute: "Không tranh chấp, ranh giới rõ ràng",
      mortgage: "Đang thế chấp ngân hàng — giải chấp trước khi sang tên",
      documents: [
        "Bản sao công chứng Sổ hồng",
        "Bản vẽ hiện trạng nhà đất",
        "Văn bản cam kết giải chấp của ngân hàng",
        "Chứng thư thẩm định giá độc lập",
        "Quy chế cuộc đấu giá & phiếu trả giá",
      ],
    },
    startPrice: 12_500_000_000,
    step: 100_000_000,
    deposit: 1_250_000_000,
    bidders: 18,
    status: "live",
    agency: "Công ty Đấu giá Hợp danh Q-Broker",
    tickerChange: 2.4,
  },
  {
    id: "a3",
    title: "Biệt thự Ecopark Aqua Bay view hồ",
    address: "Khu Aqua Bay, Ecopark",
    city: "Văn Giang, Hưng Yên",
    image: img("photo-1580587771525-78b9dba3b914"),
    area: 180,
    legal: "Sổ đỏ lâu dài",
    highlights: [
      "View hồ, mật độ cây xanh cao",
      "Sân vườn trước & sau rộng rãi",
      "Bể bơi, sân tennis nội khu",
      "Cách Hà Nội 20 phút lái xe",
    ],
    legalInfo: {
      certificate: "Giấy chứng nhận QSDĐ, QSH nhà ở (Sổ đỏ)",
      certNumber: "CH 08123 / HY-2020",
      issuedBy: "Sở TN&MT tỉnh Hưng Yên cấp ngày 28/09/2020",
      owner: "Bà Nguyễn Thị Thu Hà",
      landUse: "Đất ở nông thôn (biệt thự thấp tầng)",
      landTerm: "Lâu dài",
      landArea: "120 m² đất, 180 m² sàn xây dựng",
      planning: "Thuộc quy hoạch khu đô thị Ecopark đã phê duyệt",
      dispute: "Không tranh chấp",
      mortgage: "Không thế chấp, không kê biên",
      documents: [
        "Bản sao công chứng Sổ đỏ",
        "Hợp đồng mua bán với chủ đầu tư Ecopark",
        "Biên bản bàn giao nhà",
        "Chứng thư thẩm định giá độc lập",
        "Quy chế cuộc đấu giá & phiếu trả giá",
      ],
    },
    startPrice: 7_800_000_000,
    step: 50_000_000,
    deposit: 780_000_000,
    bidders: 15,
    status: "live",
    agency: "Trung tâm DV Đấu giá tài sản Hà Nội",
    tickerChange: 1.9,
  },

  // ---- Sắp diễn ra ----
  {
    id: "a4",
    title: "Penthouse Landmark 81, Tầng 68",
    address: "720A Điện Biên Phủ",
    city: "Bình Thạnh, TP.HCM",
    image: img("photo-1512915922686-57c11dde9b6b"),
    area: 400,
    legal: "Sổ hồng lâu dài",
    startPrice: 32_000_000_000,
    step: 200_000_000,
    deposit: 3_200_000_000,
    bidders: 9,
    status: "upcoming",
    startLabel: "15:30 hôm nay",
    agency: "Công ty Đấu giá Hợp danh Q-Broker",
    tickerChange: 0,
  },
  {
    id: "a5",
    title: "Căn hộ biển Vinpearl Beachfront Trần Phú",
    address: "78 Trần Phú",
    city: "Nha Trang, Khánh Hoà",
    image: img("photo-1502005229762-cf1b2da7c5d6"),
    area: 120,
    legal: "Sổ hồng lâu dài",
    startPrice: 8_700_000_000,
    step: 50_000_000,
    deposit: 870_000_000,
    bidders: 21,
    status: "upcoming",
    startLabel: "16:00 hôm nay",
    agency: "Trung tâm DV Đấu giá tài sản Khánh Hoà",
    tickerChange: 0,
  },
  {
    id: "a6",
    title: "Biệt thự ven biển Hồ Tràm, bể bơi riêng",
    address: "Ven biển Xuyên Mộc",
    city: "Bà Rịa - Vũng Tàu",
    image: img("photo-1613977257363-707ba9348227"),
    area: 200,
    legal: "Sổ đỏ lâu dài",
    startPrice: 9_500_000_000,
    step: 100_000_000,
    deposit: 950_000_000,
    bidders: 12,
    status: "upcoming",
    startLabel: "09:00 ngày mai",
    agency: "Công ty Đấu giá Hợp danh Q-Broker",
    tickerChange: 0,
  },
  {
    id: "a7",
    title: "Nhà phố thương mại The Sailing Tower",
    address: "Thủ Dầu Một",
    city: "Bình Dương",
    image: img("photo-1600585154526-990dced4db0d"),
    area: 150,
    legal: "Sổ hồng riêng",
    startPrice: 6_400_000_000,
    step: 50_000_000,
    deposit: 640_000_000,
    bidders: 16,
    status: "upcoming",
    startLabel: "10:30 ngày mai",
    agency: "Trung tâm DV Đấu giá tài sản Bình Dương",
    tickerChange: 0,
  },
];

/** Lượt trả giá ban đầu của lô đang LIVE (mới nhất đứng đầu) */
export const INITIAL_BIDS: AuctionBid[] = [
  { id: 5, name: "Phạm Q. A***", price: 4_400_000_000, delta: 1, time: "14:02:41" },
  { id: 4, name: "Trần V. H***", price: 4_350_000_000, delta: 1, time: "14:01:58" },
  { id: 3, name: "Lê T. M***", price: 4_300_000_000, delta: 1, time: "14:01:12" },
  { id: 2, name: "Nguyễn D. K***", price: 4_250_000_000, delta: 1, time: "14:00:37" },
  { id: 1, name: "Võ N. S***", price: 4_200_000_000, delta: 0, time: "14:00:00" },
];

/** Chat ban đầu (cũ -> mới) */
export const INITIAL_CHAT: ChatMessage[] = [
  { id: 1, name: "Q-Broker", text: "Phiên đấu giá bắt đầu. Chúc các nhà đầu tư may mắn! 🔨", system: true },
  { id: 2, name: "Minh Trần", text: "View sông đẹp quá, pháp lý sạch nữa 😍" },
  { id: 3, name: "Hoa Nguyễn", text: "Giá khởi điểm 4,2 tỷ là mềm so với thị trường rồi" },
  { id: 4, name: "Tuấn Lê", text: "Ai đi xem thực tế căn này chưa ạ?" },
  { id: 5, name: "Q-Broker", text: "Phạm Q. A*** vừa trả 4,4 tỷ 🔥", system: true },
];

/** Tên người xem dùng để sinh chat & lượt trả giá mô phỏng */
export const BIDDER_NAMES = [
  "Trần V. H***",
  "Lê T. M***",
  "Nguyễn D. K***",
  "Phạm Q. A***",
  "Võ N. S***",
  "Đặng H. P***",
  "Bùi K. L***",
  "Hoàng M. T***",
];

export const CHAT_POOL: { name: string; text: string }[] = [
  { name: "Minh Trần", text: "Căn này cho thuê chắc cũng 25tr/tháng 👍" },
  { name: "Hoa Nguyễn", text: "Bước giá 50 triệu, căng thẳng thật" },
  { name: "Tuấn Lê", text: "Mọi người thấy giá này còn lên nữa không?" },
  { name: "Lan Phạm", text: "Mình theo dõi từ đầu phiên, hồi hộp quá 😂" },
  { name: "Đức Võ", text: "Nội thất full cao cấp mà giá này là ổn" },
  { name: "Thu Hà", text: "Xin thông tin pháp lý chi tiết với ạ" },
  { name: "Khang Đỗ", text: "Đã đặt cọc tham gia lô Landmark chiều nay 🚀" },
  { name: "My Lê", text: "Livestream rõ nét quá, xem tận nơi luôn" },
  { name: "Phúc Bùi", text: "Ai trả 4,5 tỷ đi cho nóng 🔥" },
  { name: "Ngọc Anh", text: "Admin cho hỏi phí sang tên ai chịu ạ?" },
];
