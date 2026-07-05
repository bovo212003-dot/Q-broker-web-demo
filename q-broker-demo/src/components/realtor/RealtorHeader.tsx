"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { RoleId } from "@/types";
import { RealtorLogo } from "./RealtorLogo";

// Thanh điều hướng trên cùng của Q-Broker.
// Sticky, nền trắng, đổ bóng nhẹ; menu chính ẩn trên mobile (hamburger).
// Mục có href thật (bắt đầu bằng "/") là route nội bộ -> render <Link>.

// Menu chính -> dùng chung cho MỌI role.
const NAV = [
  { label: "Đào tạo", href: "/realtor/dao-tao" },
  { label: "Chia sẻ giỏ hàng", href: "#" },
  { label: "Cần thuê - Mua", href: "#" },
  { label: "Live stream đấu giá", href: "#" },
  { label: "Afilate", href: "#" },
  { label: "Tin tức", href: "#" },
];

// Các mục trong "Thêm ...".
// roles: danh sách role được phép thấy mục đó. Bỏ trống -> mọi role.
type MoreItem = {
  label: string;
  href: string;
  icon: string;
  roles?: RoleId[];
};

const MORE: MoreItem[] = [
  { label: "Nhà của tôi", href: "#", icon: "Home" },
  { label: "Kết bạn", href: "#", icon: "UserPlus", roles: ["broker", "admin", "customer"] },
  { label: "Tìm môi giới", href: "#", icon: "Search", roles: ["customer"] },
  { label: "Kí hợp đồng online", href: "#", icon: "FileSignature", roles: ["broker"] },
  { label: "Khách hàng (CRM)", href: "#", icon: "Users", roles: ["broker"] },
];

// userName: tên hiển thị của người đã đăng nhập (hiện tạm là tên role,
// sau này thay bằng tên thật). Nếu không truyền -> hiện nút "Đăng nhập"
// như cũ (dùng cho khách vãng lai).
export function RealtorHeader({
  userName,
  roleId,
}: {
  userName?: string;
  roleId?: RoleId;
}) {
  const [open, setOpen] = useState(false); // menu mobile
  const [moreOpen, setMoreOpen] = useState(false); // dropdown "Thêm ..."
  const pathname = usePathname();

  // Lọc mục "Thêm ..." theo role hiện tại (không có role -> chỉ mục dùng chung).
  const moreItems = MORE.filter(
    (m) => !m.roles || (roleId ? m.roles.includes(roleId) : false)
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 pl-4 pr-2 lg:pl-8 lg:pr-4">
        {/* Logo -> quay lại landing Q-Broker */}
        <Link href="/" aria-label="Q-Broker home">
          <RealtorLogo />
        </Link>

        {/* Menu chính (desktop) */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => {
            const internal = item.href.startsWith("/");
            const active = internal && pathname.startsWith(item.href);
            if (internal) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={
                    "text-sm font-semibold transition-colors " +
                    (active
                      ? "text-realtor-600"
                      : "text-slate-700 hover:text-realtor-500")
                  }
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-semibold text-slate-700 hover:text-realtor-500"
              >
                {item.label}
              </a>
            );
          })}

          {/* "Thêm ..." + dropdown (chỉ tắt khi bấm lại nút hoặc chọn 1 mục) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-realtor-500"
              aria-haspopup="menu"
            >
              Thêm ...
              <Icon
                name="ChevronDown"
                className={`h-4 w-4 transition-transform ${
                  moreOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                {moreItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-realtor-500"
                  >
                    <Icon name={item.icon} className="h-4 w-4 shrink-0" />
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Bên phải: chuông + tin nhắn + role/đăng nhập */}
        <div className="flex items-center gap-2">
          {/* Chuông thông báo + tin nhắn (chỉ hiện khi đã đăng nhập) */}
          {userName && (
            <div className="hidden items-center gap-1 sm:flex">
              <button
                type="button"
                className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100"
                aria-label="Thông báo"
              >
                <Icon name="Bell" className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-realtor-500" />
              </button>
              <button
                type="button"
                className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100"
                aria-label="Tin nhắn"
              >
                <Icon name="MessageCircle" className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-realtor-500" />
              </button>
            </div>
          )}

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
            type="button"
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
          {[...NAV, ...moreItems].map((item) => {
            const internal = item.href.startsWith("/");
            const active = internal && pathname.startsWith(item.href);
            const cls =
              "block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-50 " +
              (active ? "bg-realtor-50 text-realtor-600" : "text-slate-700");
            return internal ? (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cls}
              >
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href} className={cls}>
                {item.label}
              </a>
            );
          })}
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
