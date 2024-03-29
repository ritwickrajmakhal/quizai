import { googleLogout } from "@react-oauth/google";
import React from "react";
import { Link } from "react-router-dom";
import logo from "./logo.png";

export default function Navbar({ profile, user, setUser }) {
  return (
    <nav className="navbar border-body" data-bs-theme="dark">
      <div className="container py-2">
        <Link to="/user" className="navbar-brand">
          <img
            alt="App logo"
            className="img-fluid"
            style={{ width: "100px" }}
            src={logo}
          />
        </Link>
        {profile && user && (
          <div>
            <Link
              className="btn btn-outline-light"
              style={{
                border: "1px solid #0bf4f3",
                boxShadow: "0 0 5px #0bf4f3, 0 0 5px #0bf4f3 inset",
              }}
              to="/user/create"
            >
              Create Quiz
            </Link>
            <img
              className="img-fluid rounded-circle border border-light mx-4"
              style={{ width: "50px", height: "50px", cursor: "pointer" }}
              src={profile.picture}
              alt="profile"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasExample"
              aria-controls="offcanvasExample"
            />
            <div
              className="offcanvas offcanvas-end"
              tabIndex="-1"
              id="offcanvasExample"
              aria-labelledby="offcanvasExampleLabel"
            >
              <div className="offcanvas-header border-bottom">
                <div className="d-flex">
                  <img
                    className="img-fluid rounded-circle border border-light"
                    style={{ width: "50px", height: "50px" }}
                    src={profile.picture}
                    alt="profile"
                  />
                  <h5
                    className="offcanvas-title my-auto mx-2"
                    id="offcanvasExampleLabel"
                  >
                    {profile.name}
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body">
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    googleLogout();
                    setUser(null);
                    localStorage.removeItem("user");
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
