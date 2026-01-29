import { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import PageHeader from "../../components/common/PageHeader";
import { useNavigate } from "react-router-dom";

const AdminDealCreate = () => {
    const navigate = useNavigate();
    const [salesUsers, setSalesUsers] = useState([]);
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        dealName: "",
        organizationName: "",
        amount: "",
        assignedUserId: "",
        expectedCloseDate: "",
        priority: "MEDIUM",
        policyId: "",
        dealNotes: "",
        clientName: "",
        industry: "Financial Services",
        region: "APAC",
        currency: "₹",
        dealType: "NEW",
        createdBy: localStorage.getItem("userId") || "1"
    });

    useEffect(() => {
        fetchSalesUsers();
        fetchPolicies();
    }, []);

    const fetchSalesUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/users");
            console.log("All users:", response.data); // Debug
            const sales = response.data.filter(u => u.role === "SALES" && u.accountStatus === "ACTIVE");
            console.log("Filtered sales users:", sales); // Debug
            setSalesUsers(sales);

            if (sales.length === 0) {
                console.warn("No active sales users found!");
            }
        } catch (error) {
            console.error("Error fetching sales users:", error);
            alert("⚠️ Could not load sales executives. Please refresh and try again.");
        }
    };

    const fetchPolicies = async () => {
        try {
            // Fetch INCENTIVE policies, not company policies
            const response = await axios.get("http://localhost:8080/policies?type=INCENTIVE");
            console.log("Incentive Policies:", response.data); // Debug
            const activePolicies = response.data.filter(p => p.active);
            setPolicies(activePolicies);
            console.log("Active incentive policies:", activePolicies.length);
        } catch (error) {
            console.error("Error fetching incentive policies:", error);
            // Policies are optional, so don't alert for this
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("http://localhost:8080/admin/deals", formData);
            alert("✅ Deal created and assigned successfully!");
            navigate("/admin/deals");
        } catch (error) {
            console.error("Error creating deal:", error);
            let errorMessage = "Unknown error";
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (typeof error.response.data === 'object') {
                    errorMessage = error.response.data.message || error.response.data.error || JSON.stringify(error.response.data);
                }
            } else {
                errorMessage = error.message;
            }
            alert("❌ Failed to create deal: " + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <PageHeader
                heading="Deal Origination"
                subtitle="Initiate and configure new commercial opportunities for approval workflows."
            />

            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="card-modern p-8 space-y-6">
                    <div className="border-b border-border-subtle pb-2 mb-4">
                        <h3 className="text-lg font-bold text-text-primary">1. Deal Details</h3>
                    </div>
                    {/* Deal Name */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Deal Name *
                        </label>
                        <input
                            type="text"
                            name="dealName"
                            value={formData.dealName}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Flipkart Q1 Expansion"
                            className="input-field"
                        />
                    </div>

                    {/* Organization Name */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Organization Name *
                        </label>
                        <input
                            type="text"
                            name="organizationName"
                            value={formData.organizationName}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Flipkart"
                            className="input-field"
                        />
                    </div>

                    {/* Client Name */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Client Contact Name *
                        </label>
                        <input
                            type="text"
                            name="clientName"
                            value={formData.clientName}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Sachin Bansal"
                            className="input-field"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Industry */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Industry *
                            </label>
                            <select
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                required
                                className="input-field"
                            >
                                <option value="Financial Services">Financial Services</option>
                                <option value="Technology">Technology</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Retail">Retail</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Region */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Region *
                            </label>
                            <select
                                name="region"
                                value={formData.region}
                                onChange={handleChange}
                                required
                                className="input-field"
                            >
                                <option value="APAC">APAC</option>
                                <option value="EMEA">EMEA</option>
                                <option value="NORTH_AMERICA">North America</option>
                                <option value="LATAM">LATAM</option>
                            </select>
                        </div>

                        {/* Currency */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Currency *
                            </label>
                            <select
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                required
                                className="input-field"
                            >
                                <option value="₹">INR (₹)</option>
                                <option value="$">USD ($)</option>
                                <option value="€">EUR (€)</option>
                                <option value="£">GBP (£)</option>
                            </select>
                        </div>
                    </div>

                    {/* Deal Value */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Deal Value (₹) *
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            min="1"
                            placeholder="e.g., 500000"
                            className="input-field"
                        />
                    </div>

                    {/* Deal Type */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Deal Type *
                        </label>
                        <select
                            name="dealType"
                            value={formData.dealType}
                            onChange={handleChange}
                            required
                            className="input-field"
                        >
                            <option value="NEW">New Business</option>
                            <option value="RENEWAL">Renewal</option>
                            <option value="UPSELL">Upsell</option>
                            <option value="CROSS_SELL">Cross-sell</option>
                        </select>
                        <p className="mt-2 text-sm text-text-muted">
                            💡 Deal type affects incentive calculation. New deals may have different rates than renewals.
                        </p>
                    </div>

                    {/* Assign to Sales Executive */}
                    <div className="pt-4 border-t border-border-subtle mt-6">
                        <div className="border-b border-border-subtle pb-2 mb-4">
                            <h3 className="text-lg font-bold text-text-primary">2. Assignment & Priority</h3>
                        </div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Assign to Sales Executive *
                            {salesUsers.length > 0 && (
                                <span className="ml-2 text-xs text-text-muted">
                                    ({salesUsers.length} available)
                                </span>
                            )}
                        </label>
                        <select
                            name="assignedUserId"
                            value={formData.assignedUserId}
                            onChange={handleChange}
                            required
                            className="input-field"
                        >
                            <option value="">
                                {salesUsers.length === 0
                                    ? "Loading sales executives..."
                                    : "-- Select Sales Executive --"}
                            </option>
                            {salesUsers.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                        {salesUsers.length === 0 && (
                            <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                                ⚠️ No active sales executives found. Please create users with SALES role first.
                            </p>
                        )}
                    </div>

                    {/* Expected Close Date */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Expected Close Date *
                        </label>
                        <input
                            type="date"
                            name="expectedCloseDate"
                            value={formData.expectedCloseDate}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Priority *
                        </label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            required
                            className="input-field"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>

                    {/* Incentive Policy */}
                    <div className="pt-4 border-t border-border-subtle mt-6">
                        <div className="border-b border-border-subtle pb-2 mb-4">
                            <h3 className="text-lg font-bold text-text-primary">3. Incentive Rules</h3>
                        </div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Incentive Policy
                            {policies.length > 0 && (
                                <span className="ml-2 text-xs text-text-muted">
                                    ({policies.length} active policies)
                                </span>
                            )}
                        </label>
                        <select
                            name="policyId"
                            value={formData.policyId}
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value="">
                                {policies.length === 0
                                    ? "No policies available (Optional)"
                                    : "-- Select Policy (Optional) --"}
                            </option>
                            {policies.map(policy => (
                                <option key={policy.id} value={policy.id}>
                                    {policy.title}
                                </option>
                            ))}
                        </select>
                        <p className="mt-2 text-sm text-text-muted">
                            💡 Policy determines the incentive calculation rules for this deal. If not selected, default rates will apply.
                        </p>
                    </div>

                    {/* Deal Notes */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Internal Notes (Optional)
                        </label>
                        <textarea
                            name="dealNotes"
                            value={formData.dealNotes}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Add any internal notes or comments..."
                            className="input-field"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1"
                        >
                            {loading ? "Creating..." : "✅ Create & Assign Deal"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/admin/deals")}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AdminDealCreate;
