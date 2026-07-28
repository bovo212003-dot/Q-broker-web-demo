import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { RealtorHeader } from "@/components/realtor/RealtorHeader";
import { RealtorFooter } from "@/components/realtor/RealtorFooter";
import {
  AffiliateBrokerCommitment,
  AffiliateCommissions,
  AffiliateCta,
  AffiliateFaqSection,
  AffiliateHero,
  AffiliateLeaderboard,
  AffiliateMarketingKit,
  AffiliateMoneyFlow,
  AffiliateSteps,
  AffiliateTiers,
} from "@/components/realtor/AffiliateProgram";
import { AffiliateCalculator } from "@/components/realtor/AffiliateCalculator";
import { AffiliateDashboard } from "@/components/realtor/AffiliateDashboard";
import { AffiliateTermsGate } from "@/components/realtor/AffiliateTermsGate";
import { ROLES } from "@/config/roles";
import { RoleId } from "@/types";

// =============================================================
// TRANG AFFILIATE  (route: /realtor/affiliate)
// Chương trình đối tác giới thiệu, mô phỏng cơ chế affiliate của
// các nền tảng BĐS thế giới (Zillow Affiliate/Flex, Realtor.com
// ReadyConnect): link giới thiệu + cookie, pay-at-closing, tier
// hoa hồng bậc thang, recurring gói hội viên, dashboard realtime.
// Dùng chung header/footer với trang /realtor.
// =============================================================

export const metadata = {
  title: "Chương trình Affiliate | Q-Broker",
};

export default function AffiliatePage({
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

      {/* Nút nhỏ quay lại demo Q-Broker */}
      <div className="fixed bottom-4 right-4 z-30">
        <Link
          href="/realtor/dao-tao"
          className="inline-flex items-center gap-1.5 rounded-full bg-realtor-ink px-4 py-2 text-xs font-semibold text-white shadow-lg hover:bg-slate-800"
        >
          <Icon name="ArrowLeft" className="h-3.5 w-3.5" />
          Tính năng này đang được phát triển
        </Link>
      </div>
    </div>
  );
}
