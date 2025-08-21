import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useUpdate({ key, resourse, service }) {
  const queryClient = useQueryClient();

  const {
    mutate,
    isError: isErrorUpdatihg,
    data,
    status: updatingStatus,
  } = useMutation({
    mutationFn: ({ id, body }) => service(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [key],
      });
      toast.success(` ${resourse} update successfully`);
    },
    onError: (err) => {
      if (err.data.detail) {
        toast.error(err.data.detail);
      } else {
        toast.error(`cannot edit ${resourse}`);
      }
    },
  });
  return { mutate, isErrorUpdatihg, data, updatingStatus };
}
