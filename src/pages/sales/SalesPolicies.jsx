import React, { useState, useEffect } from "react";
import SalesLayout from "../../layouts/SalesLayout";
import api from "../../api";
import PageHeader from "../../components/common/PageHeader";

const SalesPolicies = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const res = await api.get("/api/policy?type=COMPANY");
                setPolicies(res.data);
                if (res.data.length > 0) setSelectedPolicy(res.data[0]);
            } catch (err) {
                console.error("Failed to fetch policies");
            } finally {
                setLoading(false);
            }
        };
        fetchPolicies();
    }, []);

    return (
        <SalesLayout>
            <div className="space-y-6">
                <PageHeader
                    heading="Company Policy & Guidelines"
                    subtitle="Access general company policies, terms of service, and compliance guidelines."
                />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar List */}
                    <div className="lg:col-span-1 space-y-2">
                        <div className="card-modern p-4 mb-4">
                            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-2">Policy Categories</h3>
                            <p className="text-xs text-text-muted">{policies.length} active {policies.length === 1 ? 'policy' : 'policies'}</p>
                        </div>

                        {loading ? (
                            <div className="animate-pulse space-y-3">
                                {[1, 2, 3].map(i => <div key={i} className="h-14 bg-surface-2 rounded-xl"></div>)}
                            </div>
                        ) : policies.length === 0 ? (
                            <div className="p-6 text-center border-2 border-dashed border-border-subtle rounded-xl bg-surface-2/30">
                                <div className="text-3xl mb-2 opacity-50">📄</div>
                                <p className="text-sm text-text-muted">No active policies found.</p>
                            </div>
                        ) : (
                            policies.map(policy => (
                                <button
                                    key={policy.id}
                                    onClick={() => setSelectedPolicy(policy)}
                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium group hover:shadow-md
                                        ${selectedPolicy?.id === policy.id
                                            ? 'bg-gradient-to-r from-primary-500 to-indigo-500 text-white shadow-lg shadow-primary-500/30'
                                            : 'bg-surface-1 text-text-secondary hover:bg-surface-2 border border-border-subtle'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-lg ${selectedPolicy?.id === policy.id ? 'bg-white/20' : 'bg-primary-100 dark:bg-primary-900/30'}`}>
                                            <svg className={`w-4 h-4 ${selectedPolicy?.id === policy.id ? 'text-white' : 'text-primary-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        </div>
                                        <span className="flex-1 line-clamp-2">{policy.title}</span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Content Viewer */}
                    <div className="lg:col-span-3">
                        {selectedPolicy ? (
                            <div className="card-modern p-8 min-h-[600px]">
                                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border-subtle">
                                    <div className="p-3 bg-gradient-to-br from-primary-100 to-indigo-100 dark:from-primary-900/30 dark:to-indigo-900/30 rounded-2xl shadow-lg">
                                        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-text-primary mb-2">{selectedPolicy.title}</h2>
                                        <div className="flex items-center gap-4 text-xs text-text-muted">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                Last Updated: {new Date(selectedPolicy.lastUpdated).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <div className="text-text-secondary whitespace-pre-wrap leading-relaxed">
                                        {selectedPolicy.content}
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-border-subtle">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <div>
                                                <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">Important Notice</p>
                                                <p className="text-xs text-blue-800 dark:text-blue-200">
                                                    These policies are subject to change. Please check regularly for updates. For questions, contact your manager or HR department.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[600px] flex flex-col items-center justify-center p-12 card-modern text-text-muted border-2 border-dashed border-border-subtle bg-surface-2/30">
                                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-indigo-100 dark:from-primary-900/30 dark:to-indigo-900/30 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                                    <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <h3 className="text-lg font-bold text-text-primary mb-2">Select a Policy</h3>
                                <p className="text-sm text-text-secondary">Choose a policy from the sidebar to view its details and guidelines.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SalesLayout>
    );
};

export default SalesPolicies;
