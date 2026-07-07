"use client";

import { useSearchParams } from "next/navigation";
import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { resolveRole } from "@/lib/role";

// Header của module Đào tạo. Điều hướng phụ (Trang chủ / Chuyên đề / Trắc
// nghiệm / Tự luận) đã chuyển thành bảng drop khi hover "Đào tạo" trên header.
// Layout không đọc được ?role= nên phần khung này (client) tự đọc query
// và cấp role xuống — giống cách trang /realtor truyền role vào header.
export function TrainingChrome() {
  const { roleId, name } = resolveRole(useSearchParams().get("role") ?? undefined);
  return <RealtorHeader userName={name} roleId={roleId} />;
}
