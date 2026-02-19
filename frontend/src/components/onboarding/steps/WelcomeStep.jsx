import React from "react";
import { ArrowRight, Building2, User } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const WelcomeStep = ({ handleNext }) => {
    const { auth } = useAuth();
    const user = auth?.user;

    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-8 animate-in fade-in zoom-in duration-500">

            <div className="space-y-4">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-6">
                    <Building2 className="w-12 h-12 text-white" />
                </div>

                <h1 className="text-4xl font-bold text-white tracking-tight">
                    Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{user?.organizationName || "Sales Reward Engine"}</span>
                </h1>

                <p className="text-xl text-slate-400 max-w-lg mx-auto">
                    Hello, <span className="text-white font-medium">{user?.name}</span>! Your workspace is ready. Let's get your team set up to start tracking incentives.
                </p>
            </div>

            <div className="pt-8">
                <button
                    onClick={handleNext}
                    className="group relative px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl shadow-xl shadow-white/10 hover:shadow-white/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3 overflow-hidden"
                >
                    <span className="relative z-10">Get Started</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>

        </div>
    );
};

export default WelcomeStep;
