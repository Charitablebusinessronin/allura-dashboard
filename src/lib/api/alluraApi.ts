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
  scope?: string;
  type?: string;
  date?: string;
  risk?: "low" | "medium" | "high";
}

export interface KanbanData {
  columns: Record<string, KanbanTask[]>;
  stats: {
    total: number;
    inProgress: number;
    inReview: number;
    completed: number;
    overdue: number;
  };
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

export interface DreamsData {
  dreams: Array<{
    dream: string;
    scope: string;
    type: string;
    status: string;
    results: string;
    updated: string;
  }>;
  quickActions: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  insights: Array<{
    label: string;
    value: string;
    delta: string;
  }>;
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
    list: async () => {
      const tasks = await api.get<KanbanTask[]>("/api/kanban/tasks");
      const columns: Record<string, KanbanTask[]> = {
        "To Do": [],
        "In Progress": [],
        "In Review": [],
        "Completed": [],
      };
      tasks.forEach((task) => {
        const colMap: Record<string, string> = {
          todo: "To Do",
          "in-progress": "In Progress",
          review: "In Review",
          completed: "Completed",
        };
        const col = colMap[task.column] || "To Do";
        columns[col].push(task);
      });
      const stats = {
        total: tasks.length,
        inProgress: columns["In Progress"].length,
        inReview: columns["In Review"].length,
        completed: columns["Completed"].length,
        overdue: tasks.filter((t) => t.priority === "high" && t.column !== "completed").length,
      };
      return { columns, stats } as KanbanData;
    },
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
    list: async () => {
      const dreams = await api.get<Dream[]>("/api/dreams");
      return {
        dreams: dreams.map((d) => ({
          dream: d.prompt,
          scope: d.scope,
          type: d.type,
          status: d.status === "completed" ? "Completed" : d.status === "running" ? "In Progress" : "Pending",
          results: d.response ? "View results" : "No results",
          updated: d.updatedAt,
        })),
        quickActions: [
          { title: "Analyze Memory", description: "Deep analysis of memory patterns", icon: "Brain" },
          { title: "Session Report", description: "Generate session insights", icon: "FileText" },
          { title: "Agent Audit", description: "Review agent performance", icon: "Bot" },
          { title: "Policy Check", description: "Validate policy compliance", icon: "Shield" },
          { title: "Trend Forecast", description: "Predict future patterns", icon: "TrendingUp" },
        ],
        insights: [
          { label: "Active Dreams", value: dreams.filter((d) => d.status === "running").length.toString(), delta: "+3 today" },
          { label: "Completed", value: dreams.filter((d) => d.status === "completed").length.toString(), delta: "+12 this week" },
          { label: "Success Rate", value: "94%", delta: "+2%" },
          { label: "Avg Duration", value: "2.4m", delta: "-30s" },
        ],
      } as DreamsData;
    },
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
