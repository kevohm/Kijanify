import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateFieldStatus } from "../api";
import { fieldKeys } from "./field.keys";
import type { UpdateFieldStatusInput } from "../types";

type Variables = { id: string; input: UpdateFieldStatusInput };

export function useUpdateFieldStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: Variables) => updateFieldStatus(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: fieldKeys.lists() });
      queryClient.invalidateQueries({ queryKey: fieldKeys.detail(variables.id) });
    },
  });
}

