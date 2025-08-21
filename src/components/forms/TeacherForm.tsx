"use client";

import { Controller, useForm } from "react-hook-form";
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
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import usePost from "@/hooks/usePost";
import { tachersServices } from "@/data/api";
import { FileUploadValidationDemo } from "./Files";
import { useState } from "react";

// ✅ Teacher Schema including images
const teacherSchema = z.object({
  name: z.string().min(3, "يجب أن يحتوي الاسم على 3 أحرف على الأقل"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  phone: z
    .string()
    .min(10, "رقم الهاتف قصير جدًا")
    .regex(/^\+?[0-9]{10,15}$/, "أدخل رقم هاتف صحيح"),
  specialization: z.string().min(2, "يجب إدخال التخصص"),
  password: z.string().min(6, "يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل"),
  bio: z.string().min(3, "أدخل نبذة قصيرة"),
  image: z.instanceof(File,{error:"صورة المدرس مطلوبة"}),
  id_image: z.instanceof(File,{error:"صورة هوية المدرس مطلوبة"}),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

export function TeacherForm() {
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialization: "",
      password: "",
      bio: "",
      image: undefined,
      id_image: undefined,
    },
  });

  const [openModal, setOpenModal] = useState(false);

  const { mutate: addTeacher, isPending } = usePost({
    service: tachersServices.create,
    key: "teachers",
    resource: "المدرس",
  });

  console.log(form.formState.errors);

  function onSubmit(values: TeacherFormValues) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("specialization", values.specialization);
    formData.append("password", values.password);
    formData.append("bio", values.bio);

    if (values.image) formData.append("image", values.image);
    if (values.id_image) formData.append("id_image", values.id_image);

    // send FormData to your usePost hook
    addTeacher(formData, {
      onSuccess: () => {
        setOpenModal(false);
        form.reset(); // optional: reset form after adding
      },
    });
  }

  return (
    <Dialog onOpenChange={setOpenModal} open={openModal}>
      <DialogTrigger asChild>
        <Button className="text-[16px] px-1" style={{ cursor: "pointer" }}>
          <PlusIcon />
          إضافة مدرس جديد
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[655px]">
        <DialogHeader>
          <DialogTitle>إضافة مدرس جديد</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المدرس</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل اسم المدرس" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input placeholder="teacher@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl style={{ direction: "rtl" }}>
                      <Controller
                        name="phone"
                        control={form.control}
                        render={({ field }) => (
                          <PhoneInput
                            country="eg"
                            value={field.value}
                            onChange={(value) => field.onChange("+" + value)}
                            inputClass="!w-full  !text-base"
                            buttonClass=""
                            containerClass="!w-full"
                          />
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Specialization */}
              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التخصص</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="مثال: رياضيات، لغة عربية ..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="أدخل كلمة المرور"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نبذة قصيرة</FormLabel>
                  <FormControl>
                    <Textarea placeholder="أدخل نبذة عن المدرس" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image */}

            {/* ID Image */}
            <div className="grid grid-cols-2 gap-6">
              <FileUploadValidationDemo
                title="صورة المدرس"
                control={form.control}
                name="image"
              />
              <FileUploadValidationDemo
                title="صورة بطاقة المدرس"
                control={form.control}
                name="id_image"
              />
            </div>

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
                    جاري إضافة المدرس{" "}
                  </>
                ) : (
                  "إضافة مدرس"
                )}
              </Button>{" "}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
