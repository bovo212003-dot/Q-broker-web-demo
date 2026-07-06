"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  MyPosting,
  REC_AREAS,
  WORK_TYPES,
  WorkType,
} from "@/data/recruitment";
import { cn } from "@/lib/utils";

// Form đăng tin tuyển dụng — đủ trường theo PDF: tiêu đề, vị trí, số lượng,
// địa điểm, hình thức làm việc, mô tả, yêu cầu, quyền lợi, hoa hồng, thu nhập,
// hạn nộp, liên hệ. Sau khi gửi -> trạng thái "Chờ kiểm duyệt".
export function PostJobForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (p: MyPosting) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState("");
  const [openings, setOpenings] = useState("1");
  const [area, setArea] = useState("");
  const [workType, setWorkType] = useState<WorkType>("Toàn thời gian");
  const [salary, setSalary] = useState("");
  const [commission, setCommission] = useState("50");
  const [deadline, setDeadline] = useState("");
  const [desc, setDesc] = useState("");
  const [requirement, setRequirement] = useState("");
  const [benefit, setBenefit] = useState("");
  const [contact, setContact] = useState("");

  const valid =
    title.trim() && position.trim() && area && salary.trim() && deadline;

  const submit = () => {
    if (!valid) return;
    onSubmit({
      id: `p-${Date.now()}`,
      title: title.trim(),
      status: "Chờ kiểm duyệt",
      views: 0,
      applicants: 0,
      deadline,
      position: position.trim(),
      openings: Number(openings) || 1,
      area,
      workType,
      salary: salary.trim(),
      commission: Number(commission) || undefined,
      description: desc.trim() || undefined,
      requirement: requirement.trim() || undefined,
      benefit: benefit.trim() || undefined,
      contact: contact.trim() || undefined,
      postedAt: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="animate-fade-up rounded-2xl border border-al-200 bg-al-50/40 p-5 sm:p-6">
      <p className="flex items-center gap-2 font-bold text-al-700">
        <Icon name="FilePlus2" className="h-5 w-5" />
        Đăng tin tuyển dụng
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label required>Tiêu đề tuyển dụng</Label>
          <Input value={title} onChange={setTitle} placeholder="VD: Tuyển 10 chuyên viên môi giới căn hộ khu Nam" />
        </div>
        <div>
          <Label required>Vị trí cần tuyển</Label>
          <Input value={position} onChange={setPosition} placeholder="Chuyên viên môi giới" />
        </div>
        <div>
          <Label required>Số lượng</Label>
          <Input value={openings} onChange={setOpenings} placeholder="10" inputMode="numeric" />
        </div>
        <div>
          <Label required>Địa điểm làm việc</Label>
          <Select value={area} onChange={setArea} placeholder="— Chọn khu vực —" options={[...REC_AREAS]} />
        </div>
        <div>
          <Label>Hình thức làm việc</Label>
          <div className="flex flex-wrap gap-1.5">
            {WORK_TYPES.map((w) => (
              <Chip key={w} on={workType === w} onClick={() => setWorkType(w)}>
                {w}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <Label required>Mức thu nhập</Label>
          <Input value={salary} onChange={setSalary} placeholder="12 - 20 triệu + hoa hồng" />
        </div>
        <div>
          <Label>Chính sách hoa hồng (%)</Label>
          <Input value={commission} onChange={setCommission} placeholder="65" inputMode="numeric" />
        </div>
        <div className="sm:col-span-2">
          <Label>Mô tả công việc</Label>
          <Textarea value={desc} onChange={setDesc} placeholder="Tư vấn, giới thiệu sản phẩm, chăm sóc khách hàng..." />
        </div>
        <div>
          <Label>Yêu cầu ứng viên</Label>
          <Textarea value={requirement} onChange={setRequirement} placeholder="Giao tiếp tốt, ưu tiên có chứng chỉ hành nghề..." rows={2} />
        </div>
        <div>
          <Label>Quyền lợi</Label>
          <Textarea value={benefit} onChange={setBenefit} placeholder="BHXH, đào tạo, thưởng nóng, du lịch..." rows={2} />
        </div>
        <div>
          <Label required>Hạn nộp hồ sơ</Label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-al-400 focus:outline-none"
          />
        </div>
        <div>
          <Label>Thông tin liên hệ</Label>
          <Input value={contact} onChange={setContact} placeholder="0901 234 567 / hr@sandatvang.vn" />
        </div>
      </div>

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
          Gửi kiểm duyệt & đăng tin
        </button>
        <button
          onClick={onCancel}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-500 hover:border-slate-300"
        >
          Huỷ
        </button>
        <p className="flex items-center gap-1.5 text-xs text-slate-400">
          <Icon name="ShieldCheck" className="h-3.5 w-3.5 text-emerald-500" />
          Tin phải qua kiểm duyệt trước khi hiển thị công khai
        </p>
      </div>
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <p className="mb-1.5 text-sm font-bold text-slate-700">
      {children}
      {required && <span className="ml-1 text-flame-500">*</span>}
    </p>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "numeric";
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputMode={inputMode}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-al-400 focus:outline-none"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-al-400 focus:outline-none"
    />
  );
}

function Select({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 focus:border-al-400 focus:outline-none"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

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
        "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
        on
          ? "border-al-600 bg-al-600 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-al-300"
      )}
    >
      {children}
    </button>
  );
}
