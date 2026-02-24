import { useEffect, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { auth } = useAuth();
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    api.get("/api/deals")
      .then(res => setDeals(res.data))
      .catch(console.error);
  }, []);

  const totalDeals = deals.length;
  const totalRevenue = deals.reduce((sum, d) => sum + d.amount, 0);
  const totalCommission = deals.reduce(
    (sum, d) => sum + (d.amount <= 50000 ? d.amount * 0.05 : d.amount * 0.10),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2 text-text-primary">Analytics Dashboard</h1>
          <p className="text-text-secondary">System-level insights & sales performance</p>
        </div>

        {/* Profile Badge */}
        {auth?.profile && (
          <div className="text-right">
            <div className="text-sm text-text-muted uppercase tracking-widest text-xs">Employee</div>
            <div className="font-mono font-semibold text-text-primary">{auth.profile.employeeCode} <span className="mx-1">•</span> {auth.profile.department}</div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Performance Rating Card */}
        {auth?.performance && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-indigo-500/30 rounded-xl p-6 bg-gradient-to-br from-indigo-900/50 to-purple-900/20"
          >
            <p className="text-indigo-300 text-sm uppercase tracking-wider">Performance Rating</p>
            <div className="flex items-end space-x-2 mt-2">
              <h2 className="text-3xl font-bold text-white">{auth.performance.performanceRating}</h2>
              <span className="text-indigo-200 mb-1">/ 5.0</span>
            </div>
            <div className="mt-2 text-xs text-indigo-200">
              Target: ${auth.performance.currentMonthTarget?.toLocaleString()}
            </div>
          </motion.div>
        )}

        {[
          { label: "Total Deals", value: totalDeals },
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}` },
          { label: "Total Commission", value: `₹${totalCommission.toLocaleString()}` }
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className='glass-card p-6'
          >
            <p className="text-text-secondary text-sm font-medium">{card.label}</p>
            <h2 className="text-2xl font-bold mt-2 text-text-primary">{card.value}</h2>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
