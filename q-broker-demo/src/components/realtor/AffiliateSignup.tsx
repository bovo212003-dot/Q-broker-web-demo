"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

// =============================================================
// NÚT + MODAL ĐĂNG KÝ ĐỐI TÁC (demo, chưa nối API)
// Form: tên + SĐT + kênh chia sẻ chính. Gửi xong hiện màn chúc
// mừng kèm mã đối tác giả lập để khép kín luồng CTA.
// =============================================================

const CHANNELS = [
  "Facebook / Zalo cá nhân",
  "TikTok / YouTube",
  "Website / Blog",
  "Mạng lưới quan hệ trực tiếp",
];

/** Sinh mã đối tác demo từ tên (không cần unique thật) */
const partnerCode = (name: string) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase())
    .join("")
    .slice(0, 4);
  return `QB-${String(Math.floor(1000 + Math.random() * 9000))}-${initials || "VIP"}`;
};

export function AffiliateSignupButton({
  variant = "solid",
  label = "Trở thành đối tác ngay",
}: {
  /** solid: nền trắng chữ xanh (đặt trên nền màu); brand: nền xanh chữ trắng */
  variant?: "solid" | "brand";
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [code, setCode] = useState("");

  const close = () => {
    setOpen(false);
    // Reset sau khi đóng để lần mở sau là form mới.
    window.setTimeout(() => {
      setDone(false);
      setName("");
      setPhone("");
      setChannel(CHANNELS[0]);
    }, 300);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setCode(partnerCode(name));
    setDone(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm font-bold shadow-lg transition-colors ${
          variant === "solid"
            ? "bg-white text-realtor-600 hover:bg-realtor-50"
            : "bg-realtor-500 text-white hover:bg-realtor-600"
        }`}
      >
        <Icon name="Rocket" className="h-4 w-4" />
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="flex items-center justify-between bg-gradient-to-r from-realtor-700 to-realtor-500 px-5 py-4 text-white">
              <p className="text-sm font-bold">
                {done ? "Đăng ký thành công 🎉" : "Đăng ký đối tác Q-Broker"}
              </p>
              <button
                type="button"
                onClick={close}
                className="rounded-full p-1.5 hover:bg-white/20"
                aria-label="Đóng"
              >
                <Icon name="X" className="h-4 w-4" />
              </button>
            </div>

            {done ? (
              // ---- Màn chúc mừng + mã đối tác ----
              <div className="px-6 py-8 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                  <Icon name="BadgeCheck" className="h-7 w-7 text-emerald-500" />
                </span>
                <p className="mt-4 text-lg font-bold text-realtor-ink">
                  Chào mừng, {name.trim()}!
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Mã đối tác của bạn đã sẵn sàng. Tư vấn viên sẽ gọi xác nhận
                  trong 24h làm việc.
                </p>
                <p className="mx-auto mt-4 w-fit rounded-xl bg-slate-100 px-5 py-2.5 font-mono text-lg font-extrabold tracking-wider text-realtor-600">
                  {code}
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-6 w-full rounded-xl bg-realtor-500 py-2.5 text-sm font-bold text-white hover:bg-realtor-600"
                >
                  Hoàn tất
                </button>
              </div>
            ) : (
              // ---- Form đăng ký ----
              <form onSubmit={submit} className="space-y-4 px-6 py-6">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Họ và tên
                  </span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Nguyễn Văn A"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-realtor-500 focus:outline-none focus:ring-2 focus:ring-realtor-500/30"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Số điện thoại
                  </span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    type="tel"
                    inputMode="tel"
                    placeholder="09xx xxx xxx"
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-realtor-500 focus:outline-none focus:ring-2 focus:ring-realtor-500/30"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Kênh chia sẻ chính
                  </span>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-realtor-500 focus:outline-none focus:ring-2 focus:ring-realtor-500/30"
                  >
                    {CHANNELS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-realtor-500 py-3 text-sm font-bold text-white hover:bg-realtor-600"
                >
                  Nhận link giới thiệu miễn phí
                </button>
                <p className="text-center text-[11px] text-slate-400">
                  Miễn phí trọn đời — không ràng buộc doanh số tối thiểu.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
