import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Gộp class Tailwind an toàn (tránh trùng/đè lớp) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Định dạng tiền VND: 2500000000 -> "2,5 tỷ" / "850 triệu" */
export function formatVnd(value: number): string {
  if (value >= 1_000_000_000) {
    const ty = value / 1_000_000_000;
    return `${ty % 1 === 0 ? ty : ty.toFixed(1).replace(".", ",")} tỷ`;
  }
  if (value >= 1_000_000) {
    return `${Math.round(value / 1_000_000)} triệu`;
  }
  return `${value.toLocaleString("vi-VN")} đ`;
}

/** Định dạng số đầy đủ theo locale VN */
export function formatNumber(value: number): string {
  return value.toLocaleString("vi-VN");
}
