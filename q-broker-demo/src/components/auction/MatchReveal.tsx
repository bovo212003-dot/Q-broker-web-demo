"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { AuctionBroker, DemandDraft, matchScore } from "@/data/auction";
import { cn } from "@/lib/utils";

// BƯỚC 4 — Ghép nối thông minh: chấm Matching Score các môi giới đã chọn,
// công bố 1 người phù hợp nhất, mở phòng chat & chia sẻ liên hệ (mock).

const COMPUTE_MS = 2600; // thời gian "AI chấm điểm" trước khi công bố

export function MatchReveal({
  draft,
  liked,
  onRetry,
  onUseAll,
  onFinish,
}: {
  draft: DemandDraft;
  liked: AuctionBroker[];
  onRetry: () => void;
  onUseAll: () => void;
  onFinish: () => void;
}) {
  // Không chọn ai -> mời quẹt lại hoặc để hệ thống tự chọn.
  if (liked.length === 0) {
    return (
      <div className="mx-auto max-w-md animate-fade-up rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Icon name="HeartOff" className="h-8 w-8" />
        </span>
        <h2 className="mt-4 text-xl font-bold text-al-700">
          Bạn chưa chọn môi giới nào
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Quẹt lại để chọn, hoặc để hệ thống tự ghép nối từ tất cả môi giới đã
          tham gia phiên.
        </p>
        <div className="mt-6 grid gap-3">
          <button
            onClick={onRetry}
            className="rounded-2xl bg-al-600 py-3.5 font-bold text-white transition-colors hover:bg-al-700"
          >
            Quẹt lại
          </button>
          <button
            onClick={onUseAll}
            className="rounded-2xl border border-slate-200 py-3.5 font-bold text-slate-600 transition-colors hover:border-al-300 hover:text-al-600"
          >
            Để AI chọn giúp tôi
          </button>
        </div>
      </div>
    );
  }

  return <Matching draft={draft} liked={liked} onFinish={onFinish} />;
}

