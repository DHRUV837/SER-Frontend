import Sidebar from "../components/common/Sidebar";
import AppIcon from "../components/common/AppIcon";
import NotificationPanel from "../components/common/NotificationPanel";
import UserMenu from "../components/common/UserMenu";
import { useTheme } from "../context/ThemeContext";

const AdminLayout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-surface-1 flex flex-col">
      {/* Top Header */}
      <div className="w-full border-b border-border-subtle bg-surface-2 py-3 px-6 shadow-sm z-30 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-primary-500 to-indigo-600 text-white p-2 rounded-lg shadow-lg shadow-primary-500/30">
              <AppIcon size="w-6 h-6" />
            </div>
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Sales Reward Engine
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-surface-3 text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-all border border-border-subtle"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            <div className="h-6 w-px bg-border-subtle"></div>
            <NotificationPanel />
            <div className="h-6 w-px bg-border-subtle"></div>
            <UserMenu />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative z-10 p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto pb-20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
