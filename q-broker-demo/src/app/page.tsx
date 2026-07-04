import Link from "next/link";
import { ROLES, ROLE_ORDER } from "@/config/roles";
import { Icon } from "@/components/ui/Icon";

// =============================================================
// TRANG LANDING (Chọn vai trò)
// -------------------------------------------------------------
// Đây là trang mẫu theo yêu cầu: 6 nút ở giữa màn hình đại diện
// cho 6 role. Nhấn vào 1 nút -> chuyển sang trang home của role đó.
// Danh sách nút được sinh tự động từ config/roles.ts.
// =============================================================

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-16">
        {/* Tiêu đề */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-700 text-white">
            <Icon name="Building2" className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Hệ sinh thái BĐS toàn diện{" "}
            <span className="text-brand-700">Q-Broker</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-500">
            Bản demo giao diện. Chọn một vai trò để xem trang chủ tương ứng.
          </p>
        </div>

        {/* Lưới 6 nút vai trò */}
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROLE_ORDER.map((id) => {
            const role = ROLES[id];
            return (
              <Link
                key={role.id}
                href={role.basePath}
                className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                {/* Vạch màu nhấn của role */}
                <span
                  className="absolute left-0 top-6 h-10 w-1 rounded-r-full"
                  style={{ backgroundColor: role.color }}
                />
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white transition-transform group-hover:scale-105"
                  style={{ backgroundColor: role.color }}
                >
                  <Icon name={role.icon} className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {role.name}
                </h2>
                <p className="mt-1 flex-1 text-sm text-slate-500">
                  {role.shortDesc}
                </p>
                <span
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium"
                  style={{ color: role.color }}
                >
                  Vào giao diện
                  <Icon
                    name="ArrowRight"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            );
          })}
        </div>

        
      </div>
    </main>
  );
}
