import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  DollarSign, 
  Clock, 
  Users, 
  Star, 
  Calendar, 
  Tag, 
  User, 
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Zap
} from "lucide-react";
import { VideoForm } from "./VidToLecForm";
import { PdfToLecForm } from "./PdfToLecForm";
import { QuizToLecForm } from "./QuizToLec";
import { EditQuizToLec } from "./EditQuizToLec";

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
  active,
  average_stars,
  category_name,
  created_at,
  discount_percentage,
  final_price,
  image,
  instructor_name,
  is_offer,
  total_ratings,
  total_students,
  updated_at,
  progress,
  price,
  status,
  completed,
  paid,
  attachments,
}: LectureCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className="p-6 rounded-2xl shadow-lg mb-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* Image thumbnail if available */}
        {image && (
          <div className="w-full md:w-40 h-40 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            <img 
              src={image} 
              alt={title} 
              className="object-cover w-full h-full"
            />
          </div>
        )}
        
        <div className="flex-1">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            {/* Left: Badges */}
            <div className="flex gap-2 flex-wrap">
              {paid && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <DollarSign className="w-3 h-3 ml-1" /> مدفوعة
                </Badge>
              )}
              <Badge variant={status === "منشورة" ? "default" : "secondary"} 
                className={status === "منشورة" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                {status}
              </Badge>
              {completed && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  مكتمل <CheckCircle className="w-3 h-3 mr-1" />
                </Badge>
              )}
              {is_offer && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                  عرض <Zap className="w-3 h-3 mr-1" />
                </Badge>
              )}
              {active && (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                  نشط
                </Badge>
              )}
            </div>

            {/* Right: Lecture Number */}
            <div className="bg-indigo-600 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold">
              {number}
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="font-semibold text-xl mb-2">{title}</h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{description}</p>

          {/* Basic meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center">
              <Clock className="w-4 h-4 ml-1" /> {duration}
            </span>
            {price && (
              <span className="text-green-600 font-bold flex items-center">
                <DollarSign className="w-4 h-4" /> {price}
              </span>
            )}
            {attachments && <span>{attachments} مرفق</span>}
            {category_name && (
              <span className="flex items-center">
                <Tag className="w-4 h-4 ml-1" /> {category_name}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-gray-600">التقدم: %{progress}</p>
              {progress === 100 && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full">
              <div 
                className="h-3 rounded-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <VideoForm />
            <PdfToLecForm lecture_id={id} />
            <QuizToLecForm lecture_id={id} />
            <EditQuizToLec lecture_id={id} />
          </div>

          {/* Toggle details button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 p-0 text-gray-500 hover:text-gray-700"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <>
                إخفاء التفاصيل <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                عرض المزيد من التفاصيل <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>

          {/* Additional details section */}
          {showDetails && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-3">تفاصيل إضافية</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {/* Left column */}
                <div className="space-y-2">
                  {instructor_name && (
                    <div className="flex items-center">
                      <User className="w-4 h-4 ml-2 text-gray-500" />
                      <span className="text-gray-600">المعلم:</span>
                      <span className="mr-1 font-medium">{instructor_name}</span>
                    </div>
                  )}
                  
                  {total_students !== undefined && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 ml-2 text-gray-500" />
                      <span className="text-gray-600">عدد الطلاب:</span>
                      <span className="mr-1 font-medium">{total_students}</span>
                    </div>
                  )}
                  
                  {average_stars !== undefined && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 ml-2 text-amber-500 fill-amber-500" />
                      <span className="text-gray-600">التقييم:</span>
                      <span className="mr-1 font-medium">{average_stars.toFixed(1)}</span>
                      <span className="text-gray-500">({total_ratings} تقييم)</span>
                    </div>
                  )}
                  
                  {created_at && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 ml-2 text-gray-500" />
                      <span className="text-gray-600">تاريخ الإنشاء:</span>
                      <span className="mr-1 font-medium">{new Date(created_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                  )}
                </div>
                
                {/* Right column */}
                <div className="space-y-2">
                  {final_price !== undefined && (
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 ml-2 text-gray-500" />
                      <span className="text-gray-600">السعر النهائي:</span>
                      <span className="mr-1 font-medium">${final_price}</span>
                    </div>
                  )}
                  
                  {discount_percentage !== undefined && discount_percentage > 0 && (
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 ml-2 text-red-500" />
                      <span className="text-gray-600">نسبة الخصم:</span>
                      <span className="mr-1 font-medium text-red-500">{discount_percentage}%</span>
                    </div>
                  )}
                  
                  {updated_at && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 ml-2 text-gray-500" />
                      <span className="text-gray-600">آخر تحديث:</span>
                      <span className="mr-1 font-medium">{new Date(updated_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                  )}
                  
                  {image && (
                    <div className="flex items-center">
                      <ImageIcon className="w-4 h-4 ml-2 text-gray-500" />
                      <span className="text-gray-600">تحتوي على صورة</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}