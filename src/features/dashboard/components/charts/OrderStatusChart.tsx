import React, { Component } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const tooltipStyle: React.CSSProperties = {
  backgroundColor: "rgba(17, 24, 39, 0.8)",
  border: "none",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  color: "white",
};

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface OrderStatusChartProps {
  data: ChartDataItem[];
}

export default class OrderStatusChart extends Component<OrderStatusChartProps> {
  render() {
    const { data } = this.props;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">حالة الطلبات</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">توزيع الطلبات حسب الحالة</p>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
