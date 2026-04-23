import { useQuery } from "@tanstack/react-query";

import { getField } from "../api";
import { fieldKeys } from "./field.keys";

export function useField(id: string) {
  return useQuery({
    queryKey: fieldKeys.detail(id),
    queryFn: () => getField(id),
    enabled: Boolean(id),
  });
}

