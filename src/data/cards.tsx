import {  LucideActivity, Users, DollarSign, Clock } from "lucide-react";

export const dashboardCards = [
    {
      icon: LucideActivity,
      title: "الكورسات النشطة",
      number: 12,
      desc: "عدد الكورسات المتاحة الآن",
      iconBg: "bg-blue-500",
    },
    {
      icon: Users,
      title: "اجمالي الطلاب",
      number: 320,
      desc: "إجمالي عدد الطلاب المسجلين",
      iconBg: "bg-green-500",
    },
    {
      icon: DollarSign,
      title: "اجمالي الأرباح",
      number: "$5400",
      desc: "مجموع أرباح المنصة",
      iconBg: "bg-emerald-600",
    },
    {
      icon: Clock,
      title: "الطلبات المعلقة",
      number: 7,
      desc: "طلبات قيد المراجعة",
      iconBg: "bg-orange-500",
    },
  ];