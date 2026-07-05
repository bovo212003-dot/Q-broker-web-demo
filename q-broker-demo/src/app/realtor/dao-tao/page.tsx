import { Icon } from "@/components/ui/Icon";
import { TrainingHero } from "@/components/training/TrainingHero";
import { AnnouncementBar } from "@/components/training/AnnouncementBar";
import { PromoCarousel } from "@/components/training/PromoCarousel";
import { QuickActions } from "@/components/training/QuickActions";
import { CourseSection } from "@/components/training/CourseSection";
import { resolveRole } from "@/lib/role";

// TAB TRANG CHỦ — tổng hợp: chào mừng, thông báo, banner, lối tắt, khoá học.
// Đọc ?role= (như trang /realtor) để chào đúng tên theo role.
export default function DaoTaoHomePage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const { roleId, name } = resolveRole(searchParams.role);

  return (
    <div className="space-y-8">
      <TrainingHero name={name} />
      <AnnouncementBar />
      <PromoCarousel />

      {/* Lối tắt nhanh */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-al-700">
          <Icon name="Zap" className="h-5 w-5 text-flame-500" />
          Lối tắt nhanh
        </h2>
        <QuickActions roleId={roleId} />
      </section>

      {/* Khám phá khoá học */}
      <CourseSection />
    </div>
  );
}
