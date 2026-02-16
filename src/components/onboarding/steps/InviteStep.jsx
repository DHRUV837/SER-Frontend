import React, { useState } from "react";
import { Mail, Plus, X, ArrowRight, CheckCircle, ShieldCheck, Send } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api";

const InviteStep = ({ handleNext }) => {
    const { auth } = useAuth();
    const [email, setEmail] = useState("");
    const [invites, setInvites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAddInvite = async (e) => {
        e.preventDefault();
        if (!email || !email.includes("@")) return;

        setLoading(true);
        setError("");

        try {
            await api.post("/api/invitations/send", {
                email: email.trim(),
                invitedBy: auth.user.id,
                role: "SALES"
            }, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });

            setInvites([...invites, { email: email.trim(), status: 'sent' }]);
            setEmail("");
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || "Failed to send invite");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col max-w-2xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-4">
                    <Mail className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Invite your Sales Team</h2>
                <p className="text-slate-400">Add your team members so they can track their earnings and performance.</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                <form onSubmit={handleAddInvite} className="flex gap-3 mb-6">
                    <div className="relative flex-1">
                        <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                        <input
                            type="email"
                            placeholder="colleague@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                        <span>Send</span>
                    </button>
                </form>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <div className="space-y-3">
                    {invites.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-xl">
                            <p className="text-slate-500 text-sm">No pending invites. Add emails above.</p>
                        </div>
                    ) : (
                        invites.map((invite, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                                        {invite.email[0].toUpperCase()}
                                    </div>
                                    <span className="text-white font-medium">{invite.email}</span>
                                </div>
                                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> Sent
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <button
                    onClick={handleNext}
                    className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-lg shadow-white/5 flex items-center justify-center gap-2 group"
                >
                    {invites.length > 0 ? "Finish Setup" : "Skip for Now"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-xs text-slate-500">
                    You can always invite more members later from the User Management page.
                </p>
            </div>

        </div>
    );
};

export default InviteStep;
