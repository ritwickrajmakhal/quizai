import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home/Home";
import { useState, useEffect } from "react";
import Model from "./components/Modal";
import axios from "axios";
import User from "./components/User";
import Create from "./components/Create";
import Navbar from "./components/Navbar/Navbar";
import request from "./func/request";
import PreLoader from "./components/PreLoader/PreLoader";
import Attempt from "./components/Attempt";
import Alert from "./components/Alert";
import Leaderboard from "./components/Leaderboard/Leaderboard";

function App() {
  const [modal, setModal] = useState({ title: null, body: null });
  const [preLoader, setPreLoader] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [profile, setProfile] = useState(null);
  const [alert, setAlert] = useState(); // State to store alert message {message:"", type:""}
  const [userData, setUserData] = useState(null);

  // close alert after 3s
  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(null);
      }, 3000);
    }
  }, [alert]);

  // Fetch the user's profile data from the Google API
  useEffect(() => {
    if (user) {
      setPreLoader("Gathering your data...");
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
          request("/api/publics", "POST", {
            data: {
              userId: res.data.id,
              name: res.data.name,
            },
          }).catch((err) => {});
          setProfile(res.data);
        })
        .catch((err) => {
          setUser(null);
        })
        .finally(() => {
          setPreLoader(null);
        });
    }
  }, [user]);

  // Fetch quizzes data
  useEffect(() => {
    if (profile) {
      setPreLoader("Gathering quizzes data...");
      request(`/api/publics?filters[userId][$eq]=${profile.id}`, "GET")
        .then((res) => {
          setUserData(res.data[0]);
        })
        .finally(() => {
          setPreLoader(null);
        });
    }
  }, [profile]);

  return (
    <div className="App">
      {preLoader && <PreLoader msg={preLoader} />}
      <Model modal={modal} setModal={setModal} />
      <BrowserRouter>
        <Navbar profile={profile} user={user} setUser={setUser} />
        <Alert alert={alert} setAlert={setAlert} />
        <Routes>
          <Route
            exact
            path="/"
            index
            element={
              user ? (
                profile && <Navigate replace to="/user" />
              ) : (
                <Home setUser={setUser} />
              )
            }
          />
          <Route
            exact
            path="/user"
            element={
              user ? (
                userData && (
                  <User
                    setModal={setModal}
                    userId={userData.id}
                    setAlert={setAlert}
                  />
                )
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            exact
            path="/user/create"
            element={
              user ? (
                userData && (
                  <Create
                    setPreLoader={setPreLoader}
                    userId={userData.id}
                    setModal={setModal}
                    setAlert={setAlert}
                  />
                )
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            exact
            path="/attempt"
            element={
              user ? (
                userData && (
                  <Attempt
                    userId={userData.id}
                    setAlert={setAlert}
                    setPreLoader={setPreLoader}
                  />
                )
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route exact path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
