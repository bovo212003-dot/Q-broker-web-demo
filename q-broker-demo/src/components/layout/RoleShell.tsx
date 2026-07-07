"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { RoleConfig } from "@/types";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

// =============================================================
// RoleShell — Bố cục chung cho MỌI role.
// Gồm: sidebar (menu từ config) + topbar + vùng nội dung.
// Mỗi layout của role chỉ cần: <RoleShell role={ROLES.broker}>{children}</RoleShell>
// Menu tự động highlight theo URL hiện tại.
// =============================================================

export function RoleShell({
  role,
  children,
}: {
  role: RoleConfig;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // menu mobile

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Overlay khi mở menu trên mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo + tên role */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
            style={{ backgroundColor: role.color }}
          >
            <Icon name={role.icon} className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Q-Broker
            </p>
            <p className="font-semibold leading-tight text-slate-800">
              {role.name}
            </p>
          </div>
        </div>

        {/* Menu điều hướng */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {role.nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-white"
                    : "text-slate-600 hover:bg-slate-100"
                )}
                style={active ? { backgroundColor: role.color } : undefined}
              >
                <Icon name={item.icon} className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Nút quay lại chọn role */}
        <div className="border-t border-slate-100 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
          >
            <Icon name="ArrowLeft" className="h-4 w-4" />
            Đổi vai trò
          </Link>
        </div>
      </aside>

      {/* Cột nội dung */}
      <div className="flex flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              className="shrink-0 rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Mở menu"
            >
              <Icon name="Menu" className="h-5 w-5" />
            </button>
            <span
              className="max-w-full truncate whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: role.color }}
            >
              {role.name}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
              <Icon name="Bell" className="h-5 w-5" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
              QB
            </div>
          </div>
        </header>

        {/* Nội dung trang */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
