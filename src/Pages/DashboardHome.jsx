import useAuth from "../Hooks/useAuth";
import React from "react";


const DashboardHome = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        Welcome, {user?.displayName || "User"} 👋
      </h1>
      <p className="opacity-70">This is your dashboard home page.</p>
    </div>
  );
};

export default DashboardHome;
