import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createField } from "../api";
import { fieldKeys } from "./field.keys";

export function useCreateField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fieldKeys.lists() });
    },
  });
}

