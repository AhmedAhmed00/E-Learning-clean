import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { DevTool } from "@hookform/devtools";
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
import { Edit, Loader2, PlusIcon } from "lucide-react"

import usePost from "@/hooks/usePost"
import BASEURL, { apiRequest, rolesServices } from "@/data/api"
import { useFetch } from "@/hooks/useFetch";

// ✅ 1. Schema
const roleSchema = z.object({
  name: z.string().min(3, "اسم الدور يجب أن يحتوي على 3 أحرف على الأقل"),
  permission_ids: z.array(z.number()).min(1, "يجب اختيار صلاحية واحدة على الأقل"),
})

type RoleFormValues = z.infer<typeof roleSchema>

export function RoleForm({ defaultValues }: { defaultValues?: RoleFormValues & { id?: number } }) {
  const [openModal, setOpenModal] = useState(false)

  // ✅ distinguish between add & edit
  const isEdit = !!defaultValues

  const { mutate: addNewRole, isPending: isAdding } = usePost({
    service: rolesServices.create,
    key: "roles",
    resource: "الدور",
  })

  const { mutate: updateRole, isPending: isUpdating } = usePost({
    service: (values) => rolesServices.update(defaultValues!.id!, values),
    key: "roles",
    resource: "الدور",
  })

  const { data } = useFetch({
    service: () => apiRequest("get", `${BASEURL}/employee/permissions/`),
    key: "roles",
  })

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      permission_ids: defaultValues?.permissions.map(perm =>perm?.id) ?? [],
    },
  })
  

  // ✅ Reset form whenever defaultValues change (important for edit mode)


  function onSubmit(values: RoleFormValues) {
    if (isEdit) {
      updateRole(values)
    } else {
      addNewRole(values)
    }
  }

  return (
    <Dialog onOpenChange={setOpenModal} open={openModal}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          >
            <Edit size={18} />
          </Button>
        ) : (
          <Button style={{ cursor: "pointer" }} className="text-[16px] mx-8">
            <PlusIcon className="mr-2" />
            إضافة دور جديد
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "تعديل الدور" : "إضافة دور جديد"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الدور</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: HR Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Permissions Multi Select */}
            <FormField
              control={form.control}
              name="permission_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الصلاحيات</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-4 border rounded-md p-2 max-h-[300px] overflow-y-auto">
                      {data?.map((section) => (
                        <div key={section.section} className="space-y-2">
                          <h3 className="text-sm font-semibold text-gray-600">
                            {section.section}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {section.permissions.map((perm) => {
                              const isSelected = field.value.includes(perm.id) || field.value.includes(perm)
                              return (
                                <Button
                                  type="button"
                                  key={perm.id}
                                  variant={isSelected ? "default" : "outline"}
                                  className="rounded-full text-xs"
                                  onClick={() => {
                                    if (isSelected) {
                                      field.onChange(field.value.filter((id) => id !== perm.id))
                                    } else {
                                      field.onChange([...field.value, perm.id])
                                    }
                                  }}
                                >
                                  {perm.name}
                                </Button>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
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
              <Button type="submit" disabled={isAdding || isUpdating}>
                {(isAdding || isUpdating) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? "جاري التعديل" : "جاري الإضافة"}
                  </>
                ) : (
                  isEdit ? "تعديل الدور" : "إضافة الدور"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      <DevTool placement="bottom-right" control={form.control} />
    </Dialog>
  )
}
