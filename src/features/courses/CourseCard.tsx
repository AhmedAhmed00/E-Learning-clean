import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "lucide-react"
import {
  Users,

  Clock,
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

export function CourseCard({
  image,
  leftText,
  rightText,
  bottomText,
}: CardItem) {
  return (
    <Card className="overflow-hidden rounded-2xl py-0 shadow-lg">
      {/* الصورة + البادجات */}
      <div className="relative">
        <img src={image} alt="Course" className="w-full h-44 object-cover" />
        <div className="absolute top-3 left-3">
          <Badge className="bg-yellow-100 text-yellow-700">{leftText}</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-green-100 text-green-700">{rightText}</Badge>
        </div>
      </div>

      {/* المحتوى */}
      <CardContent className="p-4 space-y-2">
        {/* العنوان */}
        <h3 className="text-lg font-bold">{bottomText}</h3>

        {/* بيانات إضافية */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" /> أحمد محمد
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> 8 أسابيع
          </div>
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