import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useSales } from "../../context/SalesContext";

const EarningsBreakdown = () => {
    const { deals } = useSales();

    // Aggregate data by Deal Size
    const data = deals
        .filter(d => d.status === "Approved")
        .reduce((acc, deal) => {
            let bucket = "Small (< ₹10k)";
            if (deal.amount >= 50000) bucket = "Large (> ₹50k)";
            else if (deal.amount >= 10000) bucket = "Medium (₹10k - ₹50k)";

            const existing = acc.find(item => item.name === bucket);
            if (existing) {
                existing.value += deal.incentive;
            } else {
                acc.push({ name: bucket, value: deal.incentive });
            }
            return acc;
        }, []);

    // Sort logically: Small -> Medium -> Large
    const order = { "Small (< ₹10k)": 1, "Medium (₹10k - ₹50k)": 2, "Large (> ₹50k)": 3 };
    data.sort((a, b) => order[a.name] - order[b.name]);

    const COLORS = ["#10b981", "#3b82f6", "#8b5cf6"]; // Emerald, Blue, Violet

    const totalEarnings = data.reduce((sum, item) => sum + item.value, 0);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-800 p-3 shadow-lg rounded-lg border border-gray-100 dark:border-slate-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{payload[0].name}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                        ₹{payload[0].value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">
                        {((payload[0].value / totalEarnings) * 100).toFixed(1)}% of total
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="card-modern p-6 h-full flex flex-col justify-center">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Earnings Breakdown</h3>
                <p className="text-xs text-text-secondary">Incentive distribution by deal size</p>
            </div>

            <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={6}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                    <p className="text-xs text-text-muted uppercase tracking-widest">Total</p>
                    <p className="text-lg font-bold text-text-primary">
                        ₹{totalEarnings.toLocaleString('en-IN', { notation: "compact", maximumFractionDigits: 1 })}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EarningsBreakdown;
