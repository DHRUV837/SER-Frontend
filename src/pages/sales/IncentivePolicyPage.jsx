import SalesLayout from "../../layouts/SalesLayout";
import { useState, useEffect } from "react";
import api, { API_URL } from "../../api";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/common/PageHeader";

const IncentivePolicyPage = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();
  const isAdmin = auth?.user?.role === "ADMIN";

  // Form State for Admin
  const [newPolicy, setNewPolicy] = useState({ title: "", description: "", commissionRate: "", example: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await api.get("/api/policy?type=INCENTIVE");
      setPolicies(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch policies");
      setLoading(false);
    }
  };

  const handleAddPolicy = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/policy", {
        ...newPolicy,
        displayOrder: policies.length + 1,
        type: "INCENTIVE"
      });

      // Onboarding Progress: Mark 'First Rule' as complete
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          await api.post("/api/onboarding/progress/update", {
            userId: userId,
            task: "firstRule"
          });
        }
      } catch (err) {
        console.error("Failed to update onboarding progress", err);
      }

      setNewPolicy({ title: "", description: "", commissionRate: "", example: "" });
      setIsEditing(false);
      fetchPolicies();
    } catch (err) {
      alert("Failed to save policy");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this policy rule?")) return;
    try {
      await axios.delete(`${API_URL}/api/policy/${id}`);
      fetchPolicies();
    } catch (err) {
      alert("Failed to delete policy");
    }
  };

  return (
    <SalesLayout>
      <div className="space-y-8">
        <PageHeader
          heading="Incentive Policy Overview"
          subtitle="Understand the commission rules and rates that determine your earnings."
          actions={
            isAdmin && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-gradient-to-r from-primary-500 to-indigo-500 text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold hover:scale-105"
              >
                {isEditing ? "✕ Cancel" : "+ Add Rule"}
              </button>
            )
          }
        />

        {/* ADMIN EDIT FORM */}
        {isAdmin && isEditing && (
          <div className="card-modern p-8 border-2 border-primary-200 dark:border-primary-800 shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-text-primary flex items-center gap-2">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              Add New Policy Rule
            </h3>
            <form onSubmit={handleAddPolicy} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2">Title *</label>
                <input
                  className="input-modern"
                  required
                  value={newPolicy.title}
                  onChange={e => setNewPolicy({ ...newPolicy, title: e.target.value })}
                  placeholder="e.g. Standard Commission"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2">Description *</label>
                <textarea
                  className="input-modern"
                  required
                  rows={3}
                  value={newPolicy.description}
                  onChange={e => setNewPolicy({ ...newPolicy, description: e.target.value })}
                  placeholder="Detailed description of this policy rule"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2">Commission Rate (%) *</label>
                  <input
                    className="input-modern"
                    type="number"
                    step="0.1"
                    required
                    value={newPolicy.commissionRate}
                    onChange={e => setNewPolicy({ ...newPolicy, commissionRate: e.target.value })}
                    placeholder="e.g. 5.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2">Example (Optional)</label>
                  <input
                    className="input-modern"
                    value={newPolicy.example}
                    onChange={e => setNewPolicy({ ...newPolicy, example: e.target.value })}
                    placeholder="e.g. ₹100,000 deal = ₹5,000 incentive"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 text-text-secondary hover:text-text-primary font-medium rounded-xl hover:bg-surface-2 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-6 py-2.5 shadow-lg"
                >
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        )}

        {/* POLICY GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="card-modern p-6 animate-pulse">
                <div className="h-6 bg-surface-2 rounded mb-3"></div>
                <div className="h-4 bg-surface-2 rounded mb-4"></div>
                <div className="h-12 bg-surface-2 rounded"></div>
              </div>
            ))}
          </div>
        ) : policies.length === 0 ? (
          <div className="card-modern p-20 text-center border-2 border-dashed border-border-subtle bg-surface-2/30">
            <div className="text-5xl mb-4 opacity-50">📋</div>
            <h3 className="text-xl font-bold text-text-primary mb-2">No Active Policies</h3>
            <p className="text-text-muted">No incentive policies are currently configured.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((rule) => (
              <div key={rule.id} className="card-modern p-6 relative overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-indigo-100 dark:from-primary-900/20 dark:to-indigo-900/20 opacity-40 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 group-hover:rotate-12"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <h3 className="text-lg font-bold text-text-primary">{rule.title}</h3>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(rule.id)}
                        className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <p className="text-sm text-text-secondary mb-6 leading-relaxed">{rule.description}</p>

                  {(rule.commissionRate || rule.rate) && (
                    <div className="mb-4">
                      <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl shadow-sm">
                        <span className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                          {rule.commissionRate || rule.rate}%
                        </span>
                      </div>
                    </div>
                  )}

                  {rule.example && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                      <p className="text-xs font-bold text-blue-900 dark:text-blue-100 mb-1">Example</p>
                      <p className="text-xs text-blue-800 dark:text-blue-200 italic">{rule.example}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SalesLayout>
  );
};

export default IncentivePolicyPage;
