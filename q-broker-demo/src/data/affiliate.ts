// =============================================================
// DỮ LIỆU MẪU cho trang AFFILIATE (/realtor/affiliate)
// Thiết kế theo MÔ HÌNH MỸ, chạy song song HAI LÀN (xem tài liệu
// TAI-LIEU-Affiliate-kieu-My.md):
//
//   • LÀN 1 — Referral / Success Fee (pay-at-closing): nền tảng đưa
//     khách đã sàng lọc cho môi giới; khi CHỐT, môi giới trả lại một
//     % hoa hồng của họ. Chuẩn ngành: referral môi giới 25% (20–30%);
//     nền tảng lead-gen thu cao hơn — Zillow Flex 15–40% (~35%),
//     Realtor.com ReadyConnect 30–38%, Redfin/HomeLight/UpNest 30–33%.
//     Q-Broker chọn 25% để cạnh tranh.
//
//   • LÀN 2 — Affiliate / CPA (link + cookie): trả theo hành động/đơn
//     qua link giới thiệu (đăng ký, gói Pro, lead, khoá học). Cookie
//     30–90 ngày (SaaS 60–90), last-click; trả định kỳ hàng tháng,
//     có ngưỡng tối thiểu — chuẩn Amazon Associates / affiliate network.
// =============================================================

/** Một bước trong quy trình "Cách hoạt động" */
export interface AffiliateStep {
  icon: string; // tên icon lucide-react
  title: string;
  desc: string;
}

/** Hạng đối tác (tier) — quyết định tỷ lệ hoa hồng */
export interface AffiliateTier {
  id: string;
  name: string;
  condition: string; // điều kiện đạt hạng (số giao dịch/quý)
  platformShareRate: number; // % PHÍ GIỚI THIỆU (môi giới trả Q-Broker) mà affiliate nhận
  recurringRate: number; // % recurring gói hội viên
  perks: string[]; // quyền lợi kèm theo
  featured?: boolean; // hạng nổi bật (highlight ở giữa)
}

/** Hoa hồng theo từng loại sản phẩm/dịch vụ */
export interface CommissionProduct {
  icon: string;
  product: string;
  fee: string; // phí nền tảng thu
  commission: string; // phần affiliate nhận
  example: string; // ví dụ tính tiền cụ thể
  payType: "closing" | "recurring" | "flat";
  lane: 1 | 2; // 1 = Referral pay-at-closing (giao dịch); 2 = Affiliate/CPA (dịch vụ)
}

/** Metadata 2 làn theo mô hình Mỹ — hiển thị nhóm ở bảng hoa hồng */
export const LANE_META: Record<1 | 2, { tag: string; title: string; desc: string }> = {
  1: {
    tag: "Làn 1 · Referral",
    title: "Referral giao dịch — pay-at-closing",
    desc: "Khách/deal từ mạng lưới, chỉ tính phí khi CHỐT. Đây là nguồn thu nhập lớn, giống Zillow Flex / Realtor.com ReadyConnect.",
  },
  2: {
    tag: "Làn 2 · Affiliate / CPA",
    title: "Affiliate dịch vụ — link + cookie",
    desc: "Trả theo hành động qua link giới thiệu (gói Pro, đấu giá, khoá học). Dòng tiền đều, có thể recurring — chuẩn affiliate network.",
  },
};

/** Câu hỏi thường gặp */
export interface AffiliateFaq {
  q: string;
  a: string;
}

/** Một dòng trong bảng lịch sử giới thiệu (dashboard demo) */
export interface ReferralRow {
  id: string;
  customer: string; // tên đã che
  product: string;
  date: string;
  value: string; // giá trị giao dịch / gói
  commission: string; // hoa hồng dự kiến/đã nhận
  status: "closed" | "pending" | "consulting";
}

export const AFFILIATE_STEPS: AffiliateStep[] = [
  {
    icon: "UserPlus",
    title: "1. Đăng ký miễn phí",
    desc: "Tạo tài khoản đối tác trong 2 phút, nhận ngay link giới thiệu và mã QR gắn thương hiệu riêng của bạn.",
  },
  {
    icon: "Share2",
    title: "2. Chia sẻ link",
    desc: "Gắn link vào bài viết, video, Zalo, Facebook... Cookie ghi nhận 30 ngày — khách quay lại sau vẫn tính cho bạn.",
  },
  {
    icon: "Handshake",
    title: "3. Khách giao dịch",
    desc: "Khách đăng ký xem nhà, tham gia đấu giá hoặc mua gói hội viên qua link. Hệ thống theo dõi realtime từng bước.",
  },
  {
    icon: "Wallet",
    title: "4. Nhận hoa hồng",
    desc: "Giao dịch chốt thành công là tiền về ví — thanh toán ngày 15 hàng tháng, không giới hạn thu nhập.",
  },
];

