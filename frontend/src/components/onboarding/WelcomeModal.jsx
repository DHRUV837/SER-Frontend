import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle, Zap, Building2, Users, Send } from "lucide-react";
import { useOnboarding } from "../../context/OnboardingContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const WelcomeModal = () => {
    const { showWelcome, dismissWelcome } = useOnboarding();
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(0); // 0: Welcome, 1: Invite, 2: Success
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviting, setInviting] = useState(false);
    const [inviteError, setInviteError] = useState("");

    // Reset state when modal opens or user changes
    useEffect(() => {
        if (showWelcome) {
            setStep(0);
            setInviteEmail("");
            setInviteError("");
            setInviting(false);
        }
    }, [showWelcome, auth.user?.id]);

    if (!showWelcome || !auth.user) return null;

    const user = auth.user;
    const firstName = user.name?.split(" ")[0] || "Admin";
    const companyName = user.organizationName || "Your Company";

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!inviteEmail) return;

        setInviting(true);
        setInviteError("");

        try {
            await api.post("/api/invitations/send", {
                email: inviteEmail,
                role: "SALES",
                invitedBy: user.id
            });

            // Mark step as complete in onboarding progress
            try {
                await api.post("/api/onboarding/progress/update", {
                    userId: user.id,
                    task: "firstInvite"
                });
            } catch (pErr) {
                console.warn("Failed to update progress", pErr);
            }

            // Advance to success step
            setStep(2);
        } catch (err) {
            console.error("Invite failed", err);
            setInviteError("Failed to send invite. Please try again.");
        } finally {
            setInviting(false);
        }
    };

    const handleSkip = () => {
        dismissWelcome();
    };

    const handleFinish = () => {
        dismissWelcome();
        // optionally navigate to dashboard or onboarding wizard
        // navigate("/admin/onboarding"); // or stay on current page
    };

    // Animation Variants
    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative"
                >
                    {/* Background Effects */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative p-8 min-h-[400px] flex flex-col">
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={handleSkip}
                                className="p-2 text-slate-500 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <AnimatePresence mode="wait" custom={step}>
                            {step === 0 && (
                                <motion.div
                                    key="welcome"
                                    custom={step}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                    className="flex-1 flex flex-col items-center text-center justify-center"
                                >
                                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-8 rotate-3 transform hover:rotate-6 transition-transform">
                                        <Zap className="w-10 h-10 text-white fill-white" />
                                    </div>

                                    <h2 className="text-3xl font-bold text-white mb-2">
                                        Welcome, {firstName}!
                                    </h2>
                                    <p className="text-xl text-indigo-400 font-medium mb-6 flex items-center gap-2 justify-center">
                                        <Building2 className="w-5 h-5" />
                                        {companyName}
                                    </p>

                                    <p className="text-slate-400 leading-relaxed mb-8 max-w-sm">
                                        Your enterprise workspace is ready. Let's start by inviting your first sales team member to the platform.
                                    </p>

                                    <button
                                        onClick={() => setStep(1)}
                                        className="py-3.5 px-8 bg-white text-slate-950 font-bold rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-lg shadow-white/10"
                                    >
                                        Get Started <ArrowRight className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )}

                            {step === 1 && (
                                <motion.div
                                    key="invite"
                                    custom={step}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                    className="flex-1 flex flex-col"
                                >
                                    <div className="text-center mb-6">
                                        <div className="mx-auto w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                                            <Users className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white">Invite Team Member</h3>
                                        <p className="text-slate-400 text-sm mt-1">
                                            Send an invite to your first sales executive.
                                        </p>
                                    </div>

                                    <form onSubmit={handleInvite} className="space-y-4 flex-1 flex flex-col justify-center">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Address</label>
                                            <div className="relative">
                                                <Send className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
                                                <input
                                                    type="email"
                                                    value={inviteEmail}
                                                    onChange={(e) => setInviteEmail(e.target.value)}
                                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 pl-10 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-600"
                                                    placeholder="sales@company.com"
                                                    required
                                                    autoFocus
                                                />
                                            </div>
                                        </div>

                                        {inviteError && (
                                            <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                                                {inviteError}
                                            </p>
                                        )}

                                        <div className="pt-4 flex flex-col gap-3">
                                            <button
                                                type="submit"
                                                disabled={inviting}
                                                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {inviting ? (
                                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <>Send Invitation <ArrowRight className="w-4 h-4" /></>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleSkip}
                                                className="text-slate-500 hover:text-white text-sm font-medium py-2"
                                            >
                                                Skip for now
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="success"
                                    custom={step}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.3 }}
                                    className="flex-1 flex flex-col items-center justify-center text-center"
                                >
                                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-6 animate-pulse">
                                        <CheckCircle className="w-10 h-10 text-white" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2">Invitation Sent!</h3>
                                    <p className="text-slate-400 mb-8 max-w-xs mx-auto">
                                        We've sent an email to <strong>{inviteEmail}</strong>. They can join your workspace immediately.
                                    </p>

                                    <button
                                        onClick={handleFinish}
                                        className="w-full py-3.5 bg-white text-slate-950 font-bold rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Go to Dashboard <ArrowRight className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Step Indicators */}
                        <div className="flex justify-center gap-2 mt-6">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-indigo-500" : "w-1.5 bg-slate-700"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default WelcomeModal;
