import { Suspense } from "react";
import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import { TrainingTabNav } from "@/components/training/TrainingTabNav";
import { TrainingChrome } from "@/components/training/TrainingChrome";

// =============================================================
// LAYOUT MODULE ĐÀO TẠO  (/realtor/dao-tao)
// Trang dùng chung cho mọi role — đặt trong nhánh /realtor (portal).
// Khung role-aware (TrainingChrome) đọc ?role= nên bọc trong <Suspense>;
// fallback là khung "khách" (chưa đăng nhập) để tránh nhấp nháy.
// =============================================================
export default function DaoTaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Suspense
        fallback={
          <>
            <RealtorHeader />
            <TrainingTabNav />
          </>
        }
      >
        <TrainingChrome />
      </Suspense>
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">{children}</main>
      <RealtorFooter />
    </div>
  );
}
