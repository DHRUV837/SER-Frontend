import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, Building2, ArrowRight, CheckCircle, ShieldCheck } from "lucide-react";
import AppIcon from "../components/common/AppIcon";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        companyName: "" // Added for Enterprise context
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Pass companyName as additional data to register
            await register(formData.name, formData.email, formData.password, "ADMIN", { companyName: formData.companyName });
            // Redirect to onboarding wizard
            navigate("/admin");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Registration failed");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-950 font-inter text-slate-50">
            {/* Left Side - Visual & Value Prop (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 flex-col justify-between p-12 border-r border-slate-800">
                {/* Abstract Background */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white">
                        <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                            <AppIcon size="w-6 h-6" />
                        </div>
                        <span>SalesReward</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-4xl font-bold leading-tight mb-6 text-white">
                        Empower your sales team with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">intelligent incentives.</span>
                    </h1>
                    <p className="text-lg text-slate-400 mb-8">
                        Join thousands of forward-thinking companies automating their sales commissions and boosting performance.
                    </p>

                    <div className="space-y-4">
                        {[
                            "Automated Commission Tracking",
                            "Real-time Performance Dashboards",
                            "Enterprise-Grade Security",
                            "Instant Payout Generation"
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-slate-300">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-sm text-slate-500 flex items-center gap-4">
                    <span>© 2024 Sales Reward Engine</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span>Enterprise Edition</span>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-slate-950 relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none" />

                <div className="w-full max-w-md space-y-8 relative z-10">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <AppIcon size="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Create Workspace</h2>
                        <p className="mt-2 text-slate-400">
                            Get started with your Admin account. No credit card required.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none text-white placeholder:text-slate-600 hover:border-slate-700"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Company Name</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                                    <input
                                        name="companyName"
                                        type="text"
                                        placeholder="Acme Inc."
                                        required
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none text-white placeholder:text-slate-600 hover:border-slate-700"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Work Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="admin@company.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none text-white placeholder:text-slate-600 hover:border-slate-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none text-white placeholder:text-slate-600 hover:border-slate-700"
                                />
                            </div>
                            <p className="text-xs text-slate-500 ml-1">Must be at least 8 characters.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Create Account <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-6 text-center border-t border-slate-800">
                        <p className="text-slate-400 text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
