"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { JobPosting } from "@/data/recruitment";
import { cn, formatNumber } from "@/lib/utils";

// Modal chi tiết tin tuyển dụng — phía ứng viên (môi giới) xem & ứng tuyển.
export function JobDetailModal({
  job,
  saved,
  applied,
  onToggleSave,
  onApply,
  onClose,
}: {
  job: JobPosting;
  saved: boolean;
  applied: boolean;
  onToggleSave: () => void;
  onApply: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-slate-900/70 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative flex max-h-[92vh] w-full animate-pop-in flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: công ty + tiêu đề */}
        <div className="relative bg-gradient-to-br from-al-700 via-al-600 to-al-500 px-6 pb-6 pt-6 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-white/80 hover:bg-white/10"
            aria-label="Đóng"
          >
            <Icon name="X" className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={job.company.logo}
                alt={job.company.name}
                className="h-14 w-14 rounded-xl object-cover ring-2 ring-white/40"
              />
              {job.company.verified && (
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-al-600 bg-sky-500 text-white">
                  <Icon name="Check" className="h-2.5 w-2.5" />
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white/90">{job.company.name}</p>
              <p className="text-xs text-white/60">{job.company.type}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold leading-tight">{job.title}</h2>
            {job.hot && (
              <span className="rounded-md bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                HOT
              </span>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/85">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Eye" className="h-4 w-4 text-flame-300" />
              {formatNumber(job.views)} lượt xem
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Users" className="h-4 w-4 text-flame-300" />
              {job.applicants} ứng tuyển
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="CalendarClock" className="h-4 w-4 text-flame-300" />
              Hạn {job.deadline}
            </span>
          </div>
        </div>

        {/* Nội dung */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Lương + hoa hồng */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-emerald-50 p-3.5">
              <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <Icon name="Wallet" className="h-4 w-4" />
                Mức thu nhập
              </p>
              <p className="mt-1 text-sm font-bold text-slate-700">{job.salary}</p>
            </div>
            <div className="rounded-xl bg-flame-50 p-3.5">
              <p className="flex items-center gap-1.5 text-xs font-bold text-flame-600">
                <Icon name="Percent" className="h-4 w-4" />
                Hoa hồng
              </p>
              <p className="mt-1 text-sm font-bold text-slate-700">Tới {job.commission}%</p>
            </div>
          </div>

          {/* Thông tin nhanh */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Fact icon="Briefcase" label="Vị trí" value={job.position} />
            <Fact icon="Users" label="Số lượng" value={`${job.openings} người`} />
            <Fact icon="MapPin" label="Khu vực" value={job.area} />
            <Fact icon="Clock" label="Hình thức" value={job.workType} />
            <Fact icon="Building2" label="Loại hình BĐS" value={job.focus} />
            <Fact icon="GraduationCap" label="Kinh nghiệm" value={job.expYears} />
          </div>

          {job.description && (
            <Section icon="FileText" title="Mô tả công việc">
              {job.description}
            </Section>
          )}
          {job.requirement && (
            <Section icon="ListChecks" title="Yêu cầu ứng viên">
              {job.requirement}
            </Section>
          )}
          {job.benefit && (
            <Section icon="Gift" title="Quyền lợi">
              {job.benefit}
            </Section>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {job.contact && (
              <span className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700">
                <Icon name="Phone" className="h-4 w-4 text-al-500" />
                {job.contact}
              </span>
            )}
            {job.postedAt && (
              <span className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700">
                <Icon name="CalendarDays" className="h-4 w-4 text-al-500" />
                Đăng ngày {job.postedAt}
              </span>
            )}
          </div>
        </div>

        {/* Thao tác */}
        <div className="flex items-center gap-2 border-t border-slate-200 bg-white p-4">
          <button
            onClick={onToggleSave}
            aria-label={saved ? "Bỏ lưu" : "Lưu tin"}
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors",
              saved
                ? "border-flame-200 bg-flame-50 text-flame-500"
                : "border-slate-200 text-slate-400 hover:border-flame-300 hover:text-flame-500"
            )}
          >
            <Icon name="Bookmark" className={cn("h-5 w-5", saved && "fill-flame-500")} />
          </button>
          <button
            onClick={onApply}
            disabled={applied}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl px-6 py-3 text-sm font-bold transition-all",
              applied
                ? "cursor-default bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
                : "bg-al-600 text-white hover:bg-al-700"
            )}
          >
            <Icon name={applied ? "CheckCircle2" : "Send"} className="h-4 w-4" />
            {applied ? "Đã ứng tuyển" : "Ứng tuyển ngay"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Fact({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <Icon name={icon} className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-700">
        <Icon name={icon} className="h-4 w-4 text-al-500" />
        {title}
      </p>
      <p className="whitespace-pre-line rounded-xl bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-600">
        {children}
      </p>
    </div>
  );
}
