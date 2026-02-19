import { useSales } from "../../context/SalesContext";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const PerformanceTrend = () => {
  const { deals } = useSales();

  // Group deals by month
  const monthlyData = deals.reduce((acc, deal) => {
    if (deal.status !== "Approved") return acc;

    try {
      let dealDate;
      if (typeof deal.date === 'string') {
        dealDate = new Date(deal.date);
        if (isNaN(dealDate.getTime())) {
          const parts = deal.date.split('/');
          if (parts.length === 3) {
            dealDate = new Date(parts[2], parts[1] - 1, parts[0]);
          }
        }
      } else {
        dealDate = new Date(deal.date);
      }

      if (isNaN(dealDate.getTime())) return acc;

      const monthKey = `${dealDate.getFullYear()}-${String(dealDate.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = dealDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      if (!acc[monthKey]) {
        acc[monthKey] = {
          monthKey: monthKey,
          month: monthLabel,
          deals: 0,
          incentive: 0
        };
      }

      acc[monthKey].deals += 1;
      acc[monthKey].incentive += (deal.incentive || 0);
    } catch (e) {
      return acc;
    }

    return acc;
  }, {});

  // Sort chronologically by month key (YYYY-MM format)
  const chartData = Object.values(monthlyData).sort((a, b) => {
    return a.monthKey.localeCompare(b.monthKey);
  });

  // Calculate insights
  const totalIncentive = chartData.reduce((sum, d) => sum + d.incentive, 0);
  const totalDeals = chartData.reduce((sum, d) => sum + d.deals, 0);
  const avgIncentivePerDeal = totalDeals > 0 ? totalIncentive / totalDeals : 0;

  /* 
   * FIX: If we only have 1 data point (e.g. current month), a Line Chart shows just a dot.
   * To show a trend line, we inject a "dummy" previous month with 0 values.
   * This forces the line to draw from 0 up to the current value.
   */
  if (chartData.length === 1) {
    const singleMonth = chartData[0];
    // Calculate previous month strictly for display
    const [year, month] = singleMonth.monthKey.split('-').map(Number);
    const prevDate = new Date(year, month - 2, 1); // JS months are 0-indexed, so -2 gives prev month

    chartData.unshift({
      monthKey: `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`,
      month: prevDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      deals: 0,
      incentive: 0
    });
  }

  const highestMonth = chartData.reduce((max, current) =>
    current.incentive > (max?.incentive || 0) ? current : max, null
  );

  // Always use Line Chart (we now ensure at least 2 points exist)
  const useBarChart = false;

  // Custom Tooltip for dark mode support
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-2 p-3 border border-border-subtle rounded-lg shadow-lg">
          <p className="font-semibold text-text-primary mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <span className="text-sm text-text-secondary">
                {entry.name}: {entry.name.includes('Incentive')
                  ? `₹${entry.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="card-modern p-12 text-center relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 opacity-30 rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-text-muted mb-2">No Trend Data Yet</h3>
          <p className="text-xs text-text-muted mb-4">Start creating and approving deals to see performance trends</p>
          <div className="inline-block text-xs text-primary-600 hover:text-primary-700 font-medium">
            Create your first deal →
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-modern p-8 relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 opacity-20 rounded-full -mr-16 -mt-16"></div>

      <div className="mb-8 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="section-title">Performance Trend</h2>
            <div className="h-1 bg-gradient-to-r from-primary-500 to-accent-500 w-24 mt-2 rounded-full"></div>
          </div>
        </div>
        <p className="text-sm text-text-secondary mt-4">Approved deals only • Incentive is the primary metric</p>
        {useBarChart && (
          <div className="mt-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-lg">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              <span className="font-semibold">Note:</span> More data will improve trend accuracy. Currently showing {chartData.length} month{chartData.length !== 1 ? 's' : ''} of data.
            </p>
          </div>
        )}
      </div>

      <div className="relative z-10">
        <ResponsiveContainer width="100%" height={380}>
          {useBarChart ? (
            // Bar Chart for low data (≤2 points)
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                style={{ fontSize: '12px', fontWeight: 500 }}
              />
              <YAxis
                yAxisId="left"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{ value: 'Deals', angle: -90, position: 'insideLeft', fill: '#6b7280', style: { fontSize: '11px' } }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#14b8a6"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                label={{ value: 'Incentive (₹)', angle: 90, position: 'insideRight', fill: '#14b8a6', style: { fontSize: '11px' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                yAxisId="left"
                dataKey="deals"
                fill="#93c5fd"
                name="Deals"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="incentive"
                fill="#14b8a6"
                name="Incentive"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            // Line Chart for trends (3+ points) with dual Y-axes
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                style={{ fontSize: '12px', fontWeight: 500 }}
              />
              <YAxis
                yAxisId="left"
                stroke="#93c5fd"
                style={{ fontSize: '12px' }}
                label={{ value: 'Deals', angle: -90, position: 'insideLeft', fill: '#93c5fd', style: { fontSize: '11px' } }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#14b8a6"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                label={{ value: 'Incentive (₹)', angle: 90, position: 'insideRight', fill: '#14b8a6', style: { fontSize: '11px', fontWeight: 600 } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              {/* Incentive = Hero (solid, bold, primary) */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="incentive"
                stroke="#14b8a6"
                strokeWidth={4}
                dot={{ fill: '#14b8a6', r: 6, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, fill: '#14b8a6' }}
                name="Incentive (₹)"
              />
              {/* Deals = Secondary (dashed, lighter) */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="deals"
                stroke="#93c5fd"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#93c5fd', r: 4, strokeWidth: 1, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#93c5fd' }}
                name="Deals"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Insights Section */}
      <div className="mt-8 pt-6 border-t border-border-subtle relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
            <p className="text-xs text-emerald-700 uppercase tracking-widest font-semibold mb-1">Avg Incentive/Deal</p>
            <p className="text-xl font-bold text-emerald-700">
              ₹{avgIncentivePerDeal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </div>
          {highestMonth && (
            <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg border border-primary-100">
              <p className="text-xs text-primary-700 uppercase tracking-widest font-semibold mb-1">Best Month</p>
              <p className="text-lg font-bold text-primary-700 mb-1">{highestMonth.month}</p>
              <p className="text-sm text-primary-600">
                ₹{highestMonth.incentive.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </p>
            </div>
          )}
          <div className="text-center p-4 bg-gradient-to-br from-accent-50 to-teal-50 rounded-lg border border-accent-100">
            <p className="text-xs text-accent-700 uppercase tracking-widest font-semibold mb-1">Total Period</p>
            <p className="text-xl font-bold text-accent-700">
              ₹{totalIncentive.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-accent-600 mt-1">{totalDeals} deals</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTrend;

