import { useMutation, useQueryClient } from "@tanstack/react-query";

import { setAuthToken } from "../../../lib/auth-token";
import { signup } from "../api";
import { authKeys } from "./auth.keys";

export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signup,
    onSuccess: (result) => {
      setAuthToken(result.token);
      queryClient.setQueryData(authKeys.me(), result.user);
    },
  });
}

