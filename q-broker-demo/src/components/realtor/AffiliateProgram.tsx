import { Icon } from "@/components/ui/Icon";
import { AffiliateSignupButton } from "@/components/realtor/AffiliateSignup";
import {
  AFFILIATE_FAQS,
  AFFILIATE_LEADERBOARD,
  AFFILIATE_STEPS,
  AFFILIATE_TIERS,
  COMMISSION_PRODUCTS,
  MARKETING_ASSETS,
} from "@/data/affiliate";

// =============================================================
// CÁC SECTION TĨNH của trang affiliate (server component):
// Hero -> Cách hoạt động -> Hạng đối tác -> Hoa hồng theo sản
// phẩm -> FAQ. Cơ chế mô phỏng Zillow Affiliate / Zillow Flex /
// Realtor.com ReadyConnect (chi tiết ở src/data/affiliate.ts).
// =============================================================

const PAY_TYPE_LABEL: Record<string, { label: string; className: string }> = {
  closing: { label: "Trả khi chốt", className: "bg-emerald-50 text-emerald-600" },
  recurring: { label: "Hàng tháng", className: "bg-violet-50 text-violet-600" },
  flat: { label: "Cố định", className: "bg-sky-50 text-sky-600" },
};

/** Hero: tiêu đề + 2 CTA + 3 con số cam kết */
export function AffiliateHero() {
  return (
    <section className="bg-gradient-to-br from-realtor-700 via-realtor-600 to-realtor-500">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-realtor-100">
          Q-Broker Affiliate
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
          Giới thiệu bất động sản,
          <br className="hidden sm:block" /> nhận tới{" "}
          <span className="text-amber-300">30% hoa hồng</span> mỗi giao dịch
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-realtor-50/90 sm:text-base">
          Mô hình pay-at-closing chuẩn quốc tế: chia sẻ link, hệ thống theo dõi
          realtime, tiền chỉ về khi giao dịch chốt thành công — minh bạch như
          Zillow Flex, hào phóng hơn với cookie 30 ngày.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <AffiliateSignupButton
            variant="solid"
            label="Đăng ký làm đối tác — miễn phí"
          />
          <a
            href="#hoa-hong"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Xem bảng hoa hồng
            <Icon name="ArrowDown" className="h-4 w-4" />
          </a>
        </div>

        <dl className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-4">
          {[
            { value: "30%", label: "hoa hồng tối đa / giao dịch" },
            { value: "30 ngày", label: "cookie ghi nhận khách" },
            { value: "12 tháng", label: "hoa hồng lặp lại gói hội viên" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/10 px-3 py-4 backdrop-blur-sm">
              <dt className="text-xl font-extrabold text-white sm:text-2xl">
                {s.value}
              </dt>
              <dd className="mt-1 text-[11px] text-realtor-50/80 sm:text-xs">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** 4 bước "Cách hoạt động" */
export function AffiliateSteps() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-realtor-ink sm:text-3xl">
          Kiếm tiền trong 4 bước
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
          Không cần vốn, không cần chứng chỉ môi giới — chỉ cần mạng lưới quan hệ
          hoặc kênh nội dung của bạn.
        </p>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {AFFILIATE_STEPS.map((s) => (
          <div
            key={s.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-realtor-50 text-realtor-500">
              <Icon name={s.icon} className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-sm font-bold text-realtor-ink">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** 3 hạng đối tác Đồng / Bạc / Vàng */
export function AffiliateTiers() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-realtor-ink sm:text-3xl">
            Càng giới thiệu nhiều, tỷ lệ càng cao
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
            Hạng xét theo số giao dịch chốt mỗi quý — mô hình bậc thang giống các
            mạng affiliate quốc tế, khởi điểm đã cao hơn chuẩn ngành.
          </p>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {AFFILIATE_TIERS.map((t) => (
            <div
              key={t.id}
              className={`relative rounded-2xl border bg-white p-6 shadow-sm ${
                t.featured
                  ? "border-realtor-500 ring-2 ring-realtor-500/20"
                  : "border-slate-200"
              }`}
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-realtor-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  Phổ biến nhất
                </span>
              )}
              <h3 className="text-lg font-bold text-realtor-ink">{t.name}</h3>
              <p className="mt-0.5 text-xs text-slate-500">{t.condition}</p>
              <p className="mt-4 text-3xl font-extrabold text-realtor-500">
                {t.dealRate}%
                <span className="ml-1 text-sm font-semibold text-slate-500">
                  phí môi giới / giao dịch
                </span>
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                + {t.recurringRate}% recurring gói hội viên
              </p>
              <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-5">
                {t.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
                    <Icon
                      name="CheckCircle2"
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Bảng hoa hồng theo từng sản phẩm/dịch vụ */
export function AffiliateCommissions() {
  return (
    <section id="hoa-hong" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 lg:px-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-realtor-ink sm:text-3xl">
          Hoa hồng theo từng sản phẩm
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
          Bốn nguồn thu nhập trong một chương trình — từ hoa hồng lớn khi chốt
          giao dịch tới dòng tiền đều đặn hàng tháng.
        </p>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {COMMISSION_PRODUCTS.map((c) => {
          const pt = PAY_TYPE_LABEL[c.payType];
          return (
            <div
              key={c.product}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-realtor-50 text-realtor-500">
                <Icon name={c.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-realtor-ink">{c.product}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${pt.className}`}
                  >
                    {pt.label}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{c.fee}</p>
                <p className="mt-2 text-base font-extrabold text-realtor-500">
                  {c.commission}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  <Icon name="Calculator" className="mr-1 inline h-3 w-3" />
                  {c.example}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Bảng xếp hạng Top đối tác quý — social proof + tính ganh đua */
export function AffiliateLeaderboard() {
  const medal = ["🥇", "🥈", "🥉"];
  const tierName: Record<string, string> = {
    vang: "Vàng",
    bac: "Bạc",
    dong: "Đồng",
  };
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-realtor-ink sm:text-3xl">
          Top đối tác quý này
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
          Con số thật từ mạng lưới đối tác — vị trí tiếp theo có thể là của bạn.
        </p>
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2.5 font-semibold">Hạng</th>
                <th className="px-4 py-2.5 font-semibold">Đối tác</th>
                <th className="px-4 py-2.5 font-semibold">Khu vực</th>
                <th className="px-4 py-2.5 font-semibold">Giao dịch chốt</th>
                <th className="px-4 py-2.5 font-semibold">Hoa hồng quý</th>
                <th className="px-4 py-2.5 font-semibold">Cấp bậc</th>
              </tr>
            </thead>
            <tbody>
              {AFFILIATE_LEADERBOARD.map((r) => (
                <tr
                  key={r.rank}
                  className={`border-b border-slate-50 last:border-0 ${
                    r.rank === 1 ? "bg-amber-50/50" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-base">
                    {medal[r.rank - 1] ?? (
                      <span className="text-sm font-bold text-slate-500">
                        #{r.rank}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-700">
                    {r.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{r.region}</td>
                  <td className="px-4 py-3 font-mono font-semibold text-slate-700">
                    {r.deals}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono font-bold text-realtor-ink">
                    {r.earnings}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        r.tierId === "vang"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      Đối tác {tierName[r.tierId] ?? r.tierId}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/** Kho tài liệu marketing — banner/QR/caption mẫu cho đối tác */
export function AffiliateMarketingKit() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-realtor-ink sm:text-3xl">
            Kho tài liệu marketing sẵn dùng
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
            Không cần biết thiết kế — tải banner, video, QR đã gắn sẵn mã của
            bạn và đăng ngay.
          </p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MARKETING_ASSETS.map((a) => (
            <div
              key={a.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Thumbnail gradient placeholder (thay bằng ảnh thật sau) */}
              <div
                className={`flex h-28 items-center justify-center bg-gradient-to-br ${a.gradient}`}
              >
                <Icon name={a.icon} className="h-9 w-9 text-white/90" />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-realtor-ink">{a.name}</h3>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {a.spec}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {a.desc}
                </p>
                <button
                  type="button"
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-realtor-200 py-2 text-xs font-semibold text-realtor-500 hover:bg-realtor-50"
                >
                  <Icon name="Download" className="h-3.5 w-3.5" />
                  Tải về
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** FAQ dùng <details> thuần — không cần JS phía client */
export function AffiliateFaqSection() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
      <h2 className="text-center text-2xl font-bold text-realtor-ink sm:text-3xl">
        Câu hỏi thường gặp
      </h2>
      <div className="mt-8 space-y-3">
        {AFFILIATE_FAQS.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-realtor-ink [&::-webkit-details-marker]:hidden">
              {f.q}
              <Icon
                name="ChevronDown"
                className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
              />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/** CTA đăng ký cuối trang */
export function AffiliateCta() {
  return (
    <section id="dang-ky" className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-14 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-realtor-500 px-8 py-10 text-center sm:flex-row sm:text-left">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Sẵn sàng có nguồn thu nhập mới?
          </h2>
          <p className="mt-2 max-w-lg text-sm text-realtor-50/90">
            Đăng ký miễn phí, nhận link giới thiệu trong 2 phút. Đối tác đầu tiên
            trong khu vực còn được ưu tiên phân bổ khách hàng.
          </p>
        </div>
        <AffiliateSignupButton variant="solid" />
      </div>
    </section>
  );
}
