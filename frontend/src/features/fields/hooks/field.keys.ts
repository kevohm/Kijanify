export const fieldKeys = {
  all: ["fields"] as const,
  lists: () => [...fieldKeys.all, "list"] as const,
  detail: (id: string) => [...fieldKeys.all, "detail", id] as const,
};

