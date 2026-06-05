import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import { KanbanPage } from "./KanbanPage";

vi.mock("../../lib/hooks/useKanban", () => ({
  useKanbanTasks: () => ({
    data: {
      columns: {
        "To Do": [
          { id: "1", title: "Task 1", scope: "Memory", type: "Analysis", date: "Today", risk: "high" as const },
        ],
        "In Progress": [],
        "In Review": [],
        "Completed": [],
      },
      stats: { total: 1, inProgress: 0, inReview: 0, completed: 0, overdue: 1 },
    },
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

function renderKanbanPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <KanbanPage />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe("KanbanPage", () => {
  it("renders page header", () => {
    renderKanbanPage();
    expect(screen.getByText("Kanban Board")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    renderKanbanPage();
    // Use heading role for column headers
    expect(screen.getByRole("heading", { name: "To Do" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "In Progress" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "In Review" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Completed" })).toBeInTheDocument();
  });

  it("renders stats footer", () => {
    renderKanbanPage();
    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
    // The "1" appears in multiple places (column count + stats), check within the stats footer
    const statsFooter = screen.getByText("Total Tasks").closest("div")?.parentElement;
    expect(statsFooter).toHaveTextContent("1");
  });

  it("renders search input", () => {
    renderKanbanPage();
    expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument();
  });
});
