import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alluraApi } from "../api/alluraApi";

export const dreamKeys = {
  all: ["dreams"] as const,
  lists: () => [...dreamKeys.all, "list"] as const,
  detail: (id: string) => [...dreamKeys.all, "detail", id] as const,
};

export function useDreams() {
  return useQuery({
    queryKey: dreamKeys.lists(),
    queryFn: () => alluraApi.dreams.list(),
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

export function useCreateDream() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: alluraApi.dreams.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dreamKeys.lists() });
    },
  });
}
