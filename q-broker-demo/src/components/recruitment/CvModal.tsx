"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { CANDIDATE_CV } from "@/data/recruitment";
import { formatNumber } from "@/lib/utils";

// Modal xem CV đầy đủ của môi giới (CV trực tuyến dạng résumé).
// Bố cục 2 cột: cột trái thông tin & kỹ năng, cột phải kinh nghiệm / học vấn.
export function CvModal({ onClose }: { onClose: () => void }) {
  const cv = CANDIDATE_CV;
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
        className="relative flex max-h-[94vh] w-full animate-pop-in flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-3xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header định danh */}
        <div className="relative bg-gradient-to-br from-al-700 via-al-600 to-al-500 px-6 pb-6 pt-6 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-white/80 hover:bg-white/10"
            aria-label="Đóng"
          >
            <Icon name="X" className="h-5 w-5" />
          </button>
          <div className="flex flex-wrap items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cv.avatar}
              alt={cv.name}
              className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white/30"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-white/70">
                CV trực tuyến · Q-Broker
              </p>
              <h2 className="mt-1 text-2xl font-bold leading-tight">{cv.name}</h2>
              <p className="text-sm text-white/85">{cv.headline}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge icon="Medal">{cv.tier}</Badge>
                {cv.verified && <Badge icon="BadgeCheck">Đã xác minh</Badge>}
                {cv.certified && <Badge icon="Award">Có chứng chỉ hành nghề</Badge>}
              </div>
            </div>
          </div>
          {/* Liên hệ */}
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-white/90">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Phone" className="h-4 w-4 text-flame-300" />
              {cv.phone}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Mail" className="h-4 w-4 text-flame-300" />
              {cv.email}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="MapPin" className="h-4 w-4 text-flame-300" />
              {cv.area}
            </span>
          </div>
        </div>

        {/* Nội dung cuộn */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Dải thành tích */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricCard icon="BadgeDollarSign" value={`${cv.deals}`} label="Giao dịch chốt" />
            <MetricCard icon="TrendingUp" value={cv.gmv} label="Tổng giá trị GD" />
            <MetricCard icon="Star" value={`${cv.rating}`} label={`${cv.reviews} đánh giá`} />
            <MetricCard icon="Briefcase" value={`${cv.years} năm`} label="Kinh nghiệm" />
          </div>

          {/* Giới thiệu bản thân */}
          <Section icon="UserRound" title="Giới thiệu">
            <p className="text-sm leading-relaxed text-slate-600">{cv.bio}</p>
          </Section>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Cột trái: kinh nghiệm + học vấn */}
            <div className="space-y-6">
              <Section icon="Briefcase" title="Kinh nghiệm làm việc">
                <div className="relative space-y-5 border-l-2 border-slate-100 pl-5">
                  {cv.experiences.map((e) => (
                    <div key={e.role + e.period} className="relative">
                      <span className="absolute -left-[26px] top-1 h-3 w-3 rounded-full bg-al-500 ring-4 ring-al-50" />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-bold text-slate-800">{e.role}</p>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
                          {e.period}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-al-600">{e.org}</p>
                      <p className="mt-1 text-sm text-slate-600">{e.desc}</p>
                      <ul className="mt-1.5 space-y-1">
                        {e.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-1.5 text-xs text-slate-500">
                            <Icon name="Check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Section>

              <Section icon="GraduationCap" title="Học vấn">
                {cv.education.map((ed) => (
                  <div key={ed.school} className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-slate-800">{ed.school}</p>
                      <p className="text-sm text-slate-500">{ed.major}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
                      {ed.period}
                    </span>
                  </div>
                ))}
              </Section>
            </div>

            {/* Cột phải: kỹ năng, chứng chỉ, giải thưởng, ngôn ngữ */}
            <div className="space-y-6">
              <Section icon="Sparkles" title="Kỹ năng">
                <div className="space-y-2.5">
                  {cv.skills.map((s) => (
                    <div key={s.name}>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                        <span>{s.name}</span>
                        <span className="text-al-600">{s.level}%</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-al-500 to-flame-500"
                          style={{ width: `${s.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section icon="Award" title="Chứng chỉ">
                <div className="space-y-2">
                  {cv.certificates.map((c) => (
                    <div key={c.name} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <p className="text-sm font-bold text-slate-700">{c.name}</p>
                      <p className="text-xs text-slate-400">
                        {c.issuer} · {c.year}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section icon="Trophy" title="Giải thưởng">
                <div className="space-y-2">
                  {cv.awards.map((a) => (
                    <div key={a.title} className="flex items-start gap-2">
                      <Icon name="Trophy" className="mt-0.5 h-4 w-4 shrink-0 text-flame-500" />
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{a.title}</p>
                        <p className="text-xs text-slate-400">
                          {a.detail} · {a.year}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section icon="Languages" title="Ngôn ngữ">
                <div className="flex flex-wrap gap-2">
                  {cv.languages.map((l) => (
                    <span
                      key={l.name}
                      className="inline-flex items-center gap-1.5 rounded-full bg-al-50 px-3 py-1 text-xs font-semibold text-al-700"
                    >
                      {l.name}
                      <span className="text-al-400">· {l.level}</span>
                    </span>
                  ))}
                </div>
              </Section>
            </div>
          </div>

          {/* Chuyên môn & dự án */}
          <Section icon="Building2" title="Chuyên môn & dự án đã tham gia">
            <div className="flex flex-wrap gap-1.5">
              {cv.specialties.map((s) => (
                <span key={s} className="rounded-full bg-flame-50 px-2.5 py-1 text-xs font-semibold text-flame-600">
                  {s}
                </span>
              ))}
              {cv.projects.map((p) => (
                <span key={p} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {p}
                </span>
              ))}
            </div>
          </Section>
        </div>

        {/* Chân modal */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white p-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Icon name="Star" className="h-3.5 w-3.5 text-flame-500" />
            {formatNumber(cv.points)} điểm thành tích · phản hồi {cv.responseRate}%
          </span>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-xl border border-al-200 bg-white px-4 py-2 text-sm font-bold text-al-600 hover:border-al-400">
              <Icon name="Download" className="h-4 w-4" />
              Tải CV (PDF)
            </button>
            <button
              onClick={onClose}
              className="rounded-xl bg-al-600 px-6 py-2 text-sm font-bold text-white hover:bg-al-700"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur">
      <Icon name={icon} className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

function MetricCard({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
      <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-al-100 text-al-600">
        <Icon name={icon} className="h-4 w-4" />
      </span>
      <p className="mt-1.5 text-lg font-bold text-slate-800">{value}</p>
      <p className="text-[11px] text-slate-400">{label}</p>
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
    <div className="mt-6 first:mt-0">
      <p className="mb-3 flex items-center gap-2 text-sm font-bold text-al-700">
        <Icon name={icon} className="h-4 w-4 text-flame-500" />
        {title}
      </p>
      {children}
    </div>
  );
}
