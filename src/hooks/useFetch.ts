import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

// More flexible service type (matches your createService signatures)
type Service<TData> = {
  (params?: Record<string, string>): Promise<TData>;
  (id: string | number, params?: Record<string, string>): Promise<TData>;
};

interface UseFetchParams<TData> {
  key: string;
  id?: string | number;
  enabled?: boolean;
  service: Service<TData>;
  cacheTime?: number;
  params?: Record<string, string> | null;
}

interface UseFetchReturn<TData> {
  data: TData | undefined;
  isError: boolean;
  isFetching: boolean;
  isLoading: boolean;
}

export function useFetch<TData>({
  key,
  id,
  enabled = true,
  service,
  params: manualParams = null,
}: UseFetchParams<TData>): UseFetchReturn<TData> {
  const [searchParams] = useSearchParams();

  // Merge URL params + manual params
  const paramsUrl = Object.fromEntries(searchParams.entries());
  const params: Record<string, string> = {
    ...manualParams,
    page: searchParams.get("page") || 1,
    search: searchParams.get("search") || manualParams?.search || "",
    ...paramsUrl,
  };

  const { data, isFetching, isError, isLoading } = useQuery<TData>({
    queryKey: [key, params],
    queryFn: () => {
      if (id !== undefined) {
        return service(id, params);
      }
      return service(params);
    },
    enabled,
    gcTime: 60 * 1000, // react-query v5 (was cacheTime in v4)
  });

  return { data, isError, isFetching, isLoading };
}
