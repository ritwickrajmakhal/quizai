import React, { useEffect, useState } from "react";
import TypingAnimation from "../TypingAnimation";
import PropTypes from "prop-types";
import { useGoogleLogin } from "@react-oauth/google";
import request from "../request";

export default function Home(props) {
  // Getting data from website's backend api
  const [webSiteData, setWebSiteData] = useState();
  useEffect(() => {
    request("/api/website?populate=*", "GET").then((res) => {
      setWebSiteData(res.data.attributes);
    });
  }, []);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      props.setUser(codeResponse);
      localStorage.setItem("user", JSON.stringify(codeResponse));
    },
    onError: (error) => {},
  });

  return (
    <div className="d-flex justify-content-center my-5">
      {webSiteData && (
        <div className="card text-bg-dark shadow-lg" style={{ width: "30rem" }}>
          <img
            src={webSiteData.coverImage.data.attributes.url}
            className="card-img img-fluid"
            alt="Cover"
          />

          <div
            className="card-img-overlay d-flex align-items-start flex-column"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          >
            <h1 className="card-title">{webSiteData.name}</h1>
            <p className="card-text fs-4">
              <TypingAnimation texts={webSiteData.quotes} speed={100} />|
            </p>
            <button className="btn btn-lg btn-dark mt-auto" onClick={login}>
              Login with google
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

Home.propTypes = {
  setUser: PropTypes.func,
};
