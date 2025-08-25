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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import usePost from "@/hooks/usePost";
import BASEURL, {
  apiRequest,
  employeesServices,
  rolesServices,
} from "@/data/api";
import { FileUploadValidationDemo } from "./Files";
import { prepareFormData } from "@/lib/helpers";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";

// ✅ 1. Schema - Added permissions field
const userSchema = z.object({
  name: z.string().min(3, "يجب أن يحتوي الاسم على 3 أحرف على الأقل"),
  group_id: z.string().min(1, "يجب اختيار المجموعة"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  phone: z.string().min(5, "أدخل رقم هاتف صحيح"),
  password: z.string().min(4, "كلمة المرور قصيرة جدًا"),
  image: z.instanceof(File, { error: "صورة الموظف مطلوبة" }),
  permissions: z.array(z.number()).optional().default([]), // Added permissions field
});

type UserFormValues = z.infer<typeof userSchema>;

export function EmployeeForm() {
  const [openModal, setOpenModal] = useState(false);
  const { data: { results: groups } = {} } = useFetch({
    service: rolesServices.getAll,
    key: "job-role",
    params: {
      paginated: "false",
    },
  });

  const { mutate: addNewEmployee, isPending } = usePost({
    service: employeesServices.create,
    key: "employees",
    resource: "الموظف",
  });
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      group_id: "",
      email: "",
      phone: "",
      password: "",
      image: undefined,
      permissions: [], // Initialize permissions as empty array
    },
  });

  const groupSelected =
    groups?.find((group) => group?.name === form?.watch("group_id"))?.id ??
    false;
    
  const { data: groupData = {} } = useFetch({
    service: () =>
      apiRequest(
        "get",
        `${BASEURL}/employee/groups-with-permissions/${groupSelected}/`,
      ),
    key: `group-${groupSelected}`,
    enabled: Boolean(groupSelected),
  });

  // Extract permissions from the nested structure
  const permissions = groupData?.permissions || [];

  console.log(permissions, "response of selected role permissions");

  function onSubmit(values: UserFormValues) {
    const formData = prepareFormData(values);
    const groupSelected = groups.find(
      (group) => group.name === values.group_id,
    ).id;
    formData.delete("group_id");
    formData.append("group_id", groupSelected);
    console.log(groupSelected);
    addNewEmployee(formData);
  }

  return (
    <Dialog onOpenChange={setOpenModal} open={openModal}>
      <DialogTrigger asChild>
        <Button style={{ cursor: "pointer" }} className="text-[16px] ">
          <PlusIcon className="mr-2" />
          إضافة موظف جديد
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>إضافة موظف جديد</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="grid grid-cols-2 gap-5">
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
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="user@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Group */}
            <FormField
              control={form.control}
              name="group_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المجموعة</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Reset permissions when group changes
                        form.setValue("permissions", []);
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر المجموعة" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups?.map((g) => (
                          <SelectItem key={g?.id} value={g?.name}>
                            {g?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Permissions - Fixed logic */}
            {permissions.length > 0 && (
              <FormField
                control={form.control}
                name="permissions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الصلاحيات</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-4 border rounded-md p-2 max-h-[300px] overflow-y-auto">
                        <div className="flex flex-wrap gap-2">
                          {permissions.map((perm) => {
                            const isSelected = field.value?.includes(perm.id);

                            return (
                              <Button
                                type="button"
                                key={perm.id}
                                variant={isSelected ? "default" : "outline"}
                                className="rounded-full text-xs"
                                onClick={() => {
                                  const currentPermissions = field.value || [];
                                  if (isSelected) {
                                    // Remove permission
                                    field.onChange(
                                      currentPermissions.filter((id) => id !== perm.id)
                                    );
                                  } else {
                                    // Add permission
                                    field.onChange([...currentPermissions, perm.id]);
                                  }
                                }}
                              >
                                {perm.name}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Phone and Password */}
            <div className="grid grid-cols-2 gap-5">
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
            </div>
            
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
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}