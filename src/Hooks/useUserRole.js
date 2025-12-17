import { useEffect, useState } from "react";
import axiosSecure from "../api/axiosSecure";
import useAuth from "./useAuth";

export default function useUserRole() {
  const { user, loading: authLoading, jwtReady } = useAuth();

  const [dbUser, setDbUser] = useState(null);
  const [role, setRole] = useState("");
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function run() {
      if (authLoading) return;

      if (!user?.email) {
        if (!alive) return;
        setDbUser(null);
        setRole("");
        setRoleLoading(false);
        return;
      }

      // ✅ keep loading until jwt is ready
      if (!jwtReady) {
        if (!alive) return;
        setRoleLoading(true);
        return;
      }

      try {
        setRoleLoading(true);
        const { data } = await axiosSecure.get("/users/me");
        if (!alive) return;

        setDbUser(data || null);
        setRole(data?.role || "donor");
      } catch (e) {
        if (!alive) return;
        setDbUser(null);
        setRole("");
      } finally {
        if (!alive) return;
        setRoleLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [user?.email, authLoading, jwtReady]);

  return { dbUser, role, roleLoading };
}
