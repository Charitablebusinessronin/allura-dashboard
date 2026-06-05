import { Loader2 } from "lucide-react";

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "size-4",
    md: "size-8",
    lg: "size-12",
  };

  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
      <div className="h-4 w-96 bg-muted rounded-lg animate-pulse" />
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="h-64 bg-muted rounded-xl animate-pulse" />
    </div>
  );
}
