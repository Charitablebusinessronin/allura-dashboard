import { api } from "./client";
import type { Policy, PolicyCheck, PolicyViolation } from "../policy/types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  members: string[];
  createdAt: string;
}

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  column: "todo" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high";
  assignee?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Dream {
  id: string;
  prompt: string;
  response?: string;
  status: "pending" | "running" | "completed" | "failed";
  scope: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export const alluraApi = {
  // Auth
  auth: {
    login: (req: LoginRequest) => api.post<LoginResponse>("/api/auth/login", req),
    logout: () => api.post<void>("/api/auth/logout", {}),
    me: () => api.get<LoginResponse["user"]>("/api/auth/me"),
  },

  // Teams
  teams: {
    list: () => api.get<Team[]>("/api/teams"),
    get: (id: string) => api.get<Team>(`/api/teams/${id}`),
    create: (team: Omit<Team, "id" | "createdAt">) => api.post<Team>("/api/teams", team),
    update: (id: string, team: Partial<Team>) => api.patch<Team>(`/api/teams/${id}`, team),
    delete: (id: string) => api.delete<void>(`/api/teams/${id}`),
  },

  // Kanban
  kanban: {
    list: () => api.get<KanbanTask[]>("/api/kanban/tasks"),
    create: (task: Omit<KanbanTask, "id" | "createdAt" | "updatedAt">) =>
      api.post<KanbanTask>("/api/kanban/tasks", task),
    update: (id: string, task: Partial<KanbanTask>) =>
      api.patch<KanbanTask>(`/api/kanban/tasks/${id}`, task),
    move: (id: string, column: KanbanTask["column"]) =>
      api.patch<KanbanTask>(`/api/kanban/tasks/${id}/move`, { column }),
    delete: (id: string) => api.delete<void>(`/api/kanban/tasks/${id}`),
  },

  // Dreams
  dreams: {
    list: () => api.get<Dream[]>("/api/dreams"),
    create: (dream: { prompt: string; scope: string; type: string }) =>
      api.post<Dream>("/api/dreams", dream),
    get: (id: string) => api.get<Dream>(`/api/dreams/${id}`),
  },

  // Policies
  policies: {
    list: () => api.get<Policy[]>("/api/policies"),
    get: (id: string) => api.get<Policy>(`/api/policies/${id}`),
    create: (policy: Omit<Policy, "id" | "createdAt" | "updatedAt" | "enforcementCount" | "violationCount">) =>
      api.post<Policy>("/api/policies", policy),
    update: (id: string, policy: Partial<Policy>) =>
      api.patch<Policy>(`/api/policies/${id}`, policy),
    delete: (id: string) => api.delete<void>(`/api/policies/${id}`),
    check: (id: string) => api.post<PolicyCheck>(`/api/policies/${id}/check`, {}),
    violations: (id: string) => api.get<PolicyViolation[]>(`/api/policies/${id}/violations`),
  },
};
