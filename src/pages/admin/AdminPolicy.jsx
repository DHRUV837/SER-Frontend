import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../api";
import PageHeader from "../../components/common/PageHeader";

const AdminPolicy = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        active: true
    });

    const fetchPolicies = async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/policy/admin?type=COMPANY");
            setPolicies(res.data);
        } catch (err) {
            console.error("Failed to fetch policies:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEdit = (policy) => {
        setEditingPolicy(policy);
        setFormData({
            title: policy.title,
            content: policy.content,
            active: policy.active ?? true
        });
        setShowForm(true);
    };

    const handleCreate = () => {
        setEditingPolicy(null);
        setFormData({
            title: "",
            content: "",
            active: true
        });
        setShowForm(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                type: 'COMPANY',
            };
            if (editingPolicy) {
                payload.id = editingPolicy.id;
            }

            await api.post("/api/policy", payload);
            setShowForm(false);
            fetchPolicies();
        } catch (err) {
            console.error("Failed to save policy:", err);
            alert("❌ Failed to save policy: " + (err.response?.data || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this policy document?")) return;
        try {
            await api.delete(`/api/policy/${id}`);
            fetchPolicies();
            setShowForm(false);
        } catch (err) {
            console.error("Failed to delete:", err);
            alert("❌ Failed to delete");
        }
    };

    return (
        <AdminLayout>
            <PageHeader
                heading="Corporate Governance"
                subtitle="Manage and distribute official company policies, guidelines, and compliance documentation."
                actions={
                    <button
                        onClick={handleCreate}
                        className="btn-primary flex items-center gap-2 group"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Issue New Policy
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
                            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white dark:bg-[#0f172a] border-l border-slate-200 dark:border-white/10 shadow-2xl z-50 p-8 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {editingPolicy ? "Update Policy Document" : "Draft New Policy"}
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        Formalize organizational standards and legal guidelines.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-6 h-[calc(100vh-200px)] flex flex-col">
                                <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Document Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., Code of Conduct & Ethical Sales"
                                            className="input-field bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-primary-500 dark:bg-white/5 dark:border-white/10 dark:text-white"
                                        />
                                    </div>

                                    <div className="space-y-1 flex-grow flex flex-col min-h-[400px]">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Policy content</label>
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded uppercase dark:bg-slate-800">
                                                Markdown Supported
                                            </span>
                                        </div>
                                        <textarea
                                            name="content"
                                            value={formData.content}
                                            onChange={handleChange}
                                            required
                                            placeholder="# Policy Summary\n\nEnter the full text of the policy here..."
                                            className="input-field flex-grow bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-primary-500 dark:bg-white/5 dark:border-white/10 dark:text-white font-mono text-sm leading-relaxed p-6"
                                        />
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
                                                <span className="block text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">Enforcement Status</span>
                                                <span className="block text-xs text-slate-500 dark:text-slate-400">Policy is active and legally binding for all practitioners</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-8 sticky bottom-0 bg-white dark:bg-[#0f172a] pb-4 border-t border-slate-100 dark:border-white/5">
                                    {editingPolicy && (
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(editingPolicy.id)}
                                            className="px-6 py-2.5 rounded-xl font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20"
                                        >
                                            Retire Document
                                        </button>
                                    )}
                                    <div className="flex gap-4 ml-auto flex-1">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="btn-secondary flex-1"
                                        >
                                            Close
                                        </button>
                                        <button type="submit" className="btn-primary flex-1 shadow-xl shadow-primary-500/20">
                                            {editingPolicy ? "Apply Updates" : "Publish Document"}
                                        </button>
                                    </div>
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
                                className="h-64 rounded-[2rem] bg-slate-100 dark:bg-white/5 animate-pulse"
                            />
                        ))
                    ) : policies.length === 0 ? (
                        <div className="col-span-full py-28 text-center glass-panel rounded-[2rem]">
                            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                                <svg className="w-12 h-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No Policy Repository</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm mx-auto">Establish corporate guidelines to ensure operational transparency and compliance across the organization.</p>
                            <button onClick={handleCreate} className="btn-primary">
                                Create Initial Policy
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
                                className="glass-panel group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white hover:border-indigo-400/50 hover:shadow-2xl dark:border-white/10 dark:bg-white/5 dark:hover:border-indigo-500/30 transition-all duration-500 cursor-pointer"
                                onClick={() => handleEdit(policy)}
                            >
                                {/* Doc Type Indicator */}
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-700">
                                    <svg className="w-40 h-40 text-indigo-500 transform translate-x-12 -translate-y-12 rotate-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M7 2a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V9l-5-5H7z" />
                                    </svg>
                                </div>

                                <div className="relative p-7 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${policy.active
                                            ? "bg-indigo-50/50 text-indigo-600 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
                                            : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/50"
                                            }`}>
                                            {policy.active ? "Enforced" : "Draft/Archived"}
                                        </div>
                                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-400 group-hover:text-indigo-500 transition-colors">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00-2 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 mb-4 dark:text-white dark:group-hover:text-white transition-colors tracking-tight line-clamp-2 leading-tight">
                                        {policy.title}
                                    </h3>

                                    <div className="text-sm text-slate-500 dark:text-slate-400 line-clamp-4 leading-relaxed font-medium mb-8">
                                        {policy.content}
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                Last Updated: {new Date(policy.lastUpdated).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <svg className="w-4 h-4 text-slate-300 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
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

export default AdminPolicy;
