import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Target, Briefcase, FileText, Users, ChevronRight } from "lucide-react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

// --- Step 1: Create First Target ---
export const TargetStep = ({ onComplete }) => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        userId: auth.user?.id, // Assign to self initially for onboarding
        currentMonthTarget: "500000",
        performanceRating: "0",
        achievements: "First Target Setup"
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Create Target
            await api.post("/api/targets", {
                ...formData,
                createdBy: auth.user.id
            });
            // Update Progress
            await api.post("/api/onboarding/progress/update", {
                userId: auth.user.id,
                task: "firstTarget"
            });
            // Force a small delay to ensure backend consistency before refetching
            setTimeout(() => {
                onComplete();
            }, 500);
        } catch (err) {
            console.error("Failed to create target", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Set Your First Target</h3>
                <p className="text-slate-400">Define a sales goal to start tracking performance.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Monthly Target (₹)</label>
                    <input
                        type="number"
                        value={formData.currentMonthTarget}
                        onChange={(e) => setFormData({ ...formData, currentMonthTarget: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>
                <button
                    disabled={loading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                    {loading ? "Saving..." : "Set Target & Continue"} <ArrowRight className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
};

// --- Step 2: Create First Deal ---
export const DealStep = ({ onComplete }) => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        dealName: "First Onboarding Deal",
        organizationName: "Demo Client",
        amount: "150000",
        status: "Draft"
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Create Deal
            const dealPayload = {
                ...formData,
                date: new Date().toISOString().split('T')[0],
                user: { id: auth.user.id } // Assign to self
            };
            await api.post("/api/deals", dealPayload);

            // Update Progress
            await api.post("/api/onboarding/progress/update", {
                userId: auth.user.id,
                task: "firstDeal"
            });
            onComplete();
        } catch (err) {
            console.error("Failed to create deal", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                    <Briefcase className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Log Your First Deal</h3>
                <p className="text-slate-400">Record a sample deal to see how commissions are calculated.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Deal Name</label>
                    <input
                        type="text"
                        value={formData.dealName}
                        onChange={(e) => setFormData({ ...formData, dealName: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Deal Amount (₹)</label>
                    <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500"
                        required
                    />
                </div>
                <button
                    disabled={loading}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                    {loading ? "Saving..." : "Create Deal & Continue"} <ArrowRight className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
};

// --- Step 3: Configure Policy ---
export const PolicyStep = ({ onComplete }) => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "Standard Commission",
        type: "INCENTIVE",
        commissionRate: "10",
        description: "Standard 10% commission on all deals",
        isActive: true
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Create Policy
            await api.post("/api/policy", {
                ...formData,
                createdBy: auth.user.id
            });

            // Update Progress
            await api.post("/api/onboarding/progress/update", {
                userId: auth.user.id,
                task: "firstRule"
            });
            onComplete();
        } catch (err) {
            console.error("Failed to create policy", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Set Incentive Policy</h3>
                <p className="text-slate-400">Define how your team earns their rewards.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Policy Name</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-pink-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Commission Rate (%)</label>
                    <input
                        type="number"
                        value={formData.commissionRate}
                        onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-pink-500"
                        required
                    />
                </div>
                <button
                    disabled={loading}
                    className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                    {loading ? "Saving..." : "Save Policy & Continue"} <ArrowRight className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
};

// --- Step 4: Invite User ---
export const InviteStep = ({ onComplete }) => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [invited, setInvited] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/api/invitations/send", {
                email,
                role: "SALES",
                invitedBy: auth.user.id
            });

            // Update Progress
            await api.post("/api/onboarding/progress/update", {
                userId: auth.user.id,
                task: "firstInvite"
            });

            setInvited(true);
            setTimeout(() => {
                onComplete();
            }, 1500); // Wait for animation
        } catch (err) {
            console.error("Failed to send invite", err);
        } finally {
            setLoading(false);
        }
    };

    if (invited) {
        return (
            <div className="text-center py-10 space-y-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mx-auto w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center"
                >
                    <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white">Invitation Sent!</h3>
                <p className="text-slate-400">Your Sales Reward Engine is ready to go.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Invite Your Team</h3>
                <p className="text-slate-400">Send an invitation to a sales executive to join your team.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500"
                        required
                        placeholder="colleague@company.com"
                    />
                </div>
                <button
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                    {loading ? "Sending..." : "Send Invite & Finish"} <ArrowRight className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
};
