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
import { Loader2, PlusIcon } from "lucide-react";
import { useParams } from "react-router";
import axios from "axios"; // ✅ لازم Axios عشان البروجريس
import { Progress } from "@/components/ui/progress"; // shadcn/ui progress
import BASEURL from "@/data/api";

// ✅ Video Schema
const videoSchema = z.object({
  title: z.string().min(3, "عنوان الفيديو مطلوب"),
  video: z
    .any()
    .refine((file) => file?.length === 1, "ملف الفيديو مطلوب")
    .refine(
      (file) =>
        !file || ["video/mp4", "video/mkv"].includes(file[0]?.type),
      "يجب أن يكون الفيديو بصيغة mp4 أو mkv"
    ),
});

type VideoFormValues = z.infer<typeof videoSchema>;

export function VideoForm() {
  const { id: lecture_id } = useParams(); // from route

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      video: undefined,
    },
  });

  const [openModal, setOpenModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(values: VideoFormValues) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("lecture_id", lecture_id as string);
    formData.append("video", values.video[0]);

    try {
      setIsPending(true);
      setProgress(0);

      await axios.post(`${BASEURL}/course/simple-videos/`, formData, {
        headers: { "Content-Type": "multipart/form-data" , Authorization:`Bearer ${localStorage.getItem("accessToken")}` },
        
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });

      // ✅ بعد النجاح
      setOpenModal(false);
      form.reset();
    } catch (err) {
      console.error("❌ خطأ في رفع الفيديو", err);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog onOpenChange={setOpenModal} open={openModal}>
      <DialogTrigger asChild>
        <Button className="text-[16px] px-1">
          <PlusIcon />
          إضافة فيديو
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>إضافة فيديو للمحاضرة</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان الفيديو</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل عنوان الفيديو" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Video Upload */}
            <FormField
              control={form.control}
              name="video"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملف الفيديو</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Progress Bar */}
            {isPending && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-500">{progress}%</p>
              </div>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  إلغاء
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري رفع الفيديو{" "}
                  </>
                ) : (
                  "إضافة فيديو"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
