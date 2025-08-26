import { LectureForm } from "@/components/forms/LectureForm";
import Heading from "@/components/shared/Heading";
import RoundedCard from "@/components/shared/rounded-card";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@radix-ui/react-tabs";
import {
  BookOpen,
  CheckCircle2,
  BarChart2,
  CreditCard,
  User,
} from "lucide-react";
import StudentCoursesList from "./StudentCoursesList";

const info = [
  { label: "تاريخ الميلاد", value: "15 مارس 2001" },
  { label: "العنوان", value: "الرياض، المملكة العربية السعودية" },
  { label: "التعليم", value: "بكالوريوس في علوم الحاسب" },
  { label: "المهنة", value: "طالب جامعي" },
  { label: "آخر نشاط", value: "25 أغسطس 2025" },
];

export default function StudentDetails() {
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <RoundedCard
          icon={BookOpen}
          iconBg="bg-blue-600 text-blue-600"
          title="الكورسات المسجلة"
          number={2}
        />
        <RoundedCard
          icon={CheckCircle2}
          iconBg="bg-green-600 text-green-600"
          title="الكورسات المكتملة"
          number={5}
        />
        <RoundedCard
          icon={BarChart2}
          iconBg="bg-yellow-600 text-yellow-600"
          title="متوسط التقدم"
          number="75%"
        />
        <RoundedCard
          icon={CreditCard}
          iconBg="bg-purple-600 text-purple-600"
          title="إجمالي الإنفاق"
          number="250$"
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
                <User className="text-primary" />
              </div>

              <div className="space-y-4">
                {info.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-gray-700 text-sm border-b pb-2 last:border-b-0 last:pb-0"
                  >
                    <span className="font-medium text-gray-500">
                      {item.label}:
                    </span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>


       <RecentActivity />
          </div>
          
        </TabsContent>

        {/* Registered Courses Tab */}
        <TabsContent value="courses" className="mt-6">
          <Card className="p-6 rounded-2xl shadow-md text-center">
            <StudentCoursesList />
          </Card>
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