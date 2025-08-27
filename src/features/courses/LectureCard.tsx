"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  Zap,
  Eye,
  FileText,
  Video,
  HelpCircle,
} from "lucide-react";
import { VideoForm } from "./VidToLecForm";
import { PdfToLecForm } from "./PdfToLecForm";
import { QuizToLecForm } from "./QuizToLec";
import { EditQuizToLec } from "./EditQuizToLec";
import { Link } from "react-router";

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

  // lecture full data
  videos?: {
    id: number;
    title: string;
    video: string;
  }[];
  files?: {
    id: number;
    title: string;
    file: string;
  }[];
  quizzes?: {
    id: number;
    title: string;
    description?: string | null;
    success_rate: number;
    questions: {
      id: number;
      text: string;
      grade: number;
      question_type: string;
      answers: {
        id: number;
        text: string;
        is_correct: boolean;
      }[];
    }[];
  }[];
}

export function LectureCard(props: LectureCardProps) {
  const {
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
    videos,
    files,
    quizzes,
  } = props;

  const [showDetails, setShowDetails] = useState(false);
  const [openLecView, setOpenViewOfLec] = useState(false);
  console.log(title,"viiid");

  return (
    <>
      <Card className="p-6 rounded-2xl shadow-lg mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {image && (
            <div className="w-full md:w-40 h-40 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              <img src={image} alt={title} className="object-cover w-full h-full" />
            </div>
          )}

          <div className="flex-1">
            {/* header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex gap-2 flex-wrap">
                {paid && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    <DollarSign className="w-3 h-3 ml-1" /> مدفوعة
                  </Badge>
                )}
                <Badge
                  variant={status === "منشورة" ? "default" : "secondary"}
                  className={status === "منشورة" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}
                >
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

             <Link
  to={`/course/lec/${id}`}
  state={{ lecture: { ...props } }} // pass all lecture data
  className="bg-indigo-900 text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold cursor-pointer"
>
  <Eye />
</Link>
            </div>

            {/* title + desc */}
            <h3 className="font-semibold text-xl mb-2">{title}</h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{description}</p>

            {/* meta info */}
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

            {/* progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm text-gray-600">التقدم: %{progress}</p>
                {progress === 100 && <CheckCircle className="w-4 h-4 text-green-500" />}
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full">
                <div
                  className="h-3 rounded-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* actions */}
            <div className="flex flex-wrap gap-2 mb-4">
              <VideoForm />
              <PdfToLecForm lecture_id={id} />
              <QuizToLecForm lecture_id={id} />
            </div>

            {/* toggle details */}
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 p-0 text-gray-500 hover:text-gray-700"
              onClick={() => setShowDetails(!showDetails)}
            >
            
            </Button>
          </div>
        </div>
      </Card>

      {/* ==== Modal to view lecture ==== */}
      
      
      <Dialog open={openLecView} onOpenChange={setOpenViewOfLec}>
        <DialogContent className="w-[980px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          {/* Videos */}
          {videos && videos.length > 0 && (
            <div className="space-y-2 mt-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Video className="w-4 h-4" /> الفيديوهات
              </h3>
              {videos.map((vid) => (
                <div key={vid.id} className="bg-gray-100 p-3 rounded-lg">
                  <p className="font-medium">{vid.title}</p>
                  <video controls className="w-full mt-2 rounded">
                    <source src={vid.video} type="video/mp4" />
                  </video>
                </div>
              ))}
            </div>
          )}

          {/* Files */}
          {files && files.length > 0 && (
            <div className="space-y-2 mt-6">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" /> الملفات
              </h3>
              <ul className="list-disc pr-6">
                {files.map((f) => (
                  <li key={f.id}>
                    <a href={f.file} target="_blank" className="text-blue-600 underline">
                      {f.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quizzes */}
          {quizzes && quizzes.length > 0 && (
            <div className="space-y-4 mt-6">
              <h3 className="font-semibold flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> الاختبارات
              </h3>
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">{quiz.title}</h4>
                  {quiz.questions.map((q) => (
                    <div key={q.id} className="mb-3">
                      <p className="font-medium">{q.text}</p>
                      <ul className="list-disc pr-6">
                        {q.answers.map((ans) => (
                          <li
                            key={ans.id}
                            className={ans.is_correct ? "text-green-600 font-medium" : ""}
                          >
                            {ans.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      
      
      
      
    </>
  );
}
