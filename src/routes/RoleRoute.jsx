import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";

const RoleRoute = ({ allow = [], children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  // ✅ Wait until Firebase auth + DB role both finish loading
  if (loading || roleLoading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  // ✅ If not logged in, redirect to login and save current page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ If allow list is empty, treat as "any logged-in user allowed"
  if (!allow.length) {
    return children;
  }

  // ✅ Blocked users should not access dashboard pages (optional but recommended)
  // If you want this, make sure useUserRole also returns status
  // if (dbUser?.status === "blocked") return <Navigate to="/" replace />;

  // ✅ If role not allowed → go back (if possible) else dashboard
  if (!allow.includes(role)) {
    // if user came from another page, go there, else fallback
    const fallback = "/dashboard";
    return <Navigate to={location.state?.from?.pathname || fallback} replace />;
  }

  return children;
};

export default RoleRoute;
