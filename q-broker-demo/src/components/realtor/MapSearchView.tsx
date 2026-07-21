"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Icon } from "@/components/ui/Icon";
import { PropertyModal } from "./PropertyModal";
import { LISTINGS, Listing, formatVnd } from "@/data/realtorListings";
import {
  CITY_MARKS,
  LISTING_COORDS,
  REGION_LABELS,
  VB_H,
  VB_W,
  VN_PATH,
  vbX,
  vbY,
} from "@/data/geo";

// =============================================================
// BẢN ĐỒ TÌM BĐS  (/realtor/ban-do)
// Bố cục kiểu Zillow: bản đồ (trái) + danh sách (phải), đồng bộ 2 chiều.
// - Bản đồ VN cách điệu: viền đất liền, lưới kinh/vĩ tuyến, nhãn thành phố,
//   la bàn & thước tỉ lệ. Pin GIÁ tô màu theo mức giá (có chú giải).
// - Rê chuột lên pin/thẻ -> hiện thẻ xem nhanh có ảnh; bấm -> mở chi tiết.
// - Bộ lọc: từ khoá, khu vực, khoảng giá, số phòng ngủ + sắp xếp.
// =============================================================

// Khoảng giá (VND). max = null nghĩa là không giới hạn trên.
const PRICE_RANGES: { label: string; min: number; max: number | null }[] = [
  { label: "Mọi mức giá", min: 0, max: null },
  { label: "Dưới 3 tỷ", min: 0, max: 3_000_000_000 },
  { label: "3 - 7 tỷ", min: 3_000_000_000, max: 7_000_000_000 },
  { label: "7 - 15 tỷ", min: 7_000_000_000, max: 15_000_000_000 },
  { label: "Trên 15 tỷ", min: 15_000_000_000, max: null },
];

const BED_OPTIONS = [0, 1, 2, 3, 4]; // 0 = không lọc, còn lại là "tối thiểu"

const REGIONS = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "Bình Dương",
  "Đồng Nai",
  "Nha Trang",
  "Vũng Tàu",
  "Huế",
  "Quảng Ninh",
  "Bắc Ninh",
];

const SORTS = [
  { value: "default", label: "Liên quan nhất" },
  { value: "price-asc", label: "Giá thấp → cao" },
  { value: "price-desc", label: "Giá cao → thấp" },
  { value: "area-desc", label: "Diện tích lớn nhất" },
];

// Bậc giá -> màu pin & chú giải. Đồng bộ với PRICE_RANGES (trừ "mọi mức").
const TIERS = [
  { label: "Dưới 3 tỷ", dot: "bg-emerald-500", text: "text-emerald-700", border: "border-emerald-300" },
  { label: "3 - 7 tỷ", dot: "bg-sky-500", text: "text-sky-700", border: "border-sky-300" },
  { label: "7 - 15 tỷ", dot: "bg-violet-500", text: "text-violet-700", border: "border-violet-300" },
  { label: "Trên 15 tỷ", dot: "bg-rose-500", text: "text-rose-700", border: "border-rose-300" },
];

function priceTier(price: number): number {
  if (price < 3_000_000_000) return 0;
  if (price < 7_000_000_000) return 1;
  if (price < 15_000_000_000) return 2;
  return 3;
}

