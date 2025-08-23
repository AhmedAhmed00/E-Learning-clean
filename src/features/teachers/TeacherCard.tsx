import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BASEURL, { apiRequest } from "@/data/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

import {
  Users,

  User,
  Clock,
  Trash2,
  Pencil,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";



export function TeacherCard({ teacher }: { teacher: any }) {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // DELETE mutation
  const { mutate: deleteTeacher, isPending } = useMutation({
    mutationFn: () => apiRequest("delete", `${BASEURL}/instructor/manage/${teacher.id}/`),
    onSuccess: () => {
      toast.success("تم حذف المدرس بنجاح");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error("فشل في حذف المدرس");
      console.error("Delete error:", error);
    },
  });

  const handleDelete = () => {
    deleteTeacher();
  };

  return (
    <>
      <Card className="overflow-hidden rounded-2xl py-0 shadow-lg">
        {/* الصورة + البادجات */}
        <div className="relative">
          <img
            src={teacher.image }
            alt={teacher.user_name}
            className="w-full h-44 object-cover"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-yellow-100 text-yellow-700">
              {teacher.specialization || "بدون تخصص"}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge className={`text-white ${teacher.user_is_active ? "bg-green-500" : "bg-red-500"}`}>
              {teacher.user_is_active ? "نشط" : "غير نشط"}
            </Badge>
          </div>
        </div>

        {/* المحتوى */}
        <CardContent className="px-4 pt-4 space-y-2">
          <h3 className="text-lg font-bold">{teacher.bio || "لا يوجد نبذة"}</h3>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" /> {teacher.user_name}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {teacher.num_of_courses} كورس
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" /> {teacher.num_of_students} طالب
            </div>
          </div>
        </CardContent>
        <CardContent className="px-4 space-y-2">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" /> {teacher.user_email}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {teacher.user_phone} 
            </div>
          </div>
        </CardContent>

        {/* الأزرار */}
        <CardFooter className="flex items-center justify-between p-4 border-t">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isPending}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="outline">
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
          <Link to={`${teacher?.id}`} > 
          
             <Button variant="secondary" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            عرض التفاصيل
          </Button>
          
          </Link>
       
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] flex flex-col items-center  w-full ">
          <DialogHeader >
            <DialogTitle className="text-center" >تأكيد الحذف</DialogTitle>
            <DialogDescription className="text-start">
              هل انت متأكد من انك تريد حذف المدرس {teacher.user_name} <br />
              هذا الإجراء لا يمكن التراجع عنه
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 ">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "جاري الحذف..." : "حذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}