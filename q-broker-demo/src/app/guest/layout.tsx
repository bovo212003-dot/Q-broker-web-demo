import { RoleShell } from "@/components/layout/RoleShell";
import { ROLES } from "@/config/roles";

// Layout cho toàn bộ khu vực /guest — tự động có sidebar + topbar.
// Mọi trang con trong thư mục này sẽ dùng chung bố cục.
export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell role={ROLES.guest}>{children}</RoleShell>;
}
