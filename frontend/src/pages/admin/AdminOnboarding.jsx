import { API_URL } from "../../api";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, Circle, Lock, ArrowRight, ShieldCheck, FileText, Target, Users, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppIcon from "../../components/common/AppIcon";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { TargetStep, DealStep, PolicyStep, InviteStep } from "../../components/onboarding/OnboardingSteps";

function BriefcaseIcon(props) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
}

const AdminOnboarding = () => {
    const navigate = useNavigate();
    const { auth, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState({
        firstTargetCreated: false,
        firstDealCreated: false,
        firstRuleConfigured: false,
        firstUserInvited: false
    });

    useEffect(() => {
        if (auth?.user?.id) {
            fetchProgress();
        } else {
            // If no user presumably handled by RequireAuth, but for safety:
            setLoading(false);
        }
    }, [auth.user]);

    const fetchProgress = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/onboarding/progress/${auth.user.id}`);
            const data = res.data;
            setProgress(data);

            // Determine which step to show
            if (!data.firstTargetCreated) setCurrentStep(0);
            else if (!data.firstDealCreated) setCurrentStep(1);
            else if (!data.firstRuleConfigured) setCurrentStep(2);
            else if (!data.firstUserInvited) setCurrentStep(3);
            else setCurrentStep(4); // All done
        } catch (err) {
            console.error("Failed to fetch progress", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStepComplete = () => {
        fetchProgress();
    };

    const handleFinalize = () => {
        updateUser(true); // Update local state and localStorage
        navigate("/admin");
    };

    const steps = [
        { id: 0, title: "Set Target", icon: Target, completed: progress.firstTargetCreated, component: TargetStep },
        { id: 1, title: "Create Deal", icon: BriefcaseIcon, completed: progress.firstDealCreated, component: DealStep },
        { id: 2, title: "Set Policy", icon: FileText, completed: progress.firstRuleConfigured, component: PolicyStep },
        { id: 3, title: "Invite Team", icon: Users, completed: progress.firstUserInvited, component: InviteStep }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (currentStep === 4) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-inter text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-slate-900/50 backdrop-blur border border-slate-800 rounded-3xl p-10 shadow-2xl"
                >
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h2 className='text-3xl font-bold text-white mb-4'>You're All Set!</h2>
                    <p className="text-slate-400 mb-8">
                        Your workspace is configured and ready for action. Access your command center now.
                    </p>
                    <button
                        onClick={handleFinalize}
                        className="w-full py-4 bg-white text-slate-950 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                        Enter Dashboard <ArrowRight className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        );
    }

    const ActiveComponent = steps[currentStep].component;

    return (
        <div className="min-h-screen bg-slate-950 flex font-inter">
            {/* Left Sidebar: Progress */}
            <div className="w-1/3 p-8 border-r border-slate-800 hidden lg:flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />
                <div className="z-10 flex items-center gap-3 mb-10">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                        <AppIcon size="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">Sales Engine</span>
                </div>

                <div className="space-y-8 z-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Setup Wizard</h1>
                        <p className="text-slate-400">Complete these 4 steps to activate your workspace.</p>
                    </div>

                    <div className="space-y-4">
                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            // Status: 0 = current, -1 = past/done, 1 = future
                            const isActive = idx === currentStep;
                            const isDone = idx < currentStep;

                            return (
                                <div
                                    key={step.id}
                                    className={`flex items-center gap-4 p-4 rounded-xl transition-all border ${isActive
                                        ? "bg-indigo-500/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                                        : isDone
                                            ? "bg-slate-900 border-emerald-500/30 opacity-70"
                                            : "bg-transparent border-transparent opacity-40"
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isActive ? "bg-indigo-600 border-indigo-600 text-white" :
                                        isDone ? "bg-emerald-500 border-emerald-500 text-slate-950" :
                                            "border-slate-600 text-slate-500"
                                        }`}>
                                        {isDone ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className={`font-semibold ${isActive ? 'text-white' : "text-slate-400"}`}>{step.title}</h4>
                                        {isActive && <span className="text-xs text-indigo-400 font-medium">In Progress</span>}
                                        {isDone && <span className="text-xs text-emerald-400 font-medium">Completed</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Right Side: Active Step Form */}
            <div className="flex-1 flex items-center justify-center p-6 relative">
                <div className="absolute top-0 right-0 p-8">
                    <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-slate-500 hover:text-white text-sm">
                        Logout
                    </button>
                </div>

                <div className="w-full max-w-lg">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-slate-900/80 backdrop-blur border border-slate-800 p-8 rounded-3xl shadow-2xl"
                        >
                            <ActiveComponent onComplete={handleStepComplete} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AdminOnboarding;
