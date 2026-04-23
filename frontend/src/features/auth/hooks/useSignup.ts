import { useMutation, useQueryClient } from "@tanstack/react-query";

import { signup } from "../api";
import { authKeys } from "./auth.keys";

export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signup,
    onSuccess: (result) => {
      queryClient.setQueryData(authKeys.me(), result.user);
    },
  });
}
