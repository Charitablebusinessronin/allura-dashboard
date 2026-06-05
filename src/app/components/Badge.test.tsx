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
    expect(container.firstChild).toHaveClass("bg-[#E8F0FE]");
    expect(container.firstChild).toHaveClass("text-[#0C56EB]");
  });

  it("applies green variant", () => {
    const { container } = render(<Badge variant="green">Success</Badge>);
    expect(container.firstChild).toHaveClass("bg-[#E0F5EE]");
    expect(container.firstChild).toHaveClass("text-[#0C9154]");
  });

  it("applies coral variant", () => {
    const { container } = render(<Badge variant="coral">Error</Badge>);
    expect(container.firstChild).toHaveClass("bg-[#FFF1EC]");
    expect(container.firstChild).toHaveClass("text-[#FB5D0F]");
  });

  it("applies gray variant", () => {
    const { container } = render(<Badge variant="gray">Pending</Badge>);
    expect(container.firstChild).toHaveClass("bg-[#F3F4F6]");
    expect(container.firstChild).toHaveClass("text-[#5A6071]");
  });
});
