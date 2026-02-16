import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";
import AppIcon from "../components/common/AppIcon";
import NotificationPanel from "../components/common/NotificationPanel";
import UserMenu from "../components/common/UserMenu";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const SalesLayout = ({ children }) => {
  const { auth } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen bg-primary transition-colors duration-300 flex-col font-sans">
      {/* App Name at Top */}
      <div className="w-full border-b border-border-subtle glass-panel py-4 px-8 z-20 sticky top-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AppIcon size="w-10 h-10" />
            <h1 className="font-bold text-xl uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400">
              Sales Reward Engine
            </h1>
          </div>

          {/* Theme Toggle & User */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-surface-2 text-text-secondary hover:bg-surface-3 hover:text-text-primary transition-all border border-border-subtle"
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
            <div className="hidden md:block h-6 w-px bg-border-subtle"></div>
            <UserMenu />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Background Gradients for dark mode ambiance */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-500/5 dark:bg-primary-900/10 blur-[100px]"></div>
          <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] rounded-full bg-accent-500/5 dark:bg-accent-900/10 blur-[80px]"></div>
        </div>

        <div className="z-10 h-full relative">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
          <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-border-strong scrollbar-track-transparent">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SalesLayout;
