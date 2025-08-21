import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Star,
  DollarSign,
  BookOpen,
} from "lucide-react";

import Heading from "@/components/shared/Heading";
import RoundedCard from "@/components/shared/rounded-card";
import { CourseCard, type CardItem } from "@/features/courses/CourseCard";
import TableOperations from "@/components/shared/table/TableOperations";
import { CourseForm } from "@/components/forms/CourseForm";
import { useFetch } from "@/hooks/useFetch";
import { coursesServices } from "@/data/api";

// 📊 بيانات الكروت الصغيرة (Dashboard)


// 🎓 بيانات الكورسات



export default function Courses() {
  
  
  
  
  const {data:{results,statistics,count}={}} = useFetch({ 
    service: coursesServices.getAll,
    key:"courses"
  })
  
  console.log(results);
  console.log(count);
  
  const dashboardCards = [
  {
    icon: Users,
    iconBg: "bg-blue-600 text-blue-600",
    number: statistics?.total_courses,
    title: "إجمالي الكورسات",
    desc: "إجمالي عدد الطلاب المسجلين بالنظام",
  },
  {
    icon: UserPlus,
    iconBg: "bg-green-600 text-green-600",
    number: statistics?.total_students_in_courses,

    title: "الطلاب المسجلين",
    desc: "الطلاب النشطين حالياً بالكورسات",
  },
  {
    icon: Star,
    iconBg: "bg-yellow-600 text-yellow-600",
       number: statistics?.average_rate,
    title: "متوسط التقييم",
    desc: "متوسط تقييم الكورسات من الطلاب",
  },
  {
    icon: DollarSign,
    iconBg: "bg-purple-600 text-purple-600",
    number: statistics?.total_profit,
    title: "إجمالي الإيرادات",
    desc: "إجمالي العوائد من الكورسات",
  },
];
  
  const cardItems: CardItem[] = [
  {
    id: 1,
    image: "https://picsum.photos/400/200?1",
    leftText: "🎓 كورس جديد",
    rightText: "🔥 الأكثر مبيعًا",
    bottomText: "تعلم أساسيات البرمجة مع تطبيقات عملية",
  },
  {
    id: 2,
    image: "https://picsum.photos/400/200?2",
    leftText: "📚 المستوى 2",
    rightText: "⭐ 4.8",
    bottomText: "كورس متقدم في JavaScript ",
  },
  {
    id: 3,
    image: "https://picsum.photos/400/200?3",
    leftText: "⏱️ جديد",
    rightText: "💰 خصم 50%",
    bottomText: "ابدأ رحلتك مع React.js الآن",
  },
];
  
  
  return (
    <>
      {/* 🏷️ الهيدر */}
      <div className="flex items-center shadow-lg rounded-2xl p-4 mt-6 justify-between mb-10">
        <Heading
          titleSize="text-[25px]"
          title="إدارة الكورسات"
          desc="إدارة وتنظيم جميع الكورسات التعليمية"
          icon={BookOpen}
        />
     <CourseForm />
      </div>

      {/* 📊 الكروت الصغيرة مع الأنيميشن */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
      {/* عمليات علي الجدول */}
      <div> 
        <TableOperations resourse="كورس" />
      </div>

      {/* 🎓 الكورسات مع الأنيميشن */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {cardItems.map((item, i) => (
          <motion.div
            key={item.id}
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
            <CourseCard {...item} />
          </motion.div>
        ))}
      </div>
    </>
  );
}
