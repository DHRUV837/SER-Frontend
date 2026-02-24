import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api";
import AdminLayout from "../../layouts/AdminLayout";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";

const AdminDealDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [deal, setDeal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDealDetails();
    }, [id]);

    const fetchDealDetails = async () => {
        try {
            const response = await api.get(`/admin/deals/${id}`);
            setDeal(response.data);
        } catch (error) {
            console.error("Error fetching deal details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (status, reasonOrComment = "") => {
        try {
            const payload = { status };

            // If rejecting, send as 'reason', otherwise as 'comment'
            if (status === 'Rejected' && reasonOrComment) {
                payload.reason = reasonOrComment;
            } else if (reasonOrComment) {
                payload.comment = reasonOrComment;
            }

            // The api interceptor will automatically skip requestorId for this endpoint
            await api.patch(`/api/deals/${deal.id}/status`, payload);
            fetchDealDetails();
        } catch (err) {
            console.error("Status update failed:", err);
            alert("❌ Failed to update status: " + (err.response?.data?.message || err.message));
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex h-[60vh] items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-12 w-12 border-[3px] border-primary-500/20 border-t-primary-600 rounded-full"
                    />
                </div>
            </AdminLayout>
        );
    }

    if (!deal) {
        return (
            <AdminLayout>
                <div className="p-20 text-center glass-panel rounded-[2.5rem] mt-10">
                    <div className="text-6xl mb-6">🔍</div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Mandate Not Found</h2>
                    <p className="text-slate-500 mb-8">The requested commercial opportunity does not exist in our systems.</p>
                    <button onClick={() => navigate("/admin/deals")} className="btn-secondary px-8 rounded-2xl">
                        Return to Network
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <PageHeader
                heading={deal.dealName || deal.organizationName}
                subtitle={`Global Identification: #${deal.id.toString().padStart(6, '0')} — Active Strategic Mandate`}
                actions={
                    <div className="flex items-center gap-4">
                        <StatusBadge status={deal.status} className="!text-[10px] !px-4 !py-1.5" />
                        <button
                            onClick={() => navigate("/admin/deals")}
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                        >
                            Exit View
                        </button>
                    </div>
                }
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 pb-20"
            >
                {/* Left Section: Context & Core Props */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5">
                        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 dark:border-white/5 pb-6">
                            <div className="p-3 rounded-2xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Technical Profile</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Formal commercial and organizational parameters</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-6">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Mandate Focus</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{deal.dealName || "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Parent Entity</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{deal.organizationName}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Commercial Value</p>
                                <p className="text-lg font-black text-emerald-600 tracking-tighter">
                                    {deal.currency || '₹'}{deal.amount?.toLocaleString()}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Strategic Lead</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-indigo-500 flex items-center justify-center text-[10px] font-black text-white">
                                        {deal.user?.name?.charAt(0) || "U"}
                                    </div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{deal.user?.name || "Unassigned"}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Industrial Sector</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{deal.industry || 'General'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Regional Scope</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{deal.region || 'Global'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Expected Finality</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{deal.expectedCloseDate || "TBD"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Creation Protocol</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{deal.date || "Legacy Record"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Impact Classification</p>
                                <p className={`text-[10px] font-black px-2.5 py-1 rounded-lg inline-block ${deal.priority === 'HIGH' ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-600'
                                    }`}>
                                    {deal.priority || "MEDIUM"}
                                </p>
                            </div>
                        </div>

                        {deal.dealNotes && (
                            <div className="mt-12 p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Foundational Intent</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 italic font-medium leading-relaxed">
                                    "{deal.dealNotes}"
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5">
                        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 dark:border-white/5 pb-6">
                            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Intelligence Log</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Executive updates and field observations</p>
                            </div>
                        </div>

                        {deal.adminComment ? (
                            <div className="space-y-6">
                                <div className="p-8 bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-500/5 dark:to-indigo-500/5 rounded-3xl border border-primary-100 dark:border-primary-500/20 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <p className="text-[10px] font-black text-primary-700 dark:text-primary-400 uppercase tracking-[0.1em]">Verified Transmission From {deal.user?.name || "Execution Lead"}</p>
                                        <span className="text-[9px] font-black text-primary-400">ENCRYPTED</span>
                                    </div>
                                    <p className="text-base text-slate-900 dark:text-slate-200 font-bold leading-relaxed">{deal.adminComment}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 grayscale opacity-40">
                                <div className="text-4xl mb-4">🔇</div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Awaiting first transmission</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section: KPIs & Protocols */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Baseline Performance</h3>
                        <div className="space-y-8">
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                <span className="text-xs font-bold text-slate-300">Liability Matrix</span>
                                <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${deal.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                                    deal.riskLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-emerald-500/20 text-emerald-400'
                                    }`}>
                                    {deal.riskLevel || 'OPTIMAL'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                <span className="text-xs font-bold text-slate-300">Incentive Projection</span>
                                <span className="text-lg font-black text-emerald-400">₹{deal.incentive?.toLocaleString() || '0'}</span>
                            </div>
                            <div className="pt-4 mt-4 border-t border-white/5">
                                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: deal.status === 'Approved' ? '100%' : '45%' }}
                                        className="absolute inset-y-0 left-0 bg-primary-500"
                                    />
                                </div>
                                <p className="text-[9px] font-bold text-slate-500 uppercase mt-2 text-center tracking-widest">Protocol Maturation Progress</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Protocol Authorization</h3>
                        <div className="space-y-4">
                            {(deal.status !== 'Approved' && deal.status !== 'Rejected') && (
                                <>
                                    <button
                                        onClick={() => handleUpdateStatus('Approved', 'Authorized via Master Command')}
                                        className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Authorize Mandate
                                    </button>
                                    <button
                                        onClick={() => {
                                            const reason = window.prompt('Define Rejection Rationale:');
                                            if (reason) handleUpdateStatus('Rejected', reason);
                                        }}
                                        className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border-2 border-red-500/50 text-red-500 hover:bg-red-500/5 transition-all"
                                    >
                                        Void Protocols
                                    </button>
                                </>
                            )}
                            <button
                                className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed opacity-50"
                            >
                                Recalibrate Delta
                            </button>
                            <button
                                onClick={() => navigate("/admin/approvals")}
                                className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all text-center"
                            >
                                Network Queue
                            </button>
                        </div>
                        <p className="mt-8 text-[9px] font-bold text-slate-400 text-center leading-relaxed">
                            💡 AUTHORIZATION BINDS FINANCIAL LIABILITY TO THE SPECIFIED SALES EXECUTIVE ENTITY.
                        </p>
                    </div>
                </div>
            </motion.div>
        </AdminLayout>
    );
};

export default AdminDealDetailPage;
