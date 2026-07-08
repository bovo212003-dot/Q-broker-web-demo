// Logo Q-BROKER: dấu "Q" vòng vàng gold + tail chéo, chữ "BROKER" gradient vàng,
// dòng phụ "Hệ sinh thái BĐS toàn diện".
// light=true: dùng cho nền tối (dòng phụ sáng màu).
export function RealtorLogo({
  className = "",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Dấu Q vòng vàng + tail chéo */}
      <svg
        viewBox="0 0 48 48"
        className="h-11 w-11 shrink-0"
        role="img"
        aria-label="Q-Broker"
      >
        <defs>
          <linearGradient id="qbGold" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0%" stopColor="#FCE79A" />
            <stop offset="45%" stopColor="#F4C430" />
            <stop offset="100%" stopColor="#C6870C" />
          </linearGradient>
        </defs>
        {/* Vòng Q (rỗng ruột -> ăn theo nền) */}
        <circle cx="21" cy="22" r="14" fill="none" stroke="url(#qbGold)" strokeWidth="8" />
        {/* Tail chéo góc dưới phải */}
        <path
          d="M26 27 L41 42"
          stroke="url(#qbGold)"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>

      {/* Chữ Q-BROKER + dòng phụ (1 dòng, rộng xấp xỉ chữ BROKER — như logo gốc) */}
      <span className="flex shrink-0 flex-col leading-none">
        <span className="bg-gradient-to-b from-[#F6D368] via-[#E7A93B] to-[#B5820C] bg-clip-text text-2xl font-extrabold tracking-wide text-transparent">
          - BROKER
        </span>
        <span
          className={`mt-0.5 whitespace-nowrap text-[0.55rem] font-bold uppercase tracking-[0.04em] ${
            light ? "text-white/80" : "text-slate-600"
          }`}
        >
          Hệ sinh thái BĐS toàn diện
        </span>
      </span>
    </span>
  );
}
