"use client";

import { Card } from "@/components/ui/card";
import {
  BadgeCheck,
  Play,
  Calendar,
  User,
  ArrowRight,
  Star,
  Clock,
  BarChart3,
} from "lucide-react";
import { useState } from "react";

export default function StudentCoursesList({ purchased_courses }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="space-y-6 ">
      {purchased_courses?.map((course) => (
        <Card
          key={course.id}
          className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50/80 
                     border border-gray-200/70 hover:border-blue-100 hover:shadow-2xl 
                     transition-all duration-300 rounded-2xl  transform hover:-translate-y-1"
          onMouseEnter={() => setHoveredCard(course.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {/* Animated gradient overlay */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-50/60 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Course image thumbnail (optional) */}

          <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pr-8">
            {/* Left: Course Info */}
            <div className="flex-1 w-full space-y-5">
              {/* Course Title and Status */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-800 transition-colors duration-300">
                    {course.title}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      بواسطة المدرس {course.instructor_name}
                    </span>
                  </div>

                  {/* Rating and duration */}

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(course.average_stars)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-500 mr-1">
                        {course.average_stars}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price and Date Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl px-4 py-2.5 shadow-sm">
                    <span className="text-xs text-emerald-800 font-medium">
                      السعر المدفوع
                    </span>
                    <div className="font-bold text-emerald-900 text-lg">
                      {course.purchased_price} ج.م
                    </div>
                  </div>

                  <div className="hidden sm:block h-10 w-px bg-gray-200"></div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 shadow-sm">
                    <span className="text-xs text-blue-800 font-medium">
                      آخر دخول
                    </span>
                    <div className="font-medium text-blue-900 text-sm">
                      منذ يومين
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-500 bg-gray-50 py-1.5 px-3 rounded-lg">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    تاريخ التسجيل:{" "}
                    {new Date(course.purchased_at).toLocaleDateString("ar-EG")}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col items-center gap-4 lg:ml-6"></div>
          </div>

          {/* Progress indicator */}
          {/* <div className="mt-5 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>التقدم في الكورس</span>
              </div>
              <span className="font-medium">75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-700 ease-out" 
                style={{width: hoveredCard === course.id ? '75%' : '0%'}}
              ></div>
            </div> */}

          {/* Lessons progress */}

          {/* </div> */}

          {/* Completion badge */}
          <div className="absolute top-5 left-5">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <BadgeCheck className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
