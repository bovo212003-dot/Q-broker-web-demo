"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { RoleId } from "@/types";
import {
  APPLICANTS_BY_POSTING,
  Applicant,
  ApplicationStatus,
  CANDIDATE_CV,
  COMPANY_TYPES,
  EMPLOYER_HERO,
  EMPLOYER_PROFILES,
  EmployerProfile,
  EmployerRole,
  img,
  JOBS,
  JobPosting,
  MY_APPLICATIONS,
  MY_POSTINGS,
  MyApplication,
  MyPosting,
  PIPELINE_STATUSES,
  PROPERTY_FOCUS,
  PostingStatus,
  RECRUIT_STATS,
  REC_AREAS,
  SALARY_RANGES,
  WORK_TYPES,
} from "@/data/recruitment";
import { cn, formatNumber } from "@/lib/utils";
import { JobCard } from "./JobCard";
import { PostJobForm } from "./PostJobForm";
import { ApplicantModal } from "./ApplicantModal";
import { PostingDetailModal } from "./PostingDetailModal";
import { CvModal } from "./CvModal";
import { JobDetailModal } from "./JobDetailModal";
import { ApplicationDetailModal } from "./ApplicationDetailModal";

// =============================================================
// TRANG TUYỂN DỤNG — giao diện quyết định bởi ROLE:
// - Môi giới (broker)            -> giao diện ỨNG VIÊN (ứng tuyển).
// - Sàn giao dịch + Ngân hàng    -> chung giao diện NHÀ TUYỂN DỤNG
//   (+ Chủ đầu tư ở giai đoạn tiếp theo).
// - Role khác                    -> màn giới thiệu / đổi vai trò.
// =============================================================
const EMPLOYER_ROLES: RoleId[] = ["exchange", "bank"];

export function RecruitmentView({
  roleId,
  roleName,
}: {
  roleId?: RoleId;
  roleName?: string;
}) {
  if (roleId === "broker") return <CandidateExperience />;
  if (roleId && EMPLOYER_ROLES.includes(roleId))
    return <EmployerExperience roleId={roleId as EmployerRole} />;
  return <AccessGate roleName={roleName} />;
}

// -------- Màn chặn role không tham gia tuyển dụng --------
function AccessGate({ roleName }: { roleName?: string }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-2xl animate-fade-up rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-al-50 text-al-600">
          <Icon name="Briefcase" className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-al-700">
          Mạng lưới nhân sự bất động sản
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          {roleName ? (
            <>
              Bạn đang xem bằng vai trò <b>{roleName}</b>.{" "}
            </>
          ) : (
            <>Bạn chưa đăng nhập. </>
          )}
          Chức năng tuyển dụng có hai giao diện riêng theo vai trò:
        </p>

        <div className="mt-6 grid gap-4 text-left sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-al-100 text-al-600">
              <Icon name="UserRound" className="h-5 w-5" />
            </span>
            <p className="mt-3 font-bold text-slate-800">Phía ứng viên</p>
            <p className="mt-1 text-sm text-slate-500">
              Dành cho <b>Môi giới</b> — ứng tuyển bằng hồ sơ nghề nghiệp (CV
              trực tuyến).
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-al-100 text-al-600">
              <Icon name="Building2" className="h-5 w-5" />
            </span>
            <p className="mt-3 font-bold text-slate-800">Phía nhà tuyển dụng</p>
            <p className="mt-1 text-sm text-slate-500">
              Dành cho <b>Sàn giao dịch</b>, <b>Ngân hàng</b> — đăng tin & quản
              lý tuyển dụng.
            </p>
            <p className="mt-1.5 text-xs text-slate-400">
              Chủ đầu tư — sắp ra mắt.
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-al-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-al-700"
        >
          <Icon name="Repeat" className="h-4 w-4" />
          Đổi vai trò để trải nghiệm
        </Link>
      </div>
    </main>
  );
}

// -------- Hero dùng chung (khác copy 2 phía) --------
function Hero({
  eyebrow,
  title,
  desc,
  icon,
  image,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  icon: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-al-700 via-al-600 to-al-500 px-6 py-10 text-white shadow-lg sm:px-12">
      {/* Ảnh nền phủ toàn khung — gradient chuyển mượt, không còn seam dọc */}
      {image && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            className="h-full w-full animate-kenburns object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-al-800 via-al-700/90 to-al-600/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-al-800/60 to-transparent" />
        </div>
      )}
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-flame-500/30 blur-3xl" />
      {!image && (
        <div className="pointer-events-none absolute right-10 top-10 hidden animate-float lg:block">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
            <Icon name={icon} className="h-8 w-8" />
          </span>
        </div>
      )}
      <div className="relative max-w-2xl">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur">
          <Icon name="Network" className="h-3.5 w-3.5 text-flame-400" />
          {eyebrow}
        </p>
        <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-xl text-white/80">{desc}</p>
      </div>
    </section>
  );
}

