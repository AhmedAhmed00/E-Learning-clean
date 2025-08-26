import { Card } from "@/components/ui/card";
import { BadgeCheck, BookOpen, Play } from "lucide-react";

const courses = [
  {
    title: "أساسيات البرمجة بـ Python",
    instructor: "أحمد محمود",
    progress: 75,
    lessonsCompleted: 15,
    totalLessons: 20,
    grade: "85%",
    status: "نشط",
    date: "2024/8/15",
    completed: false,
    hasGrade: true,
  },
  {
    title: "تطوير المواقع الإلكترونية",
    instructor: "فاطمة الأحمد",
    progress: 100,
    lessonsCompleted: 25,
    totalLessons: 25,
    grade: "92%",
    status: "مكمل",
    date: "2024/8/10",
    completed: true,
    hasGrade: true,
  },
  {
    title: "التسويق الرقمي",
    instructor: "محمد الشريف",
    progress: 30,
    lessonsCompleted: 5,
    totalLessons: 15,
    grade: "غير محدد",
    status: "نشط",
    date: "2024/8/20",
    completed: false,
    hasGrade: false,
  },
];

export default function StudentCoursesList() {
  return (
    <div className="space-y-6">
      {courses.map((course, idx) => (
        <Card
          key={idx}
          className="flex flex-col md:flex-row justify-between
           items-start md:items-center p-6 gap-4 shadow-md rounded-2xl"
        >
          {/* Left: Course Info */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {course.title}
              </h3>

              <div className="flex items-center gap-2">
                {course.completed ? (
                  <span className="text-green-600 bg-green-100 text-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <BadgeCheck className="w-4 h-4" /> مكمل
                  </span>
                ) : (
                  <span className="text-blue-600 bg-blue-100 text-sm px-2 py-1 rounded-full flex items-center gap-1">
                    <Play className="w-4 h-4" /> نشط
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-2">
              بواسطة {course.instructor}
            </p>

            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>التقدم</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full ${
                    course.progress === 100
                      ? "bg-green-500"
                      : course.progress >= 50
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                الدروس: {course.lessonsCompleted}/{course.totalLessons}
              </span>
              <span>الدرجة: {course.grade}</span>
            </div>

            <p className="text-xs text-gray-400">
              تاريخ التسجيل: {course.date}
            </p>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col items-center gap-2">
            {course.completed && (
              <button className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                الشهادة
              </button>
            )}
            <button className="text-sm text-primary underline">
              عرض التفاصيل
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}






