"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader2, PlusIcon } from "lucide-react";
import usePost from "@/hooks/usePost";
import { adsServices } from "@/data/api";
import { FileUploadValidationDemo } from "./Files";
import Ads from "@/pages/Ads";
import useUpdate from "@/hooks/useUpdate";

// ✅ Schema
const adSchema = z.object({
  name: z.string().min(2, "اسم الإعلان مطلوب"),
  status: z.enum(["active", "inactive"], {
    required_error: "حالة الإعلان مطلوبة",
  }),
  image: z.any().optional(),
});

type AdFormValues = z.infer<typeof adSchema>;

export function EditAd() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { state } = useLocation();

  const adToEdit = state?.item;
  
  
  
  console.log(adToEdit.image,"adToed");


  const [openModal, setOpenModal] = useState(isEditMode);

  const form = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      name: adToEdit?.name || "",
      status: adToEdit?.status || "active",
      image: adToEdit?.image,
    },
  });
  
  console.log(form.getFieldState("image" ,"image fil"));

  const { mutate: createAd, isPending: creating } = usePost({
    service: adsServices.create,
    key: "ads",
    resource: "الإعلان",
  });

  const { mutate: updateAd, isPending: updating } = useUpdate({
    service: adsServices.update,
    key: "ads",
    resource: "الإعلان",
  });

  useEffect(() => {
    if (isEditMode) {
      setOpenModal(true);
    }
  }, [isEditMode]);

  useEffect(() => {
    if (openModal && adToEdit) {
      form.reset({
        name: adToEdit.name,
        status: adToEdit.status,
        image: undefined,
      });
    }
  }, [openModal, adToEdit, form, adToEdit.name, adToEdit.status]);

  function handleDialogClose() {
    setOpenModal(false);
    form.reset();

    // If in edit mode, remove the URL param
    if (isEditMode) {
      navigate("/ads", { replace: true }); // adjust route as needed
    }
  }

  function onSubmit(values: AdFormValues) {
    const formData = new FormData();

    if (isEditMode) {
      const dirtyFields = form.formState.dirtyFields;

      if (dirtyFields.name) {
        formData.append("name", values.name);
      }

      if (dirtyFields.status) {
        formData.append("status", values.status);
      }

      if (dirtyFields.image && values.image) {
        formData.append("image", values.image);
      }

      if (!Object.keys(dirtyFields).length) {
        handleDialogClose();
        return;
      }

      updateAd(
        { id: adToEdit.id, body: formData },
        {
          onSuccess: handleDialogClose,
        },
      );
    } else {
      formData.append("name", values.name);
      formData.append("status", values.status);
      if (values.image) {
        formData.append("image", values.image);
      }

      createAd(formData, {
        onSuccess: handleDialogClose,
      });
    }
  }

  return (
    <>
      <Ads />
      <Dialog
        open={openModal}
        onOpenChange={(open) => !open && handleDialogClose()}
      >
        <DialogTrigger asChild>
          {!isEditMode && (
            <Button className="text-[16px] px-1">
              <PlusIcon className="mr-2 h-4 w-4" />
              إضافة إعلان جديد
            </Button>
          )}
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "تعديل الإعلان" : "إضافة إعلان جديد"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                title="تعديل صورة الاعلان"
                control={form.control}
                name="image"
              />

            
              {/* Footer */}
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    إلغاء
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={creating || updating}>
                  {creating || updating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "جاري التحديث..." : "جاري الإضافة..."}
                    </>
                  ) : isEditMode ? (
                    "تحديث الإعلان"
                  ) : (
                    "إضافة الإعلان"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
