import { createBrowserRouter, Navigate } from "react-router";
import { AppShell } from "./components/AppShell";
import { DreamsPage } from "./pages/DreamsPage";
import { GovernancePage } from "./pages/GovernancePage";
import { KanbanPage } from "./pages/KanbanPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { useAuth } from "../lib/auth/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dreams" replace /> },
      { path: "dreams", element: <DreamsPage /> },
      { path: "governance", element: <GovernancePage /> },
      { path: "kanban", element: <KanbanPage /> },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
