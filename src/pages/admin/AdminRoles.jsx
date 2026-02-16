import { useState, useEffect } from "react";
import api from "../../api";
import AdminLayout from "../../layouts/AdminLayout";

const AdminRoles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeRole, setActiveRole] = useState(null);

    // Resources to manage
    const resources = [
        { key: "deals", label: "Deal Approvals" },
        { key: "users", label: "User Management" },
        { key: "payouts", label: "Incentive Payouts" },
        { key: "reports", label: "Analytics & Reports" },
        { key: "settings", label: "System Settings" }
    ];

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const res = await api.get("/roles");
            const parsedRoles = res.data.map(r => ({
                ...r,
                permissions: JSON.parse(r.permissionsJson || "{}")
            }));
            setRoles(parsedRoles);
            if (parsedRoles.length > 0) setActiveRole(parsedRoles[0]);
        } catch (error) {
            console.error("Failed to fetch roles", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (resourceKey, type) => {
        // Type: R (Read), W (Write), RW (Both)
        if (!activeRole) return;

        const currentPerm = activeRole.permissions[resourceKey] || "";
        let newPerm = currentPerm;

        if (type === "R") {
            // Toggle Read. If was W, make RW. If was RW, make W.
            if (currentPerm.includes("R")) newPerm = currentPerm.replace("R", "");
            else newPerm = currentPerm + "R";
        } else if (type === "W") {
            if (currentPerm.includes("W")) newPerm = currentPerm.replace("W", "");
            else newPerm = currentPerm + "W";
        }

        // Cleanup: remove standard chars and re-sort? Basic string manip for now is fine provided logic holds.
        // Better logic: switch between "", "R", "W", "RW"

        const updatedRole = {
            ...activeRole,
            permissions: { ...activeRole.permissions, [resourceKey]: newPerm }
        };

        setActiveRole(updatedRole);

        // Update local list
        setRoles(roles.map(r => r.id === updatedRole.id ? updatedRole : r));
    };

    const saveChanges = async () => {
        try {
            const payload = {
                ...activeRole,
                permissionsJson: JSON.stringify(activeRole.permissions)
            };
            await api.post("/roles", payload);
            alert("Permissions saved successfully!");
        } catch (error) {
            alert("Failed to save permissions");
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in duration-500">
                <div>
                    <h1 className="section-title">Roles & Access Control</h1>
                    <p className="section-subtitle">Manage user permissions and security policies</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[500px]">
                    {/* Role Sidebar */}
                    <div className="col-span-1 space-y-2">
                        <div className="bg-surface-2 p-4 rounded-xl border border-border-subtle h-full">
                            <h3 className="font-bold text-sm uppercase text-text-muted mb-4 tracking-wider">Roles</h3>
                            <div className="space-y-2">
                                {roles.map(role => (
                                    <button
                                        key={role.id}
                                        onClick={() => setActiveRole(role)}
                                        className={`w-full text-left p-3 rounded-lg transition-all flex justify-between items-center ${activeRole?.id === role.id ? 'bg-primary-500 text-white shadow-md' : 'text-text-secondary hover:bg-surface-3'}`}
                                    >
                                        <span className="font-semibold">{role.roleName}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full bg-white/20`}>{Object.keys(role.permissions).length} Rules</span>
                                    </button>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-2 border-2 border-dashed border-border-subtle text-text-muted rounded-lg hover:border-primary-500 hover:text-primary-500 transition-colors text-sm font-medium">
                                + Add New Role
                            </button>
                        </div>
                    </div>

                    {/* Matrix */}
                    <div className="col-span-3">
                        {activeRole ? (
                            <div className="card-modern">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <span className="bg-primary-100 text-primary-700 p-1 rounded-md text-sm">Role</span>
                                        {activeRole.roleName}
                                    </h2>
                                    <button onClick={saveChanges} className="btn-primary">Save Changes</button>
                                </div>

                                <div className="overflow-hidden rounded-xl border border-border-subtle">
                                    <table className="w-full text-left">
                                        <thead className="bg-surface-2">
                                            <tr>
                                                <th className="p-4 text-sm font-bold text-text-muted uppercase">Resource Module</th>
                                                <th className="p-4 text-center text-sm font-bold text-text-muted uppercase">Read Access</th>
                                                <th className="p-4 text-center text-sm font-bold text-text-muted uppercase">Write/Edit</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border-subtle">
                                            {resources.map(res => {
                                                const perm = activeRole.permissions[res.key] || "";
                                                return (
                                                    <tr key={res.key} className="hover:bg-surface-2 transition-colors">
                                                        <td className="p-4 font-medium">{res.label}</td>
                                                        <td className="p-4 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={perm.includes("R")}
                                                                onChange={() => handleToggle(res.key, "R")}
                                                                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                                                            />
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={perm.includes("W")}
                                                                onChange={() => handleToggle(res.key, "W")}
                                                                className="w-5 h-5 rounded border-gray-300 text-red-500 focus:ring-red-500 cursor-pointer"
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg text-sm text-text-secondary">
                                    <p>ℹ️ <strong>Tip:</strong> Changes affect all users assigned to this role immediately. Write access typically implies deletion rights.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-text-muted">Loading roles...</div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminRoles;
