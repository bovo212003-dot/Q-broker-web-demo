"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { withRole } from "@/lib/role";
import { RoleId } from "@/types";
import { formatVnd } from "@/data/realtorListings";
import {
  AUCTION_LOTS,
  AuctionBid,
  BIDDER_NAMES,
  CHAT_POOL,
  ChatMessage,
  INITIAL_BIDS,
  INITIAL_CHAT,
} from "@/data/auctionLive";
import { LegalModal } from "./LegalModal";

// =============================================================
// PHÒNG LIVE STREAM — phong cách TikTok Live
// - Trái: khung video (badge LIVE, người xem, chat nổi, tim bay)
// - Phải: khung trò chuyện trực tiếp (full chiều cao cột)
// - Nút búa (Gavel) trên video: dẫn sang Sàn đấu giá
//   (/realtor/dau-gia?lot=...) của đúng sản phẩm đang phát.
// - Mô phỏng realtime bằng interval phía client; trạng thái ban đầu
//   cố định (INITIAL_*) để SSR không lệch hydration.
// =============================================================

const LIVE_QUEUE = AUCTION_LOTS.filter((l) => l.status === "live");
const ROUND_SECONDS = 45; // đồng hồ đếm ngược, reset mỗi lượt trả giá
const HEART_EMOJIS = ["❤️", "🧡", "💛", "🔥", "👍", "💎"];
const CONFETTI_COLORS = [
  "#f43f5e",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#a855f7",
  "#facc15",
];

type Phase = "bidding" | "sold";

interface ConfettiPiece {
  id: number;
  left: number; // % theo chiều ngang
  delay: number; // s
  duration: number; // s
  color: string;
}

interface Board {
  price: number;
  bids: AuctionBid[];
  countdown: number;
  phase: Phase;
}

interface FloatingHeart {
  id: number;
  left: number; // % từ mép phải cụm tim
  drift: number; // px lệch ngang khi bay lên
  emoji: string;
}

/** Giờ hiện tại dạng "14:03:21" */
const timeStr = () =>
  new Date().toLocaleTimeString("vi-VN", { hour12: false });

/** "4.400.000.000 đ" — kiểu bảng giá đầy đủ số */
const fullVnd = (v: number) => `${v.toLocaleString("vi-VN")} đ`;

