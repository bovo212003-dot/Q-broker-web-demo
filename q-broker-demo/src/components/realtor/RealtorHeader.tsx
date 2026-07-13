"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { RoleId } from "@/types";
import { withRole } from "@/lib/role";
import { RealtorLogo } from "./RealtorLogo";
import { NOTIFICATIONS, type NotiTone } from "@/data/notifications";
import { CONVERSATIONS } from "@/data/messages";

// Màu vòng icon cho từng loại thông báo.
const NOTI_TONE: Record<NotiTone, string> = {
  green: "bg-emerald-50 text-emerald-600",
  blue: "bg-realtor-50 text-realtor-500",
  amber: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
  rose: "bg-rose-50 text-rose-500",
};

// Thanh điều hướng trên cùng của Q-Broker.
// Sticky, nền trắng, đổ bóng nhẹ; menu chính ẩn trên mobile (hamburger).
// Mục có href thật (bắt đầu bằng "/") là route nội bộ -> render <Link>.

// Menu chính -> dùng chung cho MỌI role.
const NAV = [
  { label: "Đào tạo", href: "/realtor/dao-tao" },
  { label: "Dự án", href: "/realtor/du-an" },
  { label: "Chia sẻ giỏ hàng", href: "/realtor/chia-se-gio-hang" },
  { label: "Cần thuê - mua", href: "/realtor/can-thue-mua" },
  { label: "Tuyển dụng", href: "/realtor/tuyen-dung" },
  { label: "Live stream", href: "/realtor/livestream" },
  { label: "Tin tức", href: "/realtor/tin-tuc" },
];

// Bảng drop của "Đào tạo" — hiện khi hover vào mục Đào tạo trên header.
// exact: chỉ active khi đúng đường dẫn (dùng cho "Trang chủ").
const DAO_TAO_MENU = [
  { label: "Các khóa đào tạo", href: "/realtor/dao-tao", icon: "Home", desc: "Tổng quan, thông báo & khoá học", exact: true },
  { label: "Chuyên đề", href: "/realtor/dao-tao/chuyen-de", icon: "BookOpen", desc: "Bài học theo chủ đề" },
  { label: "Trắc nghiệm", href: "/realtor/dao-tao/trac-nghiem", icon: "PencilLine", desc: "Luyện đề & câu hỏi" },
  { label: "Tự luận", href: "/realtor/dao-tao/tu-luan", icon: "FileText", desc: "Bài tập viết & tình huống" },
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
  { label: "Affilate", href: "/realtor/affiliate", icon: "Handshake" },
  { label: "Phiếu tính giá", href: "/realtor/phieu-tinh-gia", icon: "Calculator" },
  { label: "Tin nhắn", href: "/realtor/tin-nhan", icon: "MessageCircle", roles: ["broker", "admin", "customer"] },
  { label: "Kết bạn", href: "/realtor/ket-ban", icon: "UserPlus", roles: ["broker", "admin", "customer"] },
  { label: "Tìm môi giới", href: "#", icon: "Search", roles: ["customer"] },
  { label: "Kí hợp đồng online", href: "#", icon: "FileSignature", roles: ["broker"] },
  { label: "Khách hàng (CRM)", href: "/realtor/khach-hang", icon: "Users", roles: ["broker"] },
];

