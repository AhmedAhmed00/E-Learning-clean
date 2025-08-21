import { useQuery } from "@tanstack/react-query";

export default function useFetchById(key, id, service, cacheTime = 30 * 10000) {
  const { data, isError, isFetching, isLoading, status } = useQuery({
    queryKey: [key, id],
    queryFn: () => service(id),
    enabled: !!id,
    cacheTime: cacheTime,
  });

  return { data, isError, isFetching, isLoading, status };
}
