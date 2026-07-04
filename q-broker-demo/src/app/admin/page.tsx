import { Badge, Card, PageHeader, StatCard } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { PEOPLE, STATS, TRANSACTIONS } from "@/data/mock";
import { formatNumber, formatVnd } from "@/lib/utils";

// TRANG CHỦ ADMIN — quản trị toàn hệ sinh thái
export default function AdminHomePage() {
  const s = STATS.admin;

  return (
    <div>
      <PageHeader
        title="Bảng điều khiển quản trị"
        subtitle="Theo dõi toàn bộ hoạt động của hệ sinh thái Q-Broker"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Tổng người dùng" value={formatNumber(s.totalUsers)} icon="Users" accent="#e11d48" />
        <StatCard label="Thành viên VIP" value={formatNumber(s.vipUsers)} icon="Crown" accent="#e11d48" />
        <StatCard label="Doanh thu tháng" value={formatVnd(s.monthlyRevenue)} icon="TrendingUp" accent="#e11d48" />
        <StatCard
          label="Chờ kiểm duyệt"
          value={s.pendingModeration}
          icon="ShieldAlert"
          accent="#e11d48"
          hint="Cần xử lý"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Giao dịch toàn hệ thống */}
        <Card className="lg:col-span-2">
          <h2 className="mb-4 font-semibold text-slate-900">Giao dịch toàn hệ thống</h2>
          <div className="space-y-3">
            {TRANSACTIONS.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">{t.propertyTitle}</p>
                  <p className="text-xs text-slate-400">
                    {t.brokerName} → {t.customerName} · {t.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">{formatVnd(t.amount)}</p>
                  <Badge
                    tone={
                      t.status === "Thành công" ? "green" : t.status === "Đã hủy" ? "red" : "amber"
                    }
                  >
                    {t.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Người dùng mới */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Icon name="UserPlus" className="h-5 w-5 text-rose-600" />
            <h2 className="font-semibold text-slate-900">Người dùng gần đây</h2>
          </div>
          <div className="space-y-3">
            {PEOPLE.map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: u.avatarColor }}
                >
                  {u.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{u.name}</p>
                  <p className="text-xs text-slate-400">{u.phone}</p>
                </div>
                <Badge tone="slate">{u.role === "broker" ? "Môi giới" : "Khách hàng"}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
