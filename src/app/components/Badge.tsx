export function Badge({
  children,
  variant = "blue",
}: {
  children: React.ReactNode;
  variant?: "blue" | "teal" | "coral" | "purple" | "gray" | "green" | "yellow";
}) {
  const variants = {
    blue: "bg-primary/10 text-primary",
    teal: "bg-allura-green/10 text-allura-green",
    coral: "bg-allura-orange/10 text-allura-orange",
    purple: "bg-purple-500/10 text-purple-600",
    gray: "bg-muted text-muted-foreground",
    green: "bg-allura-green/10 text-allura-green",
    yellow: "bg-yellow-500/10 text-yellow-600",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
