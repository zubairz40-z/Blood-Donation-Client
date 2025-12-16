import { useEffect, useState } from "react";
import useAuth from "./useAuth";

const useUserRole = () => {
  const { user, loading } = useAuth();

  const [dbUser, setDbUser] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access-token");

    // ✅ If firebase still loading, wait
    if (loading) {
      setRoleLoading(true);
      return;
    }

    // ✅ If not logged in, stop
    if (!user?.email || !token) {
      setDbUser(null);
      setRoleLoading(false);
      return;
    }

    let ignore = false;
    setRoleLoading(true);

    fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || "Failed to load user");
        return data;
      })
      .then((data) => {
        if (!ignore) setDbUser(data);
      })
      .catch(() => {
        if (!ignore) setDbUser(null);
      })
      .finally(() => {
        if (!ignore) setRoleLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [user?.email, loading]);

  // ✅ Only return role when roleLoading is false
  const role = dbUser?.role || null;

  return {
    dbUser,
    role,         // "admin" | "volunteer" | "donor" | null
    roleLoading,  // true/false
    isAdmin: role === "admin",
    isVolunteer: role === "volunteer",
    isDonor: role === "donor",
  };
};

export default useUserRole;
