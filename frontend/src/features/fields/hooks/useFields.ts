import { useQuery } from "@tanstack/react-query";

import { listFields } from "../api";
import { fieldKeys } from "./field.keys";

export function useFields() {
  return useQuery({
    queryKey: fieldKeys.lists(),
    queryFn: listFields,
  });
}

