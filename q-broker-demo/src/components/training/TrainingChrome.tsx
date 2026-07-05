"use client";

import { useSearchParams } from "next/navigation";
import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { TrainingTabNav } from "./TrainingTabNav";
import { resolveRole } from "@/lib/role";

// Header + thanh tab của module Đào tạo.
// Layout không đọc được ?role= nên phần khung này (client) tự đọc query
// và cấp role xuống — giống cách trang /realtor truyền role vào header.
export function TrainingChrome() {
  const { roleId, name } = resolveRole(useSearchParams().get("role") ?? undefined);
  return (
    <>
      <RealtorHeader userName={name} roleId={roleId} />
      <TrainingTabNav roleId={roleId} />
    </>
  );
}
