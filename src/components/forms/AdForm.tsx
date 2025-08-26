"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, PlusIcon } from "lucide-react";
import usePost from "@/hooks/usePost";
import { adsServices } from "@/data/api";
import { FileUploadValidationDemo } from "./Files";

// ✅ Ad schema
const adSchema = z.object({
  name: z.string().min(2, "اسم الإعلان مطلوب"),
  status: z.enum(["active", "inactive"], {
    required_error: "حالة الإعلان مطلوبة",
  }),
  image: z.instanceof(File, { error: "صورة الإعلان مطلوبة" }),
});

type AdFormValues = z.infer<typeof adSchema>;

export function AdForm() {
  const form = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      name: "",
      status: "active",
      image: undefined,
    },
  });

  const [openModal, setOpenModal] = useState(false);

  const { mutate: addAd, isPending } = usePost({
    service: adsServices.create,
    key: "ads",
    resource: "الإعلان",
  });

  function onSubmit(values: AdFormValues) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("status", values.status);
    if (values.image) {
      formData.append("image", values.image);
    }

    addAd(formData, {
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
          <PlusIcon className="mr-2 h-4 w-4" />
          إضافة إعلان جديد
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>إضافة إعلان جديد</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Ad Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الإعلان</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل اسم الإعلان" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الحالة</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">مفعل</SelectItem>
                      <SelectItem value="inactive">غير مفعل</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image */}
            <FileUploadValidationDemo
              title="صورة الإعلان"
              control={form.control}
              name="image"
            />

            {/* Submit */}
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
                    جاري إضافة الإعلان
                  </>
                ) : (
                  "إضافة الإعلان"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
