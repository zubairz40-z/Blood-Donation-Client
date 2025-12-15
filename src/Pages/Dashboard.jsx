import React from "react";
import useAuth from "../Hooks/useAuth";

const Dashboard = () => {
  const { user, logOut } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p className="mt-3">
        Welcome: <b>{user?.email}</b>
      </p>

      <button className="btn btn-error mt-5" onClick={logOut}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
