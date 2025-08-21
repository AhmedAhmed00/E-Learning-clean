import { useMemo } from "react";
import { useSearchParams } from "react-router";

export default function useQueryParams() {
  const [searchParams] = useSearchParams();
  const params = useMemo(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);
  return params;
}
