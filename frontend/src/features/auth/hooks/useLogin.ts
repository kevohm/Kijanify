import { useMutation, useQueryClient } from "@tanstack/react-query";

import { setAuthToken } from "../../../lib/auth-token";
import { login } from "../api";
import { authKeys } from "./auth.keys";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      setAuthToken(result.token);
      queryClient.setQueryData(authKeys.me(), result.user);
    },
  });
}

