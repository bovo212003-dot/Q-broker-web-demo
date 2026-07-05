// =============================================================
// DỮ LIỆU MẪU cho trang bất động sản (/realtor)
// Bản địa hoá theo thị trường Việt Nam: giá VND, phòng ngủ/WC/diện tích,
// thành phố & địa chỉ Việt Nam. Ảnh dùng Unsplash (img thường).
// =============================================================

export interface Listing {
  id: string;
  price: number; // VND
  beds: number; // số phòng ngủ
  baths: number; // số phòng vệ sinh
  area: number; // diện tích sử dụng (m²)
  lot?: string; // vd "80 m² đất"
  address: string;
  city: string; // vd "Quận 7, TP.HCM"
  image: string;
  tag?: string; // nhãn góc ảnh, vd "Mới - 3 giờ trước"
  tagTone?: "new" | "tour" | "open"; // màu nhãn
  broker: string; // "Rao bởi ..."
}

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

export const LISTINGS: Listing[] = [
  {
    id: "l1",
    price: 4_200_000_000,
    beds: 3,
    baths: 2,
    area: 82,
    lot: "Căn hộ",
    address: "Vinhomes Central Park, Toà Park 5",
    city: "Bình Thạnh, TP.HCM",
    image: img("photo-1568605114967-8130f3a36994"),
    tag: "Mới - 3 giờ trước",
    tagTone: "new",
    broker: "Rao bởi Đất Xanh Miền Nam",
  },
  {
    id: "l2",
    price: 12_500_000_000,
    beds: 4,
    baths: 4,
    area: 220,
    lot: "160 m² đất",
    address: "Nhà phố Thảo Điền, Đường 41",
    city: "TP. Thủ Đức, TP.HCM",
    image: img("photo-1570129477492-45c003edd2be"),
    tag: "Tour 3D",
    tagTone: "tour",
    broker: "Rao bởi CBRE Việt Nam",
  },
  {
    id: "l3",
    price: 3_150_000_000,
    beds: 2,
    baths: 2,
    area: 68,
    lot: "Căn hộ",
    address: "Chung cư Times City, Toà T2",
    city: "Hai Bà Trưng, Hà Nội",
    image: img("photo-1512917774080-9991f1c4c750"),
    tag: "Mở bán thứ 7",
    tagTone: "open",
    broker: "Rao bởi Cen Land",
  },
  {
    id: "l4",
    price: 7_800_000_000,
    beds: 4,
    baths: 3,
    area: 180,
    lot: "120 m² đất",
    address: "Biệt thự Ecopark, Khu Aqua Bay",
    city: "Văn Giang, Hưng Yên",
    image: img("photo-1580587771525-78b9dba3b914"),
    tag: "Mới - 1 ngày trước",
    tagTone: "new",
    broker: "Rao bởi Ecopark Real Estate",
  },
  {
    id: "l5",
    price: 2_450_000_000,
    beds: 2,
    baths: 1,
    area: 55,
    lot: "Căn hộ",
    address: "The Manor, Toà A tầng 12",
    city: "Nam Từ Liêm, Hà Nội",
    image: img("photo-1560448204-e02f11c3d0e2"),
    tag: "Tour 3D",
    tagTone: "tour",
    broker: "Rao bởi Savills Việt Nam",
  },
  {
    id: "l6",
    price: 18_900_000_000,
    beds: 5,
    baths: 5,
    area: 320,
    lot: "250 m² đất",
    address: "Biệt thự ven biển FLC, Lô B12",
    city: "Sầm Sơn, Thanh Hoá",
    image: img("photo-1600596542815-ffad4c1539a9"),
    broker: "Rao bởi FLC Homes",
  },
  {
    id: "l7",
    price: 5_600_000_000,
    beds: 3,
    baths: 3,
    area: 110,
    lot: "90 m² đất",
    address: "Nhà phố Hải Châu, Đường Nguyễn Văn Linh",
    city: "Hải Châu, Đà Nẵng",
    image: img("photo-1600607687939-ce8a6c25118c"),
    tag: "Mở bán chủ nhật",
    tagTone: "open",
    broker: "Rao bởi Đất Xanh Miền Trung",
  },
  {
    id: "l8",
    price: 32_000_000_000,
    beds: 4,
    baths: 5,
    area: 400,
    lot: "Penthouse",
    address: "Penthouse Landmark 81, Tầng 68",
    city: "Bình Thạnh, TP.HCM",
    image: img("photo-1512915922686-57c11dde9b6b"),
    tag: "Mới - 5 giờ trước",
    tagTone: "new",
    broker: "Rao bởi Vinhomes",
  },
];

/** Các thành phố phổ biến hiển thị ở mục "Khám phá bất động sản" */
export const POPULAR_CITIES: string[] = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "Bình Dương",
  "Đồng Nai",
  "Nha Trang",
  "Vũng Tàu",
  "Huế",
  "Quảng Ninh",
  "Bắc Ninh",
];

/** Định dạng giá VND: 4200000000 -> "4,2 tỷ"; 850000000 -> "850 triệu" */
export function formatVnd(value: number): string {
  if (value >= 1_000_000_000) {
    const ty = value / 1_000_000_000;
    return `${ty.toLocaleString("vi-VN", { maximumFractionDigits: 1 })} tỷ`;
  }
  if (value >= 1_000_000) {
    const trieu = value / 1_000_000;
    return `${trieu.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} triệu`;
  }
  return `${value.toLocaleString("vi-VN")} đ`;
}
