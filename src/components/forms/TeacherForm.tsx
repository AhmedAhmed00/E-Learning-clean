"use client";

import { Controller, useForm, useFieldArray } from "react-hook-form";
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
import { Loader2, PlusIcon, Trash2, Plus, Pencil } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import usePost from "@/hooks/usePost";
import { teachersServices } from "@/data/api";
import { FileUploadValidationDemo } from "./Files";
import { useEffect, useState } from "react";
import { setServerErrors } from "@/lib/helpers";
import useUpdate from "@/hooks/useUpdate";

// ✅ Teacher Schema including new fields
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
  education: z.string().min(3, "يجب إدخال المؤهل التعليمي").nullable(),
  experience: z.string().min(3, "يجب إدخال الخبرة").nullable(),
  birth_date: z.string().min(1, "تاريخ الميلاد مطلوب").regex(/^\d{4}-\d{2}-\d{2}$/, "تاريخ الميلاد يجب أن يكون بصيغة YYYY-MM-DD").nullable(),
  address: z.string().min(3, "يجب إدخال العنوان").nullable(),
  image: z.instanceof(File, { error: "صورة المدرس مطلوبة" }),
  id_image: z.instanceof(File, { error: "صورة هوية المدرس مطلوبة" }),
  certificates: z.array(
    z.object({
      title: z.string().min(2, "عنوان الشهادة مطلوب"),
      image: z.instanceof(File, { error: "صورة الشهادة مطلوبة" }),
    })
  ).min(1, "يجب إضافة شهادة واحدة على الأقل"),
});

export type TeacherFormValues = z.infer<typeof teacherSchema>;
const teacherUpdateSchema = teacherSchema.partial().extend({
    image: z
      .union([
        z.instanceof(File, { message: "صورة مطلوبة" }),
        z.string().url("رابط الصورة غير صالح"),
      ])
      .optional(),
    id_image: z
      .union([
        z.instanceof(File, { message: "صورة مطلوبة" }),
        z.string().url("رابط الصورة غير صالح"),
      ])
      .optional(),
    certificates: z
      .array(
        z.object({
          title: z.string().optional(),
          image: z
            .union([
              z.instanceof(File, { message: "صورة مطلوبة" }),
              z.string().url("رابط الصورة غير صالح"),
            ])
            .optional(),
        })
      )
      .optional(),
  });


export function TeacherForm({mode ,teacher}:{mode?:string,
   teacher?:TeacherFormValues}) {
  const form = useForm<TeacherFormValues>({
    resolver: mode==="update" ? zodResolver(teacherUpdateSchema) : zodResolver(teacherSchema),
    defaultValues:  {
      name: "",
      email: "",
      phone: "",
      specialization: "",
      password: "",
      bio: "",
      education: "",
      experience: "",
      birth_date: "",
      address: "",
      image: undefined,
      id_image: undefined,
      certificates: [{ title: "", image: undefined }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "certificates",
  });

  const [openModal, setOpenModal] = useState(false);
  
  
  
  
  
  
  useEffect(()=>{
    if(mode === "update" && Object.keys(teacher).length && openModal){ 
      form.reset({...teacher, 
        name:teacher?.user_name, 
        email:teacher?.user_email, 
        phone:teacher?.user_phone, 
        education:teacher?.education,
        experience:teacher?.experience,  
        certificates:teacher?.certificates,  
        
      })
      console.log(teacher ,"currrent");
    }
  } ,[teacher,form,mode,openModal])

  const { mutate: addTeacher, isPending } = usePost({
    service: teachersServices.create,
    key: "teachers",
    resource: "المدرس",
  });
  const { mutate: updateTeacher  } = useUpdate({
    service: teachersServices.update,
    key: "teachers",
    resource: "المدرس",
  });

  

  function onSubmit(values: TeacherFormValues) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("specialization", values.specialization);
    formData.append("password", values.password);
    formData.append("bio", values.bio);
    formData.append("education", values.education);
    formData.append("experience", values.experience);
    formData.append("birth_date", values.birth_date);
    formData.append("address", values.address);

    if (values.image && typeof values.image !== "string") formData.append("image", values.image);
    if (values.id_image && typeof values.image !== "string") formData.append("id_image", values.id_image);

    // Add certificates
    values.certificates.forEach((cert, index) => {
      formData.append(`certificates[${index}][title]`, cert.title);
      if (cert.image && typeof cert.image !== "string") formData.append(`certificates[${index}][image]`, cert.image);
    });

    // send FormData to your usePost hook
    
    if(mode === "update"){ 
       updateTeacher({id:teacher.id , body:formData}, {
      onSuccess: () => {
        setOpenModal(false);
        form.reset(); // optional: reset form after adding
      },
      onError:(err) => setServerErrors(err,form.setError)
    });
    }
    else{ 
         addTeacher(formData, {
      onSuccess: () => {
        setOpenModal(false);
        form.reset(); // optional: reset form after adding
      },
      onError:(err) => setServerErrors(err,form.setError)
    });
    }
 
  }

  return (
    <Dialog onOpenChange={setOpenModal} open={openModal}>
      <DialogTrigger asChild>
        
        {mode==='update' ? <Button className="text-[16px] bg-yellow-500 px-1" style={{ cursor: "pointer" }}>
          <Pencil  />
        </Button>: <Button  className="text-[16px]  px-1" style={{ cursor: "pointer" }}>
          <PlusIcon />
          إضافة مدرس جديد
        </Button> }
        
      
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة مدرس جديد</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name & Email */}
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

            {/* Phone & Specialization */}
            <div className="grid grid-cols-2 gap-4">
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

            {/* Birth Date & Address */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birth_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ الميلاد</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="1995-08-13"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العنوان</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل العنوان" {...field} />
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

            {/* Education & Experience */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المؤهل التعليمي</FormLabel>
                    <FormControl>
                      <Textarea placeholder="أدخل المؤهل التعليمي" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الخبرة</FormLabel>
                    <FormControl>
                      <Textarea placeholder="أدخل الخبرة العملية" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Profile Image & ID Image */}
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

            {/* Certificates Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-lg font-medium">الشهادات</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ title: "", image: undefined })}
                >
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة شهادة
                </Button>
              </div>
              
              {fields.map((field, index) => (
                <div key={field.id} className="border rounded-lg p-4 space-y-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">الشهادة {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`certificates.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>عنوان الشهادة</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل عنوان الشهادة" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FileUploadValidationDemo
                      title="صورة الشهادة"
                      control={form.control}
                      name={`certificates.${index}.image`}
                    />
                  </div>
                </div>
              ))}
              
              {form.formState.errors.certificates?.root && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.certificates.root.message}
                </p>
              )}
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
      {mode === "update" ? "جاري تعديل المدرس" : "جاري إضافة المدرس"}
    </>
  ) : (
    mode === "update" ? "تعديل مدرس" : "إضافة مدرس"
  )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}