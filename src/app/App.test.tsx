import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../lib/auth/AuthContext";
import { PolicyProvider } from "../lib/policy/PolicyContext";
import App from "./App";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PolicyProvider>
          <BrowserRouter>{ui}</BrowserRouter>
        </PolicyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

describe("App Integration", () => {
  it("renders without crashing", () => {
    renderWithProviders(<App />);
    // App should render - either login page or dashboard
    expect(document.body).toBeTruthy();
  });
});
