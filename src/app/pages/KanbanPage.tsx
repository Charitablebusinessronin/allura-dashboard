import { ChevronDown, Search, LayoutGrid, List, BarChart3, AlertTriangle } from "lucide-react";
import { Badge } from "../components/Badge";
import { PageSkeleton } from "../components/LoadingSpinner";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { useKanbanTasks } from "../../lib/hooks/useKanban";

export function KanbanPage() {
  const { data: kanbanData, isLoading, isError, error, refetch } = useKanbanTasks();

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (isError) {
    return (
      <ErrorDisplay
        title="Failed to load kanban tasks"
        message={error?.message || "An error occurred while fetching tasks"}
        onRetry={() => refetch()}
      />
    );
  }

  const columns = kanbanData?.columns ?? {};
  const stats = kanbanData?.stats ?? { total: 0, inProgress: 0, inReview: 0, completed: 0, overdue: 0 };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Kanban Board</h1>
        <p className="text-muted-foreground">
          Organize and track tasks across your workflow
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl bg-card cursor-pointer hover:border-primary transition-colors">
          <span className="text-sm font-medium">All Projects</span>
          <ChevronDown className="size-4" />
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl bg-card cursor-pointer hover:border-primary transition-colors">
          <span className="text-sm font-medium">All Assignees</span>
          <ChevronDown className="size-4" />
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl bg-card cursor-pointer hover:border-primary transition-colors">
          <span className="text-sm font-medium">All Priorities</span>
          <ChevronDown className="size-4" />
        </div>
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl bg-card">
          <Search className="size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="flex-1 outline-none text-sm bg-transparent"
          />
        </div>
        <div className="flex items-center gap-1 border border-border rounded-xl p-1">
          <button className="p-2 rounded-lg bg-primary text-primary-foreground">
            <LayoutGrid className="size-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-accent transition-colors">
            <List className="size-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-accent transition-colors">
            <BarChart3 className="size-4" />
          </button>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {Object.entries(columns).map(([column, tasks]) => (
          <div key={column} className="bg-muted/40 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{column}</h3>
              <span className="text-xs font-semibold text-muted-foreground bg-card px-2.5 py-1 rounded-full border border-border">
                {tasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {tasks.map((task, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="font-semibold text-sm mb-2">{task.title}</div>
                  <div className="text-xs text-muted-foreground mb-3">{task.scope}</div>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        task.type === "Analysis"
                          ? "blue"
                          : task.type === "Policy"
                          ? "purple"
                          : task.type === "Optimization"
                          ? "teal"
                          : task.type === "Review"
                          ? "coral"
                          : "gray"
                      }
                    >
                      {task.type}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-medium">{task.date}</span>
                      {task.risk && (
                        <AlertTriangle
                          className={`size-3.5 ${
                            task.risk === "high"
                              ? "text-[#FB5D0F]"
                              : task.risk === "medium"
                              ? "text-[#F59E0B]"
                              : "text-gray-400"
                          }`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-5 gap-6">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Total Tasks</div>
            <div className="text-2xl font-semibold">{stats.total}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">In Progress</div>
            <div className="text-2xl font-semibold text-[#0C56EB]">{stats.inProgress}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">In Review</div>
            <div className="text-2xl font-semibold text-[#8B5CF6]">{stats.inReview}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Completed</div>
            <div className="text-2xl font-semibold text-[#0C9154]">{stats.completed}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Overdue</div>
            <div className="text-2xl font-semibold text-[#FB5D0F]">{stats.overdue}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
