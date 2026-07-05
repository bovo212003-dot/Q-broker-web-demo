import { ROLES } from "@/config/roles";
import { RoleId } from "@/types";

// =============================================================
// Helper chuẩn hoá "role hiện tại" từ query ?role=... — dùng chung cho
// cổng /realtor và module Đào tạo, giống hệt logic của trang /realtor.
// =============================================================

/** guest / rỗng / không hợp lệ => coi như chưa đăng nhập (không có tên). */
export function resolveRole(param?: string): { roleId?: RoleId; name?: string } {
  const id = param as RoleId | undefined;
  const role = id && id !== "guest" && ROLES[id] ? ROLES[id] : undefined;
  return { roleId: role?.id, name: role?.name };
}

/** Nối ?role= vào link nội bộ để giữ ngữ cảnh role khi điều hướng. */
export function withRole(href: string, roleId?: RoleId): string {
  if (!roleId || !href.startsWith("/")) return href;
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}role=${roleId}`;
}
