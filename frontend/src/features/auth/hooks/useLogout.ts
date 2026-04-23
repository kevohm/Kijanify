import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { logout } from "../api";
import { authKeys } from "./auth.keys";

export function useLogout() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    void logout().finally(() => {
      queryClient.removeQueries({ queryKey: authKeys.all });
    });
  }, [queryClient]);
}
