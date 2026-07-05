import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import { TrainingTabNav } from "@/components/training/TrainingTabNav";
import { TRAINEE } from "@/data/training";

// =============================================================
// LAYOUT MODULE ĐÀO TẠO  (/realtor/dao-tao)
// Trang dùng chung cho mọi role — đặt trong nhánh /realtor (portal).
// Khung: header portal (có nút "Đào tạo") + thanh tab phụ + nội dung + footer.
// =============================================================
export default function DaoTaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <RealtorHeader userName={TRAINEE.name} />
      <TrainingTabNav />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">{children}</main>
      <RealtorFooter />
    </div>
  );
}
