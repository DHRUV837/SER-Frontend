import { X, Sparkles } from "lucide-react";
import { useState } from "react";

const WelcomeBanner = ({ onDismiss }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = () => {
        setIsVisible(false);
        if (onDismiss) onDismiss();
    };

    if (!isVisible) return null;

    return (
        <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10 backdrop-blur-xl border-2 border-indigo-200/60 dark:border-white/10 shadow-xl shadow-indigo-100/50 dark:shadow-none">
            {/* Decorative background elements - Light Mode */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-200/40 to-pink-200/40 dark:from-purple-500/20 dark:to-pink-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            {/* Subtle pattern overlay for light mode */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))] dark:bg-transparent" />

            <div className="relative p-8">
                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm dark:shadow-none border border-slate-200 dark:border-transparent group"
                    aria-label="Dismiss welcome banner"
                >
                    <X className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors" />
                </button>

                {/* Content */}
                <div className="max-w-3xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="relative">
                            <span className="text-4xl">🎉</span>
                            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-400 dark:text-amber-300 animate-pulse" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                            Welcome to Sales Reward Engine
                        </h2>
                    </div>
                    <p className="text-lg text-slate-700 dark:text-slate-300 mb-4 font-medium">
                        Let's set up your reward system in a few simple steps. Complete the checklist below to get started.
                    </p>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">You have full access to all features while you complete the setup</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeBanner;
