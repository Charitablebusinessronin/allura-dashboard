import { useQuery } from "@tanstack/react-query";
import { alluraApi } from "../api/alluraApi";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => alluraApi.auth.me(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
