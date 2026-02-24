import { useState, useEffect } from "react";
import api from "../../api";
import AdminLayout from "../../layouts/AdminLayout";
import StatCard from "../../components/common/StatCard";
import PageHeader from "../../components/common/PageHeader";

const AdminPayouts = () => {
    const [payouts, setPayouts] = useState([]);
    const [summary, setSummary] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("PENDING"); // PENDING, PAID

    const fetchData = async () => {
        setLoading(true);
        try {
            const [payoutsRes, summaryRes] = await Promise.all([
                api.get(`${API_URL}/payouts?status=${filter}`),
                api.get("/payouts/summary")
            ]);
            setPayouts(payoutsRes.data);
            setSummary(summaryRes.data);
        } catch (error) {
            console.error("Error fetching payouts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filter]);

    const handleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.length === payouts.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(payouts.map(p => p.id));
        }
    };

    const markAsPaid = async () => {
        if (selectedIds.length === 0) return;
        try {
            await api.post("/payouts/mark-paid", selectedIds);
            alert("Incentives marked as PAID!");
            setSelectedIds([]);
            fetchData(); // Refresh
        } catch (error) {
            alert("Failed to update payouts");
        }
    };

    const exportCSV = () => {
        const headers = "ID,User,Date,Amount,Incentive,Status\n";
        const rows = payouts.map(p =>
            `${p.id},${p.user?.name || 'Unknown'},${p.date},${p.amount},${p.incentive},${p.payoutStatus}`
        ).join("\n");

        const blob = new Blob([headers + rows], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `payouts_${filter}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <PageHeader
                    heading="Incentive Payout Management"
                    subtitle="Process and track all approved commission disbursements."
                    actions={
                        <button onClick={exportCSV} className="btn-secondary flex items-center gap-2">
                            <span>📥</span> Export CSV
                        </button>
                    }
                />

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard
                        title="Pending Payouts"
                        value={`₹${summary?.totalPending?.toLocaleString() || 0}`}
                        subtitle={`${summary?.pendingCount || 0} Deals Waiting`}
                        gradient="warning"
                        icon="clock"
                    />
                    <StatCard
                        title="Total Disbursed"
                        value={`₹${summary?.totalPaid?.toLocaleString() || 0}`}
                        subtitle={`${summary?.paidCount || 0} Deals Paid`}
                        gradient="success"
                        icon="check"
                    />
                </div>

                {/* Filters & Actions */}
                <div className="flex justify-between items-center bg-surface-2 p-4 rounded-xl border border-border-subtle">
                    <div className="flex bg-surface-1 p-1 rounded-lg border border-border-subtle">
                        <button onClick={() => setFilter('PENDING')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === "PENDING" ? 'bg-primary-500 text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}>Pending</button>
                        <button onClick={() => setFilter('PAID')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === "PAID" ? 'bg-primary-500 text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}>Paid History</button>
                    </div>

                    {filter === "PENDING" && selectedIds.length > 0 && (
                        <button onClick={markAsPaid} className="btn-primary bg-gradient-to-r from-green-500 to-emerald-600">
                            Mark {selectedIds.length} as Paid
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="card-modern overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-surface-2 text-xs uppercase text-text-muted font-bold tracking-wider">
                            <tr>
                                <th className="p-4 w-12 text-center">
                                    {filter === "PENDING" && (
                                        <input type="checkbox" onChange={handleSelectAll} checked={payouts.length > 0 && selectedIds.length === payouts.length} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                    )}
                                </th>
                                <th className="p-4">Sales Rep</th>
                                <th className="p-4">Deal Date</th>
                                <th className="p-4">Deal Amount</th>
                                <th className="p-4">Incentive</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                            {payouts.map(deal => (
                                <tr key={deal.id} className="hover:bg-surface-2 transition-colors">
                                    <td className="p-4 text-center">
                                        {filter === "PENDING" && (
                                            <input type="checkbox" checked={selectedIds.includes(deal.id)} onChange={() => handleSelect(deal.id)} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                        )}
                                    </td>
                                    <td className="p-4 font-medium text-text-primary">{deal.user?.name}</td>
                                    <td className="p-4 text-text-secondary">{deal.date}</td>
                                    <td className="p-4 text-text-secondary">₹{deal.amount.toLocaleString()}</td>
                                    <td className="p-4 font-bold text-green-600 dark:text-green-400">₹{deal.incentive.toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${deal.payoutStatus === 'PAID' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                            {deal.payoutStatus || 'PENDING'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {payouts.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-text-muted">No records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div >
            </div >
        </AdminLayout >
    );
};

export default AdminPayouts;
