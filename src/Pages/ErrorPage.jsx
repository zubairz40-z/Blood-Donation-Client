import React from "react";
import { Link, useRouteError } from "react-router";
import { FiAlertTriangle, FiHome, FiRefreshCw, FiArrowLeft } from "react-icons/fi";

const ErrorPage = () => {
  const error = useRouteError();

  const status = error?.status || error?.statusCode;
  const title =
    status === 404
      ? "Page not found"
      : status === 401
      ? "Unauthorized"
      : status === 403
      ? "Forbidden"
      : "Something went wrong";

  const message =
    error?.data?.message ||
    error?.message ||
    "An unexpected error occurred. Please try again.";

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-base-100/80 backdrop-blur border border-base-300/60 shadow-sm overflow-hidden">
        <div className="h-1 bg-secondary" />

        <div className="p-6 md:p-10">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-secondary/15 text-secondary grid place-items-center">
              <FiAlertTriangle size={22} />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {title}
              </h1>

              {status ? (
                <p className="mt-1 text-sm opacity-70">
                  Error code: <span className="font-semibold">{status}</span>
                </p>
              ) : (
                <p className="mt-1 text-sm opacity-70">Route error detected</p>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-base-200/70 border border-base-300/60 p-4">
            <p className="text-sm opacity-80 whitespace-pre-wrap break-words">
              {message}
            </p>
          </div>

          {/* Helpful actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/" className="btn btn-secondary rounded-xl">
              <FiHome />
              Go Home
            </Link>

            <button
              type="button"
              className="btn btn-ghost rounded-xl"
              onClick={() => window.location.reload()}
            >
              <FiRefreshCw />
              Reload
            </button>

            <button
              type="button"
              className="btn btn-ghost rounded-xl"
              onClick={() => window.history.back()}
            >
              <FiArrowLeft />
              Go Back
            </button>
          </div>

          {/* Developer-friendly details (optional) */}
          <details className="mt-6">
            <summary className="cursor-pointer text-sm opacity-70 hover:opacity-100">
              Show technical details
            </summary>
            <pre className="mt-3 text-xs rounded-xl bg-base-200/70 border border-base-300/60 p-4 overflow-auto">
{JSON.stringify(
  {
    name: error?.name,
    message: error?.message,
    status: error?.status,
    data: error?.data,
    stack: error?.stack,
  },
  null,
  2
)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
