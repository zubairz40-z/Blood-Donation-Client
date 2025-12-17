import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../Hooks/useAuth";
import axiosPublic from "../api/axiosPublic";
import { toast } from "react-hot-toast";

import LoginImage from "../assets/Blood donation-pana.png";
import Googleicon from "../assets/google.png";
import Logo from "../Components/Logo/Logo";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    const t = toast.loading("Logging in...");

    try {
      setSubmitting(true);

      // 1) Firebase login
      const result = await signIn(email, password);
      const fbUser = result.user;

      // 2) Firebase ID token
      const firebaseToken = await fbUser.getIdToken(true);

      // 3) Exchange Firebase token → backend JWT
      const jwtRes = await axiosPublic.post("/jwt", { token: firebaseToken });
      if (!jwtRes?.data?.token) throw new Error("JWT failed");

      // 4) Store backend JWT
      localStorage.setItem("access-token", jwtRes.data.token);

      // 5) Save/Update user in MongoDB
      await axiosPublic.post("/users", {
        name: fbUser.displayName || "User",
        email: fbUser.email,
        avatar: fbUser.photoURL || "",
      });

      toast.success("Login successful ✅", { id: t });
      form.reset();
      navigate(from, { replace: true });
    } catch (err) {
      console.log("Login error:", err?.response?.data || err?.message || err);
      toast.error(err?.response?.data?.message || "Invalid email or password", { id: t });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center py-10">
      <div className="max-w-7xl mx-auto w-full px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch overflow-hidden rounded-3xl border border-base-200 bg-base-100 shadow-xl">
          <div className="relative">
            <div className="hidden lg:block absolute top-0 right-0 h-full w-px bg-base-200" />

            <div className="h-full flex items-center justify-center lg:justify-start px-6 py-10 sm:px-10">
              <div className="w-full max-w-md">
                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-secondary">Welcome back</h2>
                  <p className="text-sm text-base-content/70">
                    Login to continue donating and saving lives.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>

                    <label className="input input-bordered flex items-center gap-2 rounded-2xl focus-within:outline-none focus-within:ring-2 focus-within:ring-secondary/30">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 opacity-60" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 6h16v12H4z" />
                        <path d="M4 8l8 5 8-5" />
                      </svg>

                      <input name="email" type="email" className="grow" placeholder="you@example.com" required />
                    </label>
                  </div>

                  <div className="form-control">
                    <div className="flex items-center justify-between">
                      <label className="label p-0">
                        <span className="label-text">Password</span>
                      </label>

                      <button
                        type="button"
                        className="text-xs link link-hover text-base-content/70"
                        onClick={() => toast("Reset password not required for evaluation 🙂")}
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="join w-full mt-2">
                      <label className="join-item input input-bordered flex items-center gap-2 w-full rounded-l-2xl focus-within:outline-none focus-within:ring-2 focus-within:ring-secondary/30">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 opacity-60" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 11V8a5 5 0 0 1 10 0v3" />
                          <path d="M6 11h12v10H6z" />
                        </svg>

                        <input
                          name="password"
                          type={showPass ? "text" : "password"}
                          className="grow"
                          placeholder="••••••••"
                          required
                          minLength={6}
                        />
                      </label>

                      <button
                        type="button"
                        className="btn btn-outline join-item rounded-r-2xl min-w-[92px]"
                        onClick={() => setShowPass((s) => !s)}
                      >
                        {showPass ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <button
                    className="btn w-full rounded-2xl bg-secondary text-secondary-content hover:bg-secondary/90 border-0"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? "Logging in..." : "Login"}
                  </button>

                  <p className="text-sm text-center text-base-content/70">
                    New here?{" "}
                    <Link to="/register" className="link link-hover font-semibold text-secondary">
                      Create an account
                    </Link>
                  </p>
                </form>

                <div className="divider my-6">OR</div>

                <button
                  type="button"
                  className="btn btn-outline w-full rounded-2xl border-secondary/30 hover:border-secondary flex items-center justify-center gap-2"
                  onClick={() => toast("Social login not required")}
                >
                  <span>Continue with Google</span>
                  <img src={Googleicon} alt="Google" className="w-5 h-5" />
                </button>

                <p className="mt-4 text-xs text-center text-base-content/60">
                  By continuing, you agree to our Terms &amp; Privacy Policy.
                </p>
              </div>
            </div>
          </div>

          <div className="relative bg-secondary/10 overflow-hidden">
            <div className="pointer-events-none absolute -top-20 -left-20 h-60 w-60 rounded-full bg-secondary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-secondary/20 blur-3xl" />

            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 py-10 sm:px-10 text-center">
              <h3 className="text-2xl sm:text-xl font-bold text-secondary">
                Welcome to <Logo />
              </h3>
              <p className="text-sm text-base-content/70">Login to manage donations and requests.</p>

              <img src={LoginImage} alt="Blood donation illustration" className="mt-6 w-full max-w-xs sm:max-w-sm lg:max-w-md h-auto drop-shadow" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
