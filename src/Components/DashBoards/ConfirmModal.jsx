import React from "react";

const ConfirmModal = ({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  confirmText = "Confirm",
}) => {
  return (
    <dialog className={`modal ${open ? "modal-open" : ""}`}>
      <div className="modal-box rounded-2xl">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-2 opacity-70">{message}</p>

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost rounded-xl"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-error rounded-xl"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onCancel}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default ConfirmModal;
