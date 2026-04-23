import { useQuery } from "@tanstack/react-query";

import { getMe } from "../api";
import { authKeys } from "./auth.keys";

export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getMe,
    retry: false,
  });
}
