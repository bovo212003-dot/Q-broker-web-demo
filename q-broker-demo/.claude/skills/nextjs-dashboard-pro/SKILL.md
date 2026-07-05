---
name: nextjs-dashboard-pro
description: >
  Dùng khi viết/sửa/review trang và component của Q-Broker Dashboard (Next.js 14
  App Router, React 18, TypeScript strict). Kích hoạt với file .tsx trong app/
  hoặc components/, "page", "route", "AppShell", "server component",
  "use client", "layout".
---

# Next.js Dashboard Pro — Q-Broker Dashboard

Web dashboard Next.js 14 App Router + React 18 + **TypeScript strict**. Đọc
`CLAUDE.md` ở gốc trước — skill này bổ sung chiều sâu, không lặp lại.

## Routing (App Router)
- Trang mới: tạo `app/[đường-dẫn]/page.tsx`. Đường dẫn đặt **tiếng Việt không
  dấu**, khớp quy ước hiện có (`can-ban`, `can-mua`, `crm`, `dao-tao/luyen-de`,
  `referral`...).
- Route lồng: tạo thư mục con (vd `app/dao-tao/thi-thu/page.tsx`).
- `app/layout.tsx` là root layout (`<html lang="vi">`) — chỉ sửa khi thật cần.

## Server vs Client Component
- Mặc định là **Server Component** (không cần khai báo gì).
- Thêm `"use client"` ở DÒNG ĐẦU file khi component có: `useState`/`useEffect`,
  event handler (onClick...), hoặc hook trình duyệt. Các trang tương tác như
  `crm/page.tsx` đều là client component.
- Giữ phần client càng nhỏ càng tốt; tách phần tĩnh ra server component khi hợp lý.

## Khung trang
- MỌI trang bọc nội dung trong `<AppShell active="/đường-dẫn">` (từ
  `@/components/layout/AppShell`). Truyền `active` đúng href để Sidebar/TopNav
  highlight. Có thể truyền `rightRail={...}` khi cần cột phải.
- Component chia đúng thư mục: `components/layout/` (khung), `components/
  dashboard/` (khối trang tổng quan), `components/ui/` (tái dùng nhỏ).

## TypeScript & import
- Strict: không `any`; định nghĩa type/prop rõ ràng. Type dữ liệu dùng chung
  đặt trong `lib/data.ts` (vd `NavItem`).
- Import tuyệt đối `@/...` (alias trỏ về gốc dự án), không import tương đối dài.

## UI
- Icon từ **lucide-react**. Biểu đồ từ **recharts** (xem `TrendChart.tsx`).
- Styling theo design token — xem skill `ui-tailwind-tokens`.
- Ảnh: hiện dùng gradient placeholder; khi có ảnh thật thay bằng `next/image`.

## KHÔNG được làm
- Không thêm thư viện trùng chức năng đã có (đã có lucide, recharts, tailwind).
- Không rải mock data trong component — tập trung `lib/data.ts` (xem skill
  mock-data-layer).
- Không hardcode màu ngoài token; không hardcode chuỗi trạng thái lộn xộn.
- Luôn hỏi trước khi xóa file; không xóa mock data khi chưa có API thật.
