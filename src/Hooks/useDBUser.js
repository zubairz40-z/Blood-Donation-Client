import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { usersApi } from "../api/users.api";

const useDBUser = () => {
  const { user, loading: authLoading } = useAuth();

  const [dbUser, setDbUser] = useState(null);
  const [dbUserLoading, setDbUserLoading] = useState(true);
  const [dbUserError, setDbUserError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const run = async () => {
      if (authLoading) return;

      if (!user?.email) {
        setDbUser(null);
        setDbUserLoading(false);
        setDbUserError(null);
        return;
      }

      // ✅ IMPORTANT: wait for token to exist
      const token = localStorage.getItem("access-token");
      if (!token) {
        setDbUserLoading(true);
        return;
      }

      setDbUserLoading(true);
      setDbUserError(null);

      try {
        const res = await usersApi.getMe();
        if (!ignore) setDbUser(res);
      } catch (e) {
        if (!ignore) {
          setDbUser(null);
          setDbUserError(e);
        }
      } finally {
        if (!ignore) setDbUserLoading(false);
      }
    };

    run();
    return () => {
      ignore = true;
    };
  }, [user?.email, authLoading]);

  return { dbUser, dbUserLoading, dbUserError };
};

export default useDBUser;
