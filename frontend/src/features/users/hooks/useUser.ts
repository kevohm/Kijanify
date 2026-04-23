import { useQuery } from "@tanstack/react-query";

import { getUser } from "../api";
import { userKeys } from "./user.keys";

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
    enabled: Boolean(id),
  });
}

