import { BookOpen, Star, Clock, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import Heading from "@/components/shared/Heading"
import { CourseHeading } from "./CourseHeading"
import { LectureCard } from "./LectureCard"
import { LectureForm } from "@/components/forms/LectureForm"

export default function CourseDetails() {
  return (
    <div>
      {/* Page Heading */}
      <div className="flex items-center shadow-lg rounded-2xl p-4 mt-6 justify-between mb-10">
        <Heading
          titleSize="text-[25px]"
          title="تفاصيل الكورس"
          desc="إدارة ومتابعة محتوى الكورس"
          icon={BookOpen}
        />
      </div>

      {/* Course Main Info */}
      <CourseHeading
        price={99}
        title="أساسيات البرمجة بـ Python"
        description="كورس شامل لتعلم أساسيات البرمجة باستخدام لغة Python من الصفر حتى الاحتراف"
        students={1245}
        duration="12 ساعة"
        rating={4.8}
        reviews={324}
        tags={[
          { label: "مبتدئ", color: "bg-green-100 text-green-700" },
          { label: "البرمجة", color: "bg-blue-100 text-blue-700" },
        ]}
        image="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg"
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
        <TabsContent value="content" className="mt-6 space-y-6 ">
          <div className="flex w-full justify-between"> 
            <h3>محتوي الكورس</h3>
            <h3>محتوي الكورس</h3>
          </div>
          {/* Course Overview */}
          <div className="bg-white shadow-2xl p-6  rounded-2xl "> 
            
          <div className=" flex w-ful justify-between me-6">
            <CardContent className="text-center md:text-right space-y-3 p-0">
              <h2 className="text-3xl font-bold">أساسيات البرمجة</h2>
              <p className="text-gray-600 text-lg">
                في هذا القسم ستتعرف على تفاصيل الكورس وعدد المحاضرات والمدة.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-600 text-sm ">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>12 محاضرة</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>12 ساعة</span>
                </div>
                <div className="flex items-center gap-1 ">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>4.8 (324 تقييم)</span>
                </div>
              </div>
            
            </CardContent>
            {/* الفورم هنااااااااااااااا يعم احمد  */}
            
            <LectureForm />
            
              
              
              
              
              
              
          </div>
          
          
          
          
          
          
          
          
          

          {/* Lectures List */}
          <div className="mt-6 space-y-4 ">
            <LectureCard
              number="1.1"
              title="ما هي البرمجة؟"
              description="مقدمة شاملة عن البرمجة وأهميتها"
              duration="15:30 / 15:30"
              progress={100}
              status="منشورة"
              completed
              attachments={1}
            />
            <LectureCard
              number="1.2"
              title="تثبيت بيئة العمل"
              description="كيفية تثبيت Python وإعداد بيئة التطوير"
              duration="10:45 / 12:00"
              progress={85}
              status="مسودة"
              attachments={2}
            />
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
  )
}
