import { Badge, Card, PageHeader, StatCard } from "@/components/ui/Card";
import { PROPERTIES, STATS } from "@/data/mock";
import { formatVnd } from "@/lib/utils";

// TRANG CHỦ SÀN GIAO DỊCH
export default function ExchangeHomePage() {
  const s = STATS.exchange;
  const pending = PROPERTIES.filter((p) => p.status === "Chờ duyệt" || !p.verified);

  return (
    <div>
      <PageHeader
        title="Sàn Đất Vàng"
        subtitle="Quản lý kho sản phẩm và thẩm định hồ sơ pháp lý"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sản phẩm trong kho" value={s.inventory} icon="Warehouse" accent="#7c3aed" />
        <StatCard
          label="Chờ thẩm định"
          value={s.pendingVerification}
          icon="ShieldCheck"
          accent="#7c3aed"
          hint="Cần xử lý"
        />
        <StatCard label="Môi giới liên kết" value={s.linkedBrokers} icon="Network" accent="#7c3aed" />
        <StatCard label="Giao dịch/tháng" value={s.monthlyDeals} icon="ArrowLeftRight" accent="#7c3aed" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Hàng chờ thẩm định */}
        <Card className="lg:col-span-2">
          <h2 className="mb-4 font-semibold text-slate-900">Hồ sơ chờ thẩm định</h2>
          <div className="space-y-3">
            {pending.map((p) => (
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
                <div className="flex items-center gap-2">
                  <button className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700">
                    Duyệt
                  </button>
                  <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                    Từ chối
                  </button>
                </div>
              </div>
            ))}
            {pending.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">
                Không có hồ sơ nào đang chờ.
              </p>
            )}
          </div>
        </Card>

        {/* Tổng quan kho */}
        <Card>
          <h2 className="mb-4 font-semibold text-slate-900">Trạng thái kho</h2>
          <div className="space-y-3">
            {PROPERTIES.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <span className="truncate pr-2 text-slate-600">{p.title}</span>
                <Badge
                  tone={
                    p.status === "Đang bán" ? "green" : p.status === "Đã bán" ? "slate" : "amber"
                  }
                >
                  {p.status}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-100 pt-3 text-sm text-slate-500">
            Tổng giá trị kho:{" "}
            <span className="font-semibold text-violet-600">
              {formatVnd(PROPERTIES.reduce((sum, p) => sum + p.price, 0))}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
