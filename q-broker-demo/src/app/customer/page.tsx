import { Badge, Card, PageHeader, StatCard } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { PROPERTIES, STATS } from "@/data/mock";
import { formatVnd } from "@/lib/utils";

// TRANG CHỦ KHÁCH HÀNG (NHÀ ĐẦU TƯ)
export default function CustomerHomePage() {
  const s = STATS.customer;

  return (
    <div>
      <PageHeader
        title="Xin chào, Văn An 👋"
        subtitle="Tìm kiếm và quản lý nhu cầu bất động sản của bạn"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="BĐS đã lưu" value={s.savedProperties} icon="Bookmark" accent="#2563eb" />
        <StatCard label="Tin đang đăng" value={s.activePosts} icon="FileText" accent="#2563eb" />
        <StatCard label="Môi giới đã liên hệ" value={s.contactedBrokers} icon="Handshake" accent="#2563eb" />
        <StatCard label="Lịch xem nhà" value={s.viewings} icon="CalendarDays" accent="#2563eb" />
      </div>

      {/* Thanh tìm kiếm nhanh */}
      <Card className="mt-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3">
            <Icon name="Search" className="h-4 w-4 text-slate-400" />
            <input
              placeholder="Tìm căn hộ, nhà phố, đất nền..."
              className="w-full bg-transparent py-2 text-sm outline-none"
            />
          </div>
          <button className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Tìm kiếm
          </button>
        </div>
      </Card>

      <div className="mt-6">
        <PageHeader title="Gợi ý cho bạn" subtitle="Sản phẩm đã xác thực phù hợp nhu cầu" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROPERTIES.filter((p) => p.status === "Đang bán").map((p) => (
            <Card key={p.id} className="overflow-hidden p-0">
              <div className="h-32 w-full" style={{ backgroundColor: p.imageColor }} />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <Badge tone="blue">{p.type}</Badge>
                  <button className="text-slate-300 hover:text-blue-600">
                    <Icon name="Heart" className="h-5 w-5" />
                  </button>
                </div>
                <h3 className="mt-2 font-semibold text-slate-800">{p.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                  <Icon name="MapPin" className="h-3 w-3" /> {p.address}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-blue-600">{formatVnd(p.price)}</span>
                  <span className="text-sm text-slate-400">{p.area} m²</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
