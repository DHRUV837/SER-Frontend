import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Rocket } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";

// Import New Steps
import WelcomeStep from "./steps/WelcomeStep";
import InviteStep from "./steps/InviteStep";

const OnboardingWizard = () => {
    const { auth, login } = useAuth();

    // Simplified 2-Step Flow
    const steps = [
        { id: 'welcome', title: "Welcome", component: WelcomeStep },
        { id: 'invite', title: "Invite Team", component: InviteStep }
    ];

    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(curr => curr + 1);
        } else {
            handleCompletion();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(curr => curr - 1);
        }
    };

    const CurrentComponent = steps[currentStep].component;

    const handleCompletion = async () => {
        try {
            console.log("Completing onboarding...");

            // Just mark onboarding as complete
            await api.post("/api/onboarding/complete", {}, {
                headers: {
                    Authorization: `Bearer ${auth?.token || ''}`
                }
            });

            // Update local auth state
            const updatedAuth = {
                ...auth,
                user: {
                    ...auth.user,
                    onboardingCompleted: true
                },
                onboardingCompleted: true
            };

            login(updatedAuth);

            // Redirect happens automatically via AuthContext/Router when onboardingCompleted is true
            // or we can force it if needed, but App.jsx RequireAuth should handle it.

        } catch (error) {
            console.error("Failed to complete onboarding:", error);
            // Even if backend fails, if it's a network issue, we might want to let them in? 
            // Better to show error.
            alert("Something went wrong finishing setup. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-inter">
            <div className="w-full max-w-5xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] ring-1 ring-white/10">

                {/* Sidebar - Simplified */}
                <div className="w-full md:w-72 bg-slate-900/80 border-r border-slate-800 p-8 flex flex-col relative overflow-hidden justify-between">
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Rocket className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-white tracking-tight">Setup</h1>
                        </div>

                        <div className="space-y-4">
                            {steps.map((step, index) => {
                                const isActive = index === currentStep;
                                const isCompleted = index < currentStep;

                                return (
                                    <div
                                        key={step.id}
                                        className={`flex items-center gap-3 transition-colors ${isActive ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all
                                            ${isActive ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400' :
                                                isCompleted ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' :
                                                    'border-slate-700 bg-slate-800 text-slate-500'}`}
                                        >
                                            {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
                                        </div>
                                        <span className="text-sm font-medium">{step.title}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="relative z-10">
                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-indigo-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col relative bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950">
                    <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full max-w-2xl"
                            >
                                <CurrentComponent
                                    handleNext={handleNext}
                                    handleBack={handleBack}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingWizard;
