import { Badge, Card, PageHeader, StatCard } from "@/components/ui/Card";
import { LOANS, STATS } from "@/data/mock";
import { formatVnd } from "@/lib/utils";

// TRANG CHỦ NGÂN HÀNG
export default function BankHomePage() {
  const s = STATS.bank;

  const toneOf = (status: string) =>
    status === "Đã duyệt" ? "green" : status === "Từ chối" ? "red" : "amber";

  return (
    <div>
      <PageHeader
        title="Trung tâm tín dụng BĐS"
        subtitle="Duyệt hồ sơ vay và quản lý sản phẩm tín dụng"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Hồ sơ chờ duyệt" value={s.pendingLoans} icon="FileSpreadsheet" accent="#d97706" hint="Ưu tiên xử lý" />
        <StatCard label="Đã duyệt tháng này" value={s.approvedThisMonth} icon="CheckCircle2" accent="#d97706" />
        <StatCard label="Tổng giải ngân" value={formatVnd(s.totalDisbursed)} icon="Banknote" accent="#d97706" />
        <StatCard label="Sàn đối tác" value={s.partnerExchanges} icon="Building2" accent="#d97706" />
      </div>

      {/* Danh sách hồ sơ vay */}
      <Card className="mt-6 overflow-hidden p-0">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Hồ sơ vay gần đây</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3">Người vay</th>
                <th className="px-5 py-3">Tài sản</th>
                <th className="px-5 py-3">Số tiền</th>
                <th className="px-5 py-3">Kỳ hạn</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {LOANS.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">{l.applicantName}</td>
                  <td className="max-w-[200px] truncate px-5 py-3 text-slate-500">
                    {l.propertyTitle}
                  </td>
                  <td className="px-5 py-3 font-semibold text-amber-600">{formatVnd(l.amount)}</td>
                  <td className="px-5 py-3 text-slate-500">{l.term} tháng</td>
                  <td className="px-5 py-3">
                    <Badge tone={toneOf(l.status)}>{l.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="text-sm font-medium text-amber-600 hover:underline">
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
