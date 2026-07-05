"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { SegmentTabs } from "@/components/training/SegmentTabs";
import { ExamListItem } from "@/components/training/ExamListItem";
import { EXAM_SETS, ExamGroup } from "@/data/training";

const GROUPS: readonly ExamGroup[] = ["Cơ sở", "Chuyên môn"];

// TAB TRẮC NGHIỆM — bộ đề tổng hợp, tab Cơ sở / Chuyên môn + tìm kiếm.
export default function TracNghiemPage() {
  const [group, setGroup] = useState<ExamGroup>("Cơ sở");
  const [q, setQ] = useState("");

  const all = EXAM_SETS[group];
  const done = all.filter((e) => e.done).length;

  const list = useMemo(
    () =>
      all.filter((e) =>
        e.title.toLowerCase().includes(q.trim().toLowerCase())
      ),
    [all, q]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-al-700">Bộ đề tổng hợp</h1>
        <p className="mt-1 text-sm text-slate-500">
          Luyện đề mô phỏng kỳ sát hạch thật — mỗi đề 40 câu, 120 phút.
        </p>
      </div>

      <SegmentTabs options={GROUPS} value={group} onChange={setGroup} />

      {/* Thẻ thống kê */}
      <div className="grid grid-cols-2 overflow-hidden rounded-2xl bg-gradient-to-r from-al-600 to-al-500 text-white shadow-md">
        <div className="border-r border-white/20 px-6 py-5 text-center">
          <p className="text-sm text-white/70">Tổng số đề</p>
          <p className="mt-1 text-3xl font-bold">{all.length}</p>
        </div>
        <div className="px-6 py-5 text-center">
          <p className="text-sm text-white/70">Đã hoàn thành</p>
          <p className="mt-1 text-3xl font-bold text-flame-400">{done}</p>
        </div>
      </div>

      {/* Tìm kiếm */}
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm focus-within:border-al-400">
        <Icon name="Search" className="h-5 w-5 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm theo tên đề thi..."
          className="w-full bg-transparent py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Tất cả đề kiểm tra
        </h2>
        <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-al-600">
          <Icon name="SlidersHorizontal" className="h-4 w-4" />
          Bộ lọc
        </button>
      </div>

      <div className="space-y-3">
        {list.map((e) => (
          <ExamListItem key={e.id} exam={e} />
        ))}
        {list.length === 0 && (
          <p className="py-16 text-center text-sm text-slate-400">
            Không tìm thấy đề phù hợp.
          </p>
        )}
      </div>
    </div>
  );
}
