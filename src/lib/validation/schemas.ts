import { z } from "zod";

export const policyRuleSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Rule name is required").max(100),
  description: z.string().max(500).optional(),
  condition: z.string().min(1, "Condition is required").max(500),
  action: z.enum(["allow", "deny", "flag", "escalate"]),
  severity: z.enum(["info", "warning", "critical"]),
});

export const policySchema = z.object({
  name: z.string().min(1, "Policy name is required").max(100),
  description: z.string().max(500).optional(),
  scope: z.enum(["global", "agent", "memory", "conversation", "team"]),
  status: z.enum(["active", "draft", "archived"]),
  rules: z.array(policyRuleSchema).min(1, "At least one rule is required"),
  createdBy: z.string().min(1),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type PolicyRuleInput = z.infer<typeof policyRuleSchema>;
export type PolicyInput = z.infer<typeof policySchema>;
export type LoginInput = z.infer<typeof loginSchema>;
