import React, { useState, useEffect } from "react";
import loading from "./loading.svg";
import "./style.css"; // Import CSS file for styles

export default function PreLoader({ msg }) {
  const [isVisible, setIsVisible] = useState(!!msg); // Initially set visibility based on msg

  // Update visibility when msg changes
  useEffect(() => {
    setIsVisible(!!msg); // Convert msg to boolean
  }, [msg]);

  return (
    <div
      className={`z-3 bg-dark preloader-container ${
        isVisible ? "visible" : "hidden"
      }`}
    >
      <img alt="loader" className="loader-image img-fluid" src={loading} />
      <h3 className="loader-message">{msg}</h3>
    </div>
  );
}
