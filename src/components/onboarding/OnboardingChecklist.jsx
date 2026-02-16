import { API_URL } from "../../api";
import { CheckCircle2, Circle, Target, FileText, Settings, UserPlus, Sparkles, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const OnboardingChecklist = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [progress, setProgress] = useState({
        firstTargetCreated: false,
        firstDealCreated: false,
        firstRuleConfigured: false,
        firstUserInvited: false,
        completionPercentage: 0,
        completedCount: 0,
        totalCount: 4
    });
    const [showCelebration, setShowCelebration] = useState(false);

    const checklistItems = [
        {
            id: "firstTarget",
            title: "Create First Target",
            description: "Set up performance goals for your team",
            icon: Target,
            link: "/admin/targets",
            completed: progress.firstTargetCreated,
            color: "blue"
        },
        {
            id: "firstDeal",
            title: "Create First Deal",
            description: "Add a sales opportunity to track",
            icon: FileText,
            link: "/admin/deals",
            completed: progress.firstDealCreated,
            color: "purple"
        },
        {
            id: "firstRule",
            title: "Configure Reward Rule",
            description: "Define how incentives are calculated",
            icon: Settings,
            link: "/admin/policy",
            completed: progress.firstRuleConfigured,
            color: "indigo"
        },
        {
            id: "firstInvite",
            title: "Invite Sales User",
            description: "Add team members to your system",
            icon: UserPlus,
            link: "/admin/users",
            completed: progress.firstUserInvited,
            color: "pink"
        }
    ];

    useEffect(() => {
        fetchProgress();
        // Poll for updates every 5 seconds for more responsive updates
        const interval = setInterval(fetchProgress, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchProgress = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/onboarding/progress/${auth.user.id}`);
            const newProgress = response.data;

            // Check if just completed
            if (newProgress.completedCount === 4 && progress.completedCount < 4) {
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 5000);
            }

            setProgress(newProgress);
        } catch (error) {
            console.error("Failed to fetch onboarding progress:", error);
        }
    };

    const handleItemClick = (link) => {
        navigate(link);
    };

    const getColorClasses = (color, completed) => {
        if (completed) {
            return {
                bg: "bg-emerald-50 dark:bg-emerald-500/10",
                border: "border-emerald-300 dark:border-emerald-500/30",
                iconBg: "bg-emerald-100 dark:bg-emerald-500/20",
                iconColor: "text-emerald-600 dark:text-emerald-400",
                textColor: "text-emerald-700 dark:text-emerald-400"
            };
        }

        const colorMap = {
            blue: {
                bg: "bg-white dark:bg-slate-700/30 hover:bg-blue-50 dark:hover:bg-slate-700/50",
                border: "border-slate-200 dark:border-slate-600/30 hover:border-blue-300 dark:hover:border-blue-500/50",
                iconBg: "bg-blue-100 dark:bg-blue-500/20",
                iconColor: "text-blue-600 dark:text-blue-400"
            },
            purple: {
                bg: "bg-white dark:bg-slate-700/30 hover:bg-purple-50 dark:hover:bg-slate-700/50",
                border: "border-slate-200 dark:border-slate-600/30 hover:border-purple-300 dark:hover:border-purple-500/50",
                iconBg: "bg-purple-100 dark:bg-purple-500/20",
                iconColor: "text-purple-600 dark:text-purple-400"
            },
            indigo: {
                bg: "bg-white dark:bg-slate-700/30 hover:bg-indigo-50 dark:hover:bg-slate-700/50",
                border: "border-slate-200 dark:border-slate-600/30 hover:border-indigo-300 dark:hover:border-indigo-500/50",
                iconBg: "bg-indigo-100 dark:bg-indigo-500/20",
                iconColor: "text-indigo-600 dark:text-indigo-400"
            },
            pink: {
                bg: "bg-white dark:bg-slate-700/30 hover:bg-pink-50 dark:hover:bg-slate-700/50",
                border: "border-slate-200 dark:border-slate-600/30 hover:border-pink-300 dark:hover:border-pink-500/50",
                iconBg: "bg-pink-100 dark:bg-pink-500/20",
                iconColor: "text-pink-600 dark:text-pink-400"
            }
        };

        return colorMap[color];
    };

    return (
        <div className="mb-6">
            {/* Celebration Message */}
            {showCelebration && (
                <div className="mb-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-100 to-green-100 dark:from-green-500/20 dark:to-emerald-500/20 border-2 border-emerald-300 dark:border-emerald-500/30 shadow-lg shadow-emerald-100/50 dark:shadow-none backdrop-blur-xl animate-pulse">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-emerald-200 dark:bg-emerald-500/20">
                            <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">✅ Setup Complete!</h3>
                            <p className="text-emerald-600 dark:text-emerald-300">Your system is now active and ready to use.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Checklist Card */}
            <div className="rounded-2xl bg-white dark:bg-slate-800/50 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700/50 p-6 shadow-xl shadow-slate-100/50 dark:shadow-none">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/20 dark:to-purple-500/20">
                            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Get Started Checklist</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {progress.completedCount} of {progress.totalCount} tasks completed
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right px-4 py-2 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-200 dark:border-indigo-500/20">
                            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">{progress.completionPercentage}%</div>
                            <div className="text-xs text-slate-600 dark:text-slate-500 font-medium">Complete</div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6 h-3 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out shadow-lg"
                        style={{ width: `${progress.completionPercentage}%` }}
                    />
                </div>

                {/* Checklist Items */}
                <div className="space-y-3">
                    {checklistItems.map((item) => {
                        const Icon = item.icon;
                        const colors = getColorClasses(item.color, item.completed);

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleItemClick(item.link)}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all border-2 ${colors.bg} ${colors.border} shadow-sm hover:shadow-md`}
                            >
                                {/* Checkbox */}
                                <div className="flex-shrink-0">
                                    {item.completed ? (
                                        <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                        <Circle className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                                    )}
                                </div>

                                {/* Icon */}
                                <div className={`flex-shrink-0 p-2.5 rounded-lg ${colors.iconBg || 'bg-slate-100 dark:bg-slate-700'}`}>
                                    <Icon className={`w-5 h-5 ${colors.iconColor || 'text-slate-600 dark:text-slate-400'}`} />
                                </div>

                                {/* Text */}
                                <div className="flex-1 text-left">
                                    <div className={`font-semibold ${item.completed
                                        ? "text-emerald-700 dark:text-emerald-400 line-through"
                                        : "text-slate-800 dark:text-white"
                                        }`}>
                                        {item.title}
                                    </div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">{item.description}</div>
                                </div>

                                {/* Arrow */}
                                {!item.completed && (
                                    <div className="flex-shrink-0">
                                        <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OnboardingChecklist;
