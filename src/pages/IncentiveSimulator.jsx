import { useState, useEffect } from "react";
import api from "../api";
import SalesLayout from "../layouts/SalesLayout";
import { useNotifications } from "../context/NotificationContext";
import PageHeader from "../components/common/PageHeader";

const IncentiveSimulator = () => {
  const { addNotification } = useNotifications();

  // Inputs
  const [dealName, setDealName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [amount, setAmount] = useState("");
  const [dealType, setDealType] = useState("NEW_BUSINESS");
  const [selectedPolicyId, setSelectedPolicyId] = useState("");

  // Derived / Data
  const [policies, setPolicies] = useState([]);
  const [appliedRate, setAppliedRate] = useState(0);
  const [result, setResult] = useState(null);

  // Fetch Policies and specific deal params on Load
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const amountParam = queryParams.get("amount");
    const dealNameParam = queryParams.get("dealName");
    const orgParam = queryParams.get("orgName");

    if (amountParam) setAmount(amountParam);
    if (dealNameParam) setDealName(dealNameParam);
    if (orgParam) setOrgName(orgParam);

    api.get("/api/policy?type=INCENTIVE")
      .then(res => setPolicies(res.data))
      .catch(err => console.error("Failed to load policies", err));
  }, []);

  const handlePolicyChange = (e) => {
    const policyId = e.target.value;
    setSelectedPolicyId(policyId);

    if (policyId) {
      const policy = policies.find(p => p.id === Number(policyId));
      if (policy) {
        const numericRate = parseFloat((policy.commissionRate || policy.rate || "0").toString().replace(/[^0-9.]/g, ''));
        if (!isNaN(numericRate)) {
          setAppliedRate(numericRate);
          setResult(null);
        }
      }
    } else {
      setAppliedRate(0);
      setResult(null);
    }
  };

  const handleCalculate = () => {
    if (!amount || !selectedPolicyId) return;

    const incentive = (Number(amount) * Number(appliedRate)) / 100;
    const projectedTier = incentive > 50000 ? "Gold" : incentive > 20000 ? "Silver" : "Bronze";

    setResult({
      incentive,
      rate: appliedRate,
      tier: projectedTier
    });

    addNotification({
      type: "info",
      title: "Simulation Complete",
      message: `Projected incentive: ₹${incentive.toLocaleString()}`
    });
  };

  const handleReset = () => {
    setDealName("");
    setOrgName("");
    setAmount("");
    setDealType("NEW_BUSINESS");
    setSelectedPolicyId("");
    setAppliedRate(0);
    setResult(null);
  };

  return (
    <SalesLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
        <PageHeader
          heading="Incentive Simulator"
          subtitle="Forecast potential earnings by simulating deal values and applying different incentive policies."
        />

        {/* Disclaimer Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 p-5 rounded-r-2xl shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="flex-1">
              <h3 className="text-blue-900 dark:text-blue-100 font-bold text-sm uppercase tracking-wide mb-1">Simulation Only - Not Saved</h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                Values calculated here are estimates. Actual incentives are determined at the time of deal approval based on the active policy and your performance tier.
                <span className="font-bold"> This data is NOT saved to your account.</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* INPUT PANEL */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-modern p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-text-primary">Deal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2">Deal Name (Optional)</label>
                  <input
                    className="input-modern w-full"
                    type="text"
                    placeholder="e.g. Project Alpha"
                    value={dealName}
                    onChange={(e) => setDealName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2">Organization (Optional)</label>
                  <input
                    className="input-modern w-full"
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2">Deal Type</label>
                  <select
                    className="input-modern w-full"
                    value={dealType}
                    onChange={(e) => setDealType(e.target.value)}
                  >
                    <option value="NEW_BUSINESS">🆕 New Business</option>
                    <option value="RENEWAL">🔄 Renewal</option>
                    <option value="UPSELL">📈 Upsell</option>
                    <option value="CROSS_SELL">🔀 Cross-sell</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-2">Deal Amount (₹) *</label>
                  <input
                    className="input-modern w-full font-mono text-lg"
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-border-subtle">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">Select Policy</h3>
                </div>

                <div className="bg-gradient-to-r from-surface-2 to-surface-1 p-5 rounded-xl border border-border-subtle">
                  <label className="block text-sm font-bold text-text-secondary mb-3">Active Incentive Policy *</label>
                  <select
                    className="input-modern w-full mb-4"
                    value={selectedPolicyId}
                    onChange={handlePolicyChange}
                  >
                    <option value="">-- Select Active Policy --</option>
                    {policies.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} - {p.commissionRate || p.rate}%
                      </option>
                    ))}
                  </select>
                  {selectedPolicyId && (
                    <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Applied Commission Rate:</span>
                      <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {appliedRate}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  onClick={handleReset}
                  className="btn-secondary py-3 text-sm font-bold"
                >
                  Reset Form
                </button>
                <button
                  onClick={handleCalculate}
                  disabled={!amount || !selectedPolicyId}
                  className="btn-primary py-3 text-sm uppercase tracking-widest font-bold shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Calculate Incentive
                </button>
              </div>
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div className="lg:col-span-1">
            {result ? (
              <div className="card-modern p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-2 border-indigo-200 dark:border-indigo-800 h-full flex flex-col animate-in slide-in-from-right duration-500 shadow-xl">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-widest mb-6 text-center">Estimation Results</h3>

                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 mb-8 p-6 bg-white/50 dark:bg-black/20 rounded-2xl">
                  <span className="text-xs text-text-secondary uppercase tracking-wider">Projected Incentive</span>
                  <span className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ₹{result.incentive.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-sm text-text-muted">at {result.rate}% commission rate</span>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-white dark:bg-black/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-text-secondary">Deal Type</span>
                      <span className="text-sm font-bold text-text-primary">{dealType.replace('_', ' ')}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className="text-xs text-text-secondary">Revenue Added</span>
                      <span className="text-sm font-bold text-text-primary">₹{Number(amount).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50">
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
                      <span className="text-lg">⚡</span> Tier Impact
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                      Closing this deal could contribute towards your <strong>{result.tier}</strong> status targets and unlock higher multipliers.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-indigo-200 dark:border-indigo-800/50 text-center">
                  <button
                    onClick={() => setResult(null)}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold underline"
                  >
                    Clear Results
                  </button>
                </div>
              </div>
            ) : (
              <div className="card-modern p-8 h-full flex flex-col items-center justify-center text-center text-text-muted border-dashed border-2 border-border-subtle bg-surface-2/50">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-indigo-100 dark:from-primary-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <h4 className="font-bold text-text-primary text-lg mb-2">Ready to Analyze</h4>
                <p className="text-sm max-w-[250px] text-text-secondary">Fill in the deal details and select a policy to see your potential earnings.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SalesLayout>
  );
};

export default IncentiveSimulator;
