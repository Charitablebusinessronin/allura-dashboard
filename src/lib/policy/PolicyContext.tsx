import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Policy, PolicyCheck, PolicyViolation, PolicyStatus } from "./types";

interface PolicyState {
  policies: Policy[];
  checks: PolicyCheck[];
  violations: PolicyViolation[];
}

interface PolicyContextType extends PolicyState {
  addPolicy: (policy: Omit<Policy, "id" | "createdAt" | "updatedAt" | "enforcementCount" | "violationCount">) => void;
  updatePolicy: (id: string, updates: Partial<Policy>) => void;
  deletePolicy: (id: string) => void;
  togglePolicyStatus: (id: string) => void;
  runPolicyCheck: (policyId: string) => PolicyCheck;
  resolveViolation: (violationId: string) => void;
  getPolicyById: (id: string) => Policy | undefined;
  getActivePolicies: () => Policy[];
  getViolationsByPolicy: (policyId: string) => PolicyViolation[];
}

const PolicyContext = createContext<PolicyContextType | null>(null);

const initialPolicies: Policy[] = [
  {
    id: "pol-001",
    name: "Memory Retention Policy",
    description: "Controls how long memories are kept before archival or deletion",
    scope: "memory",
    status: "active",
    rules: [
      {
        id: "rule-001",
        name: "Auto-archive old memories",
        description: "Memories older than 90 days without access are archived",
        condition: "memory.lastAccessed > 90days AND memory.accessCount < 3",
        action: "flag",
        severity: "warning",
      },
      {
        id: "rule-002",
        name: "Delete stale ephemeral memories",
        description: "Ephemeral memories older than 7 days are deleted",
        condition: "memory.type == 'ephemeral' AND memory.age > 7days",
        action: "deny",
        severity: "info",
      },
    ],
    createdAt: "2026-05-01T10:00:00Z",
    updatedAt: "2026-06-01T14:30:00Z",
    createdBy: "Allura Admin",
    enforcementCount: 1247,
    violationCount: 3,
  },
  {
    id: "pol-002",
    name: "Agent Access Control",
    description: "Defines which agents can access which memory scopes",
    scope: "agent",
    status: "active",
    rules: [
      {
        id: "rule-003",
        name: "Restrict sensitive memory access",
        description: "Only governance-tier agents can access sensitive memories",
        condition: "memory.classification == 'sensitive' AND agent.tier < 'governance'",
        action: "deny",
        severity: "critical",
      },
    ],
    createdAt: "2026-05-15T08:00:00Z",
    updatedAt: "2026-05-20T16:45:00Z",
    createdBy: "Allura Admin",
    enforcementCount: 892,
    violationCount: 0,
  },
  {
    id: "pol-003",
    name: "Conversation Privacy Guard",
    description: "Ensures private conversations are not exposed to team agents",
    scope: "conversation",
    status: "draft",
    rules: [
      {
        id: "rule-004",
        name: "Block private conversation sharing",
        description: "Private conversations cannot be shared with team context",
        condition: "conversation.privacy == 'private' AND context.type == 'team'",
        action: "deny",
        severity: "critical",
      },
    ],
    createdAt: "2026-06-01T09:00:00Z",
    updatedAt: "2026-06-01T09:00:00Z",
    createdBy: "Allura Admin",
    enforcementCount: 0,
    violationCount: 0,
  },
];

const initialChecks: PolicyCheck[] = [
  {
    id: "check-001",
    policyId: "pol-001",
    policyName: "Memory Retention Policy",
    scope: "All Systems",
    status: "passed",
    timestamp: "10 min ago",
    details: "1,247 memories checked, 3 flagged for archival",
  },
  {
    id: "check-002",
    policyId: "pol-002",
    policyName: "Agent Access Control",
    scope: "Governance",
    status: "passed",
    timestamp: "1 hour ago",
    details: "892 access attempts validated, 0 violations",
  },
  {
    id: "check-003",
    policyId: "pol-001",
    policyName: "Memory Retention Policy",
    scope: "Episodic Memory",
    status: "warning",
    timestamp: "2 hours ago",
    details: "47 memories exceed retention threshold",
  },
];

