import { Outlet, NavLink, useNavigate } from "react-router";
import {
  MessageSquarePlus,
  Search,
  Calendar,
  Shield,
  Sparkles,
  Kanban,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "../../lib/theme/useTheme";
import { MobileMenuButton, useMobileMenu } from "../../lib/responsive/useMobileMenu";
import { useAuth } from "../../lib/auth/AuthContext";

export function AppShell() {
  const { isOpen, setIsOpen, isMobile } = useMobileMenu();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isMobile
            ? `fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : "relative"
        } w-64 border-r border-border bg-sidebar flex flex-col shadow-sm`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-allura-blue flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <div className="text-xl font-semibold text-foreground">allura</div>
                <div className="text-xs text-muted-foreground">Memory</div>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <span className="sr-only">Close menu</span>
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Primary Nav */}
          <div className="space-y-1">
            <SidebarButton icon={MessageSquarePlus} label="New Chat" to="/dreams" onClick={() => setIsOpen(false)} />
            <SidebarButton icon={Search} label="Search" to="/dreams" onClick={() => setIsOpen(false)} />
            <SidebarButton icon={Calendar} label="Scheduled Tasks" to="/kanban" onClick={() => setIsOpen(false)} />
          </div>

          {/* Governance Section */}
          <div>
            <SidebarLabel>Governance</SidebarLabel>
            <div className="space-y-1">
              <SidebarButton icon={Shield} label="Governance" to="/governance" onClick={() => setIsOpen(false)} />
            </div>
          </div>

          {/* Dreams Section */}
          <div>
            <SidebarLabel>Dreams</SidebarLabel>
            <div className="space-y-1">
              <SidebarButton icon={Sparkles} label="Dreams" to="/dreams" onClick={() => setIsOpen(false)} />
            </div>
          </div>

          {/* Kanban Section */}
          <div>
            <SidebarLabel>Kanban Board</SidebarLabel>
            <div className="space-y-1">
              <SidebarButton icon={Kanban} label="Kanban" to="/kanban" onClick={() => setIsOpen(false)} />
            </div>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <SidebarButton icon={Settings} label="Settings" to="/dreams" onClick={() => setIsOpen(false)} />
          <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-sidebar-accent cursor-pointer transition-colors">
            <div className="size-9 rounded-full bg-primary flex items-center justify-center">
              <User className="size-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{user?.name || "Allura Admin"}</div>
              <div className="text-xs text-muted-foreground truncate">{user?.email || "admin@allura.ai"}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground hover:bg-sidebar-accent transition-colors w-full"
          >
            <LogOut className="size-4 shrink-0" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        {isMobile && (
          <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center gap-3">
            <MobileMenuButton onClick={() => setIsOpen(true)} isOpen={isOpen} />
            <span className="font-semibold">Allura Dashboard</span>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}

function SidebarButton({
  icon: Icon,
  label,
  to,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to: string;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
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
