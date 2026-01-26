import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import AdminLayout from "../../layouts/AdminLayout";

const AdminPerformance = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);

    // Filter State
    const [searchTerm, setSearchTerm] = useState("");

    // --- Helper for Date Ranges ---
    const getLast6MonthsLabels = () => {
        const months = [];
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            // Format YYYY-MM
            const monthStr = d.toISOString().slice(0, 7);
            months.push(monthStr);
        }
        return months;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch User Profile
                const userRes = await axios.get(`http://localhost:8080/api/users/${userId}`)
                    .catch(() => ({ data: { name: "Sales Executive", email: "N/A" } }));
                setUserProfile(userRes.data);

                // 2. Fetch Deals
                // Fallback to fetching all deals and filtering in JS if query param specific to user fails
                let allDeals = [];
                try {
                    const dealsRes = await axios.get(`http://localhost:8080/deals?userId=${userId}`);
                    allDeals = dealsRes.data || [];
                } catch (e) {
                    // Fallback: fetch all and filter locally
                    const dealsRes = await axios.get(`http://localhost:8080/deals`);
                    allDeals = (dealsRes.data || []).filter(d => d.user?.id == userId || d.userId == userId);
                }

                // Sort deals by date desc
                const sortedDeals = allDeals.sort((a, b) => {
                    const dateA = new Date(a.date || a.createdAt || 0);
                    const dateB = new Date(b.date || b.createdAt || 0);
                    return dateB - dateA;
                });
                setDeals(sortedDeals);

                // 3. Compute Metrics
                // Robust parsing of amount/incentive
                const approved = sortedDeals.filter(d => (d.status || "").toLowerCase() === 'approved');
                const totalRev = approved.reduce((acc, d) => acc + (parseFloat(d.amount) || 0), 0);
                const totalInc = approved.reduce((acc, d) => acc + (parseFloat(d.incentive) || 0), 0);
                const avgDeal = approved.length ? totalRev / approved.length : 0;

                // 4. Compute Monthly Trend (Robust Date Parsing)
                const monthLabels = getLast6MonthsLabels();
                const trendMap = {};

                // Initialize with 0
                monthLabels.forEach(m => trendMap[m] = 0);

                // Populate with data
                approved.forEach(deal => {
                    const rawDate = deal.date || deal.createdAt;
                    if (rawDate) {
                        try {
                            const d = new Date(rawDate);
                            if (!isNaN(d.getTime())) {
                                const yyyyMM = d.toISOString().slice(0, 7);
                                if (trendMap.hasOwnProperty(yyyyMM)) {
                                    trendMap[yyyyMM] += (parseFloat(deal.incentive) || 0);
                                }
                            }
                        } catch (e) {
                            console.warn("Invalid date format", rawDate);
                        }
                    }
                });

                const chartData = monthLabels.map(m => ({ month: m, incentiveSum: trendMap[m] }));

                setData({
                    totalDeals: sortedDeals.length,
                    approvedDeals: approved.length,
                    totalIncentiveEarned: totalInc,
                    approvalRate: sortedDeals.length ? (approved.length / sortedDeals.length) * 100 : 0,
                    averageDealValue: avgDeal,
                    monthlyTrend: chartData
                });

            } catch (err) {
                console.error("Error fetching performance details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    // Derived Data Safe Access
    const {
        totalDeals = 0,
        approvedDeals = 0,
        approvalRate = 0,
        totalIncentiveEarned = 0,
        averageDealValue = 0,
        monthlyTrend = []
    } = data || {};

    // Tier Logic
    const getTier = (rev) => {
        if (rev >= 5000000) return { name: 'Diamond', color: 'from-cyan-400 to-blue-500', bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' };
        if (rev >= 2500000) return { name: 'Platinum', color: 'from-slate-300 to-slate-500', bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' };
        if (rev >= 1000000) return { name: 'Gold', color: 'from-yellow-400 to-amber-500', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' };
        return { name: 'Silver', color: 'from-slate-200 to-slate-400', bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200' };
    };

    // Total Revenue for Tier Calculation
    const totalRevenue = deals
        .filter(d => (d.status || "").toLowerCase() === 'approved')
        .reduce((acc, d) => acc + (parseFloat(d.amount) || 0), 0);

    const tier = getTier(totalRevenue);

    // Filtered Table Data
    const filteredDeals = useMemo(() => {
        return deals.filter(deal => {
            const searchLower = searchTerm.toLowerCase();
            const dealDate = deal.date || deal.createdAt || "N/A";
            return (
                (deal.clientName || "").toLowerCase().includes(searchLower) ||
                (deal.status || "").toLowerCase().includes(searchLower) ||
                (deal.amount?.toString() || "").includes(searchLower) ||
                dealDate.toLowerCase().includes(searchLower)
            );
        });
    }, [deals, searchTerm]);

    // --- Chart Data Configuration ---
    const lineChartData = {
        labels: monthlyTrend.map(t => {
            // Convert YYYY-MM
            const [y, m] = t.month.split('-');
            const date = new Date(parseInt(y), parseInt(m) - 1);
            return date.toLocaleString('default', { month: 'short' });
        }),
        datasets: [{
            label: 'Incentive Earned',
            data: monthlyTrend.map(t => t.incentiveSum),
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
                gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
                return gradient;
            },
            borderColor: '#10B981',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#10B981',
            pointRadius: 6,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#10B981',
            pointHoverBorderColor: '#FFFFFF'
        }]
    };

    const doughnutData = {
        labels: ['Approved', 'Pending', 'Rejected'],
        datasets: [{
            data: [
                approvedDeals,
                totalDeals - approvedDeals - deals.filter(d => (d.status || "").toLowerCase() === 'rejected').length,
                deals.filter(d => (d.status || "").toLowerCase() === 'rejected').length
            ],
            backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
            borderWidth: 0,
            hoverOffset: 10
        }]
    };

    if (loading) return (
        <AdminLayout>
            <div className="flex flex-col items-center justify-center h-[80vh]">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                <p className="text-text-muted font-medium">Calibrating Sales Metrics...</p>
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-700 font-sans">

                {/* NAV HEADER */}
                <div className="mb-6 flex items-center gap-2">
                    <button onClick={() => navigate('/admin/performance')} className="text-sm font-bold text-text-muted hover:text-primary-600 transition-colors flex items-center gap-1 group">
                        <span className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </span>
                        <span>Performance Roster</span>
                    </button>
                    <span className="text-text-muted/50">/</span>
                    <span className="text-sm font-bold text-text-primary uppercase tracking-wide">Analyst View</span>
                </div>

                {/* HERO PROFILE SECTION */}
                <div className="bg-surface-1 rounded-3xl border border-border-subtle shadow-xl overflow-hidden mb-8 relative group">
                    <div className="h-40 bg-slate-900 absolute top-0 w-full z-0 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900/80 opacity-100"></div>
                        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full mix-blend-screen opacity-70 animate-pulse"></div>
                        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full mix-blend-screen"></div>
                    </div>

                    <div className="relative z-10 px-8 pt-20 pb-8 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
                        <div className="flex items-end gap-6">
                            <div className="w-32 h-32 rounded-3xl bg-surface-1 p-1.5 shadow-2xl rotate-2 transition-transform duration-500 hover:rotate-0">
                                <div className={`w-full h-full bg-gradient-to-br ${tier.color} rounded-2xl flex items-center justify-center text-white text-5xl font-black shadow-inner relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
                                    {userProfile?.name?.charAt(0) || "U"}
                                </div>
                            </div>
                            <div className="mb-2">
                                <h1 className="text-4xl font-black text-text-primary tracking-tight mb-2">{userProfile?.name || "Unknown User"}</h1>
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-text-muted font-medium bg-surface-2 px-3 py-1 rounded-full text-xs border border-border-subtle flex items-center gap-2">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        {userProfile?.email}
                                    </span>
                                    <span className={`font-bold text-xs uppercase ${tier.bg} ${tier.text} ${tier.border} border px-3 py-1 rounded-full flex items-center gap-1`}>
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.699-3.181a1 1 0 011.827.954L16.25 7l2.163 1.583a1 1 0 01-1.127 1.832L15 10l2.286.415a1 1 0 01-1.127 1.832L14 13l2.81 5.28a1 1 0 01-1.827.954L10 16.323V17a1 1 0 11-2 0v-.677l-4.983 2.912a1 1 0 01-1.827-.954L6 13l-2.286-.415a1 1 0 01-1.127-1.832L4.75 10 2.587 8.417a1 1 0 01-1.127-1.832l2.163-1.583L1.828 2.553a1 1 0 011.827-.954L5.606 4.777 9.56 3.195a1 1 0 01.386-.118V2a1 1 0 011-1z" clipRule="evenodd" /></svg>
                                        {tier.name} Tier
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="flex-1 md:flex-none text-right p-5 bg-surface-2/50 backdrop-blur-sm rounded-2xl border border-border-subtle group-hover:bg-surface-2 transition-colors">
                                <p className="text-[10px] uppercase font-bold text-text-muted tracking-wide mb-1 opacity-70">Lifetime Revenue</p>
                                <p className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">₹{(totalRevenue / 100000).toFixed(2)}<span className="text-lg text-text-muted font-bold">L</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* METRICS GRID */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Incentive Earned", value: `₹${(totalIncentiveEarned / 1000).toFixed(1)}k`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-emerald-600", bg: "bg-emerald-100", trend: "+15% vs L3M" },
                        { label: "Close Rate", value: `${approvalRate.toFixed(0)}%`, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-blue-600", bg: "bg-blue-100", trend: "High Conv." },
                        { label: "Avg Deal Size", value: `₹${(averageDealValue / 1000).toFixed(0)}k`, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: "text-purple-600", bg: "bg-purple-100", trend: "Premium" },
                        { label: "Volume (Closed)", value: approvedDeals, sub: `/ ${totalDeals}`, icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", color: "text-amber-600", bg: "bg-amber-100", trend: "Active" }
                    ].map((metric, i) => (
                        <div key={i} className="p-6 bg-surface-1 rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
                                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d={metric.icon} /></svg>
                            </div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-4">
                                    <div className={`p-2.5 ${metric.bg} dark:${metric.bg.replace('100', '900/30')} ${metric.color} rounded-xl`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={metric.icon} /></svg>
                                    </div>
                                    <span className="text-[10px] font-bold bg-surface-2 px-2 py-1 rounded-md text-text-muted uppercase tracking-wider">{metric.trend}</span>
                                </div>
                                <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-1">{metric.label}</p>
                                <div className="flex items-baseline gap-1">
                                    <p className="text-3xl font-black text-text-primary tracking-tight">{metric.value}</p>
                                    {metric.sub && <span className="text-sm font-medium text-text-muted">{metric.sub}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 p-8 bg-surface-1 rounded-3xl border border-border-subtle shadow-lg relative">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-text-primary">Incentive Performance</h3>
                                <p className="text-sm text-text-muted">6-month earnings trajectory</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                <span className="text-xs font-bold text-text-muted">Incentives</span>
                            </div>
                        </div>
                        <div className="h-72 w-full">
                            <Line
                                data={lineChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            grid: { color: '#e2e8f030', display: true },
                                            ticks: { font: { weight: 'bold' }, color: '#94a3b8' }
                                        },
                                        x: {
                                            grid: { display: false },
                                            ticks: { font: { weight: 'bold' }, color: '#94a3b8' }
                                        }
                                    },
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: {
                                            backgroundColor: '#1e293b',
                                            padding: 12,
                                            titleFont: { size: 13, weight: 'bold' },
                                            bodyFont: { size: 12 },
                                            cornerRadius: 8,
                                            displayColors: false
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="p-8 bg-surface-1 rounded-3xl border border-border-subtle shadow-lg flex flex-col items-center justify-center">
                        <h3 className="text-lg font-bold text-text-primary mb-2 w-full text-center">Deal Portfolio</h3>
                        <p className="text-xs text-text-muted mb-8 w-full text-center uppercase tracking-wide">Status Distribution</p>

                        <div className="h-56 w-56 relative flex items-center justify-center">
                            <Doughnut
                                data={doughnutData}
                                options={{
                                    maintainAspectRatio: false,
                                    cutout: '75%',
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: {
                                            callbacks: {
                                                label: (item) => ` ${item.label}: ${item.raw}`
                                            }
                                        }
                                    }
                                }}
                            />

                            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                <span className="text-4xl font-black text-text-primary">{totalDeals}</span>
                                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Total Deals</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 w-full mt-8">
                            <div className="text-center p-2 rounded-xl bg-surface-2 border border-border-subtle">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto mb-1"></div>
                                <span className="text-[10px] font-bold text-text-muted block">APPR</span>
                                <span className="font-bold text-text-primary">{approvedDeals}</span>
                            </div>
                            <div className="text-center p-2 rounded-xl bg-surface-2 border border-border-subtle">
                                <div className="w-2 h-2 rounded-full bg-amber-500 mx-auto mb-1"></div>
                                <span className="text-[10px] font-bold text-text-muted block">PEND</span>
                                <span className="font-bold text-text-primary">{totalDeals - approvedDeals - deals.filter(d => (d.status || "").toLowerCase() === 'rejected').length}</span>
                            </div>
                            <div className="text-center p-2 rounded-xl bg-surface-2 border border-border-subtle">
                                <div className="w-2 h-2 rounded-full bg-red-500 mx-auto mb-1"></div>
                                <span className="text-[10px] font-bold text-text-muted block">REJ</span>
                                <span className="font-bold text-text-primary">{deals.filter(d => (d.status || "").toLowerCase() === 'rejected').length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DATA TABLE */}
                <div className="bg-surface-1 rounded-3xl border border-border-subtle shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-1">
                        <div>
                            <h3 className="text-lg font-bold text-text-primary">Transaction History</h3>
                            <p className="text-xs text-text-muted mt-1">Full record of all deals engaged by this executive</p>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search client logs..."
                                className="pl-10 pr-4 py-2.5 bg-surface-2 border border-border-subtle rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-64 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg className="w-4 h-4 text-text-muted absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-surface-2/50 text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border-subtle">
                                    <th className="px-6 py-4">Date Logged</th>
                                    <th className="px-6 py-4">Client Entity</th>
                                    <th className="px-6 py-4">Deal Value</th>
                                    <th className="px-6 py-4">Incentive</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                                {filteredDeals.length === 0 ? (
                                    <tr><td colSpan="6" className="p-12 text-center text-text-muted italic">No records match your filters.</td></tr>
                                ) : (
                                    filteredDeals.map((deal) => (
                                        <tr key={deal.id} className="hover:bg-surface-2 transition-colors group">
                                            <td className="px-6 py-4 text-xs font-bold text-text-secondary font-mono">
                                                {deal.date || deal.createdAt ? new Date(deal.date || deal.createdAt).toLocaleDateString() : "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-text-primary">{deal.clientName || "Unnamed Client"}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-text-primary font-mono tracking-tight">₹{(deal.amount || 0).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-emerald-600 font-mono tracking-tight">₹{(deal.incentive || 0).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${(deal.status || "").toLowerCase() === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                    (deal.status || "").toLowerCase() === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                                        'bg-amber-50 text-amber-700 border-amber-100'
                                                    }`}>
                                                    {(deal.status || "PENDING").toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-text-muted max-w-xs truncate">{deal.rejectionReason || "-"}</td>
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

export default AdminPerformance;
