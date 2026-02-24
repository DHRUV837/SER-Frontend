import { useState, useEffect } from "react";
import api, { API_URL } from "../../api";
import AdminLayout from "../../layouts/AdminLayout";
import PageHeader from "../../components/common/PageHeader";

const AdminAlerts = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newRule, setNewRule] = useState({
        name: "",
        metric: "DEAL_AMOUNT",
        operator: "GT",
        threshold: 0,
        action: "NOTIFY_ADMIN"
    });

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            const res = await api.get("/rules");
            setRules(res.data);
        } catch (error) {
            console.error("Failed to fetch rules", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post("/rules", newRule);
            setNewRule({ name: "", metric: "DEAL_AMOUNT", operator: "GT", threshold: 0, action: "NOTIFY_ADMIN" });
            fetchRules();
            alert("Rule created successfully!");
        } catch (error) {
            alert("Failed to create rule");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this rule?")) return;
        try {
            await api.delete(`/rules/${id}`);
            fetchRules();
        } catch (error) {
            alert("Failed to delete rule");
        }
    };

    const getMetricLabel = (m) => ({
        "DEAL_AMOUNT": "Deal Amount",
        "DISCOUNT_RATE": "Discount %",
        "APPROVAL_TIME": "Approval Time (Hrs)"
    }[m] || m);

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <PageHeader
                    heading="Alert Automation Engine"
                    subtitle="Configure intelligent triggers, notifications, and risk thresholds."
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Create Form */}
                    <div className="lg:col-span-1">
                        <div className="card-modern">
                            <h2 className="text-lg font-bold mb-4">New Automation Rule</h2>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold uppercase text-text-muted">Rule Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full mt-1 p-2 bg-surface-1 border border-border-subtle rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="e.g. High Value Deal Alert"
                                        value={newRule.name}
                                        onChange={e => setNewRule({ ...newRule, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold uppercase text-text-muted">Metric</label>
                                        <select
                                            className="w-full mt-1 p-2 bg-surface-1 border border-border-subtle rounded-lg"
                                            value={newRule.metric}
                                            onChange={e => setNewRule({ ...newRule, metric: e.target.value })}
                                        >
                                            <option value="DEAL_AMOUNT">Deal Value</option>
                                            <option value="DISCOUNT_RATE">Discount %</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold uppercase text-text-muted">Condition</label>
                                        <select
                                            className="w-full mt-1 p-2 bg-surface-1 border border-border-subtle rounded-lg"
                                            value={newRule.operator}
                                            onChange={e => setNewRule({ ...newRule, operator: e.target.value })}
                                        >
                                            <option value="GT">Greater Than (&gt;)</option>
                                            <option value="LT">Less Than (&lt;)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold uppercase text-text-muted">Threshold Value</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full mt-1 p-2 bg-surface-1 border border-border-subtle rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="e.g. 100000"
                                        value={newRule.threshold}
                                        onChange={e => setNewRule({ ...newRule, threshold: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold uppercase text-text-muted">Action</label>
                                    <select
                                        className="w-full mt-1 p-2 bg-surface-1 border border-border-subtle rounded-lg"
                                        value={newRule.action}
                                        onChange={e => setNewRule({ ...newRule, action: e.target.value })}
                                    >
                                        <option value="NOTIFY_ADMIN">Notify Admin</option>
                                        <option value="FLAG_RISK">Flag as RISK</option>
                                        <option value="AUTO_APPROVE">Auto Approve</option>
                                    </select>
                                </div>

                                <button type="submit" className="w-full btn-primary bg-gradient-to-r from-accent-500 to-primary-600 hover:from-accent-600 hover:to-primary-700">
                                    Create Rule
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Active Rules List */}
                    <div className="lg:col-span-2">
                        <h2 className="text-lg font-bold mb-4">Active Rules</h2>
                        {loading ? (
                            <div className="text-center py-10 text-text-muted">Loading rules...</div>
                        ) : rules.length === 0 ? (
                            <div className="text-center py-10 text-text-muted border-2 border-dashed border-border-subtle rounded-xl">No active rules configured.</div>
                        ) : (
                            <div className="grid gap-4">
                                {rules.map(rule => (
                                    <div key={rule.id} className="bg-surface-2 p-4 rounded-xl border border-border-subtle flex justify-between items-center hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-full ${rule.action === 'FLAG_RISK' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                                ⚡️
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-text-primary">{rule.name}</h3>
                                                <p className="text-sm text-text-secondary">
                                                    IF <strong>{getMetricLabel(rule.metric)}</strong> is {rule.operator === 'GT' ? 'Greater Than' : 'Less Than'} <strong>{rule.threshold.toLocaleString()}</strong> THEN <span className="font-bold uppercase text-xs bg-gray-200 dark:bg-gray-700 px-1 rounded">{rule.action.replace('_', ' ')}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(rule.id)} className="text-text-muted hover:text-red-500 px-3 py-1">
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminAlerts;
