import React from "react";
import loading from "./loading.gif";
import "./preLoaderStyle.css";

export default function PreLoader() {
  return (
    <div className="preloader">
      <img alt="loader" className="image-responsive" src={loading} />
    </div>
  );
}
