import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

// -------- Card: khung nội dung cơ bản --------
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-5 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

// -------- StatCard: thẻ số liệu cho dashboard --------
export function StatCard({
  label,
  value,
  icon,
  accent = "#0f766e",
  hint,
}: {
  label: string;
  value: string | number;
  icon: string;
  accent?: string;
  hint?: string;
}) {
  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      </div>
      <div
        className="flex h-11 w-11 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${accent}1a`, color: accent }}
      >
        <Icon name={icon} className="h-5 w-5" />
      </div>
    </Card>
  );
}

// -------- Badge: nhãn trạng thái --------
const badgeStyles: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  red: "bg-rose-50 text-rose-700 border-rose-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  slate: "bg-slate-100 text-slate-600 border-slate-200",
};

export function Badge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: keyof typeof badgeStyles;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        badgeStyles[tone]
      )}
    >
      {children}
    </span>
  );
}

// -------- PageHeader: tiêu đề mỗi trang con --------
export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {subtitle && <p className="mt-1 text-slate-500">{subtitle}</p>}
    </div>
  );
}
