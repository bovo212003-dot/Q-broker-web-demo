"use client";

import { Icon } from "@/components/ui/Icon";
import { JobPosting } from "@/data/recruitment";
import { cn } from "@/lib/utils";

// Thẻ tin tuyển dụng — dùng ở bảng việc làm (phía ứng viên).
export function JobCard({
  job,
  saved,
  applied,
  onToggleSave,
  onApply,
  onOpen,
}: {
  job: JobPosting;
  saved: boolean;
  applied: boolean;
  onToggleSave: () => void;
  onApply: () => void;
  onOpen?: () => void;
}) {
  return (
    <article
      onClick={onOpen}
      className="group flex cursor-pointer flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-al-200 hover:shadow-lg"
    >
      {/* Header: logo + công ty */}
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={job.company.logo}
            alt={job.company.name}
            className="h-12 w-12 rounded-xl object-cover ring-1 ring-slate-200"
          />
          {job.company.verified && (
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-sky-500 text-white">
              <Icon name="Check" className="h-2.5 w-2.5" />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            {job.company.name}
          </p>
          <p className="text-xs text-slate-400">{job.company.type}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave();
          }}
          aria-label={saved ? "Bỏ lưu" : "Lưu tin"}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors",
            saved
              ? "border-flame-200 bg-flame-50 text-flame-500"
              : "border-slate-200 text-slate-400 hover:border-flame-300 hover:text-flame-500"
          )}
        >
          <Icon name="Bookmark" className={cn("h-4 w-4", saved && "fill-flame-500")} />
        </button>
      </div>

      {/* Tiêu đề */}
      <h3 className="mt-3 flex items-start gap-2 font-bold leading-snug text-slate-800">
        <span className="line-clamp-2">{job.title}</span>
        {job.hot && (
          <span className="mt-0.5 shrink-0 rounded-md bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
            HOT
          </span>
        )}
      </h3>

      {/* Lương + hoa hồng */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-bold text-emerald-600">
          <Icon name="Wallet" className="h-4 w-4" />
          {job.salary}
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-flame-50 px-2.5 py-1 text-xs font-bold text-flame-600">
          HH tới {job.commission}%
        </span>
      </div>

      {/* Meta */}
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Icon name="MapPin" className="h-3.5 w-3.5" />
          {job.area}
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon name="Clock" className="h-3.5 w-3.5" />
          {job.workType}
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon name="Users" className="h-3.5 w-3.5" />
          Tuyển {job.openings}
        </span>
        <span className="inline-flex items-center gap-1">
          <Icon name="Briefcase" className="h-3.5 w-3.5" />
          {job.expYears}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-400">
          {job.applicants} ứng tuyển · hạn {job.deadline.slice(5)}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onApply();
          }}
          disabled={applied}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-all",
            applied
              ? "cursor-default bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
              : "bg-al-600 text-white hover:bg-al-700"
          )}
        >
          <Icon name={applied ? "CheckCircle2" : "Send"} className="h-4 w-4" />
          {applied ? "Đã ứng tuyển" : "Ứng tuyển"}
        </button>
      </div>
    </article>
  );
}