// =============================================================
// PHÍA ỨNG VIÊN (MÔI GIỚI)
// =============================================================
function CandidateExperience() {
  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 lg:px-8">
      <Hero
        eyebrow="Tuyển dụng · Môi giới"
        title="Tìm bến đỗ sự nghiệp môi giới của bạn"
        desc="Hồ sơ nghề nghiệp gắn Tier, điểm thành tích & chứng chỉ đóng vai trò CV trực tuyến — ứng tuyển chỉ với một chạm."
        icon="UserRound"
        image={img("photo-1600880292203-757bb62b4baf", 1000)}
      />
      <CandidatePanel />
    </main>
  );
}

function CandidatePanel() {
  const [saved, setSaved] = useState<string[]>([]);
  const [applied, setApplied] = useState<string[]>([]);
  const [apps, setApps] = useState<MyApplication[]>(MY_APPLICATIONS);
  const [cvOpen, setCvOpen] = useState(false);
  const [detailJob, setDetailJob] = useState<JobPosting | null>(null); // tin đang xem chi tiết
  const [detailApp, setDetailApp] = useState<MyApplication | null>(null); // đơn đang xem chi tiết

  const [q, setQ] = useState("");
  const [area, setArea] = useState("");
  const [work, setWork] = useState("");
  const [salary, setSalary] = useState("");
  const [company, setCompany] = useState("");
  const [focus, setFocus] = useState("");

  const list = useMemo(
    () =>
      JOBS.filter(
        (j) =>
          j.title.toLowerCase().includes(q.trim().toLowerCase()) &&
          (!area || j.area === area) &&
          (!work || j.workType === work) &&
          (!salary || j.salaryRange === salary) &&
          (!company || j.company.type === company) &&
          (!focus || j.focus === focus)
      ),
    [q, area, work, salary, company, focus]
  );

  const toggleSave = (id: string) =>
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const apply = (id: string) => setApplied((s) => (s.includes(id) ? s : [...s, id]));

  return (
    <div className="space-y-10">
      {/* ====== CV trực tuyến (thẻ hồ sơ chi tiết) ====== */}
      <section className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Thẻ danh thiếp môi giới */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-24 bg-gradient-to-r from-al-700 via-al-600 to-flame-500" />
          <div className="px-6 pb-6 pt-3">
            <div className="flex flex-wrap items-end gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={CANDIDATE_CV.avatar}
                alt={CANDIDATE_CV.name}
                className="-mt-8 h-24 w-24 rounded-2xl object-cover ring-4 ring-white"
              />
              <div className="flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-800">{CANDIDATE_CV.name}</h2>
                  {CANDIDATE_CV.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-bold text-sky-600">
                      <Icon name="BadgeCheck" className="h-3.5 w-3.5" />
                      Đã xác minh
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-600">
                    <Icon name="Medal" className="h-3.5 w-3.5" />
                    {CANDIDATE_CV.tier}
                  </span>
                  {CANDIDATE_CV.certified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                      <Icon name="Award" className="h-3.5 w-3.5" />
                      Chứng chỉ hành nghề
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-500">{CANDIDATE_CV.headline}</p>
              </div>
            </div>

            {/* Liên hệ */}
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="Phone" className="h-4 w-4 text-al-500" />
                {CANDIDATE_CV.phone}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="Mail" className="h-4 w-4 text-al-500" />
                {CANDIDATE_CV.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="MapPin" className="h-4 w-4 text-al-500" />
                {CANDIDATE_CV.area}
              </span>
            </div>

            {/* Thành tích nổi bật */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <CvStat icon="BadgeDollarSign" label="Giao dịch chốt" value={`${CANDIDATE_CV.deals}`} />
              <CvStat icon="TrendingUp" label="Tổng giá trị GD" value={CANDIDATE_CV.gmv} />
              <CvStat icon="Star" label={`${CANDIDATE_CV.reviews} đánh giá`} value={`${CANDIDATE_CV.rating}`} />
              <CvStat icon="Briefcase" label="Kinh nghiệm" value={`${CANDIDATE_CV.years} năm`} />
            </div>

            {/* Chuyên môn & dự án */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {CANDIDATE_CV.specialties.map((s) => (
                <span key={s} className="rounded-full bg-flame-50 px-2.5 py-1 text-xs font-semibold text-flame-600">
                  {s}
                </span>
              ))}
              {CANDIDATE_CV.projects.map((p) => (
                <span key={p} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {p}
                </span>
              ))}
            </div>

            {/* Hành động CV */}
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => setCvOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-al-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-al-600/20 transition-all hover:-translate-y-0.5 hover:bg-al-700"
              >
                <Icon name="FileText" className="h-4 w-4" />
                Xem CV đầy đủ
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 hover:border-al-300">
                <Icon name="Pencil" className="h-4 w-4" />
                Chỉnh sửa CV
              </button>
            </div>
          </div>
        </div>

        {/* Cột phụ: độ hoàn thiện + mong muốn công việc */}
        <div className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                <Icon name="Gauge" className="h-4 w-4 text-al-500" />
                Độ hoàn thiện hồ sơ
              </p>
              <span className="text-lg font-bold text-al-600">{CANDIDATE_CV.completeness}%</span>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-al-500 to-flame-500"
                style={{ width: `${CANDIDATE_CV.completeness}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Hồ sơ đầy đủ giúp tăng khả năng được nhà tuyển dụng chủ động liên hệ.
            </p>
            <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600">
              <Icon name="Zap" className="h-3.5 w-3.5" />
              Phản hồi {CANDIDATE_CV.responseRate}% · {formatNumber(CANDIDATE_CV.points)} điểm thành tích
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
              <Icon name="Target" className="h-4 w-4 text-flame-500" />
              Mong muốn công việc
            </p>
            <dl className="mt-3 space-y-2.5 text-sm">
              <Desire icon="BadgeDollarSign" label="Thu nhập kỳ vọng" value={CANDIDATE_CV.expectedSalary} />
              <Desire icon="Clock" label="Thời gian" value={CANDIDATE_CV.availability} />
              <Desire icon="MapPin" label="Khu vực mong muốn" value={CANDIDATE_CV.desiredAreas.join(" · ")} />
              <Desire icon="Briefcase" label="Hình thức" value={CANDIDATE_CV.desiredWorkTypes.join(" · ")} />
            </dl>
          </div>
        </div>
      </section>

      {/* Tìm việc + bộ lọc */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-al-700">
            <Icon name="Search" className="h-5 w-5 text-flame-500" />
            Việc làm phù hợp
            <span className="rounded-full bg-al-50 px-2.5 py-0.5 text-sm text-al-600">{list.length}</span>
          </h2>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-flame-600">
            <Icon name="Bookmark" className="h-4 w-4 fill-flame-500" />
            {saved.length} tin đã lưu
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-al-400">
            <Icon name="Search" className="h-5 w-5 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm vị trí, công ty..."
              className="w-full bg-transparent py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <FilterSelect value={area} onChange={setArea} placeholder="Khu vực" options={[...REC_AREAS]} />
            <FilterSelect value={work} onChange={setWork} placeholder="Hình thức" options={[...WORK_TYPES]} />
            <FilterSelect value={salary} onChange={setSalary} placeholder="Mức thu nhập" options={[...SALARY_RANGES]} />
            <FilterSelect value={company} onChange={setCompany} placeholder="Loại doanh nghiệp" options={[...COMPANY_TYPES]} />
            <FilterSelect value={focus} onChange={setFocus} placeholder="Loại hình BĐS" options={[...PROPERTY_FOCUS]} />
          </div>
        </div>

        {list.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400">
            Không có tin phù hợp bộ lọc.
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((job, i) => (
              <div key={job.id} style={{ animationDelay: `${(i % 6) * 50}ms` }} className="animate-fade-up">
                <JobCard
                  job={job}
                  saved={saved.includes(job.id)}
                  applied={applied.includes(job.id)}
                  onToggleSave={() => toggleSave(job.id)}
                  onApply={() => apply(job.id)}
                  onOpen={() => setDetailJob(job)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Đơn ứng tuyển của tôi */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-al-700">
          <Icon name="ClipboardList" className="h-5 w-5 text-flame-500" />
          Đơn ứng tuyển của tôi
        </h2>
        <div className="space-y-3">
          {apps.map((app) => (
            <ApplicationRow
              key={app.id}
              app={app}
              onView={() => setDetailApp(app)}
              onAccept={() =>
                setApps((list) =>
                  list.map((a) =>
                    a.id === app.id ? { ...a, status: "Đã phỏng vấn" } : a
                  )
                )
              }
            />
          ))}
        </div>
      </section>

      {/* Modal xem CV đầy đủ */}
      {cvOpen && <CvModal onClose={() => setCvOpen(false)} />}

      {/* Modal chi tiết tin tuyển dụng */}
      {detailJob && (
        <JobDetailModal
          job={detailJob}
          saved={saved.includes(detailJob.id)}
          applied={applied.includes(detailJob.id)}
          onToggleSave={() => toggleSave(detailJob.id)}
          onApply={() => apply(detailJob.id)}
          onClose={() => setDetailJob(null)}
        />
      )}

      {/* Modal chi tiết đơn ứng tuyển */}
      {detailApp && (
        <ApplicationDetailModal
          app={detailApp}
          job={JOBS.find((j) => j.title === detailApp.jobTitle)}
          onClose={() => setDetailApp(null)}
        />
      )}
    </div>
  );
}

function Desire({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon name={icon} className="mt-0.5 h-4 w-4 shrink-0 text-al-400" />
      <div>
        <dt className="text-xs text-slate-400">{label}</dt>
        <dd className="font-semibold text-slate-700">{value}</dd>
      </div>
    </div>
  );
}

function CvStat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="flex items-center gap-1.5 text-xs text-slate-400">
        <Icon name={icon} className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-0.5 font-bold text-slate-800">{value}</p>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium focus:border-al-400 focus:outline-none",
        value ? "text-slate-800" : "text-slate-400"
      )}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o} className="text-slate-800">
          {o}
        </option>
      ))}
    </select>
  );
}

const APP_STATUS_TONE: Record<ApplicationStatus, string> = {
  "Hồ sơ mới": "bg-slate-100 text-slate-600",
  "Đã xem": "bg-sky-50 text-sky-600",
  "Đang liên hệ": "bg-indigo-50 text-indigo-600",
  "Mời phỏng vấn": "bg-flame-50 text-flame-600",
  "Đã phỏng vấn": "bg-purple-50 text-purple-600",
  "Chờ kết quả": "bg-amber-50 text-amber-600",
  "Đã tuyển": "bg-emerald-50 text-emerald-600",
  "Không phù hợp": "bg-rose-50 text-rose-600",
};

function ApplicationRow({
  app,
  onView,
  onAccept,
}: {
  app: MyApplication;
  onView: () => void;
  onAccept: () => void;
}) {
  const [responded, setResponded] = useState<string | null>(null);
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="font-bold text-slate-800">{app.jobTitle}</p>
          <p className="text-xs text-slate-400">
            {app.company} · nộp {app.appliedAt.slice(5)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("rounded-full px-3 py-1 text-xs font-bold", APP_STATUS_TONE[app.status])}>
            {app.status}
          </span>
          <button
            onClick={onView}
            className="inline-flex items-center gap-1.5 rounded-xl border border-al-200 bg-white px-3.5 py-2 text-sm font-bold text-al-600 transition-colors hover:border-al-400 hover:bg-al-50"
          >
            <Icon name="FileText" className="h-4 w-4" />
            Xem chi tiết
          </button>
        </div>
      </div>

      {app.status === "Mời phỏng vấn" && app.interview && (
        <div className="mt-3 rounded-xl bg-flame-50/70 p-3">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-flame-700">
            <Icon name="CalendarDays" className="h-4 w-4" />
            Mời phỏng vấn: {app.interview.date.slice(5)} lúc {app.interview.time}
          </p>
          {responded ? (
            <p className="mt-2 text-xs font-semibold text-emerald-600">
              ✓ Bạn đã {responded}.
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setResponded("đồng ý lịch hẹn");
                  onAccept();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-600"
              >
                <Icon name="Check" className="h-3.5 w-3.5" />
                Đồng ý
              </button>
              <button
                onClick={() => setResponded("đề xuất giờ khác")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 hover:border-al-300"
              >
                <Icon name="Clock" className="h-3.5 w-3.5" />
                Đề xuất giờ khác
              </button>
              <button
                onClick={() => setResponded("từ chối lời mời")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-rose-500 hover:border-rose-300"
              >
                <Icon name="X" className="h-3.5 w-3.5" />
                Từ chối
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================
// PHÍA NHÀ TUYỂN DỤNG (SÀN GIAO DỊCH · NGÂN HÀNG · CHỦ ĐẦU TƯ)
// =============================================================
function EmployerExperience({ roleId }: { roleId: EmployerRole }) {
  const hero = EMPLOYER_HERO[roleId];
  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 lg:px-8">
      <Hero
        eyebrow="Tuyển dụng · Nhà tuyển dụng"
        title={hero.title}
        desc={hero.desc}
        icon="Building2"
        image={img("photo-1521737604893-d14cc237f11d", 1000)}
      />
      <EmployerPanel roleId={roleId} />
    </main>
  );
}

const POSTING_TONE: Record<PostingStatus, string> = {
  "Đang hiển thị": "bg-emerald-50 text-emerald-600 border-emerald-200",
  "Chờ kiểm duyệt": "bg-amber-50 text-amber-600 border-amber-200",
  "Hết hạn": "bg-slate-100 text-slate-500 border-slate-200",
};

function EmployerPanel({ roleId }: { roleId: EmployerRole }) {
  const [postings, setPostings] = useState<MyPosting[]>(MY_POSTINGS[roleId]);
  const [formOpen, setFormOpen] = useState(false);
  const [posted, setPosted] = useState(false);
  // Ứng viên theo TỪNG tin (key = id tin)
  const [byPosting, setByPosting] = useState<Record<string, Applicant[]>>(() =>
    Object.fromEntries(
      MY_POSTINGS[roleId].map((p) => [p.id, APPLICANTS_BY_POSTING[p.id] ?? []])
    )
  );
  const [expanded, setExpanded] = useState<string | null>(
    MY_POSTINGS[roleId].find((p) => (APPLICANTS_BY_POSTING[p.id]?.length ?? 0) > 0)
      ?.id ?? null
  );
  const [scheduling, setScheduling] = useState<string | null>(null); // key: "postingId:applicantId"
  const [selected, setSelected] = useState<{
    postingId: string;
    applicant: Applicant;
  } | null>(null);
  const [detail, setDetail] = useState<MyPosting | null>(null); // tin đang xem chi tiết

  const applicantsOf = (id: string) => byPosting[id] ?? [];

  // Đổi trạng thái pipeline của 1 ứng viên trong 1 tin — đồng bộ cả hồ sơ đang mở.
  const changeStatus = (postingId: string, id: string, status: ApplicationStatus) => {
    setByPosting((prev) => ({
      ...prev,
      [postingId]: (prev[postingId] ?? []).map((x) =>
        x.id === id ? { ...x, status } : x
      ),
    }));
    setSelected((s) =>
      s && s.postingId === postingId && s.applicant.id === id
        ? { ...s, applicant: { ...s.applicant, status } }
        : s
    );
  };

  return (
    <div className="space-y-10">
      {/* Báo cáo & thống kê */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {RECRUIT_STATS.map((s, i) => (
          <div
            key={s.label}
            style={{ animationDelay: `${i * 60}ms` }}
            className="animate-fade-up rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-al-50 text-al-600">
              <Icon name={s.icon} className="h-4 w-4" />
            </span>
            <p className="mt-2 text-2xl font-bold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Tin đã đăng + đăng mới */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-al-700">
            <Icon name="Megaphone" className="h-5 w-5 text-flame-500" />
            Tin tuyển dụng của tôi
          </h2>
          {!formOpen && (
            <button
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-flame-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-flame-500/30 transition-all hover:-translate-y-0.5 hover:bg-flame-600"
            >
              <Icon name="Plus" className="h-4 w-4" />
              Đăng tin
            </button>
          )}
        </div>

        {posted && (
          <div className="mb-4 flex animate-pop-in items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <Icon name="CheckCircle2" className="h-4 w-4 shrink-0" />
            Đã gửi tin! Trạng thái hiện tại <b>Chờ kiểm duyệt</b> — hiển thị công khai sau khi duyệt.
          </div>
        )}

        {formOpen && (
          <div className="mb-5">
            <PostJobForm
              onCancel={() => setFormOpen(false)}
              onSubmit={(p) => {
                setPostings((list) => [p, ...list]);
                setByPosting((m) => ({ ...m, [p.id]: [] }));
                setFormOpen(false);
                setPosted(true);
                setTimeout(() => setPosted(false), 5000);
              }}
            />
          </div>
        )}

        <p className="mb-4 text-sm text-slate-500">
          Bấm vào một tin để xem & quản lý danh sách ứng viên đã nộp cho tin đó.
        </p>

        <div className="space-y-3">
          {postings.map((p) => {
            const apps = applicantsOf(p.id);
            const open = expanded === p.id;
            return (
              <div
                key={p.id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
              >
                {/* Header tin — bấm vùng trái để bung danh sách ứng viên;
                    nút "Xem chi tiết" mở modal nội dung bài đã đăng. */}
                <div className="flex flex-wrap items-center gap-3 p-4">
                  <button
                    onClick={() => setExpanded(open ? null : p.id)}
                    className="flex min-w-0 flex-1 flex-wrap items-center gap-3 rounded-xl text-left transition-colors hover:opacity-80"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-slate-800">{p.title}</p>
                        <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-bold", POSTING_TONE[p.status])}>
                          {p.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">Hạn nộp {p.deadline}</p>
                    </div>
                    <div className="flex items-center gap-5 text-center">
                      <div>
                        <p className="font-bold text-slate-800">{formatNumber(p.views)}</p>
                        <p className="text-[11px] text-slate-400">Lượt xem</p>
                      </div>
                      <div>
                        <p className="font-bold text-al-600">{apps.length}</p>
                        <p className="text-[11px] text-slate-400">Ứng viên</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setDetail(p)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-al-200 bg-white px-3.5 py-2 text-sm font-bold text-al-600 transition-colors hover:border-al-400 hover:bg-al-50"
                  >
                    <Icon name="FileText" className="h-4 w-4" />
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => setExpanded(open ? null : p.id)}
                    aria-label={open ? "Thu gọn ứng viên" : "Xem danh sách ứng viên"}
                    className="shrink-0 rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  >
                    <Icon
                      name="ChevronDown"
                      className={cn("h-5 w-5 transition-transform", open && "rotate-180")}
                    />
                  </button>
                </div>

                {/* Danh sách ứng viên của tin */}
                {open && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-4">
                    {apps.length === 0 ? (
                      <p className="py-6 text-center text-sm text-slate-400">
                        {p.status === "Chờ kiểm duyệt"
                          ? "Tin đang chờ kiểm duyệt — chưa hiển thị công khai nên chưa có ứng viên."
                          : "Chưa có ứng viên cho tin này."}
                      </p>
                    ) : (
                      <div className="space-y-3">
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                          <Icon name="Users" className="h-3.5 w-3.5" />
                          {apps.length} ứng viên · pipeline: {PIPELINE_STATUSES.join(" → ")}
                        </p>
                        {apps.map((a) => {
                          const key = `${p.id}:${a.id}`;
                          return (
                            <ApplicantRow
                              key={a.id}
                              applicant={a}
                              scheduling={scheduling === key}
                              onView={() => setSelected({ postingId: p.id, applicant: a })}
                              onSchedule={() =>
                                setScheduling(scheduling === key ? null : key)
                              }
                              onStatus={(status) => changeStatus(p.id, a.id, status)}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal xem hồ sơ ứng viên */}
      {selected && (
        <ApplicantModal
          applicant={selected.applicant}
          onClose={() => setSelected(null)}
          onStatus={(s) => changeStatus(selected.postingId, selected.applicant.id, s)}
          onSchedule={() => {
            setScheduling(`${selected.postingId}:${selected.applicant.id}`);
            setSelected(null);
          }}
        />
      )}

      {/* Modal xem chi tiết tin tuyển dụng đã đăng */}
      {detail && (
        <PostingDetailModal
          posting={detail}
          applicantCount={applicantsOf(detail.id).length}
          onClose={() => setDetail(null)}
        />
      )}

      {/* Hồ sơ doanh nghiệp */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-al-700">
          <Icon name="Building2" className="h-5 w-5 text-flame-500" />
          Trang hồ sơ doanh nghiệp
        </h2>
        <CompanyProfile profile={EMPLOYER_PROFILES[roleId]} />
      </section>
    </div>
  );
}

const TIER_TONE = "bg-amber-50 text-amber-600";

function ApplicantRow({
  applicant: a,
  scheduling,
  onView,
  onSchedule,
  onStatus,
}: {
  applicant: Applicant;
  scheduling: boolean;
  onView: () => void;
  onSchedule: () => void;
  onStatus: (s: ApplicationStatus) => void;
}) {
  const [scheduled, setScheduled] = useState(false);
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors hover:border-al-200">
      <div className="flex flex-wrap items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={a.avatar}
          alt={a.name}
          onClick={onView}
          className="h-12 w-12 cursor-pointer rounded-xl object-cover ring-1 ring-slate-200 transition-transform hover:scale-105"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={onView} className="font-bold text-slate-800 hover:text-al-600">
              {a.name}
            </button>
            <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold", TIER_TONE)}>
              <Icon name="Medal" className="h-3 w-3" />
              {a.tier}
            </span>
            {a.certified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                <Icon name="Award" className="h-3 w-3" />
                Có chứng chỉ
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-400">
                Chưa có chứng chỉ
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            {a.area} · {a.years} năm KN · {formatNumber(a.points)} điểm · ứng tuyển: {a.appliedFor}
          </p>
        </div>

        <button
          onClick={onView}
          className="inline-flex items-center gap-1.5 rounded-xl bg-al-600 px-3.5 py-2 text-sm font-bold text-white hover:bg-al-700"
        >
          <Icon name="Eye" className="h-4 w-4" />
          Xem hồ sơ
        </button>

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

        <button
          onClick={onSchedule}
          className="inline-flex items-center gap-1.5 rounded-xl border border-al-200 bg-white px-3.5 py-2 text-sm font-bold text-al-600 hover:border-al-400"
        >
          <Icon name="CalendarPlus" className="h-4 w-4" />
          Phỏng vấn
        </button>
      </div>

      {scheduling && (
        <div className="mt-3 flex flex-wrap items-end gap-3 rounded-xl bg-al-50/60 p-3">
          {scheduled ? (
            <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
              <Icon name="CheckCircle2" className="h-4 w-4" />
              Đã gửi lời mời phỏng vấn tới {a.name}.
            </p>
          ) : (
            <>
              <div>
                <p className="mb-1 text-xs font-semibold text-slate-500">Ngày</p>
                <input type="date" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-al-400 focus:outline-none" />
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold text-slate-500">Giờ</p>
                <input type="time" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-al-400 focus:outline-none" />
              </div>
              <button
                onClick={() => {
                  setScheduled(true);
                  onStatus("Đã phỏng vấn");
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-flame-500 px-4 py-2 text-sm font-bold text-white hover:bg-flame-600"
              >
                <Icon name="Send" className="h-4 w-4" />
                Gửi lời mời
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function CompanyProfile({ profile: p }: { profile: EmployerProfile }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-2 gap-1">
        {p.office.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="Văn phòng" className="h-36 w-full object-cover" />
        ))}
      </div>
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.logo} alt={p.name} className="-mt-12 h-20 w-20 rounded-2xl object-cover ring-4 ring-white" />
          <div className="pt-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-800">{p.name}</h3>
              {p.verified && <Icon name="BadgeCheck" className="h-5 w-5 text-sky-500" />}
            </div>
            <p className="text-sm text-slate-400">{p.type} · {p.size}</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-600">{p.intro}</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <ProfileBlock icon="Building2" title={p.projectsLabel} items={p.projects} />
          <ProfileBlock icon="MapPin" title="Khu vực hoạt động" items={p.areas} />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-flame-50 p-3.5">
            <p className="flex items-center gap-1.5 text-sm font-bold text-flame-600">
              <Icon name="Percent" className="h-4 w-4" />
              Chính sách hoa hồng
            </p>
            <p className="mt-1 text-sm text-slate-600">{p.commissionPolicy}</p>
          </div>
          <div className="rounded-xl bg-al-50 p-3.5">
            <p className="flex items-center gap-1.5 text-sm font-bold text-al-600">
              <Icon name="GraduationCap" className="h-4 w-4" />
              Chính sách đào tạo / hỗ trợ
            </p>
            <p className="mt-1 text-sm text-slate-600">{p.trainingPolicy}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-sm font-bold text-slate-700">Phúc lợi / Quyền lợi</p>
          <div className="flex flex-wrap gap-2">
            {p.benefits.map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                <Icon name="Check" className="h-3.5 w-3.5 text-emerald-500" />
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileBlock({ icon, title, items }: { icon: string; title: string; items: string[] }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
        <Icon name={icon} className="h-4 w-4 text-al-500" />
        {title}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((it) => (
          <span key={it} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
