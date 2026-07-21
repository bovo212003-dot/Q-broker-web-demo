import Link from "next/link";
import { ROLES, ROLE_ORDER } from "@/config/roles";
import { Icon } from "@/components/ui/Icon";
import { RealtorLogo } from "@/components/realtor/RealtorLogo";


export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-16">
        {/* Tiêu đề */}
        <div className="mb-10 text-center">
          <RealtorLogo className="mx-auto mb-5 h-16 sm:h-20" />
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Chọn vai trò để bắt đầu
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-500">
            Bản demo giao diện Hệ sinh thái BĐS toàn diện — chọn một vai trò để
            xem trang chủ tương ứng.
          </p>
        </div>

        {/* Lưới 6 nút vai trò */}
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROLE_ORDER.map((id) => {
            const role = ROLES[id];
            return (
              <Link
                key={role.id}
                href={`/realtor?role=${role.id}`}
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
