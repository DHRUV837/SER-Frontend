import { useAuth } from "../../context/AuthContext";
import NotificationPanel from "./NotificationPanel";

const Topbar = () => {
  const { logout } = useAuth();

  return (
    <div className="flex items-center space-x-4">
      <NotificationPanel />
      <button
        onClick={logout}
        className="flex items-center space-x-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-5 py-2 text-xs uppercase tracking-widest transition-all duration-200 group shadow-lg hover:shadow-xl rounded-lg"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Logout</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
      </button>
    </div>
  );
};

export default Topbar;
