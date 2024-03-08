import React from "react";
import "./style.css";

export default function GlowText({ code, msg }) {
  return (
    <div className="notFound" style={{ marginTop: "6rem" }}>
      <h1 className="neonText">{code}</h1>
      <h2 className="neonText">{msg}</h2>
    </div>
  );
}
