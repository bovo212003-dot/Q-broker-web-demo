"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  BROKERAGE_FEE_RATE,
  MEMBERSHIP_PRICE,
  tierForQuarterDeals,
} from "@/data/affiliate";

// =============================================================
// MÁY TÍNH HOA HỒNG — kéo 3 slider để ước tính thu nhập/tháng.
// Tự xếp hạng đối tác theo số giao dịch quý (deals/tháng × 3)
// rồi áp tỷ lệ hoa hồng của hạng đó — giống các trang affiliate
// quốc tế luôn có "earnings calculator" để chốt đăng ký.
// =============================================================

/** "12.500.000 đ" — hiển thị tiền đầy đủ số */
const vnd = (v: number) => `${Math.round(v).toLocaleString("vi-VN")} đ`;

/** Một slider có nhãn + giá trị hiện tại */
function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="font-mono text-sm font-bold text-realtor-500">
          {display}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-realtor-500"
      />
    </label>
  );
}

export function AffiliateCalculator() {
  const [deals, setDeals] = useState(2); // giao dịch chốt / tháng
  const [avgValue, setAvgValue] = useState(4); // giá trị TB (tỷ đồng)
  const [members, setMembers] = useState(5); // gói hội viên / tháng

  // Hạng xét theo QUÝ -> quy đổi từ số giao dịch mỗi tháng.
  const tier = tierForQuarterDeals(deals * 3);

  // Hoa hồng giao dịch: giá trị × 2% phí môi giới × tỷ lệ theo hạng.
  const dealIncome =
    deals * avgValue * 1_000_000_000 * BROKERAGE_FEE_RATE * (tier.dealRate / 100);
  // Hoa hồng gói hội viên (tháng đầu; gói lặp lại 12 tháng nên thực tế cao hơn).
  const memberIncome = members * MEMBERSHIP_PRICE * (tier.recurringRate / 100);
  const monthly = dealIncome + memberIncome;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid lg:grid-cols-2">
        {/* Cột trái: 3 slider đầu vào */}
        <div className="p-6 lg:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-realtor-500">
            Máy tính hoa hồng
          </p>
          <h2 className="mt-2 text-2xl font-bold text-realtor-ink">
            Bạn có thể kiếm được bao nhiêu?
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Kéo thử theo mạng lưới của bạn — hạng đối tác và tỷ lệ hoa hồng tự
            cập nhật.
          </p>

          <div className="mt-6 space-y-6">
            <Slider
              label="Giao dịch chốt mỗi tháng"
              value={deals}
              display={`${deals} giao dịch`}
              min={0}
              max={10}
              step={1}
              onChange={setDeals}
            />
            <Slider
              label="Giá trị trung bình mỗi giao dịch"
              value={avgValue}
              display={`${avgValue.toLocaleString("vi-VN")} tỷ`}
              min={1}
              max={20}
              step={0.5}
              onChange={setAvgValue}
            />
            <Slider
              label="Gói hội viên Pro Broker giới thiệu mỗi tháng"
              value={members}
              display={`${members} gói`}
              min={0}
              max={30}
              step={1}
              onChange={setMembers}
            />
          </div>
        </div>

        {/* Cột phải: kết quả ước tính */}
        <div className="bg-gradient-to-br from-realtor-700 to-realtor-500 p-6 text-white lg:p-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
            <Icon name="Award" className="h-3.5 w-3.5 text-amber-300" />
            {tier.name} — {tier.dealRate}% / giao dịch
          </span>

          <p className="mt-5 text-xs uppercase tracking-widest text-realtor-100">
            Thu nhập ước tính mỗi tháng
          </p>
          <p className="mt-1 font-mono text-3xl font-extrabold tracking-tight sm:text-4xl">
            {vnd(monthly)}
          </p>

          <dl className="mt-6 space-y-3 border-t border-white/20 pt-5 text-sm">
            <div className="flex items-center justify-between gap-2">
              <dt className="text-realtor-50/85">
                Hoa hồng giao dịch ({tier.dealRate}% phí môi giới)
              </dt>
              <dd className="font-mono font-bold">{vnd(dealIncome)}</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-realtor-50/85">
                Gói hội viên ({tier.recurringRate}% recurring)
              </dt>
              <dd className="font-mono font-bold">{vnd(memberIncome)}</dd>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-white/20 pt-3">
              <dt className="font-semibold">Ước tính cả năm</dt>
              <dd className="font-mono text-lg font-extrabold text-amber-300">
                {vnd(monthly * 12)}
              </dd>
            </div>
          </dl>

          <p className="mt-4 flex items-start gap-1.5 text-xs text-realtor-50/70">
            <Icon name="Info" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Ước tính minh hoạ theo phí môi giới 2%. Hoa hồng gói hội viên lặp lại
            tới 12 tháng nên thu nhập thực tế thường cao hơn.
          </p>
        </div>
      </div>
    </section>
  );
}
