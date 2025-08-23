import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DollarSign, Star, Users } from "lucide-react"

interface Course {
  id: string
  title: string
  price: number
  isActive: boolean
  profit: number
  students: number
  reviews: number
  rating: number
  createdAt: string
}
export function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="p-6 shadow-md rounded-2xl">
      {/* السعر والحالة */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-lg">${course.price}</span>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            course.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          {course.isActive ? "نشط" : "متوقف"}
        </span>
      </div>

      {/* العنوان + تاريخ الإنشاء */}
      <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
      <p className="text-gray-500 text-sm mb-4">تم إنشاؤه في {course.createdAt}</p>

      {/* الإحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex flex-col items-center">
          <DollarSign className="w-5 h-5 text-purple-500" />
          <span className="font-semibold">${course.profit}</span>
          <span className="text-gray-500">الأرباح</span>
        </div>

        <div className="flex flex-col items-center">
          <Users className="w-5 h-5 text-blue-500" />
          <span className="font-semibold">{course.students}</span>
          <span className="text-gray-500">الطلاب</span>
        </div>

        <div className="flex flex-col items-center">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold">{course.rating}</span>
          <span className="text-gray-500">التقييم</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="font-semibold">{course.reviews}</span>
          <span className="text-gray-500">التقييمات</span>
        </div>
      </div>

      {/* زر التفاصيل */}
      <Button >
        عرض التفاصيل
      </Button>
    </Card>
  )
}