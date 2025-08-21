import { useSearchParams } from "react-router-dom";

export default function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  function handleFilter(values) {
    for (const key in values) {
      if (
        (typeof values[key] === "string" && !values[key].trim()) ||
        typeof values[key] === "undefined"
      ) {
        delete values[key];
      }
    }

    console.log("filterd values", values);

    setSearchParams(values);
  }

  return { searchParams, setSearchParams, handleFilter };
}
