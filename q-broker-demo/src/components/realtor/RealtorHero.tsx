import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { withRole } from "@/lib/role";
import { RoleId } from "@/types";
import { RealtorLogo } from "./RealtorLogo";

// Hero của Q-Broker: ảnh nền (ken burns) + lớp phủ tối, logo, tiêu đề lớn
// và CTA dẫn vào hệ sinh thái dịch vụ (KHÔNG phải tìm nhà rao bán).

const HERO_BG =
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1600&q=70";

export function RealtorHero({ roleId }: { roleId?: RoleId }) {
  return (
    <section className="relative overflow-hidden">
      {/* Ảnh nền + ken burns + phủ tối */}
      <div
        className="absolute inset-0 animate-kenburns bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-realtor-ink/70 via-realtor-ink/45 to-realtor-ink/75" />

      {/* Nội dung */}
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 pb-28 pt-20 text-center sm:pt-28">
        <div className="animate-fade-up">
          <RealtorLogo light className="mb-6" />
        </div>

        <span className="mb-4 inline-flex animate-fade-up items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur [animation-delay:80ms]">
          <Icon name="Sparkles" className="h-3.5 w-3.5 text-amber-300" />
          Hệ sinh thái môi giới thế hệ mới
        </span>

        <h1 className="animate-fade-up text-3xl font-bold uppercase leading-tight text-white drop-shadow-sm [animation-delay:140ms] sm:text-5xl">
          Hệ sinh thái bất động sản toàn diện
        </h1>
        <p className="mt-3 max-w-xl animate-fade-up text-base text-white/90 [animation-delay:220ms] sm:text-lg">
          Học nghề · Chia sẻ nguồn hàng · Bắt nhu cầu thật · Live &amp; đấu giá ·
          Phát triển sự nghiệp — tất cả trong một nền tảng.
        </p>

        {/* CTA dẫn vào hệ sinh thái */}
        <div className="mt-9 flex animate-fade-up flex-col items-center gap-3 sm:flex-row [animation-delay:300ms]">
          <a
            href="#dich-vu"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-realtor-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-realtor-900/30 transition-all hover:-translate-y-0.5 hover:bg-realtor-600 sm:w-auto"
          >
            <Icon name="Compass" className="h-4 w-4" />
            Khám phá dịch vụ
          </a>
          <Link
            href={withRole("/realtor/dao-tao", roleId)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/20 sm:w-auto"
          >
            <Icon name="GraduationCap" className="h-4 w-4" />
            Bắt đầu học nghề
          </Link>
        </div>

        {/* Điểm tin cậy nhanh */}
        <div className="mt-7 flex animate-fade-up flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-white/80 [animation-delay:380ms]">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="ShieldCheck" className="h-4 w-4 text-emerald-300" />
            Đối tác đã xác thực
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="BadgeCheck" className="h-4 w-4 text-amber-300" />
            Chứng chỉ hành nghề
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="Percent" className="h-4 w-4 text-realtor-200" />
            Hoa hồng minh bạch
          </span>
        </div>
      </div>
    </section>
  );
}
