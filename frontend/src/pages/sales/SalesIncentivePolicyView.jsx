import { useState, useEffect } from "react";
import api from "../../api";
import SalesLayout from "../../layouts/SalesLayout";
import PageHeader from "../../components/common/PageHeader";

const SalesIncentivePolicyView = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/policy?type=INCENTIVE");
            console.log("Incentive Policies for Sales:", response.data);
            setPolicies(response.data);
        } catch (error) {
            console.error("Error fetching incentive policies:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SalesLayout>
            <PageHeader
                heading="Commission Schemes"
                subtitle="Review active commission structures and bonus eligibility criteria for your deals."
            />

            {/* Policies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full p-12 text-center text-text-muted">
                        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        Loading policies...
                    </div>
                ) : policies.length === 0 ? (
                    <div className="col-span-full p-12 text-center">
                        <div className="text-6xl mb-4">💰</div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">No Incentive Policies</h3>
                        <p className="text-text-muted">No active incentive policies are available yet.</p>
                    </div>
                ) : (
                    policies.map((policy) => (
                        <div key={policy.id} className="card-modern p-6 hover:shadow-lg transition-shadow">
                            {/* Policy Title */}
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-xl font-bold text-text-primary">{policy.title}</h3>
                                {policy.active && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">
                                        Active
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            {policy.description && (
                                <p className="text-text-muted text-sm mb-4">{policy.description}</p>
                            )}

                            {/* Commission Rate */}
                            <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                                <div className="text-sm text-text-secondary font-medium mb-1">Commission Rate</div>
                                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                    {policy.commissionRate ? `${policy.commissionRate}%` : "N/A"}
                                </div>
                            </div>

                            {/* Deal Range */}
                            {(policy.minDealAmount || policy.maxDealAmount) && (
                                <div className="mb-4">
                                    <div className="text-sm font-medium text-text-secondary mb-2">Deal Range</div>
                                    <div className='text-text-primary' patterns>
                                        {policy.minDealAmount && policy.maxDealAmount
                                            ? `₹${policy.minDealAmount.toLocaleString()} - ₹${policy.maxDealAmount.toLocaleString()}`
                                            : policy.minDealAmount
                                                ? `₹${policy.minDealAmount.toLocaleString()}+`
                                                : `Up to ₹${policy.maxDealAmount.toLocaleString()}`}
                                    </div>
                                </div>
                            )}

                            {/* Bonus Info */}
                            {policy.bonusAmount && policy.bonusThreshold && (
                                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                    <div className="flex items-center gap-2 mb-1">
                                        <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">Bonus Available!</span>
                                    </div>
                                    <div className="text-sm text-yellow-700 dark:text-yellow-400">
                                        <strong>₹{policy.bonusAmount.toLocaleString()}</strong> bonus for deals above <strong>₹{policy.bonusThreshold.toLocaleString()}</strong>
                                    </div>
                                </div>
                            )}

                            {/* Additional Content */}
                            {policy.content && (
                                <div className="mt-4 pt-4 border-t border-border-subtle">
                                    <div className="text-sm text-text-muted">{policy.content}</div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </SalesLayout>
    );
};

export default SalesIncentivePolicyView;
