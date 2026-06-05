import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { LoadingSpinner, PageSkeleton } from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders spinner element", () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders with sm size", () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    expect(container.querySelector(".size-4")).toBeInTheDocument();
  });

  it("renders with lg size", () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    expect(container.querySelector(".size-12")).toBeInTheDocument();
  });
});

describe("PageSkeleton", () => {
  it("renders skeleton placeholders", () => {
    const { container } = render(<PageSkeleton />);
    const pulses = container.querySelectorAll(".animate-pulse");
    expect(pulses.length).toBeGreaterThan(0);
  });

  it("renders 5 stat card placeholders", () => {
    const { container } = render(<PageSkeleton />);
    const grid = container.querySelector(".grid-cols-5");
    expect(grid).toBeInTheDocument();
    expect(grid?.children.length).toBe(5);
  });
});
