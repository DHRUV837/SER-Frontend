import React, { useState, useEffect } from "react";
import SalesLayout from "../../layouts/SalesLayout";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
import PageHeader from "../../components/common/PageHeader";

const SalesPayouts = () => {
    const { auth } = useAuth();
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Summary Stats
    const [totalEarned, setTotalEarned] = useState(0);
    const [totalPending, setTotalPending] = useState(0);
    const [lifetimeMetrics, setLifetimeMetrics] = useState({
        lifetimeIncentive: 0,
        monthsActive: 0,
        avgMonthly: 0,
        bestMonthEver: { month: 'N/A', amount: 0 }
    });

    const fetchPayouts = async () => {
        try {
            // Reusing existing endpoint: GET /deals?userId=...
            // Only 'Approved' deals are eligible for payouts
            const res = await api.get(`/api/deals?userId=${auth.user.id}`);

            const approvedDeals = res.data.filter(d => d.status === "Approved");

            // Sort by payout date (recent first) or deal date
            approvedDeals.sort((a, b) => new Date(b.date) - new Date(a.date));

            setPayouts(approvedDeals);

            // Calculate Totals
            const earned = approvedDeals
                .filter(d => d.payoutStatus === "PAID")
                .reduce((sum, d) => sum + d.incentive, 0);

            const pending = approvedDeals
                .filter(d => !d.payoutStatus || d.payoutStatus === "PENDING")
                .reduce((sum, d) => sum + d.incentive, 0);

            setTotalEarned(earned);
            setTotalPending(pending);

            // Calculate Lifetime Metrics
            const lifetimeTotal = approvedDeals.reduce((sum, d) => sum + d.incentive, 0);

            // Monthly breakdown for lifetime
            const monthlyBreakdown = approvedDeals.reduce((acc, d) => {
                if (!d.date) return acc;
                const date = new Date(d.date);
                const key = `${date.getFullYear()}-${date.getMonth()}`;
                const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });

                if (!acc[key]) acc[key] = { month: monthName, amount: 0 };
                acc[key].amount += d.incentive;
                return acc;
            }, {});

            const monthsWithDeals = Object.keys(monthlyBreakdown).length;
            const avgMonthly = monthsWithDeals > 0 ? lifetimeTotal / monthsWithDeals : 0;

            // Find best month
            const bestMonth = Object.values(monthlyBreakdown).reduce((max, curr) =>
                curr.amount > (max?.amount || 0) ? curr : max
                , { month: 'N/A', amount: 0 });

            setLifetimeMetrics({
                lifetimeIncentive: lifetimeTotal,
                monthsActive: monthsWithDeals,
                avgMonthly: avgMonthly,
                bestMonthEver: bestMonth
            });

        } catch (err) {
            console.error("Failed to fetch payouts", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth?.user?.id) {
            fetchPayouts();
        }
    }, [auth]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    return (
        <SalesLayout>
            <PageHeader
                heading="Payout History"
                subtitle="Track processed payments and pending payouts."
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="card-modern p-6 bg-gradient-to-br from- emerald-50 to-green-50 border-emerald-100">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Total Paid</p>
                    <p className="text-3xl font-bold text-emerald-800">{formatCurrency(totalEarned)}</p>
                    <p className="text-xs text-emerald-600 mt-1">Deposited to bank</p>
                </div>
                <div className="card-modern p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Pending Payout</p>
                    <p className="text-3xl font-bold text-amber-800">{formatCurrency(totalPending)}</p>
                    <p className="text-xs text-amber-600 mt-1">Processing / Approval Pending</p>
                </div>
            </div>

            {/* Lifetime Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card-modern p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-100 dark:border-purple-800">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">Lifetime Earnings</p>
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-3xl font-bold text-purple-800 dark:text-purple-100">{formatCurrency(lifetimeMetrics.lifetimeIncentive)}</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Since you joined</p>
                </div>

                <div className="card-modern p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-100 dark:border-cyan-800">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">Months Active</p>
                        <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <p className="text-3xl font-bold text-cyan-800 dark:text-cyan-100">{lifetimeMetrics.monthsActive}</p>
                    <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">Months with deals</p>
                </div>

                <div className="card-modern p-6 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-teal-100 dark:border-teal-800">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">Avg Monthly</p>
                        <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </div>
                    <p className="text-3xl font-bold text-teal-800 dark:text-teal-100">{formatCurrency(lifetimeMetrics.avgMonthly)}</p>
                    <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">Per active month</p>
                </div>

                <div className="card-modern p-6 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-rose-100 dark:border-rose-800">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">Best Month Ever</p>
                        <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                    </div>
                    <p className="text-3xl font-bold text-rose-800 dark:text-rose-100">{formatCurrency(lifetimeMetrics.bestMonthEver.amount)}</p>
                    <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{lifetimeMetrics.bestMonthEver.month}</p>
                </div>
            </div>

            {/* Payouts Table */}
            <div className="card-modern overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-surface-2 text-text-secondary uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Deal Date</th>
                                <th className="px-6 py-4">Deal Amount</th>
                                <th className="px-6 py-4">Commission</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Payout Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-text-muted">Loading payouts...</td>
                                </tr>
                            ) : payouts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-text-muted">
                                        No approved deals found yet.
                                    </td>
                                </tr>
                            ) : (
                                payouts.map((deal) => (
                                    <tr key={deal.id} className="hover:bg-surface-2/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-text-primary">
                                            {formatDate(deal.date)}
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary">
                                            {formatCurrency(deal.amount)}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-primary-600">
                                            {formatCurrency(deal.incentive)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {deal.payoutStatus === "PAID" ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                                                    Paid
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5"></span>
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary">
                                            {deal.payoutStatus === "PAID" ? formatDate(deal.payoutDate) : "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </SalesLayout>
    );
};

export default SalesPayouts;
