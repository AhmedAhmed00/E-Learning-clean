import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UsePostProps<TVariables, TResponse> {
  service: (variables: TVariables) => Promise<TResponse>;
  resource: string;
  key: string;
}

interface UsePostReturn<TVariables, TResponse> {
  mutate: (
    variables: TVariables,
    options?: Omit<
      UseMutationOptions<TResponse, unknown, TVariables, unknown>,
      "mutationFn"
    >,
  ) => void;
  isErrorAdding: boolean;
  data?: TResponse;
  addingStatus: "idle" | "loading" | "error" | "success";
}

export default function usePost<TVariables = unknown, TResponse = unknown>({
  service,
  resource,
  key,
}: UsePostProps<TVariables, TResponse>): UsePostReturn<TVariables, TResponse> {
  const queryClient = useQueryClient();
  let loadingToastId: string | undefined;

  const {
    mutate: originalMutate,
    isError,
    data,
    isPending,
    status,
  } = useMutation<TResponse, unknown, TVariables>({
    mutationFn: service,
    onMutate: () => {
      loadingToastId = toast.loading(`Adding ${resource}...`);
    },
    onSuccess: () => {
      toast.dismiss(loadingToastId);
      queryClient.invalidateQueries({ queryKey: [key] });
      toast.success(`تم إضافة ${resource} بنجاح`);
    },
    onError: (err: any) => {
      toast.dismiss(loadingToastId);
      const errMsg = err?.statusText
        ? `${err.statusText}\nCannot add ${resource}`
        : `Cannot add ${resource}`;
      toast.error(errMsg);
    },
  });

  // Wrapped mutate to accept optional onSuccess/onError callbacks
  const mutate = (
    variables: TVariables,
    options?: Omit<
      UseMutationOptions<TResponse, unknown, TVariables, unknown>,
      "mutationFn"
    >,
  ) => {
    return originalMutate(variables, options);
  };

  return { mutate, isErrorAdding: isError, data, isPending };
}
