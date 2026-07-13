// Logo Q-BROKER (ảnh thật, nền trong suốt, gồm cả dòng phụ "Hệ sinh thái BĐS toàn diện").
// light=true: dùng trên nền tối -> dòng phụ trắng (logo.png).
// light=false: dùng trên nền sáng -> dòng phụ màu tối (logo-dark.png).
export function RealtorLogo({
  className = "",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={light ? "/logo.png" : "/logo-dark.png"}
      alt="Q-Broker - Hệ sinh thái BĐS toàn diện"
      className={`h-11 w-auto shrink-0 select-none ${className}`}
    />
  );
}
