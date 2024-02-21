import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home/Home";
import { useState, useEffect } from "react";
import Model from "./components/Modal";
import axios from "axios";
import User from "./components/User";
import Create from "./components/Create";
import Navbar from "./components/Navbar/Navbar";
import request from "./components/request";
import PreLoader from "./components/PreLoader/PreLoader";

function App() {
  const [modal, setModal] = useState({ title: null, body: null });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [profile, setProfile] = useState(null);
  // Fetch the user's profile data from the Google API
  useEffect(() => {
    setLoading(true);
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
          request("/api/publics", "POST", {
            data: { userId: res.data.id },
          }).catch((err) => {});
        })
        .catch((err) => {
          setUser(null);
        });
    }
    setLoading(false);
  }, [user]);

  return (
    <div className="App">
      {loading && <PreLoader />}
      <Model modal={modal} setModal={setModal} />
      <BrowserRouter>
        <Navbar profile={profile} user={user} setUser={setUser} />
        <Routes>
          <Route
            exact
            path="/"
            element={
              user ? (
                profile && <Navigate replace to="/user" />
              ) : (
                <Home setUser={setUser} setLoading={setLoading} />
              )
            }
          />
          <Route
            exact
            path="/user"
            element={
              user ? (
                profile && <User userId={profile.id} setLoading={setLoading} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            exact
            path="/user/create"
            element={user ? <Create /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
