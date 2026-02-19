import { useSales } from "../../context/SalesContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const DealStatusChart = () => {
  const { deals } = useSales();

  // Calculate status distribution
  const statusData = [
    { name: "Draft", value: deals.filter(d => d.status === "Draft").length, color: "#9ca3af" },
    { name: "Submitted", value: deals.filter(d => d.status === "Submitted").length, color: "#f59e0b" },
    { name: "Approved", value: deals.filter(d => d.status === "Approved").length, color: "#10b981" },
    { name: "Rejected", value: deals.filter(d => d.status === "Rejected").length, color: "#ef4444" },
  ].filter(item => item.value > 0); // Only show statuses with deals

  const totalDeals = deals.length;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = totalDeals > 0 ? ((data.value / totalDeals) * 100).toFixed(1) : 0;
      return (
        <div className="bg-surface-2 p-3 border border-border-subtle rounded-lg shadow-lg">
          <p className="font-semibold text-text-primary">{data.name}</p>
          <p className="text-sm text-text-secondary">
            {data.value} deal{data.value !== 1 ? 's' : ''} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label if slice is too small

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (totalDeals === 0) {
    return (
      <div className="card-modern p-12 text-center relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 opacity-30 rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-text-muted mb-2">No Deal Status Data</h3>
          <p className="text-xs text-text-muted">Create deals to see status distribution</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-modern p-8 relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 opacity-20 rounded-full -mr-16 -mt-16"></div>

      <div className="mb-6 relative z-10">
        <h3 className="text-lg font-semibold text-text-primary mb-1">Deal Status Overview</h3>
        <div className="h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 w-16"></div>
        <p className="text-sm text-text-secondary mt-2">Distribution of deals across workflow stages</p>
      </div>

      <div className="relative z-10">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value, entry) => (
                <span style={{ color: entry.color, fontWeight: 500 }}>
                  {value} ({statusData.find(d => d.name === value)?.value || 0})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-border-subtle relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusData.map((status) => {
            const percentage = totalDeals > 0 ? ((status.value / totalDeals) * 100).toFixed(1) : 0;
            return (
              <div key={status.name} className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  ></div>
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest">
                    {status.name}
                  </p>
                </div>
                <p className="text-lg font-bold text-text-primary">{status.value}</p>
                <p className="text-xs text-text-muted">{percentage}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DealStatusChart;

