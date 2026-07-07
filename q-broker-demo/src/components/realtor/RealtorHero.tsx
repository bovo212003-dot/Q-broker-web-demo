import { Icon } from "@/components/ui/Icon";
import { RealtorLogo } from "./RealtorLogo";

// Hero của Q-Broker: ảnh nền + lớp phủ tối, logo, tiêu đề lớn và ô tìm kiếm.

const HERO_BG =
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1600&q=70";

export function RealtorHero() {
  return (
    <section className="relative">
      {/* Ảnh nền + phủ tối */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/55" />

      {/* Nội dung */}
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:py-28">
        <RealtorLogo light className="mb-6" />
        <h1 className="text-3xl font-bold uppercase text-white drop-shadow-sm sm:text-5xl">
          Hệ sinh thái bất động sản toàn diện 
        </h1>
        <p className="mt-3 text-base text-white/90 sm:text-lg">
          Kết nối đúng người · Chia sẻ đúng giá trị · Chốt giao dịch thành công
        </p>

        {/* Ô tìm kiếm */}
        <div className="mt-8 flex w-full items-stretch overflow-hidden rounded-xl bg-white shadow-xl">
          <div className="flex flex-1 items-center gap-2 px-4">
            <Icon name="MapPin" className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Địa chỉ, quận/huyện, thành phố hoặc khu vực"
              className="w-full bg-transparent py-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <button
            className="flex items-center gap-2 bg-realtor-500 px-5 font-semibold text-white transition-colors hover:bg-realtor-600"
            aria-label="Tìm kiếm"
          >
            <Icon name="Search" className="h-5 w-5" />
            <span className="hidden sm:inline">Tìm kiếm</span>
          </button>
        </div>
      </div>
    </section>
  );
}