export function AuctionLiveRoom() {
  // Giữ ngữ cảnh role khi điều hướng sang sàn đấu giá (?role=...).
  const roleId = (useSearchParams().get("role") ?? undefined) as
    | RoleId
    | undefined;
  const [lotIdx, setLotIdx] = useState(0);
  const lot = LIVE_QUEUE[lotIdx];

  const [board, setBoard] = useState<Board>({
    price: INITIAL_BIDS[0].price,
    bids: INITIAL_BIDS,
    countdown: ROUND_SECONDS,
    phase: "bidding",
  });
  const [chat, setChat] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [viewers, setViewers] = useState(1284);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [followed, setFollowed] = useState(false);
  const [msgInput, setMsgInput] = useState("");
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [muted, setMuted] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // AudioContext tạo lười (chỉ khởi tạo khi cần phát tiếng chúc mừng).
  const audioRef = useRef<AudioContext | null>(null);
  const mutedRef = useRef(false);
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // Ref đồng bộ với state để interval đọc giá trị mới nhất
  // mà không phải khởi tạo lại interval mỗi lần giá nhảy.
  const boardRef = useRef(board);
  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  const idRef = useRef(100); // sinh id cho bid/chat/tim
  const chatBoxRef = useRef<HTMLDivElement>(null);
  // Số lượt bot còn trả cho lô hiện tại. Khi hết -> không ai nâng nữa,
  // đồng hồ 45s chạy về 0 và phiên chốt giá (nếu người xem không trả thêm).
  const botBudgetRef = useRef(5);

  const pushChat = useCallback((msg: Omit<ChatMessage, "id">) => {
    setChat((c) => [...c, { ...msg, id: ++idRef.current }].slice(-40));
  }, []);

  /** Thêm 1 lượt trả giá (người xem hoặc bot) */
  const placeBid = useCallback(
    (name: string, steps: number, mine?: boolean) => {
      const b = boardRef.current;
      if (b.phase !== "bidding") return;
      const price = b.price + lot.step * steps;
      const bid: AuctionBid = {
        id: ++idRef.current,
        name,
        price,
        delta: steps,
        time: timeStr(),
        mine,
      };
      setBoard({
        ...b,
        price,
        bids: [bid, ...b.bids].slice(0, 30),
        countdown: ROUND_SECONDS,
      });
      if (mine) {
        pushChat({
          name: "Q-Broker",
          text: `Bạn vừa trả ${formatVnd(price)} 🎯`,
          system: true,
        });
      }
    },
    [lot.step, pushChat]
  );

  const sendHeart = useCallback(() => {
    const heart: FloatingHeart = {
      id: ++idRef.current,
      left: Math.random() * 36,
      drift: Math.random() * 70 - 35,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
    };
    setHearts((h) => [...h, heart]);
    setTimeout(
      () => setHearts((h) => h.filter((x) => x.id !== heart.id)),
      2600
    );
  }, []);

  /** Phát đoạn "fanfare" chúc mừng bằng Web Audio API (không cần file nhạc) */
  const playCelebration = useCallback(() => {
    if (mutedRef.current) return;
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) return;
      const ac = audioRef.current ?? new Ctx();
      audioRef.current = ac;
      if (ac.state === "suspended") ac.resume();
      // Hợp âm rải C–E–G–C (nốt vui tươi).
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        const t0 = ac.currentTime + i * 0.12;
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(0.25, t0 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);
        osc.connect(gain).connect(ac.destination);
        osc.start(t0);
        osc.stop(t0 + 0.6);
      });
    } catch {
      // Bỏ qua nếu trình duyệt chặn autoplay audio.
    }
  }, []);

  /** Chia sẻ: sao chép link phiên livestream vào clipboard + hiện toast */
  const handleShare = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Trình duyệt chặn clipboard -> vẫn hiện toast để không "im lặng".
    }
    setShareToast(true);
    window.setTimeout(() => setShareToast(false), 2400);
  }, []);

  // ---- Nhịp chính 1s: đếm ngược + bot trả giá + người xem dao động ----
  useEffect(() => {
    const iv = setInterval(() => {
      const b = boardRef.current;
      if (b.phase === "bidding") {
        // Bot ngẫu nhiên nâng giá (dồn dập hơn khi sắp hết giờ), nhưng
        // chỉ trong hạn mức botBudget để phiên còn kết thúc được.
        const hot = b.countdown <= 8;
        const canBot = botBudgetRef.current > 0;
        if (canBot && Math.random() < (hot ? 0.45 : 0.2)) {
          botBudgetRef.current -= 1;
          placeBid(
            BIDDER_NAMES[Math.floor(Math.random() * BIDDER_NAMES.length)],
            Math.random() < 0.8 ? 1 : 2
          );
        } else {
          const cd = b.countdown - 1;
          setBoard(
            cd <= 0
              ? { ...b, countdown: 0, phase: "sold" }
              : { ...b, countdown: cd }
          );
        }
      }
      setViewers((v) => Math.max(900, v + Math.floor(Math.random() * 41) - 18));
    }, 1000);
    return () => clearInterval(iv);
  }, [placeBid]);

  // ---- Chốt giá xong -> chúc mừng (âm thanh + confetti) rồi chuyển lô ----
  useEffect(() => {
    if (board.phase !== "sold") return;
    const winner = board.bids[0];
    playCelebration();
    // Bắn confetti trong khung video.
    setConfetti(
      Array.from({ length: 44 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.4 + Math.random() * 1.6,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      }))
    );
    pushChat({
      name: "Q-Broker",
      text: `🔨 CHỐT GIÁ! Chúc mừng ${winner.name} trúng đấu giá với ${formatVnd(winner.price)}`,
      system: true,
    });
    const t = setTimeout(() => {
      const next = (lotIdx + 1) % LIVE_QUEUE.length;
      const nl = LIVE_QUEUE[next];
      setLotIdx(next);
      setConfetti([]);
      botBudgetRef.current = 4 + Math.floor(Math.random() * 6); // 4–9 lượt bot
      setBoard({
        price: nl.startPrice,
        bids: [
          {
            id: ++idRef.current,
            name: "Giá khởi điểm",
            price: nl.startPrice,
            delta: 0,
            time: timeStr(),
          },
        ],
        countdown: ROUND_SECONDS,
        phase: "bidding",
      });
      pushChat({
        name: "Q-Broker",
        text: `📣 Bắt đầu lô tiếp theo: ${nl.title}. Giá khởi điểm ${formatVnd(nl.startPrice)}`,
        system: true,
      });
    }, 5000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board.phase]);

  // ---- Chat mô phỏng mỗi ~3s + thả tim ngẫu nhiên ----
  useEffect(() => {
    const iv = setInterval(() => {
      const m = CHAT_POOL[Math.floor(Math.random() * CHAT_POOL.length)];
      pushChat(m);
      if (Math.random() < 0.5) sendHeart();
    }, 3000);
    return () => clearInterval(iv);
  }, [pushChat, sendHeart]);

  // Chat luôn cuộn xuống tin mới nhất
  useEffect(() => {
    const el = chatBoxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = msgInput.trim();
    if (!text) return;
    pushChat({ name: "Bạn", text });
    setMsgInput("");
  };

  const winner = board.bids[0];

  return (
    <section className="bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 lg:grid-cols-[1fr_380px] lg:px-8">
        {/* ===== VIDEO — cột trái, hàng trên (khung TikTok Live) ===== */}
        <div className="relative order-1 aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 lg:order-none lg:col-start-1 lg:row-start-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lot.image}
              alt={lot.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50" />

            {/* Trên trái: đơn vị tổ chức + nút theo dõi */}
            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/45 py-1 pl-1 pr-2 backdrop-blur-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-realtor-500 text-xs font-bold text-white">
                Q
              </span>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-white">{lot.agency}</p>
                <p className="text-[10px] text-white/70">
                  Đấu giá viên: Nguyễn Văn Bình
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFollowed((v) => !v)}
                className={`ml-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  followed
                    ? "bg-white/20 text-white"
                    : "bg-rose-500 text-white hover:bg-rose-600"
                }`}
              >
                {followed ? "Đang theo dõi" : "+ Theo dõi"}
              </button>
            </div>

            {/* Trên phải: tắt/bật tiếng + LIVE + người xem */}
            <div className="absolute right-3 top-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMuted((v) => !v)}
                className="flex items-center justify-center rounded-md bg-black/45 p-1.5 text-white backdrop-blur-sm hover:bg-black/60"
                aria-label={muted ? "Bật âm thanh chúc mừng" : "Tắt âm thanh chúc mừng"}
                title={muted ? "Bật âm thanh" : "Tắt âm thanh"}
              >
                <Icon name={muted ? "VolumeX" : "Volume2"} className="h-4 w-4" />
              </button>
              <span className="flex items-center gap-1.5 rounded-md bg-rose-600 px-2 py-1 text-xs font-bold uppercase text-white">
                <span className="h-1.5 w-1.5 animate-ping rounded-full bg-white" />
                Live
              </span>
              <span className="flex items-center gap-1 rounded-md bg-black/45 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <Icon name="Eye" className="h-3.5 w-3.5" />
                {viewers.toLocaleString("vi-VN")}
              </span>
            </div>

            {/* Dưới trái: chat nổi trên video (3 tin mới nhất) */}
            <div className="absolute bottom-3 left-3 flex max-w-[70%] flex-col gap-1.5 sm:max-w-[55%]">
              {chat.slice(-3).map((m) => (
                <p
                  key={m.id}
                  className="w-fit animate-slide-in rounded-full bg-black/45 px-3 py-1.5 text-xs text-white backdrop-blur-sm"
                >
                  {m.system ? (
                    <span className="font-semibold text-amber-300">{m.text}</span>
                  ) : (
                    <>
                      <span className="font-semibold text-sky-300">{m.name}: </span>
                      {m.text}
                    </>
                  )}
                </p>
              ))}
            </div>

            {/* Dưới phải: nút búa đấu giá + nút thả tim + tim bay */}
            <div className="absolute bottom-3 right-3 flex flex-col items-center gap-2">
              <div className="pointer-events-none absolute bottom-24 right-0 h-64 w-20">
                {hearts.map((h) => (
                  <span
                    key={h.id}
                    className="animate-float-heart absolute bottom-0 text-2xl"
                    style={
                      {
                        right: `${h.left}%`,
                        "--drift": `${h.drift}px`,
                      } as React.CSSProperties
                    }
                  >
                    {h.emoji}
                  </span>
                ))}
              </div>
              {/* Nút búa: sang sàn đấu giá của sản phẩm đang phát */}
              <Link
                href={withRole(`/realtor/dau-gia?lot=${lot.id}`, roleId)}
                className="relative flex h-11 w-11 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-amber-400 active:scale-95"
                aria-label="Tham gia đấu giá trực tiếp"
                title="Tham gia đấu giá"
              >
                {board.phase === "bidding" && (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-ping rounded-full bg-rose-500" />
                )}
                <Icon name="Gavel" className="h-5 w-5" />
              </Link>
              <button
                type="button"
                onClick={sendHeart}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-transform hover:scale-110 hover:bg-rose-500/80 active:scale-95"
                aria-label="Thả tim"
              >
                <Icon name="Heart" className="h-5 w-5" />
              </button>
            </div>

            {/* Màn chúc mừng khi vừa chốt giá */}
            {board.phase === "sold" && (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-black/75 backdrop-blur-sm">
                {/* Confetti rơi */}
                <div className="pointer-events-none absolute inset-0">
                  {confetti.map((c) => (
                    <span
                      key={c.id}
                      className="animate-confetti absolute top-0 h-2.5 w-2.5 rounded-sm"
                      style={{
                        left: `${c.left}%`,
                        backgroundColor: c.color,
                        animationDelay: `${c.delay}s`,
                        animationDuration: `${c.duration}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Thẻ chúc mừng */}
                <div className="animate-pop-in relative mx-4 w-full max-w-sm rounded-2xl border border-amber-300/40 bg-slate-900/90 px-6 py-6 text-center shadow-2xl">
                  <div className="text-4xl">{winner.mine ? "🏆" : "🎉"}</div>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
                    Chúc mừng người trúng đấu giá
                  </p>
                  <p className="mt-3 text-2xl font-extrabold text-white">
                    {winner.mine ? "🎊 Chúc mừng Bạn!" : winner.name}
                  </p>
                  <p className="mt-1 text-sm text-white/70">
                    đã trúng đấu giá với mức giá
                  </p>
                  <p className="mt-2 font-mono text-2xl font-extrabold text-emerald-400">
                    {fullVnd(winner.price)}
                  </p>
                  <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/50">
                    <Icon name="Loader2" className="h-3.5 w-3.5 animate-spin" />
                    Chuyển sang lô tiếp theo sau giây lát...
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ===== THÔNG TIN LÔ + TỔNG QUAN — cột trái, hàng dưới (dưới video) ===== */}
          <div className="order-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 lg:order-none lg:col-start-1 lg:row-start-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-400">
                  Đang đấu giá — Lô {lotIdx + 1}/{LIVE_QUEUE.length}
                </p>
                <h1 className="mt-1 text-lg font-bold text-white">{lot.title}</h1>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-400">
                  <Icon name="MapPin" className="h-3.5 w-3.5 shrink-0" />
                  {lot.address}, {lot.city}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={withRole(`/realtor/dau-gia?lot=${lot.id}`, roleId)}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-400"
                >
                  <Icon name="Gavel" className="h-3.5 w-3.5" />
                  Đấu giá
                </Link>
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  <Icon name="Share2" className="h-3.5 w-3.5" />
                  Chia sẻ
                </button>
                <button
                  type="button"
                  onClick={() => setLegalOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  <Icon name="FileText" className="h-3.5 w-3.5" />
                  Hồ sơ pháp lý
                </button>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: "Diện tích", value: `${lot.area} m²`, icon: "Ruler" },
                { label: "Pháp lý", value: lot.legal, icon: "ShieldCheck" },
                { label: "Tiền đặt trước", value: formatVnd(lot.deposit), icon: "Wallet" },
                { label: "Người tham gia", value: `${lot.bidders} nhà đầu tư`, icon: "Users" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="rounded-xl bg-slate-800/60 px-3 py-2.5"
                >
                  <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-slate-400">
                    <Icon name={f.icon} className="h-3.5 w-3.5" />
                    {f.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-white">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Giới thiệu tổng quan dự án — lấp khoảng trống phía dưới card,
                dùng highlights của lô đang đấu giá. */}
            {lot.highlights && lot.highlights.length > 0 && (
              <div className="mt-4 border-t border-slate-800 pt-4">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  <Icon name="Sparkles" className="h-3.5 w-3.5 text-realtor-400" />
                  Tổng quan dự án
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  <span className="font-semibold text-slate-200">{lot.title}</span>{" "}
                  toạ lạc tại {lot.address}, {lot.city} — pháp lý{" "}
                  {lot.legal.toLowerCase()}, diện tích {lot.area} m². Một số điểm
                  nổi bật:
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {lot.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2 text-xs text-slate-300"
                    >
                      <Icon
                        name="CheckCircle2"
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400"
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        {/* ===== CỘT PHẢI: TRÒ CHUYỆN TRỰC TIẾP (cạnh video) =====
            Cột flex cao bằng video + card thông tin: khung chat lấp toàn bộ
            -> chat luôn hiện cạnh video, không phải cuộn trang xuống.
            Bảng đấu giá chuyển vào popup mở bằng nút búa trên video. */}
        <div className="order-2 flex flex-col gap-4 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2">
          {/* --- Trò chuyện trực tiếp: lấp toàn bộ cột phải --- */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <p className="flex shrink-0 items-center gap-2 border-b border-slate-800 px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-300">
              <Icon name="MessageCircle" className="h-4 w-4 text-sky-400" />
              Trò chuyện trực tiếp
            </p>
            {/* Wrapper relative giữ chiều cao cố định; vùng cuộn absolute bên
                trong KHÔNG làm nới ô lưới -> panel không bị kéo dài khi nhiều
                tin, luôn cao bằng card "Đang đấu giá" và chỉ cuộn nội bộ. */}
            <div className="relative h-72 min-h-0 lg:h-auto lg:flex-1">
              <div
                ref={chatBoxRef}
                className="absolute inset-0 flex flex-col overflow-y-auto overscroll-contain px-4 py-3"
              >
                {/* mt-auto: dính đáy khi ít tin, nhưng vẫn cuộn được khi nhiều tin
                    (justify-end sẽ cắt mất phần đầu và không cho cuộn lên). */}
                <div className="mt-auto space-y-2">
                  {chat.map((m) => (
                    <p
                      key={m.id}
                      className="animate-slide-in break-words text-xs leading-relaxed"
                    >
                      {m.system ? (
                        <span className="font-semibold text-amber-400">{m.text}</span>
                      ) : (
                        <>
                          <span
                            className={`font-semibold ${
                              m.name === "Bạn" ? "text-sky-400" : "text-slate-400"
                            }`}
                          >
                            {m.name}:{" "}
                          </span>
                          <span className="text-slate-200">{m.text}</span>
                        </>
                      )}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <form
              onSubmit={sendMessage}
              className="flex shrink-0 items-center gap-2 border-t border-slate-800 p-3"
            >
              <input
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder="Nhập bình luận..."
                className="min-w-0 flex-1 rounded-full bg-slate-800 px-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-realtor-500"
              />
              <button
                type="submit"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-realtor-500 text-white hover:bg-realtor-600"
                aria-label="Gửi bình luận"
              >
                <Icon name="SendHorizontal" className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Toast "đã sao chép link" */}
      {shareToast && (
        <div className="animate-toast fixed bottom-20 left-1/2 z-[80] flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-2xl ring-1 ring-white/10">
          <Icon name="Check" className="h-4 w-4 text-emerald-400" />
          Đã sao chép link phiên livestream
        </div>
      )}

      {/* Popup hồ sơ pháp lý của lô đang đấu */}
      {legalOpen && (
        <LegalModal lot={lot} onClose={() => setLegalOpen(false)} />
      )}
    </section>
  );
}
