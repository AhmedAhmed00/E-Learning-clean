import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import SearchableSelect from "../ui/SearchableSelect";

export const useInfiniteData = ({ search, serviceKey, service, isOpen }) => {
  return useInfiniteQuery({
    queryKey: [serviceKey, search],

    queryFn: ({ pageParam = 1 }) =>
      service({
        page: pageParam,
        search: search,
      }),
    initialPageParam: 1,
    enabled: isOpen,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    refetchOnWindowFocus: false,
  });
};

export function InfiniteSelect({
  control,
  name,
  service,
  serviceKey,
  defaultValue,
  prefetch = false,
}) {
  const [searchQuery, setSearchQuery] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteData({
      search: searchQuery,
      service: service,
      serviceKey: serviceKey,
      isOpen: enabled || prefetch,
    });
  const allItems = data?.pages.flatMap((page) => page.data) || [];

  return (
    <SearchableSelect
      setEnabled={setEnabled}
      renderValue="name"
      chooseValue="id"
      items={allItems}
      control={control}
      name={name}
      onSearch={setSearchQuery}
      hasNextPage={hasNextPage}
      isFetchingNext={isFetchingNextPage}
      fetchNext={fetchNextPage}
    />
  );
}