// Menu tài khoản (bấm vào tên/avatar). "Đăng xuất" xử lý riêng bên dưới.
const ACCOUNT: { label: string; icon: string; href?: string }[] = [
  { label: "Hồ sơ cá nhân", icon: "UserRound", href: "/realtor/profile" },
  { label: "Ví", icon: "Wallet", href: "/realtor/wallet" },
  { label: "Cài đặt", icon: "Settings" },
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
  const [userOpen, setUserOpen] = useState(false); // menu tài khoản
  const [notiOpen, setNotiOpen] = useState(false); // dropdown thông báo
  const [msgOpen, setMsgOpen] = useState(false); // dropdown tin nhắn
  const pathname = usePathname();

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;
  const unreadMsg = CONVERSATIONS.filter((c) => c.unread).length;

  // Refs bao mỗi dropdown + nút mở của nó -> dùng để đóng khi click ra ngoài.
  const moreRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài vùng của nó (mỗi dropdown độc lập).
  useEffect(() => {
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (moreRef.current && !moreRef.current.contains(t)) setMoreOpen(false);
      if (userRef.current && !userRef.current.contains(t)) setUserOpen(false);
      if (notiRef.current && !notiRef.current.contains(t)) setNotiOpen(false);
      if (msgRef.current && !msgRef.current.contains(t)) setMsgOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Lọc mục "Thêm ..." theo role hiện tại (không có role -> chỉ mục dùng chung).
  const moreItems = MORE.filter(
    (m) => !m.roles || (roleId ? m.roles.includes(roleId) : false)
  );

  // Bấm logo -> về trang chủ site /realtor, giữ ngữ cảnh role qua ?role=...
  const homeHref = withRole("/realtor", roleId);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 pl-4 pr-2 lg:pl-8 lg:pr-4">
        {/* Logo -> quay lại landing Q-Broker */}
        <Link href={homeHref} aria-label="Q-Broker home">
          <RealtorLogo />
        </Link>

        {/* Menu chính (desktop) */}
        <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
          {NAV.map((item) => {
            const internal = item.href.startsWith("/");
            const active = internal && pathname.startsWith(item.href);

            // "Đào tạo" -> bảng drop hiện khi hover (CSS group-hover, không cần JS).
            if (item.href === "/realtor/dao-tao") {
              return (
                <div key={item.label} className="group relative">
                  <Link
                    href={withRole(item.href, roleId)}
                    className={
                      "flex items-center gap-1 whitespace-nowrap text-sm font-semibold transition-colors " +
                      (active
                        ? "text-realtor-600"
                        : "text-slate-700 hover:text-realtor-500")
                    }
                  >
                    {item.label}
                    <Icon
                      name="ChevronDown"
                      className="h-4 w-4 transition-transform group-hover:rotate-180"
                    />
                  </Link>

                  {/* pt-3 làm "cầu nối" để rê chuột xuống bảng không mất hover */}
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                      {DAO_TAO_MENU.map((sub) => {
                        const subActive = sub.exact
                          ? pathname === sub.href
                          : pathname.startsWith(sub.href);
                        return (
                          <Link
                            key={sub.href}
                            href={withRole(sub.href, roleId)}
                            className={
                              "flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors " +
                              (subActive ? "bg-realtor-50" : "hover:bg-slate-50")
                            }
                          >
                            <span
                              className={
                                "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg " +
                                (subActive
                                  ? "bg-realtor-500 text-white"
                                  : "bg-realtor-50 text-realtor-500")
                              }
                            >
                              <Icon name={sub.icon} className="h-4 w-4" />
                            </span>
                            <span className="min-w-0">
                              <span
                                className={
                                  "block text-sm font-semibold " +
                                  (subActive ? "text-realtor-600" : "text-slate-800")
                                }
                              >
                                {sub.label}
                              </span>
                              <span className="block text-xs text-slate-400">
                                {sub.desc}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            if (internal) {
              return (
                <Link
                  key={item.label}
                  href={withRole(item.href, roleId)}
                  className={
                    "whitespace-nowrap text-sm font-semibold transition-colors " +
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
                className="whitespace-nowrap text-sm font-semibold text-slate-700 hover:text-realtor-500"
              >
                {item.label}
              </a>
            );
          })}

          {/* "Thêm ..." + dropdown */}
          <div ref={moreRef} className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              className="flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-slate-700 hover:text-realtor-500"
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
                {moreItems.map((item) => {
                  const cls =
                    "flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-realtor-500";
                  // Route nội bộ (bắt đầu "/") -> Link giữ ?role=; còn lại là <a href="#">.
                  return item.href.startsWith("/") ? (
                    <Link
                      key={item.label}
                      href={withRole(item.href, roleId)}
                      onClick={() => setMoreOpen(false)}
                      className={cls}
                    >
                      <Icon name={item.icon} className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={cls}
                    >
                      <Icon name={item.icon} className="h-4 w-4 shrink-0" />
                      {item.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Bên phải: chuông + tin nhắn + role/đăng nhập */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Chuông thông báo + tin nhắn (chỉ hiện khi đã đăng nhập) */}
          {userName && (
            <div className="hidden items-center gap-1 sm:flex">
              {/* Chuông + dropdown thông báo */}
              <div ref={notiRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNotiOpen((v) => !v);
                    setMsgOpen(false);
                    setUserOpen(false);
                    setMoreOpen(false);
                  }}
                  className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100"
                  aria-label="Thông báo"
                  aria-haspopup="menu"
                >
                  <Icon name="Bell" className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notiOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg sm:w-96">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                      <p className="font-bold text-realtor-ink">Thông báo</p>
                      <button
                        type="button"
                        className="text-xs font-semibold text-realtor-500 hover:text-realtor-600"
                      >
                        Đánh dấu đã đọc
                      </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {NOTIFICATIONS.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => setNotiOpen(false)}
                          className={
                            "flex w-full gap-3 border-b border-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-50 " +
                            (n.unread ? "bg-realtor-50/40" : "")
                          }
                        >
                          <span
                            className={
                              "grid h-10 w-10 shrink-0 place-items-center rounded-full " +
                              NOTI_TONE[n.tone]
                            }
                          >
                            <Icon name={n.icon} className="h-5 w-5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-800">
                              {n.title}
                            </p>
                            <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                              {n.text}
                            </p>
                            <p className="mt-1 text-[11px] text-slate-400">
                              {n.time}
                            </p>
                          </div>
                          {n.unread && (
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-realtor-500" />
                          )}
                        </button>
                      ))}
                    </div>

                    <a
                      href="#"
                      onClick={() => setNotiOpen(false)}
                      className="block border-t border-slate-100 px-4 py-2.5 text-center text-sm font-semibold text-realtor-500 hover:bg-slate-50"
                    >
                      Xem tất cả thông báo
                    </a>
                  </div>
                )}
              </div>
              {/* Tin nhắn + dropdown hội thoại */}
              <div ref={msgRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setMsgOpen((v) => !v);
                    setNotiOpen(false);
                    setUserOpen(false);
                    setMoreOpen(false);
                  }}
                  className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100"
                  aria-label="Tin nhắn"
                  aria-haspopup="menu"
                >
                  <Icon name="MessageCircle" className="h-5 w-5" />
                  {unreadMsg > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadMsg}
                    </span>
                  )}
                </button>

                {msgOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg sm:w-96">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                      <p className="font-bold text-realtor-ink">Tin nhắn</p>
                      <button
                        type="button"
                        className="flex items-center gap-1 text-xs font-semibold text-realtor-500 hover:text-realtor-600"
                      >
                        <Icon name="PenSquare" className="h-4 w-4" />
                        Viết tin nhắn
                      </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {CONVERSATIONS.map((c) => (
                        <Link
                          key={c.id}
                          href={withRole(`/realtor/tin-nhan?c=${c.id}`, roleId)}
                          onClick={() => setMsgOpen(false)}
                          className={
                            "flex w-full items-center gap-3 border-b border-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-50 " +
                            (c.unread ? "bg-realtor-50/40" : "")
                          }
                        >
                          <span className="relative shrink-0">
                            <span
                              className="flex h-11 w-11 items-center justify-center rounded-full font-bold text-white"
                              style={{ backgroundColor: c.color }}
                            >
                              {c.name.charAt(0).toUpperCase()}
                            </span>
                            {c.online && (
                              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p
                              className={
                                "truncate text-sm " +
                                (c.unread
                                  ? "font-bold text-slate-900"
                                  : "font-semibold text-slate-800")
                              }
                            >
                              {c.name}
                            </p>
                            <p
                              className={
                                "truncate text-xs " +
                                (c.unread ? "text-slate-600" : "text-slate-400")
                              }
                            >
                              {c.fromMe && "Bạn: "}
                              {c.last}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[11px] text-slate-400">
                              {c.time}
                            </span>
                            {c.unread && (
                              <span className="h-2.5 w-2.5 rounded-full bg-realtor-500" />
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>

                    <Link
                      href={withRole("/realtor/tin-nhan", roleId)}
                      onClick={() => setMsgOpen(false)}
                      className="block border-t border-slate-100 px-4 py-2.5 text-center text-sm font-semibold text-realtor-500 hover:bg-slate-50"
                    >
                      Xem tất cả tin nhắn
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {userName ? (
            // Đã đăng nhập -> nút tên (role) + avatar, bấm ra menu tài khoản
            <div ref={userRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setUserOpen((v) => !v)}
                className="flex max-w-[200px] items-center gap-2 rounded-full border border-slate-300 py-1 pl-1 pr-3 text-sm font-semibold text-slate-800 hover:border-slate-400"
                aria-haspopup="menu"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-realtor-500 text-xs text-white">
                  {userName.charAt(0).toUpperCase()}
                </span>
                <span className="truncate">{userName}</span>
                <Icon
                  name="ChevronDown"
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    userOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {userOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                  {ACCOUNT.map((item) => {
                    const cls =
                      "flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-realtor-500";
                    return item.href ? (
                      <Link
                        key={item.label}
                        href={withRole(item.href, roleId)}
                        onClick={() => setUserOpen(false)}
                        className={cls}
                      >
                        <Icon name={item.icon} className="h-4 w-4 shrink-0" />
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        key={item.label}
                        href="#"
                        onClick={() => setUserOpen(false)}
                        className={cls}
                      >
                        <Icon name={item.icon} className="h-4 w-4 shrink-0" />
                        {item.label}
                      </a>
                    );
                  })}
                  <div className="my-1 border-t border-slate-100" />
                  {/* Đăng xuất -> quay về trang chọn role */}
                  <Link
                    href="/"
                    onClick={() => setUserOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <Icon name="LogOut" className="h-4 w-4 shrink-0" />
                    Đăng xuất
                  </Link>
                </div>
              )}
            </div>
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

            // "Đào tạo" -> link + các mục con thụt vào (mobile không hover được).
            if (item.href === "/realtor/dao-tao") {
              return (
                <div key={item.label}>
                  <Link
                    href={withRole(item.href, roleId)}
                    onClick={() => setOpen(false)}
                    className={cls}
                  >
                    {item.label}
                  </Link>
                  <div className="my-1 ml-3 border-l border-slate-100 pl-2">
                    {DAO_TAO_MENU.filter((s) => !s.exact).map((sub) => (
                      <Link
                        key={sub.href}
                        href={withRole(sub.href, roleId)}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                      >
                        <Icon name={sub.icon} className="h-4 w-4 text-realtor-500" />
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return internal ? (
              <Link
                key={item.label}
                href={withRole(item.href, roleId)}
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
