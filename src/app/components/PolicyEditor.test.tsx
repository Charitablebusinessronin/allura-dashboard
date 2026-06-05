import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PolicyEditor } from "./PolicyEditor";

const mockSave = vi.fn();

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

function renderPolicyEditor(props = {}) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <PolicyEditor onSave={mockSave} onCancel={vi.fn()} {...props} />
    </QueryClientProvider>
  );
}

describe("PolicyEditor", () => {
  it("renders create policy form", () => {
    renderPolicyEditor();
    expect(screen.getByText(/create policy/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/policy name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it("calls onSave with form data on submit", async () => {
    renderPolicyEditor();
    const nameInput = screen.getByLabelText(/policy name/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    fireEvent.change(nameInput, { target: { value: "Test Policy" } });
    fireEvent.change(descriptionInput, { target: { value: "Test Description" } });

    // Add a rule first
    const addRuleButton = screen.getByRole("button", { name: /add rule/i });
    fireEvent.click(addRuleButton);

    // Fill in the rule fields - use the first inputs found
    const ruleNameInputs = screen.getAllByPlaceholderText(/Rule name/i);
    const conditionInputs = screen.getAllByPlaceholderText(/Condition/i);
    
    if (ruleNameInputs.length > 0) {
      fireEvent.change(ruleNameInputs[0], { target: { value: "Test Rule" } });
    }
    if (conditionInputs.length > 0) {
      fireEvent.change(conditionInputs[0], { target: { value: "test > 0" } });
    }

    const submitButton = screen.getByRole("button", { name: /create policy/i });
    fireEvent.click(submitButton);

    await vi.waitFor(() => {
      expect(mockSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Test Policy",
          description: "Test Description",
        })
      );
    });
  });

  it("renders edit mode with existing policy data", () => {
    const existingPolicy = {
      id: "1",
      name: "Existing Policy",
      description: "Existing Description",
      status: "active" as const,
      scope: "global" as const,
      rules: [],
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      enforcementCount: 0,
      violationCount: 0,
    };

    renderPolicyEditor({ policy: existingPolicy });
    expect(screen.getByText(/edit policy/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Existing Policy")).toBeInTheDocument();
  });
});
