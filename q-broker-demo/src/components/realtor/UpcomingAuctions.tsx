import { Icon } from "@/components/ui/Icon";
import { AUCTION_LOTS } from "@/data/auctionLive";
import { formatVnd } from "@/data/realtorListings";

// Lưới "Phiên đấu giá sắp diễn ra" dưới phòng livestream:
// thẻ tài sản + giờ bắt đầu + giá khởi điểm/tiền đặt trước + CTA đăng ký.

export function UpcomingAuctions() {
  const upcoming = AUCTION_LOTS.filter((l) => l.status === "upcoming");

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-realtor-ink">
            Phiên đấu giá sắp diễn ra
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Đăng ký và nộp tiền đặt trước để đủ điều kiện tham gia trả giá trực tiếp.
          </p>
        </div>
        <a
          href="#"
          className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-realtor-500 hover:text-realtor-600 sm:flex"
        >
          Xem tất cả
          <Icon name="ArrowRight" className="h-4 w-4" />
        </a>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {upcoming.map((lot) => (
          <article
            key={lot.id}
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative h-40 w-full overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lot.image}
                alt={lot.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute left-3 top-3 flex items-center gap-1 rounded bg-amber-500 px-2 py-1 text-xs font-semibold text-white">
                <Icon name="Clock" className="h-3 w-3" />
                {lot.startLabel}
              </span>
            </div>

            <div className="p-4">
              <h3 className="line-clamp-2 min-h-10 text-sm font-bold text-realtor-ink">
                {lot.title}
              </h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <Icon name="MapPin" className="h-3 w-3 shrink-0" />
                {lot.city}
              </p>

              <dl className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-xs">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Giá khởi điểm</dt>
                  <dd className="font-bold text-realtor-ink">
                    {formatVnd(lot.startPrice)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Tiền đặt trước</dt>
                  <dd className="font-semibold text-slate-700">
                    {formatVnd(lot.deposit)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Đã đăng ký</dt>
                  <dd className="font-semibold text-slate-700">
                    {lot.bidders} nhà đầu tư
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-realtor-500 px-3 py-2 text-xs font-semibold text-white hover:bg-realtor-600"
                >
                  Đăng ký tham gia
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center rounded-lg border border-slate-300 px-2.5 text-slate-600 hover:border-realtor-500 hover:text-realtor-500"
                  aria-label="Nhắc tôi khi bắt đầu"
                >
                  <Icon name="BellRing" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