export const AFFILIATE_TIERS: AffiliateTier[] = [
  {
    id: "dong",
    name: "Đối tác Đồng",
    condition: "0 – 2 giao dịch chốt / quý",
    platformShareRate: 40,
    recurringRate: 15,
    perks: [
      "Link + mã QR giới thiệu riêng",
      "Dashboard theo dõi realtime",
      "Kho banner, nội dung mẫu",
      "Cookie ghi nhận 30 ngày",
    ],
  },
  {
    id: "bac",
    name: "Đối tác Bạc",
    condition: "3 – 9 giao dịch chốt / quý",
    platformShareRate: 50,
    recurringRate: 20,
    featured: true,
    perks: [
      "Toàn bộ quyền lợi hạng Đồng",
      "Landing page riêng theo tên bạn",
      "Ưu tiên phân bổ khách khu vực",
      "Hỗ trợ tư vấn viên chốt hộ",
    ],
  },
  {
    id: "vang",
    name: "Đối tác Vàng",
    condition: "Từ 10 giao dịch chốt / quý",
    platformShareRate: 60,
    recurringRate: 25,
    perks: [
      "Toàn bộ quyền lợi hạng Bạc",
      "Thưởng quý tới 50.000.000 đ",
      "Quản lý đối tác riêng (1-1)",
      "Mời tham dự sự kiện VIP Q-Broker",
    ],
  },
];

export const COMMISSION_PRODUCTS: CommissionProduct[] = [
  {
    icon: "Home",
    product: "Giao dịch mua bán nhà đất",
    fee: "Môi giới trả Q-Broker 25% hoa hồng của họ",
    commission: "40 – 60% phí giới thiệu",
    example: "Căn 4 tỷ → HH môi giới 80tr → Q-Broker thu 20tr → bạn nhận 8 – 12tr",
    payType: "closing",
    lane: 1,
  },
  {
    icon: "KeyRound",
    product: "Giao dịch cho thuê",
    fee: "Môi giới trả Q-Broker 25% phí thuê nhận được",
    commission: "40 – 60% phí giới thiệu",
    example: "Phí thuê 25tr → Q-Broker thu 6,25tr → bạn nhận 2,5 – 3,75tr",
    payType: "closing",
    lane: 1,
  },
  {
    icon: "Gavel",
    product: "Đấu giá trực tuyến",
    fee: "Trích từ phí dịch vụ đấu giá Q-Broker thu",
    commission: "5.000.000 đ / lô chốt",
    example: "Khách trúng đấu giá qua link → nhận cố định 5 triệu",
    payType: "flat",
    lane: 2,
  },
  {
    icon: "BadgeCheck",
    product: "Gói hội viên Pro Broker",
    fee: "Q-Broker thu trực tiếp 499.000 đ / tháng",
    commission: "15 – 25% mỗi tháng, trong 12 tháng",
    example: "10 môi giới đăng ký → tới 1,25 triệu đều đặn hàng tháng",
    payType: "recurring",
    lane: 2,
  },
];

// ---- "Ai trả tiền cho bạn?" — dòng tiền 3 bước cho dễ hiểu ----
// Mô phỏng cách Zillow Flex / Realtor.com ReadyConnect giải thích:
// người bán trả phí cho nền tảng, nền tảng chia lại cho người giới
// thiệu — khách của đối tác KHÔNG mất thêm đồng nào.

export interface MoneyFlowStep {
  icon: string;
  who: string; // chủ thể trong dòng tiền
  action: string; // họ làm gì
  note: string; // giải thích thêm
}

