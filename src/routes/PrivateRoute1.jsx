import { Navigate, useLocation } from "react-router";
import useAuth from "../Hooks/useAuth";

const PrivateRoute1 = ({ children }) => {
  const { user, loading, jwtReady } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <span className="loading loading-spinner loading-lg" />
        <p className="opacity-70 mt-2">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (!jwtReady) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};

export default PrivateRoute1;
