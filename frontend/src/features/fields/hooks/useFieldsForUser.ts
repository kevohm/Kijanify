import { useQuery } from "@tanstack/react-query";

import { listFieldsForUser } from "../api";
import { fieldKeys } from "./field.keys";

export function useFieldsForUser(userId: string) {
  return useQuery({
    queryKey: fieldKeys.assignedToUser(userId),
    queryFn: () => listFieldsForUser(userId),
    enabled: Boolean(userId),
  });
}

