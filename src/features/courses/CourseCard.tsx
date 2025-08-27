import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { insCourses } from "@/data/api"
import useDelete from "@/hooks/useDelete"
import {
  Users,
  User,
  Trash2,
  Pencil,
  Eye,
} from "lucide-react"
import { Link } from "react-router"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CourseForm } from "@/components/forms/CourseForm"

interface Course {
  id: number;
  title: string;
  description: string;
  category: number;
  instructor: number;
  lectures: Lecture[];
  created_at: string;
  updated_at: string;
  price: string;
  instructor_name: string;
  is_offer: boolean;
  final_price: number;
  total_ratings: number;
  average_stars: number;
  discount_percentage: number;
}

interface Lecture {
  id: number;
  number: number;
  title: string;
  videos: Video[];
  files: LectureFile[];
  quizzes: Quiz[];
}

interface Video {
  id: number;
  title: string;
  video: string;
}

interface LectureFile {
  id: number;
  title: string;
  file: string;
}

interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

interface Question {
  id: number;
  text: string;
  answers: Answer[];
}

interface Answer {
  id: number;
  text: string;
  is_correct: boolean;
}

export function CourseCard({
  average_stars,
  description,
  id,
  instructor_name,
  title,
  defaultValues
}: Course) {
  const { mutate: delCourse } = useDelete({
    service: insCourses.delete,
    key: "courses",
    resource: "الكورس",
  })
  

  return (
    <Card className="overflow-hidden rounded-2xl py-0 shadow-lg">
      {/* الصورة + البادجات */}
      <div className="relative">
        <img src={"image"} alt="Course" className="w-full h-44 object-cover" />
        <div className="absolute top-3 left-3">
          <Badge className="bg-yellow-100 text-yellow-700">{average_stars}</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-green-100 text-green-700">{description}</Badge>
        </div>
      </div>

      {/* المحتوى */}
      <CardContent className="p-4 space-y-2">
        <h3 className="text-lg font-bold">{title}</h3>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" /> {instructor_name}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" /> 156 طالب
          </div>
        </div>
        <p className="text-xl font-bold text-blue-600 mt-2">$299</p>
      </CardContent>

      {/* الأزرار */}
      <CardFooter className="flex items-center justify-between p-4 border-t">
        <div className="flex items-center gap-2">
          {/* ✅ زر الحذف مع AlertDialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                <AlertDialogDescription>
                  سيتم حذف هذا الكورس نهائيًا ولا يمكن التراجع عن ذلك.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => delCourse(id)} // ✅ الحذف عند التأكيد
                >
                  حذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

            <CourseForm  defaultValues={defaultValues} />
        </div>

        <Link to={`${id}`}>
          <Button variant="secondary" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            عرض التفاصيل
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
