// Logo mô phỏng Realtor.com: khối nhà đỏ có ô cửa + chữ "realtor.com®".
export function RealtorLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7 shrink-0"
        role="img"
        aria-label="realtor.com"
      >
        {/* Mái + thân nhà */}
        <path
          d="M16 3 3 13v2h3v14h20V15h3v-2L16 3z"
          fill="#d92228"
        />
        {/* Ô cửa trắng */}
        <rect x="13" y="18" width="6" height="11" rx="1" fill="#ffffff" />
      </svg>
      <span className="text-lg font-bold tracking-tight text-realtor-ink">
        realtor.com<sup className="text-[0.6em] font-semibold">®</sup>
      </span>
    </span>
  );
}
