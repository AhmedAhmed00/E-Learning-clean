"use client"

import { useState, useEffect } from "react"
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, PencilIcon } from "lucide-react"
import { FileUploadValidationDemo } from "./Files"
import usePost from "@/hooks/usePost"
import { categoriesServices, insCourses } from "@/data/api"
import { useFetch } from "@/hooks/useFetch"
import useUpdate from "@/hooks/useUpdate"
import { DevTool } from "@hookform/devtools"

// ✅ Schema
const courseSchema = z.object({
  category: z.string().min(1, "اختر التصنيف"),
  title: z.string().min(3, "يجب أن يحتوي العنوان على 3 أحرف على الأقل"),
  description: z.string().min(10, "الوصف قصير جدًا"),
  price: z.string().refine((val) => !isNaN(Number(val)), { message: "السعر يجب أن يكون رقم" }),
  discount_percentage: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), { message: "يجب أن يكون رقم" }),
  image: z.instanceof(File, { error: "صورة الكورس مطلوبة" })
})

type CourseFormValues = z.infer<typeof courseSchema>

export function CourseForm({ defaultValues }: { defaultValues?: Partial<CourseFormValues> & { id?: number } }) {
  const [open, setOpen] = useState(false)
  const isEditMode = !!defaultValues

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: 
      {
      category: "",
      title: "",
      description: "",
      price: "",
      discount_percentage: "",
      image: undefined,
    },
  })

  // reset when defaultValues change (for edit mode)
  useEffect(() => {
    if (defaultValues) {
      form.reset({...defaultValues, 
        category:String(defaultValues?.category),
        discount_percentage:String(defaultValues?.discount_percentage),
      })
    }
  }, [defaultValues, form])

  const { mutate: addCourse } = usePost({
    service: insCourses.create,
    key: "courses",
    resource: "course",
  })

  const { mutate: updateCourse } = useUpdate({
    service: insCourses.update,
    key: "courses",
    resource: "course",
  })

  const { data: { results: resOfCategories } = {} } = useFetch({
    service: categoriesServices.getAll,
    key: "categories",
  })

  function onSubmit(values: CourseFormValues) {
    const formData = new FormData()
    formData.append("category", values.category)
    formData.append("title", values.title)
    formData.append("description", values.description)
    formData.append("price", values.price)
    if (values.discount_percentage) {
      formData.append("discount_percentage", values.discount_percentage)
    }
    if (values.image?.[0]) {
      formData.append("image", values.image[0])
    }

    if (isEditMode && defaultValues?.id) {
      updateCourse(
        { id: defaultValues.id, data: formData },
        {
          onSuccess: () => {
            setOpen(false)
          },
        }
      )
    } else {
      addCourse(formData, {
        onSuccess: () => {
          form.reset()
          setOpen(false)
        },
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button variant="outline" className="text-[16px] mx-2">
            <PencilIcon className="mr-2" />
            
          </Button>
        ) : (
          <Button className="text-[16px] mx-8">
            <PlusIcon className="mr-2" />
            إضافة كورس جديد
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "تعديل الكورس" : "إضافة كورس جديد"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التصنيف</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value }>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر تصنيف الكورس" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resOfCategories?.map((cat: { id: number; name: string }) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>الوصف</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل وصف الكورس" {...field} />
                    </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Discount */}
              <FormField
                control={form.control}
                name="discount_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نسبة الخصم</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: 20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image */}
              <div className="col-span-2">
                <FileUploadValidationDemo
                  title="صورة الكورس"
                  control={form.control}
                  name="image"
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  إلغاء
                </Button>
              </DialogClose>
              <Button type="submit">{isEditMode ? "تحديث الكورس" : "حفظ الكورس"}</Button>
            </DialogFooter>
          </form>
        </Form>
        <DevTool control={form.control} />
      </DialogContent>
    </Dialog>
  )
}
