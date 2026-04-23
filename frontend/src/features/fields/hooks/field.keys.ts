export const fieldKeys = {
  all: ["fields"] as const,
  lists: () => [...fieldKeys.all, "list"] as const,
  assignedToUser: (userId: string) => [...fieldKeys.all, "assigned", userId] as const,
  detail: (id: string) => [...fieldKeys.all, "detail", id] as const,
};
