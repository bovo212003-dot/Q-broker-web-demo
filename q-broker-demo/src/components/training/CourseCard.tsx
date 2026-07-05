import { Icon } from "@/components/ui/Icon";
import { Course } from "@/data/training";

// Thẻ khoá học dạng banner (ảnh nền + scrim tối) — chữ luôn đọc rõ dù ảnh sáng.
export function CourseCard({ course }: { course: Course }) {
  const free = course.fee === "Miễn phí";
  return (
    <article className="group relative flex h-60 flex-col justify-end overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Ảnh nền */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={course.image}
        alt={course.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      {/* Scrim tối đều để đảm bảo tương phản chữ */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/15" />

      {/* Hàng trên: đơn vị đào tạo + học phí */}
      <div className="absolute inset-x-4 top-4 flex items-start justify-between">
        <span className="rounded-lg bg-white/15 px-2.5 py-1 text-xs font-bold text-white ring-1 ring-white/25 backdrop-blur-md">
          {course.provider}
        </span>
        <span
          className={
            "rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm " +
            (free ? "bg-emerald-500 text-white" : "bg-flame-500 text-white")
          }
        >
          {free ? "Miễn phí" : "Trả phí"}
        </span>
      </div>

      {/* Nội dung dưới */}
      <div className="relative p-4">
        <h3 className="line-clamp-2 text-[15px] font-bold uppercase leading-snug text-white drop-shadow-sm">
          {course.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/85">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-flame-400" />
            {course.level}
          </span>
          <span className="text-white/40">·</span>
          <span>{course.language}</span>
          <span className="text-white/40">·</span>
          <span>{course.lessons} bài</span>
        </div>

        <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-flame-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md transition-colors group-hover:bg-flame-600">
          {free ? "Học ngay" : "Liên hệ"}
          <Icon
            name="ArrowRight"
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </article>
  );
}