// -------- Pha chấm điểm + công bố --------
function Matching({
  draft,
  liked,
  onFinish,
}: {
  draft: DemandDraft;
  liked: AuctionBroker[];
  onFinish: () => void;
}) {
  const [filled, setFilled] = useState(false); // chạy animation thanh điểm
  const [revealed, setRevealed] = useState(false);
  const ranked = [...liked].sort((a, b) => matchScore(b) - matchScore(a));
  const winner = ranked[0];

  useEffect(() => {
    const t1 = setTimeout(() => setFilled(true), 150);
    const t2 = setTimeout(() => setRevealed(true), COMPUTE_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!revealed) {
    return (
      <div className="mx-auto max-w-xl animate-fade-up rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-al-50 text-al-600">
            <Icon name="Bot" className="h-6 w-6 animate-float" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-al-700">
              AI đang ghép nối...
            </h2>
            <p className="text-sm text-slate-500">
              Chấm điểm phù hợp theo uy tín, tín nhiệm, phản hồi & kinh nghiệm
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {ranked.map((b, i) => {
            const score = matchScore(b);
            return (
              <div key={b.id} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.avatar}
                  alt={b.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-700">
                    {b.name}
                  </p>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-al-500 to-flame-500"
                      style={{
                        width: filled ? `${score}%` : "0%",
                        transition: `width 1.6s ease ${i * 0.25}s`,
                      }}
                    />
                  </div>
                </div>
                <span className="w-9 shrink-0 text-right font-mono text-sm font-bold text-al-700">
                  {score}
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
          <Icon name="Loader2" className="h-3.5 w-3.5 animate-spin" />
          Không dựa trên trả giá — chỉ dựa trên năng lực phục vụ bạn tốt nhất
        </p>
      </div>
    );
  }

  return <Winner draft={draft} winner={winner} onFinish={onFinish} />;
}

// -------- Công bố người thắng + phòng chat --------
const MATCH_REASONS = [
  "Khu vực hoạt động trùng khu vực bạn cần",
  "Chuyên môn đúng loại bất động sản",
  "Điểm uy tín & tín nhiệm hàng đầu phiên",
  "Tốc độ phản hồi nhanh, tỷ lệ hoàn thành cao",
];

function Winner({
  draft,
  winner,
  onFinish,
}: {
  draft: DemandDraft;
  winner: AuctionBroker;
  onFinish: () => void;
}) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="mx-auto max-w-xl animate-pop-in">
      {/* Thẻ người thắng */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-al-700 via-al-600 to-al-500 text-white shadow-xl">
        <div className="p-6 text-center sm:p-8">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-flame-500 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
            <Icon name="Sparkles" className="h-3.5 w-3.5" />
            Ghép nối thành công
          </p>

          <div className="relative mx-auto mt-6 w-fit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={winner.avatar}
              alt={winner.name}
              className="h-28 w-28 rounded-full object-cover ring-4 ring-white/40"
            />
            <span className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-al-600 bg-flame-500 font-mono text-sm font-black">
              {matchScore(winner)}
            </span>
          </div>

          <h2 className="mt-4 flex items-center justify-center gap-2 text-2xl font-bold">
            {winner.name}
            <Icon name="BadgeCheck" className="h-6 w-6 text-sky-300" />
          </h2>
          <p className="mt-1 text-sm text-white/75">
            {winner.area} · {winner.years} năm KN · {winner.deals} giao dịch ·{" "}
            <Icon name="Star" className="inline h-3.5 w-3.5 fill-amber-300 text-amber-300" />{" "}
            {winner.rating}
          </p>

          {/* Liên hệ chỉ mở sau ghép nối */}
          <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 backdrop-blur">
            <Icon name="Phone" className="h-4 w-4 text-flame-400" />
            <span className="font-mono text-lg font-bold tracking-wider">
              0901 234 567
            </span>
            <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[11px] font-bold text-emerald-200">
              Đã mở khoá
            </span>
          </div>

          {/* Lý do ghép nối */}
          <div className="mt-5 grid gap-2 text-left sm:grid-cols-2">
            {MATCH_REASONS.map((r) => (
              <p key={r} className="flex items-start gap-2 text-xs text-white/85">
                <Icon
                  name="CheckCircle2"
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300"
                />
                {r}
              </p>
            ))}
          </div>

          {/* Hành động */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => setChatOpen((v) => !v)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-flame-500 py-3.5 font-bold shadow-lg shadow-flame-900/30 transition-all hover:-translate-y-0.5 hover:bg-flame-600"
            >
              <Icon name="MessagesSquare" className="h-5 w-5" />
              {chatOpen ? "Đóng phòng chat" : "Nhắn tin ngay"}
            </button>
            <button className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 py-3.5 font-bold backdrop-blur transition-colors hover:bg-white/20">
              <Icon name="CalendarDays" className="h-5 w-5" />
              Đặt lịch xem nhà
            </button>
          </div>
        </div>
      </div>

      {/* Phòng chat demo */}
      {chatOpen && <ChatRoom draft={draft} broker={winner} />}

      <div className="mt-5 text-center">
        <button
          onClick={onFinish}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-al-600"
        >
          <Icon name="RotateCcw" className="h-4 w-4" />
          Hoàn tất — về trang Cần thuê - Mua
        </button>
        <p className="mt-2 text-xs text-slate-400">
          Sau khi kết thúc tư vấn, hai bên có thể đánh giá lẫn nhau — điểm uy
          tín & tín nhiệm sẽ được cập nhật.
        </p>
      </div>
    </div>
  );
}

// -------- Phòng chat (mock) --------
interface ChatMsg {
  from: "me" | "broker";
  text: string;
}

function ChatRoom({
  draft,
  broker,
}: {
  draft: DemandDraft;
  broker: AuctionBroker;
}) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    {
      from: "broker",
      text: `Chào anh/chị! Tôi là ${broker.name}. Tôi đã xem nhu cầu ${draft.type.toLowerCase()} ${draft.propertyType.toLowerCase()} tại ${draft.area} (ngân sách ${draft.budget}). Tôi có vài sản phẩm rất khớp, anh/chị muốn xem trước hình ảnh hay đặt lịch đi xem trực tiếp ạ?`,
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMsgs((m) => [...m, { from: "me", text }]);
    setInput("");
    // Môi giới trả lời tự động (demo)
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          from: "broker",
          text: "Dạ vâng, tôi ghi nhận rồi ạ! Trong hôm nay tôi sẽ gửi anh/chị danh sách 3-5 sản phẩm phù hợp kèm pháp lý đầy đủ nhé. 🏡",
        },
      ]);
    }, 900);
  };

  return (
    <div className="mt-4 animate-pop-in overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
      {/* Header chat */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={broker.avatar}
          alt={broker.name}
          className="h-9 w-9 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-800">{broker.name}</p>
          <p className="flex items-center gap-1 text-xs text-emerald-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Đang hoạt động
          </p>
        </div>
        <Icon name="Phone" className="h-4 w-4 text-slate-400" />
      </div>

      {/* Tin nhắn */}
      <div className="max-h-64 space-y-3 overflow-y-auto bg-slate-50 p-4">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}
          >
            <p
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.from === "me"
                  ? "rounded-br-md bg-al-600 text-white"
                  : "rounded-bl-md bg-white text-slate-700 shadow-sm"
              )}
            >
              {m.text}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Ô nhập */}
      <div className="flex items-center gap-2 border-t border-slate-100 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Nhập tin nhắn..."
          className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
        <button
          onClick={send}
          aria-label="Gửi"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-flame-500 text-white transition-colors hover:bg-flame-600"
        >
          <Icon name="Send" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
