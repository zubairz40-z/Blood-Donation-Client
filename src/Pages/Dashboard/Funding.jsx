// src/pages/Funding.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router";

import axiosPublic from './../../api/axiosPublic';
import useAuth from './../../Hooks/useAuth';
import Logo from './../../Components/Logo/Logo';

const PRESET_AMOUNTS = [200, 500, 1000, 2000, 5000];

const Funding = () => {
  const { user } = useAuth();

  const [amount, setAmount] = useState("");
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [trxId, setTrxId] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);

  const numericAmount = useMemo(() => Number(amount || 0), [amount]);

  const handlePreset = (v) => setAmount(String(v));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!numericAmount || numericAmount < 10) {
      alert("Please enter a valid amount (min 10).");
      return;
    }
    if (!name.trim()) {
      alert("Name is required.");
      return;
    }
    if (!email.trim()) {
      alert("Email is required.");
      return;
    }

    // trxId optional, but if provided make it non-empty
    if (trxId && !trxId.trim()) {
      alert("Transaction ID is invalid.");
      return;
    }

    const payload = {
      amount: numericAmount,
      name: name.trim(),
      email: email.trim(),
      trxId: trxId.trim() || null,
      note: note.trim() || null,
      status: "pending", // you can set "paid" later after verification
      createdAt: new Date(),
    };

    try {
      setLoading(true);
      // ✅ You can change endpoint to whatever you use: /fundings or /funding
      await axiosPublic.post("/fundings", payload);

      alert("✅ Thanks! Your funding request has been submitted.");
      setAmount("");
      setTrxId("");
      setNote("");
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || err?.message || "Funding failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-base-200 bg-base-100 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
                  Support <Logo />
                </h1>
                <p className="mt-1 text-sm text-base-content/70">
                  Your funding helps us maintain the platform and arrange blood
                  donation logistics.
                </p>
              </div>

              <Link to="/" className="btn btn-ghost rounded-2xl">
                Home
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Amount (BDT)</span>
                  </label>

                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
                    type="text"
                    inputMode="numeric"
                    className="input input-bordered rounded-2xl focus-within:ring-2 focus-within:ring-secondary/30"
                    placeholder="e.g. 500"
                    required
                  />

                  <div className="mt-3 flex flex-wrap gap-2">
                    {PRESET_AMOUNTS.map((v) => (
                      <button
                        key={v}
                        type="button"
                        className="btn btn-outline btn-sm rounded-2xl"
                        onClick={() => handlePreset(v)}
                      >
                        {v}৳
                      </button>
                    ))}
                  </div>

                  <p className="mt-2 text-xs text-base-content/60">
                    Tip: if you’re using bKash/Nagad/Rocket, you can add a
                    Transaction ID (optional).
                  </p>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    className="input input-bordered rounded-2xl focus-within:ring-2 focus-within:ring-secondary/30"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="input input-bordered rounded-2xl focus-within:ring-2 focus-within:ring-secondary/30"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Transaction ID (optional)</span>
                  </label>
                  <input
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    type="text"
                    className="input input-bordered rounded-2xl focus-within:ring-2 focus-within:ring-secondary/30"
                    placeholder="e.g. 8F2X9ABC..."
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Note (optional)</span>
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="textarea textarea-bordered rounded-2xl min-h-[110px]"
                    placeholder="Anything you'd like to mention..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn w-full rounded-2xl bg-secondary text-secondary-content hover:bg-secondary/90 border-0"
                >
                  {loading ? "Submitting..." : "Submit funding"}
                </button>

                {!user?.email && (
                  <p className="text-xs text-base-content/60 text-center">
                    You’re not logged in. That’s okay — funding can still be
                    submitted. (If you want it tied to your account, login
                    first.)
                  </p>
                )}
              </form>

              {/* Right: Info card */}
              <div className="rounded-3xl border border-base-200 bg-base-100 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-secondary">
                  How it works
                </h2>

                <ul className="mt-4 space-y-3 text-sm text-base-content/70">
                  <li className="flex gap-2">
                    <span className="mt-0.5">✅</span>
                    <span>
                      Submit your funding amount and details.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5">✅</span>
                    <span>
                      Admin verifies the transaction and updates status.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5">✅</span>
                    <span>
                      Your support helps keep the donation system running.
                    </span>
                  </li>
                </ul>

                <div className="divider my-6" />

                <h3 className="font-semibold">Suggested payment methods</h3>
                <p className="mt-2 text-sm text-base-content/70">
                  bKash / Nagad / Rocket / Bank transfer (you can show your Trx
                  ID to admin for verification).
                </p>

                <div className="divider my-6" />

                <p className="text-xs text-base-content/60">
                  Note: This page submits a funding record to your backend at{" "}
                  <code className="px-1">POST /fundings</code>. Make sure your
                  server route exists.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-base-content/50">
          © {new Date().getFullYear()} Blood Donation Platform
        </p>
      </div>
    </div>
  );
};

export default Funding;
