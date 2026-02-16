import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { CheckCircle, Circle, ArrowRight, Lock, Rocket, LayoutDashboard, Database, Users, FileText, Target, Wallet, Settings } from 'lucide-react';

const SetupPage = () => {
    const { auth } = useAuth();
    const { missionStatus, isActive, loading } = useOnboarding();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);

    const role = auth?.user?.role || "SALES";

    // Redirect if already activated
    useEffect(() => {
        if (auth?.user?.onboardingCompleted) {
            navigate(role === 'ADMIN' ? '/admin' : '/sales');
        }
    }, [auth, navigate, role]);

    useEffect(() => {
        if (!loading && missionStatus) {
            calculateProgress();
            // If completed, context might auto-redirect or we can show success here
        }
    }, [missionStatus, loading]);

    const calculateProgress = () => {
        // if (!missionStatus) return; // Keep rendering even if missionStatus loading, but progress might be 0
        let total = 0;
        let completed = 0;

        // Check Profile (Client-side logic)
        const isProfileSetup = !!(auth?.user?.department && auth?.user?.department !== 'N/A');
        total++;
        if (isProfileSetup) completed++;

        if (missionStatus) {
            if (role === 'ADMIN') {
                total += 3;
                if (missionStatus.hasCreatedPolicy) completed++;
                if (missionStatus.hasAddedUser) completed++;
                if (missionStatus.hasViewedReport) completed++;
            } else {
                total += 2;
                if (missionStatus.hasAddedDeal) completed++;
                if (missionStatus.hasViewedRankings) completed++;
            }
        }
        setProgress(Math.round((completed / total) * 100));
    };

    const handleAction = (path) => {
        navigate(path);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    // Check if Profile is set up (using department as flag)
    // We check if department exists and is not 'N/A' (if that's the default)
    const isProfileSetup = !!(auth?.user?.department && auth?.user?.department !== 'N/A');

    // Role-based Mission Data
    const profileMission = {
        id: 'profile',
        label: "Complete Your Profile",
        desc: "Set up your organization, role, and preferences.",
        icon: Settings,
        path: "/admin/onboarding", // The Wizard
        isComplete: !!isProfileSetup
    };

    const adminMissions = [
        profileMission,
        {
            id: 'policy',
            label: "Create Incentive Policy",
            desc: "Define the rules for your sales team's rewards.",
            icon: Database,
            path: "/admin/incentive-policies",
            isComplete: missionStatus?.hasCreatedPolicy,
            locked: !isProfileSetup
        },
        {
            id: 'user',
            label: "Add a Team Member",
            desc: "Invite your first sales executive to the platform.",
            icon: Users,
            path: "/admin/users",
            isComplete: missionStatus?.hasAddedUser,
            locked: !isProfileSetup
        },
        {
            id: 'report',
            label: "View Performance Report",
            desc: "Check the analytics dashboard to see insights.",
            icon: FileText,
            path: "/admin/performance",
            isComplete: missionStatus?.hasViewedReport,
            locked: !isProfileSetup
        }
    ];

    const salesMissions = [
        profileMission,
        {
            id: 'deal',
            label: "Record your first Sale",
            desc: "Log a deal to start tracking your incentives.",
            icon: Target,
            path: "/sales/my-deals", // Assumed path for adding a deal
            isComplete: missionStatus?.hasAddedDeal,
            locked: !isProfileSetup
        },
        {
            id: 'rankings',
            label: "View Leaderboard",
            desc: "See where you stand against your peers.",
            icon: LayoutDashboard, // Leaderboard icon
            path: "/sales/leaderboard",
            isComplete: missionStatus?.hasViewedRankings,
            locked: !isProfileSetup
        }
    ];

    const missions = role === 'ADMIN' ? adminMissions : salesMissions;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex items-center px-6 justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <Rocket className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Setup Mode</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-slate-300">{auth?.user?.name}</span>
                        <span className="text-xs text-slate-500 uppercase">{role}</span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                        {auth?.user?.name?.charAt(0)}
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-start pt-12 px-4">
                <div className="w-full max-w-3xl space-y-8">

                    {/* Welcome / Progress Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Account Activation Required
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto">
                            Complete these {missions.length} steps to unlock your full dashboard and start earning rewards.
                        </p>

                        {/* Progress Bar */}
                        <div className="max-w-md mx-auto mt-6">
                            <div className="flex justify-between text-sm mb-2 font-medium">
                                <span className="text-indigo-400">{progress}% Complete</span>
                                <span className="text-slate-500">{missions.filter(m => m.isComplete).length}/{missions.length} Steps</span>
                            </div>
                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mission Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-8">
                        {missions.map((mission) => (
                            <div
                                key={mission.id}
                                className={`
                                    relative group p-6 rounded-2xl border transition-all duration-300
                                    ${mission.isComplete
                                        ? 'bg-slate-900/30 border-green-500/20'
                                        : 'bg-slate-900/60 border-slate-700 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10'
                                    }
                                `}
                            >
                                <div className="flex items-start gap-5">
                                    <div className={`
                                        w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                                        ${mission.isComplete ? 'bg-green-500/10 text-green-500' : 'bg-slate-800 text-indigo-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-400'}
                                    `}>
                                        {mission.isComplete ? <CheckCircle className="w-6 h-6" /> : <mission.icon className="w-6 h-6" />}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className={`text-lg font-semibold ${mission.isComplete ? 'text-slate-400 line-through decoration-slate-600' : 'text-white'}`}>
                                            {mission.label}
                                        </h3>
                                        <p className="text-slate-400 text-sm mt-1">
                                            {mission.desc}
                                        </p>
                                    </div>

                                    <div className="flex items-center">
                                        {mission.isComplete ? (
                                            <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold uppercase rounded-full border border-green-500/20">
                                                Completed
                                            </span>
                                        ) : mission.locked ? (
                                            <span className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-500 text-sm font-semibold rounded-lg cursor-not-allowed">
                                                <Lock className="w-4 h-4" /> Locked
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleAction(mission.path)}
                                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                                            >
                                                Start <ArrowRight className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dashboard Lock Notice */}
                    <div className="mt-8 p-4 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center justify-center gap-3 text-red-400/80 text-sm">
                        <Lock className="w-4 h-4" />
                        <span>Main Dashboard is locked until activation is complete.</span>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default SetupPage;
