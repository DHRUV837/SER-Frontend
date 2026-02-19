import SalesLayout from "../../layouts/SalesLayout";
import { useEffect, useState, useCallback, useMemo } from "react";
import api, { API_URL } from "../../api";
import PageHeader from "../../components/common/PageHeader";
import { motion, AnimatePresence } from "framer-motion";

const DealApproval = () => {
    const [deals, setDeals] = useState([]);
    const [filter, setFilter] = useState("ALL"); // ALL, Submitted, Approved, Rejected
    const [selectedSalesPerson, setSelectedSalesPerson] = useState("ALL");
    const [sortOrder, setSortOrder] = useState("desc");

    // Approve Modal State
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [approveDealId, setApproveDealId] = useState(null);
    const [adminComment, setAdminComment] = useState("");

    // Reject Modal State
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectDealId, setRejectDealId] = useState(null);
    const [rejectReason, setRejectReason] = useState("");

    const fetchDeals = useCallback(async () => {
        try {
            const userId = localStorage.getItem("userId") || "1";
            const res = await api.get("/api/deals", {
                params: { requestorId: userId }
            });
            setDeals(res.data);
        } catch (err) {
            console.error("Failed to fetch deals", err);
        }
    }, []);

    useEffect(() => {
        fetchDeals();
    }, [fetchDeals]);

    const processStatusUpdate = async (dealId, status, reason, comment) => {
        try {
            const payload = { status };
            if (reason) payload.reason = reason;
            if (comment) payload.comment = comment;

            const res = await axios.patch(`${API_URL}/api/deals/${dealId}/status`, payload);
            setDeals(prev => prev.map(d => d.id === dealId ? res.data : d));
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Failed to update deal status");
        }
    };

    const handleStatusUpdate = async (dealId, newStatus) => {
        if (newStatus === "Rejected") {
            setRejectDealId(dealId);
            setRejectReason("");
            setIsRejectModalOpen(true);
            return;
        }
        if (newStatus === "Approved") {
            setApproveDealId(dealId);
            setAdminComment("");
            setIsApproveModalOpen(true);
            return;
        }
    };

    const confirmRejection = async () => {
        if (!rejectReason.trim()) {
            alert("Please provide a rejection reason.");
            return;
        }
        await processStatusUpdate(rejectDealId, "Rejected", rejectReason, null);
        setIsRejectModalOpen(false);
    };

    const confirmApproval = async () => {
        await processStatusUpdate(approveDealId, "Approved", null, adminComment);
        setIsApproveModalOpen(false);
    };

    const salesPersons = useMemo(() => [...new Set(deals.map(d => d.user?.name).filter(Boolean))], [deals]);

    const filteredDeals = useMemo(() => deals.filter(d => {
        if (filter !== "ALL" && d.status !== filter) return false;
        if (selectedSalesPerson !== "ALL" && d.user?.name !== selectedSalesPerson) return false;
        return true;
    }).sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date).getTime();
        const dateB = new Date(b.createdAt || b.date).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    }), [deals, filter, selectedSalesPerson, sortOrder]);

    const stats = useMemo(() => {
        const pending = deals.filter(d => d.status === 'Submitted' || d.status === 'Pending').length;
        const approved = deals.filter(d => d.status === 'Approved').length;
        const totalValue = deals.reduce((acc, d) => acc + (d.amount || 0), 0);
        return { pending, approved, totalValue };
    }, [deals]);

    const getRiskBadge = (risk, amount) => {
        let level = risk || (amount > 50000 ? "HIGH" : "LOW");
        const styles = {
            HIGH: "bg-rose-500/10 text-rose-500 border-rose-500/20",
            MEDIUM: "bg-amber-500/10 text-amber-500 border-amber-500/20",
            LOW: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
        };
        return (
            <span className={`px-2 py-0.5 text-xs font-bold rounded border ${styles[level] || styles.LOW} uppercase tracking-wider`}>
                {level} Risk
            </span>
        );
    };

    return (
        <SalesLayout>
            <div className="space-y-8">
                <PageHeader
                    heading="Deal Approvals"
                    subtitle="Review and validate deal submissions."
                    actions={
                        <button
                            onClick={fetchDeals}
                            className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10 text-slate-400 hover:text-white"
                            title="Refresh"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </button>
                    }
                />

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                        <span className="text-4xl font-bold text-amber-400 mb-2">{stats.pending}</span>
                        <span className="text-sm text-text-secondary uppercase tracking-wider font-semibold">Pending Approval</span>
                    </div>
                    <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                        <span className="text-4xl font-bold text-emerald-400 mb-2">{stats.approved}</span>
                        <span className="text-sm text-text-secondary uppercase tracking-wider font-semibold">Approved Deals</span>
                    </div>
                    <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
                        <span className="text-4xl font-bold text-blue-400 mb-2">₹{(stats.totalValue / 100000).toFixed(1)}L</span>
                        <span className="text-sm text-text-secondary uppercase tracking-wider font-semibold">Total Value</span>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex gap-4">
                        <select
                            className="input-field bg-transparent border-white/10 w-40 text-sm"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="ALL">All Status</option>
                            <option value="Submitted">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <select
                            className="input-field bg-transparent border-white/10 w-40 text-sm"
                            value={selectedSalesPerson}
                            onChange={(e) => setSelectedSalesPerson(e.target.value)}
                        >
                            <option value="ALL">All Sales Reps</option>
                            {salesPersons.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="text-sm text-slate-400 font-medium">
                        Showing {filteredDeals.length} deals
                    </div>
                </div>

                {/* Deals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredDeals.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-slate-500">
                                No deals found matching filters.
                            </div>
                        ) : (
                            filteredDeals.map((deal, index) => (
                                <motion.div
                                    key={deal.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className="glass-panel p-6 rounded-3xl relative group hover:border-primary-500/30 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-lg">
                                                {deal.user?.name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-text-primary text-sm">{deal.user?.name || "Unknown"}</h3>
                                                <p className="text-xs text-text-muted">{new Date(deal.createdAt || deal.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        {getRiskBadge(deal.riskLevel, deal.amount)}
                                    </div>

                                    <div className="mb-6 space-y-1">
                                        <div className="text-3xl font-bold text-text-primary">₹{deal.amount.toLocaleString()}</div>
                                        <div className="text-sm text-emerald-500 font-medium">
                                            + ₹{deal.incentive.toFixed(0)} Incentive
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${deal.status === 'Approved' ? 'bg-green-500/10 text-green-500' :
                                            deal.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                                                'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            {deal.status}
                                        </div>

                                        {(deal.status === 'Submitted' || deal.status === 'Pending') && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(deal.id, 'Rejected')}
                                                    className="p-2 rounded-full hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Reject"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(deal.id, 'Approved')}
                                                    className="p-2 rounded-full bg-emerald-500 text-white shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-1 transition-all"
                                                    title="Approve"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {deal.adminComment && (
                                        <div className="mt-3 text-xs text-slate-500 bg-white/5 p-2 rounded-lg italic">
                                            "{deal.adminComment}"
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {(isRejectModalOpen || isApproveModalOpen) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => {
                            setIsRejectModalOpen(false);
                            setIsApproveModalOpen(false);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0f172a] border border-white/10 p-6 rounded-3xl w-full max-w-md shadow-2xl"
                        >
                            {isRejectModalOpen ? (
                                <>
                                    <h3 className="text-xl font-bold text-white mb-2">Reject Deal</h3>
                                    <p className="text-slate-400 mb-4 text-sm">Please specify why this deal is being rejected.</p>
                                    <textarea
                                        className="input-field w-full h-32 bg-white/5 border-white/10 text-white mb-6 resize-none"
                                        placeholder="Detailed reason..."
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="flex gap-3">
                                        <button onClick={() => setIsRejectModalOpen(false)} className="btn-secondary flex-1 border-white/10 text-slate-300">Cancel</button>
                                        <button onClick={confirmRejection} className="btn-primary bg-gradient-to-r from-red-600 to-rose-600 flex-1">Reject Deal</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xl font-bold text-white mb-2">Approve Deal</h3>
                                    <p className="text-slate-400 mb-4 text-sm">Add an optional comment for the sales executive.</p>
                                    <textarea
                                        className="input-field w-full h-32 bg-white/5 border-white/10 text-white mb-6 resize-none"
                                        placeholder="Great work! ..."
                                        value={adminComment}
                                        onChange={(e) => setAdminComment(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="flex gap-3">
                                        <button onClick={() => setIsApproveModalOpen(false)} className="btn-secondary flex-1 border-white/10 text-slate-300">Cancel</button>
                                        <button onClick={confirmApproval} className="btn-primary bg-gradient-to-r from-emerald-500 to-green-600 flex-1">Approve Deal</button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </SalesLayout>
    );
};

export default DealApproval;
