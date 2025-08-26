import Heading from "@/components/shared/Heading"
import RoundedCard from "@/components/shared/rounded-card"
import { tachersServices } from "@/data/api"
import useFetchById from "@/hooks/useFetchById"


import { Card } from "@/components/ui/card"
import { CourseCard } from "./CoursesTab"
import {
 
  Users,
  UserRound,
  DollarSign,
  Star,
  BookOpen,
  User,
  type LucideIcon,
  BadgeCheck,
  ScrollText,
  Loader2,
} from "lucide-react"
import { useParams } from "react-router"
import { motion } from "framer-motion"
import { HeadDetails } from "./HeadDetails"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// 👇 نوع البيانات اللي راجعة من الـ API




interface Teacher {
  id: string
  user_name: string
  specialization?: string
  image?: string
  user_email?: string
  user_phone?: string
  user_created_at?: string
  students_count?: number
  num_of_courses?: number
  num_of_students?: number
  average_rate?: number
  profit?: number
}


export default function TeacherDetails() {
  const { teacherId } = useParams<{ teacherId: string }>()

  const { data, isLoading, isError } = useFetchById<Teacher>(
    "teacher",
    teacherId,
    tachersServices.getById
  )

  if (isLoading) return <div>Loading...</div>
  if (isError) return <p>حدث خطأ أثناء جلب البيانات</p>

  return (
    <div>
      {/* عنوان الصفحة */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center  shadow-lg rounded-2xl p-4 mt-6 justify-between mb-10"
      >
        <Heading
          titleSize="text-[25px]"
          title="إدارة المدرسين"
          desc="إدارة المدرسين والمحاضرين في المنصة"
          icon={UserRound}
        />
      </motion.div>

      {/* بيانات المدرس */}
      <HeadDetails
        title={data?.user_name}
        desc={data?.specialization}
        image={data?.image}
        email={data?.user_email}
        phone={data?.user_phone}
        createdAt={data?.user_created_at}
        studentsCount={data?.students_count}
        descSize="22px"
        titleSize="22px"
      />

      {/* إحصائيات المدرس */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {[
          {
            icon: BookOpen,
            number: data?.num_of_courses ?? 0,
            title: "عدد الكورسات",
            desc: "إجمالي الكورسات الخاصة بالمدرس",
            iconBg: "bg-blue-600 text-blue-600",
          },
          {
            icon: Users,
            number: data?.num_of_students ?? 0,
            title: "عدد الطلاب",
            desc: "عدد الطلاب المشتركين في الكورسات",
            iconBg: "bg-green-600 text-green-600",
          },
          {
            icon: Star,
            number: data?.average_rate?.toFixed(1) ?? "0.0",
            title: "متوسط التقييم",
            desc: "متوسط تقييم الطلاب للمدرس",
            iconBg: "bg-yellow-600 text-yellow-600",
          },
          {
            icon: DollarSign,
            number: (data?.profit ?? 0).toFixed(2) + " $",
            title: "الأرباح",
            desc: "إجمالي أرباح المدرس",
            iconBg: "bg-purple-600 text-purple-600",
          },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
          >
            <RoundedCard {...card} />
          </motion.div>
        ))}
      </div>
      
      <Tabs  defaultValue="overview" className="w-full mt-12 mb-8">
  <TabsList className="mb-2">
    <TabsTrigger  value="overview">نظرة عامة</TabsTrigger>
    <TabsTrigger value="courses">الكورسات</TabsTrigger>
    <TabsTrigger value="statistics">الاداء والإحصائيات</TabsTrigger>
  </TabsList>
 

<TabsContent value="overview">
  <div className="grid grid-cols-2 w-full md:grid-cols-2 gap-8">
    {/* المعلومات الشخصية */}
    <InfoCard title="معلومات شخصية" icon={User}>
      <div className="space-y-5">
        <div className="flex justify-between">
          <span className="text-gray-500">تاريخ الميلاد:</span>
          <span>{data?.birth_date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">العنوان:</span>
          <span>{data?.address}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">التعليم:</span>
          <span>{data?.education}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">الخبرة:</span>
          <span>{data?.experience}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">آخر نشاط:</span>
          <span>{data?.user_created_at}</span>
        </div>
      </div>
    </InfoCard>

    {/* السيرة الذاتية + الشهادات */}
    <div className="space-y-4">
      {/* السيرة الذاتية */}
      <InfoCard title="السيرة الذاتية" icon={ScrollText}>
        <p>{data?.bio ?? "لا توجد سيرة ذاتية متاحة"}</p>
      </InfoCard>

      {/* الشهادات */}
      <InfoCard title="الشهادات والمؤهلات" icon={BadgeCheck}>
        {data?.certificates?.length ? (
          <ul className="space-y-2">
            {data.certificates.map((cert) => (
              <li key={cert.id} className="flex items-center gap-2">
                <BadgeCheck className="text-yellow-500 w-4 h-4" />
                <span>{cert.title}</span>
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-10 h-10 rounded-md border"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">لا توجد شهادات</p>
        )}
      </InfoCard>
    </div>
  </div>
</TabsContent>

</Tabs>
    </div>
  )
  
}









interface InfoItem {
  label: string
  value: string
}

interface ProfileInfoCardProps {
  info: InfoItem[]
}

export function ProfileInfoCard({ info }: ProfileInfoCardProps) {
  return (
    <Card className="p-6 shadow-md rounded-2xl">
      {/* العنوان */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-700">معلومات شخصية</h2>
        <User className="text-primary" />
      </div>

      {/* القائمة */}
      <div className="space-y-4">
        {info.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-gray-700 text-sm border-b pb-2 last:border-b-0 last:pb-0"
          >
            <span className="font-medium text-gray-500">{item?.label}:</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}




interface InfoCardProps {
  title: string
  icon: LucideIcon
  children: React.ReactNode
}

export function InfoCard({ title, icon: Icon, children }: InfoCardProps) {
  return (
    <Card className="p-6 shadow-sm rounded-2xl">
      {/* العنوان */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        <Icon className="text-primary w-5 h-5" />
      </div>

      {/* المحتوى */}
      <div className="space-y-3 text-sm text-gray-700">{children}</div>
    </Card>
  )
}





