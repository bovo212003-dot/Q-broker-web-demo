"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { MyPosting, PostingStatus } from "@/data/recruitment";
import { cn, formatNumber } from "@/lib/utils";

// Modal xem CHI TIẾT tin tuyển dụng — phía nhà tuyển dụng xem lại bài đã đăng.
// Hiển thị đầy đủ nội dung: vị trí, số lượng, địa điểm, hình thức, thu nhập,
// hoa hồng, mô tả, yêu cầu, quyền lợi, liên hệ + trạng thái / lượt xem / ứng viên.
const STATUS_TONE: Record<PostingStatus, string> = {
  "Đang hiển thị": "bg-emerald-50 text-emerald-600 border-emerald-200",
  "Chờ kiểm duyệt": "bg-amber-50 text-amber-600 border-amber-200",
  "Hết hạn": "bg-slate-100 text-slate-500 border-slate-200",
};

export function PostingDetailModal({
  posting: p,
  applicantCount,
  onClose,
}: {
  posting: MyPosting;
  applicantCount: number;
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
        {/* Banner tiêu đề */}
        <div className="relative bg-gradient-to-br from-al-700 via-al-600 to-al-500 px-6 pb-6 pt-6 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-white/80 hover:bg-white/10"
            aria-label="Đóng"
          >
            <Icon name="X" className="h-5 w-5" />
          </button>
          <p className="text-xs font-bold uppercase tracking-wide text-white/70">
            Chi tiết tin tuyển dụng
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold leading-tight">{p.title}</h2>
            <span
              className={cn(
                "rounded-full border bg-white/15 px-2.5 py-0.5 text-[11px] font-bold text-white",
                p.status === "Đang hiển thị" && "border-emerald-200",
                p.status === "Chờ kiểm duyệt" && "border-amber-200",
                p.status === "Hết hạn" && "border-white/30"
              )}
            >
              {p.status}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/85">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Eye" className="h-4 w-4 text-flame-300" />
              {formatNumber(p.views)} lượt xem
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Users" className="h-4 w-4 text-flame-300" />
              {applicantCount} ứng viên đã nộp
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="CalendarClock" className="h-4 w-4 text-flame-300" />
              Hạn nộp {p.deadline}
            </span>
          </div>
        </div>

        {/* Nội dung */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Thông tin nhanh */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Fact icon="Briefcase" label="Vị trí" value={p.position ?? "—"} />
            <Fact icon="Users" label="Số lượng" value={p.openings ? `${p.openings} người` : "—"} />
            <Fact icon="MapPin" label="Địa điểm" value={p.area ?? "—"} />
            <Fact icon="Clock" label="Hình thức" value={p.workType ?? "—"} />
          </div>

          {/* Thu nhập & hoa hồng */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-flame-50 p-3.5">
              <p className="flex items-center gap-1.5 text-xs font-bold text-flame-600">
                <Icon name="BadgeDollarSign" className="h-4 w-4" />
                Mức thu nhập
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {p.salary ?? "Thoả thuận"}
              </p>
            </div>
            <div className="rounded-xl bg-al-50 p-3.5">
              <p className="flex items-center gap-1.5 text-xs font-bold text-al-600">
                <Icon name="Percent" className="h-4 w-4" />
                Chính sách hoa hồng
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {p.commission != null ? `Tới ${p.commission}%` : "Theo thoả thuận"}
              </p>
            </div>
          </div>

          {p.description && (
            <Section icon="FileText" title="Mô tả công việc">
              {p.description}
            </Section>
          )}
          {p.requirement && (
            <Section icon="ListChecks" title="Yêu cầu ứng viên">
              {p.requirement}
            </Section>
          )}
          {p.benefit && (
            <Section icon="Gift" title="Quyền lợi">
              {p.benefit}
            </Section>
          )}

          {/* Liên hệ & thời gian đăng */}
          <div className="mt-5 flex flex-wrap gap-2">
            {p.contact && (
              <span className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700">
                <Icon name="Phone" className="h-4 w-4 text-al-500" />
                {p.contact}
              </span>
            )}
            {p.postedAt && (
              <span className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700">
                <Icon name="CalendarDays" className="h-4 w-4 text-al-500" />
                Đăng ngày {p.postedAt}
              </span>
            )}
          </div>

          {p.status === "Chờ kiểm duyệt" && (
            <p className="mt-4 flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs font-semibold text-amber-700">
              <Icon name="ShieldCheck" className="h-4 w-4 shrink-0" />
              Tin đang chờ kiểm duyệt — sẽ hiển thị công khai với ứng viên sau khi được duyệt.
            </p>
          )}
        </div>

        {/* Chân modal */}
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
