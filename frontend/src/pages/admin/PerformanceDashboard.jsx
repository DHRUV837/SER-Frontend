import AdminLayout from "../../layouts/AdminLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

const PerformanceDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { auth } = useAuth();

    useEffect(() => {
        if (!auth?.user?.id) return;

        const fetchData = async () => {
            try {
                const userId = auth.user.id;
                // Parallel fetch for users and all deals to compute metrics
                const [usersRes, dealsRes] = await Promise.all([
                    api.get("/api/users", {
                        params: { currentUserId: userId }
                    }),
                    api.get("/api/deals", {
                        params: { requestorId: userId }
                    })
                ]);

                const salesUsers = usersRes.data.filter(u => u.role === 'SALES');
                const allDeals = dealsRes.data;

                // Compute metrics per user
                const userMetrics = salesUsers.map(user => {
                    const userDeals = allDeals.filter(d => d.user && d.user.id === user.id);
                    const approvedDeals = userDeals.filter(d => (d.status || "").toLowerCase() === 'approved');

                    const totalRevenue = approvedDeals.reduce((sum, d) => sum + (d.amount || 0), 0);
                    const totalIncentive = approvedDeals.reduce((sum, d) => sum + (d.incentive || 0), 0);
                    const dealsCount = approvedDeals.length;

                    // Simple Tier Logic based on Revenue
                    let tier = 'Bronze';
                    if (totalRevenue > 5000000) tier = 'Diamond'; // 50L
                    else if (totalRevenue > 2500000) tier = 'Platinum'; // 25L
                    else if (totalRevenue > 1000000) tier = 'Gold'; // 10L
                    else if (totalRevenue > 500000) tier = 'Silver'; // 5L

                    return {
                        ...user,
                        stats: {
                            revenue: totalRevenue,
                            incentive: totalIncentive,
                            count: dealsCount
                        },
                        tier
                    };
                });

                // Sort by Revenue DESC
                const sortedUsers = userMetrics.sort((a, b) => b.stats.revenue - a.stats.revenue);
                setUsers(sortedUsers);
            } catch (error) {
                console.error("Failed to fetch performance data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [auth.user]);

    const getTierColor = (tier) => {
        switch (tier) {
            case 'Diamond': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
            case 'Platinum': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Gold': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Silver': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-orange-100 text-orange-700 border-orange-200';
        }
    };

    const getRankIcon = (index) => {
        if (index === 0) return "👑";
        if (index === 1) return "🥈";
        if (index === 2) return "🥉";
        return `#${index + 1}`;
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in duration-500 pb-10">

                {/* HERO HEADER */}
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-8 md:p-10">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Sales Force Performance</h1>
                            <p className="text-slate-400">Comprehensive analytics on team efficiency, revenue generation, and rank distribution.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-right">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Top Performer</p>
                                <p className="text-xl font-bold text-emerald-400">{users[0]?.name || "-"}</p>
                            </div>
                            <div className="h-10 w-px bg-white/10"></div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Revenue</p>
                                <p className="text-xl font-bold text-white">₹{(users.reduce((acc, u) => acc + u.stats.revenue, 0) / 100000).toFixed(1)}L</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PODIUM (Top 3) */}
                {!loading && users.length >= 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end relative px-4">
                        {/* 2nd Place */}
                        <div className="order-2 md:order-1 bg-surface-1 rounded-2xl p-6 border border-border-subtle shadow-lg flex flex-col items-center relative hover:-translate-y-2 transition-transform duration-300">
                            <div className="absolute -top-5 w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center text-xl shadow-lg font-bold border-4 border-surface-1">2</div>
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 mb-4 flex items-center justify-center text-slate-700 font-bold text-2xl">
                                {users[1].name.charAt(0)}
                            </div>
                            <h3 className="text-lg font-bold text-text-primary text-center leading-tight">{users[1].name}</h3>
                            <p className="text-sm text-text-muted mb-3">{users[1].stats.count} Deals</p>
                            <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-center border border-slate-200 dark:border-slate-800">
                                <p className="text-xs text-slate-500 font-bold uppercase">Revenue</p>
                                <p className="text-lg font-black text-slate-700 dark:text-slate-300">₹{(users[1].stats.revenue / 100000).toFixed(1)}L</p>
                            </div>
                        </div>

                        {/* 1st Place */}
                        <div className="order-1 md:order-2 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-900/10 dark:to-surface-1 rounded-2xl p-8 border-2 border-indigo-200 dark:border-indigo-800 shadow-xl flex flex-col items-center relative z-10 transform scale-105 hover:-translate-y-2 transition-transform duration-300">
                            <div className="absolute -top-6 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl shadow-lg border-4 border-surface-1">👑</div>
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 mb-4 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-orange-500/20">
                                {users[0].name.charAt(0)}
                            </div>
                            <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 text-center leading-tight">{users[0].name}</h3>
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold mb-4 mt-1">Diamond Tier</span>

                            <div className="w-full bg-white dark:bg-slate-900 rounded-xl p-4 text-center border border-indigo-100 dark:border-indigo-900 shadow-sm">
                                <p className="text-xs text-indigo-500 font-bold uppercase">Total Revenue</p>
                                <p className="text-2xl font-black text-indigo-700 dark:text-indigo-300">₹{(users[0].stats.revenue / 100000).toFixed(1)}L</p>
                                <div className="mt-2 text-xs text-slate-400 font-medium">+ ₹{users[0].stats.incentive.toLocaleString()} Incentive</div>
                            </div>
                        </div>

                        {/* 3rd Place */}
                        <div className="order-3 bg-surface-1 rounded-2xl p-6 border border-border-subtle shadow-lg flex flex-col items-center relative hover:-translate-y-2 transition-transform duration-300">
                            <div className="absolute -top-5 w-10 h-10 bg-orange-300 rounded-full flex items-center justify-center text-xl shadow-lg font-bold border-4 border-surface-1">3</div>
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-200 to-orange-400 mb-4 flex items-center justify-center text-orange-800 font-bold text-2xl">
                                {users[2].name.charAt(0)}
                            </div>
                            <h3 className="text-lg font-bold text-text-primary text-center leading-tight">{users[2].name}</h3>
                            <p className="text-sm text-text-muted mb-3">{users[2].stats.count} Deals</p>
                            <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl p-3 text-center border border-slate-200 dark:border-slate-800">
                                <p className="text-xs text-slate-500 font-bold uppercase">Revenue</p>
                                <p className="text-lg font-black text-slate-700 dark:text-slate-300">₹{(users[2].stats.revenue / 100000).toFixed(1)}L</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Full List */}
                <div className="bg-surface-1 rounded-3xl border border-border-subtle shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-border-subtle flex justify-between items-center">
                        <h2 className="text-xl font-bold text-text-primary">Performance Roster</h2>
                        <span className="text-xs font-bold text-text-muted bg-surface-2 px-2 py-1 rounded-md">{users.length} Executives</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-2/50 text-xs font-bold text-text-muted uppercase tracking-wider">
                                    <th className="px-6 py-4 w-20 text-center">Rank</th>
                                    <th className="px-6 py-4">Executive</th>
                                    <th className="px-6 py-4 text-center">Tier</th>
                                    <th className="px-6 py-4 text-right">Revenue</th>
                                    <th className="px-6 py-4 text-right">Incentive</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                                {loading ? (
                                    <tr><td colSpan="6" className="p-8 text-center text-text-muted">Analyzing performance data...</td></tr>
                                ) : (
                                    users.map((user, idx) => (
                                        <tr key={user.id} className='group hover:bg-surface-2 transition-colors cursor-pointer' onClick={() => navigate(`/admin/performance/${user.id}`)}>
                                            <td className="px-6 py-4 text-center font-bold text-text-secondary group-hover:text-primary-600">
                                                {getRankIcon(idx)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-indigo-200 dark:from-primary-900/30 dark:to-indigo-900/30 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-sm">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-text-primary text-sm group-hover:text-primary-600 transition-colors">{user.name}</p>
                                                        <p className="text-xs text-text-muted">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getTierColor(user.tier)}`}>
                                                    {user.tier}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-text-primary">
                                                ₹{user.stats.revenue.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-emerald-600">
                                                ₹{user.stats.incentive.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-primary-600 hover:text-primary-800 text-xs font-bold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Analyze →
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default PerformanceDashboard;
