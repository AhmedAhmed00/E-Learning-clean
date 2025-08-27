import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Eye, Users, Star, DollarSign } from "lucide-react"

interface TopCourse {
  id: number
  title: string
  average_rating: number
  total_students: number
  total_profit: number
}

function CourseItem({ title, average_rating, total_students, total_profit }: TopCourse) {
  return (
    <div className="flex items-center justify-between pb-4 border-b last:border-0">
      <div className="flex flex-col gap-1">
        <span className="text-[14px] font-bold text-black">{title}</span>
        <div className="flex gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Users size={16} /> {total_students} طالب
          </span>
          <span className="flex items-center gap-1">
            <Star size={16} className="text-yellow-500" /> {average_rating}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign size={16} /> {total_profit} جنيه
          </span>
        </div>
      </div>
    </div>
  )
}

export function LastActivityAndBestCourses({ top_courses }: { top_courses: TopCourse[] }) {
  return (
    <div className="grid grid-cols-12 gap-4 mt-4">
      <Card className="col-span-8 w-full">
        <CardHeader>
          <CardTitle>أفضل الدورات</CardTitle>
          <CardDescription>الأكثر شعبية ونجاحاً</CardDescription>
       
        </CardHeader>
        <CardContent>
          {top_courses?.map((course) => (
            <CourseItem key={course.id} {...course} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
