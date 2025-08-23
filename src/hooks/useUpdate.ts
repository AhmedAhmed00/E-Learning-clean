import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import toast from "react-hot-toast";

type UpdateArgs<TBody> = {
  id: number | string;
  body: TBody;
};

type UseUpdateProps<TBody, TData> = {
  key: string;
  resourse: string;
  service: (id: number | string, body: TBody) => Promise<TData>;
};

export default function useUpdate<TBody = unknown, TData = unknown>({
  key,
  resourse,
  service,
}: UseUpdateProps<TBody, TData>) {
  const queryClient = useQueryClient();

  const {
    mutate,
    isError: isErrorUpdatihg,
    data,
    status: updatingStatus,
  }: UseMutationResult<TData, any, UpdateArgs<TBody>> = useMutation({
    mutationFn: ({ id, body }) => service(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [key],
      });
      toast.success(`${resourse} updated successfully`);
    },
    onError: (err: any) => {
      if (err?.data?.detail) {
        toast.error(err.data.detail);
      } else {
        toast.error(`Cannot edit ${resourse}`);
      }
    },
  });

  return { mutate, isErrorUpdatihg, data, updatingStatus };
}
