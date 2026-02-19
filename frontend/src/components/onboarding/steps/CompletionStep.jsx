import { useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import axios from "axios";

const CompletionStep = () => {
    const { auth, login } = useAuth(); // We need login to update the local auth state
    const navigate = useNavigate();

    useEffect(() => {
        const completeProfileSetup = async () => {
            // Profile has been saved in the previous step (PreferencesStep -> handleCompletion)
            // The backend has marked onboardingCompleted = true
            // Now redirect to the appropriate dashboard based on role

            setTimeout(() => {
                const role = auth?.user?.role || "SALES";
                const dashboardPath = role === "ADMIN" ? "/admin" : "/sales";

                // Redirect to dashboard where welcome modal will appear
                window.location.href = dashboardPath;
            }, 2000);
        };

        completeProfileSetup();
    }, [auth]);

    return (
        <div className="h-full flex flex-col items-center justify-center text-center relative animate-in fade-in zoom-in duration-500">
            <div className="mb-6 p-4 rounded-full bg-indigo-500/20 text-indigo-400">
                <Sparkles className="w-16 h-16 animate-pulse" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">Profile Set Up Successfully!</h2>
            <p className="text-slate-400 text-lg">Redirecting you to the Setup Hub to finish activation...</p>
        </div>
    );
};

export default CompletionStep;
