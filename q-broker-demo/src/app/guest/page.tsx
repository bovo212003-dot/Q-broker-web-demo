import Link from "next/link";
import { Badge, Card, PageHeader } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { PROPERTIES } from "@/data/mock";
import { formatVnd } from "@/lib/utils";

// TRANG CHỦ NGƯỜI DÙNG CHƯA ĐĂNG NHẬP
// Chỉ xem được nội dung công khai; muốn dùng đầy đủ phải đăng nhập.
export default function GuestHomePage() {
  return (
    <div>
      {/* Hero giới thiệu */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-500 p-8 text-white">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Nền tảng đào tạo & giao dịch BĐS minh bạch
        </h1>
        <p className="mt-2 max-w-2xl text-brand-50">
          Luyện thi chứng chỉ môi giới, kết nối sàn giao dịch và khách hàng —
          mọi sản phẩm đều được thẩm định pháp lý.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/guest/login"
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50"
          >
            Đăng nhập với Zalo
          </Link>
          <Link
            href="/guest/courses"
            className="rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Xem khóa học
          </Link>
        </div>
      </div>

      <PageHeader title="Bất động sản công khai" subtitle="Một số sản phẩm đã xác thực trên hệ thống" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROPERTIES.filter((p) => p.verified).map((p) => (
          <Card key={p.id} className="overflow-hidden p-0">
            <div className="h-32 w-full" style={{ backgroundColor: p.imageColor }} />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <Badge tone="slate">{p.type}</Badge>
                {p.verified && <Badge tone="green">Đã xác thực</Badge>}
              </div>
              <h3 className="mt-2 font-semibold text-slate-800">{p.title}</h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                <Icon name="MapPin" className="h-3 w-3" /> {p.address}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-brand-700">{formatVnd(p.price)}</span>
                <span className="text-sm text-slate-400">{p.area} m²</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
        <Icon name="Lock" className="mx-auto h-6 w-6 text-slate-400" />
        <p className="mt-2 text-slate-600">
          Đăng nhập để liên hệ môi giới, lưu tin và mở khóa toàn bộ tính năng.
        </p>
      </div>
    </div>
  );
}
