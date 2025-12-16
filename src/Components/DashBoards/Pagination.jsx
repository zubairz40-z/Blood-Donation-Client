import React from "react";

const Pagination = ({ page, totalPages, onPage }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-2 mt-4">
      <button className="btn btn-sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        Prev
      </button>
      <span className="text-sm opacity-70">
        Page <b>{page}</b> of <b>{totalPages}</b>
      </span>
      <button className="btn btn-sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
