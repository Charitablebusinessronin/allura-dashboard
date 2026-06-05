import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorDisplay } from "./ErrorDisplay";

describe("ErrorDisplay", () => {
  it("renders title and message", () => {
    render(<ErrorDisplay title="Failed" message="Something broke" />);
    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(screen.getByText("Something broke")).toBeInTheDocument();
  });

  it("uses default title when not provided", () => {
    render(<ErrorDisplay message="Error occurred" />);
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("shows retry button when onRetry is provided", () => {
    const mockRetry = vi.fn();
    render(<ErrorDisplay message="Retry me" onRetry={mockRetry} />);
    const retryButton = screen.getByRole("button", { name: /try again/i });
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it("does not show retry button when onRetry is omitted", () => {
    render(<ErrorDisplay message="No retry" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
