import SalesLayout from "../../layouts/SalesLayout";
import { useEffect, useState } from "react";
import api from "../../api";
import PageHeader from "../../components/common/PageHeader";
import InviteUserModal from "../../components/admin/InviteUserModal";
import { useAuth } from "../../context/AuthContext";

const UserManagement = () => {
    const { auth } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get(`/api/users?currentUserId=${auth.user?.id}`);
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch users", err);
            setLoading(false);
        }
    };

    const toggleStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === "ACTIVE" ? "DISABLED" : "ACTIVE";
        if (!window.confirm(`Are you sure you want to ${newStatus === 'DISABLED' ? 'Disable' : 'Activate'} this user?`)) return;

        try {
            await api.patch(`/api/users/${userId}/status`, { status: newStatus });
            setUsers(users.map(u => u.id === userId ? { ...u, accountStatus: newStatus } : u));
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const handleInviteSuccess = () => {
        // Optionally refresh users list or show a success message
        fetchUsers();
    };

    if (loading) return <SalesLayout>Loading Users...</SalesLayout>;

    const salesUsers = users.filter(u => u.role === "SALES");

    return (
        <SalesLayout>
            <PageHeader
                heading="User Access Management"
                subtitle="Control sales executive permissions and account status."
                actions={
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-lg text-sm font-medium">
                            Total Sales Execs: {salesUsers.length}
                        </div>
                        <button
                            onClick={() => setShowInviteModal(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            + Invite User
                        </button>
                    </div>
                }
            />

            <div className="card-modern overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface-2 border-b border-border-subtle">
                            <th className="p-4 py-3 font-medium text-text-secondary">Name</th>
                            <th className="p-4 py-3 font-medium text-text-secondary">Email</th>
                            <th className="p-4 py-3 font-medium text-text-secondary">Status</th>
                            <th className="p-4 py-3 font-medium text-text-secondary text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesUsers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-6 text-center text-text-muted">No sales users found.</td>
                            </tr>
                        ) : (
                            salesUsers.map((user) => (
                                <tr key={user.id} className="border-b border-border-subtle hover:bg-surface-2 transition-colors">
                                    <td className="p-4 font-medium text-text-primary">{user.name}</td>
                                    <td className="p-4 text-text-secondary">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold
                                            ${user.accountStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {user.accountStatus}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => toggleStatus(user.id, user.accountStatus)}
                                            className={`px-3 py-1 rounded text-sm font-medium transition-colors
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                                    : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'}`}
                                        >
                                            {user.accountStatus === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <InviteUserModal
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                onSuccess={handleInviteSuccess}
            />
        </SalesLayout>
    );
};

export default UserManagement;
