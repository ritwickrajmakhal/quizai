import React from "react";
import { Link } from "react-router-dom";

export default function Navbar({ profile, setUser }) {
  return (
    <nav class="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
      <div class="container">
        <a class="navbar-brand">Navbar</a>
        <div className="">
          <Link className="btn btn-outline-light" to="/user/create">
            Create Quiz
          </Link>
          <img
            className="img-responsive rounded-circle border border-light mx-4"
            style={{ width: "50px", height: "50px", cursor: "pointer" }}
            src={profile.picture}
            alt="profile"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasExample"
            aria-controls="offcanvasExample"
          />
          <div
            class="offcanvas offcanvas-end"
            tabindex="-1"
            id="offcanvasExample"
            aria-labelledby="offcanvasExampleLabel"
          >
            <div class="offcanvas-header border-bottom">
              <div className="d-flex">
                <img
                  className="img-responsive rounded-circle border border-light"
                  style={{ width: "50px", height: "50px" }}
                  src={profile.picture}
                  alt="profile"
                />
                <h5
                  class="offcanvas-title my-auto mx-2"
                  id="offcanvasExampleLabel"
                >
                  {profile.name}
                </h5>
              </div>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div class="offcanvas-body">
              <button
                className="btn btn-danger"
                onClick={() => {
                  setUser(null);
                  localStorage.removeItem("user");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
