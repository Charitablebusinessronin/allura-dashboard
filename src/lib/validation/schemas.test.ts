import { describe, it, expect } from "vitest";
import { policySchema, loginSchema } from "./schemas";

describe("policySchema", () => {
  it("validates a valid policy", () => {
    const result = policySchema.safeParse({
      name: "Test Policy",
      description: "A test policy",
      scope: "memory",
      status: "active",
      rules: [
        {
          id: "rule-1",
          name: "Test Rule",
          description: "A test rule",
          condition: "memory.age > 30",
          action: "flag",
          severity: "warning",
        },
      ],
      createdBy: "admin",
    });
    expect(result.success).toBe(true);
  });

  it("fails when name is empty", () => {
    const result = policySchema.safeParse({
      name: "",
      scope: "memory",
      status: "active",
      rules: [],
      createdBy: "admin",
    });
    expect(result.success).toBe(false);
  });

  it("fails when no rules provided", () => {
    const result = policySchema.safeParse({
      name: "Test Policy",
      scope: "memory",
      status: "active",
      rules: [],
      createdBy: "admin",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("validates a valid login", () => {
    const result = loginSchema.safeParse({
      email: "admin@allura.ai",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("fails with invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });
});
