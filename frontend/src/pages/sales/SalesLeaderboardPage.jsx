import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import SalesLayout from "../../layouts/SalesLayout";
import PageHeader from "../../components/common/PageHeader";

const SalesLeaderboardPage = () => {
    const { auth } = useAuth();
    const currentUserId = auth?.user?.id || auth?.id;
    const [leaders, setLeaders] = useState([]);
    const [previousLeaders, setPreviousLeaders] = useState([]);
    const [filter, setFilter] = useState("This Month");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get("http://localhost:8080/deals").then(res => {
            const allDeals = res.data;
            const approved = allDeals.filter(d => d.status === "Approved");

            // Calculate current period stats
            const now = new Date();
            const currentPeriodDeals = approved.filter(d => {
                if (!d.date) return false;
                const dealDate = new Date(d.date);

                if (filter === "This Month") {
                    return dealDate.getMonth() === now.getMonth() && dealDate.getFullYear() === now.getFullYear();
                } else if (filter === "Last Month") {
                    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    return dealDate.getMonth() === lastMonth.getMonth() && dealDate.getFullYear() === lastMonth.getFullYear();
                } else if (filter === "This Year") {
                    return dealDate.getFullYear() === now.getFullYear();
                }
                return true;
            });

            // Calculate previous period for trend
            const previousPeriodDeals = approved.filter(d => {
                if (!d.date) return false;
                const dealDate = new Date(d.date);

                if (filter === "This Month") {
                    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    return dealDate.getMonth() === lastMonth.getMonth() && dealDate.getFullYear() === lastMonth.getFullYear();
                } else if (filter === "Last Month") {
                    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
                    return dealDate.getMonth() === twoMonthsAgo.getMonth() && dealDate.getFullYear() === twoMonthsAgo.getFullYear();
                } else if (filter === "This Year") {
                    return dealDate.getFullYear() === now.getFullYear() - 1;
                }
                return false;
            });

            const userStats = {};
            const previousUserStats = {};

            currentPeriodDeals.forEach(d => {
                if (!d.user) return;
                const uid = d.user.id;
                if (!userStats[uid]) {
                    userStats[uid] = {
                        id: uid,
                        name: d.user.name,
                        totalIncentive: 0,
                        deals: 0,
                        totalAmount: 0
                    };
                }
                userStats[uid].totalIncentive += (d.incentive || 0);
                userStats[uid].totalAmount += (d.amount || 0);
                userStats[uid].deals += 1;
            });

            previousPeriodDeals.forEach(d => {
                if (!d.user) return;
                const uid = d.user.id;
                if (!previousUserStats[uid]) {
                    previousUserStats[uid] = { totalIncentive: 0 };
                }
                previousUserStats[uid].totalIncentive += (d.incentive || 0);
            });

            const sorted = Object.values(userStats)
                .map((user, idx) => {
                    const prevRank = Object.values(previousUserStats)
                        .sort((a, b) => b.totalIncentive - a.totalIncentive)
                        .findIndex(u => previousUserStats[user.id] && u.totalIncentive === previousUserStats[user.id].totalIncentive);

                    const currentRank = idx;
                    let trend = 0;
                    if (prevRank !== -1) {
                        trend = prevRank - currentRank; // Positive = moved up
                    }

                    return {
                        ...user,
                        avgDealSize: user.deals > 0 ? user.totalAmount / user.deals : 0,
                        winRate: user.deals > 0 ? ((user.deals / currentPeriodDeals.length) * 100).toFixed(1) : 0,
                        trend: trend
                    };
                })
                .sort((a, b) => b.totalIncentive - a.totalIncentive);

            setLeaders(sorted);
            setLoading(false);
        }).catch(err => {
            console.error("Failed to load leaderboard", err);
            setLoading(false);
        });
    }, [filter]);

    return (
        <SalesLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <PageHeader
                    heading="Sales Rankings"
                    subtitle="See how you rank among peers based on incentives and deal performance."
                    actions={
                        <div className="flex bg-surface-2 p-1 rounded-lg border border-border-subtle">
                            {["This Month", "Last Month", "This Year"].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === f ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600' : 'text-text-secondary hover:text-text-primary'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    }
                />

                {/* Podium Display for Top 3 */}
                {!loading && leaders.length >= 3 && (
                    <div className="card-modern p-8 mb-6 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50">
                        <h3 className="text-lg font-bold text-center mb-6 text-text-primary">🏆 Top Performers</h3>
                        <div className="flex items-end justify-center gap-4 max-w-2xl mx-auto">
                            {/* 2nd Place */}
                            <div className="flex-1 text-center">
                                <div className="bg-gradient-to-br from-slate-300 to-slate-500 rounded-t-2xl p-6 shadow-xl transform hover:scale-105 transition-transform">
                                    <div className="text-4xl mb-2">🥈</div>
                                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                                        {leaders[1]?.name?.charAt(0) || '2'}
                                    </div>
                                    <p className="font-bold text-white text-lg mb-1">{leaders[1]?.name}</p>
                                    <p className="text-sm text-slate-100 font-semibold">₹{leaders[1]?.totalIncentive.toLocaleString()}</p>
                                    <p className="text-xs text-slate-200 mt-1">{leaders[1]?.deals} deals</p>
                                </div>
                                <div className="bg-slate-400 h-24 rounded-b-lg flex items-center justify-center text-white font-bold text-2xl">
                                    2
                                </div>
                            </div>

                            {/* 1st Place */}
                            <div className="flex-1 text-center">
                                <div className="bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-t-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform relative">
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-yellow-500 rounded-full p-2 shadow-lg animate-bounce">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        </div>
                                    </div>
                                    <div className="text-5xl mb-2">🏆</div>
                                    <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-3xl font-bold text-white shadow-xl ring-4 ring-yellow-200">
                                        {leaders[0]?.name?.charAt(0) || '1'}
                                    </div>
                                    <p className="font-bold text-white text-xl mb-1">{leaders[0]?.name}</p>
                                    <p className="text-base text-yellow-100 font-bold">₹{leaders[0]?.totalIncentive.toLocaleString()}</p>
                                    <p className="text-sm text-yellow-200 mt-1">{leaders[0]?.deals} deals</p>
                                </div>
                                <div className="bg-yellow-500 h-32 rounded-b-lg flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                                    1
                                </div>
                            </div>

                            {/* 3rd Place */}
                            <div className="flex-1 text-center">
                                <div className="bg-gradient-to-br from-orange-400 to-amber-700 rounded-t-2xl p-6 shadow-xl transform hover:scale-105 transition-transform">
                                    <div className="text-4xl mb-2">🥉</div>
                                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                                        {leaders[2]?.name?.charAt(0) || '3'}
                                    </div>
                                    <p className="font-bold text-white text-lg mb-1">{leaders[2]?.name}</p>
                                    <p className="text-sm text-orange-100 font-semibold">₹{leaders[2]?.totalIncentive.toLocaleString()}</p>
                                    <p className="text-xs text-orange-200 mt-1">{leaders[2]?.deals} deals</p>
                                </div>
                                <div className="bg-orange-500 h-20 rounded-b-lg flex items-center justify-center text-white font-bold text-2xl">
                                    3
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="card-modern overflow-hidden">
                    <table className="w-full bg-white dark:bg-gray-800">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rank</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Executive</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Trend</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Deals</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Deal</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Total Incentive</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {leaders.map((leader, idx) => (
                                <tr key={leader.name} className={`group transition-colors ${currentUserId && leader.name === auth?.user?.name ? "bg-primary-50 dark:bg-primary-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}>
                                    <td className="px-6 py-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-md transform group-hover:scale-110 transition-transform ${idx === 0 ? "bg-gradient-to-br from-yellow-300 to-yellow-600 ring-2 ring-yellow-200" :
                                            idx === 1 ? "bg-gradient-to-br from-slate-300 to-slate-500 ring-2 ring-slate-200" :
                                                idx === 2 ? "bg-gradient-to-br from-orange-400 to-amber-700 ring-2 ring-orange-200" : "bg-gray-200 text-gray-600"
                                            }`}>
                                            {idx === 0 ? "🏆" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : idx + 1}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-text-primary">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                                                {leader.name[0]}
                                            </div>
                                            {leader.name}
                                            {currentUserId && leader.name === auth?.user?.name && <span className="px-2 py-0.5 rounded text-[10px] bg-primary-200 text-primary-800">You</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {leader.trend > 0 ? (
                                            <span className="text-xs font-bold flex items-center gap-1 text-green-500">
                                                ▲ +{leader.trend}
                                            </span>
                                        ) : leader.trend < 0 ? (
                                            <span className="text-xs font-bold flex items-center gap-1 text-red-500">
                                                ▼ {leader.trend}
                                            </span>
                                        ) : (
                                            <span className="text-xs font-bold text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-text-primary font-semibold">{leader.deals}</span>
                                            <span className="text-xs text-text-muted">{leader.winRate}% of total</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-text-secondary">
                                        ₹{leader.avgDealSize.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-emerald-600 text-lg">
                                        ₹{leader.totalIncentive.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </SalesLayout>
    );
};

export default SalesLeaderboardPage;
