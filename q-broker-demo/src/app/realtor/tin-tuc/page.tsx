import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import { NewsFeatured, NewsSidebar } from "@/components/realtor/NewsSections";
import { NewsFeed } from "@/components/realtor/NewsFeed";
import { ROLES } from "@/config/roles";
import { RoleId } from "@/types";

// =============================================================
// TRANG TIN TỨC  (route: /realtor/tin-tuc)
// Bố cục theo chuẩn chuyên trang tin BĐS thế giới (Zillow Front
// Porch, Realtor.com News & Insights): bài featured lớn + tab
// chuyên mục + lưới bài + sidebar (đọc nhiều, chỉ số giá, bản tin).
// Dùng chung header/footer với trang /realtor.
// =============================================================

export const metadata = {
  title: "Tin tức bất động sản | Q-Broker",
};

export default function NewsPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  // Giữ cơ chế role như trang /realtor: ?role=... -> hiện tên ở header.
  const roleId = searchParams.role as RoleId | undefined;
  const role = roleId && roleId !== "guest" ? ROLES[roleId] : undefined;

  return (
    <div className="min-h-screen bg-white">
      <RealtorHeader userName={role?.name} roleId={role?.id} />

      {/* Band tiêu đề trang */}
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-realtor-500">
            Q-Broker News & Insights
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-realtor-ink sm:text-3xl">
            Tin tức bất động sản
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-600">
            Diễn biến thị trường, chính sách mới, dự án đáng chú ý và cẩm nang
            mua bán — cập nhật mỗi ngày.
          </p>
        </div>
      </div>

      {/* Bài nổi bật */}
      <NewsFeatured />

      {/* Feed bài viết + sidebar */}
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_340px] lg:px-8">
        <NewsFeed />
        <NewsSidebar />
      </main>

      <RealtorFooter />

      {/* Nút nhỏ quay lại demo Q-Broker */}
      <div className="fixed bottom-4 right-4 z-30">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full bg-realtor-ink px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-slate-800"
        >
          <Icon name="ArrowLeft" className="h-3.5 w-3.5" />
          Về demo Q-Broker
        </Link>
      </div>
    </div>
  );
}
