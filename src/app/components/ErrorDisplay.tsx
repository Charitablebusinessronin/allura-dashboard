import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ title = "Error", message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="size-12 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="size-6 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity mx-auto"
          >
            <RefreshCw className="size-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
