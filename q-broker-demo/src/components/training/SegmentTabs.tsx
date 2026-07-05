"use client";

import { cn } from "@/lib/utils";

// Tabs phân đoạn tái dùng cho nhiều nơi:
// - variant "underline": Cơ sở / Chuyên môn, Kiến thức cơ sở / chuyên môn
// - variant "pill": chip lọc GRESA / TREBS
export function SegmentTabs<T extends string>({
  options,
  value,
  onChange,
  variant = "underline",
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  variant?: "underline" | "pill";
}) {
  if (variant === "pill") {
    return (
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                active
                  ? "border-al-500 bg-al-500 text-white"
                  : "border-slate-200 bg-white text-slate-500 hover:border-al-300 hover:text-al-600"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex border-b border-slate-200">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "relative flex-1 px-4 py-3 text-sm font-semibold transition-colors",
              active ? "text-al-700" : "text-slate-400 hover:text-al-600"
            )}
          >
            {opt}
            <span
              className={cn(
                "absolute inset-x-0 -bottom-px mx-auto h-[3px] w-2/3 rounded-full bg-flame-500 transition-opacity",
                active ? "opacity-100" : "opacity-0"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
