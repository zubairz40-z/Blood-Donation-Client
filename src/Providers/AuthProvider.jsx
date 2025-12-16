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

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const signIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const updateUserProfile = (name, photoURL) =>
    updateProfile(auth.currentUser, { displayName: name, photoURL });

  const logOut = async () => {
    localStorage.removeItem("access-token");
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          const firebaseToken = await currentUser.getIdToken(true);

          const res = await fetch(`${import.meta.env.VITE_API_URL}/jwt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: firebaseToken }),
          });

          const data = await res.json();

          if (res.ok && data?.token) {
            localStorage.setItem("access-token", data.token);
          } else {
            localStorage.removeItem("access-token");
          }
        } catch (err) {
          console.log("JWT store error:", err?.message || err);
          localStorage.removeItem("access-token");
        }
      } else {
        localStorage.removeItem("access-token");
      }

      setLoading(false);
    });

    return () => unsubscribe();
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
