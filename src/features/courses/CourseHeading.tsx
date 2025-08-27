
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users } from "lucide-react";
import { LectureForm } from "@/components/forms/LectureForm";
import { useParams } from "react-router";
type CourseCardProps = {
  price: number;
  title: string;
  description: string;
  students: number;
  duration: string;
  rating: number;
  reviews: number;
  tags: { label: string; color?: string }[];
  image: string;
};
export  function CourseHeading({
  price,
  title,
  description,
  students,
  duration,
  rating,
  reviews,
  tags,
  image,
}: CourseCardProps) {
  const {id} = useParams()
  return ( 
    <Card className="flex  flex-col md:flex-row items-center justify-between gap-4 p-4 shadow-md rounded-2xl">
 
  <div className="min-w-[120px]">
        <img
          src={image}
          alt={title}
          className="w-28 h-28 object-cover rounded-lg"
        />
      </div>
      {/* Middle Section (Title + Desc + Stats) */}
      <CardContent className="flex-1 text-center md:text-right">
        <h2 className="text-lg font-bold mb-1">{title}</h2>
        <p className="text-gray-600 text-sm mb-3">{description}</p>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{students} طالب</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>
              {rating} ({reviews} تقييم)
            </span>
          </div>
        </div>
      </CardContent>

         <div className="flex flex-col items-center md:items-start gap-3 min-w-[120px]">
        <span className="text-3xl font-bold text-indigo-600">${price}</span>
        <div className="flex gap-2 flex-wrap justify-center md:justify-start">
          {tags.map((tag, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className={`${tag.color ?? "bg-gray-100 text-gray-700"}`}
            >
              {tag.label}
            </Badge>
          ))}
        </div>
                      <LectureForm id={id} />

      </div>
    </Card>
  );
}
