import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { GovernancePage } from "./GovernancePage";

vi.mock("../../lib/hooks/usePolicies", () => ({
  usePolicies: () => ({
    data: [
      {
        id: "1",
        name: "Memory Retention",
        description: "Controls memory retention",
        status: "active" as const,
        scope: "global" as const,
        rules: [],
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
        enforcementCount: 0,
        violationCount: 0,
      },
    ],
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

function renderGovernancePage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GovernancePage />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe("GovernancePage", () => {
  it("renders page header", () => {
    renderGovernancePage();
    expect(screen.getByRole("heading", { name: "Governance" })).toBeInTheDocument();
    expect(screen.getByText(/verify\. review\. approve/i)).toBeInTheDocument();
  });

  it("renders KPI cards", () => {
    renderGovernancePage();
    expect(screen.getByText("Policies Active")).toBeInTheDocument();
    expect(screen.getByText("Policy Checks")).toBeInTheDocument();
    // "Violations" appears in multiple places, use getAllByText
    expect(screen.getAllByText("Violations").length).toBeGreaterThan(0);
  });

  it("renders tabs", () => {
    renderGovernancePage();
    expect(screen.getByRole("button", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Policy Gates" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Evidence Chains" })).toBeInTheDocument();
  });

  it("renders policy in recent checks", () => {
    renderGovernancePage();
    // Use getAllByText since the policy name appears in multiple places
    expect(screen.getAllByText("Memory Retention").length).toBeGreaterThan(0);
  });
});
