import { Map, ShoppingBag, TrendingUp, Award } from "lucide-react";

const WorkContextStep = ({ formData, setFormData, handleNext }) => {

    return (
        <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Work Context</h2>
                <p className="text-slate-400">Define your operational focus areas.</p>
            </div>

            <div className="space-y-6">

                {/* Territory */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-300">Sales Territory / Region</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {["North America", "EMEA", "APAC", "LATAM", "Global", "Local"].map((region) => (
                            <button
                                key={region}
                                onClick={() => setFormData({ ...formData, territory: region })}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${formData.territory === region
                                        ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                                        : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                                    }`}
                            >
                                {region}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Category */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-300">Primary Product Category</label>
                    <div className="relative">
                        <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <select
                            value={formData.productCategory}
                            onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 appearance-none"
                        >
                            <option value="">Select Category...</option>
                            <option value="SaaS Subscriptions">SaaS Subscriptions</option>
                            <option value="Enterprise Licenses">Enterprise Licenses</option>
                            <option value="Professional Services">Professional Services</option>
                            <option value="Hardware">Hardware</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Experience Level */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-300">Experience Level</label>
                    <div className="bg-slate-900/50 p-1 rounded-xl border border-slate-800 flex">
                        {["Junior", "Mid-Level", "Senior", "Expert"].map((level) => (
                            <button
                                key={level}
                                onClick={() => setFormData({ ...formData, experienceLevel: level })}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${formData.experienceLevel === level
                                        ? "bg-slate-700 text-white shadow-sm"
                                        : "text-slate-500 hover:text-slate-300"
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-800">
                    <button
                        onClick={handleNext}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                        Continue to Security
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkContextStep;
