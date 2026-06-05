import { useState } from "react";
import { Shield, Play, Pencil, Trash2, Power, AlertTriangle, Info } from "lucide-react";
import { Badge } from "./Badge";
import { usePolicies } from "../../lib/policy/PolicyContext";
import { PolicyEditor } from "./PolicyEditor";
import type { Policy } from "../../lib/policy/types";

export function PolicyList() {
  const { policies, togglePolicyStatus, deletePolicy, runPolicyCheck } = usePolicies();
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleRunCheck = (policyId: string) => {
    runPolicyCheck(policyId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Active Policies ({policies.filter(p => p.status === "active").length})</h3>
        <button
          onClick={() => { setEditingPolicy(null); setShowEditor(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Shield className="size-4" />
          New Policy
        </button>
      </div>

      <div className="space-y-3">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className="bg-card border border-border rounded-xl p-5 hover:border-primary hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-xl flex items-center justify-center ${
                  policy.status === "active" ? "bg-primary/10" : "bg-muted"
                }`}>
                  <Shield className={`size-5 ${policy.status === "active" ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{policy.name}</span>
                    <Badge variant={policy.status === "active" ? "green" : "gray"}>
                      {policy.status}
                    </Badge>
                    <Badge variant="blue">{policy.scope}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{policy.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleRunCheck(policy.id)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                  title="Run policy check"
                >
                  <Play className="size-4" />
                </button>
                <button
                  onClick={() => { setEditingPolicy(policy); setShowEditor(true); }}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                  title="Edit policy"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => togglePolicyStatus(policy.id)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                  title={policy.status === "active" ? "Deactivate" : "Activate"}
                >
                  <Power className={`size-4 ${policy.status === "active" ? "text-green-600" : "text-muted-foreground"}`} />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete policy "${policy.name}"?`)) {
                      deletePolicy(policy.id);
                    }
                  }}
                  className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                  title="Delete policy"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>

            {/* Rules summary */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{policy.rules.length} rules</span>
              <span>•</span>
              <span>{policy.enforcementCount.toLocaleString()} checks</span>
              <span>•</span>
              <span className={policy.violationCount > 0 ? "text-coral" : ""}>
                {policy.violationCount} violations
              </span>
            </div>

            {/* Rules preview */}
            <div className="mt-3 space-y-2">
              {policy.rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center gap-3 px-3 py-2 bg-muted/50 rounded-lg text-sm"
                >
                  {rule.severity === "info" && <Info className="size-4 text-blue-500 shrink-0" />}
                  {rule.severity === "warning" && <AlertTriangle className="size-4 text-yellow-500 shrink-0" />}
                  {rule.severity === "critical" && <Shield className="size-4 text-red-500 shrink-0" />}
                  <span className="font-medium">{rule.name}</span>
                  <span className="text-muted-foreground">→ {rule.action}</span>
                  <code className="text-xs bg-card px-2 py-0.5 rounded border border-border">
                    {rule.condition}
                  </code>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showEditor && (
        <PolicyEditor
          policy={editingPolicy ?? undefined}
          onSave={(_policy) => {
            // In a real app, this would call addPolicy or updatePolicy
            setShowEditor(false);
            setEditingPolicy(null);
          }}
          onCancel={() => {
            setShowEditor(false);
            setEditingPolicy(null);
          }}
        />
      )}
    </div>
  );
}