export function MapSearchView() {
  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState<string>(""); // "" = tất cả
  const [priceIdx, setPriceIdx] = useState(0);
  const [minBeds, setMinBeds] = useState(0);
  const [sort, setSort] = useState("default");

  const [hoverId, setHoverId] = useState<string | null>(null); // pin/thẻ đang rê
  const [detail, setDetail] = useState<Listing | null>(null); // popup chi tiết

  // Refs tới từng thẻ trong danh sách -> cuộn tới khi bấm pin.
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  // Đo kích thước khung bản đồ để tách các pin chồng nhau (theo pixel).
  const mapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Chiếu (lng, lat) -> vị trí % trong khung, khớp với SVG dùng
  // preserveAspectRatio="xMidYMid meet" (căn giữa, giữ đúng tỉ lệ, không méo).
  const project = useCallback(
    (lng: number, lat: number) => {
      const { w, h } = size;
      if (!w || !h) {
        return { x: (vbX(lng) / VB_W) * 100, y: (vbY(lat) / VB_H) * 100 };
      }
      const scale = Math.min(w / VB_W, h / VB_H);
      const tx = (w - VB_W * scale) / 2;
      const ty = (h - VB_H * scale) / 2;
      return {
        x: ((tx + vbX(lng) * scale) / w) * 100,
        y: ((ty + vbY(lat) * scale) / h) * 100,
      };
    },
    [size]
  );

  const filtered = useMemo(() => {
    const price = PRICE_RANGES[priceIdx];
    const kw = keyword.trim().toLowerCase();
    return LISTINGS.filter((l) => {
      if (region && l.region !== region) return false;
      if (l.price < price.min) return false;
      if (price.max !== null && l.price > price.max) return false;
      if (minBeds && l.beds < minBeds) return false;
      if (kw) {
        const hay = `${l.address} ${l.city} ${l.broker}`.toLowerCase();
        if (!hay.includes(kw)) return false;
      }
      return true;
    });
  }, [keyword, region, priceIdx, minBeds]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === "price-asc") arr.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") arr.sort((a, b) => b.price - a.price);
    else if (sort === "area-desc") arr.sort((a, b) => b.area - a.area);
    return arr;
  }, [filtered, sort]);

  const filteredIds = useMemo(
    () => new Set(filtered.map((l) => l.id)),
    [filtered]
  );

  // Bố trí pin: gom các pin ĐANG HIỂN THỊ ở gần nhau (< NGƯỠNG px) rồi "xoè"
  // thành vòng nhỏ quanh tâm chùm, kèm toạ độ tâm (ax, ay) để vẽ đường nối.
  // Vị trí trả về theo % để pin & đường nối luôn khớp khung dù đổi kích thước.
  const layout = useMemo(() => {
    const m: Record<
      string,
      { x: number; y: number; ax: number; ay: number; clustered: boolean }
    > = {};
    const pts = LISTINGS.filter((l) => filteredIds.has(l.id)).map((l) => {
      const c = LISTING_COORDS[l.id];
      const p = project(c.lng, c.lat);
      return { id: l.id, x: p.x, y: p.y };
    });
    const { w, h } = size;
    if (!w || !h) {
      pts.forEach((p) => {
        m[p.id] = { x: p.x, y: p.y, ax: p.x, ay: p.y, clustered: false };
      });
      return m;
    }
    // Toạ độ pixel để đo khoảng cách thực.
    const px = pts.map((p) => ({ ...p, pxx: (p.x / 100) * w, pxy: (p.y / 100) * h }));
    const TH = 50; // px: pin gần hơn mức này coi như chồng nhau
    const used = new Array(px.length).fill(false);
    for (let i = 0; i < px.length; i++) {
      if (used[i]) continue;
      const g = [i];
      used[i] = true;
      for (let j = i + 1; j < px.length; j++) {
        if (used[j]) continue;
        if (Math.hypot(px[i].pxx - px[j].pxx, px[i].pxy - px[j].pxy) < TH) {
          g.push(j);
          used[j] = true;
        }
      }
      if (g.length === 1) {
        const p = px[i];
        m[p.id] = { x: p.x, y: p.y, ax: p.x, ay: p.y, clustered: false };
        continue;
      }
      // Tâm chùm + bán kính xoè (to dần theo số pin).
      const cx = g.reduce((s, k) => s + px[k].pxx, 0) / g.length;
      const cy = g.reduce((s, k) => s + px[k].pxy, 0) / g.length;
      const R = Math.min(64, 30 + (g.length - 2) * 10);
      g.forEach((k, idx) => {
        const ang = -Math.PI / 2 + idx * ((2 * Math.PI) / g.length);
        const nx = Math.max(34, Math.min(w - 34, cx + R * Math.cos(ang)));
        const ny = Math.max(20, Math.min(h - 20, cy + R * Math.sin(ang)));
        m[px[k].id] = {
          x: (nx / w) * 100,
          y: (ny / h) * 100,
          ax: (cx / w) * 100,
          ay: (cy / h) * 100,
          clustered: true,
        };
      });
    }
    return m;
  }, [size, filteredIds, project]);

  // Thống kê nhanh cho thanh trên danh sách.
  const stats = useMemo(() => {
    if (filtered.length === 0) return null;
    const prices = filtered.map((l) => l.price);
    const avg = prices.reduce((s, p) => s + p, 0) / prices.length;
    return { avg, min: Math.min(...prices), max: Math.max(...prices) };
  }, [filtered]);

  const resetFilters = () => {
    setKeyword("");
    setRegion("");
    setPriceIdx(0);
    setMinBeds(0);
  };

  const hasFilter = keyword || region || priceIdx !== 0 || minBeds !== 0;

  // Bấm pin -> cuộn thẻ tương ứng vào tầm nhìn + đánh dấu.
  const focusCard = (id: string) => {
    setHoverId(id);
    cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Tin đang rê (để dựng thẻ xem nhanh nổi trên bản đồ).
  const hovered = hoverId ? LISTINGS.find((l) => l.id === hoverId) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
      {/* Tiêu đề */}
      <div className="mb-4">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-realtor-ink">
          <Icon name="Map" className="h-6 w-6 text-realtor-500" />
          Bản đồ tìm bất động sản
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Duyệt sản phẩm đã thẩm định theo vị trí trên bản đồ Việt Nam — rê chuột
          để xem nhanh, bấm để mở chi tiết.
        </p>
      </div>

      {/* Thanh lọc */}
      <div className="sticky top-16 z-20 mb-5 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          {/* Ô tìm từ khoá */}
          <div className="relative min-w-[180px] flex-1">
            <Icon
              name="Search"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo địa chỉ, khu vực, môi giới..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-realtor-500 focus:bg-white"
            />
          </div>

          {/* Khu vực */}
          <FilterSelect
            value={region}
            onChange={setRegion}
            icon="MapPin"
            options={[
              { value: "", label: "Toàn quốc" },
              ...REGIONS.map((r) => ({ value: r, label: r })),
            ]}
          />

          {/* Khoảng giá */}
          <FilterSelect
            value={String(priceIdx)}
            onChange={(v) => setPriceIdx(Number(v))}
            icon="Tag"
            options={PRICE_RANGES.map((p, i) => ({
              value: String(i),
              label: p.label,
            }))}
          />

          {/* Số phòng ngủ */}
          <FilterSelect
            value={String(minBeds)}
            onChange={(v) => setMinBeds(Number(v))}
            icon="BedDouble"
            options={BED_OPTIONS.map((b) => ({
              value: String(b),
              label: b === 0 ? "Mọi số PN" : `${b}+ PN`,
            }))}
          />

          {hasFilter && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              <Icon name="X" className="h-4 w-4" />
              Xoá lọc
            </button>
          )}
        </div>
      </div>

      {/* Bố cục: bản đồ + danh sách */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_400px]">
        {/* --- BẢN ĐỒ --- */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div
            ref={mapRef}
            className="relative h-[46vh] overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-sky-100 via-sky-50 to-cyan-50 shadow-inner ring-1 ring-inset ring-white/60 lg:h-[calc(100vh-11rem)]"
          >
            {/* Nền: viền VN đúng tỉ lệ (căn giữa) + lưới kinh/vĩ tuyến thật */}
            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0 h-full w-full"
              aria-hidden
            >
              <defs>
                <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ecfdf5" />
                  <stop offset="55%" stopColor="#d1fae5" />
                  <stop offset="100%" stopColor="#a7f3d0" />
                </linearGradient>
                <filter id="landShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow
                    dx="0"
                    dy="0.12"
                    stdDeviation="0.3"
                    floodColor="#0f766e"
                    floodOpacity="0.35"
                  />
                </filter>
              </defs>

              {/* Lưới kinh tuyến (dọc) tại các độ nguyên */}
              {[102, 104, 106, 108, 110].map((lng) => (
                <line
                  key={`lng${lng}`}
                  x1={vbX(lng)}
                  y1={0}
                  x2={vbX(lng)}
                  y2={VB_H}
                  stroke="#0ea5e9"
                  strokeWidth={0.02}
                  strokeOpacity={0.18}
                />
              ))}
              {/* Lưới vĩ tuyến (ngang) tại các độ nguyên */}
              {[8, 10, 12, 14, 16, 18, 20, 22].map((lat) => (
                <line
                  key={`lat${lat}`}
                  x1={0}
                  y1={vbY(lat)}
                  x2={VB_W}
                  y2={vbY(lat)}
                  stroke="#0ea5e9"
                  strokeWidth={0.02}
                  strokeOpacity={0.18}
                />
              ))}

              {/* Quầng bờ biển (halo) làm mềm rìa đất liền */}
              <path
                d={VN_PATH}
                fill="none"
                stroke="#5eead4"
                strokeWidth={0.16}
                strokeOpacity={0.6}
                strokeLinejoin="round"
              />
              {/* Đất liền Việt Nam */}
              <path
                d={VN_PATH}
                fill="url(#landGrad)"
                stroke="#059669"
                strokeWidth={0.05}
                strokeLinejoin="round"
                filter="url(#landShadow)"
              />
            </svg>

            {/* Nhãn thành phố lớn (mốc địa lý, mờ, dưới lớp pin) */}
            {CITY_MARKS.map((c) => {
              const pos = project(c.lng, c.lat);
              return (
              <span
                key={c.name}
                className="pointer-events-none absolute z-[1] flex items-center gap-0.5 whitespace-nowrap text-[10px] font-medium text-slate-500/70"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span className="h-1 w-1 rounded-full bg-slate-400/70" />
                {c.name}
              </span>
              );
            })}

            {/* Nhãn 3 miền */}
            {REGION_LABELS.map((r) => {
              const pos = project(r.lng, r.lat);
              return (
              <span
                key={r.label}
                className="pointer-events-none absolute select-none text-[11px] font-bold uppercase tracking-wider text-emerald-700/40"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {r.label}
              </span>
              );
            })}

            {/* Biển Đông + quần đảo (đặt ở lề biển bên phải) */}
            <span
              className="pointer-events-none absolute select-none text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-600/40"
              style={{ right: "5%", top: "48%", transform: "rotate(90deg)", transformOrigin: "right" }}
            >
              Biển Đông
            </span>
            <Archipelago label="Hoàng Sa" style={{ right: "15%", top: "31%" }} />
            <Archipelago label="Trường Sa" style={{ right: "9%", top: "68%" }} />

            {/* La bàn */}
            <div className="pointer-events-none absolute right-3 top-3 flex h-10 w-10 flex-col items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 shadow-sm">
              <Icon name="Navigation" className="h-4 w-4 -rotate-45 text-rose-500" />
              <span className="text-[8px] font-bold leading-none">B</span>
            </div>

            {/* Chú giải mức giá */}
            <div className="pointer-events-none absolute left-3 top-3 rounded-xl border border-slate-200 bg-white/90 p-2 text-[10px] shadow-sm backdrop-blur">
              <p className="mb-1 font-bold text-slate-500">MỨC GIÁ</p>
              <div className="space-y-0.5">
                {TIERS.map((t) => (
                  <div key={t.label} className="flex items-center gap-1.5">
                    <span className={"h-2 w-2 rounded-full " + t.dot} />
                    <span className="text-slate-600">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Đường nối từ tâm chùm tới các pin đã xoè */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
              aria-hidden
            >
              {LISTINGS.filter(
                (l) => filteredIds.has(l.id) && layout[l.id]?.clustered
              ).map((l) => {
                const p = layout[l.id];
                return (
                  <line
                    key={l.id}
                    x1={p.ax}
                    y1={p.ay}
                    x2={p.x}
                    y2={p.y}
                    stroke="#64748b"
                    strokeWidth={0.12}
                    strokeOpacity={0.5}
                  />
                );
              })}
            </svg>

            {/* Pin giá — chỉ hiện tin khớp bộ lọc, đã tách chùm nên không đè nhau */}
            {LISTINGS.map((l) => {
              const p = layout[l.id];
              if (!p || !filteredIds.has(l.id)) return null;
              const active = hoverId === l.id;
              const t = TIERS[priceTier(l.price)];
              return (
                <button
                  key={l.id}
                  type="button"
                  onMouseEnter={() => setHoverId(l.id)}
                  onMouseLeave={() => setHoverId((v) => (v === l.id ? null : v))}
                  onClick={() => setDetail(l)}
                  aria-label={`${formatVnd(l.price)} — ${l.address}`}
                  className={
                    "absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-bold shadow-md transition-all " +
                    (active
                      ? "z-30 scale-110 border-realtor-600 bg-realtor-600 text-white"
                      : `z-10 bg-white ${t.border} ${t.text} hover:z-20 hover:scale-105`)
                  }
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  {formatVnd(l.price)}
                </button>
              );
            })}

            {/* Thẻ xem nhanh nổi trên pin đang rê */}
            {hovered && layout[hovered.id] && (
              <div
                className="pointer-events-none absolute z-40 w-52 -translate-x-1/2 -translate-y-[calc(100%+14px)] animate-pop-in"
                style={{
                  left: `${layout[hovered.id].x}%`,
                  top: `${layout[hovered.id].y}%`,
                }}
              >
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                  <div className="relative h-24 w-full bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={hovered.image}
                      alt={hovered.address}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-xs font-bold text-white">
                      {formatVnd(hovered.price)}
                    </span>
                  </div>
                  <div className="p-2">
                    <p className="truncate text-xs font-semibold text-slate-800">
                      {hovered.address}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                      {hovered.city}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-600">
                      <span>{hovered.beds} PN</span>
                      <span className="text-slate-300">·</span>
                      <span>{hovered.baths} WC</span>
                      <span className="text-slate-300">·</span>
                      <span>{hovered.area} m²</span>
                    </p>
                  </div>
                </div>
                {/* Mũi nhọn chỉ xuống pin */}
                <div className="mx-auto h-3 w-3 -translate-y-1.5 rotate-45 border-b border-r border-slate-200 bg-white" />
              </div>
            )}

            {/* Thước tỉ lệ (minh hoạ) */}
            <div className="pointer-events-none absolute bottom-3 right-3 flex flex-col items-end gap-1">
              <div className="flex items-end gap-0.5">
                <span className="h-2 w-8 border-b-2 border-l-2 border-r-2 border-slate-500/70" />
              </div>
              <span className="rounded bg-white/80 px-1.5 text-[10px] font-semibold text-slate-500">
                ~200 km
              </span>
            </div>

            {/* Số kết quả */}
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
              {filtered.length} bất động sản
            </div>
          </div>
        </div>

        {/* --- DANH SÁCH --- */}
        <div>
          {/* Thanh thống kê + sắp xếp */}
          <div className="mb-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-realtor-ink">
                {filtered.length} kết quả
                {region ? ` · ${region}` : " · toàn quốc"}
              </p>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-7 text-xs font-semibold text-slate-700 outline-none focus:border-realtor-500 focus:bg-white"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <Icon
                  name="ChevronDown"
                  className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
            {stats && (
              <div className="mt-2 grid grid-cols-3 gap-2 border-t border-slate-100 pt-2 text-center">
                <Stat label="Giá TB" value={formatVnd(stats.avg)} />
                <Stat label="Thấp nhất" value={formatVnd(stats.min)} />
                <Stat label="Cao nhất" value={formatVnd(stats.max)} />
              </div>
            )}
          </div>

          {sorted.length > 0 ? (
            <div className="space-y-3 lg:max-h-[calc(100vh-16rem)] lg:overflow-y-auto lg:pr-1">
              {sorted.map((l) => (
                <MapListCard
                  key={l.id}
                  ref={(el) => {
                    cardRefs.current[l.id] = el;
                  }}
                  listing={l}
                  active={hoverId === l.id}
                  onHover={() => setHoverId(l.id)}
                  onLeave={() =>
                    setHoverId((v) => (v === l.id ? null : v))
                  }
                  onOpen={() => setDetail(l)}
                  onLocate={() => focusCard(l.id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center">
              <Icon
                name="MapPinOff"
                className="mx-auto h-8 w-8 text-slate-300"
              />
              <p className="mt-2 text-sm font-semibold text-slate-600">
                Không có bất động sản khớp bộ lọc
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 text-sm font-semibold text-realtor-500 hover:text-realtor-600"
              >
                Xoá bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Popup chi tiết (tái dùng của trang listings) */}
      {detail && (
        <PropertyModal listing={detail} onClose={() => setDetail(null)} />
      )}
    </div>
  );
}

// ---- Cụm quần đảo (minh hoạ, đặt ở vùng biển) ----
function Archipelago({
  label,
  style,
}: {
  label: string;
  style: React.CSSProperties;
}) {
  return (
    <div
      className="pointer-events-none absolute flex flex-col items-center gap-0.5"
      style={style}
    >
      <div className="flex flex-wrap justify-center gap-[3px] px-1" style={{ width: 26 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="h-[3px] w-[3px] rounded-full bg-emerald-600/40" />
        ))}
      </div>
      <span className="whitespace-nowrap text-[9px] font-medium text-slate-500/70">
        {label}
      </span>
    </div>
  );
}

// ---- Ô thống kê nhỏ ----
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="text-sm font-bold text-realtor-ink">{value}</p>
    </div>
  );
}

// ---- Ô chọn (select) có icon, style đồng bộ thanh lọc ----
function FilterSelect({
  value,
  onChange,
  icon,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  icon: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <Icon
        name={icon}
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-sm font-semibold text-slate-700 outline-none focus:border-realtor-500 focus:bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Icon
        name="ChevronDown"
        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

// ---- Thẻ tin gọn trong danh sách (đồng bộ hover với pin) ----
// Dùng forwardRef để cha cuộn tới thẻ khi bấm pin trên bản đồ.
const MapListCard = forwardRef<
  HTMLElement,
  {
    listing: Listing;
    active: boolean;
    onHover: () => void;
    onLeave: () => void;
    onOpen: () => void;
    onLocate: () => void;
  }
>(function MapListCard(
  { listing, active, onHover, onLeave, onOpen, onLocate },
  ref
) {
  const tier = TIERS[priceTier(listing.price)];
  return (
    <article
      ref={ref}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onOpen}
      className={
        "group flex cursor-pointer gap-3 rounded-2xl border bg-white p-2.5 shadow-sm transition-all " +
        (active
          ? "border-realtor-500 ring-2 ring-realtor-200"
          : "border-slate-200 hover:border-realtor-200 hover:shadow-md")
      }
    >
      {/* Ảnh */}
      <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing.image}
          alt={listing.address}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {listing.tag && (
          <span className="absolute left-1.5 top-1.5 rounded bg-realtor-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {listing.tag.split(" - ")[0]}
          </span>
        )}
        <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-0.5 rounded-full bg-white/95 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 shadow">
          <Icon name="BadgeCheck" className="h-3 w-3" />
          Đã thẩm định
        </span>
      </div>

      {/* Thông tin */}
      <div className="min-w-0 flex-1 py-0.5">
        <div className="flex items-start justify-between gap-2">
          <p className={"text-lg font-bold " + tier.text}>
            {formatVnd(listing.price)}
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onLocate();
            }}
            className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-realtor-50 hover:text-realtor-500"
            aria-label="Xem trên bản đồ"
            title="Xem trên bản đồ"
          >
            <Icon name="MapPin" className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-slate-600">
          <span>
            <b className="font-semibold">{listing.beds}</b> PN
          </span>
          <span className="text-slate-300">·</span>
          <span>
            <b className="font-semibold">{listing.baths}</b> WC
          </span>
          <span className="text-slate-300">·</span>
          <span>
            <b className="font-semibold">
              {listing.area.toLocaleString("vi-VN")}
            </b>{" "}
            m²
          </span>
        </p>
        <p className="mt-1 truncate text-sm font-medium text-slate-800">
          {listing.address}
        </p>
        <p className="truncate text-xs text-slate-500">{listing.city}</p>
      </div>
    </article>
  );
});
