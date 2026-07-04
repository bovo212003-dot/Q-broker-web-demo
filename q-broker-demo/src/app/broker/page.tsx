import { Badge, Card, PageHeader, StatCard } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { EXAM_RESULTS, PROPERTIES, STATS } from "@/data/mock";
import { formatVnd } from "@/lib/utils";

// TRANG CHỦ MÔI GIỚI
// Đây là trang mẫu đầy đủ nhất — dùng làm khuôn để làm các role khác.
export default function BrokerHomePage() {
  const s = STATS.broker;

  return (
    <div>
      <PageHeader
        title="Xin chào, Minh Quân 👋"
        subtitle="Tổng quan hoạt động môi giới của bạn hôm nay"
      />

      {/* Hàng số liệu */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tin đang đăng" value={s.listings} icon="Building2" accent="#059669" />
        <StatCard label="Khách hàng đang theo" value={s.activeCustomers} icon="Users" accent="#059669" />
        <StatCard
          label="Hoa hồng tháng này"
          value={formatVnd(s.monthlyCommission)}
          icon="Wallet"
          accent="#059669"
        />
        <StatCard label="Tỷ lệ đạt thi thử" value={`${s.examPassRate}%`} icon="GraduationCap" accent="#059669" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sản phẩm nổi bật trong giỏ hàng chung */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Giỏ hàng chung nổi bật</h2>
            <span className="text-sm text-emerald-600">Xem tất cả</span>
          </div>
          <div className="space-y-3">
            {PROPERTIES.filter((p) => p.status === "Đang bán")
              .slice(0, 4)
              .map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-100 p-3"
                >
                  <div
                    className="h-12 w-12 shrink-0 rounded-lg"
                    style={{ backgroundColor: p.imageColor }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-800">{p.title}</p>
                    <p className="truncate text-xs text-slate-400">{p.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600">{formatVnd(p.price)}</p>
                    {p.verified && <Badge tone="green">Đã xác thực</Badge>}
                  </div>
                </div>
              ))}
          </div>
        </Card>

        {/* Kết quả thi thử gần đây */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Icon name="ClipboardList" className="h-5 w-5 text-emerald-600" />
            <h2 className="font-semibold text-slate-900">Thi thử gần đây</h2>
          </div>
          <div className="space-y-3">
            {EXAM_RESULTS.map((e) => (
              <div key={e.id} className="rounded-lg border border-slate-100 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-800">{e.title}</p>
                  {e.passed ? <Badge tone="green">Đạt</Badge> : <Badge tone="red">Chưa đạt</Badge>}
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {e.score}/{e.total} điểm · {e.date}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
