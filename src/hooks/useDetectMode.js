import React from "react";
import { useSearchParams } from "react-router-dom";

export default function useDetectMode() {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const isEditingSession =
    searchParams.get("mode") === "update" && searchParams.get("id") !== "";

  return { isEditingSession, id };
}
