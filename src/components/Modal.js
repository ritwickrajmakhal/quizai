import React from "react";
import PropTypes from "prop-types";

export default function Modal({ modal, setModal }) {
  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {modal.title}
            </h1>
            <button
              type="button"
              onClick={() =>
                setModal({ title: null, body: null, footer: null })
              }
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">{modal.body}</div>
          <div className="modal-footer">{modal.footer}</div>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  modal: PropTypes.shape({
    title: PropTypes.string,
    body: PropTypes.node,
    footer: PropTypes.node,
  }),
  setModal: PropTypes.func,
};
