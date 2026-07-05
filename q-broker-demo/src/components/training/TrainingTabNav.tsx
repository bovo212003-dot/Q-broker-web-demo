"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

// Thanh điều hướng phụ của module Đào tạo — bản web hoá của bottom-nav mobile.
// Sticky ngay dưới header realtor; cuộn ngang được trên mobile.

const TABS = [
  { label: "Trang chủ", href: "/realtor/dao-tao", icon: "Home", exact: true },
  { label: "Chuyên đề", href: "/realtor/dao-tao/chuyen-de", icon: "BookOpen" },
  { label: "Trắc nghiệm", href: "/realtor/dao-tao/trac-nghiem", icon: "PencilLine" },
  { label: "Tự luận", href: "/realtor/dao-tao/tu-luan", icon: "FileText" },
  { label: "Tài khoản", href: "/realtor/dao-tao/tai-khoan", icon: "User" },
];

export function TrainingTabNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-16 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-2 lg:px-8">
        {TABS.map((tab) => {
          const active = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "group relative flex shrink-0 items-center gap-2 px-4 py-3.5 text-sm font-semibold transition-colors",
                active
                  ? "text-al-700"
                  : "text-slate-500 hover:text-al-600"
              )}
            >
              <Icon
                name={tab.icon}
                className={cn(
                  "h-[18px] w-[18px] transition-transform group-hover:scale-110",
                  active && "text-flame-500"
                )}
              />
              {tab.label}
              {/* Chỉ báo active màu cam */}
              <span
                className={cn(
                  "absolute inset-x-3 -bottom-px h-[3px] rounded-full bg-flame-500 transition-all",
                  active ? "opacity-100" : "opacity-0"
                )}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
