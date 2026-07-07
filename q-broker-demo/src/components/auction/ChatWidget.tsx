"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

// Khung chat NỔI cố định góc phải dưới — dùng chung cho cả 2 phía:
// - Khách hàng trao đổi với môi giới đã ghép nối.
// - Môi giới trao đổi với khách sau khi được matching.
// Luôn đính kèm "tin đăng" mà hai bên đang trao đổi (kiểu Shopee).

export interface ChatPost {
  thumb: string;
  title: string;
  budget: string;
}

interface ChatMsg {
  from: "me" | "peer";
  text: string;
}

export function ChatWidget({
  peerName,
  peerAvatar,
  post,
  greeting,
  autoReply = "Cảm ơn bạn, tôi đã ghi nhận và sẽ phản hồi sớm nhất nhé! 🏡",
  onClose,
}: {
  peerName: string;
  peerAvatar: string;
  post: ChatPost;
  greeting: string;
  autoReply?: string;
  onClose: () => void;
}) {
  const [minimized, setMinimized] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([{ from: "peer", text: greeting }]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!minimized) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, minimized]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMsgs((m) => [...m, { from: "me", text }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "peer", text: autoReply }]);
    }, 900);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-[min(92vw,22rem)] animate-pop-in flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-al-700 to-al-600 px-4 py-3 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={peerAvatar}
          alt={peerName}
          className="h-9 w-9 rounded-full object-cover ring-2 ring-white/30"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{peerName}</p>
          <p className="flex items-center gap-1 text-xs text-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Đang hoạt động
          </p>
        </div>
        <button
          onClick={() => setMinimized((v) => !v)}
          aria-label={minimized ? "Mở rộng" : "Thu gọn"}
          className="rounded-lg p-1.5 text-white/80 hover:bg-white/10"
        >
          <Icon name={minimized ? "ChevronUp" : "Minus"} className="h-4 w-4" />
        </button>
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="rounded-lg p-1.5 text-white/80 hover:bg-white/10"
        >
          <Icon name="X" className="h-4 w-4" />
        </button>
      </div>

      {!minimized && (
        <>
          {/* Tin đăng đính kèm — 2 bên đang trao đổi */}
          <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-3 py-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.thumb}
              alt={post.title}
              className="h-12 w-12 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {post.title}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-sm font-bold text-flame-600">
                <Icon name="Wallet" className="h-3.5 w-3.5" />
                {post.budget}
              </p>
            </div>
            <span className="shrink-0 self-start rounded-md bg-al-50 px-2 py-0.5 text-[10px] font-bold text-al-600">
              Đang trao đổi
            </span>
          </div>

          {/* Tin nhắn */}
          <div className="max-h-72 space-y-3 overflow-y-auto bg-slate-50 p-4">
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
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-flame-500 text-white transition-colors hover:bg-flame-600"
            >
              <Icon name="Send" className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
