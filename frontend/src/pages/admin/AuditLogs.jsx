import SalesLayout from "../../layouts/SalesLayout";
import { useState, useEffect } from "react";
import api from "../../api";
import PageHeader from "../../components/common/PageHeader";

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filters, setFilters] = useState({
        action: "",
        email: "",
        startDate: "",
        endDate: ""
    });

    useEffect(() => {
        fetchLogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.action) params.action = filters.action;
            if (filters.email) params.email = filters.email;
            if (filters.startDate) params.startDate = filters.startDate + "T00:00:00";
            if (filters.endDate) params.endDate = filters.endDate + "T23:59:59";

            const url = Object.keys(params).length > 0
                ? `${API_URL}/api/audit-logs/search`
                : `${API_URL}/api/audit-logs`;

            const response = await axios.get(url, { params });
            setLogs(response.data);
        } catch (error) {
            console.error("Failed to fetch audit logs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchLogs();
    };

    const handleExport = () => {
        const headers = ["Timestamp", "Actor (Email)", "Action", "Entity Type", "Entity ID", "Details"];
        const csvContent = [
            headers.join(","),
            ...logs.map(log => [
                new Date(log.timestamp).toLocaleString().replace(",", " "),
                log.email || "System",
                log.action,
                log.entityType,
                log.entityId,
                `"${(log.details || "").replace(/"/g, '""')}"`
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
    };

    const getActionColor = (action) => {
        if (!action) return "text-text-secondary bg-surface-2";
        if (action.includes("LOGIN")) return action.includes("FAIL") ? "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30" : "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30";
        if (action === "APPROVE") return "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30";
        if (action === "REJECT") return "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30";
        if (action.includes("UPDATE")) return "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30";
        if (action === "BROADCAST") return "text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30";
        return "text-text-secondary bg-surface-2";
    };

    return (
        <SalesLayout>
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    heading="System Audit Trail"
                    subtitle="Immutable record of all system interactions, security events, and data modifications."
                />

                {/* Filters */}
                <div className="card-modern p-4 mb-6">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-semibold text-text-secondary mb-1">Action Type</label>
                            <input
                                type="text"
                                placeholder="e.g. LOGIN, APPROVE"
                                className="w-full bg-surface-1 text-text-primary border border-border-subtle rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                value={filters.action}
                                onChange={e => setFilters({ ...filters, action: e.target.value })}
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-semibold text-text-secondary mb-1">User Email</label>
                            <input
                                type="text"
                                placeholder="user@example.com"
                                className="w-full bg-surface-1 text-text-primary border border-border-subtle rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                value={filters.email}
                                onChange={e => setFilters({ ...filters, email: e.target.value })}
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-semibold text-text-secondary mb-1">Start Date</label>
                            <input
                                type="date"
                                className="w-full bg-surface-1 text-text-primary border border-border-subtle rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                value={filters.startDate}
                                onChange={e => setFilters({ ...filters, startDate: e.target.value })}
                            />
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-semibold text-text-secondary mb-1">End Date</label>
                            <input
                                type="date"
                                className="w-full bg-surface-1 text-text-primary border border-border-subtle rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                value={filters.endDate}
                                onChange={e => setFilters({ ...filters, endDate: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={fetchLogs}
                                className="bg-surface-3 text-text-secondary px-3 py-2 rounded-lg hover:bg-surface-2 transition-colors border border-border-subtle"
                                title="Refresh"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            </button>
                            <button
                                type="button"
                                onClick={handleExport}
                                className="bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                <span className="text-sm font-medium">Export</span>
                            </button>
                        </div>
                    </form>
                </div>

                <div className="card-modern overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-2 border-b border-border-subtle text-xs font-semibold text-text-secondary uppercase">
                                    <th className="px-6 py-4">Timestamp</th>
                                    <th className="px-6 py-4">Actor</th>
                                    <th className="px-6 py-4">Action</th>
                                    <th className="px-6 py-4">Entity</th>
                                    <th className="px-6 py-4">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-text-muted">
                                            <div className="flex justify-center items-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                                                Loading audit trail...
                                            </div>
                                        </td>
                                    </tr>
                                ) : logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-text-muted">
                                            No audit logs found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-surface-2 transition-colors text-sm">
                                            <td className="px-6 py-4 text-text-secondary whitespace-nowrap">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-text-primary">
                                                {log.email || "System"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getActionColor(log.action)}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-text-secondary">
                                                <span className="bg-surface-3 px-2 py-0.5 rounded text-xs font-mono">{log.entityType}</span>
                                                <span className="text-text-muted ml-1">#{log.entityId}</span>
                                            </td>
                                            <td className="px-6 py-4 text-text-secondary max-w-md break-words">
                                                {log.details}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-surface-2 p-3 border-t border-border-subtle text-xs text-text-muted text-right">
                        Showing {logs.length} records
                    </div>
                </div>
            </div>
        </SalesLayout>
    );
};

export default AuditLogs;
