export const recentDreams = [
  {
    dream: "Analyze recent memory patterns",
    scope: "Allura Memory",
    type: "Analysis",
    status: "Completed",
    results: "42 insights",
    updated: "2 hours ago",
  },
  {
    dream: "Review governance compliance",
    scope: "Governance",
    type: "Review",
    status: "In Progress",
    results: "12 findings",
    updated: "4 hours ago",
  },
  {
    dream: "Optimize agent contracts",
    scope: "Agent System",
    type: "Optimization",
    status: "Pending",
    results: "-",
    updated: "1 day ago",
  },
  {
    dream: "Audit episodic memories",
    scope: "Episodic Memory",
    type: "Audit",
    status: "Completed",
    results: "156 items",
    updated: "2 days ago",
  },
];

export const quickActions = [
  {
    title: "Memory Curator",
    description: "Analyze and organize memories",
    icon: "database",
  },
  {
    title: "Dream Runner",
    description: "Execute background analysis",
    icon: "play-circle",
  },
  {
    title: "Governance Auditor",
    description: "Review policy compliance",
    icon: "shield-check",
  },
  {
    title: "Agent Contracts",
    description: "Manage agent agreements",
    icon: "file-text",
  },
  {
    title: "Kanban Planner",
    description: "Organize tasks and workflows",
    icon: "layout-kanban",
  },
];

export const dreamInsights = [
  { label: "Memories analyzed", value: "3,842", delta: "+127 this week" },
  { label: "Insights generated", value: "158", delta: "+23 this week" },
  { label: "Promotions recommended", value: "27", delta: "+5 this week" },
];

export const governanceKPIs = [
  { label: "Policies enforced", value: "47", delta: "+2" },
  { label: "Policy checks", value: "1,284", delta: "+156" },
  { label: "Violations detected", value: "3", delta: "-1" },
  { label: "Approved changes", value: "89", delta: "+12" },
  { label: "Evidence chains", value: "234", delta: "+18" },
];

export const pendingReviews = [
  {
    type: "Memory Promotion",
    scope: "Episodic Memory",
    submitted: "2 hours ago",
    risk: "Low",
    status: "Pending",
  },
  {
    type: "Policy Update",
    scope: "Governance",
    submitted: "5 hours ago",
    risk: "Medium",
    status: "In Review",
  },
  {
    type: "Agent Contract",
    scope: "Agent System",
    submitted: "1 day ago",
    risk: "High",
    status: "Pending",
  },
  {
    type: "Access Request",
    scope: "Security",
    submitted: "2 days ago",
    risk: "Low",
    status: "Approved",
  },
];

export const policyChecks = [
  {
    policy: "Memory Retention",
    scope: "All Systems",
    status: "Passed",
    timestamp: "10 min ago",
  },
  {
    policy: "Access Control",
    scope: "Governance",
    status: "Passed",
    timestamp: "1 hour ago",
  },
  {
    policy: "Data Integrity",
    scope: "Episodic Memory",
    status: "Warning",
    timestamp: "2 hours ago",
  },
];

export const evidenceChains = [
  { title: "Memory Promotion #1247", links: 12, status: "Complete" },
  { title: "Agent Contract Update", links: 8, status: "In Progress" },
  { title: "Policy Compliance Audit", links: 24, status: "Complete" },
];

export const kanbanTasks: Record<
  string,
  Array<{
    title: string;
    scope: string;
    type: string;
    date: string;
    risk: string | null;
  }
>
> = {
  "To Do": [
    {
      title: "Review memory patterns",
      scope: "Allura Memory",
      type: "Analysis",
      date: "May 31",
      risk: null,
    },
    {
      title: "Update governance policies",
      scope: "Governance",
      type: "Policy",
      date: "Jun 1",
      risk: "high",
    },
    {
      title: "Optimize agent performance",
      scope: "Agent System",
      type: "Optimization",
      date: "Jun 2",
      risk: null,
    },
  ],
  "In Progress": [
    {
      title: "Analyze episodic memories",
      scope: "Episodic Memory",
      type: "Analysis",
      date: "May 30",
      risk: null,
    },
    {
      title: "Conduct compliance audit",
      scope: "Governance",
      type: "Review",
      date: "May 29",
      risk: "medium",
    },
  ],
  Review: [
    {
      title: "Memory promotion review",
      scope: "Allura Memory",
      type: "Review",
      date: "May 28",
      risk: null,
    },
    {
      title: "Agent contract validation",
      scope: "Agent System",
      type: "Review",
      date: "May 27",
      risk: "high",
    },
  ],
  Completed: [
    {
      title: "Weekly governance report",
      scope: "Governance",
      type: "Report",
      date: "May 26",
      risk: null,
    },
    {
      title: "Memory cleanup batch #42",
      scope: "Allura Memory",
      type: "Maintenance",
      date: "May 25",
      risk: null,
    },
    {
      title: "Agent onboarding docs",
      scope: "Agent System",
      type: "Documentation",
      date: "May 24",
      risk: null,
    },
  ],
};

export const kanbanStats = {
  total: 10,
  inProgress: 2,
  inReview: 2,
  completed: 3,
  overdue: 0,
};
