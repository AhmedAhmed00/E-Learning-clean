"use client";

import Heading from "@/components/shared/Heading";
import RoundedCard from "@/components/shared/rounded-card";
import { BookOpen, Eye, ListStartIcon, Users } from "lucide-react";
import { motion } from "framer-motion";
import { dashboardCards } from "@/data/cards";
import OrderStatusChart from "@/features/dashboard/components/charts/OrderStatusChart";
import { orderStatusData } from "@/data/appData";
import MonthlyRegistrationsChart from "@/features/dashboard/components/charts/MonthlyRegistrationsChart";
import { LastActivityAndBestCourses } from "@/features/dashboard/components/LastActivityAndBestCourses";
import { QuickAction } from "@/features/dashboard/components/QuickAction";

export default function Dashboard() {


  return (
    <div>
      <Heading
        title="لوحة التحكم"
        desc="نظرة شاملة علي اداء منصتك التعليمية"
        icon={ListStartIcon}
      />

      <div className="grid grid-cols-1 place-items-center sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
        {dashboardCards.map((card, i) => (
          <motion.div
            key={i}
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
           <div className="grid grid-cols-1 mb-8 lg:grid-cols-3 mt-6 gap-8">
        <MonthlyRegistrationsChart data={[]} />
        <OrderStatusChart data={orderStatusData} />
      </div>

      
      <LastActivityAndBestCourses />
                <div className="bg-gradient-to-r mt-8
                 from-blue-500 via-indigo-500 to-purple-500 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white">إجراءات سريعة</h3>
          <p className="text-blue-100">اختصارات للمهام الأكثر استخداماً</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickAction to="/courses" icon={<BookOpen />} title="إضافة كورس جديد" description="إنشاء كورس تعليمي جديد" />
          <QuickAction to="/teachers" icon={<Users />} title="إضافة مدرس" description="دعوة مدرس جديد للمنصة" />
          <QuickAction to="/orders" icon={<Eye />} title="مراجعة الطلبات" description="مراجعة الطلبات المعلقة" />
        </div>
      </div>
      
      
    </div>
  );
}
