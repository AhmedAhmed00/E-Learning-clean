import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useDelete({ service, key, resource }) {
  const queryClient = useQueryClient();
  const { mutate, data, isError } = useMutation({
    mutationFn: service,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [key],
      });
      toast.success(`${resource} Deleted Successfully`);
    },
    onError: () => {
      toast.error(`Cannot Delete This ${resource}`);
    },
  });
  return { mutate, data, isError };
}
