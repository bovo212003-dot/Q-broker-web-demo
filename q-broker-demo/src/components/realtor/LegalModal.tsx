"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { AuctionLot } from "@/data/auctionLive";

// Popup "Hồ sơ pháp lý" của tài sản đang đấu giá:
// hiện đầy đủ giấy chứng nhận, chủ sở hữu, quy hoạch, tranh chấp,
// thế chấp và danh mục hồ sơ đính kèm trong hồ sơ mời đấu giá.

export function LegalModal({
  lot,
  onClose,
}: {
  lot: AuctionLot;
  onClose: () => void;
}) {
  // Đóng bằng phím Esc.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const info = lot.legalInfo;

  // Các dòng thông tin chính (nhãn + giá trị + icon).
  const rows: { label: string; value: string; icon: string; alert?: boolean }[] =
    info
      ? [
          { label: "Loại giấy chứng nhận", value: info.certificate, icon: "FileCheck" },
          { label: "Số giấy chứng nhận", value: info.certNumber, icon: "Hash" },
          { label: "Cơ quan cấp", value: info.issuedBy, icon: "Landmark" },
          { label: "Chủ sở hữu", value: info.owner, icon: "UserRound" },
          { label: "Mục đích sử dụng", value: info.landUse, icon: "MapPinned" },
          { label: "Thời hạn sử dụng", value: info.landTerm, icon: "CalendarClock" },
          { label: "Diện tích", value: info.landArea, icon: "Ruler" },
          { label: "Quy hoạch", value: info.planning, icon: "Map" },
          { label: "Tranh chấp", value: info.dispute, icon: "Scale" },
          {
            label: "Thế chấp / kê biên",
            value: info.mortgage,
            icon: "Banknote",
            alert: info.mortgage.toLowerCase().includes("đang"),
          },
        ]
      : [];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tiêu đề */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-base font-bold text-realtor-ink">
              <Icon name="ShieldCheck" className="h-5 w-5 text-emerald-600" />
              Hồ sơ pháp lý tài sản
            </p>
            <p className="mt-0.5 truncate text-sm text-slate-500">{lot.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200"
            aria-label="Đóng"
          >
            <Icon name="X" className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          {info ? (
            <>
              {/* Dải xác nhận đã thẩm định */}
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <Icon name="BadgeCheck" className="h-5 w-5 shrink-0 text-emerald-600" />
                Hồ sơ đã được Q-Broker thẩm định và công chứng trước khi đưa ra đấu giá.
              </div>

              {/* Bảng thông tin pháp lý */}
              <dl className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                {rows.map((r) => (
                  <div
                    key={r.label}
                    className="flex items-start gap-3 px-4 py-3"
                  >
                    <Icon
                      name={r.icon}
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        r.alert ? "text-amber-500" : "text-slate-400"
                      }`}
                    />
                    <dt className="w-40 shrink-0 text-sm text-slate-500">
                      {r.label}
                    </dt>
                    <dd
                      className={`min-w-0 flex-1 text-sm font-semibold ${
                        r.alert ? "text-amber-600" : "text-slate-800"
                      }`}
                    >
                      {r.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Hồ sơ đính kèm */}
              <h3 className="mt-5 text-sm font-bold text-slate-900">
                Hồ sơ đính kèm
              </h3>
              <ul className="mt-2 space-y-2">
                {info.documents.map((d) => (
                  <li
                    key={d}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2.5"
                  >
                    <span className="flex min-w-0 items-center gap-2 text-sm text-slate-700">
                      <Icon name="FileText" className="h-4 w-4 shrink-0 text-realtor-500" />
                      <span className="truncate">{d}</span>
                    </span>
                    <button
                      type="button"
                      className="flex shrink-0 items-center gap-1 text-xs font-semibold text-realtor-500 hover:text-realtor-600"
                    >
                      <Icon name="Download" className="h-3.5 w-3.5" />
                      Tải
                    </button>
                  </li>
                ))}
              </ul>

              <p className="mt-4 flex items-start gap-1.5 text-xs text-slate-400">
                <Icon name="Info" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Thông tin mang tính minh hoạ cho bản demo. Vui lòng đối chiếu hồ sơ
                gốc tại văn phòng tổ chức đấu giá trước khi tham gia.
              </p>
            </>
          ) : (
            <p className="py-8 text-center text-sm text-slate-500">
              Chưa cập nhật hồ sơ pháp lý cho tài sản này.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