const initialViolations: PolicyViolation[] = [
  {
    id: "viol-001",
    policyId: "pol-001",
    policyName: "Memory Retention Policy",
    ruleId: "rule-001",
    severity: "warning",
    message: "Memory 'session-2026-03-15' has not been accessed in 94 days",
    timestamp: "2026-06-04T12:00:00Z",
    resolved: false,
  },
  {
    id: "viol-002",
    policyId: "pol-001",
    policyName: "Memory Retention Policy",
    ruleId: "rule-001",
    severity: "warning",
    message: "Memory 'agent-contract-v2' has not been accessed in 112 days",
    timestamp: "2026-06-03T10:30:00Z",
    resolved: true,
    resolvedAt: "2026-06-04T08:00:00Z",
  },
  {
    id: "viol-003",
    policyId: "pol-001",
    policyName: "Memory Retention Policy",
    ruleId: "rule-002",
    severity: "info",
    message: "Ephemeral memory 'temp-calc-42' expired after 8 days",
    timestamp: "2026-06-02T16:00:00Z",
    resolved: false,
  },
];

export function PolicyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PolicyState>({
    policies: initialPolicies,
    checks: initialChecks,
    violations: initialViolations,
  });

  const addPolicy = useCallback((policy: Omit<Policy, "id" | "createdAt" | "updatedAt" | "enforcementCount" | "violationCount">) => {
    const now = new Date().toISOString();
    const newPolicy: Policy = {
      ...policy,
      id: `pol-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      enforcementCount: 0,
      violationCount: 0,
    };
    setState(prev => ({
      ...prev,
      policies: [...prev.policies, newPolicy],
    }));
  }, []);

  const updatePolicy = useCallback((id: string, updates: Partial<Policy>) => {
    setState(prev => ({
      ...prev,
      policies: prev.policies.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    }));
  }, []);

  const deletePolicy = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      policies: prev.policies.filter(p => p.id !== id),
      violations: prev.violations.filter(v => v.policyId !== id),
      checks: prev.checks.filter(c => c.policyId !== id),
    }));
  }, []);

  const togglePolicyStatus = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      policies: prev.policies.map(p => {
        if (p.id !== id) return p;
        const nextStatus: PolicyStatus = p.status === "active" ? "draft" : "active";
        return { ...p, status: nextStatus, updatedAt: new Date().toISOString() };
      }),
    }));
  }, []);

  const runPolicyCheck = useCallback((policyId: string): PolicyCheck => {
    const policy = state.policies.find(p => p.id === policyId);
    if (!policy) throw new Error(`Policy ${policyId} not found`);

    // Simulate check
    const hasViolations = state.violations.some(v => v.policyId === policyId && !v.resolved);
    const check: PolicyCheck = {
      id: `check-${Date.now()}`,
      policyId,
      policyName: policy.name,
      scope: policy.scope,
      status: hasViolations ? "warning" : "passed",
      timestamp: "Just now",
      details: hasViolations ? `${state.violations.filter(v => v.policyId === policyId && !v.resolved).length} unresolved violations` : "All checks passed",
    };

    setState(prev => ({
      ...prev,
      checks: [check, ...prev.checks],
      policies: prev.policies.map(p =>
        p.id === policyId ? { ...p, enforcementCount: p.enforcementCount + 1 } : p
      ),
    }));

    return check;
  }, [state.policies, state.violations]);

  const resolveViolation = useCallback((violationId: string) => {
    setState(prev => ({
      ...prev,
      violations: prev.violations.map(v =>
        v.id === violationId
          ? { ...v, resolved: true, resolvedAt: new Date().toISOString() }
          : v
      ),
    }));
  }, []);

  const getPolicyById = useCallback((id: string) => {
    return state.policies.find(p => p.id === id);
  }, [state.policies]);

  const getActivePolicies = useCallback(() => {
    return state.policies.filter(p => p.status === "active");
  }, [state.policies]);

  const getViolationsByPolicy = useCallback((policyId: string) => {
    return state.violations.filter(v => v.policyId === policyId);
  }, [state.violations]);

  return (
    <PolicyContext.Provider
      value={{
        ...state,
        addPolicy,
        updatePolicy,
        deletePolicy,
        togglePolicyStatus,
        runPolicyCheck,
        resolveViolation,
        getPolicyById,
        getActivePolicies,
        getViolationsByPolicy,
      }}
    >
      {children}
    </PolicyContext.Provider>
  );
}

export function usePolicies() {
  const context = useContext(PolicyContext);
  if (!context) {
    throw new Error("usePolicies must be used within a PolicyProvider");
  }
  return context;
}
