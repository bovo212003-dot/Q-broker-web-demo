import { Icon } from "./Icon";

// Khung "trang đang xây dựng" — dùng cho các trang con chưa làm.
// Khi bạn bắt đầu làm 1 trang, chỉ cần thay nội dung file page.tsx tương ứng.
export function Placeholder({
  title,
  icon = "Hammer",
  note,
}: {
  title: string;
  icon?: string;
  note?: string;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Icon name={icon} className="h-6 w-6" />
        </div>
        <p className="mt-4 font-medium text-slate-600">Giao diện đang chờ bạn xây dựng</p>
        <p className="mt-1 max-w-md text-sm text-slate-400">
          {note ?? "Mở file page.tsx của trang này để bắt đầu thiết kế nội dung."}
        </p>
      </div>
    </div>
  );
}
