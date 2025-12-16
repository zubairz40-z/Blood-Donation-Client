import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

// ✅ import directly from firebase.init.js (no wrapper file needed)
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

  // ✅ remove token on logout
  const logOut = async () => {
    localStorage.removeItem("access-token");
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      // ✅ if logged in, create server JWT and save it
      if (currentUser?.email) {
        try {
          const firebaseToken = await currentUser.getIdToken();

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
        // ✅ if logged out, remove token
        localStorage.removeItem("access-token");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    updateUserProfile,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