export const MONEY_FLOW_STEPS: MoneyFlowStep[] = [
  {
    icon: "Building2",
    who: "Chủ nhà / bên bán",
    action: "Trả hoa hồng cho MÔI GIỚI khi giao dịch thành công",
    note: "Khoản này là của môi giới như mọi giao dịch BĐS — Q-Broker không thu đồng nào từ khách.",
  },
  {
    icon: "UserRoundCheck",
    who: "Môi giới",
    action: "Trả lại Q-Broker 25% hoa hồng làm phí giới thiệu",
    note: "Vì khách/deal đến từ mạng lưới Q-Broker. Đây là cách nền tảng thu hồi lợi nhuận — giống referral fee của Zillow Flex.",
  },
  {
    icon: "HeartHandshake",
    who: "Q-Broker → Bạn",
    action: "Trích 40 – 60% phí giới thiệu đó trả về ví của bạn",
    note: "Q-Broker giữ phần còn lại để vận hành. Khách của bạn không trả thêm bất kỳ khoản nào.",
  },
];

export const AFFILIATE_FAQS: AffiliateFaq[] = [
  {
    q: "Ai có thể tham gia chương trình affiliate?",
    a: "Bất kỳ ai: môi giới, KOL/KOC, chủ kênh nội dung nhà đất, hay người có mạng lưới quan hệ rộng. Không yêu cầu chứng chỉ, không phí tham gia.",
  },
  {
    q: "Cookie 30 ngày nghĩa là gì?",
    a: "Khi khách bấm link của bạn, hệ thống ghi nhớ 30 ngày. Trong thời gian đó khách quay lại và giao dịch (kể cả không qua link) thì hoa hồng vẫn tính cho bạn. 30 ngày nằm trong khung chuẩn 30–90 ngày của affiliate quốc tế (thương mại 7–30 ngày, SaaS 60–90 ngày). Áp dụng cho Làn 2 (dịch vụ); riêng giao dịch nhà đất ở Làn 1 dùng cửa sổ attribution 12 tháng gắn theo khách.",
  },
  {
    q: "Q-Broker lấy tiền ở đâu để trả hoa hồng cho tôi?",
    a: "Q-Broker là nền tảng trung gian, KHÔNG thu tiền của người mua/bán. Khi môi giới chốt được giao dịch nhờ khách/deal từ mạng lưới, môi giới trả lại Q-Broker 25% hoa hồng của họ làm phí giới thiệu. Q-Broker trích 40 – 60% khoản đó (theo hạng của bạn) trả cho bạn — đúng mô hình referral fee của Zillow Flex.",
  },
  {
    q: "Khi nào tôi được thanh toán?",
    a: "Hoa hồng được đối soát khi giao dịch chốt thành công và Q-Broker đã thu được phí giới thiệu từ môi giới (mô hình pay-at-closing như Zillow Flex), rồi chuyển về ví Q-Broker của bạn vào ngày 15 hàng tháng. Rút về ngân hàng bất kỳ lúc nào, tối thiểu 500.000 đ.",
  },
  {
    q: "Tôi theo dõi khách giới thiệu ở đâu?",
    a: "Dashboard đối tác hiển thị realtime: lượt bấm link, khách để lại thông tin, trạng thái tư vấn của từng khách và hoa hồng dự kiến — minh bạch từng bước, không lo mất khách.",
  },
  {
    q: "Giới thiệu khách nhưng người khác chốt thì sao?",
    a: "Hoa hồng tính theo NGUỒN khách. Khách đến từ link của bạn thì dù môi giới nào của Q-Broker chốt, bạn vẫn nhận đủ tỷ lệ theo hạng — giống cơ chế referral fee chuẩn ngành 25%.",
  },
  {
    q: "Lỡ môi giới không chịu trả phí giới thiệu thì hoa hồng của tôi có mất không?",
    a: "Không. Rủi ro thu phí là của Q-Broker, không phải của bạn. Hoa hồng giao dịch được giữ ở ví ký quỹ và phí giới thiệu tự động trích trước khi giải ngân cho môi giới, nên tiền của bạn đã được tách sẵn. Môi giới còn có điểm uy tín — trả phí đúng hạn mới được ưu tiên nhận khách mới — và chịu chế tài (khoá tài khoản, truy thu) nếu trốn phí — xem mục \"Cam kết phía môi giới\".",
  },
  {
    q: "Môi giới rời Q-Broker hoặc cố tình chốt ngoài nền tảng thì sao?",
    a: "Nghĩa vụ trả phí gắn với KHÁCH, không gắn với tài khoản: môi giới đã claim khách của bạn thì trong 12 tháng attribution, rời nền tảng hay chốt ngoài luồng vẫn phải trả phí (đã ký điện tử lúc nhận khách). Q-Broker audit định kỳ và yêu cầu hồ sơ chốt deal bắt buộc để phát hiện chốt chui; trường hợp vi phạm bị truy thu kèm bồi thường — mô hình vận hành giống Realtor.com ReadyConnect.",
  },
  {
    q: "Hoa hồng có bị trừ thuế không? Pháp lý thế nào?",
    a: "Bạn ký hợp đồng cộng tác viên điện tử với Q-Broker (không phải hợp đồng lao động). Với khoản chi trả từ 2.000.000 đ/lần, Q-Broker khấu trừ 10% thuế thu nhập cá nhân tại nguồn theo quy định và cấp chứng từ khấu trừ — số hiển thị trên ví là số bạn thực nhận.",
  },
];

