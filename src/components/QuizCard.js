import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function QuizCard({ topic, difficultyLevel, type, questions }) {
  return (
    <div
      className="card text-bg-primary me-3 mb-3 shadow-lg"
      style={{ maxWidth: "18rem" }}
    >
      <h5 className="card-header">
        <strong>Topic: </strong>
        {topic}
      </h5>
      <div className="card-body">
        <div className="card-title">
          <strong>Difficulty level: </strong>
          {difficultyLevel}
        </div>
        <p className="card-text">
          <strong>Type: </strong>
          {type}
        </p>
        <p className="card-text">
          <strong>Number of questions: </strong>
          {questions.length}
        </p>
      </div>
      <div className="card-footer">
        <OverlayTrigger
          placement={"bottom"}
          overlay={
            <Tooltip id={`tooltip-bottom`}>
              <strong>Delete Quiz</strong>
            </Tooltip>
          }
        >
          <i className="fa-regular fa-trash-can btn"></i>
        </OverlayTrigger>

        <OverlayTrigger
          placement={"bottom"}
          overlay={
            <Tooltip id={`tooltip-bottom`}>
              <strong>Copy</strong>
            </Tooltip>
          }
        >
          <i className="fa-regular fa-share-from-square btn"></i>
        </OverlayTrigger>
      </div>
    </div>
  );
}
