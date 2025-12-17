import React from "react";
import { Link, useLocation } from "react-router";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-10 grid place-items-center bg-base-200/30">
      <div className="w-full max-w-3xl overflow-hidden rounded-[2rem] border border-base-200 bg-base-100 shadow-2xl">
        {/* Top banner */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/25 via-secondary/10 to-transparent" />
          <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-secondary/20 blur-3xl" />

          <div className="relative p-8 sm:p-10">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="inline-flex items-center gap-2">
                <span className="badge badge-secondary badge-outline font-semibold">404</span>
                <span className="text-xs opacity-70">Not Found</span>
              </div>

              <div className="max-w-[65%] text-right">
                <p className="text-xs opacity-60">Requested path</p>
                <p className="text-sm font-semibold truncate">
                  {location?.pathname || "/"}
                </p>
              </div>
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-secondary">
              Oops… this page ran out of blood 🩸
            </h1>
            <p className="mt-3 text-base sm:text-lg opacity-75 max-w-2xl">
              The link you followed doesn’t exist, or it may have been moved.
              Use the buttons below to get back to safety.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/" className="btn btn-secondary rounded-2xl">
                Return to Home
              </Link>

              <Link to="/donation-requests" className="btn btn-outline rounded-2xl">
                Browse Requests
              </Link>

              <button
                type="button"
                onClick={() => window.history.back()}
                className="btn btn-ghost rounded-2xl"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>

        {/* Helpful box */}
        <div className="p-6 sm:p-8 border-t border-base-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-base-200 bg-base-100 p-4">
              <p className="text-xs font-bold opacity-60">Tip</p>
              <p className="mt-1 text-sm opacity-75">
                Check the URL for typos.
              </p>
            </div>

            <div className="rounded-2xl border border-base-200 bg-base-100 p-4">
              <p className="text-xs font-bold opacity-60">Try</p>
              <p className="mt-1 text-sm opacity-75">
                Go to Dashboard after login.
              </p>
              <Link to="/dashboard" className="link link-hover text-sm font-semibold text-secondary">
                Open Dashboard →
              </Link>
            </div>

            <div className="rounded-2xl border border-base-200 bg-base-100 p-4">
              <p className="text-xs font-bold opacity-60">Need help?</p>
              <p className="mt-1 text-sm opacity-75">
                If this keeps happening, refresh once.
              </p>
            </div>
          </div>
        </div>

        <div className="h-2 bg-secondary/20" />
      </div>
    </div>
  );
};

export default NotFound;
