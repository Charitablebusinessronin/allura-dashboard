import * as Icons from "lucide-react";

export function ActionCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  const iconName = icon
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (Icons as any)[iconName] || Icons.Box;

  return (
    <button className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary hover:shadow-md transition-all group">
      <div className="flex items-start gap-3">
        <div className="size-11 rounded-xl bg-[#E8F0FE] flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
          <Icon className="size-5 text-[#0C56EB] group-hover:text-white transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold mb-1 text-sm">{title}</div>
          <div className="text-xs text-muted-foreground leading-relaxed">{description}</div>
        </div>
      </div>
    </button>
  );
}
