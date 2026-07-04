# Q-Broker — Demo giao diện đa vai trò

Bản demo **chỉ có frontend** cho hệ sinh thái BĐS toàn diện **Q-Broker**.
Không có backend, không có database — toàn bộ dữ liệu là **mock data**.

Xây bằng **Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS**.

---

## 🚀 Chạy dự án

```bash
npm install
npm run dev
```

Mở http://localhost:3000 — bạn sẽ thấy **trang chọn vai trò** với 6 nút.
Nhấn một nút để vào giao diện trang chủ của vai trò đó.

---

## 👥 6 vai trò (role)

| Nút trên landing | Đường dẫn    | Ý nghĩa                        |
| ---------------- | ------------ | ------------------------------ |
| Khách vãng lai   | `/guest`     | Người dùng chưa đăng nhập      |
| Môi giới         | `/broker`    | Học tập, luyện thi, giỏ hàng   |
| Khách hàng       | `/customer`  | Nhà đầu tư tìm mua/bán BĐS     |
| Sàn giao dịch    | `/exchange`  | Thẩm định & quản lý kho sản phẩm|
| Ngân hàng        | `/bank`      | Sản phẩm vay & duyệt tín dụng  |
| Quản trị viên    | `/admin`     | Quản lý toàn hệ sinh thái      |

---

## 📁 Cấu trúc thư mục

```
src/
├── app/
│   ├── page.tsx            ← TRANG LANDING: 6 nút chọn vai trò
│   ├── layout.tsx          ← Layout gốc
│   ├── globals.css
│   │
│   ├── guest/              ← Mỗi role là 1 thư mục
│   │   ├── layout.tsx      ← Gắn sidebar + topbar cho role (dùng RoleShell)
│   │   ├── page.tsx        ← Trang chủ của role
│   │   ├── about/page.tsx  ← Các trang con (theo menu trong config)
│   │   └── ...
│   ├── broker/   (tương tự)
│   ├── customer/ (tương tự)
│   ├── exchange/ (tương tự)
│   ├── bank/     (tương tự)
│   └── admin/    (tương tự)
│
├── components/
│   ├── layout/
│   │   └── RoleShell.tsx   ← Bố cục dùng chung (sidebar + topbar) cho mọi role
│   └── ui/                 ← Component tái sử dụng
│       ├── Card.tsx        ← Card, StatCard, Badge, PageHeader
│       ├── Icon.tsx        ← Gọi icon theo tên chuỗi (lucide-react)
│       └── Placeholder.tsx ← Khung "trang đang xây dựng"
│
├── config/
│   └── roles.ts            ← ⭐ NGUỒN SỰ THẬT: định nghĩa 6 role + menu của mỗi role
│
├── data/
│   └── mock.ts             ← ⭐ TẤT CẢ mock data ở đây (BĐS, người dùng, giao dịch...)
│
├── lib/
│   └── utils.ts            ← Hàm tiện ích (cn, formatVnd...)
│
└── types/
    └── index.ts            ← Định nghĩa kiểu TypeScript dùng chung
```

---

## 🧩 Cách hoạt động (rất quan trọng)

Chỉ có **2 file trung tâm** bạn cần nhớ:

1. **`src/config/roles.ts`** — định nghĩa 6 role và **menu bên** của từng role.
   - Trang landing đọc file này để tự render 6 nút.
   - `RoleShell` đọc `nav` của role để tự render sidebar và tự bôi đậm mục đang mở.

2. **`src/data/mock.ts`** — toàn bộ dữ liệu hiển thị. Muốn đổi số liệu/BĐS → sửa ở đây.

Mỗi role có 1 file `layout.tsx` cực ngắn, chỉ làm 1 việc: bọc nội dung trong `RoleShell`:

```tsx
import { RoleShell } from "@/components/layout/RoleShell";
import { ROLES } from "@/config/roles";

export default function BrokerLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell role={ROLES.broker}>{children}</RoleShell>;
}
```

→ Nhờ vậy, mọi trang trong `/broker/*` đều tự động có sidebar + topbar giống nhau.
Bạn chỉ cần tập trung viết nội dung trong từng `page.tsx`.

---

## ➕ Thêm một trang mới cho 1 role

Ví dụ thêm trang "Đánh giá" cho Môi giới:

1. Thêm 1 dòng vào menu của `broker` trong `src/config/roles.ts`:

   ```ts
   { label: "Đánh giá", href: "/broker/reviews", icon: "Star" },
   ```

2. Tạo file `src/app/broker/reviews/page.tsx`:

   ```tsx
   import { PageHeader } from "@/components/ui/Card";

   export default function Page() {
     return <PageHeader title="Đánh giá" subtitle="Nội dung của bạn ở đây" />;
   }
   ```

Xong. Menu sẽ tự có mục mới, và trang tự động có sidebar + topbar.

> Icon dùng tên trong thư viện [lucide-react](https://lucide.dev/icons). Chỉ cần truyền
> đúng tên (VD `"Star"`, `"Home"`, `"Building2"`) vào thuộc tính `icon`.

---

## 🎨 Thành phần UI có sẵn

Import từ `@/components/ui/Card`:

- `<PageHeader title subtitle />` — tiêu đề đầu mỗi trang
- `<StatCard label value icon accent />` — thẻ số liệu dashboard
- `<Card>` — khung nội dung
- `<Badge tone="green|amber|red|blue|slate">` — nhãn trạng thái
- `<Icon name="Home" />` — icon theo tên (từ `@/components/ui/Icon`)

Các trang chủ (`page.tsx`) của Môi giới, Khách hàng, Sàn, Ngân hàng, Admin đã
được dựng sẵn làm ví dụ — bạn có thể xem để nắm cách dùng các component này.

---

## 📝 Ghi chú

- Đây là demo giao diện, các nút "Duyệt / Từ chối / Đăng nhập..." hiện chưa gắn logic.
- Các trang con hiện là "khung chờ" (Placeholder) để bạn điền nội dung dần.
- Màu nhấn của mỗi role được định nghĩa trong `config/roles.ts` và `tailwind.config.ts`.
