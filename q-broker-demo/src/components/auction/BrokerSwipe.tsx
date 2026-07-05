"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { AuctionBroker } from "@/data/auction";
import { cn } from "@/lib/utils";

// BƯỚC 3 — Quẹt chọn môi giới (cơ chế kiểu Tinder).
// Quẹt phải / nút tim  = muốn kết nối; quẹt trái / nút X = bỏ qua.
// Kéo thẻ bằng chuột hoặc chạm (pointer events), có nhãn KẾT NỐI / BỎ QUA.

const SWIPE_THRESHOLD = 110; // px kéo tối thiểu để tính là 1 lượt quẹt

export function BrokerSwipe({
  brokers,
  onDone,
}: {
  brokers: AuctionBroker[];
  onDone: (liked: AuctionBroker[]) => void;
}) {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<AuctionBroker[]>([]);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [fly, setFly] = useState<"left" | "right" | null>(null);
  const start = useRef({ x: 0, y: 0 });

  const current = brokers[index];

  const finishSwipe = (dir: "left" | "right") => {
    if (fly || !current) return;
    setFly(dir);
    const nextLiked = dir === "right" ? [...liked, current] : liked;
    setLiked(nextLiked);
    setTimeout(() => {
      setFly(null);
      setDrag({ x: 0, y: 0 });
      const next = index + 1;
      if (next >= brokers.length) onDone(nextLiked);
      else setIndex(next);
    }, 280);
  };

  // ---- Kéo thẻ (pointer events) ----
  const onPointerDown = (e: React.PointerEvent) => {
    if (fly) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || fly) return;
    setDrag({ x: e.clientX - start.current.x, y: e.clientY - start.current.y });
  };
  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (drag.x > SWIPE_THRESHOLD) finishSwipe("right");
    else if (drag.x < -SWIPE_THRESHOLD) finishSwipe("left");
    else setDrag({ x: 0, y: 0 });
  };

  const likeOpacity = Math.min(1, Math.max(0, drag.x / 90));
  const skipOpacity = Math.min(1, Math.max(0, -drag.x / 90));

  const topTransform = fly
    ? `translate(${fly === "right" ? 640 : -640}px, ${drag.y * 0.3 - 40}px) rotate(${fly === "right" ? 28 : -28}deg)`
    : `translate(${drag.x}px, ${drag.y * 0.25}px) rotate(${drag.x * 0.055}deg)`;

  return (
    <div className="mx-auto max-w-md animate-fade-up">
      {/* Tiêu đề + đếm */}
      <div className="mb-4 text-center">
        <h2 className="text-xl font-bold text-al-700">
          Chọn môi giới bạn muốn kết nối
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Quẹt phải để chọn · quẹt trái để bỏ qua 😉
        </p>
        <div className="mt-3 flex items-center justify-center gap-3 text-sm">
          <span className="font-mono font-bold text-slate-700">
            {Math.min(index + 1, brokers.length)}/{brokers.length}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-flame-50 px-2.5 py-1 text-xs font-bold text-flame-600">
            <Icon name="Heart" className="h-3.5 w-3.5" />
            Đã chọn {liked.length}
          </span>
        </div>
      </div>

      {/* Chồng thẻ */}
      <div className="relative h-[520px] select-none">
        {brokers
          .slice(index, index + 3)
          .map((b, pos) => {
            const isTop = pos === 0;
            return (
              <div
                key={b.id}
                className="absolute inset-0"
                style={{
                  zIndex: 10 - pos,
                  transform: isTop
                    ? topTransform
                    : `translateY(${pos * 14}px) scale(${1 - pos * 0.045})`,
                  transition:
                    isTop && (dragging || fly)
                      ? fly
                        ? "transform .28s ease-in, opacity .28s"
                        : "none"
                      : "transform .3s ease",
                  opacity: isTop && fly ? 0 : 1,
                  touchAction: "none",
                  cursor: isTop ? (dragging ? "grabbing" : "grab") : "default",
                }}
                onPointerDown={isTop ? onPointerDown : undefined}
                onPointerMove={isTop ? onPointerMove : undefined}
                onPointerUp={isTop ? onPointerUp : undefined}
                onPointerCancel={isTop ? onPointerUp : undefined}
              >
                <BrokerCard broker={b} />
                {/* Nhãn quẹt (chỉ thẻ trên cùng) */}
                {isTop && (
                  <>
                    <span
                      style={{ opacity: fly === "right" ? 1 : likeOpacity }}
                      className="absolute left-5 top-6 -rotate-12 rounded-xl border-4 border-emerald-400 px-3 py-1 text-xl font-black uppercase tracking-widest text-emerald-400"
                    >
                      Kết nối
                    </span>
                    <span
                      style={{ opacity: fly === "left" ? 1 : skipOpacity }}
                      className="absolute right-5 top-6 rotate-12 rounded-xl border-4 border-rose-400 px-3 py-1 text-xl font-black uppercase tracking-widest text-rose-400"
                    >
                      Bỏ qua
                    </span>
                  </>
                )}
              </div>
            );
          })
          .reverse() /* render thẻ dưới trước để thẻ trên đè lên */}
      </div>

      {/* Nút thao tác */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <button
          onClick={() => finishSwipe("left")}
          aria-label="Bỏ qua"
          className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white text-rose-500 shadow-lg transition-transform hover:scale-110 active:scale-95"
        >
          <Icon name="X" className="h-7 w-7" />
        </button>
        <button
          onClick={() => finishSwipe("right")}
          aria-label="Muốn kết nối"
          className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-flame-400 to-flame-600 text-white shadow-xl shadow-flame-500/40 transition-transform hover:scale-110 active:scale-95"
        >
          <Icon name="Heart" className="h-9 w-9" />
        </button>
      </div>
      <p className="mt-4 text-center text-xs text-slate-400">
        Thông tin liên hệ của hai bên chỉ được chia sẻ sau khi ghép nối thành công
      </p>
    </div>
  );
}

