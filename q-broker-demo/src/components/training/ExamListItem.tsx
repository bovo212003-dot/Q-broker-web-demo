import { Icon } from "@/components/ui/Icon";
import { ExamSet } from "@/data/training";
import { cn } from "@/lib/utils";

// Một dòng đề trắc nghiệm — tab Trắc nghiệm.
export function ExamListItem({ exam }: { exam: ExamSet }) {
  const isCore = exam.group === "Cơ sở";
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-al-200 hover:shadow-md">
      {/* Số thứ tự */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-al-50 text-lg font-bold text-al-600">
        {String(exam.index).padStart(2, "0")}
      </div>

      {/* Thông tin */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-800">{exam.title}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
          <Icon name="ListChecks" className="h-3.5 w-3.5" />
          {exam.questions} câu
          <span className="text-slate-300">·</span>
          <Icon name="Clock" className="h-3.5 w-3.5" />
          {exam.minutes} phút
        </p>
      </div>

      {/* Nhãn nhóm + trạng thái */}
      <div className="flex flex-col items-end gap-2">
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
            isCore
              ? "bg-sky-50 text-sky-600"
              : "bg-purple-50 text-purple-600"
          )}
        >
          {isCore ? "cơ sở" : "chuyên môn"}
        </span>
        {exam.done ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-al-100 px-3 py-1 text-xs font-semibold text-al-700">
            <Icon name="CheckCircle2" className="h-3.5 w-3.5" />
            Đã làm{exam.score ? ` · ${exam.score}%` : ""}
          </span>
        ) : (
          <span className="rounded-full bg-slate-500 px-3 py-1 text-xs font-semibold text-white transition-colors group-hover:bg-flame-500">
            Chưa làm
          </span>
        )}
      </div>
    </div>
  );
}
