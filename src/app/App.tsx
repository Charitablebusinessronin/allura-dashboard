import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { AuthProvider } from "../lib/auth/AuthContext";
import { PolicyProvider } from "../lib/policy/PolicyContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { router } from "./routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PolicyProvider>
            <RouterProvider router={router} />
          </PolicyProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