// ---- Cam kết phía MÔI GIỚI trả phí giới thiệu ----
// Khép kín mô hình: affiliate được trả VÌ môi giới bị ràng buộc phải
// trả phí giới thiệu cho Q-Broker. Gồm nghĩa vụ, cơ chế thu (ví ký
// quỹ), chế tài và cách xử lý tranh chấp attribution.

export interface BrokerTermsSection {
  icon: string;
  title: string;
  points: string[];
}

/** Cửa sổ attribution phía môi giới (ngày) — dài hơn cookie affiliate 30 ngày */
export const BROKER_ATTRIBUTION_DAYS = 365;

export const BROKER_FEE_TERMS: BrokerTermsSection[] = [
  {
    icon: "FileSignature",
    title: "1. Nghĩa vụ trả phí giới thiệu",
    points: [
      "Khi nhận khách hoặc deal từ mạng lưới Q-Broker (bao gồm khách do đối tác affiliate giới thiệu) và chốt thành công, môi giới có nghĩa vụ trả Q-Broker phí giới thiệu bằng 25% hoa hồng môi giới của giao dịch đó.",
      "Nghĩa vụ được XÁC LẬP TẠI THỜI ĐIỂM NHẬN KHÁCH, không phải lúc chốt deal: thao tác nhận/claim khách trên app đồng thời là ký hợp đồng giới thiệu điện tử cho đúng khách đó — mỗi khách gắn một mã nguồn (attribution ID) để đối soát (mô hình Realtor.com ReadyConnect).",
      "Nghĩa vụ áp dụng cho mọi giao dịch có nguồn khách thuộc mạng lưới Q-Broker trong vòng 12 tháng kể từ ngày giới thiệu (cửa sổ attribution).",
      "Nghĩa vụ GẮN VỚI KHÁCH, không gắn với tài khoản: môi giới rời nền tảng hoặc chuyển sang sàn khác vẫn phải trả phí cho các khách đã claim còn trong cửa sổ attribution.",
    ],
  },
  {
    icon: "Landmark",
    title: "2. Cơ chế thu & đảm bảo",
    points: [
      "Giao dịch thanh toán qua Q-Broker: hoa hồng được giữ ở VÍ KÝ QUỸ, phí giới thiệu tự động trích trước khi giải ngân phần còn lại cho môi giới — môi giới không bao giờ cầm khoản phí này rồi mới trả, nên không thể 'quên'.",
      "Giao dịch ngoài luồng nền tảng: môi giới phải báo cáo và thanh toán phí giới thiệu trong vòng 7 ngày sau công chứng; Q-Broker xuất biên nhận/hoá đơn.",
      "Cả hai bên xem chung log giao dịch và trạng thái phí trên dashboard — minh bạch, không đối soát thủ công.",
    ],
  },
  {
    icon: "ClipboardCheck",
    title: "3. Nghĩa vụ báo cáo & hồ sơ chốt deal",
    points: [
      "Môi giới phải cập nhật trạng thái từng khách đã claim (đang tư vấn, đi xem, đặt cọc, công chứng, huỷ) tối thiểu 7 ngày/lần — khách bỏ bê quá hạn bị thu hồi và phân bổ lại cho môi giới khác.",
      "Khi chốt giao dịch, môi giới nộp hồ sơ chốt deal (hợp đồng đặt cọc/công chứng, xác nhận hoa hồng) trên nền tảng — đây là căn cứ duy nhất để tính phí giới thiệu và đối soát hoa hồng cho đối tác affiliate.",
      "Q-Broker audit định kỳ: đối chiếu trạng thái khai báo với log attribution và dữ liệu giao dịch; khách đã claim mà 'biến mất' rồi xuất hiện trong giao dịch ngoài luồng sẽ bị coi là chốt chui.",
    ],
  },
  {
    icon: "Gauge",
    title: "4. Điểm uy tín & ưu tiên phân bổ khách",
    points: [
      "Mỗi môi giới có ĐIỂM UY TÍN (broker score) tính từ: tốc độ nhận khách, tỷ lệ cập nhật trạng thái đúng hạn, tỷ lệ chốt và lịch sử trả phí đầy đủ.",
      "Điểm cao được ưu tiên nhận khách chất lượng TRƯỚC các môi giới khác trong khu vực — trả phí đúng hạn chính là cách nhận nhiều khách hơn, không phải khoản mất đi.",
      "Điểm thấp bị xếp cuối hàng chờ phân bổ; chậm trả phí hoặc khai báo gian trạng thái trừ điểm trực tiếp và hiển thị cảnh báo trên hồ sơ.",
      "Cơ chế mô phỏng lead score của Realtor.com ReadyConnect: nguồn khách tiếp theo là động lực để môi giới TỰ NGUYỆN tuân thủ, thay vì chỉ dựa vào chế tài.",
    ],
  },
  {
    icon: "ShieldAlert",
    title: "5. Chế tài khi vi phạm",
    points: [
      "Chậm trả: tính phí chậm theo hợp đồng, trừ điểm uy tín và tạm ngừng phân bổ khách mới cho tới khi tất toán.",
      "Trốn phí (nhận khách từ mạng lưới rồi chốt ngoài luồng, che giấu giao dịch, khai gian trạng thái): khoá tài khoản môi giới, thu hồi toàn bộ quyền lợi và truy thu phí kèm bồi thường theo hợp đồng.",
      "Tái phạm: chấm dứt hợp tác và đưa vào danh sách hạn chế của Q-Broker.",
    ],
  },
  {
    icon: "Scale",
    title: "6. Minh bạch & tranh chấp",
    points: [
      "Nếu môi giới cho rằng khách KHÔNG đến từ mạng lưới Q-Broker, có quyền khiếu nại kèm bằng chứng trong 7 ngày; Q-Broker đối chiếu log attribution để phân xử.",
      "Áp dụng pay-at-closing: không có giao dịch chốt thì không phát sinh phí giới thiệu — môi giới không bị thu phí oan.",
      "Phí giới thiệu là chi phí hợp lệ của môi giới, được xuất chứng từ để hạch toán và kê khai thuế.",
    ],
  },
];

