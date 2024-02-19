import React from "react";
import { useState } from "react";
export default function Slider({ questionsType, questions }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  const goToNext = (event) => {
    if (questionIndex < questions.length - 1) {
      // increment questionsIndex
      setQuestionIndex(questionIndex + 1);
    }
  };
  const goToPrevious = (event) => {
    if (questionIndex > 0) {
      // decrement questionsIndex
      setQuestionIndex(questionIndex - 1);
    }
  };
  return (
    <div className="card mb-3" style={{ maxWidth: "540px" }}>
      <div className="card-body">
        <h5 className="card-title">{questions[questionIndex].question}</h5>
        <form onSubmit={(event) => handleSubmit(event)}>
          <fieldset>
            {questionsType === "MCQ" &&
              questions[questionIndex].options.map((option, index) => (
                <div className="form-check mb-3" key={index}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id={`flexRadioDefault${index}`}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`flexRadioDefault${index}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
            {questionsType === "MSQ" &&
              questions[questionIndex].options.map((option, index) => (
                <div className="form-check mb-3" key={index}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="flexRadioDefault"
                    id={`flexRadioDefault${index}`}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`flexRadioDefault${index}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
            {questionsType === "SAQ" ||
              questionsType === "LAQ" ||
              (questionsType === "NAT" && (
                <div className="form-floating mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Leave a comment here"
                    id="floatingTextarea2"
                    style={{ height: "100px" }}
                  ></textarea>
                  <label htmlFor="floatingTextarea2">Write your answer</label>
                </div>
              ))}
          </fieldset>
        </form>
      </div>
      <div className="card-footer d-flex justify-content-between">
        <i
          onClick={(event) => goToPrevious(event)}
          className="btn btn-outline-primary fs-3 fa-solid fa-angle-left"
        ></i>
        <i
          onClick={(event) => goToNext(event)}
          className="btn btn-outline-primary fs-3 fa-solid fa-angle-right"
        ></i>
      </div>
    </div>
  );
}
