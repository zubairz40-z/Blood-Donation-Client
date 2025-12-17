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

  if (!jwtRes.ok) {
    throw new Error("JWT exchange failed");
  }

  const data = await jwtRes.json();
  if (data?.token) localStorage.setItem("access-token", data.token);
  else localStorage.removeItem("access-token");
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const signIn = async (email, password) => {
    setLoading(true);
    const res = await signInWithEmailAndPassword(auth, email, password);

    try {
      await exchangeJwt(res.user);
    } catch (e) {
      console.log("JWT exchange error:", e?.message || e);
      localStorage.removeItem("access-token");
    } finally {
      setLoading(false);
    }

    return res;
  };

  const updateUserProfile = (name, photoURL) =>
    updateProfile(auth.currentUser, { displayName: name, photoURL });

  const logOut = async () => {
    localStorage.removeItem("access-token");
    setUser(null);
    return signOut(auth);
  };

  useEffect(() => {
    let alive = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!alive) return;

      setLoading(true);
      setUser(currentUser);

      try {
        if (currentUser?.email) {
          await exchangeJwt(currentUser);
        } else {
          localStorage.removeItem("access-token");
        }
      } catch (e) {
        console.log("JWT store error:", e?.message || e);
        localStorage.removeItem("access-token");
      } finally {
        if (alive) setLoading(false);
      }
    });

    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, createUser, signIn, updateUserProfile, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
