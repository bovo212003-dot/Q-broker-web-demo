"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  CONVERSATIONS,
  getThread,
  randomReply,
  type ChatMessage,
  type Conversation,
} from "@/data/messages";

// =============================================================
// TIN NHẮN — trang chat đầy đủ (/realtor/tin-nhan).
// Bố cục 2 cột kiểu Messenger/Zalo:
//   - Trái: danh sách hội thoại (tìm kiếm được), badge chưa đọc.
//   - Phải: cửa sổ trò chuyện với bong bóng tin + ô soạn tin.
// Trên mobile: hiện 1 trong 2 cột (danh sách HOẶC khung chat) và có
// nút quay lại. Gửi tin là thao tác demo (state cục bộ) — đối phương
// tự động "trả lời" sau ~1,2s (fake auto-reply) kèm hiệu ứng đang soạn.
// initialId: hội thoại mở sẵn (từ ?c= / ?f= trên URL).
// extraConv: hội thoại dựng từ mạng kết bạn (nút "Nhắn tin"), chưa nằm
//   trong danh sách mặc định -> được ghép thêm vào đầu danh sách.
// =============================================================

const REPLY_DELAY = 1200; // ms — độ trễ giả lập đối phương trả lời

/** Dòng preview trong danh sách hội thoại theo loại tin. */
function previewText(m: ChatMessage): string {
  if (m.kind === "image") return "🖼️ Hình ảnh";
  if (m.kind === "voice") return "🎤 Tin nhắn thoại";
  return m.text;
}

