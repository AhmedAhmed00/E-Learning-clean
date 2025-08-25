import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle, DollarSign } from "lucide-react";
import { VideoForm } from "./VidToLecForm";
import { PdfToLecForm } from "./PdfToLecForm";
import { QuizToLecForm } from "./QuizToLec";

interface LectureCardProps {
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
}: LectureCardProps) {
  return (
    <Card className="p-4 rounded-2xl  shadow-lg mb-4">
      <div className="flex items-center justify-between ">
        {/* Left: Badges */}
        <div className="flex gap-2 flex-wrap">
          {paid && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <DollarSign className="w-4 h-4" /> مدفوعة
            </Badge>
          )}
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {status}
          </Badge>
          {completed && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              مكتمل <CheckCircle className="w-3 h-3" />
            </Badge>
          )}
        </div>

        {/* Right: Lecture Number */}
        <div className="bg-indigo-600 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold">
          {number}
        </div>
      </div>
      <div className="flex gap-4">

<VideoForm />
      <PdfToLecForm lecture_id={id} />
      <QuizToLecForm  lecture_id={id}/>
      </div>
      

      {/* Title & Description */}
      <h3 className="font-semibold text-xl">{title}</h3>
      <p className="text-gray-500 text-sm mb-0">{description}</p>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-0">
        <span>{duration}</span>
        {price && <span className="text-green-600 font-bold">${price}</span>}
        {attachments && <span>{attachments} مرفق</span>}
      </div>

      {/* Progress */}
      <div>
        <p className="text-sm text-gray-600 mb-2">التقدم: %{progress}</p>
        <div className="w-full h-3 bg-gray-200 rounded-full">
          <div
            className="h-3 rounded-full bg-indigo-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
}
