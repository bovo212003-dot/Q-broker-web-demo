import { Icon } from "@/components/ui/Icon";

// =============================================================
// BANNER CROSS-PROMO "Trở thành đối tác" trên trang chủ /realtor
// -> kéo traffic sang trang /realtor/affiliate.
// href nhận sẵn từ page (đã kèm ?role=... nếu đang đăng nhập).
// =============================================================

export function AffiliateBanner({ href }: { href: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-realtor-700 via-realtor-600 to-realtor-500 px-8 py-10">
        {/* Hoạ tiết trang trí góc phải */}
        <Icon
          name="Handshake"
          className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rotate-12 text-white/10"
        />
        <div className="relative flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div>
            <p className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-300 sm:justify-start">
              <Icon name="Sparkles" className="h-3.5 w-3.5" />
              Q-Broker Affiliate
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Giới thiệu nhà, nhận tới 30% hoa hồng
            </h2>
            <p className="mt-2 max-w-lg text-sm text-realtor-50/90">
              Chia sẻ link, hệ thống theo dõi realtime, tiền về khi giao dịch
              chốt. Miễn phí tham gia — cookie ghi nhận khách tới 30 ngày.
            </p>
          </div>
          <a
            href={href}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-realtor-600 shadow-lg hover:bg-realtor-50"
          >
            <Icon name="Rocket" className="h-4 w-4" />
            Trở thành đối tác
          </a>
        </div>
      </div>
    </section>
  );
}
