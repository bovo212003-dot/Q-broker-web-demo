"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

// Thẻ đăng ký bản tin (sidebar tin tức) — mô phỏng newsletter
// của Zillow/Realtor.com. Demo: chỉ đổi trạng thái, chưa nối API.

export function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-realtor-700 to-realtor-500 p-5 text-white">
      <p className="flex items-center gap-2 text-sm font-bold">
        <Icon name="Mail" className="h-4 w-4" />
        Bản tin thị trường hàng tuần
      </p>
      {done ? (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-white/15 px-3 py-2.5 text-sm">
          <Icon name="Check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
          Đã đăng ký! Bản tin đầu tiên sẽ tới hộp thư của bạn sáng thứ Hai.
        </p>
      ) : (
        <>
          <p className="mt-1.5 text-xs leading-relaxed text-realtor-50/85">
            Tóm tắt diễn biến giá, chính sách mới và phiên đấu giá nổi bật — đọc
            trong 5 phút mỗi sáng thứ Hai.
          </p>
          <form onSubmit={submit} className="mt-3 flex gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="Email của bạn"
              className="min-w-0 flex-1 rounded-xl border-0 bg-white/90 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-realtor-ink px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
            >
              Đăng ký
            </button>
          </form>
        </>
      )}
    </div>
  );
}
