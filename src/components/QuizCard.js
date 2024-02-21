import React from "react";

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
        <i class="fa-regular fa-eye btn"></i>
        <i class="fa-regular fa-trash-can btn"></i>
        <i class="fa-regular fa-share-from-square btn"></i>
      </div>
    </div>
  );
}
