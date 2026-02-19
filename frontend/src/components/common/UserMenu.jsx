import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UserMenu = ({ showName = true }) => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAvatarClick = () => {
        setIsOpen(!isOpen);
    };

    const handleProfileClick = () => {
        setIsOpen(false);
        const role = auth?.user?.role || auth?.role;
        if (role === "ADMIN") {
            navigate("/admin/profile");
        } else {
            navigate("/sales/profile");
        }
    };

    if (!auth) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={handleAvatarClick}
                className="flex items-center space-x-3 focus:outline-none group"
            >
                {showName && (
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {auth.name || "User"}
                        </p>
                        <p className="text-xs text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider">
                            {auth.role || "ROLE"}
                        </p>
                    </div>
                )}
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold shadow-md shadow-primary-500/20 group-hover:shadow-lg group-hover:shadow-primary-500/40 transition-all border-2 border-white dark:border-slate-800">
                    {auth.name ? auth.name[0].toUpperCase() : "U"}
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-2 z-50 transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700 md:hidden">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{auth.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{auth.role}</p>
                    </div>

                    <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 flex items-center space-x-2 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>My Profile</span>
                    </button>

                    <button
                        onClick={() => {
                            setIsOpen(false);
                            logout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center space-x-2 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
