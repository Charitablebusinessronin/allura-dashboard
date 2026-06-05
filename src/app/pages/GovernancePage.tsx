import { useState } from "react";
import { History, Shield } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { Badge } from "../components/Badge";
import { PolicyList } from "../components/PolicyList";
import { PageSkeleton } from "../components/LoadingSpinner";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { usePolicies } from "../../lib/hooks/usePolicies";

export function GovernancePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: policies, isLoading, isError, error, refetch } = usePolicies();

  const activePolicies = policies?.filter((p) => p.status === "active") ?? [];
  const totalPolicies = policies?.length ?? 0;

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (isError) {
    return (
      <ErrorDisplay
        title="Failed to load policies"
        message={error?.message || "An error occurred while fetching policies"}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Governance</h1>
          <p className="text-muted-foreground">
            Verify. Review. Approve. Full accountability for every memory and action.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl hover:bg-accent hover:border-primary transition-colors">
          <History className="size-4" />
          <span className="text-sm font-medium">Governance History</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <StatCard label="Policies Active" value={activePolicies.length.toString()} delta={`${totalPolicies} total`} />
        <StatCard label="Policy Checks" value="1,284" delta="+156 today" />
        <StatCard label="Violations" value="3" delta="5 total" />
        <StatCard label="Approved Changes" value="89" delta="+12" />
        <StatCard label="Evidence Chains" value="234" delta="+18" />
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-8">
          {["Overview", "Policy Gates", "Evidence Chains", "Access Reviews", "Reports"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase().replace(" ", "-"))}
                className={`pb-4 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab.toLowerCase().replace(" ", "-")
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-[1fr_350px] gap-6">
          <div className="space-y-6">
            {/* Pending Reviews */}
            <div>
              <h3 className="font-semibold mb-4">Pending Reviews</h3>
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left text-sm font-semibold px-5 py-4">Type</th>
                      <th className="text-left text-sm font-semibold px-5 py-4">Scope</th>
                      <th className="text-left text-sm font-semibold px-5 py-4">Submitted</th>
                      <th className="text-left text-sm font-semibold px-5 py-4">Risk</th>
                      <th className="text-left text-sm font-semibold px-5 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: "Memory Promotion", scope: "Episodic Memory", submitted: "2 hours ago", risk: "Low", status: "Pending" },
                      { type: "Policy Update", scope: "Governance", submitted: "5 hours ago", risk: "Medium", status: "In Review" },
                      { type: "Agent Contract", scope: "Agent System", submitted: "1 day ago", risk: "High", status: "Pending" },
                      { type: "Access Request", scope: "Security", submitted: "2 days ago", risk: "Low", status: "Approved" },
                    ].map((review, idx) => (
                      <tr key={idx} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                        <td className="px-5 py-4 text-sm font-medium">{review.type}</td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">{review.scope}</td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">{review.submitted}</td>
                        <td className="px-5 py-4">
                          <Badge variant={review.risk === "High" ? "coral" : review.risk === "Medium" ? "yellow" : "green"}>
                            {review.risk}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant={review.status === "Approved" ? "green" : review.status === "In Review" ? "blue" : "gray"}>
                            {review.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Policy Checks */}
            <div>
              <h3 className="font-semibold mb-4">Recent Policy Checks</h3>
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left text-sm font-semibold px-5 py-4">Policy</th>
                      <th className="text-left text-sm font-semibold px-5 py-4">Scope</th>
                      <th className="text-left text-sm font-semibold px-5 py-4">Status</th>
                      <th className="text-left text-sm font-semibold px-5 py-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {policies?.slice(0, 3).map((policy) => (
                      <tr key={policy.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                        <td className="px-5 py-4 text-sm font-medium">{policy.name}</td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">{policy.scope}</td>
                        <td className="px-5 py-4">
                          <Badge variant={policy.status === "active" ? "green" : policy.status === "draft" ? "yellow" : "gray"}>
                            {policy.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">{policy.updatedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Policy Compliance */}
            <div>
              <h3 className="font-semibold mb-4">Policy Compliance</h3>
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative size-40">
                    <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                      <circle
                        cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8"
                        strokeDasharray="251.2" strokeDashoffset="37.68" strokeLinecap="round"
                        className="text-[#0C9154]"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-semibold">95%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Passed</span>
                    <span className="font-semibold">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Warnings</span>
                    <span className="font-semibold">4.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Violations</span>
                    <span className="font-semibold">1.5%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Policies */}
            <div>
              <h3 className="font-semibold mb-4">Active Policies</h3>
              <div className="space-y-3">
                {activePolicies.slice(0, 3).map((policy) => (
                  <div key={policy.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="size-4 text-primary" />
                        <span className="font-semibold text-sm">{policy.name}</span>
                      </div>
                      <Badge variant="green">{policy.status}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{policy.rules.length} rules</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Policy Gates Tab */}
      {activeTab === "policy-gates" && (
        <PolicyList />
      )}

      {/* Evidence Chains Tab */}
      {activeTab === "evidence-chains" && (
        <div className="space-y-4">
          <h3 className="font-semibold mb-4">Evidence Chains</h3>
          {[
            { title: "Memory Promotion #1247", links: 12, status: "Complete" },
            { title: "Agent Contract Update", links: 8, status: "In Progress" },
            { title: "Policy Compliance Audit", links: 24, status: "Complete" },
          ].map((chain, idx) => (
            <div key={idx} className="bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <div className="font-semibold text-sm">{chain.title}</div>
                <Badge variant="blue">{chain.links} links</Badge>
              </div>
              <div className="text-xs text-muted-foreground">{chain.status}</div>
            </div>
          ))}
        </div>
      )}

      {/* Access Reviews Tab */}
      {activeTab === "access-reviews" && (
        <div className="text-center py-12 text-muted-foreground">
          Access review workflows coming soon
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <div className="text-center py-12 text-muted-foreground">
          Governance reports coming soon
        </div>
      )}
    </div>
  );
}
