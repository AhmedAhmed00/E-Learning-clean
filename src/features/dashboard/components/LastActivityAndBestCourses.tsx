import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { activities, bestCourses, type Activity, type Course } from "@/data/appData"
import { Eye } from "lucide-react"



function ActivityItem({ message, time, icon }: Activity) {
  return (
    <div className="flex items-center pb-4">
      <div className="flex items-center gap-3 space-x-reverse">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
          {icon}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-bold text-black">{message}</span>
          <span className="text-[14px] font-thin text-black">{time}</span>
        </div>
      </div>
    </div>
  )
}

function CourseItem({ title, students, icon }: Course) {
  return (
    <div className="flex items-center pb-4">
      <div className="flex items-center gap-3 space-x-reverse">
        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
          {icon}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[14px] font-bold text-black">{title}</span>
          <span className="text-[14px] font-thin text-black">
            {students} طالب مسجل
          </span>
        </div>
      </div>
    </div>
  )
}

export function LastActivityAndBestCourses() {
  return (
    <div className="grid grid-cols-12 gap-4 mt-4">
      {/* 20% width (1/5) */}
      <Card className="col-span-4 w-full">
        <CardHeader>
          <CardTitle>النشاط الأخير</CardTitle>
          <CardDescription>أخر الاحداث في المنصة</CardDescription>
          <CardAction>
            <Eye className="w-5 h-5" />
          </CardAction>
        </CardHeader>
        <CardContent>
          
          {activities?.map((activity) => (
            <ActivityItem
              key={activity.id}
              message={activity.message}
              time={activity.time}
              icon={activity.icon}
              id={activity.id}
            />
          ))}
        </CardContent>
      </Card>

      {/* 80% width (4/5) */}
      <Card className="col-span-8 w-full">
        <CardHeader>
          <CardTitle>أفضل الدورات</CardTitle>
          <CardDescription>الأكثر شعبية ونجاحاً</CardDescription>
          <CardAction>
            <Eye className="w-5 h-5" />
          </CardAction>
        </CardHeader>
        <CardContent>
          {bestCourses?.map((course) => (
            <CourseItem
              key={course.id}
              title={course.title}
              students={course.students}
              icon={course.icon}
              id={course.id}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
