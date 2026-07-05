"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

// =============================================================
// Chatbot AI nổi "AUTOMATION LAND"
// - Icon tròn hình bánh răng (xoay chậm) + chữ AUTOMATION LAND ở giữa.
// - Kéo-thả di chuyển được quanh màn hình.
// - Bấm (không kéo) -> mở/đóng khung chat với AI (demo: trả lời mẫu).
// =============================================================

type Msg = { role: "ai" | "user"; text: string };

const SIZE = 58; // đường kính icon (px)

const GREETING: Msg = {
  role: "ai",
  text: "Xin chào 👋 Tôi là trợ lý AI của AUTOMATION LAND. Tôi có thể giúp bạn tìm bất động sản, giải đáp về môi giới, ký hợp đồng online... Bạn cần hỗ trợ gì?",
};

// Trả lời mẫu đơn giản theo từ khoá (demo, chưa nối API thật).
function botReply(input: string): string {
  const t = input.toLowerCase();
  if (t.includes("giá") || t.includes("bao nhiêu"))
    return "Giá từng sản phẩm hiển thị ngay trên thẻ tin. Bạn cho mình biết khu vực và tầm giá mong muốn để mình gợi ý nhé!";
  if (t.includes("thuê"))
    return "Bạn muốn thuê ở khu vực nào? Mình có thể lọc các sản phẩm cho thuê phù hợp cho bạn.";
  if (t.includes("môi giới") || t.includes("tư vấn"))
    return "Mình sẽ kết nối bạn với môi giới uy tín trong khu vực. Bạn để lại số điện thoại, môi giới sẽ liên hệ ngay.";
  if (t.includes("hợp đồng"))
    return "Q-Broker hỗ trợ ký hợp đồng online có giá trị pháp lý. Bạn muốn mình hướng dẫn quy trình ký chứ?";
  if (t.includes("chào") || t.includes("hi") || t.includes("hello"))
    return "Chào bạn! Mình luôn sẵn sàng hỗ trợ 24/7 😊";
  return "Cảm ơn bạn! Mình đã ghi nhận. Đội ngũ AUTOMATION LAND sẽ hỗ trợ bạn chi tiết hơn. Bạn cần hỏi thêm gì không?";
}

export function AiChatWidget() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");

  const drag = useRef({ dragging: false, moved: false, dx: 0, dy: 0 });
  const listRef = useRef<HTMLDivElement>(null);

  // Vị trí ban đầu: góc dưới bên phải (nằm trên nút "Về demo").
  useEffect(() => {
    setPos({
      x: window.innerWidth - SIZE - 24,
      y: window.innerHeight - SIZE - 96,
    });
  }, []);

  // Luôn cuộn xuống tin nhắn mới nhất.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  const clamp = (x: number, y: number) => ({
    x: Math.min(window.innerWidth - SIZE - 8, Math.max(8, x)),
    y: Math.min(window.innerHeight - SIZE - 8, Math.max(8, y)),
  });

  const onPointerDown = (e: React.PointerEvent) => {
    if (!pos) return;
    drag.current = {
      dragging: true,
      moved: false,
      dx: e.clientX - pos.x,
      dy: e.clientY - pos.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.dragging) return;
    const nx = e.clientX - drag.current.dx;
    const ny = e.clientY - drag.current.dy;
    if (Math.abs(e.movementX) + Math.abs(e.movementY) > 0) drag.current.moved = true;
    setPos(clamp(nx, ny));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current.dragging) return;
    drag.current.dragging = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    // Không kéo -> coi như click -> mở/đóng chat.
    if (!drag.current.moved) setOpen((v) => !v);
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: botReply(text) }]);
    }, 500);
  };

  if (!pos) return null;

  // Hướng mở khung chat tuỳ vị trí icon để không tràn màn hình.
  const openUp = pos.y > window.innerHeight / 2;
  const openLeft = pos.x > window.innerWidth / 2;

  return (
    <div className="fixed z-[70]" style={{ left: pos.x, top: pos.y }}>
      {/* Khung chat */}
      {open && (
        <div
          className={
            "absolute flex h-[26rem] w-80 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl " +
            (openUp ? "bottom-[86px] " : "top-[86px] ") +
            (openLeft ? "right-0" : "left-0")
          }
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-brand-700 to-brand-500 px-4 py-3 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <Icon name="Bot" className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">Trợ lý AI</p>
              <p className="truncate text-[0.7rem] text-white/80">AUTOMATION LAND</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 hover:bg-white/20"
              aria-label="Đóng"
            >
              <Icon name="X" className="h-4 w-4" />
            </button>
          </div>

          {/* Danh sách tin nhắn */}
          <div
            ref={listRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-slate-50 p-3"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={
                    "max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm " +
                    (m.role === "user"
                      ? "rounded-br-sm bg-brand-600 text-white"
                      : "rounded-bl-sm bg-white text-slate-700 shadow-sm")
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Ô nhập */}
          <div className="flex items-center gap-2 border-t border-slate-200 bg-white p-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Nhập tin nhắn..."
              className="flex-1 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="button"
              onClick={send}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white hover:bg-brand-700"
              aria-label="Gửi"
            >
              <Icon name="Send" className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Icon nổi (bánh răng + chữ AUTOMATION LAND) */}
      <button
        type="button"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ width: SIZE, height: SIZE }}
        className="relative flex touch-none select-none items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 shadow-xl ring-4 ring-white/60 transition-transform hover:scale-105 active:scale-95"
        aria-label="Mở chat AI AUTOMATION LAND"
        title="Chat với AI AUTOMATION LAND"
      >
        {/* Bánh răng xoay chậm làm nền (màu xám) */}
        <Icon
          name="Cog"
          className="pointer-events-none absolute inset-0 m-auto h-full w-full p-0.5 text-slate-400/60"
          style={{ animation: "spin 8s linear infinite" }}
        />
        {/* Chữ ở giữa (màu xanh dương) */}
        <span className="pointer-events-none relative px-1 text-center text-[0.45rem] font-extrabold uppercase leading-[1.1] tracking-tight text-blue-600">
          Automation Land
        </span>
        {/* Chấm báo "online" */}
        <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
      </button>
    </div>
  );
}
