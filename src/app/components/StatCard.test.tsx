import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
  it("renders label and value", () => {
    render(<StatCard label="Policies" value="12" />);
    expect(screen.getByText("Policies")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("renders delta when provided", () => {
    render(<StatCard label="Tasks" value="24" delta="+3 today" />);
    expect(screen.getByText("+3 today")).toBeInTheDocument();
  });

  it("does not render delta when omitted", () => {
    render(<StatCard label="Simple" value="42" />);
    expect(screen.queryByText(/today/i)).not.toBeInTheDocument();
  });

  it("has card styling", () => {
    const { container } = render(<StatCard label="Test" value="1" />);
    expect(container.firstChild).toHaveClass("bg-card");
    expect(container.firstChild).toHaveClass("rounded-xl");
  });
});
