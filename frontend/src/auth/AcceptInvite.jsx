import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AppIcon from "../components/common/AppIcon";
import api, { API_URL } from "../api";
import { ArrowRight, Lock, User, CheckCircle } from "lucide-react";

const AcceptInvite = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [status, setStatus] = useState("verifying"); // verifying, valid, invalid, success
    const [inviteData, setInviteData] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("invalid");
            return;
        }

        // Validate Token with Backend
        axios.get(`${API_URL}/api/invitations/validate?token=${token}`)
            .then(res => {
                if (res.data.valid) {
                    setInviteData(res.data);
                    setStatus("valid");
                } else {
                    setStatus("invalid");
                }
            })
            .catch(err => {
                setStatus("invalid");
                setError(err.response?.data?.error || "Invalid or expired invite.");
            });
    }, [token]);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await api.post("/api/auth/complete-invite", {
                token,
                password
            });
            setStatus("success");
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    if (status === "verifying") {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-t-indigo-500 border-slate-800 animate-spin" />
                    <p className="text-slate-400">Verifying secure invitation...</p>
                </div>
            </div>
        );
    }

    if (status === "invalid") {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-900 border border-red-500/20 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Invalid Invitation</h2>
                    <p className="text-slate-400 mb-6">This invite link is invalid or has expired. Please ask your administrator for a new one.</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950 font-sans text-slate-50">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-transparent pointer-events-none" />

            <div className="relative w-full max-w-md mx-4 transform transition-all hover:scale-[1.002] duration-500">
                <div className="p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden bg-slate-900/80 backdrop-blur-xl border border-slate-800">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-slate-700 shadow-inner">
                            <AppIcon size="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Accept Invitation</h1>
                        <p className="text-sm text-slate-400">
                            Join <strong className='text-white'>{inviteData?.invitedBy || "Company Admin"}</strong>'s team as a Sales Executive.
                        </p>
                    </div>

                    {status === "success" ? (
                        <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Account Created!</h3>
                            <p className="text-slate-400 mb-4">Redirecting you to login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Work Email</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                        <User className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <input
                                        type="email"
                                        value={inviteData?.email}
                                        disabled
                                        className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-400 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Set Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                        <Lock className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Create a strong password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                        <Lock className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                Complete Registration <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AcceptInvite;
