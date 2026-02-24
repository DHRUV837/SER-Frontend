import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api";
import AdminLayout from "../../layouts/AdminLayout";
import PageHeader from "../../components/common/PageHeader";

const AdminDealCreate = () => {
    const navigate = useNavigate();
    const [salesUsers, setSalesUsers] = useState([]);
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        dealName: "",
        organizationName: "",
        amount: "",
        assignedUserId: "",
        expectedCloseDate: "",
        priority: "MEDIUM",
        policyId: "",
        dealNotes: "",
        clientName: "",
        industry: "Financial Services",
        region: "APAC",
        currency: "₹",
        dealType: "NEW",
        createdBy: localStorage.getItem("userId") || "1"
    });

    useEffect(() => {
        fetchSalesUsers();
        fetchPolicies();
    }, []);

    const fetchSalesUsers = async () => {
        try {
            const userId = localStorage.getItem("userId") || "1";
            const response = await api.get("/api/users", {
                params: { currentUserId: userId }
            });
            const sales = response.data.filter(u => u.role === "SALES" && u.accountStatus === "ACTIVE");
            setSalesUsers(sales);
        } catch (error) {
            console.error("Error fetching sales users:", error);
        }
    };

    const fetchPolicies = async () => {
        try {
            const response = await api.get("/api/policy?type=INCENTIVE");
            const activePolicies = response.data.filter(p => p.active);
            setPolicies(activePolicies);
        } catch (error) {
            console.error("Error fetching incentive policies:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convert string fields to appropriate types
            const requestData = {
                ...formData,
                amount: parseFloat(formData.amount),
                assignedUserId: parseInt(formData.assignedUserId, 10),
                createdBy: parseInt(formData.createdBy, 10)
            };
            await api.post("/admin/deals", requestData);

            // Onboarding Progress update
            try {
                const userId = localStorage.getItem("userId");
                if (userId) {
                    await api.post("/api/onboarding/progress/update", {
                        userId: userId,
                        task: "firstDeal"
                    });
                }
            } catch (err) {
                console.error("Failed to update onboarding progress", err);
            }

            navigate("/admin/deals");
        } catch (error) {
            console.error("Error creating deal:", error);
            alert("❌ Failed to create deal: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <PageHeader
                heading="Deal Configuration"
                subtitle="Formalize new commercial mandates and establish baseline performance parameters."
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto pb-20"
            >
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* section 1: Core Metadata */}
                    <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 shadow-xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-2xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Core Metadata</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Identify organizational entity and mandate</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mandate Name</label>
                                <input
                                    type="text"
                                    name="dealName"
                                    value={formData.dealName}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Enterprise Cloud Expansion"
                                    className="input-field bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Parent Organization</label>
                                <input
                                    type="text"
                                    name="organizationName"
                                    value={formData.organizationName}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Global Tech Corp"
                                    className="input-field bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Commercial Contact</label>
                                <input
                                    type="text"
                                    name="clientName"
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Primary stakeholder name"
                                    className="input-field bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Industry</label>
                                    <select
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleChange}
                                        required
                                        className="input-field bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold"
                                    >
                                        <option value="Financial Services">Finance</option>
                                        <option value="Technology">Tech</option>
                                        <option value="Healthcare">Health</option>
                                        <option value="Retail">Retail</option>
                                        <option value="Manufacturing">Fab</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Region</label>
                                    <select
                                        name="region"
                                        value={formData.region}
                                        onChange={handleChange}
                                        required
                                        className="input-field bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold"
                                    >
                                        <option value="APAC">APAC</option>
                                        <option value="EMEA">EMEA</option>
                                        <option value="NORTH_AMERICA">NAM</option>
                                        <option value="LATAM">LATAM</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* section 2: Commercial Values */}
                    <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 shadow-xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3 1.343 3 3-1.343 3-3 3m0-12c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm0 12c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Financial Parameters</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Commitment value and deal structure</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mandate Value (Total Contract Value)</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none font-bold text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                        {formData.currency}
                                    </div>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        placeholder="0.00"
                                        className="input-field pl-12 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-black text-lg"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Currency</label>
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        required
                                        className="input-field bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold"
                                    >
                                        <option value="₹">INR (₹)</option>
                                        <option value="$">USD ($)</option>
                                        <option value="€">EUR (€)</option>
                                        <option value="£">GBP (£)</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Deal Protocol</label>
                                    <select
                                        name="dealType"
                                        value={formData.dealType}
                                        onChange={handleChange}
                                        required
                                        className="input-field bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold"
                                    >
                                        <option value="NEW">New Ops</option>
                                        <option value="RENEWAL">Renewal</option>
                                        <option value="UPSELL">Upsell</option>
                                        <option value="CROSS_SELL">Cross</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* section 3: Execution & Logic */}
                    <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 shadow-xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Assignment Matrix</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ownership and regulatory alignment</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Responsible Executive</label>
                                <select
                                    name="assignedUserId"
                                    value={formData.assignedUserId}
                                    onChange={handleChange}
                                    required
                                    className="input-field bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold"
                                >
                                    <option value="">{salesUsers.length === 0 ? "Scanning Network..." : "Select Execution Lead"}</option>
                                    {salesUsers.map(user => (
                                        <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Target Finality</label>
                                    <input
                                        type="date"
                                        name="expectedCloseDate"
                                        value={formData.expectedCloseDate}
                                        onChange={handleChange}
                                        required
                                        className="input-field bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Impact Tier</label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        required
                                        className="input-field bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold"
                                    >
                                        <option value="LOW">Low Impact</option>
                                        <option value="MEDIUM">Standard</option>
                                        <option value="HIGH">High Criticality</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Governing Policy (Optional)</label>
                                <select
                                    name="policyId"
                                    value={formData.policyId}
                                    onChange={handleChange}
                                    className="input-field bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold"
                                >
                                    <option value="">{policies.length === 0 ? "No active policies found" : "Inherit Global Ruleset"}</option>
                                    {policies.map(policy => (
                                        <option key={policy.id} value={policy.id}>{policy.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Internal Mandate Notes</label>
                                <textarea
                                    name="dealNotes"
                                    value={formData.dealNotes}
                                    onChange={handleChange}
                                    rows="1"
                                    placeholder="Strategic observations..."
                                    className="input-field bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/deals")}
                            className="btn-secondary px-8 rounded-2xl font-black text-xs uppercase tracking-widest border-2"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 group relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? "Authorizing..." : (
                                    <>
                                        Authorize & Deploy Mandate
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        </button>
                    </div>
                </form>
            </motion.div>
        </AdminLayout>
    );
};

export default AdminDealCreate;
