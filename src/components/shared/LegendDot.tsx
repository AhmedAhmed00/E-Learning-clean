import type { JSX } from "react";

interface LegendDotProps {
  color: string;
  label: string;
}

const LegendDot = ({ color, label }: LegendDotProps): JSX.Element => (
  <div className="flex items-center space-x-1 space-x-reverse">
    <div className={`w-3 h-3 ${color} rounded-full`} />
    <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
  </div>
);


export default LegendDot