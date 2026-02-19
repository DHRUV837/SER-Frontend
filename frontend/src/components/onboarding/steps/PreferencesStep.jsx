import { Bell, FileText, Settings, CheckSquare } from "lucide-react";
import { useState } from "react";

const PreferencesStep = ({ formData, setFormData, handleNext }) => {

    // Helper to toggle checkbox values in formData
    const togglePreference = (category, key) => {
        const current = formData[category] || {};
        setFormData({
            ...formData,
            [category]: { ...current, [key]: !current[key] }
        });
    };

    const isLegalAccepted = formData.legal?.terms && formData.legal?.privacy;

    return (
        <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Final Touches</h2>
                <p className="text-slate-400">Set your preferences and accept legal terms.</p>
            </div>

            <div className="space-y-6">

                {/* Incentive Preferences */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-300">Preferred Incentive Model</label>
                    <div className="grid grid-cols-2 gap-3">
                        {["Commission Based", "Performance Bonus", "Hybrid"].map(type => (
                            <button
                                key={type}
                                onClick={() => setFormData({ ...formData, incentiveType: type })}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${formData.incentiveType === type
                                        ? "bg-emerald-600/20 border-emerald-500 text-emerald-400"
                                        : "bg-slate-800/50 border-slate-700 text-slate-400"
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                        <Bell className="w-4 h-4" /> Notifications
                    </h3>
                    <div className="space-y-3">
                        {['email', 'push', 'reports'].map(type => (
                            <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.notifications?.[type]
                                        ? "bg-indigo-600 border-indigo-600"
                                        : "bg-slate-800 border-slate-600 group-hover:border-slate-500"
                                    }`}>
                                    {formData.notifications?.[type] && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={formData.notifications?.[type] || false}
                                    onChange={() => togglePreference('notifications', type)}
                                />
                                <span className="text-slate-400 capitalize">
                                    {type === 'reports' ? 'Weekly Performance Reports' : 'Enable ${type} alerts`}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Legal */}
                <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Legal & Compliance
                    </h3>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.legal?.terms
                                    ? "bg-indigo-600 border-indigo-600"
                                    : "bg-slate-800 border-slate-600 group-hover:border-slate-500"
                                }`}>
                                {formData.legal?.terms && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={formData.legal?.terms || false}
                                onChange={() => togglePreference('legal', 'terms')}
                            />
                            <span className="text-slate-400 text-sm">
                                I agree to the <a href="#" className="text-indigo-400 hover:underline">Terms of Service</a>
                            </span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.legal?.privacy
                                    ? "bg-indigo-600 border-indigo-600"
                                    : "bg-slate-800 border-slate-600 group-hover:border-slate-500"
                                }`}>
                                {formData.legal?.privacy && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={formData.legal?.privacy || false}
                                onChange={() => togglePreference('legal', 'privacy')}
                            />
                            <span className="text-slate-400 text-sm">
                                I accept the <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a>
                            </span>
                        </label>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-800">
                    <button
                        onClick={handleNext}
                        disabled={!isLegalAccepted}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                        Complete Setup
                    </button>
                    {!isLegalAccepted && (
                        <p className="text-center text-xs text-slate-500 mt-2">Please accept legal terms to proceed.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PreferencesStep;
