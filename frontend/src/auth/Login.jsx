import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppIcon from "../components/common/AppIcon";
import api from "../api";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("SALES"); // SALES or ADMIN
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", {
        email,
        password
      });

      const user = res.data;

      // Role Mismatch Check
      if (selectedRole === "ADMIN" && user.role !== "ADMIN") {
        alert("Access Denied: You are not an Admin.");
        return;
      }

      if (selectedRole === "SALES" && user.role === "ADMIN") {
        // Allow Admins to log in as sales? Maybe not. Let's redirect to admin anyway or warn.
        // For now, strict check:
        // alert("Please log in as Admin.");
        // return;
        // Actually, let's just use the returned role for navigation, but the radio button sets the "Expectation".
      }

      login(user);

      if (user.role === "ADMIN") navigate("/admin");
      else navigate("/sales");

    } catch (err) {
      alert("Login Failed: " + (err.response?.data || "Server Error"));
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-bg-secondary font-sans text-text-primary transition-colors duration-300">

      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5 dark:from-primary-900/20 dark:to-accent-900/20 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-500/10 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-50 animate-blob" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent-500/10 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-50 animate-blob animation-delay-2000" />

      {/* Main Glass Card */}
      <div className="relative w-full max-w-md mx-4 transform transition-all hover:scale-[1.002] duration-500">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-2xl border border-white/20 dark:border-white/10">

          {/* Header Section */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-border-subtle shadow-inner">
              <AppIcon size="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-sm text-text-secondary">
              Sign in to manage your sales rewards
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="relative p-1 bg-surface-3 rounded-xl flex mb-8 border border-border-subtle/50">
            <button
              onClick={() => setSelectedRole("ADMIN")}
              className={`flex-1 relative z-10 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${selectedRole === "ADMIN"
                  ? "text-primary-600 dark:text-white shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
                }`}
            >
              Administrator
              {selectedRole === "ADMIN" && (
                <div className="absolute inset-0 bg-surface-1 rounded-lg shadow-sm -z-10 border border-border-subtle animate-in fade-in zoom-in-95 duration-200" />
              )}
            </button>
            <button
              onClick={() => setSelectedRole("SALES")}
              className={`flex-1 relative z-10 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${selectedRole === "SALES"
                  ? "text-accent-600 dark:text-white shadow-sm"
                  : "text-text-muted hover:text-text-secondary"
                }`}
            >
              Sales Executive
              {selectedRole === "SALES" && (
                <div className="absolute inset-0 bg-surface-1 rounded-lg shadow-sm -z-10 border border-border-subtle animate-in fade-in zoom-in-95 duration-200" />
              )}
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-muted ml-1">Email</label>
              <input
                className="w-full px-5 py-3.5 rounded-xl bg-surface-2 border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all duration-300"
                type="email"
                placeholder={selectedRole === "ADMIN" ? "admin@company.com" : "sales@company.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-muted ml-1">Password</label>
              <input
                className="w-full px-5 py-3.5 rounded-xl bg-surface-2 border border-border-subtle text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all duration-300"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-4 px-6 mt-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform active:scale-[0.98] ${selectedRole === "ADMIN"
                  ? "bg-gradient-to-r from-primary-600 to-primary-500 hover:shadow-primary-500/25 shadow-primary-500/10"
                  : "bg-gradient-to-r from-accent-600 to-accent-500 hover:shadow-accent-500/25 shadow-accent-500/10"
                }`}
            >
              <span className="flex items-center justify-center gap-2">
                Sign In
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </form>

          {/* Footer / Demo Info */}
          <div className="mt-8 pt-6 border-t border-border-subtle/50 text-center">
            <p className="text-xs text-text-muted">
              <span className="font-medium text-text-secondary">Demo Access:</span> Use any email to auto-register.
            </p>
          </div>
        </div>

        {/* Subtle Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full blur-2xl -z-10" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-accent-500/20 to-transparent rounded-full blur-2xl -z-10" />
      </div>
    </div>
  );
};

export default Login;
