---
name: ui-tailwind-tokens
description: >
  Dùng khi tạo/sửa giao diện, style, màu sắc, hoặc biểu đồ trong Q-Broker
  Dashboard. Kích hoạt với "Tailwind", "màu", "style", "className", "token",
  "chart", "recharts", "design", hoặc khi dựng UI mới.
---

# UI & Tailwind Tokens — Q-Broker Dashboard

Phong cách SaaS dashboard sạch, đồng nhất. Style bằng Tailwind 3 với design
token riêng trong `tailwind.config.ts`.

## Design token (BẮT BUỘC dùng, không hardcode mã màu)
- **brand** (xanh, 50→900): màu chủ đạo. `brand-500` (#2F62EB) là primary — dùng
  cho nút CTA, trạng thái active, gradient banner.
- **accent** (cam, `accent-500` #F2750A): điểm nhấn — giá tin đăng, badge "Pro".
- **ink** (xám, 50→900): văn bản (`ink-900`/`ink-700`), phụ (`ink-500`/`400`),
  viền (`ink-200`), nền phụ (`ink-50`/`100`).

## Hình khối & chiều sâu
- Bo góc lớn: `rounded-xl`, `rounded-2xl`, hoặc token `xl2` (1.25rem) cho thẻ.
- Viền mảnh `border border-ink-200`.
- Shadow rất nhẹ: `shadow-card` cho thẻ, `shadow-popover` cho menu/popover nổi.
- Nền tổng thể sáng (`bg-ink-50/70` như trong AppShell).

## Biểu đồ (Recharts)
- Dùng **recharts** cho mọi biểu đồ (tham chiếu `components/dashboard/
  TrendChart.tsx`). Màu chart lấy từ token brand/accent để đồng bộ.
- Giữ chart gọn, responsive; sparkline cho xu hướng, chart lớn cho báo cáo.

## Icon & ảnh
- Icon từ **lucide-react**, kích thước nhất quán theo ngữ cảnh (thường 16–20px
  trong nav/nút).
- Ảnh bất động sản hiện dùng gradient placeholder + icon; khi có ảnh thật thay
  bằng `next/image` (sửa ở `ListingsSection.tsx`).

## Nhất quán
- Component mới phải trông đồng bộ với các thẻ/nút/section đã có — tham chiếu
  `components/dashboard/*` làm mẫu trước khi tự chế style mới.
- Responsive: dùng breakpoint `lg:` như code hiện có.

## KHÔNG được làm
- Không viết mã màu hex/rgb trực tiếp trong className — dùng token.
- Không thêm font/màu ngoài hệ thống mà không có lý do.
- Không dùng thư viện chart/icon khác khi đã có recharts + lucide-react.
