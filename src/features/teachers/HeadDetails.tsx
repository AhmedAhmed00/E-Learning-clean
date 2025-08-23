
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Clock, Phone, User, Users } from "lucide-react"

interface HeadDetailsProps {
  title?: string
  desc?: string
  email?: string
  phone?: string
  createdAt?: string
  image?: string
  studentsCount?: number
  titleSize?: string
  descSize?: string
}
export function HeadDetails({
  title,
  desc,
  email,
  phone,
  createdAt,
  image,
  studentsCount,
  titleSize = "",
  descSize = "",
}: HeadDetailsProps) {
  // ✅ Formatters
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("ar-EG", {
      dateStyle: "long",
    }).format(date)
  }

  const formatStudents = (count?: number) => {
    if (count === undefined) return ""
    return new Intl.NumberFormat("ar-EG").format(count) + " طالب"
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col rounded-2xl shadow-lg justify-center px-6 py-4 bg-white"
    >
      <div className="flex items-center gap-3 space-x-reverse">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-[120px] h-[120px] rounded-full overflow-hidden"
        >
          {image && (
            <img
              src={image}
              alt={title || "teacher image"}
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>
        <div className="flex flex-col gap-1">
          <span className={cn("text-[18px] font-bold text-black", titleSize)}>
            {title}
          </span>
          {desc && (
            <div
              className={cn(
                "text-[14px] text-slate-700 dark:text-gray-400",
                descSize
              )}
            >
              {desc}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-4">
        {email && (
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" /> {email}
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4" /> {phone}
          </div>
        )}
        {createdAt && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {formatDate(createdAt)}
          </div>
        )}
        {studentsCount !== undefined && (
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" /> {formatStudents(studentsCount)}
          </div>
        )}
      </div>
    </motion.div>
  )
}