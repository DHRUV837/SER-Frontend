import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";

const AdminDealDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [deal, setDeal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDealDetails();
    }, [id]);

    const fetchDealDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/admin/deals/${id}`);
            setDeal(response.data);
        } catch (error) {
            console.error("Error fetching deal details:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex h-screen items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </AdminLayout>
        );
    }

    if (!deal) {
        return (
            <AdminLayout>
                <div className="p-8 text-center">
                    <h2 className="text-xl font-bold text-text-primary">Deal not found</h2>
                    <button onClick={() => navigate("/admin/deals")} className="btn-secondary mt-4">
                        Back to Deals
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <PageHeader
                heading={deal.dealName || deal.organizationName}
                subtitle={`Opportunity Reference: #${deal.id} — Detailed Assessment`}
                actions={
                    <div className="flex items-center gap-3">
                        <StatusBadge status={deal.status} />
                        <button
                            onClick={() => navigate("/admin/deals")}
                            className="btn-secondary py-2"
                        >
                            Back to List
                        </button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card-modern p-6">
                        <h3 className="text-lg font-bold text-text-primary mb-4 border-b border-border-subtle pb-2">
                            Deal Overview
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Organization</p>
                                <p className="text-text-primary font-medium">{deal.organizationName}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Client Contact</p>
                                <p className="text-text-primary font-medium">{deal.clientName || deal.organizationName}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Deal Value</p>
                                <p className="text-xl font-bold text-primary-600">{deal.currency || '₹'}{deal.amount?.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Assigned Executive</p>
                                <p className="text-text-primary">{deal.user?.name || "Unassigned"}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Priority</p>
                                <p className="text-text-primary">{deal.priority || "MEDIUM"}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Industry</p>
                                <p className="text-text-primary font-medium">{deal.industry || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Region</p>
                                <p className="text-text-primary font-medium">{deal.region || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Expected Close</p>
                                <p className="text-text-primary">{deal.expectedCloseDate || "Not set"}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Created Date</p>
                                <p className="text-text-primary">{deal.date || "N/A"}</p>
                            </div>
                        </div>

                        {deal.dealNotes && (
                            <div className="mt-6">
                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Admin Notes</p>
                                <div className="p-4 bg-surface-2 rounded-lg text-sm text-text-secondary italic">
                                    "{deal.dealNotes}"
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="card-modern p-6">
                        <h3 className="text-lg font-bold text-text-primary mb-4 border-b border-border-subtle pb-2">
                            Sales Executive Progress & Comments
                        </h3>
                        {deal.adminComment ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-lg border border-primary-100 dark:border-primary-800">
                                    <p className="text-xs font-bold text-primary-700 dark:text-primary-300 uppercase mb-1">Latest Update from {deal.user?.name || "Executive"}</p>
                                    <p className="text-sm text-text-primary">{deal.adminComment}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-text-muted italic">No progress comments yet.</p>
                        )}
                    </div>
                </div>

                {/* Right Column: Meta & Actions */}
                <div className="space-y-6">
                    <div className="card-modern p-6 bg-gradient-to-br from-surface-1 to-surface-2">
                        <h3 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-widest">Analytics Snippet</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg">
                                <span className="text-xs text-text-secondary">Risk Level</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${deal.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                                    deal.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                    {deal.riskLevel || 'LOW'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg">
                                <span className="text-xs text-text-secondary">Expected Payout</span>
                                <span className="text-xs font-bold text-emerald-600">₹{deal.incentive?.toLocaleString() || '0'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="card-modern p-6">
                        <h3 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-widest">Workflow Actions</h3>
                        <div className="space-y-3">
                            {(deal.status === 'Submitted' || deal.status === 'Pending') && (
                                <>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Approve this deal?')) {
                                                // Simple inline approval for now, or could implement modal
                                                axios.patch(`http://localhost:8080/deals/${deal.id}/status`, { status: 'Approved', comment: 'Approved via Detail Page' })
                                                    .then(() => { fetchDealDetails(); alert('Deal Approved'); })
                                                    .catch(err => console.error(err));
                                            }
                                        }}
                                        className="btn-primary w-full py-2 text-sm bg-green-600 hover:bg-green-700 border-green-600"
                                    >
                                        Approve Deal
                                    </button>
                                    <button
                                        onClick={() => {
                                            const reason = window.prompt('Enter rejection reason:');
                                            if (reason) {
                                                axios.patch(`http://localhost:8080/deals/${deal.id}/status`, { status: 'Rejected', reason: reason })
                                                    .then(() => { fetchDealDetails(); alert('Deal Rejected'); })
                                                    .catch(err => console.error(err));
                                            }
                                        }}
                                        className="btn-secondary w-full py-2 text-sm text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                        Reject Deal
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => navigate(`/admin/deals/edit/${deal.id}`)}
                                className="btn-secondary w-full py-2 text-sm"
                                disabled
                            >
                                Edit Metadata (Coming Soon)
                            </button>
                            <button
                                onClick={() => navigate("/admin/approvals")}
                                className="btn-secondary w-full py-2 text-sm"
                            >
                                Go to Approval Queue
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDealDetailPage;
