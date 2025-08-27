"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import BASEURL, { apiRequest } from "@/data/api";
import usePost from "@/hooks/usePost";

// ✅ Schema
const lectureSchema = z.object({
  title: z.string().min(3, "عنوان المحاضرة مطلوب"),
  description: z.string().min(5, "الوصف مطلوب"),
  type: z.enum(["free", "paid"], { required_error: "اختر نوع المحاضرة" }),
  price: z.string().optional(),
}).refine((data) => {
  if (data.type === "paid" && (!data.price || isNaN(Number(data.price)))) {
    return false;
  }
  return true;
}, {
  message: "السعر مطلوب ويجب أن يكون رقمًا عند اختيار مدفوع",
  path: ["price"],
});

type LectureFormValues = z.infer<typeof lectureSchema>;

export function LectureForm({ id: course_id }: { id: number }) {
  const [openModal, setOpenModal] = useState(false);

  const form = useForm<LectureFormValues>({
    resolver: zodResolver(lectureSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "free",
      price: "",
    },
  });

  const { mutate: addLecture, isPending } = usePost({
    service: (body) =>
      apiRequest("post", `${BASEURL}/course/simple-lectures/`, body),
    key: "lectures",
    resource: "المحاضرة",
  });

  // ✅ Submit handler with course_id
  function onSubmit(values: LectureFormValues) {
    const payload = {
      title: values.title,
      description: values.description,
      course: course_id,
      price: values.type === "free" ? 0 : Number(values.price),
    };

    console.log("Submitting payload:", payload);

    addLecture(payload, {
      onSuccess: () => {
        setOpenModal(false);
        form.reset();
      },
    });
  }

  return (
    <Dialog onOpenChange={setOpenModal} open={openModal}>
      <DialogTrigger asChild>
        <Button className="text-[16px] px-1">
          <PlusIcon />
          إضافة محاضرة
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>إضافة محاضرة</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            {/* ✅ نوع المحاضرة */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع المحاضرة</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="free">مجانية</SelectItem>
                      <SelectItem value="paid">مدفوعة</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ السعر يظهر فقط لو مدفوعة */}
            {form.watch("type") === "paid" && (
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>السعر</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل سعر المحاضرة" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                    جاري إضافة المحاضرة
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
