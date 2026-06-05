import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ActionCard } from "./ActionCard";

describe("ActionCard", () => {
  it("renders title and description", () => {
    render(
      <ActionCard
        title="Analyze Memory"
        description="Deep analysis of memory patterns"
        icon="Brain"
      />
    );
    expect(screen.getByText("Analyze Memory")).toBeInTheDocument();
    expect(screen.getByText("Deep analysis of memory patterns")).toBeInTheDocument();
  });

  it("renders with fallback icon when icon name is invalid", () => {
    render(
      <ActionCard
        title="Test Action"
        description="Test description"
        icon="NonExistentIcon"
      />
    );
    expect(screen.getByText("Test Action")).toBeInTheDocument();
  });

  it("is clickable as a button", () => {
    render(
      <ActionCard
        title="Clickable"
        description="Should be a button"
        icon="Zap"
      />
    );
    expect(screen.getByRole("button", { name: /clickable/i })).toBeInTheDocument();
  });
});
