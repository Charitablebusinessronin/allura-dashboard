import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alluraApi } from "../api/alluraApi";

export const kanbanKeys = {
  all: ["kanban"] as const,
  lists: () => [...kanbanKeys.all, "list"] as const,
  detail: (id: string) => [...kanbanKeys.all, "detail", id] as const,
};

export function useKanbanTasks() {
  return useQuery({
    queryKey: kanbanKeys.lists(),
    queryFn: () => alluraApi.kanban.list(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: alluraApi.kanban.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kanbanKeys.lists() });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Parameters<typeof alluraApi.kanban.update>[1]) =>
      alluraApi.kanban.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kanbanKeys.lists() });
    },
  });
}

export function useMoveTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, column }: { id: string; column: Parameters<typeof alluraApi.kanban.move>[1] }) =>
      alluraApi.kanban.move(id, column),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kanbanKeys.lists() });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: alluraApi.kanban.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kanbanKeys.lists() });
    },
  });
}
