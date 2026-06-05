import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("applies blue variant by default", () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstChild).toHaveClass("bg-primary/10");
    expect(container.firstChild).toHaveClass("text-primary");
  });

  it("applies green variant", () => {
    const { container } = render(<Badge variant="green">Success</Badge>);
    expect(container.firstChild).toHaveClass("bg-allura-green/10");
    expect(container.firstChild).toHaveClass("text-allura-green");
  });

  it("applies coral variant", () => {
    const { container } = render(<Badge variant="coral">Error</Badge>);
    expect(container.firstChild).toHaveClass("bg-allura-orange/10");
    expect(container.firstChild).toHaveClass("text-allura-orange");
  });

  it("applies gray variant", () => {
    const { container } = render(<Badge variant="gray">Pending</Badge>);
    expect(container.firstChild).toHaveClass("bg-muted");
    expect(container.firstChild).toHaveClass("text-muted-foreground");
  });
});
