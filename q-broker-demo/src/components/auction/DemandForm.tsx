"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  AREAS,
  BEDROOM_OPTIONS,
  BUDGETS,
  CRITERIA_OPTIONS,
  DemandDraft,
  PROPERTY_TYPES,
  PropertyType,
  TRANSACTION_TYPES,
  TransactionType,
} from "@/data/auction";
import { cn } from "@/lib/utils";

// BƯỚC 1 — Form đăng nhu cầu Mua / Thuê.
// Trường theo requirement: loại giao dịch, loại BĐS, khu vực, ngân sách,
// diện tích, số phòng, tiêu chí đặc biệt, ghi chú.
export function DemandForm({
  onSubmit,
}: {
  onSubmit: (draft: DemandDraft) => void;
}) {
  const [type, setType] = useState<TransactionType>("Mua");
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [area, setArea] = useState("");
  const [budget, setBudget] = useState("");
  const [size, setSize] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [criteria, setCriteria] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const valid = propertyType !== null && area !== "" && budget !== "";

  const toggleCriteria = (c: string) =>
    setCriteria((arr) =>
      arr.includes(c) ? arr.filter((x) => x !== c) : [...arr, c]
    );

  return (
    <div className="mx-auto max-w-3xl animate-fade-up">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-al-700">Nhu cầu của bạn</h2>
        <p className="mt-1 text-sm text-slate-500">
          Điền một lần duy nhất — hệ thống sẽ mở phiên đấu giá để môi giới phù
          hợp đăng ký hỗ trợ bạn.
        </p>

        {/* Loại giao dịch */}
        <div className="mt-6">
          <p className="mb-2 text-sm font-bold text-slate-800">
            Bạn muốn làm gì?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {TRANSACTION_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setType(t);
                  setBudget(""); // ngân sách phụ thuộc loại giao dịch
                }}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-2xl border-2 py-4 text-base font-bold transition-all",
                  type === t
                    ? "border-al-600 bg-al-50 text-al-700"
                    : "border-slate-200 text-slate-500 hover:border-al-300"
                )}
              >
                <Icon name={t === "Mua" ? "Home" : "KeyRound"} className="h-5 w-5" />
                Cần {t.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Loại BĐS */}
        <Field label="Loại bất động sản" required>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map((p) => (
              <Chip key={p} on={propertyType === p} onClick={() => setPropertyType(p)}>
                {p}
              </Chip>
            ))}
          </div>
        </Field>

        {/* Khu vực */}
        <Field label="Khu vực mong muốn" required>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-al-400">
            <Icon name="MapPin" className="h-4 w-4 shrink-0 text-slate-400" />
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full bg-transparent py-3 text-sm text-slate-800 focus:outline-none"
            >
              <option value="">— Chọn khu vực —</option>
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </Field>

        {/* Ngân sách */}
        <Field label="Ngân sách" required>
          <div className="flex flex-wrap gap-2">
            {BUDGETS[type].map((b) => (
              <Chip key={b} on={budget === b} onClick={() => setBudget(b)}>
                {b}
              </Chip>
            ))}
          </div>
        </Field>

        {/* Diện tích + số phòng */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-bold text-slate-800">
              Diện tích mong muốn
            </p>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-al-400">
              <Icon name="Ruler" className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="VD: 70"
                inputMode="numeric"
                className="w-full bg-transparent py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              <span className="text-sm text-slate-400">m²</span>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-bold text-slate-800">Số phòng ngủ</p>
            <div className="flex gap-2">
              {BEDROOM_OPTIONS.map((b) => (
                <Chip
                  key={b}
                  on={bedrooms === b}
                  onClick={() => setBedrooms(bedrooms === b ? "" : b)}
                >
                  {b}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        {/* Tiêu chí đặc biệt */}
        <Field label="Tiêu chí đặc biệt">
          <div className="flex flex-wrap gap-2">
            {CRITERIA_OPTIONS.map((c) => (
              <Chip key={c} on={criteria.includes(c)} onClick={() => toggleCriteria(c)}>
                {criteria.includes(c) && (
                  <Icon name="Check" className="h-3.5 w-3.5" />
                )}
                {c}
              </Chip>
            ))}
          </div>
        </Field>

        {/* Ghi chú */}
        <Field label="Ghi chú bổ sung">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="VD: Ưu tiên nhà hướng Đông, cần dọn vào trước tháng 9..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-al-400 focus:outline-none"
          />
        </Field>

        {/* Submit */}
        <button
          disabled={!valid}
          onClick={() =>
            valid &&
            onSubmit({
              type,
              propertyType: propertyType as PropertyType,
              area,
              budget,
              size: size || undefined,
              bedrooms: bedrooms || undefined,
              criteria,
              note,
            })
          }
          className={cn(
            "mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-white transition-all",
            valid
              ? "bg-flame-500 shadow-lg shadow-flame-500/30 hover:-translate-y-0.5 hover:bg-flame-600"
              : "cursor-not-allowed bg-slate-300"
          )}
        >
          <Icon name="Gavel" className="h-5 w-5" />
          Mở phiên đấu giá môi giới
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
          <Icon name="ShieldCheck" className="h-3.5 w-3.5 text-emerald-500" />
          Nhu cầu được AI Realtor & chuyên gia xác minh trước khi công khai
        </p>
      </div>
    </div>
  );
}

// -------- Ô nhóm trường --------
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-sm font-bold text-slate-800">
        {label}
        {required && <span className="ml-1 text-flame-500">*</span>}
      </p>
      {children}
    </div>
  );
}

// -------- Chip chọn --------
function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        on
          ? "border-al-600 bg-al-600 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-al-300 hover:text-al-600"
      )}
    >
      {children}
    </button>
  );
}
