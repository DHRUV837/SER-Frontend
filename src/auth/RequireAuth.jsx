import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireAuth = ({ allowedRoles, requireActivation = true }) => {
  const { auth } = useAuth();

  if (!auth?.user) return <Navigate to="/login" replace />;

  // Check Role
  if (allowedRoles && !allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Redirect logic removed as per user request to drop forced wizard
  // if (requireActivation && auth.user.role === 'ADMIN' && auth.user.onboardingCompleted === false) {
  //   if (!window.location.pathname.startsWith("/admin/onboarding")) {
  //     return <Navigate to="/admin/onboarding" replace />;
  //   }
  // }

  return <Outlet />;
};

export default RequireAuth;
