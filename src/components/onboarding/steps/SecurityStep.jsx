import { Shield, Smartphone, Key, Check } from "lucide-react";
import { useState } from "react";

const SecurityStep = ({ formData, setFormData, handleNext }) => {
    const [twoFAEnabled, setTwoFAEnabled] = useState(formData.security?.twoFA || false);

    const toggleTwoFA = () => {
        const newState = !twoFAEnabled;
        setTwoFAEnabled(newState);
        setFormData({ ...formData, security: { ...formData.security, twoFA: newState } });
    };

    return (
        <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Account Security</h2>
                <p className="text-slate-400">Protect your account and earnings data.</p>
            </div>

            <div className="space-y-6">

                {/* 2FA Toggle */}
                <div
                    onClick={toggleTwoFA}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${twoFAEnabled
                            ? "bg-indigo-600/10 border-indigo-500"
                            : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                        }`}
                >
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${twoFAEnabled ? 'bg-indigo-600 text-white' : "bg-slate-800 text-slate-500"}`}>
                            <Smartphone className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className={`text-lg font-semibold ${twoFAEnabled ? 'text-indigo-400' : "text-white"}`}>
                                Two-Factor Authentication
                            </h3>
                            <p className="text-slate-400 text-sm mt-1">
                                {twoFAEnabled
                                    ? \"Enabled. You\"ll receive a code via SMS/App on login."
                                    : "Secure your account with an extra layer of protection.`}
                            </p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${twoFAEnabled ? "bg-indigo-600 border-indigo-600" : "border-slate-600"
                            }`}>
                            {twoFAEnabled && <Check className="w-4 h-4 text-white" />}
                        </div>
                    </div>
                </div>

                {/* Password Status */}
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex items-center gap-4 opacity-75">
                    <div className="p-3 bg-slate-800 rounded-xl text-emerald-500">
                        <Key className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-white font-medium">Password Set</h3>
                        <p className="text-sm text-slate-500">Your password meets enterprise strength requirements.</p>
                    </div>
                    <button className="ml-auto text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                        Update
                    </button>
                </div>

                <div className="pt-6 border-t border-slate-800">
                    <button
                        onClick={handleNext}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                        Continue to Preferences
                    </button>
                    <button
                        onClick={handleNext}
                        className="w-full mt-3 py-3 text-slate-500 hover:text-slate-300 text-sm font-medium"
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SecurityStep;
