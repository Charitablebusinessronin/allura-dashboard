import { useNavigate } from "react-router";
import { Home, ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl font-bold text-muted/30 mb-4">404</div>
        <h1 className="text-2xl font-semibold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl hover:bg-accent transition-colors"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>
          <button
            onClick={() => navigate("/dreams")}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
          >
            <Home className="size-4" />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
