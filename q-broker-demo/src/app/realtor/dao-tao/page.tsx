import { Icon } from "@/components/ui/Icon";
import { TrainingHero } from "@/components/training/TrainingHero";
import { AnnouncementBar } from "@/components/training/AnnouncementBar";
import { TrainingProgress } from "@/components/training/TrainingProgress";
import { QuickActions } from "@/components/training/QuickActions";
import { CourseSection } from "@/components/training/CourseSection";
import { resolveRole } from "@/lib/role";

// TAB TRANG CHỦ — tổng hợp: thông báo (trên cùng), chào mừng, xếp hạng &
// chuyên cần, lối tắt, khoá học. Đọc ?role= để chào đúng tên theo role.
export default function DaoTaoHomePage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const { roleId, name } = resolveRole(searchParams.role);

  return (
    <div className="space-y-8">
      {/* Dòng thông báo đưa lên trên cùng */}
      <AnnouncementBar />
      <TrainingHero name={name} roleId={roleId} />

      {/* Xếp hạng & chuyên cần mỗi ngày */}
      <TrainingProgress />

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
