import React from "react";

export default function Alert({ alert, setAlert }) {
  return (
    <div class={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
      {alert.message}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={() => setAlert(null)}
      ></button>
    </div>
  );
}
