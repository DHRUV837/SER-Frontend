import { useState, useEffect } from "react";
import api, { API_URL } from "../../api";
import AdminLayout from "../../layouts/AdminLayout";
import PageHeader from "../../components/common/PageHeader";
import { motion, AnimatePresence } from "framer-motion";

const AdminIncentivePolicy = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        commissionRate: "",
        minDealAmount: "",
        maxDealAmount: "",
        bonusThreshold: "",
        bonusAmount: "",
        active: true
    });

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/policy/admin?type=INCENTIVE");
            setPolicies(response.data);
        } catch (error) {
            console.error("Error fetching incentive policies:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleEdit = (policy) => {
        setEditingPolicy(policy);
        setFormData({
            title: policy.title || "",
            description: policy.description || "",
            commissionRate: policy.commissionRate || "",
            minDealAmount: policy.minDealAmount || "",
            maxDealAmount: policy.maxDealAmount || "",
            bonusThreshold: policy.bonusThreshold || "",
            bonusAmount: policy.bonusAmount || "",
            active: policy.active ?? true
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                type: 'INCENTIVE',
            };
            if (editingPolicy) {
                payload.id = editingPolicy.id;
            }

            await api.post("/api/policy", payload);
            setShowForm(false);
            resetForm();
            fetchPolicies();
        } catch (error) {
            console.error("Error saving policy:", error);
            alert("❌ Failed to save policy: " + (error.response?.data || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this incentive policy?")) return;

        try {
            await api.delete(`/api/policy/${id}`);
            fetchPolicies();
        } catch (error) {
            console.error("Error deleting policy:", error);
            alert("❌ Failed to delete policy");
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            commissionRate: "",
            minDealAmount: "",
            maxDealAmount: "",
            bonusThreshold: "",
            bonusAmount: "",
            active: true
        });
        setEditingPolicy(null);
    };

    const openCreate = () => {
        resetForm();
        setShowForm(true);
    };

    return (
        <AdminLayout>
            <PageHeader
                heading="Incentive Architect"
                subtitle="Design high-performance commission structures to drive enterprise sales growth."
                actions={
                    <button
                        onClick={openCreate}
                        className="btn-primary flex items-center gap-2 group"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Deploy New Scheme
                    </button>
                }
            />

            {/* Form Drawer */}
            <AnimatePresence>
                {showForm && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40"
                            onClick={() => setShowForm(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, x: "100%" }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full max-w-xl bg-white dark:bg-[#0f172a] border-l border-slate-200 dark:border-white/10 shadow-2xl z-50 p-8 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {editingPolicy ? "Modify Incentive Scheme" : "Architect New Scheme"}
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        Configure parameters for deal-based rewards.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Policy Identity</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., Enterprise Core Commission"
                                            className="input-field bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-primary-500 dark:bg-white/5 dark:border-white/10 dark:text-white"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Global Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="3"
                                            placeholder="Outline the scope and eligibility for this incentive..."
                                            className="input-field bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-primary-500 dark:bg-white/5 dark:border-white/10 dark:text-white"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                            <span className="p-1 px-2 rounded bg-primary-100 text-primary-700 text-[10px] uppercase dark:bg-primary-900/30 dark:text-primary-400">Core</span>
                                            Commission Structure
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Base Rate</label>
                                                <div className="relative group">
                                                    <input
                                                        type="number"
                                                        name="commissionRate"
                                                        value={formData.commissionRate}
                                                        onChange={handleChange}
                                                        required
                                                        min="0"
                                                        max="100"
                                                        step="0.1"
                                                        className="input-field bg-slate-50 border-slate-200 text-slate-900 pl-4 pr-12 text-2xl font-black dark:bg-white/5 dark:border-white/10 dark:text-white focus:ring-primary-500/20"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-500 text-xl font-bold">%</span>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Floor Amount (₹)</label>
                                                <input
                                                    type="number"
                                                    name="minDealAmount"
                                                    value={formData.minDealAmount}
                                                    onChange={handleChange}
                                                    className="input-field bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/10 dark:text-white"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Ceiling Amount (₹)</label>
                                                <input
                                                    type="number"
                                                    name="maxDealAmount"
                                                    value={formData.maxDealAmount}
                                                    onChange={handleChange}
                                                    className="input-field bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/10 dark:text-white"
                                                    placeholder="Unlimited"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                            <span className="p-1 px-2 rounded bg-amber-100 text-amber-700 text-[10px] uppercase dark:bg-amber-900/30 dark:text-amber-400">Yield</span>
                                            Accelerator Incentives
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Trigger Threshold (₹)</label>
                                                <input
                                                    type="number"
                                                    name="bonusThreshold"
                                                    value={formData.bonusThreshold}
                                                    onChange={handleChange}
                                                    className="input-field bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/10 dark:text-white"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Accelerator Bonus (₹)</label>
                                                <input
                                                    type="number"
                                                    name="bonusAmount"
                                                    value={formData.bonusAmount}
                                                    onChange={handleChange}
                                                    className="input-field bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/10 dark:text-white"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <label className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer group hover:bg-white hover:border-primary-500/30 transition-all dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 shadow-sm">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="active"
                                                    checked={formData.active}
                                                    onChange={handleChange}
                                                    className="peer sr-only"
                                                />
                                                <div className="w-12 h-7 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:bg-slate-700"></div>
                                            </div>
                                            <div>
                                                <span className="block text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">Operational Status</span>
                                                <span className="block text-xs text-slate-500 dark:text-slate-400">Scheme is active and visible to designated tiers</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-8 sticky bottom-0 bg-white dark:bg-[#0f172a] pb-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="btn-secondary flex-1"
                                    >
                                        Discard
                                    </button>
                                    <button type="submit" className="btn-primary flex-1 shadow-xl shadow-primary-500/20">
                                        {editingPolicy ? "Synchronize Policy" : "Activate Strategy"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Policy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence>
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <motion.div
                                key={`skeleton-${i}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-72 rounded-[2rem] bg-slate-100 dark:bg-white/5 animate-pulse"
                            />
                        ))
                    ) : policies.length === 0 ? (
                        <div className="col-span-full py-28 text-center glass-panel rounded-[2rem]">
                            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                                <svg className="w-12 h-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No Active Strategies</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm mx-auto">Establish incentive benchmarks to optimize sales velocity and representative engagement.</p>
                            <button onClick={openCreate} className="btn-primary">
                                Create Primary Scheme
                            </button>
                        </div>
                    ) : (
                        policies.map((policy, index) => (
                            <motion.div
                                key={policy.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="glass-panel group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white hover:border-primary-400/50 hover:shadow-2xl dark:border-white/10 dark:bg-white/5 dark:hover:border-primary-500/30 transition-all duration-500"
                            >
                                {/* Active Glow Accent */}
                                {policy.isActive && (
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-primary-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                                )}

                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-700">
                                    <svg className="w-40 h-40 text-primary-500 transform translate-x-12 -translate-y-12 rotate-12" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                    </svg>
                                </div>

                                <div className="relative p-7 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${policy.isActive
                                            ? "bg-emerald-50/50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                                            : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/50"
                                            }`}>
                                            {policy.isActive ? "Active Strategy" : "Draft Status"}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(policy)}
                                                className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 hover:text-primary-500 hover:border-primary-500/30 transition-all shadow-sm"
                                                title="Modify Framework"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00-2 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(policy.id)}
                                                className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 hover:text-rose-500 hover:border-rose-500/30 transition-all shadow-sm"
                                                title="Deactivate Scheme"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary-600 mb-3 line-clamp-1 dark:text-white dark:group-hover:text-white transition-colors tracking-tight">
                                        {policy.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-8 line-clamp-2 min-h-[3em] dark:text-slate-400 leading-relaxed font-medium">
                                        {policy.description || "No strategic summary provided for this framework."}
                                    </p>

                                    <div className="mt-auto space-y-6">
                                        <div className="relative group">
                                            <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/10 to-indigo-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative bg-slate-50 dark:bg-white/5 rounded-2xl p-5 border border-slate-100 dark:border-white/5 flex items-center justify-between">
                                                <div>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Base Commission</span>
                                                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 leading-none">
                                                        {policy.commissionRate}<span className="text-xl ml-1">%</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="p-3 rounded-full bg-white dark:bg-white/10 shadow-sm border border-slate-100 dark:border-white/5">
                                                        <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 px-2">
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block">Deal Envelope</span>
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/40"></span>
                                                    {policy.minDealAmount ? `₹${(policy.minDealAmount / 1000).toFixed(0)}k+` : "No Floor"}
                                                </span>
                                            </div>
                                            <div className="space-y-1 border-l border-slate-100 dark:border-white/10 pl-4">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block">Accelerator</span>
                                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></span>
                                                    {policy.bonusAmount ? `+₹${(policy.bonusAmount / 1000).toFixed(0)}k` : "None"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </AdminLayout>
    );
};

export default AdminIncentivePolicy;
