import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateQuiz from "./components/CreateQuiz";
import Questions from "./components/Questions";
import Home from "./components/Home/Home";
import { useState, useEffect } from "react";

function App() {
  // Getting data from website's backend api
  const [webSiteData, setWebSiteData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:1337/api/website?populate=*")
      .then((response) => response.json())
      .then((data) => {
        setWebSiteData(data.data.attributes);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" index element={<Home webSiteData={webSiteData} />} />
          <Route path="/create" element={<CreateQuiz />} />
          <Route path="/quiz" element={<Questions />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
