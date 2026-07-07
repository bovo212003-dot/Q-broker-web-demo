"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { RoleId } from "@/types";
import {
  ALLOWED_ROLES,
  JOIN_CONDITIONS,
  MY_INVENTORY,
  MyItemStatus,
  MyShareItem,
  PROPERTY_KINDS,
  SHARED_INVENTORY,
  SHARING_FORMS,
  SHARING_STEPS,
  SOURCE_META,
  SourceKind,
} from "@/data/sharing";
import { cn } from "@/lib/utils";
import { InventoryCard } from "./InventoryCard";
import { ShareForm } from "./ShareForm";

// =============================================================
// TRANG CHIA SẺ GIỎ HÀNG — chỉ dành cho: Môi giới, Sàn giao dịch,
// Ngân hàng (+ Chủ đầu tư ở giai đoạn sau, theo requirement).
// =============================================================

export function ShareCartView({
  roleId,
  roleName,
}: {
  roleId?: RoleId;
  roleName?: string;
}) {
  const allowed = roleId && ALLOWED_ROLES.includes(roleId);

  if (!allowed) return <AccessGate roleName={roleName} />;

  return (
    <Workspace
      roleId={roleId as "broker" | "exchange" | "bank"}
      roleName={roleName ?? ""}
    />
  );
}

// -------- Màn chặn role không được phép --------
function AccessGate({ roleName }: { roleName?: string }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-lg animate-fade-up rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-al-50 text-al-600">
          <Icon name="Lock" className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-al-700">
          Khu vực dành cho đối tác nguồn hàng
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          {roleName ? (
            <>
              Bạn đang xem bằng vai trò <b>{roleName}</b>.{" "}
            </>
          ) : (
            <>Bạn chưa đăng nhập. </>
          )}
          Chia sẻ giỏ hàng là không gian hợp tác nguồn hàng dành riêng cho:
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {["Môi giới", "Sàn giao dịch", "Ngân hàng"].map((r) => (
            <span
              key={r}
              className="rounded-full bg-al-50 px-3.5 py-1.5 text-sm font-semibold text-al-700"
            >
              {r}
            </span>
          ))}
          <span className="rounded-full bg-slate-100 px-3.5 py-1.5 text-sm font-semibold text-slate-400">
            Chủ đầu tư — sắp ra mắt
          </span>
        </div>
        <Link
          href="/"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-al-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-al-700"
        >
          <Icon name="Repeat" className="h-4 w-4" />
          Đổi vai trò để trải nghiệm
        </Link>
      </div>
    </main>
  );
}

// -------- Không gian làm việc chính --------
const HERO_COPY: Record<"broker" | "exchange" | "bank", { title: string; desc: string }> = {
  broker: {
    title: "Có khách mà thiếu hàng? Có hàng mà thiếu khách?",
    desc: "Nhận nguồn hàng đã xác minh từ đồng nghiệp, sàn và ngân hàng — hoặc chia sẻ giỏ hàng của bạn để cả cộng đồng cùng bán.",
  },
  exchange: {
    title: "Phân phối kho hàng của sàn tới 500+ môi giới",
    desc: "Đưa quỹ căn của sàn vào giỏ hàng chung, kiểm soát phạm vi chia sẻ và mở rộng mạng lưới cộng tác viên.",
  },
  bank: {
    title: "Đẩy nhanh chuyển nhượng tài sản thanh lý",
    desc: "Chia sẻ danh mục tài sản bảo đảm đến cộng đồng môi giới đã xác thực — rút ngắn thời gian xử lý tài sản.",
  },
};

const STATS = [
  { value: "156", label: "Nguồn hàng đang chia sẻ" },
  { value: "500+", label: "Môi giới đã xác thực" },
  { value: "100%", label: "Đã thẩm định pháp lý" },
  { value: "22", label: "Giao dịch chung / tháng" },
];

const SOURCE_FILTERS: { key: "all" | SourceKind; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "broker", label: "Môi giới đầu chủ" },
  { key: "exchange", label: "Sàn giao dịch" },
  { key: "bank", label: "Ngân hàng (thanh lý)" },
];

const STATUS_TONE: Record<MyItemStatus, string> = {
  "Đã duyệt": "bg-emerald-50 text-emerald-600 border-emerald-200",
  "Chờ xác minh": "bg-amber-50 text-amber-600 border-amber-200",
  "Yêu cầu bổ sung": "bg-rose-50 text-rose-600 border-rose-200",
};

