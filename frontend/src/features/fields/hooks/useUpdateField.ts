import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateField } from "../api";
import { fieldKeys } from "./field.keys";
import type { UpdateFieldInput } from "../types";

type Variables = { id: string; input: UpdateFieldInput };

export function useUpdateField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: Variables) => updateField(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: fieldKeys.lists() });
      queryClient.invalidateQueries({ queryKey: fieldKeys.detail(variables.id) });
    },
  });
}

