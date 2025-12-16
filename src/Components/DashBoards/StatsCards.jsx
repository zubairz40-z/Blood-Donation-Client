import React from "react";
import { FiUsers, FiDroplet, FiDollarSign } from "react-icons/fi";

const StatsCards = ({ stats }) => {
  const items = [
    { title: "Total Users", value: stats?.totalUsers ?? 0, icon: <FiUsers size={20} /> },
    { title: "Total Funding", value: stats?.totalFunding ?? 0, icon: <FiDollarSign size={20} /> },
    { title: "Total Requests", value: stats?.totalRequests ?? 0, icon: <FiDroplet size={20} /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((it) => (
        <div key={it.title} className="rounded-2xl bg-base-100/80 border border-base-300/60 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div className="text-secondary">{it.icon}</div>
            <span className="badge badge-secondary badge-outline">Stats</span>
          </div>
          <p className="mt-3 text-sm opacity-70">{it.title}</p>
          <p className="text-2xl font-bold mt-1">{it.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
