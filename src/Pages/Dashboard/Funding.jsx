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
const money = (n) => `৳ ${Number(n || 0).toLocaleString()}`;

const statusMeta = (status) => {
  const s = safeStatus(status);
  if (s === "paid") return { label: "paid", cls: "badge-success", dot: "bg-success" };
  if (s === "pending") return { label: "pending", cls: "badge-warning", dot: "bg-warning" };
  if (s === "canceled") return { label: "canceled", cls: "badge-error", dot: "bg-error" };
  return { label: s, cls: "badge-outline", dot: "bg-base-300" };
};

const Funding = () => {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const loadFundings = async () => {
    setLoadingTable(true);
    try {
      const res = await axiosSecure.get("/fundings");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to load fundings";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    loadFundings();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((it) => {
      if (statusFilter !== "all" && safeStatus(it.status) !== statusFilter) return false;
      return (
        it?.name?.toLowerCase().includes(q) ||
        it?.email?.toLowerCase().includes(q) ||
        it?.trxId?.toLowerCase().includes(q) ||
        String(it?.amount || "").includes(q)
      );
    });
  }, [items, query, statusFilter]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (numericAmount < 10) {
      toast.error("Minimum amount is 10 BDT");
      return;
    }

    try {
      setSubmitting(true);
      await toast.promise(
        axiosSecure.post("/fundings", {
          amount: numericAmount,
          trxId: trxId || null,
          note: note || null,
        }),
        {
          loading: "Submitting funding...",
          success: "Funding submitted!",
          error: "Funding failed",
        }
      );
      setOpen(false);
      setAmount("");
      setTrxId("");
      setNote("");
      loadFundings();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* HERO */}
      <div className="relative rounded-3xl overflow-hidden border border-base-300/60 bg-base-100 shadow-sm">
        <img
          src={Fundimage}
          alt="Funding"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-base-100 via-base-100/90 to-base-100/40" />

        <div className="relative p-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Support our platform
          </h1>
          <p className="mt-2 max-w-xl text-sm sm:text-base opacity-80">
            Your contribution helps maintain donors, verification, and logistics.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              className="btn btn-secondary rounded-2xl"
              onClick={() => setOpen(true)}
            >
              Give fund
            </button>
            <button
              className="btn btn-outline rounded-2xl"
              onClick={loadFundings}
            >
              Refresh
            </button>
          </div>

          <p className="mt-3 text-xs opacity-60">
            Logged in as <b>{user?.email || "—"}</b>
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-3xl border border-base-300/60 bg-base-100 shadow-sm">
        <div className="p-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div>
            <h2 className="font-extrabold text-lg">Funding history</h2>
            <p className="text-sm opacity-70">All submitted fund records</p>
          </div>

          <input
            className="input input-bordered rounded-2xl w-full sm:w-64"
            placeholder="Search name, trx, amount..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="bg-base-200/50">
                <th>User</th>
                <th>Transaction</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => {
                const meta = statusMeta(f.status);
                return (
                  <tr key={f._id} className="hover">
                    <td className="font-semibold">{f.name || "—"}</td>
                    <td className="text-sm opacity-80">{f.trxId || "—"}</td>
                    <td className="font-extrabold">{money(f.amount)}</td>
                    <td>
                      <span className={`badge badge-outline ${meta.cls}`}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="text-sm opacity-70">
                      {safeDate(f.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL (STRUCTURE UNCHANGED) */}
      {open && (
        <div className="fixed inset-0 z-[9999]">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={() => !submitting && setOpen(false)}
          />

          <div
            style={{ top: "33vh" }}
            className="absolute left-1/2 -translate-x-1/2 w-full max-w-xl
              bg-base-100 rounded-3xl shadow-2xl border border-base-300/60"
          >
            <div className="p-6 border-b border-base-300/60 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-extrabold">Give Fund</h3>
                <p className="text-xs opacity-60 mt-1">
                  Contributing as {user?.email}
                </p>
              </div>
              <button
                className="btn btn-ghost btn-sm rounded-xl"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-5">
              <div className="rounded-2xl border border-base-300/60 p-4 bg-base-200/40">
                <input
                  className="input input-bordered w-full text-xl font-extrabold rounded-2xl"
                  placeholder="Amount (BDT)"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value.replace(/[^\d]/g, ""))
                  }
                />

                <div className="mt-3 flex flex-wrap gap-2">
                  {PRESET_AMOUNTS.map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={`btn btn-sm rounded-2xl ${
                        String(v) === amount ? "btn-secondary" : "btn-outline"
                      }`}
                      onClick={() => setAmount(String(v))}
                    >
                      ৳ {v}
                    </button>
                  ))}
                </div>

                <p className="mt-2 text-xs opacity-60">
                  Minimum contribution: 10 BDT
                </p>
              </div>

              <input
                className="input input-bordered rounded-2xl w-full"
                placeholder="Transaction ID (optional)"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
              />

              <textarea
                className="textarea textarea-bordered rounded-2xl w-full min-h-[110px]"
                placeholder="Note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn btn-ghost rounded-2xl"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-secondary rounded-2xl"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Confirm funding"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funding;
