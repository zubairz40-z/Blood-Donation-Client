import { Navigate, useLocation } from "react-router";
import useUserRole from "../Hooks/useUserRole";
import useAuth from "../Hooks/useAuth";

const VolunteerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== "admin" && role !== "volunteer") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default VolunteerRoute;
