import SalesLayout from "../../layouts/SalesLayout";
import { useState, useEffect } from "react";
import api from "../../api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import PageHeader from "../../components/common/PageHeader";

const PolicySimulation = () => {
    // Simulation Parameters
    const [threshold, setThreshold] = useState(50000);
    const [lowRate, setLowRate] = useState(5.0);
    const [highRate, setHighRate] = useState(10.0);

    // Simulation Result
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Debounce simulation fetch
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSimulation();
        }, 500); // 500ms debounce
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threshold, lowRate, highRate]);

    const fetchSimulation = async () => {
        setLoading(true);
        try {
            const res = await api.post("/api/simulation/preview", {
                threshold,
                lowRate,
                highRate
            });
            setResult(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        alert("This would typically update the global policy configuration. (Mock Action)");
    };

    return (
        <SalesLayout>
            <PageHeader
                heading="Policy Impact Simulation"
                subtitle="Model and forecast the financial implications of incentive policy adjustments prior to deployment."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="lg:col-span-1 card-modern p-6 flex flex-col gap-6">
                    <h3 className="font-bold text-text-primary border-b border-border-subtle pb-2">Policy Parameters</h3>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Deal Amount Threshold</label>
                        <input
                            type="range" min="10000" max="200000" step="5000"
                            value={threshold}
                            onChange={e => setThreshold(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-text-muted mt-1">
                            <span>₹10k</span>
                            <span className="font-bold text-blue-600">₹{threshold.toLocaleString()}</span>
                            <span>₹200k</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Low Rate (Below Threshold)</label>
                        <input
                            type="range" min="1.0" max="20.0" step="0.5"
                            value={lowRate}
                            onChange={e => setLowRate(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                        <div className="flex justify-between text-xs text-text-muted mt-1">
                            <span>1%</span>
                            <span className="font-bold text-green-600">{lowRate}%</span>
                            <span>20%</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">High Rate (Above Threshold)</label>
                        <input
                            type="range" min="1.0" max="30.0" step="0.5"
                            value={highRate}
                            onChange={e => setHighRate(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                        <div className="flex justify-between text-xs text-text-muted mt-1">
                            <span>1%</span>
                            <span className="font-bold text-purple-600">{highRate}%</span>
                            <span>30%</span>
                        </div>
                    </div>

                    <button
                        onClick={handleApply}
                        className="w-full mt-4 bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-lg"
                    >
                        Apply New Policy
                    </button>
                </div>

                {/* Preview */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Impact Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-6 rounded-xl shadow border border-border-subtle ${result?.difference >= 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                            <p className="text-sm font-medium text-text-muted mb-1">Projected Total Payout</p>
                            <h2 className={`text-3xl font-bold ${result?.difference >= 0 ? 'text-red-700' : 'text-green-700'}`}>
                                {loading ? '...' : `₹${result?.projectedPayout?.toLocaleString() || 0}`}
                            </h2>
                            <p className='text-xs mt-2 flex items-center'>
                                <span className={`font-bold mr-1 ${result?.difference >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {result?.difference > 0 ? '+' : ''}{result?.difference?.toLocaleString()}
                                </span>
                                vs current (₹{result?.currentPayout?.toLocaleString()})
                            </p>
                        </div>

                        <div className="card-modern p-6">
                            <p className="text-sm font-medium text-text-muted mb-1">Impacted Deals</p>
                            <h2 className="text-3xl font-bold text-blue-600">
                                {loading ? "..." : result?.impactedDealsCount || 0}
                            </h2>
                            <p className="text-xs text-text-muted mt-2">Deals that would have different incentive</p>
                        </div>
                    </div>

                    {/* Visualizer (Mock Chart for now or simple comparison bar) */}
                    <div className="card-modern p-6">
                        <h3 className="font-bold text-text-primary mb-4">Payout Projection</h3>
                        <div className="relative h-12 bg-surface-3 rounded-full overflow-hidden flex items-center">
                            <div
                                className="h-full bg-gray-400 dark:bg-gray-600 transition-all duration-500 flex items-center justify-center text-xs text-white font-bold"
                                style={{ width: '50%' }}
                            >
                                Current
                            </div>
                            <div
                                className={`h-full transition-all duration-500 flex items-center justify-center text-xs text-white font-bold opacity-80 ${result?.difference >= 0 ? 'bg-red-500' : 'bg-green-500'}`}
                                style={{ width: result ? `${(result.projectedPayout / (result.currentPayout + result.projectedPayout)) * 100}%` : '50%' }}
                            >
                                Projected
                            </div>
                        </div>
                        <div className="flex justify-between text-xs text-text-muted mt-2 px-2">
                            <span>Current: ₹{result?.currentPayout?.toLocaleString()}</span>
                            <span>Projected: ₹{result?.projectedPayout?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </SalesLayout>
    );
};

export default PolicySimulation;
