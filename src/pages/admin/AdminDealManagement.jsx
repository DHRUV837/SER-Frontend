import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api";
import AdminLayout from "../../layouts/AdminLayout";
import PageHeader from "../../components/common/PageHeader";

const AdminDealManagement = () => {
    const navigate = useNavigate();
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("latest");

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        setLoading(true);
        try {
            const response = await api.get("/admin/deals");
            setDeals(response.data);
        } catch (error) {
            console.error("Error fetching deals:", error);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityBadge = (priority) => {
        const badges = {
            HIGH: "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
            MEDIUM: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
            LOW: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
        };
        return badges[priority] || badges.MEDIUM;
    };

    const getStatusBadge = (status) => {
        const badges = {
            ASSIGNED: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
            DRAFT: "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20",
            PENDING: "bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
            SUBMITTED: "bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
            APPROVED: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
            REJECTED: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
        };
        const s = status?.toUpperCase();
        return badges[s] || badges.DRAFT;
    };

    // Map UI phase filter to actual status values in data (case-insensitive)
    const phaseToStatuses = {
        ASSIGNED: ["recommended"],
        PENDING: ["draft"],
        APPROVED: ["approved"],
        REJECTED: ["rejected"]
    };

    // Map UI tier filter to actual priority values in data (case-insensitive)
    const tierToPriority = {
        HIGH: ["high"],
        MEDIUM: ["medium"],
        LOW: ["low"]
    };

    const filteredDeals = deals.filter(deal => {
        // Search filter
        const matchesSearch =
            (deal.dealName && deal.dealName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (deal.organizationName && deal.organizationName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (deal.id && deal.id.toString().includes(searchTerm));
        // Status/phase filter (robust, case-insensitive)
        let matchesPhase = true;
        if (statusFilter && deal.status) {
            const phaseStatuses = phaseToStatuses[statusFilter];
            if (phaseStatuses) {
                matchesPhase = phaseStatuses.some(
                    s => s.toLowerCase() === deal.status.toLowerCase()
                );
            }
        }
        // Tier/priority filter (robust, case-insensitive)
        let matchesTier = true;
        if (priorityFilter && deal.priority) {
            const tierPriorities = tierToPriority[priorityFilter];
            if (tierPriorities) {
                matchesTier = tierPriorities.includes(deal.priority.toLowerCase());
            }
        }
        return matchesSearch && matchesPhase && matchesTier;
    });

    const sortedDeals = [...filteredDeals].sort((a, b) => {
        // Fallback to id if no date fields
        const dateA = a.createdAt ? new Date(a.createdAt) : (a.date ? new Date(a.date) : new Date(0));
        const dateB = b.createdAt ? new Date(b.createdAt) : (b.date ? new Date(b.date) : new Date(0));
        if (dateA.getTime() === 0 && dateB.getTime() === 0) {
            return (sortOrder === "latest" ? b.id - a.id : a.id - b.id);
        }
        return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

    const getInitials = (name) => {
        if (!name || typeof name !== "string") return "?";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    };

    return (
        <AdminLayout>
            <PageHeader
                heading="Revenue Operations"
                subtitle="End-to-end management of enterprise deals, status tracking, and pipeline optimization."
                actions={
                    <button
                        onClick={() => navigate("/admin/deals/create")}
                        className="btn-primary flex items-center gap-2 group shadow-xl shadow-primary-500/20"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Initialize Deal
                    </button>
                }
            />

            {/* Tactical Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: "Pipeline Velocity", value: deals.length, icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "from-blue-500 to-primary-500", shadow: "shadow-blue-500/20" },
                    { label: "Active Mandates", value: deals.filter(d => ["ASSIGNED", "IN_PROGRESS"].includes(d.status?.toUpperCase())).length, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "from-indigo-500 to-blue-500", shadow: "shadow-indigo-500/20" },
                    { label: "Pending Validation", value: deals.filter(d => ["PENDING", "SUBMITTED"].includes(d.status?.toUpperCase())).length, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/20" },
                    { label: "Locked Revenue", value: deals.filter(d => d.status?.toUpperCase() === "APPROVED").length, icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", color: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/20" }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`glass-panel p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 flex items-center gap-5 hover:shadow-2xl transition-all duration-500 group overflow-hidden relative`}
                    >
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform duration-500`}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                            </svg>
                        </div>
                        <div className="relative z-10">
                            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary-500 transition-colors">{stat.label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Action Bar / Filters */}
            <div className="glass-panel p-4 mb-8 rounded-3xl border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/5 backdrop-blur-xl">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-grow group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Identify specific deals or organization entities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-6 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold text-sm outline-none focus:border-primary-500 transition-all cursor-pointer"
                        >
                            <option value="">Status: All Lifecycle</option>
                            <option value="ASSIGNED">Phase: Assigned</option>
                            <option value="PENDING">Phase: Validation</option>
                            <option value="APPROVED">Phase: Finalized</option>
                            <option value="REJECTED">Phase: Archived</option>
                        </select>
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-6 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold text-sm outline-none focus:border-primary-500 transition-all cursor-pointer"
                        >
                            <option value="">Impact: All Tiers</option>
                            <option value="HIGH">Tier: High Priority</option>
                            <option value="MEDIUM">Tier: Standard</option>
                            <option value="LOW">Tier: Operational</option>
                        </select>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="px-6 py-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold text-sm outline-none focus:border-primary-500 transition-all cursor-pointer"
                        >
                            <option value="latest">Sort: Temporal Desc</option>
                            <option value="oldest">Sort: Temporal Asc</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Enterprise Data Grid */}
            <div className="glass-panel overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 shadow-2xl relative">
                {loading ? (
                    <div className="py-32 flex flex-col items-center justify-center">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-primary-500/10 rounded-full"></div>
                            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                        </div>
                        <p className="mt-6 text-sm font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Synchronizing Mandates</p>
                    </div>
                ) : sortedDeals.length === 0 ? (
                    <div className="py-32 text-center">
                        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-5xl">🔭</div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Zero Mandates Identified</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm mx-auto font-medium">No records match your current organizational telemetry or filters.</p>
                        <button onClick={() => navigate("/admin/deals/create")} className="btn-primary">Initialize Primary Deal</button>
                    </div>
                ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-white/[0.02]">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-white/5">Mandate & Target</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-white/5">Ownership</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-white/5">Commitment Val</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-white/5 text-center">Protocol Matrix</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-white/5">Est. Finality</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-white/5 text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                                {sortedDeals.map((deal, idx) => (
                                    <motion.tr
                                        key={deal.id || idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.03] transition-colors"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-white/5 dark:to-white/10 flex items-center justify-center border border-primary-100 dark:border-white/10 shadow-sm text-primary-500 font-black">
                                                    {getInitials(deal.organizationName || deal.dealName || "?")}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors uppercase tracking-tight">{deal.dealName || `MND-${deal.id || idx}`}</div>
                                                    <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-0.5">{deal.organizationName || "Unknown Entity"}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                                                    {getInitials(deal.user?.name || "?")}
                                                </div>
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{deal.user?.name || "Unassigned"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="text-sm font-black text-slate-900 dark:text-white">{deal.currency || '₹'} {deal.amount ? (deal.amount / 1000).toFixed(1) : "-"}k</div>
                                            <div className="text-[10px] font-bold text-slate-400 truncate max-w-[100px]">Base Liquidity</div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className={`w-28 text-center py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getPriorityBadge(deal.priority)}`}>
                                                    {deal.priority || "MEDIUM"} PRIORITY
                                                </span>
                                                <span className={`w-28 text-center py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusBadge(deal.status)}`}>
                                                    {deal.status || "DRAFT"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                {deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : "TBD"}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => navigate(`/admin/deals/${deal.id}`)}
                                                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 hover:text-primary-500 hover:border-primary-500/30 hover:bg-white dark:hover:bg-white/10 transition-all shadow-sm group/btn"
                                            >
                                                <svg className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminDealManagement;
