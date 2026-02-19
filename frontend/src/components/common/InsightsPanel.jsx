import { useSales } from "../../context/SalesContext";

const InsightsPanel = () => {
  const { deals } = useSales();

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Helper function to parse dates
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

  // Today's deals
  const todayDeals = deals.filter(deal => {
    if (deal.status !== "Approved") return false;
    const dealDate = parseDate(deal.date);
    if (!dealDate || isNaN(dealDate.getTime())) return false;
    return dealDate >= today;
  });

  // This week's deals
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const thisWeekDeals = deals.filter(deal => {
    if (deal.status !== "Approved") return false;
    const dealDate = parseDate(deal.date);
    if (!dealDate || isNaN(dealDate.getTime())) return false;
    return dealDate >= weekStart;
  });

  // Best deal this month
  const thisMonthDeals = deals.filter(deal => {
    if (deal.status !== "Approved") return false;
    const dealDate = parseDate(deal.date);
    if (!dealDate || isNaN(dealDate.getTime())) return false;
    return dealDate.getMonth() === now.getMonth() &&
      dealDate.getFullYear() === now.getFullYear();
  });

  const bestDeal = thisMonthDeals.reduce((best, current) => {
    return (current.incentive || 0) > (best?.incentive || 0) ? current : best;
  }, null);

  // Average incentive
  const avgIncentive = thisMonthDeals.length > 0
    ? thisMonthDeals.reduce((sum, d) => sum + (d.incentive || 0), 0) / thisMonthDeals.length
    : 0;

  // --- SMART ANALYTICS ---

  // 1. Approval Rate
  const totalSubmitted = deals.length;
  const totalApproved = deals.filter(d => d.status === "Approved").length;
  const approvalRate = totalSubmitted > 0 ? (totalApproved / totalSubmitted) * 100 : 0;

  // 2. High Value Deal Analysis (Deals > 50k)
  const highValueDeals = deals.filter(d => d.amount > 50000);
  const highValueApproved = highValueDeals.filter(d => d.status === "Approved").length;
  const highValueApprovalRate = highValueDeals.length > 0
    ? (highValueApproved / highValueDeals.length) * 100
    : 0;

  // 3. Generate Smart Tips
  const getSmartTip = () => {
    if (totalSubmitted === 0) return "Start submitting deals to get AI-powered insights!";

    const tips = [];

    if (approvalRate < 70) {
      tips.push("Your approval rate is low. Check rejection reasons for patterns.");
    } else if (approvalRate > 90) {
      tips.push("Great approval rate! You're mastering the policy guidelines.");
    }

    if (highValueApprovalRate > approvalRate + 10) {
      tips.push("You're great at closing big deals! Focus on deals > ₹50k.");
    } else if (highValueApprovalRate < approvalRate - 10 && highValueDeals.length > 0) {
      tips.push("High-value deals are getting rejected often. Double-check documentation.");
    }

    const nearMonthEnd = now.getDate() > 20;
    if (nearMonthEnd) {
      tips.push("Month end approaching! Prioritize quick-close opportunities.");
    }

    return tips.length > 0 ? tips[0] : "Consistency is key. Keep logging your daily activity.";
  };

  const smartTip = getSmartTip();

  const insights = [
    {
      label: "Approval Rate",
      value: `${approvalRate.toFixed(0)}%`,
      subtext: totalSubmitted > 0 ? `${totalApproved}/${totalSubmitted} deals approved` : "No deals yet",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: approvalRate >= 80 ? "from-emerald-500 to-green-600" : (approvalRate >= 50 ? "from-yellow-500 to-amber-600" : "from-red-500 to-rose-600")
    },
    {
      label: 'Deal Velocity' patterns,
      value: `${thisWeekDeals.length}`,
      subtext: "Deals closed this week",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      color: "from-blue-500 to-indigo-600"
    },
    {
      label: "Best Win",
      value: bestDeal ? `₹${bestDeal.incentive.toLocaleString('en-IN')}` : \"-\",
      subtext: bestDeal ? "Highest incentive this month" : "No incentive yet",
      icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
      color: "from-purple-500 to-violet-600"
    }
  ];

  return (
    <div className="card-modern p-6 h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="text-lg font-semibold text-text-primary">Smart Performance Coach</h3>
        </div>
        <div className="h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 w-full mt-2 opacity-50"></div>
      </div>

      {/* AI Coach Tip */}
      <div className="mb-6 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-slate-800 dark:to-slate-800/50 p-4 rounded-xl border border-primary-100 dark:border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
        </div>
        <div className="flex items-start space-x-3 relative z-10">
          <div className="bg-primary-500 text-white p-2 rounded-lg shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">Coach Insight</p>
            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
              "{smartTip}"
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-2 transition-colors border-b border-border-subtle last:border-0"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm text-white"
                style={{
                  background: `linear-gradient(135deg, ${insight.color.includes('emerald') ? '#10b981' : insight.color.includes('yellow') ? '#f59e0b' : insight.color.includes('red') ? '#ef4444' : insight.color.includes('blue') ? '#3b82f6' : '#8b5cf6'}, ${insight.color.includes(`emerald') ? '#059669' : insight.color.includes('yellow') ? '#d97706' : insight.color.includes('red') ? '#b91c1c' : insight.color.includes('blue') ? '#2563eb' : '#7c3aed'})`
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={insight.icon} />
                </svg>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">{insight.label}</p>
                <p className="text-xs text-text-secondary mt-0.5">{insight.subtext}</p>
              </div>
            </div>
            <span className="text-lg font-bold text-text-primary">{insight.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;

