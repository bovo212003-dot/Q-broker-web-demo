"use client";

import { Icon } from "@/components/ui/Icon";
import { JobPosting } from "@/data/recruitment";
import { cn } from "@/lib/utils";

// Thẻ tin tuyển dụng — dạng NGANG DÀI, xếp theo một cột dọc (phía ứng viên).
// Trái: logo + thông tin công ty/tin. Phải: hạn nộp + lưu + ứng tuyển.
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
      className="group flex cursor-pointer flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-al-200 hover:shadow-md sm:flex-row sm:items-center sm:p-5"
    >
      {/* Khối thông tin chính */}
      <div className="flex min-w-0 flex-1 gap-4">
        {/* Logo công ty */}
        <div className="relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={job.company.logo}
            alt={job.company.name}
            className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200 sm:h-16 sm:w-16"
          />
          {job.company.verified && (
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-sky-500 text-white">
              <Icon name="Check" className="h-2.5 w-2.5" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {/* Công ty */}
          <p className="flex flex-wrap items-center gap-x-1.5 text-sm">
            <span className="font-semibold text-slate-700">{job.company.name}</span>
            <span className="text-xs text-slate-400">· {job.company.type}</span>
          </p>

          {/* Tiêu đề + HOT */}
          <h3 className="mt-0.5 flex items-center gap-2 font-bold leading-snug text-slate-800 transition-colors group-hover:text-al-700">
            <span className="line-clamp-1">{job.title}</span>
            {job.hot && (
              <span className="shrink-0 rounded-md bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                HOT
              </span>
            )}
          </h3>

          {/* Lương + hoa hồng */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-bold text-emerald-600">
              <Icon name="Wallet" className="h-4 w-4" />
              {job.salary}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-flame-50 px-2.5 py-1 text-xs font-bold text-flame-600">
              HH tới {job.commission}%
            </span>
          </div>

          {/* Meta */}
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-500">
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
        </div>
      </div>

      {/* Cột hành động (phải trên desktop / footer trên mobile) */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:min-w-[176px] sm:flex-col sm:items-end sm:justify-center sm:gap-2.5 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
        <span className="text-xs text-slate-400 sm:order-2 sm:text-right">
          <b className="font-semibold text-slate-500">{job.applicants}</b> ứng tuyển
          <span className="mx-1 text-slate-300 sm:hidden">·</span>
          <span className="block sm:inline"> hạn {job.deadline.slice(5)}</span>
        </span>
        <div className="flex items-center gap-2 sm:order-1 sm:w-full sm:justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
            aria-label={saved ? "Bỏ lưu" : "Lưu tin"}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors",
              saved
                ? "border-flame-200 bg-flame-50 text-flame-500"
                : "border-slate-200 text-slate-400 hover:border-flame-300 hover:text-flame-500"
            )}
          >
            <Icon name="Bookmark" className={cn("h-4 w-4", saved && "fill-flame-500")} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApply();
            }}
            disabled={applied}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all",
              applied
                ? "cursor-default bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                : "bg-al-600 text-white shadow-sm hover:bg-al-700"
            )}
          >
            <Icon name={applied ? "CheckCircle2" : "Send"} className="h-4 w-4" />
            {applied ? "Đã ứng tuyển" : "Ứng tuyển"}
          </button>
        </div>
      </div>
    </article>
  );
}
