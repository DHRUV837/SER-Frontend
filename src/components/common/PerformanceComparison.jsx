import { useSales } from "../../context/SalesContext";

const PerformanceComparison = () => {
  const { deals } = useSales();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const parseDate = (dateStr) => {
    try {
      if (typeof dateStr === 'string') {
        let date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            date = new Date(parts[2], parts[0] - 1, parts[1]);
          }
        }
        return date;
      }
      return new Date(dateStr);
    } catch {
      return null;
    }
  };

  // Current month stats
  const currentMonthDeals = deals.filter(deal => {
    if (deal.status !== "Approved") return false;
    const dealDate = parseDate(deal.date);
    if (!dealDate || isNaN(dealDate.getTime())) return false;
    return dealDate.getMonth() === currentMonth &&
      dealDate.getFullYear() === currentYear;
  });

  const currentMonthIncentive = currentMonthDeals.reduce((sum, d) => sum + (d.incentive || 0), 0);
  const currentMonthCount = currentMonthDeals.length;

  // Last month stats
  const lastMonthDeals = deals.filter(deal => {
    if (deal.status !== "Approved") return false;
    const dealDate = parseDate(deal.date);
    if (!dealDate || isNaN(dealDate.getTime())) return false;
    return dealDate.getMonth() === lastMonth &&
      dealDate.getFullYear() === lastMonthYear;
  });

  const lastMonthIncentive = lastMonthDeals.reduce((sum, d) => sum + (d.incentive || 0), 0);
  const lastMonthCount = lastMonthDeals.length;

  // Calculate growth
  const incentiveGrowth = lastMonthIncentive > 0
    ? ((currentMonthIncentive - lastMonthIncentive) / lastMonthIncentive * 100)
    : (currentMonthIncentive > 0 ? 100 : 0);

  const dealsGrowth = lastMonthCount > 0
    ? ((currentMonthCount - lastMonthCount) / lastMonthCount * 100)
    : (currentMonthCount > 0 ? 100 : 0);

  const avgIncentiveCurrent = currentMonthCount > 0 ? currentMonthIncentive / currentMonthCount : 0;
  const avgIncentiveLast = lastMonthCount > 0 ? lastMonthIncentive / lastMonthCount : 0;
  const avgGrowth = avgIncentiveLast > 0
    ? ((avgIncentiveCurrent - avgIncentiveLast) / avgIncentiveLast * 100)
    : (avgIncentiveCurrent > 0 ? 100 : 0);

  const getGrowthColor = (growth) => {
    if (growth > 0) return "text-emerald-600";
    if (growth < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    }
    if (growth < 0) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      );
    }
    return null;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <div className="card-modern p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text-primary mb-1">Performance Comparison</h3>
        <div className="h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 w-16"></div>
        <p className="text-xs text-text-muted mt-2">Month-over-month growth analysis</p>
      </div>

      <div className="space-y-6">
        {/* Incentive Comparison */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-text-secondary">Total Incentive</p>
            <div className={`flex items-center space-x-1 ${getGrowthColor(incentiveGrowth)}`}>
              {getGrowthIcon(incentiveGrowth)}
              <span className="text-sm font-semibold">
                {incentiveGrowth > 0 ? '+' : ''}{incentiveGrowth.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-surface-2 rounded-lg border border-border-strong">
              <p className="text-xs text-text-muted mb-1">This Month</p>
              <p className="text-lg font-bold text-text-primary">
                ₹{currentMonthIncentive.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-text-muted mt-1">{monthNames[currentMonth]}</p>
            </div>
            <div className="p-3 bg-surface-2 rounded-lg border border-border-strong">
              <p className="text-xs text-text-muted mb-1">Last Month</p>
              <p className="text-lg font-bold text-text-primary">
                ₹{lastMonthIncentive.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-text-muted mt-1">{monthNames[lastMonth]}</p>
            </div>
          </div>
        </div>

        {/* Deals Comparison */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-text-secondary">Deals Count</p>
            <div className={`flex items-center space-x-1 ${getGrowthColor(dealsGrowth)}`}>
              {getGrowthIcon(dealsGrowth)}
              <span className="text-sm font-semibold">
                {dealsGrowth > 0 ? '+' : ''}{dealsGrowth.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-surface-2 rounded-lg border border-border-strong">
              <p className="text-xs text-text-muted mb-1">This Month</p>
              <p className="text-lg font-bold text-text-primary">{currentMonthCount}</p>
              <p className="text-xs text-text-muted mt-1">{monthNames[currentMonth]}</p>
            </div>
            <div className="p-3 bg-surface-2 rounded-lg border border-border-strong">
              <p className="text-xs text-text-muted mb-1">Last Month</p>
              <p className="text-lg font-bold text-text-primary">{lastMonthCount}</p>
              <p className="text-xs text-text-muted mt-1">{monthNames[lastMonth]}</p>
            </div>
          </div>
        </div>

        {/* Average Incentive per Deal */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-text-secondary">Avg Incentive/Deal</p>
            <div className={`flex items-center space-x-1 ${getGrowthColor(avgGrowth)}`}>
              {getGrowthIcon(avgGrowth)}
              <span className="text-sm font-semibold">
                {avgGrowth > 0 ? '+' : ''}{avgGrowth.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
              <p className="text-xs text-emerald-700 mb-1">This Month</p>
              <p className="text-lg font-bold text-emerald-700">
                ₹{avgIncentiveCurrent.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-surface-2 rounded-lg border border-border-strong">
              <p className="text-xs text-text-muted mb-1">Last Month</p>
              <p className="text-lg font-bold text-text-primary">
                ₹{avgIncentiveLast.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceComparison;

