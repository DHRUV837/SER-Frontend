import api from "../../api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { CheckCircle2, Circle, Target, FileText, Settings, UserPlus, Sparkles, ArrowRight, TrendingUp, Rocket } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const OnboardingWelcomePage = () => {
    const { auth, updateUser } = useAuth();
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
    const [showConfetti, setShowConfetti] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const checklistItems = [
        {
            id: "firstTarget",
            title: "Create First Target",
            description: "Set up performance goals for your team",
            icon: Target,
            link: "/admin/performance",
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
        // Show initial confetti on load
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);

        // Fetch progress
        fetchProgress();
        const interval = setInterval(fetchProgress, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchProgress = async () => {
        try {
            const response = await api.get(`/api/onboarding/progress/${auth.user.id}`);
            const newProgress = response.data;

            // Check if just completed
            if (newProgress.completedCount === 4 && progress.completedCount < 4) {
                handleCompletion();
            }

            setProgress(newProgress);
        } catch (error) {
            console.error("Failed to fetch onboarding progress:", error);
        }
    };

    const handleCompletion = async () => {
        setShowCelebration(true);
        setShowConfetti(true);

        // Update backend
        try {
            await api.post(`/api/onboarding/complete/${auth.user.id}`);
            updateUser(true);
        } catch (error) {
            console.error("Failed to complete onboarding:", error);
        }

        // Auto-redirect after 5 seconds
        setTimeout(() => {
            setIsRedirecting(true);
            setTimeout(() => navigate("/admin"), 1000);
        }, 5000);
    };

    const handleItemClick = (link) => {
        navigate(link);
    };

    const handleContinue = () => {
        setIsRedirecting(true);
        setTimeout(() => navigate("/admin"), 500);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const welcomeVariants = {
        hidden: { opacity: 0, y: -30, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    const checklistContainerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
                delayChildren: 1.5
            }
        }
    };

    const checklistItemVariants = {
        hidden: { opacity: 0, x: -50, scale: 0.95 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    const getColorClasses = (color, completed) => {
        if (completed) {
            return {
                bg: "bg-emerald-50 dark:bg-emerald-500/10",
                border: "border-emerald-300 dark:border-emerald-500/30",
                iconBg: "bg-emerald-100 dark:bg-emerald-500/20",
                iconColor: "text-emerald-600 dark:text-emerald-400"
            };
        }

        const colorMap = {
            blue: {
                bg: "bg-white dark:bg-slate-700/30",
                border: "border-blue-200 dark:border-blue-500/30",
                iconBg: "bg-blue-100 dark:bg-blue-500/20",
                iconColor: "text-blue-600 dark:text-blue-400"
            },
            purple: {
                bg: "bg-white dark:bg-slate-700/30",
                border: "border-purple-200 dark:border-purple-500/30",
                iconBg: "bg-purple-100 dark:bg-purple-500/20",
                iconColor: "text-purple-600 dark:text-purple-400"
            },
            indigo: {
                bg: "bg-white dark:bg-slate-700/30",
                border: "border-indigo-200 dark:border-indigo-500/30",
                iconBg: "bg-indigo-100 dark:bg-indigo-500/20",
                iconColor: "text-indigo-600 dark:text-indigo-400"
            },
            pink: {
                bg: "bg-white dark:bg-slate-700/30",
                border: "border-pink-200 dark:border-pink-500/30",
                iconBg: "bg-pink-100 dark:bg-pink-500/20",
                iconColor: "text-pink-600 dark:text-pink-400"
            }
        };

        return colorMap[color];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6 overflow-hidden relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-300/30 to-pink-300/30 dark:from-purple-500/20 dark:to-pink-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Confetti */}
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={500}
                    gravity={0.3}
                />
            )}

            {/* Main Content */}
            <motion.div
                className="relative z-10 w-full max-w-4xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Welcome Section */}
                <motion.div
                    className="text-center mb-12"
                    variants={welcomeVariants}
                >
                    <motion.div
                        className="inline-flex items-center gap-3 mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    >
                        <span className="text-6xl">🎉</span>
                        <Sparkles className="w-8 h-8 text-amber-400 dark:text-amber-300 animate-pulse" />
                    </motion.div>

                    <motion.h1
                        className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                    >
                        Welcome, {auth?.user?.name || "Administrator"}!
                    </motion.h1>

                    <motion.p
                        className="text-2xl text-slate-600 dark:text-slate-300 font-medium mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                    >
                        from <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">{auth?.user?.organizationName || "Your Company"}</span>
                    </motion.p>

                    <motion.p
                        className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 0.6 }}
                    >
                        Let`s get your Sales Reward Engine ready in 4 simple steps
                    </motion.p>
                </motion.div>

                {/* Start Wizard Card */}
                <motion.div
                    className="rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700/50 p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none text-center"
                    variants={checklistContainerVariants}
                >
                    <div className="mb-8">
                        <div className="mx-auto w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6">
                            <Rocket className="w-10 h-10 text-indigo-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Let's Set Up Your Workspace</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                            Complete our guided 4-step wizard to configure your targets, deals, policies, and team.
                        </p>
                    </div>

                    <motion.button
                        onClick={() => navigate("/admin/onboarding")}
                        className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xl rounded-2xl shadow-xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-3 mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Start Setup Wizard <ArrowRight className="w-6 h-6" />
                    </motion.button>
                </motion.div>
            </motion.div>


            {/* Celebration Modal */}
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white dark:bg-slate-800 rounded-3xl p-12 max-w-md w-full text-center shadow-2xl border-2 border-emerald-300 dark:border-emerald-500/30"
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 10 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <motion.div
                                className="mb-6"
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5, repeat: 3 }}
                            >
                                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/20 mb-4">
                                    <CheckCircle2 className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </motion.div>

                            <h2 className="text-4xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">
                                🎉 Setup Complete!
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                                Your Sales Reward Engine is now active and ready to use!
                            </p>

                            <motion.button
                                onClick={handleContinue}
                                className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={isRedirecting ? {} : { scale: [1, 1.05, 1] }}
                                transition={isRedirecting ? {} : { duration: 1, repeat: Infinity }}
                            >
                                {isRedirecting ? "Redirecting..." : "Continue to Dashboard"}
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>

                            {!isRedirecting && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                                    Auto-redirecting in a few seconds...
                                </p>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default OnboardingWelcomePage;
