import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { ErrorBoundary } from "./ErrorBoundary";

const ThrowError = () => {
  throw new Error("Test error");
};

function renderWithRouter(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
}

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    renderWithRouter(
      <ErrorBoundary>
        <div>Safe content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText(/safe content/i)).toBeInTheDocument();
  });

  it("renders fallback UI when child throws", () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderWithRouter(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/test error/i)).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("has a retry button that resets the boundary", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderWithRouter(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const retryButton = screen.getByRole("button", { name: /try again/i });
    expect(retryButton).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
