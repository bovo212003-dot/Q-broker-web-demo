import { RoleShell } from "@/components/layout/RoleShell";
import { ROLES } from "@/config/roles";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell role={ROLES.admin}>{children}</RoleShell>;
}
