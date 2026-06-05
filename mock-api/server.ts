#!/usr/bin/env bun
/**
 * Allura Dashboard Mock API Server
 * Serves realistic data for all dashboard endpoints.
 * Run: bun run mock-api/server.ts
 */

import { serve } from "bun";

const PORT = process.env.MOCK_API_PORT || 13400;

// ─── In-Memory Data Stores ───────────────────────────────────────

const users = [
  { id: "u1", email: "admin@allura.ai", name: "Admin User", password: "admin123" },
];

const teams: any[] = [
  { id: "t1", name: "Core Team", description: "Main development team", members: ["u1"], createdAt: new Date().toISOString() },
  { id: "t2", name: "QA Squad", description: "Quality assurance", members: ["u1"], createdAt: new Date().toISOString() },
];

const kanbanTasks: any[] = [
  { id: "k1", title: "Design system tokens", description: "Define color and spacing tokens", column: "completed", priority: "high", assignee: "u1", tags: ["design"], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "k2", title: "Auth integration", description: "Wire up login/logout flows", column: "in-progress", priority: "high", assignee: "u1", tags: ["backend"], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "k3", title: "Policy engine", description: "Build rule evaluation system", column: "review", priority: "medium", assignee: "u1", tags: ["governance"], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "k4", title: "Docker deployment", description: "Containerize all services", column: "todo", priority: "medium", assignee: "u1", tags: ["ops"], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "k5", title: "Memory search", description: "Implement semantic memory queries", column: "in-progress", priority: "low", assignee: "u1", tags: ["ai"], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const dreams: any[] = [
  { id: "d1", prompt: "Analyze memory patterns for Q2", response: "Found 3 recurring themes...", status: "completed", scope: "memory", type: "analysis", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "d2", prompt: "Generate sprint report", response: null, status: "running", scope: "reporting", type: "generation", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "d3", prompt: "Audit agent decisions", response: null, status: "pending", scope: "governance", type: "audit", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const policies: any[] = [
  { id: "p1", name: "Data Retention Policy", description: "Auto-archive memories older than 90 days", scope: "global", status: "active", severity: "high", rules: [{ field: "age", operator: ">", value: "90d", action: "archive" }], enforcementCount: 12, violationCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "p2", name: "Access Control Policy", description: "Restrict sensitive endpoints to admin role", scope: "team", status: "active", severity: "critical", rules: [{ field: "role", operator: "!=", value: "admin", action: "deny" }], enforcementCount: 45, violationCount: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "p3", name: "Rate Limiting", description: "Max 100 requests per minute per user", scope: "user", status: "draft", severity: "medium", rules: [{ field: "requests", operator: ">", value: "100", action: "throttle" }], enforcementCount: 0, violationCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const violations: any[] = [
  { id: "v1", policyId: "p2", taskId: "k2", message: "Non-admin attempted admin endpoint", severity: "critical", status: "open", createdAt: new Date().toISOString() },
  { id: "v2", policyId: "p2", taskId: "k3", message: "Missing MFA on sensitive operation", severity: "high", status: "resolved", createdAt: new Date().toISOString() },
];

let authTokens: Record<string, string> = {}; // token -> userId

// ─── Helpers ─────────────────────────────────────────────────────

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" },
  });
}

function error(message: string, status = 400) {
  return json({ error: message, status }, status);
}

function getAuthUser(req: Request) {
  const auth = req.headers.get("Authorization") || "";
  const token = auth.replace("Bearer ", "");
  const userId = authTokens[token];
  return users.find((u) => u.id === userId);
}

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

// ─── Router ──────────────────────────────────────────────────────

const server = serve({
  port: Number(PORT),
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    // CORS preflight
    if (method === "OPTIONS") return json({}, 204);

    // ─── Auth ──────────────────────────────────────────────────────
    if (path === "/api/auth/login" && method === "POST") {
      const body = await req.json();
      const user = users.find((u) => u.email === body.email && u.password === body.password);
      if (!user) return error("Invalid credentials", 401);
      const token = `tok_${generateId()}`;
      authTokens[token] = user.id;
      return json({ token, user: { id: user.id, email: user.email, name: user.name } });
    }

    if (path === "/api/auth/logout" && method === "POST") {
      const auth = req.headers.get("Authorization") || "";
      delete authTokens[auth.replace("Bearer ", "")];
      return json({ success: true });
    }

    if (path === "/api/auth/me" && method === "GET") {
      const user = getAuthUser(req);
      if (!user) return error("Unauthorized", 401);
      return json({ id: user.id, email: user.email, name: user.name });
    }

    // ─── Teams ─────────────────────────────────────────────────────
    if (path === "/api/teams" && method === "GET") return json(teams);
    if (path === "/api/teams" && method === "POST") {
      const body = await req.json();
      const team = { id: `t${generateId()}`, ...body, createdAt: new Date().toISOString() };
      teams.push(team);
      return json(team, 201);
    }
    if (path.startsWith("/api/teams/") && method === "GET") {
      const id = path.split("/")[3];
      const team = teams.find((t) => t.id === id);
      if (!team) return error("Team not found", 404);
      return json(team);
    }
    if (path.startsWith("/api/teams/") && method === "PATCH") {
      const id = path.split("/")[3];
      const body = await req.json();
      const idx = teams.findIndex((t) => t.id === id);
      if (idx === -1) return error("Team not found", 404);
      teams[idx] = { ...teams[idx], ...body };
      return json(teams[idx]);
    }
    if (path.startsWith("/api/teams/") && method === "DELETE") {
      const id = path.split("/")[3];
      const idx = teams.findIndex((t) => t.id === id);
      if (idx === -1) return error("Team not found", 404);
      teams.splice(idx, 1);
      return json({ success: true });
    }

    // ─── Kanban ────────────────────────────────────────────────────
    if (path === "/api/kanban/tasks" && method === "GET") return json(kanbanTasks);
    if (path === "/api/kanban/tasks" && method === "POST") {
      const body = await req.json();
      const task = { id: `k${generateId()}`, ...body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      kanbanTasks.push(task);
      return json(task, 201);
    }
    if (path.startsWith("/api/kanban/tasks/") && method === "GET") {
      const id = path.split("/")[4];
      const task = kanbanTasks.find((t) => t.id === id);
      if (!task) return error("Task not found", 404);
      return json(task);
    }
    if (path.startsWith("/api/kanban/tasks/") && method === "PATCH") {
      const id = path.split("/")[4];
      const body = await req.json();
      const idx = kanbanTasks.findIndex((t) => t.id === id);
      if (idx === -1) return error("Task not found", 404);
      kanbanTasks[idx] = { ...kanbanTasks[idx], ...body, updatedAt: new Date().toISOString() };
      return json(kanbanTasks[idx]);
    }
    if (path.startsWith("/api/kanban/tasks/") && method === "DELETE") {
      const id = path.split("/")[4];
      const idx = kanbanTasks.findIndex((t) => t.id === id);
      if (idx === -1) return error("Task not found", 404);
      kanbanTasks.splice(idx, 1);
      return json({ success: true });
    }

    // ─── Dreams ────────────────────────────────────────────────────
    if (path === "/api/dreams" && method === "GET") return json(dreams);
    if (path === "/api/dreams" && method === "POST") {
      const body = await req.json();
      const dream = { id: `d${generateId()}`, ...body, status: "pending", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      dreams.push(dream);
      return json(dream, 201);
    }
    if (path.startsWith("/api/dreams/") && method === "GET") {
      const id = path.split("/")[3];
      const dream = dreams.find((d) => d.id === id);
      if (!dream) return error("Dream not found", 404);
      return json(dream);
    }

    // ─── Policies ──────────────────────────────────────────────────
    if (path === "/api/policies" && method === "GET") return json(policies);
    if (path === "/api/policies" && method === "POST") {
      const body = await req.json();
      const policy = { id: `p${generateId()}`, ...body, enforcementCount: 0, violationCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      policies.push(policy);
      return json(policy, 201);
    }
    if (path.startsWith("/api/policies/") && method === "GET" && !path.includes("/violations") && !path.includes("/check")) {
      const id = path.split("/")[3];
      const policy = policies.find((p) => p.id === id);
      if (!policy) return error("Policy not found", 404);
      return json(policy);
    }
    if (path.startsWith("/api/policies/") && method === "PATCH") {
      const id = path.split("/")[3];
      const body = await req.json();
      const idx = policies.findIndex((p) => p.id === id);
      if (idx === -1) return error("Policy not found", 404);
      policies[idx] = { ...policies[idx], ...body, updatedAt: new Date().toISOString() };
      return json(policies[idx]);
    }
    if (path.startsWith("/api/policies/") && method === "DELETE") {
      const id = path.split("/")[3];
      const idx = policies.findIndex((p) => p.id === id);
      if (idx === -1) return error("Policy not found", 404);
      policies.splice(idx, 1);
      return json({ success: true });
    }
    if (path.endsWith("/check") && method === "POST") {
      const id = path.split("/")[3];
      const policy = policies.find((p) => p.id === id);
      if (!policy) return error("Policy not found", 404);
      return json({ id: `c${generateId()}`, policyId: id, passed: Math.random() > 0.2, checkedAt: new Date().toISOString(), details: [] });
    }
    if (path.endsWith("/violations") && method === "GET") {
      const id = path.split("/")[3];
      return json(violations.filter((v) => v.policyId === id));
    }

    // ─── Health ────────────────────────────────────────────────────
    if (path === "/health" && method === "GET") return json({ status: "ok", timestamp: new Date().toISOString() });

    return error(`Not found: ${method} ${path}`, 404);
  },
});

console.log(`🚀 Allura Mock API running at http://localhost:${PORT}`);
console.log(`   Endpoints: /api/auth/*, /api/teams, /api/kanban/tasks, /api/dreams, /api/policies`);
