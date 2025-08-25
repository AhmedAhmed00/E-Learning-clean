import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Users,

  User,
  Trash2,
  Pencil,
  Eye,
} from "lucide-react"

export interface CardItem {
  id: number
  image: string
  leftText: string
  rightText: string
  bottomText: string
}


interface Course {
  id: number;
  title: string;
  description: string;
  category: number;
  instructor: number;
  lectures: Lecture[];
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
  price: string; // comes as string "120.00"
  instructor_name:string
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
  video: string; // URL
}

interface LectureFile {
  id: number;
  title: string;
  file: string; // URL
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
average_stars,category,created_at,description,discount_percentage,final_price,id,instructor_name,instructor,is_offer,lectures,price,title,total_ratings,updated_at
}: Course) {
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
        {/* العنوان */}
        <h3 className="text-lg font-bold">{title}</h3>

        {/* بيانات إضافية */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" /> {instructor_name}
          </div>
          {/* <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> 8 أسابيع
          </div> */}
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