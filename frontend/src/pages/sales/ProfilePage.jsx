import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../api";
import TierBadge from "../../components/common/TierBadge";

const ProfilePage = () => {
  const { auth } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = auth?.user?.id || auth?.id;
  const isSales = auth?.user?.role === "SALES" || auth?.role === "SALES";

  useEffect(() => {
    if (userId) {
      api.get(`/performance/summary?userId=${userId}`)
        .then(res => setProfileData(res.data))
        .catch(err => console.error("Failed to fetch profile", err))
        .finally(() => setLoading(false));
    }
  }, [userId]);

  if (loading) return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  if (!profileData) return <div className="p-8 text-center text-text-secondary">Profile data unavailable.</div>;

  // Dynamic Gradient based on Tier or Role
  const getBgGradient = () => {
    if (!isSales) return "from-slate-800 to-slate-900";
    switch (profileData.currentTier) {
      case "Platinum": return "from-slate-700 via-slate-800 to-slate-900";
      case "Gold": return "from-amber-600 via-amber-700 to-yellow-800";
      case "Silver": return "from-slate-500 via-slate-600 to-slate-700";
      default: return "from-orange-700 via-amber-800 to-amber-900"; // Bronze
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* 1. Hero Profile Card */}
      <div className={`relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br ${getBgGradient()}`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative z-10 px-8 py-10 md:py-14 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
          {/* Avatar with Ring */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center text-5xl md:text-6xl text-white font-bold ring-4 ring-white/10">
              {profileData.userName ? profileData.userName[0].toUpperCase() : "U"}
            </div>
            <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-slate-900 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
            {/* Rank Badge */}
            {profileData.rank && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-slate-900 transform rotate-12 z-20">
                #{profileData.rank} Global
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="text-center md:text-left flex-1 space-y-2">
            <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
                {profileData.userName}
              </h1>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white/90 text-xs font-bold uppercase tracking-widest border border-white/10">
                {profileData.role}
              </span>
            </div>
            <p className="text-white/70 text-lg font-medium tracking-wide flex items-center justify-center md:justify-start gap-2">
              <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {profileData.email}
            </p>
          </div>

          {/* Quick Stats (Hero) */}
          {isSales && (
            <div className="flex gap-8 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-10">
              <div className="text-center">
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Lifetime Incentive Earned</p>
                <p className="text-2xl md:text-3xl font-bold text-white">
                  ₹{profileData.totalIncentiveEarned.toLocaleString('en-IN', { notation: 'compact' })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Approvals</p>
                <p className="text-2xl md:text-3xl font-bold text-white">
                  {profileData.approvedDeals}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Col: Details & Settings */}
        <div className="space-y-8">
          {/* Personal Details Card */}
          <div className="card-modern bg-white dark:bg-slate-800 p-0 overflow-hidden border-0 shadow-lg group hover:shadow-xl transition-all duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .667.333 1 1 1v1m0 0v1m0-1h3m-3 0H7" /></svg>
                Identity
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <DetailRow label="Employee ID" value={profileData.employeeCode} icon="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .667.333 1 1 1v1m0 0v1m0-1h3m-3 0H7" />
              <DetailRow label="Date Joined" value={profileData.joiningDate} icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              <DetailRow label="Global Rank" value={`#${profileData.rank || "N/A"}`} icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              <DetailRow label="Current Incentive Tier" value={profileData.currentTier + " Tier"} icon="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </div>
          </div>

          {/* App Settings */}
          <div className="card-modern bg-surface-1 p-6 space-y-6 border border-border-subtle hover:border-border-strong transition-colors">
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">App Preferences</h3>
            <div className="flex items-center justify-between group cursor-pointer" onClick={toggleTheme}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-amber-100 text-amber-600'}`}>
                  {theme === 'dark' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  )}
                </div>
                <span className="font-medium text-text-primary">Theme Appearance</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary bg-surface-3 px-2 py-1 rounded">
                {theme === 'dark' ? 'Dark' : 'Light'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </div>
                <span className="font-medium text-text-primary">Email Notifications</span>
              </div>
              <div className="relative inline-block w-11 h-6 transition duration-200 ease-in-out">
                <input type="checkbox" id="toggle-notif" className="peer absolute w-full h-full opacity-0 z-10 cursor-pointer" defaultChecked />
                <div className="block w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full peer-checked:bg-primary-500 transition-colors"></div>
                <div className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Performance & Activity */}
        <div className="lg:col-span-2 space-y-8">
          {isSales ? (
            <>
              {/* Tier Badge Integration */}
              <div className="transform hover:-translate-y-1 transition-transform duration-300">
                <TierBadge totalIncentive={profileData.totalIncentiveEarned} rank={profileData.rank} />
              </div>

              {/* Performance Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatBox
                  label="Total Deals"
                  value={profileData.totalDeals}
                  icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  color="blue"
                />
                <StatBox
                  label="Approval Rate"
                  value={`${profileData.approvalRate ? profileData.approvalRate.toFixed(1) : 0}%`}
                  icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  color="emerald"
                />
                <StatBox
                  label="Rejected"
                  value={profileData.rejectedDeals}
                  icon="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  color="red"
                />
                <StatBox
                  label="Best Month"
                  value={profileData.bestMonth?.split('(')[0].trim() || "N/A"}
                  subValue={profileData.bestMonth?.match(/\(.*\)/)?.[0]}
                  icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  color="amber"
                />
              </div>

              {/* Achievements / Highlights Section */}
              <div className="card-modern p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-6">Recent Achievements</h3>
                <div className="space-y-4">
                  <AchievementItem
                    title="Consistency King"
                    desc="Maintained >80% approval rate for 3 months"
                    icon="👑"
                    color="bg-amber-100 text-amber-700"
                  />
                  <AchievementItem
                    title="High Roller"
                    desc="Closed a deal worth ₹50,000+"
                    icon="💎"
                    color="bg-indigo-100 text-indigo-700"
                  />
                </div>
              </div>
            </>
          ) : (
            /* Admin View */
            <div className="grid grid-cols-1 gap-6">
              <div className="card-modern p-8 text-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-slate-800 dark:to-slate-900 border border-primary-200 dark:border-primary-900">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Control Center</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                  You have full access to manage users, approve deals, and configure policy simulations.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Sub Components ---

const DetailRow = ({ label, value, icon }) => (
  <div className="flex items-center gap-4 group">
    <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center text-text-secondary group-hover:bg-primary-50 dark:group-hover:bg-primary-900/10 group-hover:text-primary-600 transition-colors">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
      </svg>
    </div>
    <div>
      <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">{label}</p>
      <p className="text-base font-bold text-text-primary mt-0.5">{value || "Not Set"}</p>
    </div>
  </div>
);

const StatBox = ({ label, value, subValue, icon, color }) => {
  // Map color names to Tailwind classes safe for template literals (approximated)
  const colors = {
    blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
    red: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
    amber: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
  };

  return (
    <div className="card-modern p-4 flex flex-col items-start gap-3 hover:shadow-lg transition-shadow">
      <div className={`p-2 rounded-lg ${colors[color] || colors.blue}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} /></svg>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-text-muted">{label}</p>
        <div className="flex items-baseline gap-1 mt-0.5">
          <p className="text-xl font-bold text-text-primary leading-none">{value}</p>
          {subValue && <span className="text-[10px] text-text-secondary font-medium">{subValue}</span>}
        </div>
      </div>
    </div>
  );
};

const AchievementItem = ({ title, desc, icon, color }) => (
  <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-2 border border-border-subtle hover:bg-surface-3 transition-colors">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${color}`}>
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-bold text-text-primary">{title}</h4>
      <p className="text-xs text-text-muted">{desc}</p>
    </div>
  </div>
);

export default ProfilePage;
