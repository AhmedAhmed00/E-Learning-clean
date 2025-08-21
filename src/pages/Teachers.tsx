import { motion } from "framer-motion";
import {
  Users,

  UserRound,
  Badge,
  User,
  Clock,
  Trash2,
  Pencil,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Heading from "@/components/shared/Heading";
import { CourseCard, type CardItem } from "@/features/courses/CourseCard";
import TableOperations from "@/components/shared/table/TableOperations";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TeacherForm } from "@/components/forms/TeacherForm";



// 🎓 بيانات الكورسات

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

export default function Teachers() {
  return (
    <>
      {/* 🏷️ الهيدر */}
      <div className="flex items-center shadow-lg rounded-2xl p-4 mt-6 justify-between mb-10">
        <Heading
          titleSize="text-[25px]"
          title="إدارة المدرسين"
          desc="إدارة المدرسين والمحاضرين في المنصة"
          icon={UserRound}
        />
        
        <Button className="text-[16px] mx-8">
        <TeacherForm />
        </Button>
      </div>

      {/* 📊 الكروت الصغيرة مع الأنيميشن */}
  
      {/* عمليات علي الجدول */}
      <div> 
        <TableOperations resourse="مدرس" />
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



export function TeacherCard({
  image,
  leftText,
  rightText,
  bottomText,
}: CardItem) {
  return (
    <Card className="overflow-hidden rounded-2xl py-0 shadow-lg">
      {/* الصورة + البادجات */}
      <div className="relative">
        <img src={image} alt="Course" className="w-full h-44 object-cover" />
        <div className="absolute top-3 left-3">
          <Badge className="bg-yellow-100 text-yellow-700">{leftText}</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-green-100 text-green-700">{rightText}</Badge>
        </div>
      </div>

      {/* المحتوى */}
      <CardContent className="p-4 space-y-2">
        {/* العنوان */}
        <h3 className="text-lg font-bold">{bottomText}</h3>

        {/* بيانات إضافية */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" /> أحمد محمد
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> 8 أسابيع
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" /> 156 طالب
          </div>
        </div>

        {/* السعر */}
        <p className="text-xl font-bold text-blue-600 mt-2">$299</p>
      </CardContent>

      {/* الأزرار */}
      <CardFooter className="flex items-center justify-between p-4 border-t">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="outline">
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
        <Button variant="secondary" className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          عرض التفاصيل
        </Button>
      </CardFooter>
    </Card>
  )
}