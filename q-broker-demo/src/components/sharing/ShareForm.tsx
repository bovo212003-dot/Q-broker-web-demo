"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  MyShareItem,
  PROPERTY_KINDS,
  PropertyKind,
  SHARE_AREAS,
  SHARE_SCOPES,
  ShareScope,
} from "@/data/sharing";
import { cn } from "@/lib/utils";

// Form chia sẻ nguồn hàng mới — theo quy trình PDF: sau khi gửi,
// tin ở trạng thái "Chờ xác minh" (AI Realtor + chuyên gia thẩm định).
const COMMISSION_MIN = 10;
const COMMISSION_MAX = 80;

export function ShareForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (item: MyShareItem) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<PropertyKind | null>(null);
  const [area, setArea] = useState("");
  const [price, setPrice] = useState("");
  const [commission, setCommission] = useState(50);
  const [scope, setScope] = useState<ShareScope>(SHARE_SCOPES[0]);
  const [image, setImage] = useState<string | null>(null);

  const valid = title.trim() !== "" && kind !== null && area !== "" && price.trim() !== "";

  // Đọc ảnh người dùng chọn -> data URL để xem trước & lưu kèm tin.
  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!valid) return;
    onSubmit({
      id: `my-${Date.now()}`,
      title: title.trim(),
      kind: kind as PropertyKind,
      area,
      price: price.trim(),
      commission,
      scope,
      status: "Chờ xác minh",
      receivers: 0,
      image: image ?? undefined,
    });
  };

  return (
    <div className="animate-fade-up rounded-2xl border border-al-200 bg-al-50/40 p-5">
      <p className="flex items-center gap-2 font-bold text-al-700">
        <Icon name="PackagePlus" className="h-5 w-5" />
        Chia sẻ nguồn hàng mới
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* Tiêu đề */}
        <div className="sm:col-span-2">
          <Label>Tiêu đề nguồn hàng *</Label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Căn hộ 2PN Sunrise City view hồ bơi"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-al-400 focus:outline-none"
          />
        </div>

        {/* Loại nguồn hàng */}
        <div className="sm:col-span-2">
          <Label>Loại nguồn hàng *</Label>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_KINDS.map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                  kind === k
                    ? "border-al-600 bg-al-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-al-300"
                )}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Ảnh nguồn hàng */}
        <div className="sm:col-span-2">
          <Label>Ảnh nguồn hàng</Label>
          {image ? (
            <div className="relative overflow-hidden rounded-xl border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="Ảnh nguồn hàng" className="h-48 w-full object-cover" />
              <div className="absolute right-2 top-2 flex gap-2">
                <label className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur hover:bg-slate-900/80">
                  <Icon name="RefreshCw" className="h-3.5 w-3.5" />
                  Đổi ảnh
                  <input type="file" accept="image/*" onChange={onPickImage} className="hidden" />
                </label>
                <button
                  onClick={() => setImage(null)}
                  className="rounded-lg bg-slate-900/60 p-1.5 text-white backdrop-blur hover:bg-rose-500"
                  aria-label="Xoá ảnh"
                >
                  <Icon name="Trash2" className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-8 text-center transition-colors hover:border-al-400 hover:bg-al-50/40">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-al-50 text-al-500">
                <Icon name="ImagePlus" className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-slate-600">Thêm ảnh nguồn hàng</span>
              <span className="text-xs text-slate-400">Bấm để chọn ảnh (PNG, JPG) từ máy của bạn</span>
              <input type="file" accept="image/*" onChange={onPickImage} className="hidden" />
            </label>
          )}
        </div>

        {/* Khu vực */}
        <div>
          <Label>Khu vực *</Label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 focus:border-al-400 focus:outline-none"
          >
            <option value="">— Chọn khu vực —</option>
            {SHARE_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* Giá */}
        <div>
          <Label>Giá bán / cho thuê *</Label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="VD: 4,5 tỷ hoặc 25 triệu/th"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-al-400 focus:outline-none"
          />
        </div>

        {/* Hoa hồng chia sẻ — thanh trượt, kéo phải để tăng % */}
        <div>
          <Label>Hoa hồng cho môi giới đầu khách</Label>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-end justify-between">
              <span className="text-xs text-slate-400">Kéo sang phải để tăng hoa hồng</span>
              <span className="text-2xl font-bold text-flame-600">{commission}%</span>
            </div>
            <input
              type="range"
              min={COMMISSION_MIN}
              max={COMMISSION_MAX}
              step={1}
              value={commission}
              onChange={(e) => setCommission(Number(e.target.value))}
              aria-label="Hoa hồng"
              className="mt-3 h-2 w-full cursor-pointer accent-flame-500"
            />
            <div className="mt-1.5 flex justify-between text-[11px] font-semibold text-slate-400">
              <span>{COMMISSION_MIN}%</span>
              <span>{COMMISSION_MAX}%</span>
            </div>
          </div>
        </div>

        {/* Phạm vi chia sẻ (5 quyền theo PDF) */}
        <div>
          <Label>Phạm vi chia sẻ</Label>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value as ShareScope)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 focus:border-al-400 focus:outline-none"
          >
            {SHARE_SCOPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hành động */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          disabled={!valid}
          onClick={submit}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all",
            valid
              ? "bg-flame-500 shadow-md shadow-flame-500/30 hover:-translate-y-0.5 hover:bg-flame-600"
              : "cursor-not-allowed bg-slate-300"
          )}
        >
          <Icon name="Send" className="h-4 w-4" />
          Gửi xác minh & chia sẻ
        </button>
        <button
          onClick={onCancel}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-500 hover:border-slate-300"
        >
          Huỷ
        </button>
        <p className="flex items-center gap-1.5 text-xs text-slate-400">
          <Icon name="Bot" className="h-3.5 w-3.5 text-al-500" />
          AI Realtor + chuyên gia sẽ thẩm định trước khi chia sẻ đến cộng đồng
        </p>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-sm font-bold text-slate-700">{children}</p>;
}
