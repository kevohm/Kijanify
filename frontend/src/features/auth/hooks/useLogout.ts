import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { clearAuthToken } from "../../../lib/auth-token";
import { authKeys } from "./auth.keys";

export function useLogout() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    clearAuthToken();
    queryClient.removeQueries({ queryKey: authKeys.all });
  }, [queryClient]);
}