// ---- Điều khoản chương trình (hiển thị trong modal chặn trang) ----
// Người dùng phải đọc và đồng ý trước khi thao tác trên trang.
// Nội dung gói đủ 4 nhóm: cách hoạt động, ai trả tiền, hoa hồng,
// pháp lý — soạn theo mẫu Operating Agreement của Amazon Associates
// và Zillow Flex nhưng viết bằng ngôn ngữ đời thường.

export interface AffiliateTermsSection {
  icon: string;
  title: string;
  points: string[]; // mỗi điểm là một gạch đầu dòng ngắn, dễ đọc
}

/** Tăng version khi sửa nội dung — người dùng sẽ phải đồng ý lại */
export const AFFILIATE_TERMS_VERSION = "2026-07-v2";

export const AFFILIATE_TERMS_SECTIONS: AffiliateTermsSection[] = [
  {
    icon: "Route",
    title: "1. Cách thức hoạt động",
    points: [
      "Bạn được cấp link và mã QR giới thiệu riêng. Khách bấm link, hệ thống ghi nhận bằng cookie trong 30 ngày.",
      "Trong 30 ngày đó, khách đăng ký xem nhà, đấu giá hay mua gói hội viên thì đều tính là khách của bạn — kể cả khi khách quay lại không qua link.",
      "Nếu khách bấm link của nhiều đối tác, hoa hồng tính cho người có link được bấm SAU CÙNG (chuẩn last-click như Amazon Associates, Shopee Affiliate).",
      "Mọi lượt bấm, khách để lại thông tin và trạng thái tư vấn hiển thị realtime trên dashboard của bạn.",
    ],
  },
  {
    icon: "Landmark",
    title: "2. Ai trả tiền cho bạn?",
    points: [
      "Q-Broker là NỀN TẢNG TRUNG GIAN — không thu tiền của người mua hay người bán. Chủ nhà trả hoa hồng cho môi giới như mọi giao dịch bình thường.",
      "Nguồn hoa hồng của bạn là PHÍ GIỚI THIỆU: khi môi giới chốt được deal đến từ mạng lưới Q-Broker, môi giới trả lại Q-Broker 25% hoa hồng của họ. Q-Broker trích 40 – 60% khoản này (theo hạng của bạn) trả cho bạn.",
      "Với gói hội viên Pro Broker và dịch vụ đấu giá, hoa hồng trích từ phí mà Q-Broker thu trực tiếp của chính sản phẩm đó.",
      "Khách hàng bạn giới thiệu KHÔNG phải trả thêm bất kỳ khoản nào. Bạn không đóng phí tham gia, không doanh số bắt buộc.",
      "Chương trình chỉ có MỘT cấp: bạn nhận hoa hồng từ khách bạn giới thiệu trực tiếp. Không có hoa hồng tuyến dưới — đây không phải mô hình đa cấp.",
    ],
  },
  {
    icon: "Wallet",
    title: "3. Hoa hồng & thanh toán",
    points: [
      "Mua bán/cho thuê: nhận 40 – 60% phí giới thiệu theo hạng đối tác (tương đương ~10 – 15% hoa hồng môi giới), CHỈ khi giao dịch chốt thành công (pay-at-closing — mô hình Zillow Flex, Realtor.com ReadyConnect).",
      "Đấu giá: 5.000.000 đ cố định mỗi lô chốt. Gói hội viên: 15 – 25% giá gói, lặp lại tối đa 12 tháng khi khách còn duy trì gói.",
      "Hoa hồng được đối soát khi giao dịch hoàn tất công chứng/thanh toán VÀ Q-Broker đã thu được phí giới thiệu từ môi giới, sau đó chuyển vào ví Q-Broker ngày 15 hàng tháng. Rút về ngân hàng bất kỳ lúc nào, tối thiểu 500.000 đ.",
      "Căn cứ đối soát là HỒ SƠ CHỐT DEAL môi giới bắt buộc nộp trên nền tảng (hợp đồng đặt cọc/công chứng, xác nhận hoa hồng) — không dựa vào lời khai một phía.",
      "Q-Broker chịu trách nhiệm thu phí giới thiệu từ môi giới; bạn không phải làm việc trực tiếp với môi giới về khoản này.",
      "Giao dịch bị huỷ, hoàn tiền hoặc khách bỏ gói giữa chừng: phần hoa hồng tương ứng bị thu hồi hoặc trừ vào kỳ thanh toán kế tiếp.",
    ],
  },
  {
    icon: "ShieldCheck",
    title: "4. Hoa hồng của bạn được đảm bảo thế nào?",
    points: [
      "Nghĩa vụ trả phí của môi giới được ký ĐIỆN TỬ ngay khi họ nhận/claim khách của bạn — trước khi deal chốt, không phải đòi sau. Mỗi khách gắn một mã nguồn (attribution ID).",
      "Tiền được tách TRƯỚC khi đến tay môi giới: hoa hồng giao dịch giữ ở ví ký quỹ, phí giới thiệu tự động trích rồi mới giải ngân phần còn lại — môi giới không thể 'cầm rồi quên trả'.",
      "Cửa sổ ghi nhận phía môi giới là 12 THÁNG (dài hơn cookie 30 ngày của bạn) và đi theo khách: môi giới rời nền tảng vẫn phải trả phí cho khách đã nhận.",
      "Môi giới có ĐIỂM UY TÍN: trả phí đúng hạn, cập nhật trạng thái đầy đủ thì được ưu tiên nhận khách tốt trước — họ có động lực kinh tế để tuân thủ, không chỉ vì bị phạt.",
      "Trốn phí bị phát hiện qua audit định kỳ và hồ sơ chốt deal bắt buộc: khoá tài khoản, truy thu kèm bồi thường. Rủi ro thu phí thuộc về Q-Broker — không ảnh hưởng hoa hồng của bạn (xem mục Cam kết phía môi giới).",
    ],
  },
  {
    icon: "Scale",
    title: "5. Pháp lý & thuế",
    points: [
      "Quan hệ giữa bạn và Q-Broker là HỢP TÁC KINH DOANH theo hợp đồng cộng tác viên điện tử — không phải quan hệ lao động, không có lương cứng hay bảo hiểm.",
      "Q-Broker khấu trừ 10% thuế thu nhập cá nhân tại nguồn cho mỗi lần chi trả từ 2.000.000 đ theo pháp luật Việt Nam và cấp chứng từ khấu trừ khi bạn yêu cầu.",
      "Nếu bạn là tổ chức/hộ kinh doanh, bạn tự xuất hoá đơn và kê khai thuế theo quy định riêng.",
      "Thông tin khách hàng bạn tiếp cận được bảo vệ theo Nghị định 13/2023/NĐ-CP — chỉ dùng cho việc giới thiệu trên Q-Broker, cấm bán hoặc chia sẻ cho bên thứ ba.",
    ],
  },
  {
    icon: "ShieldAlert",
    title: "6. Quy tắc cấm & chấm dứt",
    points: [
      "Cấm: tự giới thiệu chính mình hoặc người nhà để hưởng hoa hồng, spam tin nhắn/email, cam kết lợi nhuận hoặc quảng cáo sai sự thật về bất động sản.",
      "Cấm chạy quảng cáo đấu thầu từ khoá thương hiệu \"Q-Broker\" và giả mạo là nhân viên chính thức của Q-Broker.",
      "Vi phạm sẽ bị khoá tài khoản đối tác và thu hồi toàn bộ hoa hồng chưa thanh toán.",
      "Hai bên đều có thể chấm dứt hợp tác với thông báo trước 7 ngày. Hoa hồng hợp lệ phát sinh trước ngày chấm dứt vẫn được thanh toán đầy đủ.",
    ],
  },
];

