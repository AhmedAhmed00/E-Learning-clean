import { useQuery, type UseQueryResult } from "@tanstack/react-query";

type ServiceFn<TData> = (id: string | number) => Promise<TData>;

export default function useFetchById<TData>(

  
  key: string,
  id: string | number | undefined,
  service: ServiceFn<TData>,
  cacheTime: number = 30 * 1000, // default 30s
): UseQueryResult<TData, Error> {
  return useQuery<TData, Error>({
    queryKey: [key, id],
    queryFn: () => service(id as string | number),
    enabled: !!id,
    gcTime: cacheTime, // React Query v5 uses `gcTime` instead of `cacheTime`
  });
}
