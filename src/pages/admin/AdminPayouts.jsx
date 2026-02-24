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
                api.get(`/payouts?status=${filter}`),
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
            <div className="min-h-screen space-y-8 animate-in fade-in duration-700 p-4 md:p-8">
                {/* Enterprise Header Section */}
                <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl border border-slate-800">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-500/10 to-transparent"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-600/20 rounded-full blur-[100px]"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                                    Financial Operations
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                                Incentive <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Payout Ledger</span>
                            </h1>
                            <p className="text-slate-400 text-lg max-w-xl font-medium leading-relaxed">
                                High-precision disbursement console for enterprise-wide commission settlement and secondary verification.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={exportCSV}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl font-bold flex items-center gap-2 transition-all hover:scale-105"
                            >
                                <span className="text-xl">📊</span> Export Dataset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative group overflow-hidden bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-emerald-500/5 transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Liability Pool</p>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                                    ₹{summary?.totalPending?.toLocaleString() || 0}
                                </h3>
                                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm bg-amber-500/10 px-3 py-1 rounded-full w-fit">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                    </span>
                                    {summary?.pendingCount || 0} Settlements Required
                                </div>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-3xl shadow-inner">
                                ⏳
                            </div>
                        </div>
                    </div>

                    <div className="relative group overflow-hidden bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-emerald-500/5 transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Disbursed Total</p>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                                    ₹{summary?.totalPaid?.toLocaleString() || 0}
                                </h3>
                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
                                    ✨ {summary?.paidCount || 0} Successful Cycles
                                </div>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-3xl shadow-inner">
                                ✅
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tactical Control Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 gap-6">
                    <div className="inline-flex bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl items-center">
                        <button
                            onClick={() => setFilter('PENDING')}
                            className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${filter === "PENDING" ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xl scale-100' : 'text-slate-500 hover:text-slate-700 scale-95 opacity-70'}`}
                        >
                            UNSETTLED
                        </button>
                        <button
                            onClick={() => setFilter('PAID')}
                            className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${filter === "PAID" ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xl scale-100' : 'text-slate-500 hover:text-slate-700 scale-95 opacity-70'}`}
                        >
                            AUDIT HISTORY
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        {filter === "PENDING" && selectedIds.length > 0 && (
                            <button
                                onClick={markAsPaid}
                                className="group relative px-10 py-4 bg-slate-900 dark:bg-emerald-600 text-white font-black rounded-2xl shadow-2xl hover:scale-105 transition-all flex items-center gap-3 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <span className="relative z-10">Execute {selectedIds.length} Payouts</span>
                                <span className="relative z-10 text-xl group-hover:translate-x-1 transition-transform">🚀</span>
                            </button>
                        )}
                        <div className="h-10 w-px bg-slate-300 dark:bg-slate-800 hidden md:block mx-2"></div>
                        <div className="text-right hidden md:block">
                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Current Batch</p>
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{payouts.length} Units Found</p>
                        </div>
                    </div>
                </div>

                {/* Advanced Data Grid */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                    <th className="p-8 w-20 text-center border-b border-slate-200 dark:border-slate-800">
                                        {filter === "PENDING" && (
                                            <input
                                                type="checkbox"
                                                onChange={handleSelectAll}
                                                checked={payouts.length > 0 && selectedIds.length === payouts.length}
                                                className="w-5 h-5 rounded-lg border-2 border-slate-300 text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer"
                                            />
                                        )}
                                    </th>
                                    <th className="p-8 text-left text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-200 dark:border-slate-800">Operational Entity</th>
                                    <th className="p-8 text-left text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-200 dark:border-slate-800">Timeline</th>
                                    <th className="p-8 text-left text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-200 dark:border-slate-800">Contract Value</th>
                                    <th className="p-8 text-left text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-200 dark:border-slate-800">Yield / Commission</th>
                                    <th className="p-8 text-left text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-200 dark:border-slate-800">Status Vector</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {payouts.map(deal => (
                                    <tr key={deal.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all duration-300">
                                        <td className="p-8 text-center">
                                            {filter === "PENDING" && (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(deal.id)}
                                                    onChange={() => handleSelect(deal.id)}
                                                    className="w-5 h-5 rounded-lg border-2 border-slate-300 text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer"
                                                />
                                            )}
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-lg shadow-sm group-hover:scale-110 transition-transform">
                                                    {(deal.user?.name || 'U')[0]}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 dark:text-white text-base mb-0.5">{deal.user?.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{deal.user?.role || 'RESOURCE'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <p className="text-slate-600 dark:text-slate-400 font-bold text-sm tracking-tight">{deal.date}</p>
                                        </td>
                                        <td className="p-8">
                                            <p className="text-slate-900 dark:text-slate-100 font-bold text-sm">₹{deal.amount.toLocaleString()}</p>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex flex-col">
                                                <p className="text-emerald-600 dark:text-emerald-400 font-black text-lg">₹{deal.incentive.toLocaleString()}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">Standard Commission</p>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${deal.payoutStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${deal.payoutStatus === 'PAID' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                                                {deal.payoutStatus || 'PENDING'}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {payouts.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-4 grayscale opacity-30">
                                                <span className="text-6xl">📥</span>
                                                <p className="text-lg font-black text-slate-400 tracking-widest uppercase">Zero Data Vector Found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );

};

export default AdminPayouts;