// ---- Dashboard demo (số liệu mẫu của một đối tác hạng Bạc) ----

export const DEMO_LINK = "https://q-broker.vn/ref/QB-8823-MINH";

export const DEMO_STATS = [
  { icon: "MousePointerClick", label: "Lượt bấm link", value: "1.284", note: "30 ngày qua" },
  { icon: "Users", label: "Khách để lại thông tin", value: "96", note: "tỷ lệ 7,5%" },
  { icon: "Handshake", label: "Giao dịch chốt", value: "12", note: "5 đang tư vấn" },
  { icon: "Wallet", label: "Hoa hồng tích luỹ", value: "93.200.000 đ", note: "+19,1 triệu tháng này" },
];

export const DEMO_REFERRALS: ReferralRow[] = [
  {
    id: "r1",
    customer: "Nguyễn T. H***",
    product: "Mua căn hộ Vinhomes Central Park",
    date: "02/07/2026",
    value: "4,2 tỷ",
    commission: "10.500.000 đ",
    status: "closed",
  },
  {
    id: "r2",
    customer: "Trần M. K***",
    product: "Gói hội viên Pro Broker (12 tháng)",
    date: "28/06/2026",
    value: "499k/tháng",
    commission: "99.800 đ/tháng",
    status: "closed",
  },
  {
    id: "r3",
    customer: "Lê V. P***",
    product: "Đấu giá biệt thự Ecopark Aqua Bay",
    date: "25/06/2026",
    value: "7,8 tỷ",
    commission: "5.000.000 đ",
    status: "pending",
  },
  {
    id: "r4",
    customer: "Phạm Q. D***",
    product: "Thuê nhà phố Thảo Điền",
    date: "21/06/2026",
    value: "38 triệu/tháng",
    commission: "4.750.000 đ",
    status: "consulting",
  },
  {
    id: "r5",
    customer: "Võ N. A***",
    product: "Mua nhà phố The Sailing Tower",
    date: "17/06/2026",
    value: "6,4 tỷ",
    commission: "16.000.000 đ",
    status: "consulting",
  },
];

