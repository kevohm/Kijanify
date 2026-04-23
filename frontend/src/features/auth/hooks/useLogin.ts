import { useMutation, useQueryClient } from "@tanstack/react-query";

import { login } from "../api";
import { authKeys } from "./auth.keys";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      queryClient.setQueryData(authKeys.me(), result.user);
    },
  });
}
