import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase1/firebase.init";

export const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL;

async function exchangeJwt(firebaseUser) {
  const firebaseToken = await firebaseUser.getIdToken();

  const jwtRes = await fetch(`${API}/jwt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: firebaseToken }),
  });

  if (!jwtRes.ok) return false;

  const data = await jwtRes.json();
  if (data?.token) {
    localStorage.setItem("access-token", data.token);
    return true;
  }

  localStorage.removeItem("access-token");
  return false;
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jwtReady, setJwtReady] = useState(false);

  const createUser = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const signIn = async (email, password) => {
    setLoading(true);
    setJwtReady(false);

    const res = await signInWithEmailAndPassword(auth, email, password);

    try {
      const ok = await exchangeJwt(res.user);
      setJwtReady(ok);
    } catch {
      localStorage.removeItem("access-token");
      setJwtReady(false);
    } finally {
      setLoading(false);
    }

    return res;
  };

  const updateUserProfile = (name, photoURL) =>
    updateProfile(auth.currentUser, { displayName: name, photoURL });

  const logOut = async () => {
    localStorage.removeItem("access-token");
    setJwtReady(false);
    setUser(null);
    return signOut(auth);
  };

  useEffect(() => {
    let alive = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!alive) return;

      setLoading(true);
      setUser(currentUser);
      setJwtReady(false);

      try {
        if (currentUser?.email) {
          const ok = await exchangeJwt(currentUser);
          if (!alive) return;
          setJwtReady(ok);
        } else {
          localStorage.removeItem("access-token");
          if (!alive) return;
          setJwtReady(false);
        }
      } catch {
        localStorage.removeItem("access-token");
        if (!alive) return;
        setJwtReady(false);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    });

    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, jwtReady, createUser, signIn, updateUserProfile, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
