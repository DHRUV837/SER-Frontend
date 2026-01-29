import React, { useState } from "react";
import SalesLayout from "../../layouts/SalesLayout";
import { useSales } from "../../context/SalesContext";
import PageHeader from "../../components/common/PageHeader";

const SalesReportsPage = () => {
    const { deals } = useSales();
    const [reportType, setReportType] = useState("Incentive");
    const [dateRange, setDateRange] = useState("This Month");
    const [format, setFormat] = useState("CSV");

    // Filter deals by date range
    const getFilteredDeals = () => {
        const now = new Date();
        return deals.filter(d => {
            if (!d.date) return false;
            const dealDate = new Date(d.date);

            if (dateRange === "This Month") {
                return dealDate.getMonth() === now.getMonth() && dealDate.getFullYear() === now.getFullYear();
            } else if (dateRange === "Last Month") {
                const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                return dealDate.getMonth() === lastMonth.getMonth() && dealDate.getFullYear() === lastMonth.getFullYear();
            } else if (dateRange === "This Year") {
                return dealDate.getFullYear() === now.getFullYear();
            }
            return true;
        });
    };

    const filteredDeals = getFilteredDeals();
    const approvedDeals = filteredDeals.filter(d => d.status === "Approved");
    const totalIncentive = approvedDeals.reduce((sum, d) => sum + (d.incentive || 0), 0);
    const totalAmount = approvedDeals.reduce((sum, d) => sum + (d.amount || 0), 0);

    const handleDownloadCSV = () => {
        let headers, rows;

        if (reportType === "Incentive") {
            headers = ["Deal Name", "Organization", "Deal Amount", "Incentive Earned", "Date", "Status"];
            rows = filteredDeals.map(d => [
                d.dealName || "N/A",
                d.organizationName || "N/A",
                d.amount || 0,
                d.incentive || 0,
                d.date || "N/A",
                d.status || "N/A"
            ]);
        } else if (reportType === "Deals") {
            headers = ["ID", "Deal Name", "Client", "Amount", "Priority", "Status", "Date"];
            rows = filteredDeals.map(d => [
                d.id,
                d.dealName || "N/A",
                d.clientName || d.organizationName || "N/A",
                d.amount || 0,
                d.priority || "MEDIUM",
                d.status || "N/A",
                d.date || "N/A"
            ]);
        } else {
            headers = ["Month", "Deals Closed", "Total Incentive", "Approval Rate"];
            const monthlyData = {};
            filteredDeals.forEach(d => {
                if (!d.date) return;
                const date = new Date(d.date);
                const key = `${date.getFullYear()}-${date.getMonth()}`;
                const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });

                if (!monthlyData[key]) monthlyData[key] = { month: monthName, deals: 0, incentive: 0, approved: 0 };
                monthlyData[key].deals += 1;
                monthlyData[key].incentive += (d.incentive || 0);
                if (d.status === "Approved") monthlyData[key].approved += 1;
            });

            rows = Object.values(monthlyData).map(m => [
                m.month,
                m.deals,
                m.incentive.toFixed(2),
                `${((m.approved / m.deals) * 100).toFixed(1)}%`
            ]);
        }

        const csvContent = "data:text/csv;charset=utf-8," +
            headers.join(",") + "\n" +
            rows.map(row => row.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${reportType.toLowerCase()}_report_${dateRange.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadPDF = () => {
        // Create a simple HTML report
        const reportHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${reportType} Report - ${dateRange}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; }
                    h1 { color: #333; border-bottom: 3px solid #4F46E5; padding-bottom: 10px; }
                    .summary { background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .summary-item { display: inline-block; margin-right: 40px; }
                    .summary-label { font-size: 12px; color: #666; text-transform: uppercase; }
                    .summary-value { font-size: 24px; font-weight: bold; color: #4F46E5; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background: #4F46E5; color: white; padding: 12px; text-align: left; }
                    td { padding: 10px; border-bottom: 1px solid #E5E7EB; }
                    tr:hover { background: #F9FAFB; }
                    .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
                </style>
            </head>
            <body>
                <h1>${reportType} Report</h1>
                <p><strong>Period:</strong> ${dateRange} | <strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
                
                <div class="summary">
                    <div class="summary-item">
                        <div class="summary-label">Total Deals</div>
                        <div class="summary-value">${filteredDeals.length}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Approved Deals</div>
                        <div class="summary-value">${approvedDeals.length}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Total Incentive</div>
                        <div class="summary-value">₹${totalIncentive.toLocaleString()}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-label">Total Value</div>
                        <div class="summary-value">₹${totalAmount.toLocaleString()}</div>
                    </div>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>Deal Name</th>
                            <th>Organization</th>
                            <th>Amount</th>
                            <th>Incentive</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredDeals.map(d => `
                            <tr>
                                <td>${d.dealName || 'N/A'}</td>
                                <td>${d.organizationName || 'N/A'}</td>
                                <td>₹${(d.amount || 0).toLocaleString()}</td>
                                <td>₹${(d.incentive || 0).toLocaleString()}</td>
                                <td>${d.status || 'N/A'}</td>
                                <td>${d.date || 'N/A'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="footer">
                    <p>Sales Incentive System - Confidential Report</p>
                </div>
            </body>
            </html>
        `;

        const blob = new Blob([reportHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportType.toLowerCase()}_report_${dateRange.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDownload = () => {
        if (format === "CSV") {
            handleDownloadCSV();
        } else {
            handleDownloadPDF();
        }
    };

    return (
        <SalesLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <PageHeader
                    heading="Reports & Analytics"
                    subtitle="Generate and expor detailed reports on deal history, incentives, and performance metrics."
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="card-modern p-6 space-y-6">
                        <h3 className="font-bold text-lg">Generate Report</h3>

                        <div>
                            <label className="block text-sm font-bold text-text-secondary mb-2">Report Type</label>
                            <select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className="input-modern w-full"
                            >
                                <option value="Incentive">Incentive Statement</option>
                                <option value="Deals">Deal History</option>
                                <option value="Performance">Performance Review</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-text-secondary mb-2">Date Range</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['This Month', 'Last Month', 'This Year'].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setDateRange(r)}
                                        className={`py-2 px-3 rounded-md text-sm border ${dateRange === r ? 'bg-primary-500 text-white border-primary-500' : 'border-border-strong text-text-secondary hover:bg-surface-2'}`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-text-secondary mb-2">Export Format</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['CSV', 'PDF'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFormat(f)}
                                        className={`py-2 px-3 rounded-md text-sm border flex items-center justify-center gap-2 ${format === f ? 'bg-primary-500 text-white border-primary-500' : 'border-border-strong text-text-secondary hover:bg-surface-2'}`}
                                    >
                                        {f === 'CSV' ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                        )}
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleDownload}
                            className="w-full btn-primary py-3 flex justify-center items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download {reportType} Report ({dateRange})
                        </button>
                    </div>

                    <div className="card-modern p-6 space-y-4">
                        <h3 className="font-bold text-lg text-text-primary">Report Preview</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                                <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-1">Total Deals</p>
                                <p className="text-2xl font-bold text-blue-800 dark:text-blue-100">{filteredDeals.length}</p>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800">
                                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-1">Approved</p>
                                <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-100">{approvedDeals.length}</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                                <p className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider mb-1">Total Incentive</p>
                                <p className="text-2xl font-bold text-purple-800 dark:text-purple-100">₹{totalIncentive.toLocaleString()}</p>
                            </div>
                            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
                                <p className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-1">Deal Value</p>
                                <p className="text-2xl font-bold text-amber-800 dark:text-amber-100">₹{totalAmount.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border-subtle">
                            <p className="text-sm text-text-muted mb-2">Report will include:</p>
                            <ul className="text-sm text-text-secondary space-y-1">
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    {reportType === "Incentive" ? "Incentive breakdown by deal" : reportType === "Deals" ? "Complete deal history" : "Monthly performance summary"}
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    Summary statistics and totals
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    {format === "PDF" ? "Professional PDF format" : "Excel-compatible CSV format"}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </SalesLayout>
    );
};

export default SalesReportsPage;
