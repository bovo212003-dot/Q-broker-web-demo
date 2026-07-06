"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { ApplicationStatus, JobPosting, MyApplication } from "@/data/recruitment";
import { cn } from "@/lib/utils";

// Hành trình ứng tuyển (góc nhìn ứng viên) — bỏ qua trạng thái "Không phù hợp".
const JOURNEY: ApplicationStatus[] = [
  "Hồ sơ mới",
  "Đã xem",
  "Đang liên hệ",
  "Mời phỏng vấn",
  "Đã phỏng vấn",
  "Chờ kết quả",
  "Đã tuyển",
];

// Modal chi tiết một đơn ứng tuyển — phía môi giới theo dõi tiến trình.
export function ApplicationDetailModal({
  app,
  job,
  onClose,
}: {
  app: MyApplication;
  job?: JobPosting;
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

  const rejected = app.status === "Không phù hợp";
  const currentIdx = JOURNEY.indexOf(app.status);

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-slate-900/70 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative flex max-h-[92vh] w-full animate-pop-in flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-al-700 via-al-600 to-al-500 px-6 pb-6 pt-6 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-white/80 hover:bg-white/10"
            aria-label="Đóng"
          >
            <Icon name="X" className="h-5 w-5" />
          </button>
          <p className="text-xs font-bold uppercase tracking-wide text-white/70">
            Đơn ứng tuyển của tôi
          </p>
          <h2 className="mt-1 text-xl font-bold leading-tight">{app.jobTitle}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/85">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Building2" className="h-4 w-4 text-flame-300" />
              {app.company}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="CalendarDays" className="h-4 w-4 text-flame-300" />
              Nộp {app.appliedAt}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Trạng thái hiện tại */}
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold",
              rejected
                ? "bg-rose-50 text-rose-600"
                : app.status === "Đã tuyển"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-al-50 text-al-700"
            )}
          >
            <Icon
              name={rejected ? "XCircle" : app.status === "Đã tuyển" ? "PartyPopper" : "Loader"}
              className="h-4 w-4"
            />
            Trạng thái hiện tại: {app.status}
          </div>

          {/* Hành trình ứng tuyển */}
          <p className="mb-3 mt-5 flex items-center gap-1.5 text-sm font-bold text-slate-700">
            <Icon name="Route" className="h-4 w-4 text-flame-500" />
            Tiến trình xử lý
          </p>
          {rejected ? (
            <p className="rounded-xl border border-rose-100 bg-rose-50/60 p-3.5 text-sm text-rose-600">
              Rất tiếc, hồ sơ chưa phù hợp với vị trí này. Đừng nản lòng — hãy tiếp tục ứng
              tuyển các tin khác phù hợp hơn nhé!
            </p>
          ) : (
            <ol className="relative space-y-4 border-l-2 border-slate-100 pl-5">
              {JOURNEY.map((stage, i) => {
                const done = i < currentIdx;
                const active = i === currentIdx;
                return (
                  <li key={stage} className="relative">
                    <span
                      className={cn(
                        "absolute -left-[26px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-4",
                        done && "bg-emerald-500 ring-emerald-50",
                        active && "bg-al-500 ring-al-100",
                        !done && !active && "bg-slate-200 ring-white"
                      )}
                    >
                      {done && <Icon name="Check" className="h-2.5 w-2.5 text-white" />}
                    </span>
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        active ? "text-al-700" : done ? "text-slate-600" : "text-slate-400"
                      )}
                    >
                      {stage}
                      {active && (
                        <span className="ml-2 rounded-full bg-al-100 px-2 py-0.5 text-[10px] font-bold text-al-600">
                          Hiện tại
                        </span>
                      )}
                    </p>
                  </li>
                );
              })}
            </ol>
          )}

          {/* Lịch phỏng vấn */}
          {app.status === "Mời phỏng vấn" && app.interview && (
            <div className="mt-5 rounded-xl bg-flame-50/70 p-3.5">
              <p className="flex items-center gap-1.5 text-sm font-bold text-flame-700">
                <Icon name="CalendarClock" className="h-4 w-4" />
                Lịch phỏng vấn
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Ngày {app.interview.date} lúc {app.interview.time}. Vui lòng phản hồi lời mời
                trong danh sách đơn ứng tuyển.
              </p>
            </div>
          )}

          {/* Thông tin tin tuyển dụng liên quan */}
          {job && (
            <div className="mt-5">
              <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-slate-700">
                <Icon name="Briefcase" className="h-4 w-4 text-al-500" />
                Tin tuyển dụng đã ứng tuyển
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Fact icon="Wallet" label="Thu nhập" value={job.salary} />
                <Fact icon="Percent" label="Hoa hồng" value={`Tới ${job.commission}%`} />
                <Fact icon="MapPin" label="Khu vực" value={job.area} />
                <Fact icon="Clock" label="Hình thức" value={job.workType} />
              </div>
              {job.description && (
                <p className="mt-3 rounded-xl bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-600">
                  {job.description}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white p-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-al-600 px-6 py-3 text-sm font-bold text-white hover:bg-al-700 sm:w-auto"
          >
            Đóng
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
