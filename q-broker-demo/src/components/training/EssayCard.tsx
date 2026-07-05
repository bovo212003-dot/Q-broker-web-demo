import { Icon } from "@/components/ui/Icon";
import { EssayQuestion } from "@/data/training";

// Thẻ câu hỏi tự luận — tab Tự luận.
export function EssayCard({ essay }: { essay: EssayQuestion }) {
  const isCore = essay.group === "Kiến thức cơ sở";
  return (
    <article className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-al-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-al-50 text-sm font-bold text-al-600">
          {essay.id}
        </span>
        <span
          className={
            "rounded-full px-2.5 py-0.5 text-[11px] font-semibold " +
            (isCore ? "bg-sky-50 text-sky-600" : "bg-purple-50 text-purple-600")
          }
        >
          {isCore ? "cơ sở" : "chuyên môn"}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-700">
        {essay.prompt}
      </p>

      {/* Từ khoá gợi ý */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {essay.keywords.map((k) => (
          <span
            key={k}
            className="rounded-md bg-flame-50 px-2 py-0.5 text-[11px] font-medium text-flame-600"
          >
            #{k}
          </span>
        ))}
        <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-al-600 opacity-0 transition-opacity group-hover:opacity-100">
          Xem gợi ý & lời giải
          <Icon name="ArrowRight" className="h-3.5 w-3.5" />
        </span>
      </div>
    </article>
  );
}
