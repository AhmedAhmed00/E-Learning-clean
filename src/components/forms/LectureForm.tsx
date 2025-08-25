"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusIcon } from "lucide-react";
import usePost from "@/hooks/usePost";
import { useParams } from "react-router";
// import { lecturesServices } from "@/data/api";

// ✅ Lecture Schema
const lectureSchema = z.object({
  title: z.string().min(3, "عنوان المحاضرة مطلوب"),
  description: z.string().min(5, "الوصف مطلوب"),
});

type LectureFormValues = z.infer<typeof lectureSchema>;

export function LectureForm() {
  const {id} = useParams();

  const form = useForm<LectureFormValues>({
    resolver: zodResolver(lectureSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const [openModal, setOpenModal] = useState(false);

//   const { mutate: addLecture, isPending } = usePost({
//     service: lecturesServices.create,
//     key: "lectures",
//     resource: "المحاضرة",
//   });

  function onSubmit(values: LectureFormValues) {
    const payload = {
      ...values,
      course_id: id, // attach course_id from params
    };
    
    console.log(payload);

    // addLecture(payload, {
    //   onSuccess: () => {
    //     setOpenModal(false);
    //     form.reset();
    //   },
    // });
  }

  
  const isPending = false
  
  return (
    <Dialog onOpenChange={setOpenModal} open={openModal}>
      <DialogTrigger asChild>
        <Button className="text-[16px] px-1">
          <PlusIcon />
          إضافة فصل
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>إضافة فصل </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان المحاضرة</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل عنوان المحاضرة" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Textarea placeholder="أدخل وصف المحاضرة" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  إلغاء
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري إضافة المحاضرة{" "}
                  </>
                ) : (
                  "إضافة محاضرة"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
