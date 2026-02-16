import { useState, useEffect } from "react";
import api from "../../api";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SalesLayout from "../../layouts/SalesLayout";
import PageHeader from "../../components/common/PageHeader";

const MyDealsPage = () => {
    const { auth } = useAuth();
    const userId = auth?.user?.id || auth?.id;
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("ACTION_REQUIRED");
    const [sortBy, setSortBy] = useState("date"); // date, amount, status
    const [sortOrder, setSortOrder] = useState("desc"); // asc, desc

    useEffect(() => {
        if (userId) {
            fetchMyDeals();
        }
    }, [userId]);

    const fetchMyDeals = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/api/deals?userId=${userId}`);
            const sortedDeals = response.data.sort((a, b) => new Date(b.updatedAt || b.date) - new Date(a.updatedAt || a.date));
            setDeals(sortedDeals);
        } catch (error) {
            console.error("Error fetching my deals:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const normalize = (s) => (s || "").toUpperCase();
    const actionRequiredDeals = deals.filter(d => ["ASSIGNED", "IN_PROGRESS", "DRAFT"].includes(normalize(d.status)));
    const submittedDeals = deals.filter(d => ["SUBMITTED", "PENDING"].includes(normalize(d.status)));
    const historyDeals = deals.filter(d => ["APPROVED", "REJECTED"].includes(normalize(d.status)));

    const getVisibleDeals = () => {
        let filtered;
        switch (activeTab) {
            case "ACTION_REQUIRED": filtered = actionRequiredDeals; break;
            case "SUBMITTED": filtered = submittedDeals; break;
            case "HISTORY": filtered = historyDeals; break;
            default: filtered = deals;
        }

        // Apply sorting
        return [...filtered].sort((a, b) => {
            let compareValue = 0;
            if (sortBy === "date") {
                compareValue = new Date(a.updatedAt || a.date) - new Date(b.updatedAt || b.date);
            } else if (sortBy === "amount") {
                compareValue = (a.amount || 0) - (b.amount || 0);
            } else if (sortBy === "status") {
                compareValue = (a.status || "").localeCompare(b.status || "");
            }
            return sortOrder === "asc" ? compareValue : -compareValue;
        });
    };

    const getStatusColor = (status) => {
        const s = (status || "").toUpperCase();
        switch (s) {
            case "ASSIGNED": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "APPROVED": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "REJECTED": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            case "SUBMITTED":
            case "PENDING": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
            case "IN_PROGRESS": return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";
            default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
        }
    };

    const getPriorityBadge = (priority) => {
        const colors = {
            "HIGH": "text-red-600 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900",
            "MEDIUM": "text-amber-600 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900",
            "LOW": "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900"
        };
        const style = colors[priority] || "text-gray-600 bg-gray-50 border-gray-200";

        return (
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${style}`}>
                {priority || 'NORMAL'}
            </span>
        );
    };

    const handleStatusUpdate = async (dealId, newStatus) => {
        try {
            await api.patch(`/api/deals/${dealId}/status`, {
                status: newStatus,
                comment: newStatus === "IN_PROGRESS" ? "Started working on this deal." : "Deal submitted for approval."
            });
            fetchMyDeals();
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status. Please try again.");
        }
    };

    const handleAdminApproval = async (dealId, comment) => {
        try {
            console.log("Sending approval request for deal:", { dealId, comment });
            const response = await api.patch(`/api/deals/${dealId}/status`, {
                status: "Approved",
                comment: comment || "Approved by admin."
            });
            console.log("Approval response:", response);
            fetchMyDeals();
            alert("Deal approved successfully.");
        } catch (error) {
            console.error("Failed to approve deal", error.response?.data || error.message);
            alert("Failed to update deal status. Please check the console for more details.");
        }
    };

    const visibleDeals = getVisibleDeals();
    const totalValue = visibleDeals.reduce((sum, d) => sum + (d.amount || 0), 0);
    const totalIncentive = visibleDeals.reduce((sum, d) => sum + (d.incentive || 0), 0);

    return (
        <SalesLayout>
            <PageHeader
                heading="Assigned Opportunities"
                subtitle="View, manage, and progress deals assigned to you, with clear approval status and next actions."
            />

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="card-modern p-4 border-l-4 border-blue-500">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Action Required</p>
                    <p className="text-2xl font-bold text-text-primary">{actionRequiredDeals.length}</p>
                </div>
                <div className="card-modern p-4 border-l-4 border-amber-500">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">In Review</p>
                    <p className="text-2xl font-bold text-text-primary">{submittedDeals.length}</p>
                </div>
                <div className="card-modern p-4 border-l-4 border-purple-500">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Total Value</p>
                    <p className="text-2xl font-bold text-text-primary">₹{totalValue.toLocaleString()}</p>
                </div>
                <div className="card-modern p-4 border-l-4 border-emerald-500">
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Est. Incentive</p>
                    <p className="text-2xl font-bold text-emerald-600">₹{totalIncentive.toLocaleString()}</p>
                </div>
            </div>

            {/* Tabs and Sorting */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex gap-1 bg-surface-2 p-1 rounded-xl border border-border-subtle">
                    <button
                        onClick={() => setActiveTab("ACTION_REQUIRED")}
                        className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "ACTION_REQUIRED"
                            ? "bg-white dark:bg-surface-1 text-primary-600 shadow-sm ring-1 ring-black/5"
                            : "text-text-secondary hover:text-text-primary hover:bg-white/50"
                            }`}
                    >
                        <span>Action Required</span>
                        {actionRequiredDeals.length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{actionRequiredDeals.length}</span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("SUBMITTED")}
                        className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "SUBMITTED"
                            ? "bg-white dark:bg-surface-1 text-primary-600 shadow-sm ring-1 ring-black/5"
                            : "text-text-secondary hover:text-text-primary hover:bg-white/50"
                            }`}
                    >
                        <span>In Review</span>
                        {submittedDeals.length > 0 && (
                            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{submittedDeals.length}</span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("HISTORY")}
                        className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "HISTORY"
                            ? "bg-white dark:bg-surface-1 text-primary-600 shadow-sm ring-1 ring-black/5"
                            : "text-text-secondary hover:text-text-primary hover:bg-white/50"
                            }`}
                    >
                        History
                    </button>
                </div>

                {/* Sort Controls */}
                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Sort:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="input-modern py-2 px-3 text-sm"
                    >
                        <option value="date">Date</option>
                        <option value="amount">Amount</option>
                        <option value="status">Status</option>
                    </select>
                    <button
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="p-2 rounded-lg bg-surface-2 hover:bg-surface-3 transition-colors"
                        title={sortOrder === "asc" ? "Ascending" : "Descending"}
                    >
                        <svg className={`w-5 h-5 text-text-secondary transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 text-text-muted">
                    <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-lg font-medium">Fetching your assigned deals...</p>
                </div>
            ) : visibleDeals.length === 0 ? (
                <div className="border-2 border-dashed border-border-subtle rounded-2xl p-20 text-center bg-surface-2/30">
                    <div className="text-5xl mb-4 opacity-50">📂</div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">No deals here</h3>
                    <p className="text-text-muted max-w-sm mx-auto">
                        {activeTab === "ACTION_REQUIRED"
                            ? "You're all caught up! No deals requiring action."
                            : "No deals found in this category."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleDeals.map(deal => (
                        <div key={deal.id} className="card-modern group hover:border-primary-500/50 hover:shadow-lg transition-all flex flex-col h-full">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${getStatusColor(deal.status)}`}>
                                        {deal.status}
                                    </span>
                                    {getPriorityBadge(deal.priority)}
                                </div>

                                <Link to={`/sales/my-deals/${deal.id}`}>
                                    <h3 className="text-lg font-bold text-text-primary mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
                                        {(deal.dealName && deal.dealName.trim() !== "") ? deal.dealName : (deal.organizationName || "Unnamed Deal")}
                                    </h3>
                                </Link>
                                <p className="text-sm text-text-muted mb-4 font-medium flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    {deal.organizationName}
                                </p>

                                <div className="space-y-4 mb-2">
                                    <div className="p-3 bg-gradient-to-r from-surface-2 to-surface-1 rounded-lg border border-border-subtle">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-text-secondary text-xs uppercase tracking-wide">Deal Value</span>
                                            <span className="font-bold text-text-primary">{deal.currency || '₹'}{deal.amount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-secondary text-xs uppercase tracking-wide">Est. Incentive</span>
                                            <span className="font-bold text-emerald-600">₹{deal.incentive > 0 ? deal.incentive.toLocaleString() : '---'}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-xs text-text-muted">
                                        <span>Type: <span className="font-semibold text-text-secondary">{deal.dealType ? deal.dealType.replace('_', ' ') : 'N/A'}</span></span>
                                        <span>Close: <span className="font-semibold text-text-secondary">{deal.expectedCloseDate || 'N/A'}</span></span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-border-subtle bg-surface-2/30 rounded-b-xl">
                                {(deal.status || "").toUpperCase() === "ASSIGNED" && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link to={`/sales/my-deals/${deal.id}`} className="btn-secondary text-sm py-2 flex items-center justify-center">
                                            View Details
                                
                                        </Link>
                                        <button
                                            onClick={() => handleStatusUpdate(deal.id, "IN_PROGRESS")}
                                            className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 flex items-center justify-center shadow-lg shadow-indigo-500/20"
                                        >
                                            Start Work
                                        </button>
                                    </div>
                                )}
                                {(deal.status || "").toUpperCase() === "IN_PROGRESS" && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link to={`/sales/my-deals/${deal.id}`} className="btn-secondary text-sm py-2 flex items-center justify-center">
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() => handleStatusUpdate(deal.id, "Submitted")}
                                            className="btn-primary text-sm py-2 flex items-center justify-center shadow-lg shadow-primary-500/20"
                                        >
                                            Submit Deal
                                        </button>
                                    </div>
                                )}
                                {(deal.status || "").toUpperCase() === "DRAFT" && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link to={`/sales/my-deals/${deal.id}`} className="btn-secondary text-sm py-2 flex items-center justify-center">
                                            Edit Details
                                        </Link>
                                        <button
                                            onClick={() => handleStatusUpdate(deal.id, "Submitted")}
                                            className="btn-primary text-sm py-2 flex items-center justify-center shadow-lg shadow-primary-500/20"
                                        >
                                            Submit Deal
                                        </button>
                                    </div>
                                )}
                                {!["ASSIGNED", "IN_PROGRESS", "DRAFT"].includes((deal.status || "").toUpperCase()) && (
                                    <Link to={`/sales/my-deals/${deal.id}`} className="btn-secondary w-full text-sm py-2 flex items-center justify-center">
                                        View Details
                                    </Link>
                                )}
                            </div>
                        </div >
                    ))}
                </div >
            )}
        </SalesLayout >
    );
};

export default MyDealsPage;
