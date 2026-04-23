import { useQuery } from "@tanstack/react-query";

import { listUsers } from "../api";
import type { ListUsersParams } from "../api/users.api";
import { userKeys } from "./user.keys";

export function useUsers(params: ListUsersParams = {}) {
  return useQuery({
    queryKey: [...userKeys.lists(), params] as const,
    queryFn: () => listUsers(params),
  });
}