export function MessagesView({
  initialId,
  extraConv,
}: {
  initialId?: string;
  extraConv?: Conversation;
}) {
  // Danh sách hội thoại làm việc: ghép extraConv (nếu chưa có) lên đầu.
  const baseConvs = useMemo<Conversation[]>(() => {
    if (extraConv && !CONVERSATIONS.some((c) => c.id === extraConv.id)) {
      return [extraConv, ...CONVERSATIONS];
    }
    return CONVERSATIONS;
  }, [extraConv]);

  const [query, setQuery] = useState("");
  // Chọn hội thoại hợp lệ ban đầu: theo initialId nếu có, không thì cái đầu.
  const [activeId, setActiveId] = useState<string>(() => {
    const valid = baseConvs.some((c) => c.id === initialId);
    return valid ? (initialId as string) : baseConvs[0]?.id ?? "";
  });
  // Trên mobile: đã mở một hội thoại chưa (để chuyển giữa 2 cột).
  const [mobileChat, setMobileChat] = useState<boolean>(() =>
    baseConvs.some((c) => c.id === initialId)
  );

  // Luồng tin theo hội thoại — state cục bộ để "gửi" thêm được.
  const [threads, setThreads] = useState<Record<string, ChatMessage[]>>(() =>
    Object.fromEntries(baseConvs.map((c) => [c.id, getThread(c.id)]))
  );
  // Đánh dấu đã đọc cục bộ (mở hội thoại -> hết chấm chưa đọc).
  const [read, setRead] = useState<Record<string, boolean>>({});
  // Hội thoại nào đối phương đang "soạn tin" (hiệu ứng ba chấm).
  const [typing, setTyping] = useState<Record<string, boolean>>({});
  // Thứ tự hiển thị danh sách — hội thoại vừa có tin nhảy lên đầu.
  const [order, setOrder] = useState<string[]>(() => baseConvs.map((c) => c.id));
  const bump = (id: string) =>
    setOrder((prev) => [id, ...prev.filter((x) => x !== id)]);
  // Gom các timer để dọn khi unmount.
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Danh sách đã "trang trí": tin cuối + giờ lấy động từ luồng chat hiện
  // tại (cập nhật ngay khi gửi/nhận), sắp theo thứ tự hoạt động gần nhất.
  const q = query.trim().toLowerCase();
  const decorated = useMemo(() => {
    const byId = new Map(baseConvs.map((c) => [c.id, c]));
    return order
      .map((id) => byId.get(id))
      .filter((c): c is Conversation => !!c)
      .map((c) => {
        const th = threads[c.id];
        const lastMsg = th && th.length ? th[th.length - 1] : undefined;
        return {
          conv: c,
          last: lastMsg ? previewText(lastMsg) : c.last,
          time: lastMsg ? lastMsg.time : c.time,
          fromMe: lastMsg ? lastMsg.fromMe : c.fromMe,
          unread: c.unread && !read[c.id],
        };
      });
  }, [order, baseConvs, threads, read]);

  const list = useMemo(
    () =>
      decorated.filter(
        (d) =>
          !q ||
          d.conv.name.toLowerCase().includes(q) ||
          d.last.toLowerCase().includes(q)
      ),
    [decorated, q]
  );

  const active = baseConvs.find((c) => c.id === activeId);
  const activeThread = threads[activeId] ?? [];

  const openConversation = (id: string) => {
    setActiveId(id);
    setRead((prev) => ({ ...prev, [id]: true }));
    setMobileChat(true);
  };

  const nowTime = () =>
    new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  // Thêm một tin vào luồng + đẩy hội thoại lên đầu danh sách.
  const pushMessage = (id: string, msg: ChatMessage) => {
    setThreads((prev) => ({ ...prev, [id]: [...(prev[id] ?? []), msg] }));
    bump(id);
  };

  // Fake: đối phương hiện "đang soạn tin" rồi trả lời sau REPLY_DELAY.
  // reply: nội dung trả lời tuỳ biến (mặc định là câu chữ ngẫu nhiên).
  const scheduleReply = (id: string, reply?: Partial<ChatMessage>) => {
    setTyping((prev) => ({ ...prev, [id]: true }));
    const t = setTimeout(() => {
      pushMessage(id, {
        id: `${id}-${Date.now()}-r`,
        fromMe: false,
        text: randomReply(),
        time: nowTime(),
        ...reply,
      });
      setTyping((prev) => ({ ...prev, [id]: false }));
    }, REPLY_DELAY);
    timers.current.push(t);
  };

  const sendMessage = (text: string) => {
    const body = text.trim();
    if (!body || !activeId) return;
    const id = activeId;
    pushMessage(id, {
      id: `${id}-${Date.now()}`,
      fromMe: true,
      text: body,
      time: nowTime(),
    });
    scheduleReply(id);
  };

  // Gửi ảnh (data URL từ trình chọn file). Đối phương vẫn "trả lời".
  const sendImage = (dataUrl: string) => {
    if (!activeId) return;
    const id = activeId;
    pushMessage(id, {
      id: `${id}-${Date.now()}`,
      fromMe: true,
      text: "",
      time: nowTime(),
      kind: "image",
      image: dataUrl,
    });
    scheduleReply(id);
  };

  // Gửi tin nhắn thoại (ghi âm mô phỏng, chỉ lưu độ dài giây).
  const sendVoice = (seconds: number) => {
    if (!activeId || seconds <= 0) return;
    const id = activeId;
    pushMessage(id, {
      id: `${id}-${Date.now()}`,
      fromMe: true,
      text: "",
      time: nowTime(),
      kind: "voice",
      duration: seconds,
    });
    scheduleReply(id);
  };

  // Thả tim/like nhanh (nút 👍). Đối phương "thả tim" lại.
  const sendLike = () => {
    if (!activeId) return;
    const id = activeId;
    pushMessage(id, {
      id: `${id}-${Date.now()}`,
      fromMe: true,
      text: "👍",
      time: nowTime(),
      kind: "like",
    });
    scheduleReply(id, { kind: "like", text: "👍" });
  };

  return (
    <div className="mx-auto max-w-6xl px-0 sm:px-4 sm:py-6">
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden border-y border-slate-200 bg-white sm:h-[calc(100vh-7rem)] sm:rounded-2xl sm:border sm:shadow-sm">
        {/* Cột trái: danh sách hội thoại */}
        <aside
          className={
            "flex w-full flex-col border-r border-slate-200 sm:w-80 sm:shrink-0 " +
            (mobileChat ? "hidden sm:flex" : "flex")
          }
        >
          <div className="border-b border-slate-100 px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold text-realtor-ink">Tin nhắn</h1>
              <button
                type="button"
                title="Viết tin nhắn"
                className="flex h-9 w-9 items-center justify-center rounded-full text-realtor-500 hover:bg-realtor-50"
              >
                <Icon name="PenSquare" className="h-5 w-5" />
              </button>
            </div>
            <div className="relative mt-3">
              <Icon
                name="Search"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm hội thoại..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-colors focus:border-realtor-400 focus:bg-white focus:ring-2 focus:ring-realtor-100"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {list.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-slate-400">
                Không tìm thấy hội thoại nào.
              </p>
            ) : (
              list.map((d) => (
                <ConversationRow
                  key={d.conv.id}
                  conv={d.conv}
                  last={d.last}
                  time={d.time}
                  fromMe={d.fromMe}
                  active={d.conv.id === activeId}
                  unread={d.unread}
                  onClick={() => openConversation(d.conv.id)}
                />
              ))
            )}
          </div>
        </aside>

        {/* Cột phải: khung chat */}
        <section
          className={
            "min-w-0 flex-1 flex-col " +
            (mobileChat ? "flex" : "hidden sm:flex")
          }
        >
          {active ? (
            <ChatWindow
              conv={active}
              thread={activeThread}
              typing={!!typing[activeId]}
              onBack={() => setMobileChat(false)}
              onSend={sendMessage}
              onSendImage={sendImage}
              onSendVoice={sendVoice}
              onSendLike={sendLike}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-realtor-50 text-realtor-500">
                <Icon name="MessageCircle" className="h-8 w-8" />
              </span>
              <p className="text-sm text-slate-500">
                Chọn một hội thoại để bắt đầu nhắn tin.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/** Một dòng trong danh sách hội thoại bên trái. Tin cuối/giờ nhận từ
 *  ngoài (đã tính động theo luồng chat) nên cập nhật ngay khi nhắn. */
function ConversationRow({
  conv,
  last,
  time,
  fromMe,
  active,
  unread,
  onClick,
}: {
  conv: Conversation;
  last: string;
  time: string;
  fromMe?: boolean;
  active: boolean;
  unread: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "flex w-full items-center gap-3 border-b border-slate-50 px-4 py-3 text-left transition-colors " +
        (active ? "bg-realtor-50/60" : unread ? "bg-realtor-50/30 hover:bg-slate-50" : "hover:bg-slate-50")
      }
    >
      <Avatar conv={conv} />
      <div className="min-w-0 flex-1">
        <p
          className={
            "truncate text-sm " +
            (unread ? "font-bold text-slate-900" : "font-semibold text-slate-800")
          }
        >
          {conv.name}
        </p>
        <p
          className={
            "truncate text-xs " +
            (unread ? "text-slate-600" : "text-slate-400")
          }
        >
          {last
            ? `${fromMe ? "Bạn: " : ""}${last}`
            : conv.role ?? "Bắt đầu trò chuyện"}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-[11px] text-slate-400">{time}</span>
        {unread && <span className="h-2.5 w-2.5 rounded-full bg-realtor-500" />}
      </div>
    </button>
  );
}

/** Khung trò chuyện bên phải: header + danh sách bong bóng + ô nhập. */
function ChatWindow({
  conv,
  thread,
  typing,
  onBack,
  onSend,
  onSendImage,
  onSendVoice,
  onSendLike,
}: {
  conv: Conversation;
  thread: ChatMessage[];
  typing: boolean;
  onBack: () => void;
  onSend: (text: string) => void;
  onSendImage: (dataUrl: string) => void;
  onSendVoice: (seconds: number) => void;
  onSendLike: () => void;
}) {
  const [input, setInput] = useState("");
  const [moreOpen, setMoreOpen] = useState(false); // menu nút "+"
  const [recording, setRecording] = useState(false); // đang ghi âm
  const [seconds, setSeconds] = useState(0); // đồng hồ ghi âm
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cuộn xuống cuối mỗi khi đổi hội thoại, có tin mới, hoặc đối phương gõ.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [thread, typing, conv.id]);

  // Dọn bộ đếm ghi âm khi rời khung.
  useEffect(() => () => {
    if (recTimer.current) clearInterval(recTimer.current);
  }, []);

  const submit = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  // Ảnh: đọc file thành data URL rồi gửi.
  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // cho phép chọn lại cùng ảnh
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onSendImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  // Ghi âm: bắt đầu đếm giây.
  const startRec = () => {
    setRecording(true);
    setSeconds(0);
    recTimer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };
  const stopRec = (send: boolean) => {
    if (recTimer.current) clearInterval(recTimer.current);
    recTimer.current = null;
    setRecording(false);
    if (send) onSendVoice(seconds);
    setSeconds(0);
  };

  const hasText = input.trim().length > 0;

  return (
    <>
      {/* Header hội thoại */}
      <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="-ml-1 rounded-full p-1.5 text-slate-500 hover:bg-slate-100 sm:hidden"
          aria-label="Quay lại danh sách"
        >
          <Icon name="ArrowLeft" className="h-5 w-5" />
        </button>
        <Avatar conv={conv} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-realtor-ink">{conv.name}</p>
          <p className="truncate text-xs text-slate-400">
            {conv.online ? (
              <span className="text-emerald-500">● Đang hoạt động</span>
            ) : (
              conv.role ?? "Ngoại tuyến"
            )}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-slate-500">
          <button type="button" title="Gọi thoại" className="rounded-full p-2 hover:bg-slate-100">
            <Icon name="Phone" className="h-5 w-5" />
          </button>
          <button type="button" title="Gọi video" className="rounded-full p-2 hover:bg-slate-100">
            <Icon name="Video" className="h-5 w-5" />
          </button>
          <button type="button" title="Thông tin" className="rounded-full p-2 hover:bg-slate-100">
            <Icon name="Info" className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Danh sách tin nhắn */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-5">
        {thread.length === 0 && !typing ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <Avatar conv={conv} />
            <p className="mt-1 text-sm font-semibold text-slate-600">{conv.name}</p>
            <p className="max-w-xs text-xs text-slate-400">
              Chưa có tin nhắn nào. Gửi lời chào để bắt đầu cuộc trò chuyện nhé!
            </p>
          </div>
        ) : (
          <>
            {thread.map((m) => (
              <MessageBubble key={m.id} msg={m} conv={conv} />
            ))}
            {typing && <TypingBubble conv={conv} />}
          </>
        )}
      </div>

      {/* Ô soạn tin kiểu Messenger */}
      <div className="border-t border-slate-200 px-3 py-3">
        {recording ? (
          /* Thanh ghi âm */
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => stopRec(false)}
              title="Huỷ"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
            >
              <Icon name="Trash2" className="h-5 w-5" />
            </button>
            <div className="flex flex-1 items-center gap-2 rounded-full bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-600">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-rose-500" />
              Đang ghi âm... {fmtDuration(seconds)}
            </div>
            <button
              type="button"
              onClick={() => stopRec(true)}
              title="Gửi"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-realtor-500 text-white hover:bg-realtor-600"
            >
              <Icon name="Send" className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            {/* Nút "+" với menu thêm */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                title="Thêm"
                className={
                  "flex h-9 w-9 items-center justify-center rounded-full transition-colors " +
                  (moreOpen
                    ? "bg-realtor-50 text-realtor-500"
                    : "text-realtor-500 hover:bg-realtor-50")
                }
              >
                <Icon name={moreOpen ? "X" : "Plus"} className="h-5 w-5" />
              </button>
              {moreOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMoreOpen(false)} />
                  <div className="absolute bottom-full left-0 z-20 mb-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                    <MoreItem
                      icon="File"
                      label="Gửi tệp"
                      onClick={() => {
                        setMoreOpen(false);
                        onSend("📎 Đã gửi một tệp đính kèm");
                      }}
                    />
                    <MoreItem
                      icon="MapPin"
                      label="Vị trí"
                      onClick={() => {
                        setMoreOpen(false);
                        onSend("📍 Đã chia sẻ vị trí");
                      }}
                    />
                    <MoreItem
                      icon="Sticker"
                      label="Nhãn dán"
                      onClick={() => {
                        setMoreOpen(false);
                        onSend("😄");
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Nút gửi hình ảnh */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              title="Gửi hình ảnh"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-realtor-500 hover:bg-realtor-50"
            >
              <Icon name="Image" className="h-5 w-5" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPickFile}
            />

            {/* Nút ghi âm */}
            <button
              type="button"
              onClick={startRec}
              title="Ghi âm"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-realtor-500 hover:bg-realtor-50"
            >
              <Icon name="Mic" className="h-5 w-5" />
            </button>

            {/* Ô nhập */}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Aa"
              className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-realtor-400 focus:bg-white focus:ring-2 focus:ring-realtor-100"
            />

            {/* Có chữ -> nút Gửi; trống -> nút Like 👍 */}
            {hasText ? (
              <button
                type="button"
                onClick={submit}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-realtor-500 text-white transition-colors hover:bg-realtor-600"
                aria-label="Gửi"
              >
                <Icon name="Send" className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSendLike}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-realtor-500 transition-transform hover:scale-110 hover:bg-realtor-50 active:scale-95"
                aria-label="Thả tim"
                title="Thích"
              >
                <Icon name="ThumbsUp" className="h-6 w-6" />
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

/** Một mục trong menu "+". */
function MoreItem({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-realtor-500"
    >
      <Icon name={icon} className="h-4 w-4 shrink-0" />
      {label}
    </button>
  );
}

/** Định dạng giây -> m:ss cho tin thoại. */
function fmtDuration(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Một bong bóng tin nhắn (căn phải nếu là tin của mình). Hỗ trợ
 *  các loại: chữ, hình ảnh, tin thoại, thả tim/like. */
function MessageBubble({ msg, conv }: { msg: ChatMessage; conv: Conversation }) {
  const mine = msg.fromMe;

  // Nội dung bong bóng theo loại tin.
  let body: React.ReactNode;
  if (msg.kind === "like") {
    // Thả tim/like: emoji lớn, không nền bong bóng.
    body = <span className="text-4xl leading-none">{msg.text || "👍"}</span>;
  } else if (msg.kind === "image" && msg.image) {
    body = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={msg.image}
        alt="Hình ảnh"
        className="max-h-64 w-auto rounded-2xl object-cover ring-1 ring-slate-200"
      />
    );
  } else if (msg.kind === "voice") {
    body = <VoiceBubble mine={mine} seconds={msg.duration ?? 0} />;
  } else {
    body = (
      <div
        className={
          "rounded-2xl px-4 py-2 text-sm " +
          (mine
            ? "rounded-br-md bg-realtor-500 text-white"
            : "rounded-bl-md bg-white text-slate-700 shadow-sm ring-1 ring-slate-100")
        }
      >
        {msg.text}
      </div>
    );
  }

  return (
    <div className={"flex items-end gap-2 " + (mine ? "justify-end" : "justify-start")}>
      {!mine && <Avatar conv={conv} small />}
      <div className="flex max-w-[75%] flex-col">
        {body}
        <p
          className={
            "mt-1 text-[11px] text-slate-400 " + (mine ? "pr-1 text-right" : "pl-1")
          }
        >
          {msg.time}
        </p>
      </div>
    </div>
  );
}

/** Bong bóng tin nhắn thoại: nút play + sóng âm giả + thời lượng. */
function VoiceBubble({ mine, seconds }: { mine: boolean; seconds: number }) {
  return (
    <div
      className={
        "flex items-center gap-2.5 rounded-2xl px-3 py-2.5 " +
        (mine
          ? "rounded-br-md bg-realtor-500 text-white"
          : "rounded-bl-md bg-white text-slate-700 shadow-sm ring-1 ring-slate-100")
      }
    >
      <span
        className={
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full " +
          (mine ? "bg-white/20 text-white" : "bg-realtor-50 text-realtor-500")
        }
      >
        <Icon name="Play" className="h-4 w-4" />
      </span>
      {/* Sóng âm tĩnh (trang trí) */}
      <span className="flex items-center gap-0.5">
        {[6, 12, 9, 16, 8, 13, 7, 11, 5, 14, 8, 10].map((h, i) => (
          <span
            key={i}
            className={"w-0.5 rounded-full " + (mine ? "bg-white/70" : "bg-realtor-300")}
            style={{ height: `${h}px` }}
          />
        ))}
      </span>
      <span className={"text-xs font-semibold " + (mine ? "text-white/90" : "text-slate-500")}>
        {fmtDuration(seconds)}
      </span>
    </div>
  );
}

/** Bong bóng "đang soạn tin" — ba chấm nhấp nháy. */
function TypingBubble({ conv }: { conv: Conversation }) {
  return (
    <div className="flex items-end justify-start gap-2">
      <Avatar conv={conv} small />
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
      </div>
    </div>
  );
}

/** Avatar chữ cái đầu + chấm online, màu theo hội thoại. */
function Avatar({ conv, small }: { conv: Conversation; small?: boolean }) {
  const size = small ? "h-8 w-8 text-sm" : "h-11 w-11";
  return (
    <span className="relative shrink-0">
      <span
        className={
          "flex items-center justify-center rounded-full font-bold text-white " +
          size
        }
        style={{ backgroundColor: conv.color }}
      >
        {conv.name.charAt(0).toUpperCase()}
      </span>
      {conv.online && !small && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
      )}
    </span>
  );
}
