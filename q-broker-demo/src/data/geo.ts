// =============================================================
// TOẠ ĐỘ ĐỊA LÝ cho bản đồ tìm BĐS (/realtor/ban-do)
// Kinh độ / vĩ độ THẬT của các thành phố + tiện ích "chiếu" toạ độ lên bản đồ
// Việt Nam cách điệu. KHÔNG dùng thư viện bản đồ / tile ngoài.
//
// Phép chiếu: equirectangular có HIỆU CHỈNH theo vĩ độ (nhân kinh độ với
// cos(vĩ độ giữa)) để hình đất nước KHÔNG bị méo. Toạ độ trả về nằm trong hệ
// "viewBox" (0..VB_W, 0..VB_H); SVG dùng preserveAspectRatio="xMidYMid meet"
// để căn giữa, còn pin HTML dùng lại đúng phép chiếu này nên luôn khớp nhau.
// =============================================================

export interface LatLng {
  lng: number;
  lat: number;
}

// Khung địa lý ôm trọn Việt Nam (thừa nhẹ ra biển cho đẹp).
export const GEO_BOUNDS = {
  minLng: 101.8,
  maxLng: 110.2,
  minLat: 8.0,
  maxLat: 23.8,
};

const MID_LAT = (GEO_BOUNDS.minLat + GEO_BOUNDS.maxLat) / 2;
const LNG_SCALE = Math.cos((MID_LAT * Math.PI) / 180); // ~0.96 -> co kinh độ cho đúng tỉ lệ

// Kích thước hệ toạ độ bản đồ (viewBox). Tỉ lệ W:H ≈ 0.51 (VN cao & hẹp).
export const VB_W = (GEO_BOUNDS.maxLng - GEO_BOUNDS.minLng) * LNG_SCALE;
export const VB_H = GEO_BOUNDS.maxLat - GEO_BOUNDS.minLat;

/** Kinh độ -> X trong viewBox (0 = tây). */
export function vbX(lng: number): number {
  return (lng - GEO_BOUNDS.minLng) * LNG_SCALE;
}
/** Vĩ độ -> Y trong viewBox (0 = bắc/đỉnh). */
export function vbY(lat: number): number {
  return GEO_BOUNDS.maxLat - lat;
}

// Toạ độ theo id tin (khớp LISTINGS trong realtorListings.ts).
export const LISTING_COORDS: Record<string, LatLng> = {
  l1: { lng: 106.705, lat: 10.803 }, // Bình Thạnh, TP.HCM
  l2: { lng: 106.755, lat: 10.85 }, // TP. Thủ Đức, TP.HCM
  l3: { lng: 105.86, lat: 21.005 }, // Hai Bà Trưng, Hà Nội
  l4: { lng: 105.935, lat: 20.93 }, // Văn Giang, Hưng Yên (Ecopark)
  l5: { lng: 105.762, lat: 21.036 }, // Nam Từ Liêm, Hà Nội
  l6: { lng: 105.902, lat: 19.752 }, // Sầm Sơn, Thanh Hoá
  l7: { lng: 108.22, lat: 16.052 }, // Hải Châu, Đà Nẵng
  l8: { lng: 106.722, lat: 10.795 }, // Bình Thạnh, TP.HCM (Landmark 81)
  l9: { lng: 106.68, lat: 20.862 }, // Hồng Bàng, Hải Phòng
  l10: { lng: 105.783, lat: 10.033 }, // Ninh Kiều, Cần Thơ
  l11: { lng: 106.652, lat: 10.98 }, // Thủ Dầu Một, Bình Dương
  l12: { lng: 106.824, lat: 10.945 }, // Biên Hoà, Đồng Nai
  l13: { lng: 109.19, lat: 12.246 }, // Nha Trang, Khánh Hoà
  l14: { lng: 107.402, lat: 10.548 }, // Xuyên Mộc, Bà Rịa - Vũng Tàu
  l15: { lng: 107.595, lat: 16.463 }, // TP. Huế
  l16: { lng: 106.076, lat: 21.186 }, // TP. Bắc Ninh
};

