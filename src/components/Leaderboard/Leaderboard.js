import { React, useState } from "react";
import "./style.css";
import Pagination from "../Pagination";

const PAGE_SIZE = 10; // Number of QuizCards to show per page

export default function Leaderboard() {
  // Example data, replace with your actual leaderboard data
  const [dados, setDados] = useState([
    {
      name: "Laura",
      image: "https://cdn-icons-png.flaticon.com/512/186/186037.png",
      marks: 100,
      accuracy: 6,
      time_taken: 70,
    },
    {
      name: "John",
      image: "https://cdn-icons-png.flaticon.com/512/186/186037.png",
      marks: 90,
      accuracy: 5,
      time_taken: 80,
    },
    {
      name: "Laura",
      image: "https://cdn-icons-png.flaticon.com/512/186/186037.png",
      marks: 100,
      accuracy: 6,
      time_taken: 70,
    },
    {
      name: "John",
      image: "https://cdn-icons-png.flaticon.com/512/186/186037.png",
      marks: 90,
      accuracy: 5,
      time_taken: 80,
    },
    {
      name: "John",
      image: "https://cdn-icons-png.flaticon.com/512/186/186037.png",
      marks: 90,
      accuracy: 5,
      time_taken: 80,
    },
    {
      name: "Laura",
      image: "https://cdn-icons-png.flaticon.com/512/186/186037.png",
      marks: 100,
      accuracy: 6,
      time_taken: 70,
    },
    {
      name: "John",
      image: "https://cdn-icons-png.flaticon.com/512/186/186037.png",
      marks: 90,
      accuracy: 5,
      time_taken: 80,
    },
    {
      name: "Emma",
      image: "https://cdn-icons-png.flaticon.com/512/186/186037.png",
      marks: 95,
      accuracy: 7,
      time_taken: 60,
    },
    {
      name: "Michael",
      image: "https://cdn-icons-png.flaticon.com/512/186/186037.png",
      marks: 85,
      accuracy: 4,
      time_taken: 90,
    },
    {
      name: "Sophia",
      image: "https://cdn-icons-png.flaticon.com/512/186/186037.png",
      marks: 80,
      accuracy: 3,
      time_taken: 100,
    },
    {
      name: "William",
      image: "https://cdn-icons-png.flaticon.com/512/186/186037.png",
      marks: 75,
      accuracy: 2,
      time_taken: 110,
    },
    {
      name: "Olivia",
      image: "https://cdn-icons-png.flaticon.com/512/186/186037.png",
      marks: 70,
      accuracy: 1,
      time_taken: 120,
    },
    {
      name: "Daniel",
      image: "https://cdn-icons-png.flaticon.com/512/186/186037.png",
      marks: 65,
      accuracy: 0,
      time_taken: 130,
    },
  ]);

  // State for tracking current page
  const [currentPage, setCurrentPage] = useState(1);

  // Logic to calculate the start and end index of data to display for the current page
  const indexOfLastItem = currentPage * PAGE_SIZE;
  const indexOfFirstItem = indexOfLastItem - PAGE_SIZE;
  const currentItems = dados.slice(indexOfFirstItem, indexOfLastItem);

  // Handler function to change current page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="container">
      {dados.length === 0 && <p className="text-light">No data found</p>}
      <div className="topLeadersList">
        {dados.map(
          (leader, index) =>
            index + 1 <= 3 && (
              <div className="leader" key={index}>
                (
                <div className="containerImage">
                  <img className="image" loading="lazy" src={leader.image} />
                  <div className="crown">
                    <svg
                      id="crown1"
                      fill="#0f74b5"
                      data-name="Layer 1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 100 50"
                    >
                      <polygon
                        className="cls-1"
                        points="12.7 50 87.5 50 100 0 75 25 50 0 25.6 25 0 0 12.7 50"
                      />
                    </svg>
                  </div>
                  <div className="leaderName">{leader.name}</div>
                </div>
                )
              </div>
            )
        )}
      </div>
      {dados.length !== 0 && (
        <div>
          <table
            className="table table-dark table-hover"
            style={{ marginTop: "6.5rem" }}
          >
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Marks</th>
                <th scope="col">Accuracy</th>
                <th scope="col">Time taken</th>
              </tr>
            </thead>
            <tbody>
              {/* Map over currentItems instead of the entire dados array */}
              {currentItems.map((player, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <img
                      className="img-fluid rounded-circle border"
                      src={player.image}
                      style={{ height: "2rem" }}
                    />
                    <span className="ms-2">{player.name}</span>
                  </td>
                  <td>{player.marks}</td>
                  <td>{player.accuracy}</td>
                  <td>{player.time_taken}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Render Pagination component */}
          <Pagination
            totalPages={Math.ceil(dados.length / PAGE_SIZE)}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
}
