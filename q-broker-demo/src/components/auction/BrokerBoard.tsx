"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  AREAS,
  BROKER_ME,
  OPEN_DEMANDS,
  OpenDemand,
  PROPERTY_TYPES,
  TRANSACTION_TYPES,
  img,
  propertyThumb,
} from "@/data/auction";
import { cn } from "@/lib/utils";
import { ChatWidget } from "./ChatWidget";

// =============================================================
// TRANG CẦN THUÊ - MUA — GIAO DIỆN CHO MÔI GIỚI
// Môi giới xem nhiều tin nhu cầu đang mở cùng lúc, lọc theo khu vực đảm
// nhiệm. "Nhận tư vấn ngay" -> xếp hàng đợi khách matching -> trao đổi.
// Có mục quản lý các tin đang nhận tư vấn (trạng thái + xem chi tiết + chat).
// =============================================================

// Trạng thái tiếp nhận của môi giới với từng tin.
type RegState = "queued" | "matched";
const MATCH_DELAY_MS = 4500; // demo: sau khi nhận tư vấn, khách "chọn" sau ~4.5s

const AREA_MINE = "__mine__"; // giá trị đặc biệt cho bộ lọc "khu vực của tôi"

export function BrokerBoard() {
  const [areaFilter, setAreaFilter] = useState<string>(AREA_MINE);
  const [typeFilter, setTypeFilter] = useState("");
  const [ptypeFilter, setPtypeFilter] = useState("");
  const [regs, setRegs] = useState<Record<string, RegState>>({});
  const [detail, setDetail] = useState<OpenDemand | null>(null);
  const [chat, setChat] = useState<OpenDemand | null>(null);

  const inMyArea = (d: OpenDemand) => BROKER_ME.areas.includes(d.area);

  // Danh sách tin sau lọc — ưu tiên tin thuộc khu vực đảm nhiệm lên trước.
  const list = useMemo(() => {
    return OPEN_DEMANDS.filter((d) => {
      if (areaFilter === AREA_MINE && !inMyArea(d)) return false;
      if (areaFilter !== AREA_MINE && areaFilter && d.area !== areaFilter) return false;
      if (typeFilter && d.type !== typeFilter) return false;
      if (ptypeFilter && d.propertyType !== ptypeFilter) return false;
      return true;
    }).sort((a, b) => {
      const am = inMyArea(a) ? 0 : 1;
      const bm = inMyArea(b) ? 0 : 1;
      if (am !== bm) return am - bm;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [areaFilter, typeFilter, ptypeFilter]);

  // Nhận tư vấn -> vào hàng đợi; demo tự chuyển sang "đang trao đổi" sau vài giây.
  const register = (d: OpenDemand) => {
    if (regs[d.id] || d.status === "Đã đóng") return;
    setRegs((r) => ({ ...r, [d.id]: "queued" }));
    setTimeout(() => {
      setRegs((r) => (r[d.id] === "queued" ? { ...r, [d.id]: "matched" } : r));
    }, MATCH_DELAY_MS);
  };

  const receiving = OPEN_DEMANDS.filter((d) => regs[d.id]);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 lg:px-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-al-700 via-al-600 to-al-500 px-6 py-9 text-white shadow-lg sm:px-10">
        {/* Ảnh nền phủ toàn khung — gradient chuyển mượt, không còn seam */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img("photo-1486406146926-c627a92ad1ab", 1200)}
            alt=""
            className="h-full w-full animate-kenburns object-cover object-center"
          />
          {/* Phủ màu: đậm bên trái (chỗ có chữ) -> nhạt dần sang phải */}
          <div className="absolute inset-0 bg-gradient-to-r from-al-800 via-al-700/90 to-al-600/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-al-800/60 to-transparent" />
        </div>
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-flame-500/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur">
            <Icon name="Radar" className="h-3.5 w-3.5 text-flame-400" />
            Bảng tin nhu cầu · Môi giới
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            Nguồn khách tiềm năng cho khu vực của bạn
          </h1>
          <p className="mt-3 max-w-xl text-white/80">
            Tiếp cận nhiều tin nhu cầu đang mở cùng lúc, ưu tiên đúng khu vực bạn
            đảm nhiệm. Nhận tư vấn để vào hàng đợi — khách chọn xong là hai bên
            trao đổi ngay.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur">
              <Icon name="MapPin" className="h-4 w-4 text-flame-300" />
              Khu vực đảm nhiệm: <b>{BROKER_ME.areas.join(", ")}</b>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur">
              <Icon name="Star" className="h-4 w-4 text-flame-300" />
              Chuyên môn: <b>{BROKER_ME.specialties.join(", ")}</b>
            </span>
          </div>
        </div>
      </section>

      {/* Quản lý tin đang nhận tư vấn */}
      {receiving.length > 0 && (
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-al-700">
            <Icon name="ClipboardList" className="h-5 w-5 text-flame-500" />
            Tin đang nhận tư vấn của tôi
            <span className="rounded-full bg-al-50 px-2.5 py-0.5 text-sm text-al-600">
              {receiving.length}
            </span>
          </h2>
          <div className="space-y-3">
            {receiving.map((d) => (
              <ReceivingRow
                key={d.id}
                demand={d}
                state={regs[d.id]}
                onDetail={() => setDetail(d)}
                onChat={() => setChat(d)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Bảng tin nhu cầu đang mở */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-al-700">
            <Icon name="LayoutGrid" className="h-5 w-5 text-flame-500" />
            Bảng tin nhu cầu khách hàng
            <span className="rounded-full bg-al-50 px-2.5 py-0.5 text-sm text-al-600">
              {list.length}
            </span>
          </h2>
        </div>

        {/* Bộ lọc */}
        <div className="mb-5 grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3">
          <Select value={areaFilter} onChange={setAreaFilter}>
            <option value={AREA_MINE}>Khu vực tôi đảm nhiệm</option>
            <option value="">Tất cả khu vực</option>
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
          <Select value={typeFilter} onChange={setTypeFilter} placeholder="Loại giao dịch">
            <option value="">Tất cả giao dịch</option>
            {TRANSACTION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          <Select value={ptypeFilter} onChange={setPtypeFilter} placeholder="Loại BĐS">
            <option value="">Tất cả loại BĐS</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>

        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400">
            Không có tin phù hợp bộ lọc.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((d, i) => (
              <div key={d.id} style={{ animationDelay: `${(i % 6) * 60}ms` }} className="animate-fade-up">
                <DemandCard
                  demand={d}
                  mine={inMyArea(d)}
                  state={regs[d.id]}
                  onRegister={() => register(d)}
                  onDetail={() => setDetail(d)}
                  onChat={() => setChat(d)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal chi tiết tin */}
      {detail && (
        <DemandDetailModal
          demand={detail}
          state={regs[detail.id]}
          mine={inMyArea(detail)}
          onRegister={() => register(detail)}
          onChat={() => {
            setChat(detail);
            setDetail(null);
          }}
          onClose={() => setDetail(null)}
        />
      )}

      {/* Khung chat nổi */}
      {chat && (
        <ChatWidget
          peerName={chat.customer}
          peerAvatar={chat.avatar}
          post={{
            thumb: propertyThumb(chat.propertyType),
            title: `Cần ${chat.type.toLowerCase()} ${chat.propertyType.toLowerCase()} · ${chat.area}`,
            budget: chat.budget,
          }}
          greeting={`Chào anh/chị! Mình đang cần ${chat.type.toLowerCase()} ${chat.propertyType.toLowerCase()} tại ${chat.area}, ngân sách ${chat.budget}. ${chat.note} Nhờ anh/chị tư vấn giúp mình với ạ.`}
          autoReply="Vâng, mình cảm ơn anh/chị! Khi nào có sản phẩm phù hợp mình sắp xếp đi xem sớm nhé."
          onClose={() => setChat(null)}
        />
      )}
    </main>
  );
}

// -------- Thẻ tin trên bảng --------
function DemandCard({
  demand: d,
  mine,
  state,
  onRegister,
  onDetail,
  onChat,
}: {
  demand: OpenDemand;
  mine: boolean;
  state?: RegState;
  onRegister: () => void;
  onDetail: () => void;
  onChat: () => void;
}) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-al-200 hover:shadow-lg">
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={propertyThumb(d.propertyType)}
          alt={d.propertyType}
          className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-slate-200"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.avatar} alt={d.customer} className="h-5 w-5 rounded-full object-cover" />
            <p className="truncate text-sm font-semibold text-slate-700">{d.customer}</p>
          </div>
          <p className="text-xs text-slate-400">Đăng {d.createdAt.slice(5)}</p>
        </div>
        <StatusBadge status={d.status} />
      </div>

      <h3 className="mt-3 font-bold leading-snug text-slate-800">
        Cần {d.type.toLowerCase()} {d.propertyType.toLowerCase()}
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-bold text-emerald-600">
          <Icon name="Wallet" className="h-4 w-4" />
          {d.budget}
        </span>
        {mine && (
          <span className="inline-flex items-center gap-1 rounded-lg bg-al-50 px-2 py-1 text-xs font-bold text-al-600">
            <Icon name="MapPinCheck" className="h-3.5 w-3.5" />
            Phù hợp khu vực
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Icon name="MapPin" className="h-3.5 w-3.5" />
          {d.area}
        </span>
        {d.size && (
          <span className="inline-flex items-center gap-1">
            <Icon name="Ruler" className="h-3.5 w-3.5" />
            ~{d.size} m²
          </span>
        )}
        {d.bedrooms && (
          <span className="inline-flex items-center gap-1">
            <Icon name="BedDouble" className="h-3.5 w-3.5" />
            {d.bedrooms} PN
          </span>
        )}
      </div>

      {d.criteria.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {d.criteria.slice(0, 3).map((c) => (
            <span key={c} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
              {c}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
          <Icon name="Users" className="h-3.5 w-3.5" />
          {d.registered} đã nhận
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onDetail}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 transition-colors hover:border-al-300 hover:text-al-600"
          >
            <Icon name="FileText" className="h-4 w-4" />
            Chi tiết
          </button>
          <ActionButton demand={d} state={state} onRegister={onRegister} onChat={onChat} />
        </div>
      </div>
    </article>
  );
}

// -------- Nút hành động theo trạng thái tiếp nhận --------
function ActionButton({
  demand: d,
  state,
  onRegister,
  onChat,
}: {
  demand: OpenDemand;
  state?: RegState;
  onRegister: () => void;
  onChat: () => void;
}) {
  if (d.status === "Đã đóng") {
    return (
      <span className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-sm font-bold text-slate-400">
        <Icon name="Lock" className="h-4 w-4" />
        Đã đóng
      </span>
    );
  }
  if (state === "matched") {
    return (
      <button
        onClick={onChat}
        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-sm font-bold text-white hover:bg-emerald-600"
      >
        <Icon name="MessagesSquare" className="h-4 w-4" />
        Trao đổi
      </button>
    );
  }
  if (state === "queued") {
    return (
      <span className="inline-flex cursor-wait items-center gap-1.5 rounded-xl bg-amber-50 px-3.5 py-2 text-sm font-bold text-amber-600">
        <Icon name="Loader2" className="h-4 w-4 animate-spin" />
        Đang xếp hàng
      </span>
    );
  }
  return (
    <button
      onClick={onRegister}
      className="inline-flex items-center gap-1.5 rounded-xl bg-flame-500 px-3.5 py-2 text-sm font-bold text-white shadow-md shadow-flame-500/30 transition-all hover:-translate-y-0.5 hover:bg-flame-600"
    >
      <Icon name="HeartHandshake" className="h-4 w-4" />
      Nhận tư vấn ngay
    </button>
  );
}

// -------- Hàng trong mục "đang nhận tư vấn" --------
function ReceivingRow({
  demand: d,
  state,
  onDetail,
  onChat,
}: {
  demand: OpenDemand;
  state: RegState;
  onDetail: () => void;
  onChat: () => void;
}) {
  const matched = state === "matched";
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={propertyThumb(d.propertyType)}
        alt={d.propertyType}
        className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-slate-200"
      />
      <div className="min-w-0 flex-1">
        <p className="font-bold text-slate-800">
          Cần {d.type.toLowerCase()} {d.propertyType.toLowerCase()}
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Icon name="User" className="h-3.5 w-3.5" />
            {d.customer}
          </span>
          <span className="text-slate-300">·</span>
          <Icon name="MapPin" className="h-3.5 w-3.5" />
          {d.area}
          <span className="text-slate-300">·</span>
          <Icon name="Wallet" className="h-3.5 w-3.5" />
          {d.budget}
        </p>
      </div>

      {matched ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
          <Icon name="CheckCircle2" className="h-3.5 w-3.5" />
          Khách đã chọn — đang trao đổi
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600">
          <Icon name="Loader2" className="h-3.5 w-3.5 animate-spin" />
          Đang xếp hàng · vị trí #{d.registered + 1}
        </span>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={onDetail}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 hover:border-al-300 hover:text-al-600"
        >
          <Icon name="FileText" className="h-4 w-4" />
          Chi tiết
        </button>
        <button
          onClick={onChat}
          disabled={!matched}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition-colors",
            matched
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "cursor-not-allowed bg-slate-100 text-slate-400"
          )}
        >
          <Icon name="MessagesSquare" className="h-4 w-4" />
          Trao đổi
        </button>
      </div>
    </div>
  );
}

// -------- Modal chi tiết tin đăng --------
function DemandDetailModal({
  demand: d,
  state,
  mine,
  onRegister,
  onChat,
  onClose,
}: {
  demand: OpenDemand;
  state?: RegState;
  mine: boolean;
  onRegister: () => void;
  onChat: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-slate-900/70 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative flex max-h-[92vh] w-full animate-pop-in flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-al-700 via-al-600 to-al-500 px-6 pb-6 pt-6 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-white/80 hover:bg-white/10"
            aria-label="Đóng"
          >
            <Icon name="X" className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={d.avatar}
              alt={d.customer}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-white/40"
            />
            <div>
              <p className="text-sm font-semibold text-white/90">{d.customer}</p>
              <p className="text-xs text-white/60">Đăng ngày {d.createdAt}</p>
            </div>
            <span
              className={cn(
                "ml-auto rounded-full border px-2.5 py-0.5 text-[11px] font-bold text-white",
                d.status === "Đang mở" ? "border-emerald-200 bg-white/15" : "border-white/30 bg-white/10"
              )}
            >
              {d.status}
            </span>
          </div>
          <h2 className="mt-3 text-xl font-bold leading-tight">
            Cần {d.type.toLowerCase()} {d.propertyType.toLowerCase()}
          </h2>
        </div>

        {/* Nội dung */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-2 gap-3">
            <Fact icon="Wallet" label="Ngân sách" value={d.budget} />
            <Fact icon="MapPin" label="Khu vực" value={d.area} />
            {d.size && <Fact icon="Ruler" label="Diện tích" value={`~${d.size} m²`} />}
            {d.bedrooms && <Fact icon="BedDouble" label="Phòng ngủ" value={`${d.bedrooms} PN`} />}
            <Fact icon="Building2" label="Loại BĐS" value={d.propertyType} />
            <Fact icon="Users" label="Đã nhận tư vấn" value={`${d.registered} môi giới`} />
          </div>

          {d.criteria.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-bold text-slate-700">Tiêu chí đặc biệt</p>
              <div className="flex flex-wrap gap-1.5">
                {d.criteria.map((c) => (
                  <span key={c} className="rounded-full bg-al-50 px-2.5 py-1 text-xs font-semibold text-al-700">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {d.note && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-bold text-slate-700">Ghi chú của khách</p>
              <p className="rounded-xl bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-600">
                {d.note}
              </p>
            </div>
          )}

          {/* Mức độ phù hợp với môi giới */}
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <MatchHint
              ok={mine}
              okText="Đúng khu vực bạn đảm nhiệm"
              noText="Ngoài khu vực đảm nhiệm của bạn"
            />
            <MatchHint
              ok={BROKER_ME.specialties.includes(d.propertyType)}
              okText="Đúng chuyên môn của bạn"
              noText="Ngoài chuyên môn chính của bạn"
            />
          </div>
        </div>

        {/* Hành động */}
        <div className="flex items-center gap-2 border-t border-slate-200 bg-white p-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-500 hover:border-slate-300"
          >
            Đóng
          </button>
          <div className="flex-1">
            {d.status === "Đã đóng" ? (
              <span className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-6 py-3 text-sm font-bold text-slate-400">
                <Icon name="Lock" className="h-4 w-4" />
                Tin đã đóng
              </span>
            ) : state === "matched" ? (
              <button
                onClick={onChat}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-600"
              >
                <Icon name="MessagesSquare" className="h-4 w-4" />
                Trao đổi với khách
              </button>
            ) : state === "queued" ? (
              <span className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-50 px-6 py-3 text-sm font-bold text-amber-600">
                <Icon name="Loader2" className="h-4 w-4 animate-spin" />
                Đang xếp hàng chờ khách chọn
              </span>
            ) : (
              <button
                onClick={onRegister}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-flame-500 px-6 py-3 text-sm font-bold text-white shadow-md shadow-flame-500/30 hover:bg-flame-600"
              >
                <Icon name="HeartHandshake" className="h-4 w-4" />
                Nhận tư vấn ngay
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------- Bộ phận nhỏ --------
function StatusBadge({ status }: { status: OpenDemand["status"] }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-bold",
        status === "Đang mở"
          ? "border-emerald-200 bg-emerald-50 text-emerald-600"
          : "border-slate-200 bg-slate-100 text-slate-500"
      )}
    >
      {status}
    </span>
  );
}

function Fact({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <Icon name={icon} className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

function MatchHint({ ok, okText, noText }: { ok: boolean; okText: string; noText: string }) {
  return (
    <p
      className={cn(
        "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold",
        ok ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
      )}
    >
      <Icon name={ok ? "CheckCircle2" : "MinusCircle"} className="h-3.5 w-3.5 shrink-0" />
      {ok ? okText : noText}
    </p>
  );
}

function Select({
  value,
  onChange,
  children,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={placeholder}
      className={cn(
        "rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium focus:border-al-400 focus:outline-none",
        value ? "text-slate-800" : "text-slate-500"
      )}
    >
      {children}
    </select>
  );
}
