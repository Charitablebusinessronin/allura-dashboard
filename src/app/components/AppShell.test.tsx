import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AppShell } from "./AppShell";
import { BrowserRouter } from "react-router";

const mockLogout = vi.fn();
const mockSetTheme = vi.fn();

vi.mock("../../lib/auth/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "1", email: "test@example.com", name: "Test User" },
    logout: mockLogout,
  }),
}));

vi.mock("../../lib/theme/useTheme", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: mockSetTheme,
  }),
  ThemeToggle: () => <button onClick={mockSetTheme}>Theme Toggle</button>,
}));

function renderAppShell() {
  return render(
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

describe("AppShell", () => {
  it("renders sidebar navigation links", () => {
    renderAppShell();
    expect(screen.getByRole("link", { name: /new chat/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^dreams$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /kanban/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /governance/i })).toBeInTheDocument();
  });

  it("calls logout when logout button is clicked", () => {
    renderAppShell();
    const logoutButton = screen.getByRole("button", { name: /sign out/i });
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
  });

  it("calls setTheme when theme button is clicked", () => {
    renderAppShell();
    const themeButton = screen.getByRole("button", { name: /theme toggle/i });
    fireEvent.click(themeButton);
    expect(mockSetTheme).toHaveBeenCalled();
  });
});
