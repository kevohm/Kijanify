import { useMutation, useQueryClient } from "@tanstack/react-query";

import { assignAgent } from "../api";
import { fieldKeys } from "./field.keys";
import type { AssignAgentInput } from "../types";

type Variables = { id: string; input: AssignAgentInput };

export function useAssignAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: Variables) => assignAgent(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: fieldKeys.lists() });
      queryClient.invalidateQueries({ queryKey: fieldKeys.detail(variables.id) });
    },
  });
}

