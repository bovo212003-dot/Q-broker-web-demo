"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { SegmentTabs } from "@/components/training/SegmentTabs";
import { EssayCard } from "@/components/training/EssayCard";
import { ESSAY_QUESTIONS, EssayGroup } from "@/data/training";

const GROUPS: readonly EssayGroup[] = ["Kiến thức cơ sở", "Kiến thức chuyên môn"];

// TAB TỰ LUẬN — kho câu hỏi tự luận, tab Cơ sở / Chuyên môn + tìm kiếm.
export default function TuLuanPage() {
  const [group, setGroup] = useState<EssayGroup>("Kiến thức cơ sở");
  const [q, setQ] = useState("");

  const list = useMemo(
    () =>
      ESSAY_QUESTIONS.filter(
        (e) =>
          e.group === group &&
          e.prompt.toLowerCase().includes(q.trim().toLowerCase())
      ),
    [group, q]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-al-700">Ôn thi tự luận</h1>
        <p className="mt-1 text-sm text-slate-500">
          Kho câu hỏi lý thuyết kèm gợi ý từ khoá và lời giải chi tiết.
        </p>
      </div>

      {/* Tìm kiếm */}
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm focus-within:border-al-400">
        <Icon name="Search" className="h-5 w-5 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm danh mục hoặc nội dung..."
          className="w-full bg-transparent py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      <SegmentTabs options={GROUPS} value={group} onChange={setGroup} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {list.map((e, i) => (
          <div
            key={e.id}
            style={{ animationDelay: `${i * 60}ms` }}
            className="animate-fade-up"
          >
            <EssayCard essay={e} />
          </div>
        ))}
        {list.length === 0 && (
          <p className="py-16 text-center text-sm text-slate-400 lg:col-span-2">
            Không tìm thấy câu hỏi phù hợp.
          </p>
        )}
      </div>
    </div>
  );
}
