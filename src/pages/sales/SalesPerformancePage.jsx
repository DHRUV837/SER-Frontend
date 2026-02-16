import React, { useState, useEffect } from "react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import SalesLayout from "../../layouts/SalesLayout";
import PerformanceTrend from "../../components/charts/PerformanceTrend";
import EarningsBreakdown from "../../components/charts/EarningsBreakdown";
import MonthlyPerformanceBar from "../../components/charts/MonthlyPerformanceBar";
import PerformanceComparison from "../../components/common/PerformanceComparison";
import PageHeader from "../../components/common/PageHeader";

const SalesPerformancePage = () => {
    const { auth } = useAuth();
    const userId = auth?.user?.id || auth?.id;
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('Monthly');

    useEffect(() => {
        if (userId) {
            api.get(`/api/deals?userId=${userId}`)
                .then(res => {
                    setDeals(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch deals', err);
                    setLoading(false);
                });
        }
    }, [userId]);

    // Calculate Key Metrics
    const approvedDeals = deals.filter(d => d.status === 'Approved');
    const submittedDeals = deals.filter(d => d.status === 'Submitted' || d.status === 'Approved' || d.status === 'Rejected');
    const approvalRatio = submittedDeals.length > 0 ? ((approvedDeals.length / submittedDeals.length) * 100).toFixed(1) : 0;
    const avgDealSize = approvedDeals.length > 0 ? (approvedDeals.reduce((sum, d) => sum + d.amount, 0) / approvedDeals.length) : 0;

    // Monthly breakdown (Includes Submitted for consistent viewing)
    const monthlyDeals = deals.filter(d => d.status === 'Approved' || d.status === 'Submitted');
    const monthlyData = monthlyDeals.reduce((acc, d) => {
        if (!d.date) return acc;
        const [year, month, day] = d.date.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });

        if (!acc[key]) acc[key] = { name: monthName, incentive: 0, deals: 0 };
        acc[key].incentive += (d.incentive || 0);
        acc[key].deals += 1;
        return acc;
    }, {});

    const monthlyArray = Object.values(monthlyData).sort((a, b) => {
        const [yearA, monthA] = a.name.split(' ');
        const [yearB, monthB] = b.name.split(' ');
        return new Date(yearB, monthB) - new Date(yearA, monthA);
    });

    const bestMonth = monthlyArray.reduce((max, curr) => curr.incentive > (max?.incentive || 0) ? curr : max, null);
    const worstMonth = monthlyArray.reduce((min, curr) => curr.incentive < (min?.incentive || Infinity) && curr.incentive > 0 ? curr : min, null);

    // Export function
    const handleExport = () => {
        const headers = ['Month', 'Deals Closed', 'Total Incentive', 'Avg Deal Size'];
        const csvContent = 'data:text/csv;charset=utf-8,' +
            headers.join(',') + '\n' +
            monthlyArray.map(m => [
                m.name,
                m.deals,
                m.incentive.toFixed(2),
                (m.incentive / m.deals).toFixed(2)
            ].join(',')).join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `performance_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <SalesLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <PageHeader
                    heading="Performance Insights"
                    subtitle="Analyze your approval trends, incentive growth, and deal efficiency over time."
                    actions={
                        <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Export Data
                        </button>
                    }
                />

                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card-modern p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-100 dark:border-emerald-800">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Approval Ratio</p>
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <p className="text-3xl font-bold text-emerald-800 dark:text-emerald-100">{approvalRatio}%</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{approvedDeals.length} of {submittedDeals.length} deals approved</p>
                    </div>

                    <div className="card-modern p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Avg Deal Size</p>
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <p className="text-3xl font-bold text-blue-800 dark:text-blue-100">₹{avgDealSize.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Across {approvedDeals.length} deals</p>
                    </div>

                    <div className="card-modern p-6 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-100 dark:border-amber-800">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Best Month</p>
                            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </div>
                        <p className="text-3xl font-bold text-amber-800 dark:text-amber-100">₹{(bestMonth?.incentive || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">{bestMonth?.name || 'N/A'}</p>
                    </div>

                    <div className="card-modern p-6 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Worst Month</p>
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                        </div>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">₹{(worstMonth?.incentive || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{worstMonth?.name || 'N/A'}</p>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex gap-2 bg-surface-2 p-1 rounded-lg w-fit">
                    {['Monthly', 'Quarterly', 'Yearly'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTimeFilter(t)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${timeFilter === t
                                ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600'
                                : 'text-text-secondary hover:text-text-primary hover:bg-white dark:hover:bg-slate-700'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Main Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 card-modern p-6">
                        <h3 className="font-bold mb-4">Incentive Growth Trend</h3>
                        <PerformanceTrend />
                    </div>
                    <div className="card-modern p-6">
                        <h3 className="font-bold mb-4">Earnings Breakdown</h3>
                        <EarningsBreakdown />
                    </div>
                </div>

                {/* Comparison Section */}
                <div className="card-modern p-6">
                    <h3 className="font-bold mb-4">Period Comparison</h3>
                    <PerformanceComparison />
                </div>

                {/* Monthly Bar Chart */}
                <div className="card-modern p-6">
                    <h3 className="font-bold mb-4">Monthly Performance History</h3>
                    <MonthlyPerformanceBar />
                </div>
            </div>
        </SalesLayout>
    );
};

export default SalesPerformancePage;
