import { API_URL } from "../../api";
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import AdminLayout from "../../layouts/AdminLayout";
import PageHeader from "../../components/common/PageHeader";

import { useAuth } from "../../context/AuthContext";

const AdminPerformance = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth(); // Get current admin context
    const [data, setData] = useState(null);
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // --- Helper for Date Ranges (Local Time Safe) ---
    const getLast6MonthsLabels = () => {
        const months = [];
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            months.push(monthStr);
        }
        return months;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch User Profile
                let userObj = { name: "Loading...", email: "..." };
                try {
                    const uRes = await axios.get(`${API_URL}/api/users/${userId}`);
                    userObj = uRes.data;
                } catch (e) {
                    try {
                        const allUsers = await api.get("/api/users");
                        const found = allUsers.data.find(u => u.id == userId);
                        if (found) userObj = found;
                    } catch (e2) { }
                }
                setUserProfile(userObj);

                // 2. Fetch Deals (for transaction ledger table only)
                let allDeals = [];
                try {
                    const requestorIdParam = auth.user?.id ? `&requestorId=${auth.user.id}` : "";
                    const dealsRes = await axios.get(`${API_URL}/api/deals?userId=${userId}${requestorIdParam}`);
                    allDeals = dealsRes.data || [];
                } catch (e) {
                    // Fallback attempt
                    const requestorIdParam = auth.user?.id ? `?requestorId=${auth.user.id}` : "";
                    const dealsRes = await axios.get(`${API_URL}/api/deals${requestorIdParam}`);
                    allDeals = (dealsRes.data || []).filter(d => d.user?.id == userId || d.userId == userId || (d.user && d.user.id && d.user.id.toString() === userId.toString()));
                }

                // Attempt to recover name from deals if missing
                if ((!userObj.name || userObj.name === "Loading...") && allDeals.length > 0) {
                    const firstUserDeal = allDeals.find(d => d.user && d.user.name);
                    if (firstUserDeal) {
                        setUserProfile(prev => ({ ...prev, name: firstUserDeal.user.name, email: firstUserDeal.user.email || "" }));
                    }
                }

                // Sort deals by date desc (for display in table)
                const sortedDeals = allDeals.sort((a, b) => {
                    const dateA = new Date(a.date || a.createdAt || 0);
                    const dateB = new Date(b.date || b.createdAt || 0);
                    return dateB - dateA;
                });
                setDeals(sortedDeals);

                // 3. Fetch Performance Metrics from Backend
                try {
                    const perfRes = await axios.get(`${API_URL}/admin/performance/${userId}`);
                    const perfData = perfRes.data;

                    // Transform backend data to match frontend expectations
                    setData({
                        totalDeals: perfData.totalDeals || 0,
                        approvedDeals: perfData.approvedDeals || 0,
                        totalIncentiveEarned: perfData.totalIncentiveEarned || 0,
                        approvalRate: perfData.approvalRate || 0,
                        averageDealValue: perfData.averageDealValue || 0,
                        monthlyTrend: perfData.monthlyTrend || []
                    });
                } catch (perfErr) {
                    console.error("Error fetching performance metrics from backend:", perfErr);
                    // Fallback: use frontend calculation if backend fails
                    const approved = sortedDeals.filter(d => (d.status || "").toLowerCase() === 'approved');
                    const totalRev = approved.reduce((acc, d) => acc + (parseFloat(d.amount) || 0), 0);
                    const totalInc = approved.reduce((acc, d) => acc + (parseFloat(d.incentive) || 0), 0);
                    const avgDeal = approved.length ? totalRev / approved.length : 0;

                    setData({
                        totalDeals: sortedDeals.length,
                        approvedDeals: approved.length,
                        totalIncentiveEarned: totalInc,
                        approvalRate: sortedDeals.length ? (approved.length / sortedDeals.length) * 100 : 0,
                        averageDealValue: avgDeal,
                        monthlyTrend: []
                    });
                }

            } catch (err) {
                console.error("Error fetching performance details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    // Tier Logic with Theme Variables
    const getTier = (rev) => {
        if (rev >= 5000000) return { name: 'Diamond', color: 'from-cyan-400 to-blue-500', bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500/20' };
        if (rev >= 2500000) return { name: 'Platinum', color: 'from-slate-300 to-slate-500', bg: 'bg-slate-500/10', text: 'text-slate-500', border: 'border-slate-500/20' };
        if (rev >= 1000000) return { name: 'Gold', color: 'from-amber-400 to-yellow-500', bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20' };
        return { name: 'Silver', color: 'from-slate-200 to-slate-400', bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' };
    };

    const {
        totalDeals = 0,
        approvedDeals = 0,
        approvalRate = 0,
        totalIncentiveEarned = 0,
        averageDealValue = 0,
        monthlyTrend = []
    } = data || {};

    const totalRevenue = deals
        .filter(d => (d.status || "").toLowerCase() === 'approved')
        .reduce((acc, d) => acc + (parseFloat(d.amount) || 0), 0);

    const tier = getTier(totalRevenue);

    // Filtered Table
    const filteredDeals = useMemo(() => {
        return deals.filter(deal => {
            const searchLower = searchTerm.toLowerCase();
            const dealDate = deal.date || deal.createdAt || "";
            return (
                (deal.clientName || "").toLowerCase().includes(searchLower) ||
                (deal.status || "").toLowerCase().includes(searchLower) ||
                (deal.amount?.toString() || "").includes(searchLower) ||
                dealDate.toLowerCase().includes(searchLower)
            );
        });
    }, [deals, searchTerm]);

    // Chart Config
    const lineChartData = {
        labels: monthlyTrend.map(t => {
            const [y, m] = t.month.split('-');
            const date = new Date(parseInt(y), parseInt(m) - 1);
            return date.toLocaleString('default', { month: 'short' });
        }),
        datasets: [{
            label: 'Incentive',
            data: monthlyTrend.map(t => t.incentiveSum),
            backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)'); // Indigo 500
                gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
                return gradient;
            },
            borderColor: '#6366F1', // Indigo 500
            borderWidth: 4,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#6366F1',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointHoverBorderWidth: 3,
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
            backgroundColor: ['#10B981', '#F59E0B', '#EF4444'], // Emerald, Amber, Red
            borderWidth: 0,
            hoverOffset: 15
        }]
    };

    if (loading) return (
        <AdminLayout>
            <div className="flex flex-col items-center justify-center h-[80vh]">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-text-secondary font-bold tracking-wide animate-pulse">ANALYZING PERFORMANCE DATA...</p>
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <PageHeader
                heading="Performance Analysis"
                subtitle={`Overview for ${userProfile?.name || 'Unknown User'}`}
                actions={
                    <button onClick={() => navigate('/admin/performance')} className="btn-secondary flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Roster
                    </button>
                }
            />

            <div className="space-y-6">
                {/* HERO CARD (Glass) */}
                <div className="glass-panel p-0 overflow-hidden relative group">
                    <div className="absolute top-0 w-full h-32 bg-[var(--bg-secondary)] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--surface-2)] opacity-100"></div>
                        <div className="absolute -right-10 -top-10 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute left-10 top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                    </div>

                    <div className="relative px-8 pt-16 pb-8 flex flex-col md:flex-row items-end justify-between gap-6">
                        <div className="flex items-end gap-6">
                            <div className="w-32 h-32 rounded-3xl bg-[var(--bg-primary)] p-2 shadow-xl relative mb-2 ring-4 ring-[var(--border-subtle)]">
                                <div className={`w-full h-full bg-gradient-to-br ${tier.color} rounded-2xl flex items-center justify-center text-white text-5xl font-black shadow-inner`}>
                                    {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : "?"}
                                </div>
                                <div className='absolute -bottom-3 -right-3 w-10 h-10 bg-[var(--surface-1)] rounded-xl shadow-md flex items-center justify-center border border-[var(--border-subtle)]' title={`Tier: ${tier.name}`}>
                                    {tier.name === 'Diamond' && '💎'}
                                    {tier.name === 'Platinum' && '🏆'}
                                    {tier.name === 'Gold' && '🥇'}
                                    {tier.name === 'Silver' && '🥈'}
                                    {tier.name === 'Bronze' && '🥉'}
                                </div>
                            </div>
                            <div className="mb-2">
                                <h1 className="text-4xl font-black text-text-primary tracking-tight leading-none mb-2">
                                    {userProfile?.name || "Unknown Associate"}
                                </h1>
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-[var(--surface-2)] rounded-full text-xs font-bold text-text-secondary flex items-center gap-2 border border-[var(--border-subtle)]">
                                        <svg className="w-3 h-3 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        {userProfile?.email || "No Email"}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${tier.bg} ${tier.text} ${tier.border}`}>
                                        {tier.name} Tier
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider mb-1">Lifetime Revenue</p>
                                <p className="text-4xl font-black text-text-primary">
                                    <span className="text-lg text-text-muted font-bold mr-1">₹</span>
                                    {(totalRevenue / 100000).toFixed(2)}
                                    <span className="text-lg text-text-muted font-bold ml-1">L</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="card-modern p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase rounded-md tracking-wider">Earned</span>
                        </div>
                        <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Total Incentive</p>
                        <p className="text-3xl font-black text-text-primary mt-1 tracking-tight">₹{(totalIncentiveEarned / 1000).toFixed(1)}k</p>
                    </div>

                    <div className="card-modern p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase rounded-md tracking-wider">Efficiency</span>
                        </div>
                        <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Conversion Rate</p>
                        <p className="text-3xl font-black text-text-primary mt-1 tracking-tight">{approvalRate.toFixed(0)}%</p>
                    </div>

                    <div className="card-modern p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-purple-500/10 text-purple-500 rounded-xl">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            </div>
                            <span className="px-2 py-1 bg-purple-500/10 text-purple-500 text-[10px] font-bold uppercase tracking-wider">Quality</span>
                        </div>
                        <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Avg Deal Size</p>
                        <p className="text-3xl font-black text-text-primary mt-1 tracking-tight">₹{(averageDealValue / 1000).toFixed(0)}k</p>
                    </div>

                    <div className="card-modern p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                            </div>
                            <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase rounded-md tracking-wider">Volume</span>
                        </div>
                        <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Deals Closed</p>
                        <p className="text-3xl font-black text-text-primary mt-1 tracking-tight">{approvedDeals} <span className="text-xs text-text-muted font-bold">/ {totalDeals}</span></p>
                    </div>
                </div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 glass-panel p-8">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-lg font-black text-text-primary">Earnings Velocity</h3>
                                <p className="text-sm text-text-secondary font-medium">6-month incentive performance trend</p>
                            </div>
                            <div className="px-3 py-1 bg-[var(--surface-2)] text-text-secondary rounded-full text-xs font-bold border border-[var(--border-subtle)] flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                Live Sync
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
                                            border: { display: false },
                                            grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
                                            ticks: { font: { weight: 'bold', size: 10 }, color: '#94a3b8', padding: 10 }
                                        },
                                        x: {
                                            border: { display: false },
                                            grid: { display: false, drawBorder: false },
                                            ticks: { font: { weight: 'bold', size: 11 }, color: '#64748b', padding: 10 }
                                        }
                                    },
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: {
                                            backgroundColor: '#0F172A',
                                            padding: 12,
                                            titleFont: { size: 13 },
                                            bodyFont: { size: 13, weight: 'bold' },
                                            cornerRadius: 8,
                                            displayColors: false,
                                            callbacks: {
                                                label: (context) => ` ₹${context.parsed.y.toLocaleString()}`
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="glass-panel p-8 flex flex-col items-center">
                        <h3 className="text-lg font-black text-text-primary mb-2">Deal Composition</h3>
                        <p className="text-xs text-text-secondary font-bold uppercase tracking-wide mb-6">Status Breakdown</p>

                        <div className="h-56 w-56 relative flex items-center justify-center mb-6">
                            <Doughnut
                                data={doughnutData}
                                options={{
                                    maintainAspectRatio: false,
                                    cutout: '80%',
                                    plugins: { legend: { display: false } }
                                }}
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-5xl font-black text-text-primary">{totalDeals}</span>
                                <span className="text-[10px] uppercase font-bold text-text-muted mt-1">Total Deals</span>
                            </div>
                        </div>

                        <div className="w-full space-y-3">
                            <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                                    <span className="text-xs font-bold text-text-primary">Approved</span>
                                </div>
                                <span className="text-sm font-black text-emerald-500">{approvedDeals}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
                                    <span className="text-xs font-bold text-text-primary">Pending</span>
                                </div>
                                <span className="text-sm font-black text-amber-500">{totalDeals - approvedDeals - deals.filter(d => (d.status || "").toLowerCase() === 'rejected').length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LOGS TABLE - Using Card Grid Logic for better mobile/modern feel, or Improved Table */}
                <div className="glass-panel overflow-hidden">
                    <div className="p-8 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h3 className="text-lg font-black text-text-primary">Transaction Ledger</h3>
                            <p className="text-sm text-text-secondary font-medium">Detailed log of all assigned deals</p>
                        </div>
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search ledger..."
                                className="pl-10 pr-4 py-2.5 input-field w-full sm:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--surface-2)] border-b border-[var(--border-subtle)]">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-text-secondary uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-text-secondary uppercase tracking-widest">Client</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-text-secondary uppercase tracking-widest">Value</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-text-secondary uppercase tracking-widest">Incentive</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-text-secondary uppercase tracking-widest text-center">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-text-secondary uppercase tracking-widest">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-subtle)]">
                                {filteredDeals.length === 0 ? (
                                    <tr><td colSpan="6" className="p-10 text-center text-text-muted font-bold italic">No entries found</td></tr>
                                ) : (
                                    filteredDeals.map((deal) => (
                                        <tr key={deal.id} className="hover:bg-[var(--surface-2)] transition-colors">
                                            <td className="px-8 py-5 text-xs font-bold text-text-secondary font-mono">
                                                {deal.date ? new Date(deal.date).toLocaleDateString() : (deal.createdAt ? new Date(deal.createdAt).toLocaleDateString() : "N/A")}
                                            </td>
                                            <td className="px-8 py-5 text-sm font-bold text-text-primary">{deal.clientName || "Unknown Client"}</td>
                                            <td className="px-8 py-5 text-sm font-bold text-text-secondary font-mono">₹{(parseFloat(deal.amount) || 0).toLocaleString()}</td>
                                            <td className="px-8 py-5 text-sm font-bold text-emerald-500 font-mono">₹{(parseFloat(deal.incentive) || 0).toLocaleString()}</td>
                                            <td className="px-8 py-5 text-center">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${(deal.status || "").toLowerCase() === 'approved' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    (deal.status || "").toLowerCase() === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                                        'bg-amber-500/10 text-amber-500'
                                                    }`}>
                                                    {(deal.status || "PENDING").toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-xs text-text-muted max-w-xs truncate">{deal.rejectionReason || "-"}</td>
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
