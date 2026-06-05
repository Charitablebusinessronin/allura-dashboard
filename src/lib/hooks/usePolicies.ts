import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { alluraApi } from "../api/alluraApi";

export const policyKeys = {
  all: ["policies"] as const,
  lists: () => [...policyKeys.all, "list"] as const,
  list: (filters: string) => [...policyKeys.lists(), { filters }] as const,
  details: () => [...policyKeys.all, "detail"] as const,
  detail: (id: string) => [...policyKeys.details(), id] as const,
  checks: (id: string) => [...policyKeys.detail(id), "checks"] as const,
  violations: (id: string) => [...policyKeys.detail(id), "violations"] as const,
};

export function usePolicies() {
  return useQuery({
    queryKey: policyKeys.lists(),
    queryFn: () => alluraApi.policies.list(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function usePolicy(id: string) {
  return useQuery({
    queryKey: policyKeys.detail(id),
    queryFn: () => alluraApi.policies.get(id),
    enabled: !!id,
  });
}

export function useCreatePolicy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: alluraApi.policies.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
    },
  });
}

export function useUpdatePolicy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Parameters<typeof alluraApi.policies.update>[1]) =>
      alluraApi.policies.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: policyKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
    },
  });
}

export function useDeletePolicy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: alluraApi.policies.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
    },
  });
}

export function useRunPolicyCheck() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: alluraApi.policies.check,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: policyKeys.checks(id) });
      queryClient.invalidateQueries({ queryKey: policyKeys.detail(id) });
    },
  });
}
