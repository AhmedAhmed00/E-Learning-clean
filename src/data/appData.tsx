import { BookOpen, Eye, Group } from "lucide-react";

  export interface OrderStatusItem {
  name: string;
  value: number;
  color: string;
}
  export const orderStatusData: OrderStatusItem[] = [
    { name: 'Pending', value: 0, color: '#FFA500' },
    { name: 'Approved', value:  0, color: '#4CAF50' },
    { name: 'Rejected', value:  0, color: '#F44336' },
  ];
  
  
  export interface Activity {
  id: number
  message: string
  time: string
  icon?: React.ReactNode
}

export interface Course {
  id: number
  title: string
  students: number
  icon?: React.ReactNode
}

export const activities: Activity[] = [
  {
    id: 1,
    message: "انضم طالب جديد: أحمد محمد",
    time: "منذ 5 دقائق",
    icon: <Group className="h-4 w-4 text-white" />,
  },
  {
    id: 2,
    message: "انضم طالب جديد: سارة علي",
    time: "منذ 10 دقائق",
    icon: <Eye className="h-4 w-4 text-white" />,
  },
  {
    id: 3,
    message: "تمت إضافة دورة جديدة",
    time: "منذ 20 دقيقة",
    icon: <Group className="h-4 w-4 text-white" />,
  },
  {
    id: 4,
    message: "انضم طالب جديد: محمد حسن",
    time: "منذ 30 دقيقة",
    icon: <Group className="h-4 w-4 text-white" />,
  },
]

export const bestCourses: Course[] = [
  {
    id: 1,
    title: "تطوير واجهات المستخدم بـ React",
    students: 120,
    icon: <BookOpen className="h-4 w-4 text-white" />,
  },
  {
    id: 2,
    title: "مدخل إلى تعلم الآلة",
    students: 95,
    icon: <BookOpen className="h-4 w-4 text-white" />,
  },
  {
    id: 3,
    title: "أساسيات تصميم واجهات المستخدم (UI/UX)",
    students: 80,
    icon: <BookOpen className="h-4 w-4 text-white" />,
  },
  {
    id: 4,
    title: "برمجة تطبيقات الهواتف باستخدام Flutter",
    students: 75,
    icon: <BookOpen className="h-4 w-4 text-white" />,
  },
]