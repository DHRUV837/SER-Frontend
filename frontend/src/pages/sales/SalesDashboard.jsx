import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SalesLayout from "../../layouts/SalesLayout";
import { useSales } from "../../context/SalesContext";

const SalesDashboard = () => {
  const { deals } = useSales();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const userId = auth?.user?.id || auth?.id;

  // Data Processing
  const assignedDeals = deals.filter(d => (d.status || "").toUpperCase() === "ASSIGNED" || (d.status || "").toUpperCase() === "IN_PROGRESS");
  const approvedDeals = deals.filter(d => (d.status || "").toUpperCase() === "APPROVED");
  const pendingDeals = deals.filter(d => (d.status || "").toUpperCase() === "SUBMITTED");
  const rejectedDeals = deals.filter(d => (d.status || "").toUpperCase() === "REJECTED");

  // This Month Incentive
  const now = new Date();
  const thisMonthDeals = approvedDeals.filter(d => {
    try {
      const dealDate = new Date(d.date);
      return dealDate.getMonth() === now.getMonth() && dealDate.getFullYear() === now.getFullYear();
    } catch { return false; }
  });
  const thisMonthIncentive = thisMonthDeals.reduce((sum, d) => sum + (d.incentive || 0), 0);
  const totalIncentive = approvedDeals.reduce((sum, d) => sum + (d.incentive || 0), 0);
  const totalDealValue = approvedDeals.reduce((sum, d) => sum + (d.amount || 0), 0);

  // Monthly target and progress
  const { monthlyTarget } = useSales();
  const progressPercentage = monthlyTarget > 0 ? Math.min((thisMonthIncentive / monthlyTarget) * 100, 100) : 0;
  const remaining = Math.max(0, monthlyTarget - thisMonthIncentive);

  // Best Month Calculation
  const monthlyIncentives = approvedDeals.reduce((acc, d) => {
    if (!d.date) return acc;
    const date = new Date(d.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });

    if (!acc[key]) acc[key] = { incentive: 0, name: monthName };
    acc[key].incentive += (d.incentive || 0);
    return acc;
  }, {});

  const bestMonthObj = Object.values(monthlyIncentives).reduce((max, curr) =>
    curr.incentive > (max?.incentive || 0) ? curr : max
    , null);

  // Days remaining in month
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysRemaining = Math.max(0, lastDay.getDate() - now.getDate());

  // Async Data State
  const [performanceData, setPerformanceData] = useState(null);
  const [recentNotifications, setRecentNotifications] = useState([]);

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:8080/performance/summary?userId=${userId}`)
        .then(res => setPerformanceData(res.data))
        .catch(console.error);

      axios.get(`http://localhost:8080/api/notifications/user/${userId}`)
        .then(res => setRecentNotifications(res.data.slice(0, 4)))
        .catch(console.error);
    }
  }, [userId, deals]);

  // Quick stats for mini cards
  const avgDealSize = approvedDeals.length > 0 ? totalDealValue / approvedDeals.length : 0;
  const approvalRate = deals.length > 0 ? ((approvedDeals.length / deals.length) * 100).toFixed(1) : 0;

  return (
    <SalesLayout>
      <div className="space-y-6 animate-in fade-in duration-500">

        {/* Hero Welcome Banner with Glassmorphism */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-10 text-white shadow-2xl overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
                  <span className="text-3xl">👋</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80 uppercase tracking-wider">Welcome Back, {auth?.user?.name || "User"}</p>
                  <h1 className="text-3xl md:text-4xl font-bold">Sales Performance Overview</h1>
                </div>
              </div>
              <p className="text-lg text-white/90 max-w-2xl leading-relaxed">
                Track your earnings, deal activity, and incentive growth at a glance.
              </p>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex flex-col gap-3">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30 shadow-lg">
                <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1">This Month</p>
                <p className="text-2xl font-bold">₹{thisMonthIncentive.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30 shadow-lg">
                <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1">Lifetime</p>
                <p className="text-2xl font-bold">₹{totalIncentive.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Required Alert */}
        {assignedDeals.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-400 dark:border-amber-600 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500 rounded-2xl shadow-lg animate-pulse">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 dark:text-amber-100 text-xl mb-1">⚡ Action Required</h3>
                  <p className="text-amber-800 dark:text-amber-200">You have <span className="font-bold">{assignedDeals.length} deals</span> waiting for your review and submission.</p>
                </div>
              </div>
              <Link to="/sales/my-deals" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg transform transition-all hover:scale-105 hover:shadow-xl whitespace-nowrap">
                Review Deals →
              </Link>
            </div>
          </div>
        )}

        {/* Enhanced Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Monthly Incentive */}
          <div className="group relative bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 opacity-20">
              <svg className="w-32 h-32 -mr-8 -mt-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" /></svg>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span className="text-xs font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">This Month</span>
              </div>
              <p className="text-4xl font-bold mb-2">₹{thisMonthIncentive.toLocaleString()}</p>
              <p className="text-emerald-100 text-sm">Monthly Incentive Earned</p>
              <Link to="/sales/payouts" className="mt-4 inline-flex items-center text-sm font-semibold text-white hover:text-emerald-100 transition-colors">
                View Details <span className="ml-1">→</span>
              </Link>
            </div>
          </div>

          {/* Card 2: Deals Approved */}
          <div className="group relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 opacity-20">
              <svg className="w-32 h-32 -mr-8 -mt-8" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span className="text-xs font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">Approved</span>
              </div>
              <p className="text-4xl font-bold mb-2">{approvedDeals.length}</p>
              <p className="text-blue-100 text-sm">Total Deals Approved</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${approvalRate}%` }}></div>
                </div>
                <span className="text-xs font-bold">{approvalRate}%</span>
              </div>
            </div>
          </div>

          {/* Card 3: Average Deal Size */}
          <div className="group relative bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 opacity-20">
              <svg className="w-32 h-32 -mr-8 -mt-8" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <span className="text-xs font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">Average</span>
              </div>
              <p className="text-4xl font-bold mb-2">₹{avgDealSize.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              <p className="text-purple-100 text-sm">Avg Deal Size</p>
              <Link to="/sales/performance" className="mt-4 inline-flex items-center text-sm font-semibold text-white hover:text-purple-100 transition-colors">
                View Analytics <span className="ml-1">→</span>
              </Link>
            </div>
          </div>

          {/* Card 4: Best Month */}
          <div className="group relative bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 opacity-20">
              <svg className="w-32 h-32 -mr-8 -mt-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                </div>
                <span className="text-xs font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">Peak</span>
              </div>
              <p className="text-4xl font-bold mb-2">₹{(bestMonthObj?.incentive || 0).toLocaleString()}</p>
              <p className="text-amber-100 text-sm">{bestMonthObj?.name || 'N/A'}</p>
              <div className="mt-4 text-xs font-semibold">🏆 Your Best Performance</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Progress & Quick Actions */}
          <div className="lg:col-span-2 space-y-6">

            {/* Circular Progress Card */}
            <div className="card-modern p-8 bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 border-2 border-primary-100 dark:border-primary-800">
              <h2 className="text-xl font-bold mb-6 text-center">Monthly Target Progress</h2>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {/* Circular Progress */}
                <div className="relative w-56 h-56">
                  <svg className="transform -rotate-90 w-56 h-56">
                    <circle
                      cx="112"
                      cy="112"
                      r="100"
                      stroke="currentColor"
                      strokeWidth="16"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="112"
                      cy="112"
                      r="100"
                      stroke="url(#progressGradient)"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 100}`}
                      strokeDashoffset={`${2 * Math.PI * 100 * (1 - progressPercentage / 100)}`}
                      className="transition-all duration-1000 ease-out"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-primary-600 dark:text-primary-400">
                      {progressPercentage.toFixed(0)}%
                    </span>
                    <span className="text-sm text-text-muted mt-2">Complete</span>
                    {progressPercentage >= 100 && (
                      <span className="text-2xl mt-2 animate-bounce">🎉</span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Current</p>
                      <p className="text-2xl font-bold text-text-primary">₹{thisMonthIncentive.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Target</p>
                      <p className="text-2xl font-bold text-primary-600">₹{monthlyTarget.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Remaining</p>
                      <p className="text-2xl font-bold text-amber-600">₹{remaining.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                    <p className="text-sm text-text-secondary">
                      <span className="font-bold text-primary-600">{daysRemaining}</span> days left this month
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/sales/my-deals" className="group card-modern p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-l-4 border-blue-500">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{deals.length}</p>
                    <p className="text-sm text-text-secondary">My Deals</p>
                  </div>
                </div>
              </Link>

              <Link to="/sales/leaderboard" className="group card-modern p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-l-4 border-amber-500">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">#{performanceData?.rank || '-'}</p>
                    <p className="text-sm text-text-secondary">Your Rank</p>
                  </div>
                </div>
              </Link>

              <Link to="/sales/targets" className="group card-modern p-6 hover:shadow-lg transition-all hover:-translate-y-1 border-l-4 border-purple-500">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{thisMonthDeals.length}</p>
                    <p className="text-sm text-text-secondary">This Month</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Deal Status Overview */}
            <div className="card-modern p-6">
              <h3 className="text-lg font-bold mb-4">Deal Pipeline Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <p className="text-3xl font-bold text-blue-600">{assignedDeals.length}</p>
                  <p className="text-xs text-text-muted uppercase tracking-wider mt-1">Assigned</p>
                </div>
                <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <p className="text-3xl font-bold text-amber-600">{pendingDeals.length}</p>
                  <p className="text-xs text-text-muted uppercase tracking-wider mt-1">Pending</p>
                </div>
                <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <p className="text-3xl font-bold text-emerald-600">{approvedDeals.length}</p>
                  <p className="text-xs text-text-muted uppercase tracking-wider mt-1">Approved</p>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <p className="text-3xl font-bold text-red-600">{rejectedDeals.length}</p>
                  <p className="text-xs text-text-muted uppercase tracking-wider mt-1">Rejected</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Notifications & Quick Links */}
          <div className="space-y-6">


            {/* Recent Notifications */}
            <div className="card-modern p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                  </span>
                  Recent Alerts
                </h2>
                <Link to="/sales/notifications" className="text-xs font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider">View All</Link>
              </div>

              <div className="space-y-3">
                {recentNotifications.length === 0 ? (
                  <div className="text-center py-12 text-text-muted">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    </div>
                    <p className="text-sm">No recent alerts</p>
                  </div>
                ) : (
                  recentNotifications.map((n, index) => {
                    // Determine notification style based on type
                    const getNotificationStyle = (type) => {
                      switch (type) {
                        case 'DEAL_APPROVED':
                          return {
                            gradient: 'from-emerald-50 via-green-50 to-emerald-50 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-emerald-900/20',
                            border: 'border-emerald-200 dark:border-emerald-800',
                            iconBg: 'bg-emerald-500',
                            icon: '✅',
                            shadow: 'shadow-emerald-500/20'
                          };
                        case 'DEAL_REJECTED':
                          return {
                            gradient: 'from-red-50 via-rose-50 to-red-50 dark:from-red-900/20 dark:via-rose-900/20 dark:to-red-900/20',
                            border: 'border-red-200 dark:border-red-800',
                            iconBg: 'bg-red-500',
                            icon: '❌',
                            shadow: 'shadow-red-500/20'
                          };
                        default:
                          return {
                            gradient: 'from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-blue-900/20',
                            border: 'border-blue-200 dark:border-blue-800',
                            iconBg: 'bg-blue-500',
                            icon: '🔔',
                            shadow: 'shadow-blue-500/20'
                          };
                      }
                    };

                    const style = getNotificationStyle(n.type);
                    const isNew = index === 0; // First notification is "new"

                    return (
                      <div
                        key={n.id}
                        className={`group relative p-4 rounded-xl bg-gradient-to-r ${style.gradient} border-2 ${style.border} transition-all hover:shadow-lg ${style.shadow} hover:-translate-y-0.5`}
                      >
                        {isNew && (
                          <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg animate-pulse">
                            New
                          </div>
                        )}
                        <div className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div className={`w-12 h-12 rounded-xl ${style.iconBg} flex items-center justify-center text-2xl shadow-lg`}>
                              {style.icon}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-text-primary leading-tight mb-1 line-clamp-1">{n.title}</p>
                            <p className="text-xs text-text-secondary line-clamp-2 mb-2 leading-relaxed">{n.message}</p>
                            <div className="flex items-center gap-2">
                              <svg className="w-3 h-3 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              <p className="text-[10px] text-text-muted font-medium">{new Date(n.timestamp).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="card-modern p-6">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/sales/performance" className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-2 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </div>
                    <span className="text-sm font-medium text-text-primary">Performance Analytics</span>
                  </div>
                  <svg className="w-5 h-5 text-text-muted group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>

                <Link to="/sales/reports" className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-2 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <span className="text-sm font-medium text-text-primary">Download Reports</span>
                  </div>
                  <svg className="w-5 h-5 text-text-muted group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>

                <Link to="/sales/policies" className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-2 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <span className="text-sm font-medium text-text-primary">View Policies</span>
                  </div>
                  <svg className="w-5 h-5 text-text-muted group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>

                <Link to="/sales/payouts" className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-2 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="text-sm font-medium text-text-primary">My Earnings</span>
                  </div>
                  <svg className="w-5 h-5 text-text-muted group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </SalesLayout>
  );
};

export default SalesDashboard;
