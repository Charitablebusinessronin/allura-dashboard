export type PolicySeverity = "info" | "warning" | "critical";
export type PolicyStatus = "active" | "draft" | "archived";
export type PolicyScope = "global" | "agent" | "memory" | "conversation" | "team";

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  condition: string; // e.g., "memory.age > 30days"
  action: "allow" | "deny" | "flag" | "escalate";
  severity: PolicySeverity;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  scope: PolicyScope;
  status: PolicyStatus;
  rules: PolicyRule[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  enforcementCount: number;
  violationCount: number;
}

export interface PolicyCheck {
  id: string;
  policyId: string;
  policyName: string;
  scope: string;
  status: "passed" | "warning" | "violation";
  timestamp: string;
  details?: string;
}

export interface PolicyViolation {
  id: string;
  policyId: string;
  policyName: string;
  ruleId: string;
  severity: PolicySeverity;
  message: string;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
}
