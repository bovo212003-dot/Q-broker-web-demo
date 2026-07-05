import { Icon } from "@/components/ui/Icon";
import { Topic } from "@/data/training";

// Thẻ chuyên đề dạng banner — tab Chuyên đề.
export function TopicCard({ topic }: { topic: Topic }) {
  return (
    <article className="group relative h-52 overflow-hidden rounded-2xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={topic.image}
        alt={topic.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-al-900/95 via-al-900/45 to-al-900/10" />

      <span className="absolute left-4 top-4 rounded-lg bg-al-900/70 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
        {topic.group}
      </span>
      <span
        className={
          "absolute right-4 top-4 rounded-md px-2.5 py-1 text-xs font-bold " +
          (topic.free
            ? "bg-emerald-500 text-white"
            : "bg-flame-500 text-white")
        }
      >
        {topic.free ? "FREE" : "VIP"}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-flame-400">
          Chuyên đề {topic.id}
        </p>
        <h3 className="mt-1 line-clamp-2 text-base font-bold leading-snug text-white">
          {topic.title}
        </h3>
        <div className="mt-2 flex items-center gap-3 text-xs text-white/75">
          <span className="inline-flex items-center gap-1">
            <Icon name="BookOpen" className="h-3.5 w-3.5" />
            {topic.lessons} bài
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon name="Clock" className="h-3.5 w-3.5" />
            {topic.minutes} phút
          </span>
        </div>
      </div>
    </article>
  );
}
