"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  PHOTOS,
  type ContactRow,
  type Photo,
  type ProfileData,
  type SocialRow,
} from "@/data/profile";
import { CATEGORY_LABEL, type NewsArticle } from "@/data/news";
import { type Listing } from "@/data/realtorListings";
import { PropertyCard } from "./PropertyCard";

// =============================================================
// TRANG CÁ NHÂN (danh thiếp số) — /realtor/profile
// Phong cách hiện đại: hero gradient + avatar viền gradient + huy hiệu xác
// thực, tab dạng pill nổi, thẻ liên hệ dạng tile, bài viết có featured.
//   Tab: Giới thiệu · Bài viết · Ảnh · Sản phẩm
// - Bài viết: bài đã đăng trên web (news.ts) · Sản phẩm: giỏ hàng (realtorListings.ts)
// Ảnh nền dùng CSS background -> lỗi tải cũng không "vỡ". Nút là demo.
// =============================================================

type TabKey = "about" | "articles" | "photos" | "products";

export function ProfileView({ profile }: { profile: ProfileData }) {
  const [tab, setTab] = useState<TabKey>("about");
  const [shareOpen, setShareOpen] = useState(false);

  // Nhãn tab "Bài viết" & "Sản phẩm" đổi theo role.
  const tabs: { key: TabKey; label: string }[] = [
    { key: "about", label: "Giới thiệu" },
    { key: "articles", label: profile.articlesLabel },
    { key: "photos", label: "Ảnh" },
    { key: "products", label: profile.productsLabel },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* ---------- HERO ---------- */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, ${profile.coverFrom}, ${profile.coverVia} 55%, ${profile.coverTo})`,
        }}
      >
        {/* Ảnh bìa thật (CSS background: lỗi tải -> lộ gradient nền, không "vỡ") */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${profile.coverImage}")` }}
        />
        {/* Phủ màu thương hiệu + tối để chữ trắng nổi rõ trên ảnh */}
        <div className="absolute inset-0 bg-gradient-to-br from-realtor-ink/90 via-realtor-700/75 to-realtor-500/60" />

        {/* Đốm sáng + hoạ tiết chấm trang trí */}
        <div className="absolute -right-24 -top-24 h-72 w-72 animate-float rounded-full bg-flame-500/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,.6) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-4 py-12 text-center sm:py-14">
          {/* Avatar viền gradient + huy hiệu xác thực */}
          <div className="mx-auto w-fit">
            <div className="relative rounded-full bg-gradient-to-br from-flame-400 to-realtor-200 p-1 shadow-2xl">
              <Avatar
                name={profile.name}
                color={profile.avatarColor}
                image={profile.avatarImage}
                className="h-28 w-28 text-4xl ring-4 ring-white/90 sm:h-32 sm:w-32 sm:text-5xl"
              />
              <span className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-realtor-500 ring-2 ring-white">
                <Icon name="BadgeCheck" className="h-5 w-5 text-white" />
              </span>
            </div>
          </div>

          <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
            {profile.name}
          </h1>
          <p className="mt-1 text-sm font-medium text-white/75">
            {profile.headline}
          </p>

          {/* Thống kê dạng pill kính mờ (theo từng role) */}
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {profile.stats.map((s) => (
              <StatPill key={s.label} value={s.value} label={s.label} />
            ))}
          </div>

          {/* Nút hành động */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-realtor-700 shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <Icon name="Share2" className="h-4 w-4" />
              Chia sẻ
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              <Icon name="Pencil" className="h-4 w-4" />
              Chỉnh sửa trang cá nhân
            </button>
          </div>
        </div>
      </section>

      {/* ---------- TAB dạng pill (nổi, đè lên hero) ---------- */}
      {/* relative z-20: hero là positioned nên phải nâng z-index thanh tab lên
          trên, nếu không nền hero sẽ vẽ che mất thanh tab. */}
      <div className="relative z-20 mx-auto -mt-6 max-w-4xl px-4">
        <div className="flex justify-center">
          <div className="inline-flex gap-1 overflow-x-auto rounded-full border border-slate-200 bg-white p-1.5 shadow-lg">
            {tabs.map((t) => {
              const active = t.key === tab;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={
                    "shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-colors " +
                    (active
                      ? "bg-realtor-500 text-white shadow"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700")
                  }
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------- Nội dung theo tab ---------- */}
      <div className="mx-auto mt-8 max-w-5xl px-4">
        {tab === "about" && <AboutTab profile={profile} />}
        {tab === "articles" && <ArticlesTab articles={profile.articles} />}
        {tab === "photos" && <PhotosTab />}
        {tab === "products" && <ProductsTab listings={profile.products} />}
      </div>

      {/* Popup chia sẻ (Facebook / Zalo / QR / sao chép link) */}
      {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}
    </div>
  );
}

// ---------- Popup chia sẻ ----------
function ShareModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const enc = encodeURIComponent(url);
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${enc}`;
  const fbHref = `https://www.facebook.com/sharer/sharer.php?u=${enc}`;
  const zaloHref = `https://sp.zalo.me/share?url=${enc}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard bị chặn */
    }
  };

  // Đóng bằng phím Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm animate-pop-in rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-realtor-ink">
            Chia sẻ trang cá nhân
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
            aria-label="Đóng"
          >
            <Icon name="X" className="h-5 w-5" />
          </button>
        </div>

        {/* Mã QR */}
        <div className="flex flex-col items-center">
          <div className="rounded-2xl border border-slate-200 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qr}
              alt="Mã QR trang cá nhân"
              width={176}
              height={176}
              className="h-44 w-44"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">Quét mã QR để mở trang</p>
        </div>

        {/* Lựa chọn chia sẻ */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <ShareOption href={fbHref} label="Facebook" icon="Facebook" bg="#1877F2" />
          <ShareOption href={zaloHref} label="Zalo" icon="MessageCircle" bg="#0068FF" />
          <button
            type="button"
            onClick={copy}
            className="flex flex-col items-center gap-2"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-700">
              <Icon name={copied ? "Check" : "Link"} className="h-6 w-6" />
            </span>
            <span className="text-xs font-medium text-slate-600">
              {copied ? "Đã chép!" : "Sao chép"}
            </span>
          </button>
        </div>

        {/* Ô link + nút chép */}
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="truncate text-xs text-slate-500">{url}</span>
          <button
            type="button"
            onClick={copy}
            className="ml-auto shrink-0 rounded-lg bg-realtor-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-realtor-600"
          >
            {copied ? "Đã chép" : "Chép"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ShareOption({
  href,
  label,
  icon,
  bg,
}: {
  href: string;
  label: string;
  icon: string;
  bg: string; // màu thương hiệu của nền tảng (Facebook/Zalo)
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-2"
    >
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full text-white transition-transform hover:-translate-y-0.5"
        style={{ backgroundColor: bg }}
      >
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <span className="text-xs font-medium text-slate-600">{label}</span>
    </a>
  );
}

// ---------- Tab: Giới thiệu (danh thiếp) ----------
function AboutTab({ profile }: { profile: ProfileData }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Bio */}
      <Card>
        <p className="text-center text-[15px] leading-relaxed text-slate-600">
          {profile.bio}
        </p>
      </Card>

      {/* Thông tin liên hệ dạng tile */}
      <div>
        <SectionTitle icon="Contact" title="Thông tin liên hệ" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {profile.contact.map((c) => (
            <ContactTile key={c.label} row={c} />
          ))}
        </div>
      </div>

      {/* Mạng xã hội dạng chip */}
      <div>
        <SectionTitle icon="Share2" title="Mạng xã hội" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {profile.socials.map((s) => (
            <SocialTile key={s.label} row={s} />
          ))}
        </div>
      </div>

      {/* vCard */}
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-flame-500 to-realtor-500 py-4 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5"
      >
        <Icon name="Download" className="h-5 w-5" />
        Tải xuống danh thiếp (vCard)
      </button>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400">
      {text}
    </div>
  );
}

// ---------- Tab: Bài viết ----------
function ArticlesTab({ articles }: { articles: NewsArticle[] }) {
  if (articles.length === 0) return <EmptyState text="Chưa có bài viết." />;
  const [featured, ...rest] = articles;
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <FeaturedArticle article={featured} />
      <div className="space-y-4">
        {rest.map((a) => (
          <ArticleRow key={a.id} article={a} />
        ))}
      </div>
    </div>
  );
}

// ---------- Tab: Ảnh ----------
function PhotosTab() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {PHOTOS.map((p) => (
        <PhotoTile key={p.id} photo={p} />
      ))}
    </div>
  );
}

// ---------- Tab: Sản phẩm ----------
function ProductsTab({ listings }: { listings: Listing[] }) {
  if (listings.length === 0) return <EmptyState text="Chưa có sản phẩm." />;
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((l) => (
        <PropertyCard key={l.id} listing={l} />
      ))}
    </div>
  );
}

// ================= Thành phần con =================

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm " + className
      }
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 px-1 text-base font-bold text-realtor-ink">
      <Icon name={icon} className="h-5 w-5 text-realtor-500" />
      {title}
    </h2>
  );
}

function Avatar({
  name,
  color,
  image,
  className = "",
}: {
  name: string;
  color: string;
  image?: string;
  className?: string;
}) {
  return (
    <span
      className={
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold text-white " +
        className
      }
      style={{ backgroundColor: color }}
    >
      {/* Chữ cái đầu làm NỀN DỰ PHÒNG (hiện nếu ảnh lỗi tải) */}
      <span className="relative">{name.charAt(0).toUpperCase()}</span>
      {image && (
        <span
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${image}")` }}
        />
      )}
    </span>
  );
}

