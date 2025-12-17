import React, { useMemo, useState } from "react";

const fakeRequests = [
  {
    _id: "1",
    recipientName: "Rahim Uddin",
    bloodGroup: "A+",
    hospital: "Dhaka Medical College",
    district: "Dhaka",
    status: "pending",
    date: "2025-01-10",
  },
  {
    _id: "2",
    recipientName: "Karim Ahmed",
    bloodGroup: "B+",
    hospital: "Square Hospital",
    district: "Dhaka",
    status: "inprogress",
    date: "2025-01-08",
  },
  {
    _id: "3",
    recipientName: "Fatema Akter",
    bloodGroup: "O-",
    hospital: "Evercare Hospital",
    district: "Chattogram",
    status: "done",
    date: "2025-01-02",
  },
];

const statusStyle = (status) => {
  if (status === "pending") return "badge-warning";
  if (status === "inprogress") return "badge-info";
  if (status === "done") return "badge-success";
  if (status === "canceled") return "badge-error";
  return "badge-outline";
};

const MyDonationRequests = () => {
  const [page] = useState(1);

  const data = useMemo(() => fakeRequests, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Blood Requests</h1>
        <p className="text-sm opacity-70">
          Manage all blood donation requests you have created.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl bg-base-100 border border-base-300/60 shadow-sm">
        <div className="p-5 border-b border-base-300/60 flex justify-between items-center">
          <p className="font-semibold">Request List</p>
          <span className="text-sm opacity-60">Page {page} of 1</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="bg-base-200/50">
                <th>Recipient</th>
                <th>Blood Group</th>
                <th>Hospital</th>
                <th>District</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {data.map((req) => (
                <tr key={req._id} className="hover">
                  <td className="font-semibold">{req.recipientName}</td>
                  <td>
                    <span className="badge badge-outline">
                      {req.bloodGroup}
                    </span>
                  </td>
                  <td className="text-sm">{req.hospital}</td>
                  <td className="text-sm">{req.district}</td>
                  <td>
                    <span
                      className={`badge capitalize ${statusStyle(req.status)}`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="text-sm opacity-70">{req.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fake Pagination */}
        <div className="p-4 border-t border-base-300/60 flex justify-between items-center">
          <p className="text-sm opacity-70">
            Showing {data.length} requests
          </p>

          <div className="join">
            <button className="btn btn-sm join-item btn-disabled">
              «
            </button>
            <button className="btn btn-sm join-item btn-active">
              1
            </button>
            <button className="btn btn-sm join-item btn-disabled">
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDonationRequests;
