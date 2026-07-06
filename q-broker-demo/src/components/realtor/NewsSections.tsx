import { Icon } from "@/components/ui/Icon";
import { NewsletterCard } from "@/components/realtor/NewsletterCard";
import { NewsHeroSlider } from "@/components/realtor/NewsHeroSlider";
import {
  CATEGORY_LABEL,
  MARKET_INDEX,
  MOST_READ,
  NEWS_ARTICLES,
  NewsArticle,
} from "@/data/news";

/** Số tin xoay vòng trong hero slider */
const HERO_SLIDES = 5;

// =============================================================
// CÁC KHỐI TĨNH của trang tin tức (server component):
// - NewsFeatured: 1 bài hero lớn + 2 bài phụ (kiểu Zillow Front Porch)
// - NewsSidebar: Đọc nhiều nhất + Chỉ số thị trường + bản tin
//   (kiểu Realtor.com News & Insights)
// =============================================================

/** Dòng meta chung: chuyên mục + ngày + thời gian đọc */
function ArticleMeta({ a, light }: { a: NewsArticle; light?: boolean }) {
  return (
    <p
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs ${
        light ? "text-white/75" : "text-slate-500"
      }`}
    >
      <span
        className={`rounded-full px-2 py-0.5 font-semibold ${
          light ? "bg-white/20 text-white" : "bg-realtor-50 text-realtor-600"
        }`}
      >
        {CATEGORY_LABEL[a.category]}
      </span>
      <span>{a.date}</span>
      <span>·</span>
      <span>{a.readMins} phút đọc</span>
    </p>
  );
}

/** Hero slider (xoay vòng 5 tin nổi bật) + 2 bài phụ */
export function NewsFeatured() {
  const hero = NEWS_ARTICLES.find((a) => a.featured) ?? NEWS_ARTICLES[0];
  const rest = NEWS_ARTICLES.filter((a) => a.id !== hero.id);
  // Slider: bài featured đứng đầu + các bài mới nhất kế tiếp.
  const slides = [hero, ...rest.slice(0, HERO_SLIDES - 1)];
  // 2 bài phụ bên cạnh: lấy tiếp sau nhóm slider để không trùng tin.
  const secondary = rest.slice(HERO_SLIDES - 1, HERO_SLIDES + 1);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 lg:px-8">
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Bài lớn: slider tự chuyển tin (client) */}
        <NewsHeroSlider slides={slides} />

        {/* 2 bài phụ xếp dọc */}
        <div className="grid gap-5">
          {secondary.map((a) => (
            <a
              key={a.id}
              href="#"
              className="group flex gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.image}
                  alt={a.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0">
                <ArticleMeta a={a} />
                <h3 className="mt-1.5 line-clamp-3 text-sm font-bold leading-snug text-realtor-ink group-hover:text-realtor-600">
                  {a.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Sidebar: Đọc nhiều + Chỉ số thị trường + đăng ký bản tin */
export function NewsSidebar() {
  return (
    <aside className="space-y-5">
      {/* Đọc nhiều nhất */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="flex items-center gap-2 text-sm font-bold text-realtor-ink">
          <Icon name="Flame" className="h-4 w-4 text-rose-500" />
          Đọc nhiều nhất
        </p>
        <ol className="mt-4 space-y-4">
          {MOST_READ.map((a, i) => (
            <li key={a.id}>
              <a href="#" className="group flex gap-3">
                <span className="w-6 shrink-0 font-mono text-xl font-extrabold leading-none text-slate-200">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-700 group-hover:text-realtor-600">
                    {a.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {a.views.toLocaleString("vi-VN")} lượt đọc
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ol>
      </div>

      {/* Chỉ số thị trường */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="flex items-center gap-2 text-sm font-bold text-realtor-ink">
          <Icon name="BarChart3" className="h-4 w-4 text-realtor-500" />
          Chỉ số giá căn hộ
        </p>
        <p className="mt-0.5 text-xs text-slate-400">
          Giá trung bình quý II/2026 · so với quý trước
        </p>
        <ul className="mt-3 divide-y divide-slate-100">
          {MARKET_INDEX.map((r) => (
            <li
              key={r.city}
              className="flex items-center justify-between gap-2 py-2.5 text-sm"
            >
              <span className="font-semibold text-slate-700">{r.city}</span>
              <span className="ml-auto font-mono font-semibold text-slate-600">
                {r.price}
              </span>
              <span
                className={`w-14 text-right font-mono text-xs font-bold ${
                  r.change >= 0 ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {r.change >= 0 ? "▲" : "▼"}{" "}
                {Math.abs(r.change).toLocaleString("vi-VN")}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Đăng ký bản tin (client) */}
      <NewsletterCard />
    </aside>
  );
}
