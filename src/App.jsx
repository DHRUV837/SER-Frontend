import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AcceptInvite from "./auth/AcceptInvite"; // New
import RequireAuth from "./auth/RequireAuth";
import LandingPage from "./pages/LandingPage";
import AdminOnboarding from "./pages/admin/AdminOnboarding"; // New
// ... existing imports

// ... inside Routes
import SalesDashboard from "./pages/sales/SalesDashboard";
import DealHistoryPage from "./pages/sales/DealHistoryPage";
import IncentiveSimulator from "./pages/IncentiveSimulator";
import SalesPolicies from "./pages/sales/SalesPolicies";
import SalesPayouts from "./pages/sales/SalesPayouts";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DealApproval from "./pages/admin/DealApproval";
import UserManagement from "./pages/admin/UserManagement";
import IncentivePolicyPage from "./pages/sales/IncentivePolicyPage";
import ProfilePage from "./pages/sales/ProfilePage";
import NotificationManagement from "./pages/admin/NotificationManagement";
import AdminPerformance from "./pages/admin/AdminPerformance";
import PerformanceDashboard from "./pages/admin/PerformanceDashboard";
import AdminTargets from "./pages/admin/AdminTargets";
import AuditLogs from "./pages/admin/AuditLogs";
import PolicySimulation from "./pages/admin/PolicySimulation";
import SalesPerformancePage from "./pages/sales/SalesPerformancePage";
import SalesTargetsPage from "./pages/sales/SalesTargetsPage";
import SalesNotificationsPage from "./pages/sales/SalesNotificationsPage";
import SalesLeaderboardPage from "./pages/sales/SalesLeaderboardPage";
import SalesReportsPage from "./pages/sales/SalesReportsPage";
import AdminPlaceholder from "./pages/admin/AdminPlaceholder";
import AdminPayouts from "./pages/admin/AdminPayouts";
import AdminRoles from "./pages/admin/AdminRoles";
import AdminAlerts from "./pages/admin/AdminAlerts";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminPolicy from "./pages/admin/AdminPolicy";
import AdminDealCreate from "./pages/admin/AdminDealCreate";
import AdminDealManagement from "./pages/admin/AdminDealManagement";
import AdminDealDetailPage from "./pages/admin/AdminDealDetailPage";
import AdminIncentivePolicy from "./pages/admin/AdminIncentivePolicy";
import SalesIncentivePolicyView from "./pages/sales/SalesIncentivePolicyView";
import MyDealsPage from "./pages/sales/MyDealsPage";
import DealDetailPage from "./pages/sales/DealDetailPage";
import { useAuth } from "./context/AuthContext";

import OnboardingWizard from "./components/onboarding/OnboardingWizard";
import { OnboardingProvider } from "./context/OnboardingContext";
import MissionWidget from "./components/onboarding/MissionWidget";
import WelcomeModal from "./components/onboarding/WelcomeModal"; // New
import SetupPage from "./pages/onboarding/SetupPage";
import OnboardingWelcomePage from "./pages/onboarding/OnboardingWelcomePage";

