import { RealtorLogo } from "./RealtorLogo";

// Footer nhiều cột theo phong cách Realtor.com.

const COLUMNS: { title: string; links: string[] }[] = [
  {
    title: "Đào tạo",
    links: ["Khóa học môi giới", "Luyện thi chứng chỉ", "Chuyên đề pháp lý", "Webinar & hội thảo", "Tài liệu miễn phí"],
  },
  {
    title: "Chia sẻ giỏ hàng",
    links: ["Giỏ hàng chung", "Đăng sản phẩm", "Hợp tác phân phối", "Chính sách hoa hồng", "Quản lý giỏ hàng"],
  },
  {
    title: "Cần thuê - Mua",
    links: ["Đăng nhu cầu thuê", "Đăng nhu cầu mua", "Tìm nhà cho thuê", "Kết nối môi giới", "Định giá tài sản"],
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
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
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
            Website được phát triển bởi công ty AUTOMATION LAND Việt Nam
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
