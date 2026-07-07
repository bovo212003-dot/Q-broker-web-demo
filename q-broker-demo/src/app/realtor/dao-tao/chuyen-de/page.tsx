"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { SegmentTabs } from "@/components/training/SegmentTabs";
import { TopicCard } from "@/components/training/TopicCard";
import { TOPICS } from "@/data/training";

const FILTERS = ["Tất cả", "Cơ sở", "Chuyên môn"] as const;
type Filter = (typeof FILTERS)[number];

// TAB CHUYÊN ĐỀ — 16 chuyên đề chuẩn, lọc theo nhóm + tìm kiếm.
export default function ChuyenDePage() {
  const [filter, setFilter] = useState<Filter>("Tất cả");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    return TOPICS.filter((t) => {
      const byGroup = filter === "Tất cả" || t.group === filter;
      const byText = t.title.toLowerCase().includes(q.trim().toLowerCase());
      return byGroup && byText;
    });
  }, [filter, q]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-al-700">Chuyên đề đào tạo</h1>
        <p className="mt-1 text-sm text-slate-500">
          16 chuyên đề chuẩn theo khung chương trình môi giới bất động sản.
        </p>
      </div>

      {/* Tìm kiếm */}
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm focus-within:border-al-400">
        <Icon name="Search" className="h-5 w-5 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm chuyên đề hoặc nội dung..."
          className="w-full bg-transparent py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      <div className="max-w-xs">
        <SegmentTabs options={FILTERS} value={filter} onChange={setFilter} variant="pill" />
      </div>

      {list.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-400">
          Không tìm thấy chuyên đề phù hợp.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t, i) => (
            <div
              key={t.id}
              style={{ animationDelay: `${i * 50}ms` }}
              className="animate-fade-up"
            >
              <TopicCard topic={t} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
