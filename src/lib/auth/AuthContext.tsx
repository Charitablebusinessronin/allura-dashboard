import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "allura_auth";

function loadAuthState(): AuthState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        user: parsed.user ?? null,
        token: parsed.token ?? null,
        isLoading: false,
      };
    }
  } catch {
    // Invalid stored data
  }
  return { user: null, token: null, isLoading: false };
}

function saveAuthState(state: AuthState) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ user: state.user, token: state.token })
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadAuthState);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      // TODO: Replace with real API call
      // const response = await alluraApi.auth.login({ email, password });
      // Mock login for now
      if (email === "admin@allura.ai" && password === "admin") {
        const user = { id: "1", email, name: "Allura Admin" };
        const token = "mock-token-" + Date.now();
        const newState = { user, token, isLoading: false };
        setState(newState);
        saveAuthState(newState);
        return true;
      }
      setState((prev) => ({ ...prev, isLoading: false }));
      return false;
    } catch {
      setState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    const newState = { user: null, token: null, isLoading: false };
    setState(newState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isAuthenticated = !!state.token && !!state.user;

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
