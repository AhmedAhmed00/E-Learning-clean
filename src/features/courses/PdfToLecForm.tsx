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
import BASEURL, { apiRequest } from "@/data/api";
import usePost from "@/hooks/usePost";

// ✅ Updated schema for file upload
const pdfUploadSchema = z.object({
  title: z.string().min(3, "عنوان الملف مطلوب"),
  file: z
    .any()
    .refine((file) => file instanceof File, "الملف مطلوب")
    .refine((file) => file?.type === "application/pdf", "الملف يجب أن يكون PDF"),
});

type PdfFormValues = z.infer<typeof pdfUploadSchema>;

export function PdfToLecForm({ lecture_id }: { lecture_id: number }) {
  const [openModal, setOpenModal] = useState(false);

  const form = useForm<PdfFormValues>({
    resolver: zodResolver(pdfUploadSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  });

  const { mutate: uploadPdf, isPending } = usePost({
    service: (body) =>
      apiRequest("post", `${BASEURL}/course/simple-files/`, body, {
        headers: { "Content-Type": "multipart/form-data" },
        isFormData: true,
      }),
    key: "lecture-pdfs",
    resource: "الملف",
  });

  function onSubmit(values: PdfFormValues) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("lecture_id", String(lecture_id));
    formData.append("file", values.file);

    uploadPdf(formData, {
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
          إضافة ملف
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>إضافة ملف PDF للمحاضرة</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان الملف</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل عنوان الملف" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الملف (PDF فقط)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
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
                    جاري رفع الملف
                  </>
                ) : (
                  "إضافة ملف"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
