import { motion } from "framer-motion";
import {
  UserRound,


} from "lucide-react";

import { Button } from "@/components/ui/button";
import Heading from "@/components/shared/Heading";
import TableOperations from "@/components/shared/table/TableOperations";
import { tachersServices } from "@/data/api";
import { TeacherForm } from "@/components/forms/TeacherForm";
import { TeacherCard } from "@/features/teachers/TeacherCard";
import { useFetch } from "@/hooks/useFetch";


export default function Teachers() {
  const { data: { results: teachers = [], count } = {}, isLoading } = useFetch({
    service: tachersServices.getAll,
    key: "teachers",
  });

  return (
    <>
      {/* 🏷️ الهيدر */}
      <div className="flex items-center shadow-lg rounded-2xl p-4 mt-6 justify-between mb-10">
        <Heading
          titleSize="text-[25px]"
          title="إدارة المدرسين"
          desc="إدارة المدرسين والمحاضرين في المنصة"
          icon={UserRound}
        />
        <Button className="text-[16px] mx-8">
          <TeacherForm />
        </Button>
      </div>

      {/* عمليات علي الجدول */}
      <div>
        <TableOperations resourse="مدرس" />
      </div>

      {/* 🎓 الكروسات مع الأنيميشن */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {teachers?.map((teacher, i) => (
          <motion.div
            key={teacher.id}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                delay: i * 0.15,
                duration: 0.5,
                type: "spring",
                stiffness: 120,
              },
            }}
          >
            <TeacherCard teacher={teacher} />
          </motion.div>
        ))}
      </div>
    </>
  );
}

