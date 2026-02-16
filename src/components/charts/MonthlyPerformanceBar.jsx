import { useSales } from "../../context/SalesContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const MonthlyPerformanceBar = () => {
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
            dealDate = new Date(parts[2], parts[0] - 1, parts[1]);
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

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-2 p-4 border border-border-subtle rounded-lg shadow-lg">
          <p className="font-semibold text-text-primary mb-2">{payload[0].payload.month}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm text-text-secondary">
                {entry.name}: {entry.name === 'Incentive'
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
          <h3 className="text-sm font-semibold text-text-muted mb-2">No Monthly Data</h3>
          <p className="text-xs text-text-muted">Create and approve deals to see monthly performance</p>
        </div>
      </div>
    );
  }

  // Calculate max value for Y-axis scaling
  const maxIncentive = Math.max(...chartData.map(d => d.incentive));
  const maxDeals = Math.max(...chartData.map(d => d.deals));
  const yAxisMax = Math.max(maxIncentive, maxDeals * (maxIncentive / maxDeals || 1));

  return (
    <div className="card-modern p-8 relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 opacity-20 rounded-full -mr-16 -mt-16"></div>

      <div className="mb-6 relative z-10">
        <h3 className="text-lg font-semibold text-text-primary mb-1">Monthly Performance</h3>
        <div className="h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 w-16"></div>
        <p className="text-sm text-text-secondary mt-2">Deals and incentive by month (approved deals only)</p>
      </div>

      <div className="relative z-10">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: 500 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              yAxisId="left"
              stroke="#3b82f6"
              style={{ fontSize: '12px' }}
              label={{ value: 'Deals', angle: -90, position: 'insideLeft', fill: '#3b82f6', style: { fontSize: '11px' } }}
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
              iconType="square"
            />
            <Bar
              yAxisId="left"
              dataKey="deals"
              fill="#3b82f6"
              name="Deals"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="incentive"
              fill="#14b8a6"
              name="Incentive (₹)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-border-subtle relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-primary-50 rounded-lg border border-blue-200">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest mb-2">Total Months</p>
            <p className="text-2xl font-bold text-blue-700">{chartData.length}</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-2">Total Deals</p>
            <p className="text-2xl font-bold text-emerald-700">
              {chartData.reduce((sum, d) => sum + d.deals, 0)}
            </p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-accent-50 to-teal-50 rounded-lg border border-accent-200">
            <p className="text-xs font-semibold text-accent-700 uppercase tracking-widest mb-2">Total Incentive</p>
            <p className="text-2xl font-bold text-accent-700">
              ₹{chartData.reduce((sum, d) => sum + d.incentive, 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyPerformanceBar;