// -------- Thẻ hồ sơ môi giới --------
function BrokerCard({ broker: b }: { broker: AuctionBroker }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-900/10">
      {/* Ảnh + tên */}
      <div className="relative h-[55%] shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={b.avatar}
          alt={b.name}
          className="h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
        <div className="absolute inset-x-4 bottom-3 text-white">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold">{b.name}</h3>
            <Icon name="BadgeCheck" className="h-5 w-5 text-sky-400" />
          </div>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-white/85">
            <Icon name="MapPin" className="h-3.5 w-3.5" />
            {b.area} · {b.years} năm kinh nghiệm
          </p>
        </div>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-950/60 px-2.5 py-1 text-xs font-bold text-amber-300 backdrop-blur">
          <Icon name="Star" className="h-3.5 w-3.5 fill-amber-300" />
          {b.rating} ({b.reviews})
        </span>
      </div>

      {/* Thông số */}
      <div className="flex flex-1 flex-col p-4">
        <p className="line-clamp-2 text-sm italic text-slate-500">
          &ldquo;{b.tagline}&rdquo;
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {b.specialty.map((s) => (
            <span
              key={s}
              className="rounded-full bg-al-50 px-2.5 py-1 text-xs font-semibold text-al-700"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-auto grid grid-cols-3 gap-2 pt-3 text-center">
          <Stat value={String(b.deals)} label="Giao dịch" />
          <Stat value={`${b.responseRate}%`} label="Phản hồi" />
          <Stat value={`${b.avgResponseMin}p`} label="TG phản hồi" />
        </div>

        <div className="mt-3 space-y-1.5">
          <ScoreBar label="Uy tín" value={b.reputation} />
          <ScoreBar label="Tín nhiệm" value={b.trust} />
        </div>
      </div>
    </article>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-slate-50 py-2">
      <p className="text-base font-bold text-al-700">{value}</p>
      <p className="text-[11px] text-slate-400">{label}</p>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-16 shrink-0 text-slate-400">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className={cn(
            "h-full rounded-full",
            value >= 90 ? "bg-emerald-500" : value >= 80 ? "bg-al-500" : "bg-amber-400"
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-7 shrink-0 text-right font-bold text-slate-600">
        {value}
      </span>
    </div>
  );
}
