import React from "react";
import { Outlet, Link } from "react-router-dom";
import TypingAnimation from "../TypingAnimation";
import PreLoader from "../PreLoader/PreLoader";
import geminiLogo from "./geminiLogo.gif";

export default function Home(props) {
  // Check if webSiteData exists before accessing its properties
  if (!props.webSiteData) {
    return <PreLoader />; // Display a loading indicator while data is being fetched
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card text-bg-dark shadow-lg" style={{ width: "30rem" }}>
        <img
          src={
            process.env.REACT_APP_STRAPI_API_URL +
            props.webSiteData.coverImage.data.attributes.url
          }
          className="card-img image-responsive"
          alt="Cover"
        />

        <div
          class="card-img-overlay d-flex align-items-start flex-column"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        >
          <h1 class="card-title">{props.webSiteData.name}</h1>
          <p class="card-text fs-4">
            <TypingAnimation texts={props.webSiteData.quotes} speed={100} />|
          </p>
          <Link className="btn btn-lg btn-dark mt-auto" to="/create">
            Create{" "}
            <img
              alt="gemini logo"
              className="image-responsive w-25"
              src={geminiLogo}
            ></img>
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