function Workspace({
  roleId,
  roleName,
}: {
  roleId: "broker" | "exchange" | "bank";
  roleName: string;
}) {
  // Giỏ của tôi (khởi tạo từ mock theo role, thêm mới qua form)
  const [mine, setMine] = useState<MyShareItem[]>(MY_INVENTORY[roleId]);
  const [formOpen, setFormOpen] = useState(false);
  const [justShared, setJustShared] = useState(false);

  // Kho chung: lọc + nhận vào giỏ
  const [source, setSource] = useState<"all" | SourceKind>("all");
  const [kind, setKind] = useState<string>("Tất cả");
  const [q, setQ] = useState("");
  const [receivedIds, setReceivedIds] = useState<string[]>([]);

  const list = useMemo(
    () =>
      SHARED_INVENTORY.filter(
        (i) =>
          (source === "all" || i.source.kind === source) &&
          (kind === "Tất cả" || i.kind === kind) &&
          i.title.toLowerCase().includes(q.trim().toLowerCase())
      ),
    [source, kind, q]
  );

  const toggleReceived = (id: string) =>
    setReceivedIds((arr) =>
      arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]
    );

  const hero = HERO_COPY[roleId];

  return (
    <main className="mx-auto max-w-7xl space-y-12 px-4 py-8 lg:px-8">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-al-700 via-al-600 to-al-500 px-6 py-10 text-white shadow-lg sm:px-12 sm:py-12">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-flame-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/4 h-56 w-56 rounded-full bg-al-300/20 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-10 hidden animate-float lg:block">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
            <Icon name="ShoppingBasket" className="h-8 w-8" />
          </span>
        </div>

        <div className="relative max-w-2xl">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur">
            <Icon name="Share2" className="h-3.5 w-3.5 text-flame-400" />
            Giỏ hàng chung — {roleName}
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            {hero.title}
          </h1>
          <p className="mt-3 max-w-xl text-white/80">{hero.desc}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setFormOpen(true);
                document
                  .getElementById("my-cart")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-flame-500 px-6 py-3.5 font-bold shadow-lg shadow-flame-900/30 transition-all hover:-translate-y-0.5 hover:bg-flame-600"
            >
              <Icon name="PackagePlus" className="h-5 w-5" />
              Chia sẻ nguồn hàng
            </button>
            <a
              href="#marketplace"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-6 py-3.5 font-bold backdrop-blur transition-colors hover:bg-white/20"
            >
              <Icon name="Search" className="h-5 w-5" />
              Khám phá kho chung
            </a>
          </div>
        </div>

        {/* Số liệu */}
        <div className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur"
            >
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-white/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ GIỎ CHIA SẺ CỦA TÔI ============ */}
      <section id="my-cart">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-al-700">
            <Icon name="FolderOpen" className="h-5 w-5 text-flame-500" />
            Nguồn hàng đã chia sẽ
            <span className="rounded-full bg-al-50 px-2.5 py-0.5 text-sm text-al-600">
              {mine.length}
            </span>
          </h2>
          {!formOpen && (
            <button
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-al-200 bg-white px-4 py-2 text-sm font-semibold text-al-600 shadow-sm transition-colors hover:border-al-400"
            >
              <Icon name="Plus" className="h-4 w-4" />
              Chia sẻ nguồn hàng mới
            </button>
          )}
        </div>

        {/* Thông báo gửi thành công */}
        {justShared && (
          <div className="mb-4 flex animate-pop-in items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <Icon name="CheckCircle2" className="h-4 w-4 shrink-0" />
            Đã gửi nguồn hàng! AI Realtor & chuyên gia đang thẩm định — trạng
            thái hiện tại: <b>Chờ xác minh</b>.
          </div>
        )}

        {formOpen && (
          <div className="mb-5">
            <ShareForm
              onCancel={() => setFormOpen(false)}
              onSubmit={(item) => {
                setMine((m) => [item, ...m]);
                setFormOpen(false);
                setJustShared(true);
                setTimeout(() => setJustShared(false), 5000);
              }}
            />
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-3 sm:grid-cols-2">
          {mine.map((m, i) => (
            <div
              key={m.id}
              style={{ animationDelay: `${i * 60}ms` }}
              className="animate-fade-up rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] font-bold",
                    STATUS_TONE[m.status]
                  )}
                >
                  {m.status}
                </span>
                <span className="rounded-full bg-flame-50 px-2.5 py-1 text-[11px] font-bold text-flame-600">
                  Hoa hồng {m.commission}%
                </span>
              </div>
              <h3 className="mt-3 font-bold leading-snug text-slate-800">
                {m.title}
              </h3>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                <Icon name="MapPin" className="h-3.5 w-3.5" />
                {m.area}
                <span className="text-slate-300">·</span>
                {m.kind}
                <span className="text-slate-300">·</span>
                {m.price}
              </p>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs">
                <span className="inline-flex items-center gap-1.5 text-slate-500">
                  <Icon name="Globe" className="h-3.5 w-3.5" />
                  {m.scope}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-al-600">
                  <Icon name="Users" className="h-3.5 w-3.5" />
                  {m.receivers}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ KHO NGUỒN HÀNG CHUNG ============ */}
      <section id="marketplace">
        <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-al-700">
          <Icon name="Store" className="h-5 w-5 text-flame-500" />
          Kho nguồn hàng chung
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Mọi nguồn hàng đều đã qua xác minh của AI Realtor & đội ngũ chuyên
          gia — chọn sản phẩm phù hợp với khách của bạn.
        </p>

        {/* Lọc theo nguồn chia sẻ (3 hình thức) */}
        <div className="flex flex-wrap gap-2">
          {SOURCE_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setSource(f.key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                source === f.key
                  ? "border-al-600 bg-al-600 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-al-300"
              )}
            >
              {f.key !== "all" && (
                <Icon name={SOURCE_META[f.key].icon} className="h-4 w-4" />
              )}
              {f.label}
            </button>
          ))}
        </div>

        {/* Tìm kiếm + lọc loại BĐS */}
        <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm focus-within:border-al-400">
            <Icon name="Search" className="h-5 w-5 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm nguồn hàng theo tên..."
              className="w-full bg-transparent py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm focus:border-al-400 focus:outline-none"
          >
            <option value="Tất cả">Tất cả loại nguồn hàng</option>
            {PROPERTY_KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        {/* Lưới nguồn hàng */}
        {list.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400">
            Không có nguồn hàng nào khớp bộ lọc.
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((item, i) => (
              <div
                key={item.id}
                style={{ animationDelay: `${(i % 6) * 50}ms` }}
                className="animate-fade-up"
              >
                <InventoryCard
                  item={item}
                  received={receivedIds.includes(item.id)}
                  onToggle={() => toggleReceived(item.id)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ============ 3 HÌNH THỨC CHIA SẺ ============ */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-al-700">
          <Icon name="Network" className="h-5 w-5 text-flame-500" />
          Ba hình thức chia sẻ nguồn hàng
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {SHARING_FORMS.map((f, i) => (
            <div
              key={f.title}
              style={{ animationDelay: `${i * 80}ms` }}
              className="group animate-fade-up rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-al-200 hover:shadow-md"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-al-50 text-al-600 transition-transform group-hover:scale-110">
                <Icon name={f.icon} className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-bold leading-snug text-slate-800">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">{f.desc}</p>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-flame-50 px-3 py-1 text-xs font-semibold text-flame-600">
                <Icon name="Sparkles" className="h-3.5 w-3.5" />
                {f.benefit}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ QUY TRÌNH 6 BƯỚC ============ */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-al-700">
          <Icon name="Route" className="h-5 w-5 text-flame-500" />
          Quy trình chia sẻ nguồn hàng
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SHARING_STEPS.map((s, i) => (
            <div key={s.title} className="group relative flex gap-3.5">
              <span className="absolute right-0 top-0 font-mono text-3xl font-black text-slate-100 transition-all duration-300 group-hover:scale-110 group-hover:text-flame-500">
                {i + 1}
              </span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-al-50 text-al-600">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <div className="pr-8">
                <h3 className="font-bold text-slate-800">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ ĐIỀU KIỆN THAM GIA ============ */}
      <section className="rounded-3xl bg-gradient-to-br from-al-700 to-al-500 p-6 text-white shadow-lg sm:p-8">
        <div className="grid items-center gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-bold">Điều kiện tham gia chia sẻ</h2>
            <p className="mt-2 text-sm text-white/75">
              Để bảo đảm chất lượng nguồn hàng, chỉ tài khoản đạt chuẩn mới
              được tham gia. Mọi nguồn hàng đều qua xác minh bởi{" "}
              <b className="text-white">AI Realtor + chuyên gia bất động sản</b>{" "}
              — hạn chế tin giả, giữ giỏ hàng chung luôn sạch.
            </p>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {JOIN_CONDITIONS.map((c) => (
              <p
                key={c}
                className="flex items-start gap-2 rounded-xl bg-white/10 px-3.5 py-3 text-sm backdrop-blur"
              >
                <Icon
                  name="CheckCircle2"
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300"
                />
                {c}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
