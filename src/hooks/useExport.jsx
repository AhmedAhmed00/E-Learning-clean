import { useQuery } from "@tanstack/react-query";

export default function useExport(endpoint, startExport) {
  const { data, isError, isFetching, isLoading, status } = useQuery({
    queryKey: ["export", endpoint],
    // queryFn: () => exportData(endpoint),
    enabled: !!startExport,
  });

  return { data, isError, isFetching, isLoading, status };
}
