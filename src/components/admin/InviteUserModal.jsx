import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, UserPlus, Briefcase, CheckCircle2, Copy, Sparkles } from "lucide-react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";

const InviteUserModal = ({ isOpen, onClose, onSuccess }) => {
    const { auth } = useAuth();
    const [step, setStep] = useState("form"); // form, success
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("SALES");
    const [selectedDealId, setSelectedDealId] = useState("");

    // Deals data
    const [deals, setDeals] = useState([]);
    const [loadingDeals, setLoadingDeals] = useState(false);

    // Success data
    const [inviteLink, setInviteLink] = useState("");

    useEffect(() => {
        if (isOpen && role === "SALES") {
            fetchDeals();
        }
    }, [isOpen, role]);

    const fetchDeals = async () => {
        setLoadingDeals(true);
        try {
            const res = await api.get("/api/deals");
            // Filter for unassigned deals or deals in PENDING status
            const availableDeals = res.data.filter(d =>
                !d.user || d.status === "PENDING" || d.status === "DRAFT"
            );
            setDeals(availableDeals);
        } catch (err) {
            console.error("Failed to fetch deals", err);
        } finally {
            setLoadingDeals(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const payload = {
                email,
                role,
                invitedBy: auth.user?.id, // Track who sent the invitation for onboarding
                ...(role === "SALES" && selectedDealId && { assignedDealId: parseInt(selectedDealId) })
            };

            const res = await api.post("/api/invitations/send", payload);
            setInviteLink(res.data.link);

            // Onboarding Progress: Mark 'First Invite' as complete
            try {
                if (auth.user && auth.user.id) {
                    await api.post("/api/onboarding/progress/update", {
                        userId: auth.user.id,
                        task: "firstInvite"
                    });
                }
            } catch (err) {
                console.error("Failed to update onboarding progress", err);
            }

            setStep("success");
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send invitation");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep("form");
        setEmail("");
        setRole("SALES");
        setSelectedDealId("");
        setInviteLink("");
        setError("");
        onClose();
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="relative w-full max-w-lg bg-surface-1 dark:bg-slate-900 rounded-2xl shadow-2xl border border-border-subtle overflow-hidden"
                >
                    {/* Glassmorphism overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />

                    {/* Header */}
                    <div className="relative px-6 py-5 border-b border-border-subtle bg-surface-2/50 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20">
                                    <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-text-primary">Invite Team Member</h3>
                                    <p className="text-xs text-text-muted">Send a secure invitation to join your team</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-surface-3 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-text-secondary" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative p-6">
                        {step === "form" ? (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {/* Email Input */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="colleague@company.com"
                                            required
                                            className="w-full pl-11 pr-4 py-3 bg-surface-2 border border-border-subtle rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Role Selection */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        Role
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setRole("SALES")}
                                            className={`p-4 rounded-lg border-2 transition-all ${role === "SALES"
                                                ? "border-indigo-500 bg-indigo-500/10"
                                                : "border-border-subtle hover:border-border-hover bg-surface-2"
                                                }`}
                                        >
                                            <Briefcase className={`w-6 h-6 mx-auto mb-2 ${role === "SALES" ? "text-indigo-600 dark:text-indigo-400" : "text-text-muted"
                                                }`} />
                                            <p className={`text-sm font-semibold ${role === "SALES" ? "text-indigo-600 dark:text-indigo-400" : "text-text-secondary"
                                                }`}>
                                                Sales Executive
                                            </p>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRole("ADMIN")}
                                            className={`p-4 rounded-lg border-2 transition-all ${role === "ADMIN"
                                                ? "border-purple-500 bg-purple-500/10"
                                                : "border-border-subtle hover:border-border-hover bg-surface-2"
                                                }`}
                                        >
                                            <Sparkles className={`w-6 h-6 mx-auto mb-2 ${role === "ADMIN" ? "text-purple-600 dark:text-purple-400" : "text-text-muted"
                                                }`} />
                                            <p className={`text-sm font-semibold ${role === "ADMIN" ? "text-purple-600 dark:text-purple-400" : "text-text-secondary"
                                                }`}>
                                                Administrator
                                            </p>
                                        </button>
                                    </div>
                                </div>

                                {/* Deal Assignment (only for SALES role) */}
                                {role === "SALES" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2"
                                    >
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                            Assign Deal (Optional)
                                        </label>
                                        {loadingDeals ? (
                                            <div className="p-4 bg-surface-2 rounded-lg text-center">
                                                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                                <p className="text-xs text-text-muted mt-2">Loading deals...</p>
                                            </div>
                                        ) : deals.length === 0 ? (
                                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                                <p className="text-sm text-amber-700 dark:text-amber-400">
                                                    No unassigned deals available. You can assign deals later from the Deal Management page.
                                                </p>
                                            </div>
                                        ) : (
                                            <select
                                                value={selectedDealId}
                                                onChange={(e) => setSelectedDealId(e.target.value)}
                                                className="w-full px-4 py-3 bg-surface-2 border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                            >
                                                <option value="">Select a deal (optional)</option>
                                                {deals.map(deal => (
                                                    <option key={deal.id} value={deal.id}>
                                                        {deal.dealName || deal.clientName || `Deal #${deal.id}`} - ₹{deal.amount?.toLocaleString()}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </motion.div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex-1 px-4 py-3 bg-surface-2 hover:bg-surface-3 text-text-secondary font-medium rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-4 h-4" />
                                                Send Invitation
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6 space-y-6"
                            >
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-text-primary mb-2">Invitation Sent!</h4>
                                    <p className="text-sm text-text-secondary">
                                        Copy the link below and share it with your team member
                                    </p>
                                </div>
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-3">
                                    <div className="flex items-center gap-2 bg-surface-1 dark:bg-slate-950 p-3 rounded-lg border border-border-subtle">
                                        <input
                                            readOnly
                                            value={inviteLink}
                                            className="flex-1 bg-transparent text-xs text-text-secondary outline-none"
                                        />
                                        <button
                                            onClick={copyToClipboard}
                                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded transition-colors flex items-center gap-1"
                                        >
                                            <Copy className="w-3 h-3" />
                                            COPY
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="w-full py-3 bg-surface-2 hover:bg-surface-3 text-text-primary font-medium rounded-xl transition-colors"
                                >
                                    Done
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default InviteUserModal;
