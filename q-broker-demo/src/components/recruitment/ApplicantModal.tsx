"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { Applicant, ApplicationStatus, PIPELINE_STATUSES } from "@/data/recruitment";
import { cn, formatNumber } from "@/lib/utils";

// Modal xem hồ sơ chi tiết ứng viên (CV trực tuyến) — phía nhà tuyển dụng.
// Cho phép đổi trạng thái pipeline & thao tác nhanh ngay trong hồ sơ.
export function ApplicantModal({
  applicant: a,
  onClose,
  onStatus,
  onSchedule,
}: {
  applicant: Applicant;
  onClose: () => void;
  onStatus: (s: ApplicationStatus) => void;
  onSchedule: () => void;
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
        {/* Banner + định danh */}
        <div className="relative bg-gradient-to-br from-al-700 via-al-600 to-al-500 px-6 pb-14 pt-6 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-white/80 hover:bg-white/10"
            aria-label="Đóng"
          >
            <Icon name="X" className="h-5 w-5" />
          </button>
          <p className="text-xs font-bold uppercase tracking-wide text-white/70">
            Hồ sơ nghề nghiệp · CV trực tuyến
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm text-white/85">
            <Icon name="Briefcase" className="h-4 w-4 text-flame-300" />
            Ứng tuyển: <b className="text-white">{a.appliedFor}</b>
            <span className="text-white/50">·</span>
            nộp {a.appliedAt.slice(5)}
          </div>
        </div>

        {/* Avatar nổi */}
        <div className="relative -mt-12 flex-1 overflow-y-auto px-6 pb-6">
          <div className="flex flex-wrap items-end gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={a.avatar}
              alt={a.name}
              className="h-24 w-24 rounded-2xl object-cover ring-4 ring-white"
            />
            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-slate-800">{a.name}</h2>
                {a.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-bold text-sky-600">
                    <Icon name="BadgeCheck" className="h-3.5 w-3.5" />
                    Đã xác minh
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-600">
                  <Icon name="Medal" className="h-3.5 w-3.5" />
                  {a.tier}
                </span>
                {a.certified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                    <Icon name="Award" className="h-3.5 w-3.5" />
                    Chứng chỉ hành nghề
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-400">
                    Chưa có chứng chỉ
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm italic text-slate-500">&ldquo;{a.intro}&rdquo;</p>
            </div>
          </div>

          {/* Liên hệ (mở khi ứng tuyển) */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700">
              <Icon name="Phone" className="h-4 w-4 text-al-500" />
              {a.phone}
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700">
              <Icon name="Mail" className="h-4 w-4 text-al-500" />
              {a.email}
            </span>
          </div>

          {/* Thống kê */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon="MapPin" label="Khu vực" value={a.area} />
            <Stat icon="Briefcase" label="Kinh nghiệm" value={`${a.years} năm`} />
            <Stat icon="Star" label="Điểm thành tích" value={formatNumber(a.points)} />
            <Stat icon="BadgeDollarSign" label="Giao dịch" value={`${a.deals} · ★${a.rating}`} />
          </div>

          {/* Chuyên môn */}
          <Block title="Lĩnh vực chuyên môn">
            <div className="flex flex-wrap gap-1.5">
              {a.specialties.map((s) => (
                <span key={s} className="rounded-full bg-al-50 px-2.5 py-1 text-xs font-semibold text-al-700">
                  {s}
                </span>
              ))}
            </div>
          </Block>

          {/* Dự án đã tham gia */}
          <Block title="Dự án đã tham gia">
            <div className="flex flex-wrap gap-1.5">
              {a.projects.map((p) => (
                <span key={p} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {p}
                </span>
              ))}
            </div>
          </Block>

          {/* Lời giới thiệu */}
          {a.coverLetter && (
            <Block title="Lời giới thiệu">
              <p className="rounded-xl bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-600">
                {a.coverLetter}
              </p>
            </Block>
          )}
        </div>

        {/* Thao tác */}
        <div className="border-t border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Trạng thái</span>
              <select
                value={a.status}
                onChange={(e) => onStatus(e.target.value as ApplicationStatus)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-al-700 focus:border-al-400 focus:outline-none"
              >
                {PIPELINE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="ml-auto flex flex-wrap gap-2">
              <button
                onClick={onSchedule}
                className="inline-flex items-center gap-1.5 rounded-xl border border-al-200 bg-white px-4 py-2 text-sm font-bold text-al-600 hover:border-al-400"
              >
                <Icon name="CalendarPlus" className="h-4 w-4" />
                Mời phỏng vấn
              </button>
              <button
                onClick={() => onStatus("Đã tuyển")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-600"
              >
                <Icon name="Check" className="h-4 w-4" />
                Tuyển
              </button>
              <button
                onClick={() => onStatus("Không phù hợp")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-rose-500 hover:border-rose-300"
                )}
              >
                <Icon name="X" className="h-4 w-4" />
                Loại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
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

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-sm font-bold text-slate-700">{title}</p>
      {children}
    </div>
  );
}
