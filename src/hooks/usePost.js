import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function usePost({ service, resourse, key }) {
  const queryClient = useQueryClient();
  let loadingToastId;

  const {
    mutate,
    isError: isErrorAdding,
    data,
    status: addingStatus,
  } = useMutation({
    mutationFn: service,

    onSuccess: () => {
      toast.dismiss(loadingToastId);
      queryClient.invalidateQueries({
        queryKey: [key],
      });
      toast.success(`${resourse} added successfully`);
    },

    onError: (err) => {
      const errMsg = err?.statusText
        ? `${err?.statusText} \n Cannot add ${resourse}`
        : `Cannot add ${resourse}`;

      toast.error(errMsg);
    },
  });
  return { mutate, isErrorAdding, data, addingStatus };
}
