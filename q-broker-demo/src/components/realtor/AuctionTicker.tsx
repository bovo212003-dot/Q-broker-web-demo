import { Icon } from "@/components/ui/Icon";
import { AUCTION_LOTS } from "@/data/auctionLive";
import { formatVnd } from "@/data/realtorListings";

// Dải giá chạy ngang kiểu bảng điện chứng khoán (cafef.vn):
// lô đang LIVE hiện % tăng màu xanh, lô sắp diễn ra hiện giờ bắt đầu.
// Nội dung nhân đôi để animation translateX(-50%) chạy liền mạch.

export function AuctionTicker() {
  const items = [...AUCTION_LOTS, ...AUCTION_LOTS]; // nhân đôi cho vòng lặp

  return (
    <div className="overflow-hidden border-b border-slate-800 bg-slate-950">
      <div className="animate-ticker flex w-max items-center gap-8 px-4 py-2">
        {items.map((lot, i) => (
          <span
            key={`${lot.id}-${i}`}
            className="flex shrink-0 items-center gap-2 text-xs"
          >
            {lot.status === "live" ? (
              <span className="flex items-center gap-1 font-bold uppercase text-rose-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
                Live
              </span>
            ) : (
              <span className="flex items-center gap-1 font-semibold text-amber-400">
                <Icon name="Clock" className="h-3 w-3" />
                {lot.startLabel}
              </span>
            )}
            <span className="max-w-52 truncate font-semibold text-slate-300">
              {lot.title}
            </span>
            <span className="font-mono font-bold text-white">
              {formatVnd(lot.startPrice)}
            </span>
            {lot.status === "live" ? (
              <span className="font-mono font-bold text-emerald-400">
                ▲ +{lot.tickerChange.toLocaleString("vi-VN")}%
              </span>
            ) : (
              <span className="font-mono text-slate-500">— khởi điểm</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