// Nhãn 3 miền in mờ trên nền bản đồ.
export const REGION_LABELS: { label: string; lng: number; lat: number }[] = [
  { label: "Miền Bắc", lng: 104.6, lat: 22.1 },
  { label: "Miền Trung", lng: 106.4, lat: 15.0 },
  { label: "Miền Nam", lng: 105.6, lat: 9.8 },
];

// Thành phố lớn làm mốc địa lý (nhãn mờ dưới lớp pin).
export const CITY_MARKS: { name: string; lng: number; lat: number }[] = [
  { name: "Hà Nội", lng: 105.85, lat: 21.03 },
  { name: "Hải Phòng", lng: 106.68, lat: 20.86 },
  { name: "Đà Nẵng", lng: 108.22, lat: 16.05 },
  { name: "Nha Trang", lng: 109.19, lat: 12.25 },
  { name: "TP.HCM", lng: 106.7, lat: 10.78 },
  { name: "Cần Thơ", lng: 105.78, lat: 10.03 },
];

// Đường viền Việt Nam (kinh độ, vĩ độ) — xấp xỉ nhưng nhận diện được: có eo
// thắt miền Trung, mũi Cà Mau, đồng bằng sông Cửu Long. Đi theo chiều kim đồng hồ.
const VN_OUTLINE: [number, number][] = [
  [105.32, 23.39], [105.9, 22.95], [106.7, 22.86], [107.35, 22.5], [107.0, 21.95],
  [107.65, 21.6], [108.05, 21.53], [107.4, 21.2], [107.05, 20.95], [106.8, 20.72],
  [106.55, 20.28], [106.2, 19.95], [106.05, 19.6], [105.9, 19.3], [105.78, 18.95],
  [105.72, 18.79], [106.05, 18.4], [106.3, 18.05], [106.5, 17.7], [106.62, 17.48],
  [106.85, 17.15], [107.1, 16.9], [107.35, 16.7], [107.6, 16.5], [107.9, 16.3],
  [108.15, 16.1], [108.3, 15.95], [108.4, 15.7], [108.65, 15.35], [108.9, 15.12],
  [109.05, 14.6], [109.22, 13.77], [109.3, 13.4], [109.35, 13.09], [109.45, 12.88],
  [109.28, 12.55], [109.2, 12.25], [109.15, 11.9], [109.0, 11.57], [108.6, 11.2],
  [108.3, 10.93], [107.8, 10.65], [107.08, 10.35], [106.8, 10.35], [106.6, 10.0],
  [106.35, 9.6], [106.2, 9.3], [105.75, 9.29], [105.35, 8.95], [104.95, 8.68],
  [104.83, 8.6], [104.72, 8.95], [104.9, 9.4], [105.08, 10.0], [104.75, 10.2],
  [104.48, 10.38], [104.85, 10.55], [105.35, 10.9], [105.85, 10.95], [106.0, 11.3],
  [106.4, 11.65], [106.1, 11.9], [106.0, 12.3], [107.2, 12.35], [107.55, 13.0],
  [107.45, 14.0], [107.35, 14.65], [107.15, 15.15], [106.9, 15.9], [106.55, 16.55],
  [106.2, 17.0], [105.85, 17.6], [105.4, 18.2], [104.7, 18.8], [104.4, 19.2],
  [104.05, 19.7], [104.5, 20.35], [103.9, 20.7], [103.2, 20.85], [102.85, 21.25],
  [102.15, 22.4], [102.55, 22.5], [103.0, 22.55], [103.5, 22.75], [104.1, 22.8],
  [104.6, 22.85],
];

/** Chuỗi path "d" của viền VN trong hệ viewBox (dùng với viewBox 0 0 VB_W VB_H). */
export const VN_PATH =
  VN_OUTLINE.map(
    ([lng, lat], i) =>
      `${i === 0 ? "M" : "L"}${vbX(lng).toFixed(3)} ${vbY(lat).toFixed(3)}`
  ).join(" ") + " Z";
