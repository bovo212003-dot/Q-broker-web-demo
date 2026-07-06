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
const COMMISSIONS = [30, 40, 50, 60];

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

  const valid = title.trim() !== "" && kind !== null && area !== "" && price.trim() !== "";

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

        {/* Hoa hồng chia sẻ */}
        <div>
          <Label>Hoa hồng cho môi giới đầu khách</Label>
          <div className="flex gap-2">
            {COMMISSIONS.map((c) => (
              <button
                key={c}
                onClick={() => setCommission(c)}
                className={cn(
                  "flex-1 rounded-xl border py-2.5 text-sm font-bold transition-colors",
                  commission === c
                    ? "border-flame-500 bg-flame-500 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-flame-300"
                )}
              >
                {c}%
              </button>
            ))}
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
