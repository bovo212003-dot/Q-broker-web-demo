import { RoleShell } from "@/components/layout/RoleShell";
import { ROLES } from "@/config/roles";

// Layout cho toàn bộ khu vực /customer — tự động có sidebar + topbar.
// Mọi trang con trong thư mục này sẽ dùng chung bố cục.
export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell role={ROLES.customer}>{children}</RoleShell>;
}
