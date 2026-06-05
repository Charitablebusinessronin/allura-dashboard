import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useNavigate } from "react-router";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

function ErrorFallback({ error, onReset }: { error: Error; onReset: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="size-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="size-8 text-destructive" />
        </div>

        <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          An unexpected error occurred. We've logged this for review.
        </p>

        <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left">
          <code className="text-xs text-destructive break-all">{error.message}</code>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="size-4" />
            Try Again
          </button>
          <button
            onClick={() => navigate("/dreams")}
            className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl hover:bg-accent transition-colors"
          >
            <Home className="size-4" />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}