function StatPill({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-2 text-center backdrop-blur">
      <p className="text-lg font-bold leading-none text-white">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-white/60">
        {label}
      </p>
    </div>
  );
}

function ContactTile({ row }: { row: ContactRow }) {
  const inner = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-realtor-50 text-realtor-500">
        <Icon name={row.icon} className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-400">{row.label}</p>
        <p className="truncate text-sm font-semibold text-realtor-ink">
          {row.value}
        </p>
      </div>
    </>
  );
  const cls =
    "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-realtor-200 hover:shadow-md";
  return row.href ? (
    <a href={row.href} className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

function SocialTile({ row }: { row: SocialRow }) {
  return (
    <a
      href={row.href ?? "#"}
      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-realtor-200 hover:shadow-md"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
        <Icon name={row.icon} className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-400">{row.label}</p>
        <p className="truncate text-sm font-semibold text-realtor-500">
          {row.value}
        </p>
      </div>
    </a>
  );
}

function PhotoTile({ photo }: { photo: Photo }) {
  return (
    <div
      className="group overflow-hidden rounded-2xl shadow-sm"
      // Gradient nền dự phòng: nếu ảnh thật lỗi tải, ô vẫn có màu (không "vỡ").
      style={{
        backgroundImage: `linear-gradient(135deg, ${photo.from}, ${photo.to})`,
      }}
    >
      <div
        className="aspect-square w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url("${photo.image}")` }}
      />
    </div>
  );
}

// Bài viết nổi bật (ảnh lớn, chữ đè trên ảnh)
function FeaturedArticle({ article }: { article: NewsArticle }) {
  return (
    <article className="group relative overflow-hidden rounded-3xl shadow-md">
      <div
        className="aspect-[16/9] w-full bg-slate-200 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url("${article.image}")` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-realtor-ink via-realtor-ink/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <span className="inline-block rounded-full bg-flame-500 px-3 py-1 text-xs font-semibold text-white">
          {CATEGORY_LABEL[article.category]}
        </span>
        <h3 className="mt-2 text-lg font-bold leading-snug text-white sm:text-xl">
          {article.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 text-xs text-white/70">
          <span>{article.author}</span>
          <span>· {article.date}</span>
          <span>· {article.readMins} phút đọc</span>
        </div>
      </div>
    </article>
  );
}

// Dòng bài viết (thumbnail trái + nội dung phải)
function ArticleRow({ article }: { article: NewsArticle }) {
  return (
    <article className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div
        className="h-24 w-32 shrink-0 rounded-xl bg-slate-200 bg-cover bg-center"
        style={{ backgroundImage: `url("${article.image}")` }}
      />
      <div className="min-w-0 flex-1">
        <span className="text-xs font-semibold text-realtor-500">
          {CATEGORY_LABEL[article.category]}
        </span>
        <h3 className="mt-0.5 line-clamp-2 font-bold leading-snug text-realtor-ink group-hover:text-realtor-600">
          {article.title}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs text-slate-400">
          <span>{article.date}</span>
          <span>· {article.readMins} phút</span>
          <span className="flex items-center gap-1">
            · <Icon name="Eye" className="h-3.5 w-3.5" />
            {article.views.toLocaleString("vi-VN")}
          </span>
        </div>
      </div>
    </article>
  );
}
