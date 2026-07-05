"use client";

import { useState } from "react";
import { COURSES, CourseProvider } from "@/data/training";
import { CourseCard } from "./CourseCard";
import { SegmentTabs } from "./SegmentTabs";

const PROVIDERS: readonly CourseProvider[] = ["GRESA", "TREBS"];

// Khối "Khám phá khoá học" — lọc theo đơn vị đào tạo (GRESA / TREBS).
export function CourseExplorer() {
  const [provider, setProvider] = useState<CourseProvider>("GRESA");
  const list = COURSES.filter((c) => c.provider === provider);

  return (
    <div>
      <div className="mb-4">
        <SegmentTabs
          options={PROVIDERS}
          value={provider}
          onChange={setProvider}
          variant="pill"
        />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c, i) => (
          <div
            key={c.id}
            style={{ animationDelay: `${i * 70}ms` }}
            className="animate-fade-up"
          >
            <CourseCard course={c} />
          </div>
        ))}
      </div>
    </div>
  );
}
