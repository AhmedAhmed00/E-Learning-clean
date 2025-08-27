import Heading from "@/components/shared/Heading";
import RoundedCard from "@/components/shared/rounded-card";
import {
  BookOpen,
  Eye,
  ListStartIcon,
  Users,
  DollarSign,
  LucideActivity,
  Clock,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";
import MonthlyRegistrationsChart from "@/features/dashboard/components/charts/MonthlyRegistrationsChart";
import { LastActivityAndBestCourses } from "@/features/dashboard/components/LastActivityAndBestCourses";
import { QuickAction } from "@/features/dashboard/components/QuickAction";
import { useFetch } from "@/hooks/useFetch";
import { overviewServices } from "@/data/api";
import TableOperations, {
  CustomFilter,
} from "@/components/shared/table/TableOperations";
import { OrderStatusChart } from "@/features/dashboard/components/charts/OrderStatusChart";

export default function Dashboard() {
  const { data } = useFetch({
    service: overviewServices.getAll,
    key: "overview",
  });

  const overviewCards = data
    ? [
        {
          icon: LucideActivity,
          title: "الكورسات النشطة",
          number: data.data.total_courses,
          desc: "عدد الكورسات المتاحة الآن",
          iconBg: "bg-blue-500",
        },
        {
          icon: Users,
          title: "إجمالي الطلاب",
          number: data.data.total_students,
          desc: "إجمالي عدد الطلاب المسجلين",
          iconBg: "bg-green-500",
        },
        {
          icon: DollarSign,
          title: "إجمالي الأرباح",
          number: `$${data.data.total_profit}`,
          desc: "مجموع أرباح المنصة",
          iconBg: "bg-emerald-600",
        },
        {
          icon: Clock,
          title: "الطلبات المعلقة",
          number: data.data.total_pending_orders,
          desc: "طلبات قيد المراجعة",
          iconBg: "bg-orange-500",
        },
      ]
    : [];

  return (
    <div>
      <div className="flex w-full justify-between">
        <Heading
          title="لوحة التحكم"
          desc="نظرة شاملة علي اداء منصتك التعليمية"
          icon={ListStartIcon}
        />

        <div className="flex gap-2">
          <CustomFilter
            resourse="من"
            filters={[
              {
                label: "تاريخ البداية",
                name: "date_from",
                type: "date",
              },
            ]}
          />

          <CustomFilter
            resourse="تاريخ الانتهاء"
            filters={[
              {
                label: "تاريخ الانتهاء",
                name: "date_to",
                type: "date",
              },
            ]}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 place-items-center sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
        {overviewCards.map((card, i) => (
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

      {/* Charts */}
      <div className="grid grid-cols-1 mb-8 lg:grid-cols-3 mt-6 gap-8">
        <MonthlyRegistrationsChart data={data?.data?.last_months} />
        
        
        
        
        
        <OrderStatusChart data={{
          pending_percentage:data?.data?.pending_percentage, 
          declined_percentage:data?.data?.declined_percentage, 
          accepted_percentage:data?.data?.accepted_percentage, 
          
          
          }} />
      </div>

      {/* Last Activity + Best Courses */}
      <LastActivityAndBestCourses top_courses={data?.data?.top_courses} />

      {/* Quick Actions */}
      <div
        className="bg-gradient-to-r mt-8
                 from-blue-500 via-indigo-500 to-purple-500 rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white">إجراءات سريعة</h3>
          <p className="text-blue-100">اختصارات للمهام الأكثر استخداماً</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickAction
            to="/courses"
            icon={<BookOpen />}
            title="إدارة الكورسات "
            description="إنشاء كورس تعليمي جديد"
          />
          <QuickAction
            to="/teachers"
            icon={<Users />}
            title="إدارة المدرسين"
            description="دعوة مدرس جديد للمنصة"
          />
          <QuickAction
            to="/orders"
            icon={<Eye />}
            title="إدارة الطلبات"
            description="مراجعة الطلبات المعلقة"
          />
        </div>
      </div>
    </div>
  );
}
