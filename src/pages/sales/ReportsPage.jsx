import SalesLayout from "../../layouts/SalesLayout";
import { useSales } from "../../context/SalesContext";
import { useState } from "react";

const ReportsPage = () => {
  const { deals } = useSales();
  const [reportType, setReportType] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const parseDate = (dateStr) => {
    try {
      if (typeof dateStr === 'string') {
        let date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            date = new Date(parts[2], parts[0] - 1, parts[1]);
          }
        }
        return date;
      }
      return new Date(dateStr);
    } catch {
      return null;
    }
  };

  // Filter deals based on report type
  const getFilteredDeals = () => {
    const approvedDeals = deals.filter(d => d.status === "Approved");

    if (reportType === "all") {
      return approvedDeals;
    }

    if (reportType === "monthly") {
      return approvedDeals.filter(deal => {
        const dealDate = parseDate(deal.date);
        if (!dealDate || isNaN(dealDate.getTime())) return false;
        return dealDate.getMonth() === selectedMonth &&
          dealDate.getFullYear() === selectedYear;
      });
    }

    return approvedDeals;
  };

  const filteredDeals = getFilteredDeals();
  const totalIncentive = filteredDeals.reduce((sum, d) => sum + (d.incentive || 0), 0);
  const totalDeals = filteredDeals.length;
  const avgIncentive = totalDeals > 0 ? totalIncentive / totalDeals : 0;

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Date", "Amount (₹)", "Rate (%)", "Incentive (₹)", "Status"];
    const rows = filteredDeals.map(deal => [
      deal.date,
      deal.amount.toLocaleString('en-IN'),
      deal.rate,
      deal.incentive.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      deal.status
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    const filename = reportType === "all"
      ? `Sales_Report_All_${new Date().toISOString().split('T')[0]}.csv`
      : `Sales_Report_${monthNames[selectedMonth]}_${selectedYear}.csv`;

    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate PDF Report (simplified - opens print dialog)
  const exportToPDF = () => {
    window.print();
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <SalesLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="section-title">Reports & Export</h1>
          <div className="h-px bg-black w-24 mt-2"></div>
          <p className="section-subtitle mt-4">Generate and download your performance reports</p>
        </div>

        {/* Report Controls */}
        <div className="card-modern p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2 border border-border-strong rounded-lg bg-surface-2 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="monthly">Monthly Report</option>
                <option value="all">All Time Report</option>
              </select>
            </div>

            {reportType === "monthly" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-border-strong rounded-lg bg-surface-2 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {monthNames.map((month, index) => (
                      <option key={index} value={index}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-border-strong rounded-lg bg-surface-2 text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-modern p-6">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">Total Deals</p>
            <p className="text-3xl font-bold text-text-primary">{totalDeals}</p>
          </div>
          <div className="card-modern p-6">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">Total Incentive</p>
            <p className="text-3xl font-bold text-text-primary">
              ₹{totalIncentive.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="card-modern p-6">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">Avg Incentive/Deal</p>
            <p className="text-3xl font-bold text-text-primary">
              ₹{avgIncentive.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Export Actions */}
        <div className="card-modern p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Export Report</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export CSV</span>
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Deal List Preview */}
        <div className="card-modern p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Deal Details</h3>
          {filteredDeals.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-8">No deals found for the selected period</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border-subtle">
                <thead className="bg-surface-2">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-widest">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-widest">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-widest">Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-widest">Incentive</th>
                  </tr>
                </thead>
                <tbody className="bg-surface-1 divide-y divide-border-subtle">
                  {filteredDeals.map((deal, index) => (
                    <tr key={deal.id || index} className="hover:bg-surface-2">
                      <td className="px-4 py-3 text-sm text-text-primary">{deal.date}</td>
                      <td className="px-4 py-3 text-sm text-text-primary">₹{deal.amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-sm text-text-primary">{deal.rate}%</td>
                      <td className="px-4 py-3 text-sm font-semibold text-emerald-600">
                        ₹{deal.incentive.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SalesLayout>
  );
};

export default ReportsPage;

