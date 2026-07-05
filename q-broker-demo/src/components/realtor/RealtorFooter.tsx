import { RealtorLogo } from "./RealtorLogo";

// Footer nhiều cột theo phong cách Realtor.com.

const COLUMNS: { title: string; links: string[] }[] = [
  {
    title: "Mua",
    links: ["Nhà đang bán", "Nhà thanh lý", "Dự án mới", "Nhà mở bán", "Vừa bán gần đây"],
  },
  {
    title: "Thuê",
    links: ["Căn hộ cho thuê", "Nhà nguyên căn", "Tất cả tin cho thuê", "Tính tiền thuê", "Công cụ cho chủ nhà"],
  },
  {
    title: "Bán",
    links: ["Bảng điều khiển Nhà của tôi", "Ước tính giá nhà", "Đăng bán nhà", "Tìm môi giới", "Hướng dẫn người bán"],
  },
  {
    title: "Vay mua nhà",
    links: ["Duyệt trước hồ sơ", "Lãi suất vay", "Lãi suất tái cấp vốn", "Tính khả năng chi trả", "Cẩm nang vay"],
  },
  {
    title: "Công ty",
    links: ["Về chúng tôi", "Tuyển dụng", "Tin tức báo chí", "Quảng cáo", "Liên hệ"],
  },
];

export function RealtorFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-bold text-realtor-ink">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-realtor-500"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Hàng dưới: logo + bản quyền */}
        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <RealtorLogo />
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Bản demo giao diện — không liên kết với
            realtor.com. Dùng cho mục đích minh hoạ Q-Broker.
          </p>
          <div className="flex gap-3">
            <a href="#" className="text-xs text-slate-500 hover:text-realtor-500">
              Điều khoản
            </a>
            <a href="#" className="text-xs text-slate-500 hover:text-realtor-500">
              Bảo mật
            </a>
            <a href="#" className="text-xs text-slate-500 hover:text-realtor-500">
              Quy tắc nhà ở
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
