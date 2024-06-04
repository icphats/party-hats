import React from "react";
import "../styles/alert-confirm.css";

export default function AlertDialog(props) {
  const { open, title, message, buttonLabel, handler } = props;

  return (
    <div className={`dialog ${open ? "open" : "closed"}`}>
      <div className="dialog-content">
        {/* <div className="dialog-title">{title}</div> */}
        <div className="dialog-message">{message}</div>
        <div className="dialog-actions">
          <button className="default-modal-button" onClick={handler}>
            {buttonLabel ?? "OK"}
          </button>
        </div>
      </div>
    </div>
  );
}
