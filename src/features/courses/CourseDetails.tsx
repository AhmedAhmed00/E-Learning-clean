import { BookOpen, Star, Clock, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Heading from "@/components/shared/Heading";
import { CourseHeading } from "./CourseHeading";
import { LectureCard } from "./LectureCard";
import { LectureForm } from "@/components/forms/LectureForm";
import useFetchById from "@/hooks/useFetchById";
import { useParams } from "react-router";
import { coursesServices } from "@/data/api";

// --- Interfaces ---
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
  is_offer: boolean;
  final_price: number;
  total_ratings: number;
  average_stars: number;
  discount_percentage: number;
  instructor_name: string;
  total_students: number;
  image: string | null;
  active: boolean;
  category_name: string;
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

// --- Main Component ---
export default function CourseDetails() {
  const { id } = useParams();
  const { data, isLoading, error } = useFetchById<Course>("course", id, coursesServices.getById);

  if (isLoading) {
    return <div>جاري التحميل...</div>;
  }

  if (error || !data) {
    return <div>حدث خطأ أثناء جلب بيانات الكورس.</div>;
  }

  return (
    <div>
      {/* Page Heading */}
      <div className="flex items-center shadow-lg rounded-2xl p-4 mt-6 justify-between mb-10">
        <Heading
          titleSize="text-[25px]"
          title={"تفاصيل الكورس"}
          desc="إدارة ومتابعة محتوى الكورس"
          icon={BookOpen}
        />
      </div>

      {/* Course Main Info */}
      <CourseHeading
        price={parseFloat(data?.final_price?.toString() ?? "0")}
        title={data?.title}
        description={data?.description}
        students={data?.total_students}
        duration="غير متوفرة"
        rating={data?.average_stars}
        reviews={data?.total_ratings}
        tags={[
          { label: data?.category_name, color: "bg-green-100 text-green-700" },
        ]}
        image={
          data?.image ??
          "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg"
        }
      />

      {/* Tabs Section */}
      <Tabs defaultValue="content" className="w-full mt-10">
        <TabsList className="flex justify-start gap-4 border-b rounded-none">
          <TabsTrigger value="content" className="px-4 py-2">
            المحتوي
          </TabsTrigger>
          <TabsTrigger value="students" className="px-4 py-2">
            الطلاب
          </TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="mt-6 space-y-6">
          <div className="flex w-full justify-between">
            <h3>محتوي الكورس</h3>
            <h3>محتوي الكورس</h3>
          </div>

          {/* Course Overview */}
          <div className="bg-white shadow-2xl p-6 rounded-2xl">
            <div className="flex w-full justify-between me-6">
              <CardContent className="text-center md:text-right space-y-3 p-0">
                <h2 className="text-3xl font-bold">{data?.title}</h2>
                <p className="text-gray-600 text-lg">
                  {data?.description}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-600 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{data?.lectures?.length ?? 0} محاضرة</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>غير متوفرة</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>
                      {data?.average_stars?.toFixed(1)} ({data?.total_ratings} تقييم)
                    </span>
                  </div>
                </div>
              </CardContent>

              {/* Lecture Form */}
              <LectureForm id={id} />
            </div>

            {/* Lectures List */}
            <div className="mt-6 space-y-4">
              {data?.lectures?.map((lecture) => (
                <LectureCard
                  key={lecture.id}
                  number={lecture.number.toString()}
                  title={lecture.title}
                  description={`يشمل ${lecture.videos.length} فيديو و ${lecture.files.length} ملفات و ${lecture.quizzes.length} اختبارات`}
                  duration="غير متوفرة"
                  progress={0}
                  status="منشورة"
                  completed={false}
                  id={lecture.id}
                  attachments={lecture.files.length}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="mt-6">
          <Card className="p-6 rounded-2xl shadow-md text-center">
            <p className="text-gray-600">قائمة الطلاب ستظهر هنا</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