// Simple Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 text-red-900 min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
          <p className="mb-4">The application crashed. Please share this error with support:</p>
          <pre className="bg-red-100 p-4 rounded text-sm overflow-auto max-w-full">
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button
            onClick={() => window.location.href = "/"}
            className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Return Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  const { auth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname && location.pathname !== "/login" && location.pathname !== "/" && location.pathname !== "/unauthorized") {
      localStorage.setItem("lastVisited", location.pathname);
    }
  }, [location]);

  const getLastVisited = () => {
    return localStorage.getItem("lastVisited") || (auth.user?.role === "ADMIN" ? "/admin" : "/sales");
  };

  return (
    <ErrorBoundary>
      <OnboardingProvider>
        <Routes>
          {/* ROOT */}
          <Route
            path="/"
            element={<LandingPage />}
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/accept-invite" element={<AcceptInvite />} />

          {/* SETUP ROUTES - Activation NOT Required */}
          <Route element={<RequireAuth allowedRoles={["ADMIN", "SALES"]} requireActivation={false} />}>
            <Route path="/onboarding/welcome" element={<OnboardingWelcomePage />} />
            <Route path="/onboarding/setup" element={<SetupPage />} />
            <Route path="/onboarding" element={<OnboardingWizard />} />
          </Route>

          {/* SETUP TASK ROUTES - Activation NOT Required (Allowed during setup) */}
          {/* ADMIN TASKS */}
          <Route element={<RequireAuth allowedRoles={["ADMIN"]} requireActivation={false} />}>
            <Route path="/admin/onboarding" element={<AdminOnboarding />} /> {/* New Lock Screen */}
            <Route path="/admin/incentive-policies" element={<AdminIncentivePolicy />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/performance" element={<PerformanceDashboard />} />
            <Route path="/admin/targets" element={<AdminTargets />} />
            {/* Allowing Deal Management for Admin Setup if needed? likely not mandatory but harmless */}
          </Route>

          {/* SALES TASKS */}
          <Route element={<RequireAuth allowedRoles={["SALES"]} requireActivation={false} />}>
            <Route path="/sales/my-deals" element={<MyDealsPage />} />
            <Route path="/sales/leaderboard" element={<SalesLeaderboardPage />} />
            {/* Creating deals might need DealDetailPage or a modal? MyDeals usually has 'Add' */}
            {/* If MyDeals has 'Add', we are good. */}
          </Route>


          {/* SHARED ROUTES (ADMIN & SALES) - Require Activation */}
          <Route element={<RequireAuth allowedRoles={["ADMIN", "SALES"]} />}>
            <Route path="/sales/policy" element={<IncentivePolicyPage />} />
            <Route path="/sales/profile" element={<ProfilePage />} />
          </Route>

          {/* ... existing routes ... */}

          {/* ADMIN ROUTES - Require Activation */}
          <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/approvals" element={<DealApproval />} />
            <Route path="/admin/notifications" element={<NotificationManagement />} />
            {/* Note: Moved /admin/performance, /admin/users, /admin/incentive-policies to Setup Group */}
            <Route path="/admin/performance/:userId" element={<AdminPerformance />} />

            {/* Deal Management */}
            <Route path="/admin/deals" element={<AdminDealManagement />} />
            <Route path="/admin/deals/:id" element={<AdminDealDetailPage />} />
            <Route path="/admin/deals/create" element={<AdminDealCreate />} />

            {/* New Enterprise Modules */}
            <Route path="/admin/payouts" element={<AdminPayouts />} />
            <Route path="/admin/roles" element={<AdminRoles />} />
            <Route path="/admin/alerts" element={<AdminAlerts />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/policy" element={<AdminPolicy />} />

            <Route path="/admin/audit-logs" element={<AuditLogs />} />
            <Route path="/admin/simulation" element={<PolicySimulation />} />
            <Route path="/admin/targets" element={<AdminTargets />} />
            <Route path="/admin/profile" element={<ProfilePage />} />
          </Route>

          {/* SALES ROUTES - Require Activation */}
          <Route element={<RequireAuth allowedRoles={["SALES"]} />}>
            <Route path="/sales" element={<SalesDashboard />} />
            {/* Note: Moved /sales/my-deals, /sales/leaderboard to Setup Group */}
            <Route path="/sales/my-deals/:id" element={<DealDetailPage />} />
            <Route path="/sales/history" element={<DealHistoryPage />} />
            <Route path="/sales/performance" element={<SalesPerformancePage />} />
            <Route path="/sales/targets" element={<SalesTargetsPage />} />
            <Route path="/sales/notifications" element={<SalesNotificationsPage />} />
            <Route path="/sales/reports" element={<SalesReportsPage />} />
            <Route path="/sales/simulator" element={<IncentiveSimulator />} />
            <Route path="/sales/policy" element={<SalesIncentivePolicyView />} />
            <Route path="/sales/policies" element={<SalesPolicies />} />
            <Route path="/sales/payouts" element={<SalesPayouts />} />
          </Route>

          <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
        {/* Hide MissionWidget during setup to avoid clutter? Or keep it? Context manages show/hide */}
        <MissionWidget />
        {auth?.user && <WelcomeModal key={auth.user.id} />}
      </OnboardingProvider>
    </ErrorBoundary>
  );
};

export default App;
