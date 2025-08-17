import type { LucideIcon } from "lucide-react";

interface RoundedCardProps {
  icon: LucideIcon;
  number: number | string;
  title: string;
  desc?: string;
  iconBg?: string; // لون خلفية الأيقونة (className من Tailwind)
}

export default function RoundedCard({
  icon: Icon,
  number,
  title,
  desc,
  iconBg = "bg-indigo-500", // لون افتراضي
}: RoundedCardProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-full border shadow-2xl w-52 h-52 bg-white dark:bg-gray-900">
      {/* Circle with icon */}
      <div className={`p-3 rounded-full shadow-md flex items-center justify-center ${iconBg}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>

      {/* Number */}
      <span className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
        {number}
      </span>

      {/* Title */}
      <span className="text-sm text-gray-700 dark:text-gray-300">{title}</span>

      {/* Description */}
      {desc && (
        <div className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
          {desc}
        </div>
      )}
    </div>
  );
}
