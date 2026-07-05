---
name: mock-data-layer
description: >
  Dùng khi thêm/sửa dữ liệu, menu điều hướng, hoặc chuẩn bị nối API cho Q-Broker
  Dashboard. Kích hoạt với "data", "mock", "nav", "navItems", "lib/data",
  "sidebar menu", "API", hoặc khi thêm dữ liệu hiển thị mới.
---

# Mock Data Layer — Q-Broker Dashboard

Toàn bộ dữ liệu mock, cấu hình điều hướng, và map icon tập trung ở `lib/data.ts`.
"Sửa một nơi, áp dụng toàn bộ."

## Nguyên tắc
- Dữ liệu hiển thị, danh mục nav (`navItems`), badge, và map icon để trong
  `lib/data.ts` — KHÔNG rải rác trong từng component/trang.
- Mỗi mục nav theo type `NavItem` đã định nghĩa: `label`, `href`, `icon` (nằm
  trong union type icon có sẵn), tùy chọn `badge`, `children`.
- Khi thêm màn hình mới: thêm mục nav vào `navItems` (và `children` nếu là menu
  con), rồi tạo `app/[href]/page.tsx` tương ứng, bọc `<AppShell active="[href]">`.
- Thêm icon mới: bổ sung vào union type `icon` của `NavItem` và map sang
  component lucide-react ở nơi render icon — giữ đồng bộ, không để icon "mồ côi".

## Chuẩn bị cho API thật
- Mock data được thiết kế để thay bằng API sau. Khi nối API:
  - Giữ nguyên hình dạng (shape) type đang dùng để component không phải sửa nhiều.
  - Thay nguồn lấy dữ liệu, không đổi cấu trúc type một cách tùy tiện.
  - Không xóa mock data cho tới khi API thật đã chạy và thay thế hoàn toàn.

## KHÔNG được làm
- Không hardcode danh sách/dữ liệu ngay trong component khi nó thuộc về
  `lib/data.ts`.
- Không tạo type dữ liệu trùng lặp ở nhiều nơi — tái dùng type trong `lib/data.ts`.
- Không xóa mock data khi feature chưa nối API thật.
- Luôn hỏi trước khi xóa file.
