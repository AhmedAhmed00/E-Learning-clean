"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { PlusIcon } from "lucide-react"

// ✅ 1. Schema
const courseSchema = z.object({
  title: z.string().min(3, "يجب أن يحتوي العنوان على 3 أحرف على الأقل"),
  description: z.string().min(10, "الوصف قصير جدًا"),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)), { message: "السعر يجب أن يكون رقم" }),
})

type CourseFormValues = z.infer<typeof courseSchema>

export function CourseForm() {
  // ✅ 2. Initialize form
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
    },
  })

  // ✅ 3. Handle submit
  function onSubmit(values: CourseFormValues) {
    console.log("Course Data:", values)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button style={{cursor:"pointer"}} className="text-[16px] mx-8">
          <PlusIcon className="mr-2" />
          إضافة كورس جديد
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة كورس جديد</DialogTitle>
        </DialogHeader>

        {/* ✅ 4. Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان الكورس</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل عنوان الكورس" {...field} />
                  </FormControl>
                  <FormDescription>اسم الكورس كما سيظهر للطلاب</FormDescription>
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
                    <Input placeholder="أدخل وصف الكورس" {...field} />
                  </FormControl>
                  <FormDescription>اكتب شرحًا قصيرًا عن محتوى الكورس</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>السعر</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: 100" {...field} />
                  </FormControl>
                  <FormDescription>سعر الكورس بالجنيه أو الدولار</FormDescription>
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
              <Button type="submit">حفظ الكورس</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
