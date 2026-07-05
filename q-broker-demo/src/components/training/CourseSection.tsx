"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { CourseCard } from "./CourseCard";
import {
  COURSES,
  COURSE_FEES,
  COURSE_FORMATS,
  COURSE_LANGUAGES,
  COURSE_LEVELS,
  COURSE_PROVIDERS,
  CourseFee,
  CourseFormat,
  CourseLanguage,
  CourseLevel,
  CourseProvider,
} from "@/data/training";
import { cn } from "@/lib/utils";

// Khối "Khám phá khoá học": nút Bộ lọc mở panel lọc inline; lưới hiện 6 khoá,
// nút "Xem thêm" bung toàn bộ (không dùng modal).

const PREVIEW = 6;

interface Filters {
  provider: CourseProvider;
  fees: CourseFee[];
  levels: CourseLevel[];
  formats: CourseFormat[];
  languages: CourseLanguage[];
}

const EMPTY: Filters = { provider: "GRESA", fees: [], levels: [], formats: [], languages: [] };

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function CourseSection() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [f, setF] = useState<Filters>(EMPTY);

  const list = useMemo(
    () =>
      COURSES.filter(
        (c) =>
          c.provider === f.provider &&
          (f.fees.length === 0 || f.fees.includes(c.fee)) &&
          (f.levels.length === 0 || f.levels.includes(c.level)) &&
          (f.formats.length === 0 || f.formats.includes(c.format)) &&
          (f.languages.length === 0 || f.languages.includes(c.language))
      ),
    [f]
  );

  const visible = expanded ? list : list.slice(0, PREVIEW);
  const activeCount =
    f.fees.length + f.levels.length + f.formats.length + f.languages.length;

  // Đổi bộ lọc -> thu gọn về 6 để người dùng thấy kết quả từ đầu.
  const update = (updater: (s: Filters) => Filters) => {
    setF(updater);
    setExpanded(false);
  };

  return (
    <section>
      {/* Tiêu đề + nút Bộ lọc */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-al-700">
          <Icon name="Compass" className="h-5 w-5 text-flame-500" />
          Khám phá khoá học
        </h2>
        <button
          onClick={() => setFilterOpen((v) => !v)}
          className={cn(
            "relative inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors",
            filterOpen
              ? "border-al-500 bg-al-50 text-al-700"
              : "border-slate-200 bg-white text-slate-700 hover:border-al-300 hover:text-al-600"
          )}
        >
          <Icon name="SlidersHorizontal" className="h-4 w-4" />
          Bộ lọc
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-flame-500 px-1 text-[11px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Panel bộ lọc inline */}
      {filterOpen && (
        <div className="mb-5 animate-fade-up rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-bold text-al-700">Lọc khoá học</p>
            <button
              onClick={() => update(() => EMPTY)}
              className="text-sm font-semibold text-al-600 hover:text-al-700"
            >
              Thiết lập lại
            </button>
          </div>
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            <RadioGroup
              title="Nhà cung cấp"
              options={COURSE_PROVIDERS}
              value={f.provider}
              onChange={(v) => update((s) => ({ ...s, provider: v }))}
            />
            <CheckGroup
              title="Học phí"
              options={COURSE_FEES}
              selected={f.fees}
              onToggle={(v) => update((s) => ({ ...s, fees: toggle(s.fees, v) }))}
            />
            <CheckGroup
              title="Cấp độ"
              options={COURSE_LEVELS}
              selected={f.levels}
              onToggle={(v) => update((s) => ({ ...s, levels: toggle(s.levels, v) }))}
            />
            <CheckGroup
              title="Hình thức học"
              options={COURSE_FORMATS}
              selected={f.formats}
              onToggle={(v) => update((s) => ({ ...s, formats: toggle(s.formats, v) }))}
            />
            <CheckGroup
              title="Ngôn ngữ"
              options={COURSE_LANGUAGES}
              selected={f.languages}
              onToggle={(v) =>
                update((s) => ({ ...s, languages: toggle(s.languages, v) }))
              }
            />
          </div>
        </div>
      )}

      {/* Lưới khoá học */}
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400">
          Không có khoá học nào khớp bộ lọc.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((c, i) => (
              <div
                key={c.id}
                style={{ animationDelay: `${(i % PREVIEW) * 50}ms` }}
                className="animate-fade-up"
              >
                <CourseCard course={c} />
              </div>
            ))}
          </div>

          {list.length > PREVIEW && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setExpanded((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl border border-al-200 bg-white px-6 py-2.5 text-sm font-semibold text-al-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-al-400 hover:shadow-md"
              >
                {expanded
                  ? "Thu gọn"
                  : `Xem thêm ${list.length - PREVIEW} khoá học`}
                <Icon
                  name={expanded ? "ChevronUp" : "ChevronDown"}
                  className="h-4 w-4"
                />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

// -------- Nhóm radio (chọn 1) --------
function RadioGroup<T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-bold text-slate-800">{title}</p>
      <div className="space-y-2.5">
        {options.map((opt) => {
          const on = opt === value;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className="flex w-full items-center gap-3 text-left"
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                  on ? "border-al-600" : "border-slate-300"
                )}
              >
                {on && <span className="h-2.5 w-2.5 rounded-full bg-al-600" />}
              </span>
              <span className="text-sm text-slate-700">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// -------- Nhóm checkbox (chọn nhiều) --------
function CheckGroup<T extends string>({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: readonly T[];
  selected: T[];
  onToggle: (v: T) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-bold text-slate-800">{title}</p>
      <div className="space-y-2.5">
        {options.map((opt) => {
          const on = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className="flex items-center gap-3 text-left"
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors",
                  on ? "border-al-600 bg-al-600 text-white" : "border-slate-300"
                )}
              >
                {on && <Icon name="Check" className="h-3.5 w-3.5" />}
              </span>
              <span className="text-sm text-slate-700">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
