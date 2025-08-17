import LegendDot from "@/components/shared/LegendDot";
import type { JSX } from "react";
import {
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
} from "recharts";

// You can move this type to a shared types file if reused elsewhere
export interface MonthlyData {
  month: string;
  students: number;
  revenue: number;
}

interface MonthlyRegistrationsChartProps {
  data?: MonthlyData[];
}

const tooltipStyle: React.CSSProperties = {
  backgroundColor: "rgba(17, 24, 39, 0.8)",
  border: "none",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  color: "white",
};

export default function MonthlyRegistrationsChart({
  data = [],
}: MonthlyRegistrationsChartProps): JSX.Element {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      
      <div className="flex justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            تسجيل الطلاب الشهري
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            نمو التسجيلات خلال الأشهر الماضية
          </p>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <LegendDot color="bg-blue-500" label="الطلاب" />
          <LegendDot color="bg-green-500" label="الإيرادات" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area
            type="monotone"
            dataKey="students"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#colorStudents)"
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={3}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
