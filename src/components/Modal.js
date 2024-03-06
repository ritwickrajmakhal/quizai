import React from "react";
import PropTypes from "prop-types";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function Modal({ modal, setModal }) {
  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      data-bs-theme="dark"
    >
      <div
        className={`modal-dialog modal-${
          modal.style ? modal.style : "dialog-centered"
        }`}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {modal.title}
            </h1>
            <OverlayTrigger
              placement={"top"}
              overlay={
                <Tooltip id={`tooltip-top`}>
                  <strong>Close</strong>
                </Tooltip>
              }
            >
              <button
                type="button"
                onClick={() =>
                  setModal({ title: null, body: null, footer: null })
                }
                className="btn btn-close btn-outline-danger"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </OverlayTrigger>
          </div>
          <div className="modal-body">{modal.body}</div>
          {modal.footer}
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
