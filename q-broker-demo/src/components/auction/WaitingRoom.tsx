"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { AuctionBroker, StoredRequest } from "@/data/auction";
import { cn } from "@/lib/utils";

// BƯỚC 2 — BẢNG TIN CHỜ (thay cho phiên đấu giá 30').
// Tin của khách LUÔN MỞ — môi giới đủ điều kiện chủ động đăng ký tham gia.
// Tin chỉ kết thúc khi khách "Bắt đầu chọn môi giới" hoặc "Đóng tin";
// rời trang thì tin vẫn treo ở trạng thái "Chờ kết nối".

const JOIN_INTERVAL_MS = 1400; // demo: mô phỏng môi giới lần lượt đăng ký

const CONDITIONS = [
  "Đã xác thực tài khoản & chứng chỉ hành nghề",
  "Điểm uy tín đạt ngưỡng tối thiểu",
  "Khu vực hoạt động phù hợp nhu cầu",
  "Chuyên môn đúng loại bất động sản",
];

export function WaitingRoom({
  req,
  brokers,
  onJoined,
  onStart,
  onClose,
}: {
  req: StoredRequest;
  brokers: AuctionBroker[];
  onJoined: (n: number) => void;
  onStart: () => void;
  onClose: () => void;
}) {
  const draft = req.draft;
  const joined = Math.min(req.joined, brokers.length);
  const allIn = joined >= brokers.length;

  // Mô phỏng môi giới lần lượt đăng ký tham gia tin (demo).
  // Số đã đăng ký được lưu lại qua onJoined -> rời trang quay lại vẫn giữ.
  useEffect(() => {
    if (allIn) return;
    const t = setInterval(
      () => onJoined(Math.min(brokers.length, joined + 1)),
      JOIN_INTERVAL_MS
    );
    return () => clearInterval(t);
  }, [allIn, joined, brokers.length, onJoined]);

  return (
    <div className="mx-auto grid max-w-5xl animate-fade-up gap-6 lg:grid-cols-5">
      {/* Tóm tắt nhu cầu */}
      <div className="lg:col-span-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-400">
            <Icon name="ClipboardList" className="h-4 w-4" />
            Nhu cầu của bạn
          </p>
          <h3 className="mt-3 text-lg font-bold text-al-700">
            Cần {draft.type.toLowerCase()} {draft.propertyType.toLowerCase()}
          </h3>
          <div className="mt-4 space-y-3 text-sm">
            <SummaryRow icon="MapPin" label="Khu vực" value={draft.area} />
            <SummaryRow icon="Wallet" label="Ngân sách" value={draft.budget} />
            {draft.size && (
              <SummaryRow icon="Ruler" label="Diện tích" value={`~${draft.size} m²`} />
            )}
            {draft.bedrooms && (
              <SummaryRow icon="BedDouble" label="Phòng ngủ" value={draft.bedrooms} />
            )}
          </div>
          {draft.criteria.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {draft.criteria.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-al-50 px-2.5 py-1 text-xs font-medium text-al-700"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Điều kiện tham gia */}
        <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold text-slate-800">
            Chỉ môi giới đủ điều kiện được tham gia
          </p>
          <ul className="mt-3 space-y-2.5">
            {CONDITIONS.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-slate-600">
                <Icon
                  name="CheckCircle2"
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bảng tin chờ */}
      <div className="lg:col-span-3">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-al-700 via-al-600 to-al-500 p-6 text-white shadow-lg sm:p-8">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-flame-500" />
              </span>
              Tin của bạn đã mở
            </p>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
              Không giới hạn thời gian
            </span>
          </div>

          {/* Trạng thái chờ (thay cho đồng hồ đếm ngược) */}
          <div className="mt-5">
            <p className="text-2xl font-bold leading-snug sm:text-3xl">
              Đang chờ kết nối với môi giới tiềm năng
            </p>
            <p className="mt-2 flex items-start gap-1.5 text-sm text-white/70">
              <Icon name="Info" className="mt-0.5 h-4 w-4 shrink-0" />
              Đăng ngày {req.createdAt} · Tin luôn treo ở trạng thái chờ — kể cả
              khi bạn rời trang — cho tới khi bạn bắt đầu chọn môi giới hoặc
              đóng tin.
            </p>
          </div>

          {/* Tiến độ đăng ký */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm">
              <p className="font-semibold">
                {joined} môi giới đã đăng ký
              </p>
              <p className="text-white/70">Mỗi người chỉ đăng ký 1 lần</p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-flame-500 transition-all duration-500"
                style={{ width: `${(joined / brokers.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Danh sách môi giới đã đăng ký */}
          <div className="mt-6 space-y-2">
            {joined === 0 && (
              <p className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-6 text-sm text-white/70 backdrop-blur">
                <Icon name="Loader2" className="h-4 w-4 animate-spin" />
                Tin vừa được đưa lên bảng tin — môi giới sẽ sớm đăng ký...
              </p>
            )}
            {brokers.slice(0, joined).map((b, i) => (
              <div
                key={b.id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur",
                  i === joined - 1 && "animate-pop-in"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.avatar}
                  alt={b.name}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-white/30"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{b.name}</p>
                  <p className="truncate text-xs text-white/60">
                    {b.area} · {b.deals} giao dịch
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-400/20 px-2.5 py-1 text-[11px] font-bold text-emerald-200">
                  Đã đăng ký
                </span>
              </div>
            ))}
          </div>

          {/* Hành động: chọn môi giới ngay hoặc đóng tin */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 py-4 text-base font-bold backdrop-blur transition-colors hover:bg-rose-500/30 hover:text-rose-100"
            >
              <Icon name="XCircle" className="h-5 w-5" />
              Đóng tin
            </button>
            <button
              disabled={joined === 0}
              onClick={onStart}
              className={cn(
                "flex items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold transition-all",
                joined > 0
                  ? "bg-flame-500 text-white shadow-lg shadow-flame-900/30 hover:-translate-y-0.5 hover:bg-flame-600"
                  : "cursor-wait bg-white/10 text-white/50"
              )}
            >
              <Icon name="Heart" className="h-5 w-5" />
              Bắt đầu chọn môi giới ({joined})
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-white/60">
            Bạn có thể chọn ngay khi có môi giới đăng ký, hoặc chờ thêm để có
            nhiều lựa chọn hơn.
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-al-50 text-al-600">
        <Icon name={icon} className="h-4 w-4" />
      </span>
      <span className="text-slate-400">{label}</span>
      <span className="ml-auto font-semibold text-slate-800">{value}</span>
    </div>
  );
}
