import SalesLayout from "../../layouts/SalesLayout";
import { useEffect, useState } from "react";
import api, { API_URL } from "../../api";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/common/PageHeader";
import { Target, Plus, Edit2, Trash2, TrendingUp } from "lucide-react";

const AdminTargets = () => {
    const { auth } = useAuth();
    const [targets, setTargets] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        userId: "",
        currentMonthTarget: "",
        performanceRating: "",
        achievements: ""
    });

    useEffect(() => {
        fetchTargets();
        fetchUsers();
    }, []);

    const fetchTargets = async () => {
        try {
            const res = await api.get("/api/targets");
            setTargets(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch targets", err);
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get("/api/users");
            setUsers(res.data.filter(u => u.role === "SALES"));
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/targets", {
                ...formData,
                createdBy: auth.user.id // Track who created this target for onboarding
            });

            // Onboarding Progress: Mark 'First Target' as complete
            try {
                if (auth.user && auth.user.id) {
                    await api.post("/api/onboarding/progress/update", {
                        userId: auth.user.id,
                        task: "firstTarget"
                    });
                }
            } catch (err) {
                console.error("Failed to update onboarding progress", err);
            }

            setShowCreateModal(false);
            setFormData({ userId: "", currentMonthTarget: "", performanceRating: "", achievements: "" });
            fetchTargets();
        } catch (err) {
            console.error("Failed to create target", err);
            alert("Failed to create target");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this target?")) return;
        try {
            await axios.delete(`${API_URL}/api/targets/${id}`);
            fetchTargets();
        } catch (err) {
            console.error("Failed to delete target", err);
        }
    };

    if (loading) return <SalesLayout>Loading targets...</SalesLayout>;

    return (
        <SalesLayout>
            <PageHeader
                heading="Performance Targets"
                subtitle="Set and manage sales performance goals for your team."
                actions={
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Create Target
                    </button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {targets.map((target) => (
                    <div key={target.id} className="card-modern p-6 space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                                    <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-primary">{target.user?.name || "Unknown User"}</h3>
                                    <p className="text-xs text-text-muted">{target.user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(target.id)}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                                <span className="text-sm text-text-muted">Monthly Target</span>
                                <span className="font-bold text-indigo-600">₹{target.currentMonthTarget?.toLocaleString() || "0"}</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                                <span className="text-sm text-text-muted">Performance Rating</span>
                                <div className="flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                                    <span className="font-bold text-emerald-600">{target.performanceRating || "N/A"}/5.0</span>
                                </div>
                            </div>

                            {target.achievements && (
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">{target.achievements}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {targets.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <Target className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-bold text-text-primary mb-2">No Targets Set</h3>
                        <p className="text-text-muted mb-4">Create your first performance target to get started.</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Create First Target
                        </button>
                    </div>
                )}
            </div>

            {/* Create Target Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-surface-1 rounded-2xl shadow-2xl border border-border-subtle p-6">
                        <h3 className="text-xl font-bold text-text-primary mb-4">Create Performance Target</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-text-muted mb-2">Sales Executive</label>
                                <select
                                    value={formData.userId}
                                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-surface-2 border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Select a user</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-text-muted mb-2">Monthly Target (₹)</label>
                                <input
                                    type="number"
                                    value={formData.currentMonthTarget}
                                    onChange={(e) => setFormData({ ...formData, currentMonthTarget: e.target.value })}
                                    required
                                    placeholder="500000"
                                    className="w-full px-4 py-3 bg-surface-2 border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-text-muted mb-2">Performance Rating (1-5)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="1"
                                    max="5"
                                    value={formData.performanceRating}
                                    onChange={(e) => setFormData({ ...formData, performanceRating: e.target.value })}
                                    placeholder="4.5"
                                    className="w-full px-4 py-3 bg-surface-2 border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-text-muted mb-2">Achievements (Optional)</label>
                                <textarea
                                    value={formData.achievements}
                                    onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                                    placeholder="Top performer, Exceeded Q1 targets..."
                                    rows="3"
                                    className="w-full px-4 py-3 bg-surface-2 border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-3 bg-surface-2 hover:bg-surface-3 text-text-secondary font-medium rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
                                >
                                    Create Target
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SalesLayout>
    );
};

export default AdminTargets;
