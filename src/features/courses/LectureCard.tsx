import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, DollarSign, Users, Star, Clock } from "lucide-react";

interface LectureCardProps {
  id?: string;
  number: string;
  title: string;
  description: string;
  duration: string;
  progress: number;
  price?: string;
  status: "منشورة" | "مسودة";
  completed?: boolean;
  paid?: boolean;
  attachments?: number;

  // New props
  created_at?: string;
  updated_at?: string;
  is_offer?: boolean;
  final_price?: number;
  total_ratings?: number;
  average_stars?: number;
  discount_percentage?: number;
  instructor_name?: string;
  total_students?: number;
  image?: string;
  active?: boolean;
  category_name?: string;
}

export function LectureCard({
  id,
  number,
  title,
  description,
  duration,
  progress,
  price,
  status,
  completed,
  paid,
  attachments,
  created_at,
  updated_at,
  is_offer,
  final_price,
  total_ratings,
  average_stars,
  discount_percentage,
  instructor_name,
  total_students,
  image,
  active,
  category_name,
}: LectureCardProps) {
  return (
    <Card className="w-full rounded-2xl shadow-md border p-4 flex flex-col gap-3">
      {/* Image & Category */}
      {image && (
        <div className="relative w-full h-40 rounded-xl overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          {category_name && (
            <Badge className="absolute top-2 left-2 bg-blue-600 text-white">
              {category_name}
            </Badge>
          )}
        </div>
      )}

      <CardHeader className="flex justify-between items-center">
        {/* Status Badges */}
        <div className="flex gap-2">
          {paid && <Badge variant="secondary">مدفوعة</Badge>}
          <Badge>{status}</Badge>
          {completed && (
            <Badge className="bg-green-600 text-white flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> مكتمل
            </Badge>
          )}
          {is_offer && (
            <Badge className="bg-yellow-500 text-black">
              خصم {discount_percentage}%
            </Badge>
          )}
        </div>

        {/* Lecture Number */}
        <Badge variant="outline">#{number}</Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Title & Description */}
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {duration}
          </span>
          {attachments && <span>{attachments} مرفق</span>}
          {price && (
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {is_offer ? (
                <>
                  <span className="line-through">{price}</span>
                  <span className="font-bold text-green-600">
                    {final_price} ج.م
                  </span>
                </>
              ) : (
                `${price} ج.م`
              )}
            </span>
          )}
        </div>

        {/* Instructor & Students */}
        <div className="flex justify-between items-center text-sm">
          {instructor_name && (
            <span className="font-medium">👨‍🏫 {instructor_name}</span>
          )}
          {typeof total_students === "number" && (
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" /> {total_students} طالب
            </span>
          )}
        </div>

        {/* Ratings */}
        {average_stars && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>
              {average_stars} ({total_ratings} تقييم)
            </span>
          </div>
        )}

        {/* Progress */}
        <div className="text-sm text-gray-600">
          التقدم: %{progress}
        </div>

        {/* Dates */}
        <div className="text-xs text-gray-400">
          <p>أنشئت في: {created_at ? new Date(created_at).toLocaleDateString() : "-"}</p>
          <p>آخر تحديث: {updated_at ? new Date(updated_at).toLocaleDateString() : "-"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
