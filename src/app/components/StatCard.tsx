export function StatCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-sm text-muted-foreground mb-2">{label}</div>
      <div className="text-3xl font-semibold mb-1">{value}</div>
      {delta && <div className="text-xs text-muted-foreground">{delta}</div>}
    </div>
  );
}
