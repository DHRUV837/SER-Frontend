import React, { useState, useEffect } from "react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import SalesLayout from "../../layouts/SalesLayout";
import GoalTracker from "../../components/common/GoalTracker";
import TierBadge from "../../components/common/TierBadge";
import { useSales } from "../../context/SalesContext";
import PageHeader from "../../components/common/PageHeader";

const SalesTargetsPage = () => {
    const { deals } = useSales();
    const { auth } = useAuth();
    const userId = auth?.user?.id || auth?.id;
    const [performanceData, setPerformanceData] = useState(null);

    // Fallback incentive calculation
    const approvedDeals = deals.filter(d => d.status === "Approved");
    const localTotalIncentive = approvedDeals.reduce((sum, d) => sum + (d.incentive || 0), 0);

    useEffect(() => {
        if (userId) {
            api.get(`/performance/summary?userId=${userId}`)
                .then(res => setPerformanceData(res.data))
                .catch(console.error);
        }
    }, [userId, deals]);

    const totalIncentive = performanceData ? performanceData.totalIncentiveEarned : localTotalIncentive;
    const rank = performanceData ? performanceData.rank : null;

    // Calculate This Month`s Incentive (Approved + Submitted)
    const now = new Date();
    const currentMonthDeals = deals.filter(d => {
        const status = (d.status || "").toUpperCase();
        if (status !== 'APPROVED' && status !== 'SUBMITTED') return false;

        try {
            if (!d.date) return false;
            const [year, month, day] = d.date.split('-').map(Number);
            const dealDate = new Date(year, month - 1, day);
            return dealDate.getMonth() === now.getMonth() && dealDate.getFullYear() === now.getFullYear();
        } catch { return false; }
    });
    const thisMonthIncentive = currentMonthDeals.reduce((sum, d) => sum + (d.incentive || 0), 0);

    // Simulator State
    const [simDealValue, setSimDealValue] = useState(50000);
    const [simDealCount, setSimDealCount] = useState(1);
    const simIncentive = simDealValue * 0.10 * simDealCount;
    const projectedTotal = totalIncentive + simIncentive;

    // Monthly target and progress
    const { monthlyTarget } = useSales();
    const progressPercentage = monthlyTarget > 0 ? Math.min((thisMonthIncentive / monthlyTarget) * 100, 100) : 0;
    const remaining = Math.max(0, monthlyTarget - thisMonthIncentive);

    // Days remaining in month
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysRemaining = Math.max(0, lastDay.getDate() - now.getDate());

    // Tier thresholds
    const tiers = [
        { name: 'Bronze', threshold: 50000, color: 'from-orange-400 to-amber-700', icon: '🥉' },
        { name: 'Silver', threshold: 100000, color: 'from-slate-300 to-slate-500', icon: '🥈' },
        { name: 'Gold', threshold: 200000, color: 'from-yellow-300 to-yellow-600', icon: '🥇' },
        { name: 'Platinum', threshold: 500000, color: 'from-purple-400 to-indigo-600', icon: '💎' }
    ];

    const currentTier = tiers.reduce((acc, tier) =>
        totalIncentive >= tier.threshold ? tier : acc
        , { name: 'Starter', threshold: 0, color: 'from-gray-300 to-gray-500', icon: '⭐' });

    const nextTier = tiers.find(t => t.threshold > totalIncentive) || tiers[tiers.length - 1];

    return (
        <SalesLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <PageHeader
                    heading="Targets & Achievement Tracking"
                    subtitle="Monitor assigned targets, track progress, and understand what’s required to reach the next incentive tier."
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Goal Tracker */}
                    <div className="space-y-6">
                        {/* Circular Progress Indicator */}
                        <div className="card-modern p-8 bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 border-primary-100 dark:border-primary-800">
                            <h2 className="text-lg font-bold mb-6 text-center">Monthly Target Progress</h2>

                            <div className="flex flex-col items-center">
                                {/* Circular Progress */}
                                <div className="relative w-48 h-48 mb-6">
                                    <svg className="transform -rotate-90 w-48 h-48">
                                        {/* Background circle */}
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="none"
                                            className="text-gray-200 dark:text-gray-700"
                                        />
                                        {/* Progress circle */}
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            stroke="url(#gradient)"
                                            strokeWidth="12"
                                            fill="none"
                                            strokeDasharray={`${2 * Math.PI * 88}`}
                                            strokeDashoffset={`${2 * Math.PI * 88 * (1 - progressPercentage / 100)}`}
                                            className="transition-all duration-1000 ease-out"
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#6366F1" />
                                                <stop offset="100%" stopColor="#8B5CF6" />
                                            </linearGradient>
                                        </defs>
                                    </svg>

                                    {/* Center content */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                                            {progressPercentage.toFixed(0)}%
                                        </span>
                                        <span className="text-xs text-text-muted mt-1">Complete</span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 w-full">
                                    <div className="text-center">
                                        <p className="text-xs text-text-muted uppercase tracking-wider">Current</p>
                                        <p className="text-lg font-bold text-text-primary">₹{thisMonthIncentive.toLocaleString()}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-text-muted uppercase tracking-wider">Target</p>
                                        <p className="text-lg font-bold text-primary-600">₹{monthlyTarget.toLocaleString()}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-text-muted uppercase tracking-wider">Remaining</p>
                                        <p className="text-lg font-bold text-amber-600">₹{remaining.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Days remaining */}
                                <div className="mt-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-border-subtle">
                                    <p className="text-sm text-text-secondary">
                                        <span className="font-bold text-primary-600">{daysRemaining}</span> days left this month
                                    </p>
                                </div>

                                {/* Milestone markers */}
                                <div className="w-full mt-6">
                                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="absolute h-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-1000 ease-out rounded-full"
                                            style={{ width: `${progressPercentage}%` }}
                                        />
                                        {/* Milestone markers */}
                                        {[25, 50, 75, 100].map(milestone => (
                                            <div
                                                key={milestone}
                                                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                                                style={{ left: `${milestone}%` }}
                                            >
                                                <div className={`w-4 h-4 rounded-full border-2 ${progressPercentage >= milestone
                                                    ? 'bg-primary-500 border-white shadow-lg'
                                                    : 'bg-gray-300 border-gray-400'
                                                    }`} />
                                                <span className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-text-muted whitespace-nowrap">
                                                    {milestone}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Celebration message */}
                                {progressPercentage >= 100 && (
                                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center animate-bounce">
                                        <p className="text-2xl mb-2">🎉</p>
                                        <p className="font-bold text-green-700 dark:text-green-300">Target Achieved!</p>
                                        <p className="text-sm text-green-600 dark:text-green-400">Congratulations on reaching your goal!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* What-If Simulator */}
                        <div className="card-modern p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-100 dark:border-indigo-800">
                            <div className="flex items-center gap-2 mb-4">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">Earnings Simulator</h2>
                            </div>
                            <p className="text-sm text-text-secondary mb-6">See how closing more deals affects your total earnings.</p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="text-xs font-bold uppercase text-text-muted">Avg Deal Value (₹)</label>
                                    <input
                                        type="number"
                                        value={simDealValue}
                                        onChange={(e) => setSimDealValue(Number(e.target.value))}
                                        className="input-modern mt-1 w-full"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-text-muted">Deals to Close</label>
                                    <input
                                        type="number"
                                        value={simDealCount}
                                        onChange={(e) => setSimDealCount(Number(e.target.value))}
                                        className="input-modern mt-1 w-full"
                                    />
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-border-subtle">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm text-text-secondary">Projected Extra Incentive</span>
                                    <span className="text-xl font-bold text-emerald-600">+₹{simIncentive.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                                <p className="text-xs text-center text-text-muted mt-2">
                                    Your total would reach <span className="font-bold text-text-primary">₹{projectedTotal.toLocaleString()}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Club Status */}
                    <div className="space-y-6">
                        {/* Enhanced Tier Ladder */}
                        <div className="card-modern p-6">
                            <h2 className="text-lg font-bold mb-4">Achievement Tier Ladder</h2>
                            <p className="text-sm text-text-secondary mb-6">Climb the ladder to unlock higher rewards and recognition!</p>

                            <div className="space-y-3">
                                {tiers.map((tier, idx) => {
                                    const isAchieved = totalIncentive >= tier.threshold;
                                    const isCurrent = tier.name === currentTier.name;
                                    const isNext = tier.name === nextTier.name;
                                    const progress = tier.threshold > 0 ? Math.min((totalIncentive / tier.threshold) * 100, 100) : 0;

                                    return (
                                        <div
                                            key={tier.name}
                                            className={`relative p-4 rounded-xl border-2 transition-all ${isAchieved
                                                ? `bg-gradient-to-r ${tier.color} border-transparent shadow-lg`
                                                : isCurrent || isNext
                                                    ? 'border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/10'
                                                    : 'border-border-subtle bg-surface-2'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`text-3xl ${isAchieved ? 'animate-bounce' : 'opacity-50'
                                                        }`}>
                                                        {tier.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className={`font-bold text-lg ${isAchieved ? 'text-white' : 'text-text-primary'
                                                            }`}>
                                                            {tier.name}
                                                            {isCurrent && !isAchieved && (
                                                                <span className="ml-2 text-xs bg-primary-500 text-white px-2 py-0.5 rounded-full">Current Goal</span>
                                                            )}
                                                            {isAchieved && (
                                                                <span className="ml-2 text-xs bg-white/30 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">✓ Achieved</span>
                                                            )}
                                                        </h3>
                                                        <p className={`text-sm ${isAchieved ? 'text-white/80' : 'text-text-secondary'
                                                            }`}>
                                                            ₹{tier.threshold.toLocaleString()} lifetime incentive
                                                        </p>
                                                    </div>
                                                </div>

                                                {!isAchieved && isCurrent && (
                                                    <div className="text-right">
                                                        <p className="text-xs text-text-muted">Distance</p>
                                                        <p className="text-lg font-bold text-amber-600">
                                                            ₹{(tier.threshold - totalIncentive).toLocaleString()}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {!isAchieved && isCurrent && (
                                                <div className="mt-3">
                                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-500"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-text-muted mt-1 text-right">{progress.toFixed(0)}% complete</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Current tier badge */}
                            <div className="mt-6 p-4 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50 rounded-xl border border-border-subtle text-center">
                                <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Your Current Tier</p>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-4xl">{currentTier.icon}</span>
                                    <span className="text-2xl font-bold text-text-primary">{currentTier.name}</span>
                                </div>
                            </div>
                        </div>

                        {/* Forecast / Insights */}
                        <div className="card-modern p-6">
                            <h3 className="font-bold text-text-primary mb-3">AI Goal Forecast</h3>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                </div>
                                <div>
                                    {/* Calculating gap and deals needed */}
                                    {(() => {
                                        const { monthlyTarget } = useSales(); // Access context directly or pass as prop
                                        // Use thisMonthIncentive for Gap analysis
                                        const current = thisMonthIncentive > 0 ? thisMonthIncentive : 0;
                                        const gap = Math.max(0, monthlyTarget - current); // Target from Context
                                        // Assume avg incentive from deals or default 5000
                                        const avgIncentive = approvedDeals.length > 0 ? (current / approvedDeals.length) : 5000;
                                        const dealsNeeded = Math.ceil(gap / avgIncentive);

                                        return gap > 0 ? (
                                            <>
                                                <p className="text-sm text-text-secondary">
                                                    You are <span className="font-bold text-amber-600">₹{gap.toLocaleString()}</span> away from your monthly target.
                                                </p>
                                                <p className="text-xs text-text-muted mt-2">
                                                    At your average of <b>₹{Math.round(avgIncentive).toLocaleString()}/deal</b>, you need roughly:
                                                </p>
                                                <p className="text-xl font-bold text-primary-600 mt-1">{dealsNeeded} more deals 🎯</p>
                                            </>
                                        ) : (
                                            <p className="text-sm font-bold text-emerald-600">You have hit your target! Great job! 🚀</p>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SalesLayout>
    );
};

export default SalesTargetsPage;
