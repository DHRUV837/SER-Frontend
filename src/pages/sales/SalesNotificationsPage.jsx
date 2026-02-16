import React, { useState, useEffect } from "react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import SalesLayout from "../../layouts/SalesLayout";
import { useNotifications } from "../../context/NotificationContext";
import PageHeader from "../../components/common/PageHeader";

const SalesNotificationsPage = () => {
    const { notifications, loading } = useNotifications();
    const [filter, setFilter] = useState("All");

    const getIcon = (type) => {
        switch (type) {
            case 'DEAL_APPROVED': return <span className="text-green-500 text-xl">✅</span>;
            case 'DEAL_REJECTED': return <span className="text-red-500 text-xl">❌</span>;
            case 'INCENTIVE': return <span className="text-yellow-500 text-xl">💰</span>;
            default: return <span className="text-blue-500 text-xl">ℹ️</span>;
        }
    };

    const filtered = notifications.filter(n => {
        if (filter === "All") return true;
        if (filter === "Unread") return !n.isRead;
        if (filter === "Critical") return n.type === 'DEAL_REJECTED';
        return true;
    });

    const grouped = filtered.reduce((acc, n) => {
        const d = new Date(n.timestamp);
        const today = new Date();
        let key = "Older";
        if (d.toDateString() === today.toDateString()) key = "Today";
        else if (d.getDate() === today.getDate() - 1 && d.getMonth() === today.getMonth()) key = "Yesterday";

        if (!acc[key]) acc[key] = [];
        acc[key].push(n);
        return acc;
    }, {});

    const groupOrder = ["Today", "Yesterday", "Older"];

    return (
        <SalesLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <PageHeader
                    heading="Activity & Updates"
                    subtitle="Stay informed about approvals, incentives, and policy changes."
                    actions={
                        <div className="flex items-center gap-2 p-1 bg-surface-2 rounded-lg border border-border-subtle">
                            <button onClick={() => setFilter('All')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'All' ? "bg-primary-500 text-white shadow-sm" : "text-text-secondary hover:text-text-primary hover:bg-surface-3"}`}>All</button>
                            <button onClick={() => setFilter('Unread')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'Unread' ? "bg-primary-500 text-white shadow-sm" : "text-text-secondary hover:text-text-primary hover:bg-surface-3"}`}>Unread</button>
                            <button onClick={() => setFilter('Critical')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'Critical' ? "bg-primary-500 text-white shadow-sm" : "text-text-secondary hover:text-text-primary hover:bg-surface-3"}`}>Critical</button>
                        </div>
                    }
                />

                <div className="card-modern p-0 overflow-hidden min-h-[400px] flex flex-col">
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center text-text-secondary">Loading...</div>
                    ) : filtered.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-text-muted gap-2">
                            <span className="text-4xl opacity-50">📭</span>
                            <p>No notifications found.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border-subtle">
                            {groupOrder.map(group => grouped[group] && (
                                <div key={group}>
                                    <div className="bg-surface-2/95 backdrop-blur-sm px-4 py-2 text-xs font-bold uppercase tracking-widest text-text-muted sticky top-0 z-10 border-b border-border-subtle">
                                        {group}
                                    </div>
                                    {grouped[group].map(n => (
                                        <div key={n.id} className={`p-4 hover:bg-surface-2 transition-colors flex gap-4 ${!n.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                                            <div className="mt-1">{getIcon(n.type)}</div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className={`text-sm font-semibold ${!n.isRead ? 'text-text-primary' : 'text-text-secondary'}`}>{n.title}</h4>
                                                    <span className="text-[10px] text-text-muted">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <p className="text-sm text-text-muted mt-0.5">{n.message}</p>
                                                {!n.isRead && (
                                                    <button className="text-[10px] text-primary-500 hover:text-primary-600 font-medium hover:underline mt-2">Mark as Read</button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </SalesLayout>
    );
};

export default SalesNotificationsPage;
