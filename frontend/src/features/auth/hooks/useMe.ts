import { useQuery } from "@tanstack/react-query";

import { getAuthToken } from "../../../lib/auth-token";
import { getMe } from "../api";
import { authKeys } from "./auth.keys";

export function useMe() {
  const token = getAuthToken();

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    enabled: Boolean(token),
  });
}

