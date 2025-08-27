"use client";

import Heading from "@/components/shared/Heading";
import RoundedCard from "@/components/shared/rounded-card";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import {
  BookOpen,
  CheckCircle2,
  BarChart2,
  CreditCard,
  User,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import StudentCoursesList from "./StudentCoursesList";
import { useFetch } from "@/hooks/useFetch";
import { studentsServices } from "@/data/api";
import { useParams } from "react-router";

export default function StudentDetails() {
  const { id } = useParams();
  const { data, isLoading } = useFetch({
    service: studentsServices.getById,
    id,
    key: "student-details",
  });

  if (isLoading) return <p className="p-6">جار التحميل...</p>;
  if (!data) return <p className="p-6">لم يتم العثور على بيانات الطالب</p>;

  const studentInfo = [
    { label: "الاسم", value: data.user?.name },
    { label: "البريد الإلكتروني", value: data.user?.email },
    { label: "رقم الهاتف", value: data.user?.phone },
    { label: "التعليم", value: data.education_type },
    {
      label: "تاريخ التسجيل",
      value: new Date(data.user_created_at).toLocaleDateString("ar-EG"),
    },
    { label: "الحالة", value: data.user_is_active ? "نشط" : "غير نشط" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center shadow-lg rounded-2xl p-4 mt-6 justify-between mb-10">
        <Heading
          titleSize="text-[25px]"
          title="ملف الطالب"
          desc="عرض وإدارة تفاصيل الطالب ومتابعة تقدمه"
          icon={BookOpen}
        />
      </div>

      {/* Stats (dummy until backend provides) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
        <RoundedCard
          icon={BookOpen}
          iconBg="bg-blue-600 text-blue-600"
          title="الكورسات المسجلة"
          number={data?.courses_registered}
        />
        <RoundedCard
          icon={CheckCircle2}
          iconBg="bg-green-600 text-green-600"
          title="الكورسات المكتملة"
          number={data?.courses_completed}
        />

        <RoundedCard
          icon={CreditCard}
          iconBg="bg-purple-600 text-purple-600"
          title="إجمالي الإنفاق"
          number={data?.total_spent}
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full mt-10">
        <TabsList className="flex justify-start gap-4 border-b rounded-none">
          <TabsTrigger value="overview" className="px-4 py-2">
            نظرة عامة
          </TabsTrigger>
          <TabsTrigger value="courses" className="px-4 py-2">
            الكورسات المسجلة
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-2">
            <Card className="p-6 shadow-md rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-700">
                  معلومات شخصية
                </h2>
                <Avatar className="w-[100px] h-[100px]">
                  <AvatarImage
                    src={data?.image}
                    alt={data?.user?.name || "User"}
                  />
                  <AvatarFallback>
                    {data?.user?.name
                      ? data.user.name.charAt(0).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-4">
                {studentInfo.map(
                  (item, idx) =>
                    item.value && (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-gray-700 text-sm border-b pb-2 last:border-b-0 last:pb-0"
                      >
                        <span className="font-medium text-gray-500">
                          {item.label}:
                        </span>
                        <span>{item.value}</span>
                      </div>
                    ),
                )}
              </div>
            </Card>

            {/* <RecentActivity /> */}
          </div>
        </TabsContent>

        {/* Registered Courses Tab */}
        <TabsContent value="courses" className="mt-6">
          <StudentCoursesList purchased_courses={data?.purchased_courses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const recentActivities = [
  {
    title: 'أكمل درس "المتغيرات في Python"',
    icon: CheckCircle2,
    color: "text-green-600",
    time: "منذ يومين",
  },
  {
    title: 'أجرى اختبار "اختبار الفصل الأول"',
    icon: BarChart2,
    color: "text-blue-600",
    time: "منذ 3 أيام",
  },
  {
    title: 'انضم للكورس "التسويق الرقمي"',
    icon: BookOpen,
    color: "text-purple-600",
    time: "منذ أسبوع",
  },
];

function RecentActivity() {
  return (
    <Card className="p-6 shadow-md rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-700">النشاط الأخير</h2>
        <span className="text-primary">🕒</span>
      </div>

      <div className="space-y-4">
        {recentActivities.map((activity, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 text-sm text-gray-700 border-b pb-3 last:border-b-0 last:pb-0"
          >
            <activity.icon className={`w-5 h-5 ${activity.color}`} />
            <div className="flex flex-col">
              <span>{activity.title}</span>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
