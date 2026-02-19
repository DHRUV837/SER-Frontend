import api from "../../../api";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const OrganizationStep = ({ formData, setFormData, handleNext }) => {
    const { auth } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Save organization to backend
            await api.post("/api/onboarding/organization", {
                userId: auth.user.id,
                name: formData.orgName,
                industry: formData.industry,
                companySize: formData.companySize,
                currency: formData.currency,
                fiscalYear: formData.fiscalYear
            });
            handleNext();
        } catch (error) {
            console.error("Failed to save org", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-white mb-2">Organization Details</h2>
            <p className="text-slate-400 mb-8">Tell us a bit about your company to tailor the experience.</p>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Company Name</label>
                    <input
                        type="text"
                        value={formData.orgName}
                        onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                        placeholder="Acme Corp"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Industry</label>
                        <select
                            value={formData.industry}
                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="">Select...</option>
                            <option value="SaaS">SaaS / Technology</option>
                            <option value="Finance">Finance</option>
                            <option value="Retail">Retail</option>
                            <option value="Healthcare">Healthcare</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Size</label>
                        <select
                            value={formData.companySize}
                            onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="1-10">1-10 Employees</option>
                            <option value="11-50">11-50 Employees</option>
                            <option value="51-200">51-200 Employees</option>
                            <option value="200+">200+ Employees</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Currency</label>
                        <select
                            value={formData.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="USD">USD ($)</option>
                            <option value="INR">INR (₹)</option>
                            <option value="EUR">EUR (€)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Fiscal Year</label>
                        <select
                            value={formData.fiscalYear}
                            onChange={(e) => setFormData({ ...formData, fiscalYear: e.target.value })}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="Jan-Dec">Jan - Dec</option>
                            <option value="Apr-Mar">Apr - Mar</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleSave}
                        disabled={isLoading || !formData.orgName}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
                    >
                        {isLoading ? "Saving..." : "Save & Continue"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrganizationStep;
