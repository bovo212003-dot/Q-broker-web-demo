"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import {
  AFFILIATE_TERMS_SECTIONS,
  AFFILIATE_TERMS_VERSION,
} from "@/data/affiliate";
import { RoleId } from "@/types";

// =============================================================
// CỔNG ĐIỀU KHOẢN trang affiliate.
// DEMO: hiện lại MỖI lần vào trang (không lưu đồng ý) — remount là
// modal mở lại từ đầu. Hiển thị VAI TRÒ (role) đang xem để đúng ngữ
// cảnh; role lấy từ ?role= giống các trang /realtor khác.
// Trong một phiên, sau khi đồng ý vẫn xem lại được qua nút nổi ở góc.
// =============================================================

export function AffiliateTermsGate({
  roleId,
  roleName,
}: {
  roleId?: RoleId;
  roleName?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(true); // luôn mở khi vào trang (demo)
  const [checked, setChecked] = useState(false);
  const [agreed, setAgreed] = useState(false); // đã đồng ý trong phiên hiện tại

  const agree = () => {
    if (!checked) return;
    setAgreed(true);
    setOpen(false);
  };

  const decline = () => router.push("/realtor");

  // Nhãn vai trò tương ứng đang xem điều khoản.
  const roleTag = roleName
    ? `Vai trò đang xem: ${roleName}`
    : "Áp dụng cho mọi đối tác Affiliate";

  if (!open) {
    // Đã đồng ý trong phiên -> chỉ còn nút nổi để mở xem lại.
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-30 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-lg hover:bg-slate-50"
      >
        <Icon name="ScrollText" className="h-3.5 w-3.5 text-realtor-500" />
        Điều khoản chương trình
      </button>
    );
  }

  const readOnly = agreed; // mở lại để xem, không cần tick đồng ý nữa

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-realtor-700 to-realtor-500 px-6 py-5 text-white">
          <div>
            <p className="flex items-center gap-2 text-base font-bold">
              <Icon name="ScrollText" className="h-5 w-5" />
              Điều khoản chương trình Affiliate
            </p>
            <p className="mt-1 text-xs text-realtor-50/90">
              6 điều, đọc trong 3 phút: cách hoạt động, ai trả tiền, hoa hồng,
              cơ chế đảm bảo, pháp lý — thuế và quy tắc cấm.
            </p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold">
              <Icon name={roleId ? "UserRound" : "Users"} className="h-3 w-3" />
              {roleTag}
            </span>
          </div>
          {readOnly && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 hover:bg-white/20"
              aria-label="Đóng"
            >
              <Icon name="X" className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Nội dung điều khoản cuộn được */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {AFFILIATE_TERMS_SECTIONS.map((s) => (
            <section key={s.title}>
              <h3 className="flex items-center gap-2 text-sm font-bold text-realtor-ink">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-realtor-50 text-realtor-500">
                  <Icon name={s.icon} className="h-4 w-4" />
                </span>
                {s.title}
              </h3>
              <ul className="mt-2 space-y-1.5 pl-9">
                {s.points.map((p) => (
                  <li
                    key={p}
                    className="list-disc text-[13px] leading-relaxed text-slate-600"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <p className="rounded-xl bg-slate-50 px-4 py-3 text-[11px] leading-relaxed text-slate-500">
            Phiên bản điều khoản: {AFFILIATE_TERMS_VERSION}. Đây là bản demo nên
            điều khoản hiện lại mỗi lần bạn vào trang; ở sản phẩm thật, đồng ý sẽ
            được ghi nhận và chỉ hỏi lại khi điều khoản thay đổi.
          </p>
        </div>

        {/* Footer: checkbox + hành động */}
        <div className="border-t border-slate-100 px-6 py-4">
          {readOnly ? (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-xl bg-realtor-500 py-2.5 text-sm font-bold text-white hover:bg-realtor-600"
            >
              Đã hiểu, đóng lại
            </button>
          ) : (
            <>
              <label className="flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-realtor-500 accent-realtor-500"
                />
                <span className="text-[13px] leading-relaxed text-slate-700">
                  Tôi đã đọc, hiểu và đồng ý với toàn bộ điều khoản của chương
                  trình Affiliate Q-Broker, bao gồm cơ chế hoa hồng và nghĩa vụ
                  thuế nêu trên.
                </span>
              </label>
              <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={decline}
                  className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Không đồng ý — quay lại
                </button>
                <button
                  type="button"
                  onClick={agree}
                  disabled={!checked}
                  className="flex-1 rounded-xl bg-realtor-500 py-2.5 text-sm font-bold text-white hover:bg-realtor-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Đồng ý & bắt đầu kiếm hoa hồng
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
