import { useEffect, useState } from "react";
import axiosSecure from "../api/axiosSecure";
import useAuth from "./useAuth";

export default function useUserRole() {
  const { user, loading: authLoading } = useAuth();

  const [dbUser, setDbUser] = useState(null);
  const [role, setRole] = useState("");
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    let retryTimer = null;

    async function loadRole() {
      if (authLoading) return;

      if (!user?.email) {
        if (!alive) return;
        setDbUser(null);
        setRole("");
        setRoleLoading(false);
        return;
      }

      const token = localStorage.getItem("access-token");

      // ✅ token sometimes not ready yet (onAuthStateChanged timing)
      if (!token) {
        retryTimer = setTimeout(loadRole, 400);
        return;
      }

      try {
        setRoleLoading(true);
        const { data } = await axiosSecure.get("/users/me");

        if (!alive) return;

        setDbUser(data || null);
        setRole(data?.role || "donor");
      } catch (e) {
        console.log("useUserRole /users/me failed:", e?.response?.data || e?.message || e);

        if (!alive) return;
        setDbUser(null);
        setRole("");
      } finally {
        if (!alive) return;
        setRoleLoading(false);
      }
    }

    loadRole();

    return () => {
      alive = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [user?.email, authLoading]);

  return { dbUser, role, roleLoading };
}
