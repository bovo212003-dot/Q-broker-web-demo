// Logo Q-Broker: huy hiệu tròn gradient tím→xanh có chữ "Q",
// kèm chữ "BROKER" và dòng phụ "TRUST COMMUNITY".
// light=true: dùng cho nền tối (chữ trắng).
export function RealtorLogo({
  className = "",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Huy hiệu tròn có chữ Q */}
      <svg
        viewBox="0 0 40 40"
        className="h-9 w-9 shrink-0"
        role="img"
        aria-label="Q-Broker"
      >
        <defs>
          <linearGradient id="qbrokerGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="20" fill="url(#qbrokerGrad)" />
        <text
          x="20"
          y="21"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Arial, sans-serif"
          fontSize="22"
          fontWeight="700"
          fill="#ffffff"
        >
          Q
        </text>
      </svg>

      {/* Chữ Q-BROKER + dòng phụ */}
      <span className="flex flex-col leading-none">
        <span
          className={`text-lg font-extrabold tracking-tight ${
            light ? "text-white" : "text-slate-900"
          }`}
        >
          BROKER
        </span>
        <span
          className={`mt-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.2em] ${
            light ? "text-white/70" : "text-slate-400"
          }`}
        >
          Trust Community
        </span>
      </span>
    </span>
  );
}