/** Nhãn + tông màu cho trạng thái dòng giới thiệu */
export const REFERRAL_STATUS: Record<
  ReferralRow["status"],
  { label: string; className: string }
> = {
  closed: { label: "Đã chốt — đã trả", className: "bg-emerald-50 text-emerald-600" },
  pending: { label: "Chờ đối soát", className: "bg-amber-50 text-amber-600" },
  consulting: { label: "Đang tư vấn", className: "bg-sky-50 text-sky-600" },
};

/** Hoa hồng 6 tháng gần nhất (triệu đồng) — tổng khớp 93,2 triệu tích luỹ */
export const DEMO_EARNINGS: { month: string; value: number }[] = [
  { month: "T2", value: 9.2 },
  { month: "T3", value: 11.0 },
  { month: "T4", value: 14.6 },
  { month: "T5", value: 16.8 },
  { month: "T6", value: 22.5 },
  { month: "T7", value: 19.1 },
];

// ---- Máy tính hoa hồng ----

/** Hoa hồng môi giới trên giá trị BĐS (2%) — của môi giới, dùng để tính ví dụ */
export const BROKERAGE_FEE_RATE = 0.02;
/**
 * Phí giới thiệu: môi giới trả lại Q-Broker 25% hoa hồng khi chốt deal đến
 * từ mạng lưới. Đây là doanh thu nền tảng — nguồn duy nhất để trả affiliate.
 */
