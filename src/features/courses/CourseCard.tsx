import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {  insCoursesServices } from "@/data/api"
import useDelete from "@/hooks/useDelete"
import {
  Users,
  User,
  Trash2,
  Pencil,
  Eye,
  Star,
  Clock,
  BookOpen,
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
  category_name: string;
  defaultValues?: any;
  total_students?: number;
  total_lectures?: number;
  total_duration?: string;
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
  final_price,
  category_name,
  defaultValues,
  total_students ,
  total_lectures,
  image,
}: Course) {
  const { mutate: delCourse } = useDelete({
    service: insCoursesServices.delete,
    key: "courses",
    resource: "الكورس",
  })
  
  // Generate a placeholder image based on course title

  return (
    <Card className="overflow-hidden py-0 gap-3 rounded-xl border-0 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
      {/* Course Image with Overlay */}
      <div className="relative group">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Price Badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-white dark:bg-gray-900 rounded-lg py-1 px-3 shadow-md">
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {final_price} $
            </p>
          </div>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white dark:bg-gray-800/90 dark:text-white dark:hover:bg-gray-800">
            {category_name}
          </Badge>
        </div>
        
        {/* Rating Overlay */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full py-1 px-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium ml-1 dark:text-white">
              {average_stars.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <CardContent className="px-4 space-y-2 ">
        <h3 className="text-lg font-bold line-clamp-2  dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
          {description}
        </p>

      

        {/* Course Stats */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span> المدرس {instructor_name} </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{total_students} طالب</span>
          </div>

          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span>{total_lectures} محاضرة</span>
          </div>
          {/* <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{total_duration}</span>
          </div> */}
        </div>

        {/* Star Rating */}
        <div className="flex items-center mb-2 gap-1">
          <StarRating rating={Number(average_stars)} size={16} />
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            ({total_students})
          </span>
        </div>
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="flex items-center justify-between p-4 pt-0 border-0">
        <div className="flex items-center gap-2">
          {/* Delete Button with Confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-9 w-9 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="dark:bg-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="dark:text-white">هل أنت متأكد؟</AlertDialogTitle>
                <AlertDialogDescription className="dark:text-gray-300">
                  سيتم حذف هذا الكورس نهائيًا ولا يمكن التراجع عن ذلك.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                  إلغاء
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => delCourse(id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  حذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Edit Course Button */}
          <CourseForm defaultValues={defaultValues}>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-9 w-9 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </CourseForm>
        </div>

        {/* View Details Button */}
        <Link to={`${id}`}>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 rounded-full bg-transparent hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 dark:text-white"
          >
            <Eye className="w-4 h-4" />
            <span>عرض التفاصيل</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

// Star Rating Component (Improved)
type StarProps = {
  fillPercent: number;
  size?: number;
};

function StarIcon({ fillPercent, size = 12 }: StarProps) {
  const p = Math.max(0, Math.min(100, fillPercent));
  const id = `star-${Math.random().toString(36).slice(2, 9)}`;
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      className="inline-block"
    >
      <defs>
        <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset={`${p}%`} stopColor="#fbbf24" />
          <stop offset={`${p}%`} stopColor="#d1d5db" />
          <stop offset="100%" stopColor="#d1d5db" />
        </linearGradient>
      </defs>
      
      <path
        d="M12 .587l3.668 7.431 8.21 1.192-5.938 5.788 1.402 8.175L12 18.896l-7.342 3.877 1.402-8.175L.122 9.21l8.21-1.192L12 .587z"
        fill={`url(#grad-${id})`}
      />
    </svg>
  );
}

type StarRatingProps = {
  rating: number;
  maxStars?: number;
  size?: number;
  className?: string;
};

export function StarRating({ rating, maxStars = 5, size = 16, className = "" }: StarRatingProps) {
  const stars = Array.from({ length: maxStars }, (_, i) => {
    const starValue = i + 1;
    return Math.max(0, Math.min(100, (rating - i) * 100));
  });

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {stars.map((p, i) => (
        <StarIcon key={i} fillPercent={p} size={size} />
      ))}
    </div>
  );
}