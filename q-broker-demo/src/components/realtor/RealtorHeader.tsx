"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { RealtorLogo } from "./RealtorLogo";

// Thanh điều hướng trên cùng của clone Realtor.com.
// Sticky, nền trắng, đổ bóng nhẹ; menu chính ẩn trên mobile (hamburger).

const NAV = [
  { label: "Đào tạo", href: "#" },
  { label: "Chia sẻ giỏ hàng", href: "#" },
  { label: "Cần thuê - Mua", href: "#" },
  { label: "Live stream đấu giá", href: "#" },
  { label: "Afilate", href: "#" },
  { label: "Nhà của tôi", href: "#" },
  { label: "Tin tức", href: "#" },
  { label: "Thêm ...", href: "#" },
];

// userName: tên hiển thị của người đã đăng nhập (hiện tạm là tên role,
// sau này thay bằng tên thật). Nếu không truyền -> hiện nút "Đăng nhập"
// như cũ (dùng cho khách vãng lai).
export function RealtorHeader({ userName }: { userName?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-8">
        {/* Logo -> quay lại landing Q-Broker */}
        <Link href="/" aria-label="Q-Broker home">
          <RealtorLogo />
        </Link>

        {/* Menu chính (desktop) */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-semibold text-slate-700 hover:text-realtor-500"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Bên phải */}
        <div className="flex items-center gap-3">
          {userName ? (
            // Đã đăng nhập -> hiện tên (role) + avatar chữ cái đầu
            <span className="hidden items-center gap-2 rounded-full border border-slate-300 px-2 py-1 pr-4 text-sm font-semibold text-slate-800 sm:inline-flex">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-realtor-500 text-xs text-white">
                {userName.charAt(0).toUpperCase()}
              </span>
              {userName}
            </span>
          ) : (
            // Khách vãng lai -> nút đăng nhập như cũ
            <a
              href="#"
              className="hidden items-center gap-1.5 rounded-full border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-800 hover:border-slate-400 sm:inline-flex"
            >
              <Icon name="User" className="h-4 w-4" />
              Đăng nhập
            </a>
          )}
          <button
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Mở menu"
          >
            <Icon name={open ? "X" : "Menu"} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {item.label}
            </a>
          ))}
          {userName ? (
            <span className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-center text-sm font-semibold text-slate-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-realtor-500 text-xs text-white">
                {userName.charAt(0).toUpperCase()}
              </span>
              {userName}
            </span>
          ) : (
            <a
              href="#"
              className="mt-2 block rounded-lg bg-realtor-500 px-3 py-2 text-center text-sm font-semibold text-white"
            >
              Đăng nhập / Đăng ký
            </a>
          )}
        </nav>
      )}
    </header>
  );
}
