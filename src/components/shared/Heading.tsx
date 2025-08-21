import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface HeadingProps {
  title: string;
  desc?: string;
  icon: LucideIcon;
  titleSize?:string;
  descSize?:string
}

export default function Heading({ title, desc, icon: Icon , titleSize="",descSize="" }: HeadingProps) {
  return (
    <div className="flex items-center px-6 py-4 ">
      <div className="flex items-center gap-3 space-x-reverse">
        <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <span className={cn("text-[18px] font-bold text-black" , titleSize)}>{title}</span>
          {desc && (
            <div className={cn("text-[14px] text-slate-700 dark:text-gray-400",descSize)}>
              {desc}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
