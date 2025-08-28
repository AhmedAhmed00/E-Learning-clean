

import { motion } from "framer-motion";
import {
  UserRound,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import Heading from "@/components/shared/Heading";
import TableOperations from "@/components/shared/table/TableOperations";
import RoundedCard from "@/components/shared/rounded-card";
import CustomTable from "@/components/shared/table/CustomTable";
import { StudentForm } from "@/components/forms/StudentForm";
import { useFetch } from "@/hooks/useFetch";
import { studentsInsServices, studentsServices } from "@/data/api";
import Pagination from "@/components/shared/table/Pagination.jsx";

// 📋 أعمدة جدول الطلاب
const studentsTableColumns = [
  { label: "الطالب", key: "user_name" },
  { label: "البريد الالكتروني", key: "user_email" },
  { label: "رقم الهاتف", key: "user_phone" },
  { label: "تاريخ التسجيل", key: "user_created_at" ,   
     render: (value) => new Date(value).toLocaleDateString() ,
 },
  {
  label: "الحالة",
  key: "user_is_active",
  render: (value: boolean) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        value
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {value ? "نشط" : "غير نشط"}
    </span>
  ),
}

];

// 📊 بيانات أولية (تجريبية)


// 📊 إحصائيات الطلاب


export default function Students() {

  
  const role = localStorage.getItem("role")

  
  const { data,data:{results,count}={}, isLoading ,isError } = useFetch({ 
    service: role === "employee" ?  studentsServices.getAll: studentsInsServices.getAll, 
    key:"students",
  
  })
  console.log(data);
  const studentStats = [
  {
    id: 1,
    title: "إجمالي الطلاب",
    number: results?.total_students,
    icon: UserRound,
    iconBg: "bg-blue-500",
    desc: "عدد الطلاب المسجّلين",
  },
  {
    id: 2,
    title: "طلاب نشطين",
       number: results?.total_active_students,
    icon: GraduationCap,
    iconBg: "bg-green-500",
    desc: "طلاب مسجّلين حالياً بالكورسات",
  },
  {
    id: 3,
    title: "متوسط الطلاب لكل كورس",
       number: results?.average_students_in_courses,
    icon: BookOpen,
    iconBg: "bg-yellow-500",
    desc: "طلاب توقفوا عن الكورسات",
  },

];


  return (
    <>
      {/* 🏷️ الهيدر */}
      <div className="flex items-center shadow-lg rounded-2xl p-4 mt-6 justify-between mb-10">
        <Heading
          titleSize="text-[25px]"
          title="إدارة الطلاب"
          desc="مراجعة وإدارة بيانات الطلاب"
          icon={UserRound}
        />
        {localStorage.getItem("role")=== "instructor"  &&<StudentForm /> } 
       
      </div>

      {/* 📊 كروت إحصائيات الطلاب */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {studentStats.map((card, i) => (
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
      <div >
      <TableOperations
  resourse="الطالب"
  
  filters={[
    {
    name: "user__is_active",
    label: "حالة المستخدم",
    type: "select",
    options: [
      { value: "all", label: "جميع المستخدمين" },
      { value: "true", label: "نشط" },
      { value: "false", label: "غير نشط" }
    ],
    defaultValue: "all"
  },
  {
    name: "user__created_at__gte",
    label: "من تاريخ",
    type: "date"
  },
  {
    name: "user__created_at__lte", 
    label: "إلى تاريخ",
    type: "date"
  }
  ]}
/>
       
      </div>

      <CustomTable
        actions={["view","delete"]}
        loading={isLoading}
        modalName="students"
        endpoint={`students/manage`}
        columns={studentsTableColumns}
        data={results?.students ??[]}
        
       
      />
      <Pagination totalItems={count }  />
    </>
  );
}
