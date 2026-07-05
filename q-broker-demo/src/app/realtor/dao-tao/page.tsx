import { Icon } from "@/components/ui/Icon";
import { TrainingHero } from "@/components/training/TrainingHero";
import { AnnouncementBar } from "@/components/training/AnnouncementBar";
import { PromoCarousel } from "@/components/training/PromoCarousel";
import { QuickActions } from "@/components/training/QuickActions";
import { CourseExplorer } from "@/components/training/CourseExplorer";

// TAB TRANG CHỦ — tổng hợp: chào mừng, thông báo, banner, lối tắt, khoá học.
export default function DaoTaoHomePage() {
  return (
    <div className="space-y-8">
      <TrainingHero />
      <AnnouncementBar />
      <PromoCarousel />

      {/* Lối tắt nhanh */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-al-700">
          <Icon name="Zap" className="h-5 w-5 text-flame-500" />
          Lối tắt nhanh
        </h2>
        <QuickActions />
      </section>

      {/* Khám phá khoá học */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-al-700">
            <Icon name="Compass" className="h-5 w-5 text-flame-500" />
            Khám phá khoá học
          </h2>
          <a
            href="#"
            className="inline-flex items-center gap-1 text-sm font-semibold text-al-600 hover:text-al-700"
          >
            Xem tất cả
            <Icon name="ArrowRight" className="h-4 w-4" />
          </a>
        </div>
        <CourseExplorer />
      </section>
    </div>
  );
}
