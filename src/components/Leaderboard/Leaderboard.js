import { React, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./style.css";
import request from "../../func/request";
import { decrypt } from "../../func/encryptDecrypt";
import GlowText from "../GlowText/GlowText";

export default function Leaderboard() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const qid = queryParams.get("qid");

  const [players, setPlayers] = useState(null);
  useEffect(() => {
    if (qid) {
      const decryptedQuizId = decrypt(qid);
      request(
        `/api/attempts?filters[quiz][id][$eq]=${decryptedQuizId}&populate[public][fields][0]=name&populate[public][fields][1]=picture&populate[attempts][fields][1]=total_points&sort[0]=total_points:desc`
      ).then((res) => {
        setPlayers(
          res.data.map((item) => ({
            total_points: item.attributes.total_points,
            image: item.attributes.public.data.attributes.picture,
            name: item.attributes.public.data.attributes.name,
          }))
        );
      });
    }
  }, [qid]);

  return (
    <div className="container">
      {players?.length === 0 && (
        <GlowText code={"Wait"} msg={"No user attempted"} />
      )}
      <div className="topLeadersList">
        {players?.map(
          (leader, index) =>
            index + 1 <= 3 && (
              <div className="leader" key={index}>
                <div className="containerImage">
                  <img
                    alt="leader"
                    className="image"
                    loading="lazy"
                    src={leader.image}
                  />
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
                  <div className="leaderName">{leader.name.split(" ")[0]}</div>
                </div>
              </div>
            )
        )}
      </div>
      {players?.length !== 0 && (
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
              </tr>
            </thead>
            <tbody>
              {/* Map over all items without pagination */}
              {players?.map((player, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <img
                      alt="player"
                      className="img-fluid rounded-circle border"
                      src={player.image}
                      style={{ height: "2rem" }}
                    />
                    <span className="ms-2">{player.name.split(" ")[0]}</span>
                  </td>
                  <td>{player.total_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
