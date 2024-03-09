import React from "react";
import loading from "./loading.gif";

export default function PreLoader({ msg }) {
  return (
    <div
      className={`preloader position-absolute z-3 vw-100 vh-100 d-${msg ? "block" : "none"}`}
      style={{ backgroundColor: "rgba(0,0,0,1)" }}
    >
      <div className="d-flex justify-content-center align-items-center flex-column position-relative top-50">
        <img
          alt="loader"
          className="image-responsive"
          src={loading}
          style={{ width: "100px" }}
        />
        <h3 className="text-white fw-bold">{msg}</h3>
      </div>
    </div>
  );
}
