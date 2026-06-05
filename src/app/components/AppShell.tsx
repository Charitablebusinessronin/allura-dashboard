import { Outlet, NavLink } from "react-router";
import {
  MessageSquarePlus,
  Search,
  Calendar,
  Shield,
  Sparkles,
  Kanban,
  Settings,
  User,
} from "lucide-react";

export function AppShell() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar flex flex-col shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-allura-blue flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <div className="text-xl font-semibold text-foreground">allura</div>
              <div className="text-xs text-muted-foreground">Memory</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Primary Nav */}
          <div className="space-y-1">
            <SidebarButton icon={MessageSquarePlus} label="New Chat" to="/dreams" />
            <SidebarButton icon={Search} label="Search" to="/dreams" />
            <SidebarButton icon={Calendar} label="Scheduled Tasks" to="/kanban" />
          </div>

          {/* Governance Section */}
          <div>
            <SidebarLabel>Governance</SidebarLabel>
            <div className="space-y-1">
              <SidebarButton icon={Shield} label="Governance" to="/governance" />
            </div>
          </div>

          {/* Dreams Section */}
          <div>
            <SidebarLabel>Dreams</SidebarLabel>
            <div className="space-y-1">
              <SidebarButton icon={Sparkles} label="Dreams" to="/dreams" />
            </div>
          </div>

          {/* Kanban Section */}
          <div>
            <SidebarLabel>Kanban Board</SidebarLabel>
            <div className="space-y-1">
              <SidebarButton icon={Kanban} label="Kanban" to="/kanban" />
            </div>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-border space-y-1">
          <SidebarButton icon={Settings} label="Settings" to="/dreams" />
          <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-sidebar-accent cursor-pointer transition-colors">
            <div className="size-9 rounded-full bg-primary flex items-center justify-center">
              <User className="size-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">Allura Admin</div>
              <div className="text-xs text-muted-foreground truncate">admin@allura.ai</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

function SidebarButton({
  icon: Icon,
  label,
  to,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-foreground hover:bg-sidebar-accent"
        }`
      }
    >
      <Icon className="size-4 shrink-0" />
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
}

function SidebarLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-medium text-muted-foreground px-3 mb-2">
      {children}
    </div>
  );
}
