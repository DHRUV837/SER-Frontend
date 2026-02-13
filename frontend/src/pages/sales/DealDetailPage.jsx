import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import SalesLayout from "../../layouts/SalesLayout";
import PageHeader from "../../components/common/PageHeader";

const DealDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [deal, setDeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [comment, setComment] = useState("");

    useEffect(() => {
        fetchDealDetails();
    }, [id]);

    const fetchDealDetails = async () => {
        try {
            const userId = JSON.parse(localStorage.getItem("auth"))?.user?.id || JSON.parse(localStorage.getItem("auth"))?.id;
            const response = await api.get(`/api/deals?userId=${userId}`);
            const foundDeal = response.data.find(d => d.id.toString() === id);
            if (foundDeal) {
                setDeal(foundDeal);
            }
        } catch (error) {
            console.error("Error fetching deal details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        setUpdating(true);
        try {
            await api.patch(`/api/deals/${id}/status`, {
                status: newStatus,
                comment: comment || `Updated by Sales Executive to ${newStatus}`
            });
            setComment("");
            alert(`✅ Success! Deal status updated to '${newStatus}'.`);
            await fetchDealDetails();
        } catch (error) {
            console.error("Error updating status:", error);
            let msg = error.response?.data?.message;
            if (!msg && typeof error.response?.data === 'string') {
                msg = error.response.data;
            }
            alert("❌ Failed to update status: " + (msg || "Unknown error"));
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <SalesLayout>
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
            </div>
        </SalesLayout>
    );

    if (!deal) return (
        <SalesLayout>
            <div className="text-center p-20">
                <h2 className="text-2xl font-bold text-text-primary">Deal not found</h2>
                <button onClick={() => navigate("/sales/my-deals")} className="btn-primary mt-4">
                    Back to My Deals
                </button>
            </div>
        </SalesLayout>
    );

    return (
        <SalesLayout>
            <PageHeader
                heading={deal.dealName || deal.organizationName}
                subtitle={`Deal ID: #${deal.id} • Assigned to You`}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="card-modern p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            Overview
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-text-muted">Organization</p>
                                <p className="text-lg font-semibold text-text-primary">{deal.organizationName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-text-muted">Client Contact</p>
                                <p className="text-lg font-semibold text-text-primary">{deal.clientName || deal.organizationName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-text-muted">Deal Value</p>
                                <p className="text-lg font-bold text-primary-600">{deal.currency || '₹'}{deal.amount.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-text-muted">Expected Close Date</p>
                                <p className="text-lg font-semibold text-text-primary">{deal.expectedCloseDate || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-text-muted">Industry</p>
                                <p className="text-lg font-semibold text-text-primary">{deal.industry || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-text-muted">Region</p>
                                <p className="text-lg font-semibold text-text-primary">{deal.region || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-text-muted">Priority</p>
                                <p className={`text-lg font-bold ${deal.priority === 'HIGH' ? 'text-red-500' : deal.priority === 'MEDIUM' ? 'text-amber-500' : 'text-green-500'}`}>
                                    {deal.priority || 'NORMAL'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card-modern p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            Deal Notes
                        </h2>
                        <p className="text-text-secondary italic whitespace-pre-wrap">
                            {deal.dealNotes || "No internal notes provided for this deal."}
                        </p>
                    </div>

                    {deal.rejectionReason && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-xl">
                            <h2 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">Rejection Reason</h2>
                            <p className="text-red-600 dark:text-red-300">{deal.rejectionReason}</p>
                        </div>
                    )}
                </div>

                {/* Sidebar Items */}
                <div className="space-y-6">
                    <div className="card-modern p-6">
                        <h2 className="text-lg font-bold mb-4">Progress Update</h2>
                        <textarea
                            className="input-modern w-full h-24 mb-4 text-sm"
                            placeholder="Add a progress note or update..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>

                        <div className="space-y-3">
                            {deal.status === "ASSIGNED" && (
                                <button
                                    onClick={() => handleStatusUpdate("IN_PROGRESS")}
                                    className="btn-secondary w-full py-2 text-sm"
                                    disabled={updating}
                                >
                                    {updating ? "Processing..." : "Set to In Progress"}
                                </button>
                            )}

                            {(deal.status === "ASSIGNED" || deal.status === "IN_PROGRESS") && (
                                <button
                                    onClick={() => handleStatusUpdate("Pending")}
                                    className="btn-primary w-full py-3"
                                    disabled={updating}
                                >
                                    {updating ? "Processing..." : "Submit for Final Review"}
                                </button>
                            )}

                            <button
                                onClick={() => navigate("/sales/my-deals")}
                                className="w-full text-center text-sm text-text-muted hover:text-primary-600 transition-colors pt-2"
                            >
                                Back to All Deals
                            </button>
                        </div>
                    </div>

                    <div className="card-modern p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 border-emerald-100 dark:border-emerald-800">
                        <h2 className="text-lg text-emerald-800 dark:text-emerald-400 font-bold mb-2">Projected Incentive</h2>
                        <p className="text-3xl font-bold text-emerald-600">₹{deal.incentive?.toLocaleString() || '0'}</p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-2 mb-4">
                            Calculated at {deal.rate || 0}% based on current policy.
                        </p>
                        <button
                            onClick={() => navigate(`/sales/simulator?amount=${deal.amount}&rate=${deal.rate || 0}&dealName=${encodeURIComponent(deal.dealName || deal.organizationName)}`)}
                            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            Explore in Simulator →
                        </button>
                    </div>
                </div>
            </div>
        </SalesLayout>
    );
};

export default DealDetailPage;
