import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Create from "./components/Create";
import Quiz from "./components/Quiz";
import Home from "./components/Home/Home";
import { useState, useEffect } from "react";
import Model from "./components/Modal";
import request from "./components/request";

function App() {
  const [modal, setModal] = useState({ title: null, body: null });

  // Getting data from website's backend api
  const [webSiteData, setWebSiteData] = useState();
  useEffect(() => {
    request("/api/website?populate=*", "GET").then((res) => {
      setWebSiteData(res.data.attributes);
    });
  }, []);
  return (
    <div className="App">
      <Model modal={modal} setModal={setModal} />
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            index
            element={<Home webSiteData={webSiteData} />}
          />
          <Route exact path="create" element={<Create setModal={setModal} />} />
          <Route exact path="quizzes" element={<Quiz modal={modal} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
