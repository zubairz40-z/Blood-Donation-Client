import useAuth from "../Hooks/useAuth";
import React from "react";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <div className="card bg-base-200 p-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.photoURL || "https://i.ibb.co/2M7rtLk/default-avatar.png"}
            className="w-16 h-16 rounded-full"
            alt="avatar"
          />
          <div>
            <p className="font-bold">{user?.displayName || "User"}</p>
            <p className="text-sm opacity-70">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
