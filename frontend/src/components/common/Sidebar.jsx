import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Briefcase,
  TrendingUp,
  Target,
  Trophy,
  FileText,
  History,
  Calculator,
  ShieldCheck,
  BadgeDollarSign,
  BookOpen,
  CheckCircle2,
  Users,
  Settings,
  Activity,
  FileClock,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  ShieldAlert,
  Wallet
} from "lucide-react";
import AppIcon from "../common/AppIcon";

const Sidebar = () => {
  const { auth, logout } = useAuth();
  const isAdmin = (auth?.user?.role || auth?.role) === "ADMIN";
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Persist collapse state
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState) setIsCollapsed(JSON.parse(savedState));
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
  };

  // --- Configuration ---

  const salesGroups = [
    {
      title: "Primary",
      items: [
        { path: "/sales", label: "Dashboard", icon: LayoutDashboard },
        { path: "/sales/my-deals", label: "My Assigned Deals", icon: Briefcase },
        { path: "/sales/performance", label: "Performance", icon: Activity },
        { path: "/sales/targets", label: "Targets & Progress", icon: Target },
      ]
    },
    {
      title: "Secondary",
      items: [
        { path: "/sales/leaderboard", label: "Leaderboard", icon: Trophy },
        { path: "/sales/reports", label: "Reports", icon: FileText },
        { path: "/sales/history", label: "Deal History", icon: History },
        { path: "/sales/simulator", label: "Incentive Simulator", icon: Calculator },
      ]
    },
    {
      title: "Resources",
      items: [
        { path: "/sales/policy", label: "My Incentive Policy", icon: ShieldCheck },
        { path: "/sales/policies", label: "Company Policies", icon: BookOpen },
        { path: "/sales/payouts", label: "My Earnings", icon: Wallet },
      ]
    }
  ];

  const adminGroups = [
    {
      title: "Primary",
      items: [
        { path: "/admin", label: "Overview", icon: LayoutDashboard },
        { path: "/admin/deals", label: "Manage Deals", icon: Briefcase },
        { path: "/admin/approvals", label: "Deal Approvals", icon: CheckCircle2 },
      ]
    },
    {
      title: "Secondary",
      items: [
        { path: "/admin/performance", label: "Performance Audit", icon: TrendingUp },
      ]
    },
    {
      title: "Governance",
      items: [
        { path: "/admin/users", label: "User Management", icon: Users },
        { path: "/admin/incentive-policies", label: "Incentive Policies", icon: BadgeDollarSign },
        { path: "/admin/policy", label: "General Policies", icon: BookOpen },
        { path: "/admin/audit-logs", label: "Audit Logs", icon: FileClock },
        { path: "/admin/settings", label: "Platform Settings", icon: Settings },
      ]
    }
  ];

  const menuGroups = isAdmin ? adminGroups : salesGroups;

  return (
    <aside
      className={`
        relative flex flex-col h-screen bg-bg-secondary border-r border-border-subtle transition-all duration-300 ease-in-out z-30
        ${isCollapsed ? "w-20" : "w-64"}
      `}
    >
      {/* --- Header --- */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border-subtle bg-bg-secondary/50 backdrop-blur-sm">
        <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ""}`}>
          <div className="flex-shrink-0 text-primary-600 dark:text-primary-400">
            <AppIcon size="w-8 h-8" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg tracking-tight text-text-primary whitespace-nowrap">
              {isAdmin ? "Admin Portal" : "Sales Portal"}
            </span>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg text-text-muted hover:bg-slate-100 dark:hover:bg-white/10 hover:text-text-primary transition-all duration-200"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* --- User Profile (Compact) --- */}
      <div className={`px-3 py-4 border-b border-border-subtle/50 ${isCollapsed ? 'flex justify-center' : ""}`}>
        <div className={`
           flex items-center gap-3 p-2 rounded-xl transition-colors
           ${!isCollapsed ? "bg-surface-2 border border-border-subtle hover:border-primary-500/30" : "bg-transparent"}
        `}>
          <div className="relative">
            <div className={`
              w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md
              ${isAdmin
                ? "bg-gradient-to-br from-indigo-500 to-violet-600"
                : "bg-gradient-to-br from-blue-500 to-cyan-500"
              }
            `}>
              {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : (isAdmin ? "A" : "S")}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
          </div>

          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <h3 className="text-sm font-semibold text-text-primary truncate">{auth?.user?.name || "User"}</h3>
              <p className="text-[10px] uppercase tracking-wider font-medium text-text-muted truncate">
                {isAdmin ? "Administrator" : "Sales Exec"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- Navigation --- */}
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar space-y-6">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="px-3">
            {/* Group Label */}
            {!isCollapsed && group.title && (
              <h4 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-text-muted/70">
                {group.title}
              </h4>
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/sales" || item.path === "/admin"}
                  className={({ isActive }) => `
                    group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${isActive
                      ? "bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 font-medium"
                      : "text-text-secondary hover:bg-slate-100 dark:hover:bg-white/10 hover:text-text-primary hover:translate-x-1"
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary-600 dark:bg-primary-400"></div>
                      )}

                      <item.icon
                        size={20}
                        className={`
                          flex-shrink-0 transition-colors
                          ${isActive ? "text-primary-600 dark:text-primary-400" : "text-text-muted group-hover:text-text-secondary"}
                        `}
                        strokeWidth={1.75}
                      />

                      {!isCollapsed && (
                        <span className="truncate text-sm">{item.label}</span>
                      )}

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                          {item.label}
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* --- Footer / Collapse Trigger (if centered at bottom) --- */}
      <div className="p-3 border-t border-border-subtle bg-bg-secondary/50 backdrop-blur-sm">
        {isCollapsed ? (
          <button
            onClick={toggleCollapse}
            className="w-full flex justify-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-text-muted hover:text-text-primary transition-all duration-200 hover:scale-105"
          >
            <ChevronRight size={20} />
          </button>
        ) : (
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-text-muted hover:bg-rose-50 dark:hover:bg-rose-900/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors hover:translate-x-1"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
