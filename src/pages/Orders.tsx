"use client";

import { motion } from "framer-motion";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  DollarSign,
  UserRound,
} from "lucide-react";

import Heading from "@/components/shared/Heading";
import TableOperations from "@/components/shared/table/TableOperations";
import RoundedCard from "@/components/shared/rounded-card";
import CustomTable from "@/components/shared/table/CustomTable";

const ordersTableColumns = [
  {
    label: "رقم الطلب",
    key: "id",
  },
  {
    label: "الطالب",
    key: "student",
  },
  {
    label: "الكورس",
    key: "course_name",
  },
  {
    label: "المبلغ",
    key: "amount",
  },
  {
    label: "التاريخ",
    key: "date",
  },
  {
    label: "الحالة",
    key: "status",
  },
];

const data = {
  count: 30,
  next: true,
  previous: false,
  results: [
    {
      name: "Order 1",
      vendorName: "Vendor 1",
      customerName: "Customer 1",
      driverName: "Driver 1",
      amount: 100,
      status: "Pending",
    },
    {
      name: "Order 2",
      vendorName: "Vendor 2",
      customerName: "Customer 2",
      driverName: "Driver 2",
      amount: 200,
      status: "Completed",
    },
  ],
};

// 📊 بيانات الطلبات
const orderStats = [
  {
    id: 1,
    title: "بانتظار المراجعة",
    number: 45,
    icon: ClipboardList,
    iconBg: "bg-yellow-500",
    desc: "طلبات تحتاج مراجعة",
  },
  {
    id: 2,
    title: "موافق عليها",
    number: 120,
    icon: CheckCircle2,
    iconBg: "bg-green-500",
    desc: "طلبات تمت الموافقة عليها",
  },
  {
    id: 3,
    title: "مرفوضة",
    number: 12,
    icon: XCircle,
    iconBg: "bg-red-500",
    desc: "طلبات تم رفضها",
  },
  {
    id: 4,
    title: "إجمالي الإيرادات",
    number: "$12,540",
    icon: DollarSign,
    iconBg: "bg-blue-500",
    desc: "القيمة الكلية من المبيعات",
  },
];

export default function Orders() {
  return (
    <>
      {/* 🏷️ الهيدر */}
      <div className="flex items-center shadow-lg rounded-2xl p-4 mt-6 justify-between mb-10">
        <Heading
          titleSize="text-[25px]"
          title="إدارة الطلبات"
          desc="مراجعة وإدارة طلبات الطلاب للكورسات"
          icon={UserRound}
        />


      </div>

      {/* 📊 الكروت الخاصة بالطلبات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {orderStats.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                delay: i * 0.15,
                duration: 0.5,
                type: "spring",
                stiffness: 120,
              },
            }}
          >
            <RoundedCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* 🔎 عمليات علي الجدول */}
      <div>
        <TableOperations resourse="طلب" />
      </div>

      <CustomTable
        actions={["view"]}
        loading={false}
        modalName="orders"
        columns={ordersTableColumns}
        data={data.results.map((item, index) => ({
          id: index.toString(),
          name: item.name,
          vendorName: item.vendorName,
          customerName: item.customerName,
          driverName: item.driverName,
          amount: item.amount,
          status: item.status,
        }))}
      />
    </>
  );
}
