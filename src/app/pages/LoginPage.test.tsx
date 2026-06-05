import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginPage } from "./LoginPage";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "../../lib/auth/AuthContext";

const mockLogin = vi.fn();

vi.mock("../../lib/auth/AuthContext", async () => {
  const actual = await import("../../lib/auth/AuthContext");
  return {
    ...actual,
    useAuth: () => ({
      user: null,
      login: mockLogin,
      logout: vi.fn(),
      isLoading: false,
    }),
  };
});

function renderLoginPage() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </BrowserRouter>
  );
}

describe("LoginPage", () => {
  it("renders login form with email and password fields", () => {
    renderLoginPage();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("calls login with credentials on submit", async () => {
    renderLoginPage();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("toggles password visibility", () => {
    renderLoginPage();
    const passwordInput = screen.getByLabelText(/^password$/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleButton = screen.getByRole("button", { name: /show password/i });
    fireEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "text");
  });
});
