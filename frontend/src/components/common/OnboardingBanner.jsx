import { Rocket, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const OnboardingBanner = () => {
    const { auth } = useAuth();

    // Safety check: specific strict check for false prevents undefined/null showing it for existing users
    if (auth?.onboardingCompleted !== false) return null;

    return (
        <div className="mb-6 rounded-xl bg-gradient-to-r from-indigo-900/50 to-blue-900/50 border border-indigo-500/30 p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors duration-500" />

            <div className="flex items-start gap-4 z-10">
                <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Rocket className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg">Set up your workspace</h3>
                    <p className="text-slate-400 text-sm mt-1">
                        Complete your organization profile and preferences to unlock full AI capabilities.
                    </p>
                </div>
            </div>

            <div className="z-10 w-full md:w-auto">
                <Link
                    to="/onboarding"
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-lg hover:shadow-indigo-500/25"
                >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default OnboardingBanner;
