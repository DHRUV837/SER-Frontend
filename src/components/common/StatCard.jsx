const StatCard = ({ title, value, gradient = "primary", subtitle, trend, trendValue }) => {
  const gradientConfig = {
    primary: { from: "#3b82f6", to: "#2563eb", icon: "#3b82f6" },
    emerald: { from: "#10b981", to: "#059669", icon: "#10b981" },
    accent: { from: "#14b8a6", to: "#0d9488", icon: "#14b8a6" },
  };

  const config = gradientConfig[gradient] || gradientConfig.primary;

  const getTrendColor = () => {
    if (!trend) return "text-gray-500";
    return trend === "up" ? "text-emerald-600" : "text-red-600";
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend === "up" ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    );
  };

  return (
    <div className="glass-card p-6 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden bg-white/50 dark:bg-slate-800/50">
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity rounded-full"
        style={{
          background: `linear-gradient(135deg, ${config.from}, ${config.to})`
        }}
      ></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-1">{title}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
            )}
          </div>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
            style={{
              background: `linear-gradient(135deg, ${config.from}, ${config.to})`
            }}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>

        <div className="flex items-baseline space-x-2 mb-3">
          <p className="text-3xl font-bold text-text-primary tracking-tight">
            {value}
          </p>
        </div>

        {/* Trend Indicator */}
        {trend && trendValue && (
          <div className={`flex items-center space-x-1 text-xs font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{trendValue}</span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        )}

        {/* Progress Line */}
        <div
          className="h-1 mt-4 rounded-full opacity-30 group-hover:opacity-60 transition-opacity"
          style={{
            background: `linear-gradient(to right, ${config.from}, ${config.to})`
          }}
        ></div>
      </div>
    </div>
  );
};

export default StatCard;
