import SalesLayout from "../../layouts/SalesLayout";
import { useState, useEffect } from "react";
import api from "../../api";
import PageHeader from "../../components/common/PageHeader";

const NotificationManagement = () => {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [targetRole, setTargetRole] = useState("ALL");
    const [targetUserId, setTargetUserId] = useState("");
    const [notificationType, setNotificationType] = useState("ANNOUNCEMENT");
    const [users, setUsers] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        // Fetch users for the dropdown
        const fetchUsers = async () => {
            try {
                const response = await api.get("/api/users");
                setUsers(response.data);
            } catch (err) {
                console.error("Failed to fetch users", err);
            }
        };
        fetchUsers();
    }, []);

    const handleBroadcast = async (e) => {
        e.preventDefault();
        if (!title || !message) {
            alert("Please fill in all fields");
            return;
        }
        if (targetRole === 'USER' && !targetUserId) {
            alert("Please select a user");
            return;
        }

        setIsSending(true);
        try {
            const prefixedTitle = title.startsWith('ADMIN:') ? title : `ADMIN: ${title}`;
            await api.post("/notifications/broadcast", {
                title: prefixedTitle,
                message,
                targetRole,
                targetUserId: targetRole === 'USER' ? parseInt(targetUserId) : null,
                type: notificationType
            });
            setSuccessMsg("Notification sent successfully!");
            setTitle("");
            setMessage("");
            setTargetUserId("");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err) {
            console.error("Failed to send notification", err);
            alert("Failed to send notification");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <SalesLayout>
            <div className="max-w-2xl mx-auto">
                <PageHeader
                    heading="Communication Center"
                    subtitle="Configure and dispatch system-wide alerts, notifications, and directives."
                />

                <div className="card-modern p-8">
                    <form onSubmit={handleBroadcast} className="space-y-6">

                        {/* Notification Type */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Notification Type</label>
                            <select
                                className="w-full px-4 py-2 bg-surface-1 border border-border-subtle rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                value={notificationType}
                                onChange={(e) => setNotificationType(e.target.value)}
                            >
                                <option value="ANNOUNCEMENT">Announcement</option>
                                <option value="POLICY_UPDATE">Policy Update</option>
                                <option value="INCENTIVE">Incentive Update</option>
                                <option value="MONTHLY_TARGET">Monthly Target</option>
                                <option value="SYSTEM_ALERT">System Alert</option>
                            </select>
                        </div>

                        {/* Target Audience */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Target Audience</label>
                            <div className="grid grid-cols-4 gap-4 mb-4">
                                {['ALL', 'SALES', 'ADMIN', 'USER'].map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setTargetRole(role)}
                                        className={`py-2 px-2 rounded-lg text-sm font-medium transition-all ${targetRole === role
                                            ? 'bg-primary-600 text-white shadow-md'
                                            : 'bg-surface-2 text-text-secondary hover:bg-surface-3'
                                            }`}
                                    >
                                        {role === 'ALL' ? 'Everyone' : role === 'SALES' ? 'Sales Team' : role === 'ADMIN' ? 'Admins' : 'Specific User'}
                                    </button>
                                ))}
                            </div>

                            {/* Specific User Selector */}
                            {targetRole === 'USER' && (
                                <div className="animate-fade-in-down">
                                    <label className="block text-xs font-medium text-text-muted mb-1">Select User</label>
                                    <select
                                        className="w-full px-4 py-2 bg-surface-1 border border-border-subtle rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        value={targetUserId}
                                        onChange={(e) => setTargetUserId(e.target.value)}
                                    >
                                        <option value="">-- Choose User --</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Subject / Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-surface-1 border border-border-subtle rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                placeholder="e.g., New Incentive Policy Update"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Message Content</label>
                            <textarea
                                rows="5"
                                className="w-full px-4 py-2 bg-surface-1 border border-border-subtle rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                                placeholder="Write your notification here..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSending}
                            className={`w-full py-3 rounded-lg text-white font-medium shadow-lg transition-all ${isSending
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5'
                                }`}
                        >
                            {isSending ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </span>
                            ) : (
                                "Send Notification"
                            )}
                        </button>
                    </form>

                    {successMsg && (
                        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center animate-fade-in-up">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            {successMsg}
                        </div>
                    )}
                </div>
            </div>
        </SalesLayout>
    );
};

export default NotificationManagement;
