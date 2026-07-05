import { Icon } from "@/components/ui/Icon";
import { ANNOUNCEMENTS } from "@/data/training";

// Dải thông báo chạy ngang (marquee thuần CSS, lặp liền mạch).
export function AnnouncementBar() {
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS]; // nhân đôi để cuộn liền mạch
  return (
    <div className="flex items-center gap-3 overflow-hidden rounded-2xl border border-flame-100 bg-flame-50 px-4 py-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-flame-500 text-white">
        <Icon name="Bell" className="h-4 w-4" />
      </span>
      <div className="relative flex-1 overflow-hidden">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {items.map((text, i) => (
            <span key={i} className="text-sm text-flame-600">
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
