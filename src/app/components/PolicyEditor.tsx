import { useState } from "react";
import { X, Plus, Trash2, Shield, AlertTriangle, Info } from "lucide-react";
import { z } from "zod";
import type { Policy, PolicyRule, PolicyScope, PolicySeverity } from "../../lib/policy/types";

const policyRuleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Rule name is required").max(100),
  description: z.string().max(500).optional(),
  condition: z.string().min(1, "Condition is required").max(500),
  action: z.enum(["allow", "deny", "flag", "escalate"]),
  severity: z.enum(["info", "warning", "critical"]),
});

const policySchema = z.object({
  name: z.string().min(1, "Policy name is required").max(100),
  description: z.string().max(500).optional(),
  scope: z.enum(["global", "agent", "memory", "conversation", "team"]),
  status: z.enum(["active", "draft", "archived"]),
  rules: z.array(policyRuleSchema).min(1, "At least one rule is required"),
  createdBy: z.string().min(1),
});

interface PolicyEditorProps {
  policy?: Policy;
  onSave: (policy: Omit<Policy, "id" | "createdAt" | "updatedAt" | "enforcementCount" | "violationCount">) => void;
  onCancel: () => void;
}

const SCOPE_OPTIONS: { value: PolicyScope; label: string }[] = [
  { value: "global", label: "Global" },
  { value: "agent", label: "Agent" },
  { value: "memory", label: "Memory" },
  { value: "conversation", label: "Conversation" },
  { value: "team", label: "Team" },
];

const SEVERITY_OPTIONS: { value: PolicySeverity; label: string; color: "blue" | "yellow" | "coral" }[] = [
  { value: "info", label: "Info", color: "blue" },
  { value: "warning", label: "Warning", color: "yellow" },
  { value: "critical", label: "Critical", color: "coral" },
];

const ACTION_OPTIONS = ["allow", "deny", "flag", "escalate"] as const;

export function PolicyEditor({ policy, onSave, onCancel }: PolicyEditorProps) {
  const [name, setName] = useState(policy?.name ?? "");
  const [description, setDescription] = useState(policy?.description ?? "");
  const [scope, setScope] = useState<PolicyScope>(policy?.scope ?? "global");
  const [rules, setRules] = useState<PolicyRule[]>(policy?.rules ?? []);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addRule = () => {
    const newRule: PolicyRule = {
      id: `rule-${Date.now()}`,
      name: "",
      description: "",
      condition: "",
      action: "flag",
      severity: "warning",
    };
    setRules([...rules, newRule]);
  };

  const updateRule = (index: number, updates: Partial<PolicyRule>) => {
    setRules(rules.map((r, i) => (i === index ? { ...r, ...updates } : r)));
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const result = policySchema.safeParse({
      name: name.trim(),
      description: description.trim(),
      scope,
      status: policy?.status ?? "draft",
      rules,
      createdBy: policy?.createdBy ?? "Allura Admin",
    });

    if (result.success) {
      setErrors({});
      return true;
    }

    const newErrors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      newErrors[path] = issue.message;
    });
    setErrors(newErrors);
    return false;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      scope,
      status: policy?.status ?? "draft",
      rules,
      createdBy: policy?.createdBy ?? "Allura Admin",
    });
  };

  const isValid = name.trim() && rules.every(r => r.name.trim() && r.condition.trim());

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{policy ? "Edit Policy" : "New Policy"}</h2>
              <p className="text-sm text-muted-foreground">Define rules and enforcement actions</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-accent rounded-lg transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Policy Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Memory Retention Policy"
                className={`w-full px-4 py-2.5 bg-muted/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.name ? "border-destructive" : "border-border"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this policy control?"
                rows={2}
                className={`w-full px-4 py-2.5 bg-muted/50 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.description ? "border-destructive" : "border-border"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-destructive">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Scope</label>
              <div className="flex gap-2">
                {SCOPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setScope(opt.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      scope === opt.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-accent"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rules */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium">Rules</label>
              <button
                onClick={addRule}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="size-4" />
                Add Rule
              </button>
            </div>

            <div className="space-y-3">
              {rules.map((rule, idx) => (
                <div key={rule.id} className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Rule {idx + 1}</span>
                    <button
                      onClick={() => removeRule(idx)}
                      className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        value={rule.name}
                        onChange={(e) => updateRule(idx, { name: e.target.value })}
                        placeholder="Rule name"
                        className={`w-full px-3 py-2 bg-card border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                          errors[`rules.${idx}.name`] ? "border-destructive" : "border-border"
                        }`}
                      />
                      {errors[`rules.${idx}.name`] && (
                        <p className="mt-1 text-xs text-destructive">{errors[`rules.${idx}.name`]}</p>
                      )}
                    </div>
                    <select
                      value={rule.action}
                      onChange={(e) => updateRule(idx, { action: e.target.value as PolicyRule["action"] })}
                      className="px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {ACTION_OPTIONS.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>

                  <input
                    type="text"
                    value={rule.description}
                    onChange={(e) => updateRule(idx, { description: e.target.value })}
                    placeholder="Description"
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />

                  <div>
                    <input
                      type="text"
                      value={rule.condition}
                      onChange={(e) => updateRule(idx, { condition: e.target.value })}
                      placeholder="Condition: e.g., memory.age > 30days"
                      className={`w-full px-3 py-2 bg-card border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring ${
                        errors[`rules.${idx}.condition`] ? "border-destructive" : "border-border"
                      }`}
                    />
                    {errors[`rules.${idx}.condition`] && (
                      <p className="mt-1 text-xs text-destructive">{errors[`rules.${idx}.condition`]}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {SEVERITY_OPTIONS.map((sev) => (
                      <button
                        key={sev.value}
                        onClick={() => updateRule(idx, { severity: sev.value })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          rule.severity === sev.value
                            ? sev.value === "info"
                              ? "bg-blue-100 text-blue-700"
                              : sev.value === "warning"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                            : "bg-muted hover:bg-accent"
                        }`}
                      >
                        {sev.value === "info" && <Info className="size-3 inline mr-1" />}
                        {sev.value === "warning" && <AlertTriangle className="size-3 inline mr-1" />}
                        {sev.value === "critical" && <Shield className="size-3 inline mr-1" />}
                        {sev.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {rules.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No rules yet. Click "Add Rule" to define enforcement logic.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-medium hover:bg-accent rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className="px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {policy ? "Save Changes" : "Create Policy"}
          </button>
        </div>
      </div>
    </div>
  );
}
