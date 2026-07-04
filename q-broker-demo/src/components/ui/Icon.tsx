import * as Lucide from "lucide-react";
import { LucideProps } from "lucide-react";

// Cho phép gọi icon theo tên chuỗi (khớp với `icon` trong config/roles.ts).
// VD: <Icon name="Home" /> hoặc <Icon name="Building2" className="w-5 h-5" />

type IconProps = LucideProps & { name: string };

export function Icon({ name, ...props }: IconProps) {
  const LucideIcon = (Lucide as unknown as Record<string, React.ComponentType<LucideProps>>)[
    name
  ];
  if (!LucideIcon) {
    // Fallback nếu gõ sai tên icon
    return <Lucide.Square {...props} />;
  }
  return <LucideIcon {...props} />;
}
