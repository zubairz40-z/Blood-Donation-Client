import React, { useEffect, useMemo, useState } from "react";
import axiosSecure from "../../api/axiosSecure";
import useAuth from "../../Hooks/useAuth";
import { toast } from "react-hot-toast";
import Fundimage from "../../assets/fund.jpg";

const PRESET_AMOUNTS = [200, 500, 1000, 2000, 5000];

const safeDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? "—" : dt.toLocaleString();
};

const safeStatus = (s) => (s ? String(s) : "pending");

const statusBadge = (status) => {
  const s = safeStatus(status);
  const base = "badge badge-outline capitalize";
  if (s === "paid") return `${base} badge-success`;
  if (s === "pending") return `${base} badge-warning`;
  if (s === "canceled") return `${base} badge-error`;
  return base;
};

const money = (n) => `৳ ${Number(n || 0).toLocaleString()}`;

const Funding = () => {
  const { user } = useAuth();

  // list
  const [items, setItems] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [error, setError] = useState("");

  // modal
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [trxId, setTrxId] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const numericAmount = useMemo(() => Number(amount || 0), [amount]);

  const total = useMemo(
    () => items.reduce((sum, it) => sum + Number(it?.amount || 0), 0),
    [items]
  );

  const resetForm = () => {
    setAmount("");
    setTrxId("");
    setNote("");
  };

  const loadFundings = async () => {
    setLoadingTable(true);
    setError("");
    try {
      const res = await axiosSecure.get("/fundings");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error(e);
      setItems([]);
      const msg = e?.response?.data?.message || e?.message || "Failed to load fundings";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    loadFundings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePreset = (v) => setAmount(String(v));

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!numericAmount || numericAmount < 10) {
      toast.error("Please enter a valid amount (min 10).");
      return;
    }

    const payload = {
      amount: numericAmount,
      trxId: trxId.trim() || null,
      note: note.trim() || null,
    };

    try {
      setSubmitting(true);

      await toast.promise(axiosSecure.post("/fundings", payload), {
        loading: "Submitting funding...",
        success: "✅ Funding submitted!",
        error: (err) => err?.response?.data?.message || err?.message || "Funding failed",
      });

      setOpen(false);
      resetForm();
      await loadFundings();
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (open) resetForm();
  }, [open]);

  return (
    <div className="space-y-5">
      {/* ✅ Promo banner */}
      <div className="relative overflow-hidden rounded-3xl border border-base-300/60 shadow-sm">
        {/* background image */}
        <div className="absolute inset-0">
          <img
            src={Fundimage}
            alt="Funding banner"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-base-100/95 via-base-100/80 to-base-100/30" />
        </div>

        <div className="relative p-6 sm:p-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="max-w-xl">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-secondary">
                Support Our Blood Donation Platform
              </h1>
              <p className="text-sm sm:text-base opacity-80 mt-2">
                Your contribution helps us maintain the system, verify donors, and improve
                donation logistics for people in need.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className="btn btn-secondary rounded-2xl"
                  onClick={() => setOpen(true)}
                  type="button"
                >
                  Give fund
                </button>

                <button
                  className="btn btn-ghost rounded-2xl"
                  type="button"
                  onClick={loadFundings}
                  disabled={loadingTable}
                >
                  {loadingTable ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Refreshing
                    </>
                  ) : (
                    "Refresh"
                  )}
                </button>
              </div>

              <p className="text-xs opacity-60 mt-3">
                Logged in as: <b>{user?.email || "—"}</b>
              </p>
            </div>

            {/* small stats chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full sm:w-auto">
              <div className="rounded-2xl bg-base-100/70 backdrop-blur border border-base-300/60 p-4">
                <p className="text-[11px] font-semibold opacity-60">TOTAL RECORDS</p>
                <p className="text-xl font-bold mt-1">{items.length}</p>
              </div>

              <div className="rounded-2xl bg-base-100/70 backdrop-blur border border-base-300/60 p-4">
                <p className="text-[11px] font-semibold opacity-60">TOTAL AMOUNT</p>
                <p className="text-xl font-bold mt-1">{money(total)}</p>
              </div>

              <div className="hidden sm:block rounded-2xl bg-base-100/70 backdrop-blur border border-base-300/60 p-4">
                <p className="text-[11px] font-semibold opacity-60">STATUS</p>
                <p className="text-sm font-semibold mt-2">Tracking enabled</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error ? (
        <div className="alert alert-error rounded-2xl">
          <span>{error}</span>
        </div>
      ) : null}

      {/* Table */}
      <div className="rounded-3xl bg-base-100/80 border border-base-300/60 shadow-sm">
        <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Funding History</h2>
            <p className="text-sm opacity-70">All funds made by users.</p>
          </div>
        </div>

        {loadingTable ? (
          <div className="p-6 space-y-3">
            <div className="skeleton h-6 w-48" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-full" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-lg font-bold">No funding found</p>
            <p className="opacity-70 text-sm mt-1">
              Click <b>Give fund</b> to add the first record.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto p-2">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>User</th>
                  <th className="min-w-[220px]">Email</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="min-w-[190px]">Date</th>
                </tr>
              </thead>

              <tbody>
                {items.map((f) => (
                  <tr key={f._id}>
                    <td className="font-medium">{f.name || "—"}</td>

                    <td className="text-sm opacity-80">
                      <span className="truncate inline-block max-w-[320px]">
                        {f.email || "—"}
                      </span>
                      {f.trxId ? (
                        <div className="text-xs opacity-60 mt-1">
                          Trx: <span className="font-mono">{f.trxId}</span>
                        </div>
                      ) : null}
                    </td>

                    <td className="font-bold">{money(f.amount)}</td>

                    <td>
                      <span className={statusBadge(f.status)}>
                        {safeStatus(f.status)}
                      </span>
                    </td>

                    <td className="text-sm opacity-80">{safeDate(f.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <dialog className={`modal modal-bottom sm:modal-middle ${open ? "modal-open" : ""}`}>
        <div className="modal-box rounded-3xl max-h-[85vh] overflow-y-auto">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-lg">Give fund</h3>
              <p className="text-sm opacity-70 mt-1">
                You are submitting as <b>{user?.email || "—"}</b>
              </p>
            </div>

            <button
              type="button"
              className="btn btn-ghost btn-sm rounded-xl"
              onClick={() => setOpen(false)}
              disabled={submitting}
              title="Close"
            >
              ✕
            </button>
          </div>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Amount (BDT)</span>
              </label>

              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, "").slice(0, 7))}
                type="text"
                inputMode="numeric"
                className="input input-bordered rounded-2xl"
                placeholder="e.g. 500"
                required
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {PRESET_AMOUNTS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`btn btn-outline btn-sm rounded-2xl ${
                      String(v) === amount ? "btn-active" : ""
                    }`}
                    onClick={() => handlePreset(v)}
                  >
                    {v}৳
                  </button>
                ))}
              </div>

              <p className="mt-2 text-xs opacity-60">Minimum 10 BDT.</p>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Transaction ID (optional)</span>
              </label>
              <input
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                type="text"
                className="input input-bordered rounded-2xl"
                placeholder="bKash/Nagad/Rocket TrxID"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Note (optional)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="textarea textarea-bordered rounded-2xl min-h-[110px]"
                placeholder="Anything you'd like to mention..."
              />
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost rounded-2xl"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-secondary rounded-2xl" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Submitting...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={() => setOpen(false)}>
            close
          </button>
        </form>
      </dialog>
    </div>
  );
};

export default Funding;
