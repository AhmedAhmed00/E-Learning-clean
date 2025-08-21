
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
import { Loader2, PlusIcon } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import usePost from "@/hooks/usePost"
import { employeesServices } from "@/data/api"
import { FileUploadValidationDemo } from "./Files"
import { prepareFormData } from "@/lib/helpers"
import { useState } from "react"

// ✅ 1. Schema
const userSchema = z.object({
  name: z.string().min(3, "يجب أن يحتوي الاسم على 3 أحرف على الأقل"),
  group_id: z.string().min(1, "يجب اختيار المجموعة"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  phone: z.string().min(5, "أدخل رقم هاتف صحيح"),
  password: z.string().min(4, "كلمة المرور قصيرة جدًا"),
    image: z.instanceof(File,{error:"صورة الموظف مطلوبة"}),
  
})



type UserFormValues = z.infer<typeof userSchema>

// ✅ Mock groups (ممكن تجيبهم من API)
const groups = [
  { id: "1", name: "Admin" },
  { id: "2", name: "Teacher" },
  { id: "3", name: "Student" },
]

export function EmployeeForm() {
    const [openModal, setOpenModal] = useState(false);
  
  
  const {mutate:addNewEmployee ,isPending} = usePost({ 
    service:employeesServices.create,
    key:"employees", 
    resource:"الموظف"
  })
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      group_id: "",
      email: "",
      phone: "",
      password: "",
      image:undefined
    },
  })

  function onSubmit(values: UserFormValues) {
    const formData = prepareFormData(values)
    addNewEmployee(formData)
  }

  
  
  return (
    <Dialog onOpenChange={setOpenModal} open={openModal}>
      <DialogTrigger asChild>
        <Button style={{ cursor: "pointer" }} className="text-[16px] mx-8">
          <PlusIcon className="mr-2" />
          إضافة موظف جديد
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>إضافة موظف جديد</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل الاسم" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Group */}
            <FormField
              control={form.control}
              name="group_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المجموعة</FormLabel>
                  <FormControl>
                    <Select   onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر المجموعة" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Input type="email" placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <FormControl>
                    <PhoneInput
                      country={"eg"}
                      value={field.value}
                      onChange={(val) => field.onChange("+" + val)}
                      inputClass="!w-full !h-10 !text-base !border !rounded-md "
                    
                      containerClass="!w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
                 <FileUploadValidationDemo
                            title="صورة الموظف"
                            control={form.control}
                            name="image"
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
                    جاري إضافة الموظف
                  </>
                ) : (
                  "إضافة موظف"
                )}
              </Button>{" "}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
