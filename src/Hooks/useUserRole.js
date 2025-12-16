import { useEffect, useState } from "react";
import useAuth from "./useAuth";

const useUserRole = () => {
  const { user, loading } = useAuth();
  const [dbUser, setDbUser] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access-token");

    // if not logged in yet
    if (loading || !user?.email || !token) {
      setDbUser(null);
      setRoleLoading(false);
      return;
    }

    setRoleLoading(true);

    fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDbUser(data))
      .catch(() => setDbUser(null))
      .finally(() => setRoleLoading(false));
  }, [user?.email, loading]);

  return { dbUser, role: dbUser?.role || "donor", roleLoading };
};

export default useUserRole;
