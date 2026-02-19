import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSales } from "../../context/SalesContext";
import { useNotifications } from "../../context/NotificationContext";
import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
import DateFilter from "../common/DateFilter";

const DealHistory = () => {
  const { auth } = useAuth();
  const { deals, deleteDeal, updateDealStatus } = useSales();
  const { addNotification } = useNotifications();
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date"); // date, amount, incentive
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc

  const filteredDeals = useMemo(() => {
    let filtered = deals;

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      filtered = deals.filter(deal => {
        const dealDate = new Date(deal.date);
        if (dateFilter === "thisMonth") {
          return dealDate >= currentMonth && dealDate <= now;
        }
        if (dateFilter === "lastMonth") {
          return dealDate >= lastMonth && dealDate <= lastMonthEnd;
        }
        return true;
      });
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      let compareValue = 0;

      if (sortBy === "date") {
        const dateA = new Date(a.date || a.createdAt);
        const dateB = new Date(b.date || b.createdAt);
        compareValue = dateA - dateB;
      } else if (sortBy === "amount") {
        compareValue = (a.amount || 0) - (b.amount || 0);
      } else if (sortBy === "incentive") {
        compareValue = (a.incentive || 0) - (b.incentive || 0);
      }

      return sortOrder === "asc" ? compareValue : -compareValue;
    });
  }, [deals, dateFilter, sortBy, sortOrder]);

  const handleStatusChange = (dealId, newStatus) => {
    const deal = deals.find(d => d.id === dealId);
    updateDealStatus(dealId, newStatus);

    if (newStatus === "Approved") {
      addNotification({
        type: "success",
        title: "Deal Approved!",
        message: `Deal worth ₹${deal?.amount.toLocaleString('en-IN')} has been approved. Incentive: ₹${deal?.incentive.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
      });
    } else if (newStatus === "Rejected") {
      addNotification({
        type: "warning",
        title: "Deal Rejected",
        message: `Deal worth ₹${deal?.amount.toLocaleString('en-IN')} has been rejected.`
      });
    } else if (newStatus === "Submitted") {
      addNotification({
        type: "info",
        title: "Deal Submitted",
        message: `Deal worth ₹${deal?.amount.toLocaleString('en-IN')} has been submitted for approval.`
      });
    }
  };

  if (deals.length === 0) {
    return (
      <div className="card-modern p-16 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary-100 to-indigo-100 dark:from-primary-900/20 dark:to-indigo-900/20 opacity-30 rounded-full -mr-24 -mt-24"></div>
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-indigo-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">No Deals Recorded Yet</h3>
          <p className="text-sm text-text-muted mb-6 max-w-md">Start calculating your rewards to see them appear here. Estimate potential earnings with the Simulator.</p>
          <a
            href="/sales/simulator"
            className="inline-flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-primary-500 to-indigo-500 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <span>Open Simulator</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="card-modern relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-500 to-indigo-500"></div>

      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary-100 to-indigo-100 dark:from-primary-900/30 dark:to-indigo-900/30 rounded-xl">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Deal History</h2>
            </div>
            <div className="px-4 py-2 bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
              <span className="text-sm font-bold text-primary-600">{filteredDeals.length}</span>
              <span className="text-xs text-text-muted ml-1">{filteredDeals.length === 1 ? 'deal' : 'deals'}</span>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-surface-2 rounded-xl border border-border-subtle">
          <DateFilter onFilterChange={setDateFilter} />

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-modern py-2 px-3 text-sm font-medium"
            >
              <option value="date">📅 Date</option>
              <option value="amount">💰 Amount</option>
              <option value="incentive">💎 Incentive</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
              title={sortOrder === "asc" ? "Ascending" : "Descending"}
            >
              <svg className={`w-5 h-5 text-primary-600 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-border-subtle">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-primary-500 to-indigo-500 text-white">
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Deal / Org</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Incentive</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-subtle bg-surface-1">
              {filteredDeals.map((deal, index) => (
                <tr key={deal.id || index} className="hover:bg-surface-2 transition-colors group">
                  <td className="px-6 py-4">
                    <Link to={`/sales/my-deals/${deal.id}`} className="block">
                      <div className="text-sm font-bold text-text-primary group-hover:text-primary-600 transition-colors">
                        {deal.dealName || "Unnamed Deal"}
                      </div>
                      <div className="text-xs text-text-muted flex items-center gap-1 mt-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        {deal.organizationName}
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-text-primary">₹{deal.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                      <span className="text-sm font-bold text-emerald-600">₹{deal.incentive.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${deal.priority === 'HIGH'
                      ? 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                      : deal.priority === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
                      }`}>
                      {deal.priority || 'NORMAL'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={deal.status} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-text-muted">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="font-medium">{deal.date}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div >
    </div >
  );
};

export default DealHistory;