export const PLATFORM_FEE_RATE = 0.25;
/** Giá gói hội viên Pro Broker (đ/tháng) — Q-Broker thu trực tiếp */
export const MEMBERSHIP_PRICE = 499_000;

/** Xác định hạng đối tác theo số giao dịch chốt mỗi QUÝ */
export function tierForQuarterDeals(deals: number): AffiliateTier {
  if (deals >= 10) return AFFILIATE_TIERS[2];
  if (deals >= 3) return AFFILIATE_TIERS[1];
  return AFFILIATE_TIERS[0];
}

// ---- Bảng xếp hạng đối tác (leaderboard) ----

export interface LeaderboardRow {
  rank: number;
  name: string; // tên đã che
  region: string;
  deals: number; // giao dịch chốt trong quý
  earnings: string; // hoa hồng quý
  tierId: string; // khớp AffiliateTier.id
}

export const AFFILIATE_LEADERBOARD: LeaderboardRow[] = [
  { rank: 1, name: "Trần Q. M***", region: "TP. Thủ Đức", deals: 18, earnings: "206.000.000 đ", tierId: "vang" },
  { rank: 2, name: "Nguyễn H. L***", region: "Bình Thạnh", deals: 14, earnings: "178.000.000 đ", tierId: "vang" },
  { rank: 3, name: "Lê T. V***", region: "Hà Nội", deals: 11, earnings: "149.000.000 đ", tierId: "vang" },
  { rank: 4, name: "Phạm N. K***", region: "Đà Nẵng", deals: 8, earnings: "102.000.000 đ", tierId: "bac" },
  { rank: 5, name: "Võ M. T***", region: "Nha Trang", deals: 7, earnings: "93.200.000 đ", tierId: "bac" },
];

// ---- Kho tài liệu marketing (creative assets) ----

export interface MarketingAsset {
  id: string;
  icon: string;
  name: string;
  spec: string; // kích thước / định dạng
  desc: string;
  gradient: string; // lớp gradient placeholder cho thumbnail
}

export const MARKETING_ASSETS: MarketingAsset[] = [
  {
    id: "m1",
    icon: "Image",
    name: "Banner Facebook / Zalo",
    spec: "1200 × 628 · PNG",
    desc: "Bộ 6 banner gắn sẵn link và mã đối tác của bạn.",
    gradient: "from-realtor-500 to-sky-400",
  },
  {
    id: "m2",
    icon: "Smartphone",
    name: "Story / Reels dọc",
    spec: "1080 × 1920 · PNG + MP4",
    desc: "Template story kèm video 15s giới thiệu đấu giá livestream.",
    gradient: "from-violet-500 to-fuchsia-400",
  },
  {
    id: "m3",
    icon: "QrCode",
    name: "Mã QR + standee",
    spec: "A4 / A1 · PDF in ấn",
    desc: "QR trỏ thẳng về link của bạn — dùng cho sự kiện, quán cà phê.",
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    id: "m4",
    icon: "FileText",
    name: "Bộ caption mẫu",
    spec: "20 bài · DOCX",
    desc: "Nội dung đăng bài theo từng nhóm khách: mua ở, đầu tư, cho thuê.",
    gradient: "from-amber-500 to-orange-400",
  },
];
