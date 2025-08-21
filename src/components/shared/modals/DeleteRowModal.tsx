"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import BASEURL, { apiRequest } from "@/data/api";
import type { ModalName } from "@/lib/types";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

interface IDeleteRowModalProps {
  id: string;
  modelName: ModalName;
  endpoint: string;
}

export default function DeleteRowModal({
  id,
  modelName,
  endpoint,
}: IDeleteRowModalProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  // ✅ Mutation to delete
  const { mutate: deleteRow, isPending } = useMutation({
    mutationFn: () => apiRequest("delete", `${BASEURL}/${endpoint}/${id}/`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [modelName] });
      toast.success("تم الحذف");
      setOpen(false); // Close the dialog
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      toast.error("فشل الحذف");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button>
          <Trash2 size={16} className="text-gray" />
        </button>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-[320px] gap-4 md:w-full md:gap-6">
        <DialogHeader className="gap-4 md:gap-6">
          <DialogTitle className="text-lg font-medium text-primary text-center">
            Delete Record
          </DialogTitle>
          <DialogDescription className="sr-only">
            Are you sure you need to delete the record?
          </DialogDescription>
          <p className="text-md text-center text-black">
            Are you sure you need to delete the record?
          </p>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-between items-center gap-2">
          <DialogClose asChild className="outline-none w-full">
            <button
              type="button"
              className="text-sm cursor-pointer md:text-base font-medium justify-center h-10 border border-primary text-primary bg-white rounded-sm"
            >
              Cancel
            </button>
          </DialogClose>
          <button
            disabled={isPending}
            onClick={() => deleteRow()}
            className="bg-primary text-sm font-medium flex cursor-pointer items-center justify-center rounded-sm text-center text-white md:text-md h-10 w-full disabled:opacity-60"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
