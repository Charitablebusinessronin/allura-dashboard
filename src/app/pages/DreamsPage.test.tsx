import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { DreamsPage } from "./DreamsPage";

const mockCreateDream = vi.fn();

vi.mock("../../lib/hooks/useDreams", () => ({
  useDreams: () => ({
    data: {
      dreams: [
        {
          dream: "Memory Analysis",
          scope: "Episodic",
          type: "Analysis",
          status: "Completed",
          results: "View results",
          updated: "2 hours ago",
        },
      ],
      quickActions: [
        { title: "Analyze Memory", description: "Deep analysis", icon: "Brain" },
      ],
      insights: [
        { label: "Active Dreams", value: "3", delta: "+3 today" },
      ],
    },
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
  useCreateDream: () => ({
    mutate: mockCreateDream,
    isPending: false,
  }),
}));

function renderDreamsPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <DreamsPage />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe("DreamsPage", () => {
  it("renders page header", () => {
    renderDreamsPage();
    expect(screen.getByText("Dreams")).toBeInTheDocument();
    expect(screen.getByText(/background intelligence/i)).toBeInTheDocument();
  });

  it("renders prompt textarea", () => {
    renderDreamsPage();
    expect(screen.getByPlaceholderText(/ask allura to analyze/i)).toBeInTheDocument();
  });

  it("renders quick actions", () => {
    renderDreamsPage();
    expect(screen.getByText("Analyze Memory")).toBeInTheDocument();
  });

  it("renders dreams table", () => {
    renderDreamsPage();
    expect(screen.getByText("Memory Analysis")).toBeInTheDocument();
    expect(screen.getByText("Episodic")).toBeInTheDocument();
  });

  it("renders insights panel", () => {
    renderDreamsPage();
    expect(screen.getByText("Active Dreams")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
