import SalesLayout from "../../layouts/SalesLayout";
import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useAuth } from "../../context/AuthContext";
import OnboardingChecklist from "../../components/onboarding/OnboardingChecklist";

const AdminDashboard = () => {
    const { auth } = useAuth();
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [onboardingCompleted, setOnboardingCompleted] = useState(true); // Default to true to hide checklist initially

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Pass requestorId to ensure backend knows who is asking (Global vs Org Admin)
                const requestorId = auth.user?.id;
                const url = requestorId
                    ? `/api/deals?requestorId=${requestorId}`
                    : "/api/deals";

                const res = await api.get(url);
                setDeals(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch admin data", err);
                setLoading(false);
            }
        };
        fetchData();

        // Check onboarding status for admin users
        if (auth.user && auth.user.role === "ADMIN") {
            api.get(`/api/onboarding/progress/${auth.user.id}`)
                .then(res => {
                    setOnboardingCompleted(res.data.onboardingCompleted || false);
                })
                .catch(err => {
                    console.error("Failed to fetch onboarding status", err);
                });
        }
    }, [auth.user]);

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);

    const getTimeGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    if (loading) return (
        <SalesLayout>
            <div className="flex items-center justify-center h-[80vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <p className="text-text-secondary font-medium animate-pulse">Loading Control Center...</p>
                </div>
            </div>
        </SalesLayout>
    );

    // Calculations
    const pendingDeals = deals.filter(d => (d.status || "").toLowerCase() === "submitted" || (d.status || "").toLowerCase() === "pending");
    const inProgressDeals = deals.filter(d => (d.status || "").toLowerCase() === "in_progress");
    const approvedDeals = deals.filter(d => (d.status || "").toLowerCase() === "approved");
    const rejectedDeals = deals.filter(d => (d.status || "").toLowerCase() === "rejected");
    const totalDisbursed = approvedDeals
        .filter(d => (d.payoutStatus || "").toUpperCase() === "PAID")
        .reduce((acc, d) => acc + (d.incentive || 0), 0);
    const activeUsers = new Set(deals.map(d => d.user?.id).filter(Boolean)).size;

    // High value deals requiring attention
    const highValueDeals = deals.filter(d => d.amount > 500000 && d.status !== "Approved");

    // Inactive users (mock - would need real user activity data)
    const inactiveUsers = 3;

    // Unprocessed payouts (approved but not paid)
    const unprocessedPayouts = approvedDeals.filter(d => (d.payoutStatus || "").toUpperCase() !== "PAID").length;

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
            <div className="space-y-8 animate-in fade-in duration-700 pb-10">
                {/* Onboarding Checklist for new admins */}
                {auth.user && auth.user.role === "ADMIN" && !onboardingCompleted && (
                    <OnboardingChecklist />
                )}

                {/* ADVANCED COMMAND HEADER */}
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl group">
                    {/* Dynamic Background Effects */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-600/20 via-indigo-600/10 to-transparent rounded-full blur-3xl -mr-32 -mt-32 opacity-70 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-purple-600/20 via-blue-600/10 to-transparent rounded-full blur-3xl -ml-20 -mb-20 opacity-60 group-hover:opacity-90 transition-opacity duration-1000"></div>

                    <div className="relative z-10 p-8 md:p-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                            <div>
                                <p className="text-slate-400 font-medium tracking-wide text-sm mb-2 uppercase flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    System Operational
                                </p>
                                <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">Admin Control Center</span>
                                </h1>
                                <p className="text-slate-400 text-lg">{getTimeGreeting()}, Administrator.</p>
                            </div>
                            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-2 rounded-2xl border border-white/10">
                                <span className="px-4 py-2 rounded-xl bg-primary-600/20 text-primary-300 font-bold text-sm border border-primary-500/30">v2.5.0 Enterprise</span>
                                <span className="w-px h-8 bg-white/10"></span>
                                <div className="pr-4 text-right">
                                    <p className="text-xs text-slate-400 font-medium">Server Time</p>
                                    <p className="text-white font-mono text-sm tracking-wide">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg relative overflow-hidden group/card hover:bg-white/10 transition-colors">
                                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover/card:opacity-20 transition-opacity">
                                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                </div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Deals Volume</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-extrabold text-white">{deals.length}</p>
                                    <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">Active</span>
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg relative overflow-hidden group/card hover:bg-white/10 transition-colors">
                                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover/card:opacity-20 transition-opacity">
                                    <svg className="w-16 h-16 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Pending Actions</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-extrabold text-white">{pendingDeals.length}</p>
                                    {pendingDeals.length > 0 && <span className="text-amber-400 text-xs font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">Requires Review</span>}
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg relative overflow-hidden group/card hover:bg-white/10 transition-colors">
                                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover/card:opacity-20 transition-opacity">
                                    <svg className="w-16 h-16 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Liquidated Value</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">₹{(totalDisbursed / 100000).toFixed(1)}L</p>
                                    <span className="text-slate-400 text-xs">YTD</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                {/* PRIORITY ACTION GRID */}
                <div>
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="h-8 w-1 bg-gradient-to-b from-primary-500 to-indigo-600 rounded-full"></div>
                        <h2 className="text-xl font-bold text-text-primary tracking-tight">Priority Workstation</h2>
                        <span className="text-xs font-medium text-text-muted px-2 py-1 bg-surface-2 rounded-md border border-border-subtle">Focus Areas</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {/* Pending Approvals Card */}
                        <Link to="/admin/approvals" className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${pendingDeals.length > 0 ? 'bg-gradient-to-br from-white to-amber-50/50 dark:from-surface-1 dark:to-surface-2 border-2 border-amber-200 dark:border-amber-900/50 shadow-amber-500/10' : 'bg-surface-1 border border-border-subtle hover:border-primary-300'}`}>
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                <svg className="w-24 h-24 text-text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl shadow-inner ${pendingDeals.length > 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                    </div>
                                    {pendingDeals.length > 0 && <span className="animate-pulse px-3 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-red-500/30">Action</span>}
                                </div>

                                <h3 className="text-base font-bold text-text-primary mb-1">Approval Queue</h3>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className={`text-4xl font-black ${pendingDeals.length > 0 ? 'text-amber-500 dark:text-amber-400' : 'text-text-muted'}`}>{pendingDeals.length}</span>
                                    <span className="text-xs text-text-muted font-medium mb-1.5 uppercase tracking-wide">Pending items</span>
                                </div>
                            </div>
                        </Link>

                        {/* High Value Deals */}
                        <Link to="/admin/deals" className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${highValueDeals.length > 0 ? 'bg-gradient-to-br from-white to-purple-50/50 dark:from-surface-1 dark:to-surface-2 border-2 border-purple-200 dark:border-purple-900/50 shadow-purple-500/10' : 'bg-surface-1 border border-border-subtle hover:border-primary-300'}`}>
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                <svg className="w-24 h-24 text-text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl shadow-inner ${highValueDeals.length > 0 ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-purple-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                    </div>
                                    {highValueDeals.length > 0 && <span className="px-3 py-1 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 text-[10px] font-bold uppercase tracking-widest rounded-full border border-purple-200 dark:border-purple-800">Premium</span>}
                                </div>

                                <h3 className="text-base font-bold text-text-primary mb-1">High Value Monitor</h3>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className={`text-4xl font-black ${highValueDeals.length > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-text-muted'}`}>{highValueDeals.length}</span>
                                    <span className="text-xs text-text-muted font-medium mb-1.5 uppercase tracking-wide">Deals &gt; ₹5L</span>
                                </div>
                            </div>
                        </Link>

                        {/* Unprocessed Payouts */}
                        <Link to="/admin/payouts" className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${unprocessedPayouts > 0 ? 'bg-gradient-to-br from-white to-emerald-50/50 dark:from-surface-1 dark:to-surface-2 border-2 border-emerald-200 dark:border-emerald-900/50 shadow-emerald-500/10' : 'bg-surface-1 border border-border-subtle hover:border-primary-300'}`}>
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                <svg className="w-24 h-24 text-text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl shadow-inner ${unprocessedPayouts > 0 ? 'bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-emerald-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    {unprocessedPayouts > 0 && <span className="px-3 py-1 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-200 dark:border-emerald-800">Disbursement</span>}
                                </div>

                                <h3 className="text-base font-bold text-text-primary mb-1">Payout Processing</h3>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className={`text-4xl font-black ${unprocessedPayouts > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-text-muted'}`}>{unprocessedPayouts}</span>
                                    <span className="text-xs text-text-muted font-medium mb-1.5 uppercase tracking-wide">Ready to pay</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* OPERATIONAL MATRIX */}
                <div className="bg-surface-1 rounded-3xl border border-border-subtle shadow-xl p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-8 w-1 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                        <h2 className="text-xl font-bold text-text-primary tracking-tight">Operational Matrix</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { to: "/admin/users", label: "Manage Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", color: "blue" },
                            { to: "/admin/deals", label: "Review Deals", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", color: "purple" },
                            { to: "/admin/simulation", label: "Simulator", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z", color: "emerald" },
                            { to: "/admin/policy", label: "Policies", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "amber" },
                            { to: "/admin/audit-logs", label: "Audit Logs", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01", color: "gray" },
                            { to: "/admin/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", color: "red" },
                        ].map((item, i) => (
                            <Link key={i} to={item.to} className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-surface-2 hover:bg-surface-3 border border-border-subtle hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <div className={`p-4 rounded-xl transition-transform duration-300 group-hover:scale-110 bg-${item.color}-50 dark:bg-${item.color}-900/10 text-${item.color}-600 dark:text-${item.color}-400 group-hover:bg-${item.color}-100 dark:group-hover:bg-${item.color}-900/30`}>
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                                </div>
                                <span className="text-xs font-bold text-text-primary text-center uppercase tracking-wide opacity-80 group-hover:opacity-100">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* INTELLIGENCE PANEL */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* System Health */}
                    <div className="lg:col-span-1 bg-surface-1 rounded-3xl border border-border-subtle shadow-xl p-6 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-subtle">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-text-primary">System Vitals</h3>
                        </div>

                        <div className="space-y-4 flex-1">
                            {oldPendingDeals.length > 0 ? (
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 rounded-r-xl flex gap-3 shadow-sm">
                                    <span className="text-2xl">⚠️</span>
                                    <div>
                                        <p className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-1">Approval Bottleneck</p>
                                        <p className="text-xs text-amber-800 dark:text-amber-200">{oldPendingDeals.length} deals pending &gt; 3 days</p>
                                    </div>
                                </div>
                            ) : null}

                            {inactiveUsers > 0 ? (
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 rounded-r-xl flex gap-3 shadow-sm">
                                    <span className="text-2xl">💤</span>
                                    <div>
                                        <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">User Inactivity</p>
                                        <p className="text-xs text-blue-800 dark:text-blue-200">{inactiveUsers} sales reps inactive &gt; 7 days</p>
                                    </div>
                                </div>
                            ) : null}

                            {oldPendingDeals.length === 0 && inactiveUsers === 0 && (
                                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border-l-4 border-emerald-500 rounded-r-xl flex gap-3 shadow-sm items-center h-full justify-center flex-col text-center">
                                    <span className="text-4xl mb-2">✅</span>
                                    <div>
                                        <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100 mb-1">All Systems Optimal</p>
                                        <p className="text-xs text-emerald-800 dark:text-emerald-200">No anomalies detected</p>
                                    </div>
                                </div>
                            )}

                            {/* Deal Status Chart */}
                            <div className="pt-6 mt-4 border-t border-border-subtle">
                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Deal Velocity</p>
                                <div className="h-40">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value" stroke="none">
                                                {statusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Snapshot */}
                    <div className="lg:col-span-2 bg-surface-1 rounded-3xl border border-border-subtle shadow-xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-text-primary tracking-tight">Enterprise Performance</h3>
                            </div>
                            <Link to="/admin/performance" className="px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 text-xs font-bold text-primary-600 uppercase tracking-wider transition-colors">
                                Full Analytics →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="p-6 bg-surface-2 rounded-2xl border border-border-subtle relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-2">Approval Rate</p>
                                <p className="text-4xl font-black text-emerald-600">{approvalRate}%</p>
                                <div className="mt-2 text-xs font-medium text-emerald-600/80 flex items-center gap-1">
                                    <span className="bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded">High efficiency</span>
                                </div>
                            </div>

                            <div className="p-6 bg-surface-2 rounded-2xl border border-border-subtle relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-16 h-16 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-2">Avg Deal Size</p>
                                <p className="text-4xl font-black text-indigo-600">₹{(avgDealSize / 100000).toFixed(1)}L</p>
                                <div className="mt-2 text-xs font-medium text-indigo-600/80 flex items-center gap-1">
                                    <span className="bg-indigo-100 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded">Solid growth</span>
                                </div>
                            </div>

                            <div className="p-6 bg-surface-2 rounded-2xl border border-border-subtle relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </div>
                                <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-2">Active Workforce</p>
                                <p className="text-4xl font-black text-blue-600">{activeUsers}</p>
                                <div className="mt-2 text-xs font-medium text-blue-600/80 flex items-center gap-1">
                                    <span className="bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">Engaged users</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4 border-b border-border-subtle pb-2">Top Contributing Talent</p>
                            <div className="space-y-3">
                                {topPerformers.map((user, idx) => (
                                    <div key={user.name} className="flex items-center justify-between p-4 bg-surface-2 rounded-2xl border border-border-subtle hover:border-primary-500/50 transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-xl ${idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-yellow-500/30' : idx === 1 ? "bg-gradient-to-br from-slate-300 to-slate-500 shadow-slate-500/30" : "bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-500/30"}`}>
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="font-bold text-text-primary text-lg">{user.name}</p>
                                                <p className="text-xs text-text-muted font-medium bg-surface-3 inline-block px-2 py-0.5 rounded-md">{user.deals} deals closed this period</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-black text-emerald-600 text-xl block">₹{user.incentive.toLocaleString()}</span>
                                            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Incentive</span>
                                        </div>
                                    </div>
                                ))}
                                {topPerformers.length === 0 && <p className="text-text-muted text-sm italic py-4 text-center">No performance data triggered yet.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SalesLayout>
    );
};

export default AdminDashboard;
