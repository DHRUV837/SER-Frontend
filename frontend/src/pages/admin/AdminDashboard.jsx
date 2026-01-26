import SalesLayout from "../../layouts/SalesLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AdminDashboard = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:8080/deals");
                setDeals(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch admin data", err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <SalesLayout><div className="p-8 text-center">Loading Dashboard...</div></SalesLayout>;

    // Calculations
    const pendingDeals = deals.filter(d => (d.status || "").toLowerCase() === "submitted" || (d.status || "").toLowerCase() === "pending");
    const inProgressDeals = deals.filter(d => (d.status || "").toLowerCase() === "in_progress");
    const approvedDeals = deals.filter(d => (d.status || "").toLowerCase() === "approved");
    const rejectedDeals = deals.filter(d => (d.status || "").toLowerCase() === "rejected");
    const totalDisbursed = approvedDeals.reduce((acc, d) => acc + (d.incentive || 0), 0);
    const activeUsers = new Set(deals.map(d => d.user?.id).filter(Boolean)).size;

    // High value deals requiring attention
    const highValueDeals = deals.filter(d => d.amount > 500000 && d.status !== "Approved");

    // Inactive users (mock - would need real user activity data)
    const inactiveUsers = 3;

    // Unprocessed payouts (approved but not paid)
    const unprocessedPayouts = approvedDeals.filter(d => !d.paid).length;

    // Chart data
    const statusData = [
        { name: "Approved", value: approvedDeals.length, color: "#10B981" },
        { name: "Pending", value: pendingDeals.length, color: "#F59E0B" },
        { name: "Rejected", value: rejectedDeals.length, color: "#EF4444" },
        { name: "In Progress", value: inProgressDeals.length, color: "#6366F1" },
    ].filter(d => d.value > 0);

    // Top performers
    const userStats = {};
    approvedDeals.forEach(d => {
        if (!d.user) return;
        if (!userStats[d.user.id]) userStats[d.user.id] = { name: d.user.name, incentive: 0, deals: 0 };
        userStats[d.user.id].incentive += (d.incentive || 0);
        userStats[d.user.id].deals += 1;
    });
    const topPerformers = Object.values(userStats).sort((a, b) => b.incentive - a.incentive).slice(0, 3);

    // System health checks
    const oldPendingDeals = pendingDeals.filter(d => {
        const dealDate = new Date(d.date || d.createdAt);
        const daysDiff = (new Date() - dealDate) / (1000 * 60 * 60 * 24);
        return daysDiff > 3;
    });

    const approvalRate = deals.length > 0 ? ((approvedDeals.length / deals.length) * 100).toFixed(1) : 0;
    const avgDealSize = deals.length > 0 ? (deals.reduce((sum, d) => sum + (d.amount || 0), 0) / deals.length) : 0;

    return (
        <SalesLayout>
            <div className="space-y-6 animate-in fade-in duration-500">

                {/* COMMAND HEADER */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-indigo-600 to-purple-600 p-8 shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-extrabold text-white mb-2">Admin Control Center</h1>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                    <span className="text-emerald-100 text-sm font-medium">System Operational</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <p className="text-white/80 text-xs uppercase tracking-wider mb-1">Total Deals</p>
                                <p className="text-4xl font-extrabold text-white">{deals.length}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <p className="text-white/80 text-xs uppercase tracking-wider mb-1">Pending Approvals</p>
                                <p className="text-4xl font-extrabold text-white">{pendingDeals.length}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <p className="text-white/80 text-xs uppercase tracking-wider mb-1">Total Disbursed</p>
                                <p className="text-4xl font-extrabold text-white">₹{(totalDisbursed / 100000).toFixed(1)}L</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PRIORITY ACTION CARDS */}
                <div className="card-modern p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-text-primary">Priority Actions</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Pending Approvals */}
                        <Link to="/admin/approvals" className={`group relative overflow-hidden rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl ${pendingDeals.length > 0 ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-300 dark:border-amber-700' : 'bg-surface-2 border border-border-subtle'}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${pendingDeals.length > 0 ? 'bg-amber-500' : 'bg-gray-400'}`}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                {pendingDeals.length > 0 && (
                                    <span className="animate-pulse px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">URGENT</span>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-2">Pending Approvals</h3>
                            <p className="text-4xl font-extrabold text-amber-600 mb-2">{pendingDeals.length}</p>
                            <p className="text-xs text-text-muted">Deals awaiting your review</p>
                        </Link>

                        {/* High Value Deals */}
                        <Link to="/admin/deals" className={`group relative overflow-hidden rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl ${highValueDeals.length > 0 ? 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-2 border-purple-300 dark:border-purple-700' : 'bg-surface-2 border border-border-subtle'}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${highValueDeals.length > 0 ? 'bg-purple-500' : 'bg-gray-400'}`}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-2">High Value Deals</h3>
                            <p className="text-4xl font-extrabold text-purple-600 mb-2">{highValueDeals.length}</p>
                            <p className="text-xs text-text-muted">Deals over ₹5L requiring attention</p>
                        </Link>

                        {/* Inactive Users */}
                        <Link to="/admin/users" className={`group relative overflow-hidden rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl ${inactiveUsers > 0 ? 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-300 dark:border-blue-700' : 'bg-surface-2 border border-border-subtle'}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${inactiveUsers > 0 ? 'bg-blue-500' : 'bg-gray-400'}`}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-2">Inactive Users</h3>
                            <p className="text-4xl font-extrabold text-blue-600 mb-2">{inactiveUsers}</p>
                            <p className="text-xs text-text-muted">Sales reps inactive &gt; 7 days</p>
                        </Link>

                        {/* Unprocessed Payouts */}
                        <Link to="/admin/payouts" className={`group relative overflow-hidden rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl ${unprocessedPayouts > 0 ? 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-2 border-emerald-300 dark:border-emerald-700' : 'bg-surface-2 border border-border-subtle'}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${unprocessedPayouts > 0 ? 'bg-emerald-500' : 'bg-gray-400'}`}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-2">Unprocessed Payouts</h3>
                            <p className="text-4xl font-extrabold text-emerald-600 mb-2">{unprocessedPayouts}</p>
                            <p className="text-xs text-text-muted">Approved deals pending payout</p>
                        </Link>

                        {/* In Progress */}
                        <Link to="/admin/deals" className="group relative overflow-hidden rounded-xl p-6 bg-surface-2 border border-border-subtle transition-all hover:-translate-y-1 hover:shadow-xl">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-indigo-500 rounded-xl">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-2">In Progress</h3>
                            <p className="text-4xl font-extrabold text-indigo-600 mb-2">{inProgressDeals.length}</p>
                            <p className="text-xs text-text-muted">Deals being worked on</p>
                        </Link>

                        {/* Policy Updates */}
                        <Link to="/admin/policy" className="group relative overflow-hidden rounded-xl p-6 bg-surface-2 border border-border-subtle transition-all hover:-translate-y-1 hover:shadow-xl">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-gray-500 rounded-xl">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-2">Policy Management</h3>
                            <p className="text-4xl font-extrabold text-gray-600 mb-2">→</p>
                            <p className="text-xs text-text-muted">Review and update policies</p>
                        </Link>
                    </div>
                </div>

                {/* OPERATIONAL SHORTCUTS */}
                <div className="card-modern p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-text-primary">Quick Actions</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <Link to="/admin/users" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border-subtle hover:border-primary-500 transition-all group">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            </div>
                            <span className="text-xs font-bold text-text-primary text-center">Manage Users</span>
                        </Link>

                        <Link to="/admin/deals" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border-subtle hover:border-primary-500 transition-all group">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                            </div>
                            <span className="text-xs font-bold text-text-primary text-center">Review Deals</span>
                        </Link>

                        <Link to="/admin/simulation" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border-subtle hover:border-primary-500 transition-all group">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            </div>
                            <span className="text-xs font-bold text-text-primary text-center">Run Simulation</span>
                        </Link>

                        <Link to="/admin/policy" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border-subtle hover:border-primary-500 transition-all group">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <span className="text-xs font-bold text-text-primary text-center">Update Policies</span>
                        </Link>

                        <Link to="/admin/audit-logs" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border-subtle hover:border-primary-500 transition-all group">
                            <div className="p-3 bg-gray-100 dark:bg-gray-900/30 rounded-xl group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            </div>
                            <span className="text-xs font-bold text-text-primary text-center">View Audit</span>
                        </Link>

                        <Link to="/admin/settings" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border-subtle hover:border-primary-500 transition-all group">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
                            </div>
                            <span className="text-xs font-bold text-text-primary text-center">Settings</span>
                        </Link>
                    </div>
                </div>

                {/* SYSTEM HEALTH & PERFORMANCE */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* System Health */}
                    <div className="lg:col-span-1 card-modern p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-text-primary">System Health</h3>
                        </div>

                        <div className="space-y-4">
                            {oldPendingDeals.length > 0 && (
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-lg">
                                    <p className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-1">⚠️ Approval Bottleneck</p>
                                    <p className="text-xs text-amber-800 dark:text-amber-200">{oldPendingDeals.length} deals pending &gt; 3 days</p>
                                </div>
                            )}

                            {inactiveUsers > 0 && (
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                                    <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">👥 User Inactivity</p>
                                    <p className="text-xs text-blue-800 dark:text-blue-200">{inactiveUsers} sales reps inactive &gt; 7 days</p>
                                </div>
                            )}

                            {oldPendingDeals.length === 0 && inactiveUsers === 0 && (
                                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 rounded-r-lg">
                                    <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100 mb-1">✅ All Systems Healthy</p>
                                    <p className="text-xs text-emerald-800 dark:text-emerald-200">No critical issues detected</p>
                                </div>
                            )}

                            {/* Deal Status Chart */}
                            <div className="pt-4 border-t border-border-subtle">
                                <p className="text-sm font-bold text-text-primary mb-3">Deal Distribution</p>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                                                {statusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Snapshot */}
                    <div className="lg:col-span-2 card-modern p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-text-primary">Performance Overview</h3>
                            <Link to="/admin/performance" className="ml-auto text-sm text-primary-600 hover:text-primary-700 font-medium">View Detailed Analytics →</Link>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="p-4 bg-surface-2 rounded-xl border border-border-subtle">
                                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Approval Rate</p>
                                <p className="text-3xl font-extrabold text-emerald-600">{approvalRate}%</p>
                            </div>
                            <div className="p-4 bg-surface-2 rounded-xl border border-border-subtle">
                                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Avg Deal Size</p>
                                <p className="text-3xl font-extrabold text-indigo-600">₹{(avgDealSize / 100000).toFixed(1)}L</p>
                            </div>
                            <div className="p-4 bg-surface-2 rounded-xl border border-border-subtle">
                                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Active Users</p>
                                <p className="text-3xl font-extrabold text-blue-600">{activeUsers}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-bold text-text-primary mb-4">🏆 Top Performers</p>
                            <div className="space-y-3">
                                {topPerformers.map((user, idx) => (
                                    <div key={user.name} className="flex items-center justify-between p-4 bg-surface-2 rounded-xl border border-border-subtle hover:border-primary-500 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg ${idx === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" : idx === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500" : "bg-gradient-to-br from-orange-400 to-orange-600"}`}>
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="font-bold text-text-primary">{user.name}</p>
                                                <p className="text-xs text-text-muted">{user.deals} deals closed</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-emerald-600 text-lg">₹{user.incentive.toLocaleString()}</span>
                                    </div>
                                ))}
                                {topPerformers.length === 0 && <p className="text-text-muted text-sm">No performance data available.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SalesLayout>
    );
};

export default AdminDashboard;
