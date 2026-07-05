import { Icon } from "@/components/ui/Icon";
import { Course } from "@/data/training";

// Thẻ khoá học dạng banner (ảnh nền + phủ navy) — giống card mobile app.
export function CourseCard({ course }: { course: Course }) {
  const free = course.price === "FREE";
  return (
    <article className="group relative h-56 overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-lg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={course.image}
        alt={course.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-al-900/95 via-al-800/55 to-al-900/20" />

      {/* Chip đơn vị đào tạo */}
      <span className="absolute left-4 top-4 rounded-lg bg-al-900/70 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
        {course.provider}
      </span>

      {/* Huy hiệu Học ngay */}
      <span className="absolute right-4 top-4 flex h-14 w-14 animate-float items-center justify-center rounded-full bg-flame-500 text-center text-[11px] font-bold leading-none text-white shadow-lg">
        HỌC
        <br />
        NGAY
      </span>

      {/* Nội dung dưới */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="text-lg font-bold uppercase leading-tight text-white">
          {course.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-2 text-xs text-white/80">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-flame-400" />
            {course.level}
          </span>
          <span>· {course.language}</span>
          <span>· {course.lessons} bài</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span
            className={
              "rounded-md px-2.5 py-1 text-xs font-bold " +
              (free ? "bg-emerald-500 text-white" : "bg-white/20 text-white backdrop-blur")
            }
          >
            {free ? "FREE" : "Liên hệ"}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-flame-400 opacity-0 transition-opacity group-hover:opacity-100">
            Xem khoá học
            <Icon name="ArrowRight" className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
