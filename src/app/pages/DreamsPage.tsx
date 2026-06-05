import { History, Send, ChevronDown } from "lucide-react";
import { ActionCard } from "../components/ActionCard";
import { StatCard } from "../components/StatCard";
import { Badge } from "../components/Badge";
import { recentDreams, quickActions, dreamInsights } from "../../lib/mock-data";

export function DreamsPage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Dreams</h1>
          <p className="text-muted-foreground">
            Allura's background intelligence. Discover. Analyze. Recommend.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl hover:bg-accent hover:border-primary transition-colors">
          <History className="size-4" />
          <span className="text-sm font-medium">Dream History</span>
        </button>
      </div>

      {/* Main Prompt Area */}
      <div className="bg-card border border-border rounded-2xl p-8 mb-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-center">
          What should Allura dream on?
        </h2>
        <div className="space-y-4">
          <textarea
            className="w-full min-h-[120px] px-4 py-3 bg-muted/50 border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Ask Allura to analyze memories, sessions, projects, or agents…"
          />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl bg-card cursor-pointer hover:border-primary transition-colors">
              <span className="text-sm font-medium">Allura Memory</span>
              <ChevronDown className="size-4" />
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl bg-card cursor-pointer hover:border-primary transition-colors">
              <span className="text-sm font-medium">Last 7 days</span>
              <ChevronDown className="size-4" />
            </div>
            <div className="flex-1"></div>
            <button className="size-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm">
              <Send className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-5 gap-4">
          {quickActions.map((action) => (
            <ActionCard key={action.title} {...action} />
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-[1fr_300px] gap-8">
        {/* Recent Dreams Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Dreams</h3>
            <button className="text-sm text-primary hover:underline">View all →</button>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left text-sm font-semibold px-5 py-4">Dream</th>
                  <th className="text-left text-sm font-semibold px-5 py-4">Scope</th>
                  <th className="text-left text-sm font-semibold px-5 py-4">Type</th>
                  <th className="text-left text-sm font-semibold px-5 py-4">Status</th>
                  <th className="text-left text-sm font-semibold px-5 py-4">Results</th>
                  <th className="text-left text-sm font-semibold px-5 py-4">Updated</th>
                </tr>
              </thead>
              <tbody>
                {recentDreams.map((dream, idx) => (
                  <tr key={idx} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium">{dream.dream}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{dream.scope}</td>
                    <td className="px-5 py-4">
                      <Badge variant="blue">{dream.type}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant={
                          dream.status === "Completed"
                            ? "green"
                            : dream.status === "In Progress"
                            ? "blue"
                            : "gray"
                        }
                      >
                        {dream.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium">{dream.results}</td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{dream.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dream Insights Panel */}
        <div>
          <h3 className="font-semibold mb-4">Dream Insights</h3>
          <div className="space-y-3">
            {dreamInsights.map((insight) => (
              <StatCard key={insight.label} {...insight} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
