import { Building2, Briefcase, MapPin, Users, Hash } from "lucide-react";

const RoleOrgStep = ({ formData, setFormData, handleNext }) => {

    // Mock Data for Dropdowns
    const roles = ["Sales Representative", "Sales Manager", "Regional Director", "Finance Admin", "System Admin"];
    const departments = ["Sales", "Marketing", "Finance", "Operations", "HR"];

    const isNextDisabled = !formData.role || !formData.orgName || !formData.department;

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Role & Organization</h2>
                <p className="text-slate-400">Map your position within the company hierarchy.</p>
            </div>

            <div className="space-y-6">

                {/* Organization Section */}
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-indigo-400" />
                        Organization Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Company Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={formData.orgName}
                                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="Acme Inc."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Branch / Region</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    value={formData.branch}
                                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="e.g. New York HQ"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Role Section */}
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-emerald-400" />
                        Your Role
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Job Title / Role <span className="text-red-500">*</span></label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-indigo-500"
                            >
                                <option value="">Select Role...</option>
                                {roles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Department <span className="text-red-500">*</span></label>
                            <select
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:border-indigo-500"
                            >
                                <option value="">Select...</option>
                                {departments.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Employee ID</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    value={formData.employeeId}
                                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Reporting Manager</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    value={formData.manager}
                                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-9 pr-3 text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="Manager Name"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-800">
                    <button
                        onClick={handleNext}
                        disabled={isNextDisabled}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                        Continue to Work Context
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleOrgStep;
